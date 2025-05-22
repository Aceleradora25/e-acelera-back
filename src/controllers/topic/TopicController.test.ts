import { Request, Response } from "express";
import { TopicController } from './TopicController';
import { STATUS_CODE } from "../../utils/constants";
import { TopicService } from "../../services/TopicService";

jest.mock("../../services/TopicService");
let controller: TopicController;
let req: Partial<Request>;
let res: Partial<Response>;
let mockTopicService: jest.Mocked<TopicService>;

describe("TopicController - getTopicProgress", () => {
  beforeEach(() => {
    mockTopicService = new TopicService() as jest.Mocked<TopicService>;

    controller = new TopicController();
    controller["topicService"] = mockTopicService;

    req = {
      params: { topicId: "1" },
      query: { totalItens: "12" },
      user: { email: "test@gmail.com" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar "User not authenticated" se o usuário não estiver autenticado', async () => {
    req.user = undefined;

    await controller.getTopicProgress(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(STATUS_CODE.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith({
      message: "User not authenticated",
    });
  });
  it('deve retornar "You must pass topicId as a regular param and totalItens type number greater than 0 as a query param." se não for passado o topicId', async () => {
    req.params = {};
    await controller.getTopicProgress(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      message: "You must pass topicId as a regular param and totalItens type number greater than 0 as a query param.",
    });
  });

  it('deve retornar "You must pass topicId as a regular param and totalItens type number greater than 0 as a query param." se não for passado o totalItens', async () => {
    req.query = {};
    await controller.getTopicProgress(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      message: "You must pass topicId as a regular param and totalItens type number greater than 0 as a query param.",
    });
  });

  it('deve retornar "You must pass topicId as a regular param and totalItens type number greater than 0 as a query param." se o totalItens não for um número', async () => {
    req.query = {
      totalItens: "1ab"
    };
    await controller.getTopicProgress(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      message: "You must pass topicId as a regular param and totalItens type number greater than 0 as a query param.",
    });
  });

  it('deve retornar "Error processing the request" se a promisse getTopicProgress for rejeitada', async () => {
    mockTopicService.getTopicProgress.mockRejectedValue(
      new Error("Internal server error")
    )
    await controller.getTopicProgress(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(STATUS_CODE.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error processing the request",
    });
  });

  it('deve retornar 0 se não houver itens do tópico específico vinculado ao usuário', async () => {
    mockTopicService.getTopicProgress.mockResolvedValue({ progress: 0 });
    await controller.getTopicProgress(req as Request, res as Response);

    expect(mockTopicService.getTopicProgress).toHaveBeenCalledWith({
      email: 'test@gmail.com',
      topicId: '1',
      totalItens: 12
    });
    expect(res.status).toHaveBeenCalledWith(STATUS_CODE.OK);
    expect(res.json).toHaveBeenCalledWith({ progress: 0 });
  });

  it('deve retornar o objeto { progress : value } com a porcentagem correta de progresso', async () => {
    mockTopicService.getTopicProgress.mockResolvedValue({ progress: 50 });
    await controller.getTopicProgress(req as Request, res as Response);

    expect(mockTopicService.getTopicProgress).toHaveBeenCalledWith({
      email: 'test@gmail.com',
      topicId: '1',
      totalItens: 12
    });
    expect(res.status).toHaveBeenCalledWith(STATUS_CODE.OK);
    expect(res.json).toHaveBeenCalledWith({ progress: 50 });
  });

  it('deve retornar 400 se totalItens for zero', async () => {
    req.params = { topicId: "1" };
    req.query = { totalItens: "0" };
    await controller.getTopicProgress(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      message: "You must pass topicId as a regular param and totalItens type number greater than 0 as a query param.",
    });
  });

  it('deve retornar 400 se totalItens for negativo', async () => {
    req.params = { topicId: "1" };
    req.query = { totalItens: "-5" };
    await controller.getTopicProgress(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      message: "You must pass topicId as a regular param and totalItens type number greater than 0 as a query param.",
    });
  });

  it('deve ignorar headers e ainda retornar progresso quando header ausente', async () => {
    delete (req as any).headers;
    mockTopicService.getTopicProgress.mockResolvedValue({ progress: 20 });
    await controller.getTopicProgress(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(STATUS_CODE.OK);
    expect(res.json).toHaveBeenCalledWith({ progress: 20 });
  });
});
