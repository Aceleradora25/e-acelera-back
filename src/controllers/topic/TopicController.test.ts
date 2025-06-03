import { Request, Response } from "express";
import { STATUS_CODE } from './../../utils/constants';
import { TopicService } from './../../services/topic/TopicService';
import { TopicController } from './TopicController';
import { UserService } from './../../services/UserService';

jest.mock("../../services/topic/TopicService");
jest.mock("../../services/UserService");

describe("TopicController - getTopicProgress", () => {
  let controller: TopicController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let mockTopicService: jest.Mocked<TopicService>;
  let mockUserService: jest.Mocked<UserService>;

  beforeEach(() => {
    mockTopicService = new TopicService() as jest.Mocked<TopicService>;
    mockUserService = new UserService() as jest.Mocked<UserService>;

    controller = new TopicController();
    controller["topicService"] = mockTopicService;
    controller["userService"] = mockUserService;

    req = {
      params: { topicId: "1" },
      query: { totalItens: "12" },
      user: { email: "test@gmail.com" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockUserService.findUserByEmail.mockResolvedValue({ 
      id: 123,
      email: "test@gmail.com",
      provider: "google",
      loginDate: new Date(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar 401 se o usuário não estiver autenticado", async () => {
    req.user = undefined;
    await controller.getTopicProgress(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(STATUS_CODE.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith({ message: "User not authenticated" });
  });

  it("deve retornar 400 se faltarem params ou query inválida", async () => {
    req.params = {};
    await controller.getTopicProgress(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);

    req.params = { topicId: "1" };
    req.query = {};
    await controller.getTopicProgress(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);

    req.query = { totalItens: "1ab" };
    await controller.getTopicProgress(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);

    req.query = { totalItens: "-5" };
    await controller.getTopicProgress(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
  });

  it("deve retornar 500 em erro interno do service", async () => {
    mockTopicService.getTopicProgress.mockRejectedValue(new Error("err"));
    await controller.getTopicProgress(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(STATUS_CODE.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ message: "Error processing the request" });
  });

  it("deve retornar 200 e o progresso quando tudo OK", async () => { 
    mockTopicService.getTopicProgress.mockResolvedValue({ progress: 75 })
    await controller.getTopicProgress(req as Request, res as Response);

    expect(mockUserService.findUserByEmail).toHaveBeenCalledWith("test@gmail.com");
    
    expect(res.status).toHaveBeenCalledWith(STATUS_CODE.OK);
    expect(res.json).toHaveBeenCalledWith({ progress: 75 });
  });
});
