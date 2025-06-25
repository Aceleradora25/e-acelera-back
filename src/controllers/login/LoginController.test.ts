import { Request, Response } from "express";
import { TokenService } from "../../services/TokenService";
import { LoginController } from "./LoginController";
import { STATUS_CODE } from "../../utils/constants";

jest.mock("../../services/TokenService");
let controller: LoginController;
let req: Partial<Request>;
let res: Partial<Response>;
let mockTokenService: jest.Mocked<TokenService>;

describe("LoginController - registerUser", () => {
  beforeEach(() => {
    mockTokenService = new TokenService() as jest.Mocked<TokenService>;

    controller = new LoginController();
    controller["tokenService"] = mockTokenService;

    req = {
      user: { 
        email: "test@gmail.com",
        id: 1
      },
      headers: { authorization: "Bearer eysncskwnsopmcsabuwsa" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Verifica se o token é expirado ou invalido, deve retornar: "Expired or invalid token"', async () => {
    req = { headers: { authorization: "eynkdsflmdnas" } };

    await controller.registerUser(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(STATUS_CODE.TOKEN_EXPIRED);
    expect(res.json).toHaveBeenCalledWith({
      message: "Expired or invalid token",
    });
  });

  it('Verifica se ocorreu erro ao extrair o token, deve retornar: "Error extracting token"', async () => {
    mockTokenService.extractToken.mockResolvedValue(null);

    await controller.registerUser(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(STATUS_CODE.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error extracting token",
    });
  });

  it('Verifica se o usuário existe no banco de dados, deve retornar: "User already exists"', async () => {
    const date: Date = new Date(2025, 1, 25);

    mockTokenService.extractToken.mockResolvedValue({
      name: "Milena",
      email: "usuariaaceleradora@gmail.com",
      sub: "1568888",
      id: "1",
      provider: "google",
      accessToken: "eysdnsdnsakns",
      iat: 4567,
      exp: 5689,
      jti: "njjdkmk",
    });

    mockTokenService.findUserByEmail.mockResolvedValue({
      id: 1,
      email: "usuariaaceleradora@gmail.com",
      provider: "google",
      loginDate: date,
    });

    await controller.registerUser(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(STATUS_CODE.OK);
    expect(res.json).toHaveBeenCalledWith({ message: "User already exists" });
  });

  it('Verifica se ocorreu um erro ao registrar o usuário, deve retornar: "Error registering user"', async () => {
    mockTokenService.extractToken.mockResolvedValue({
      name: "Milena",
      email: "usuariaaceleradora@gmail.com",
      sub: "1568888",
      id: "1",
      provider: "google",
      accessToken: "eysdnsdnsakns",
      iat: 4567,
      exp: 5689,
      jti: "njjdkmk",
    });

    mockTokenService.findUserByEmail.mockResolvedValue(null);

    mockTokenService.registerUser.mockResolvedValue(null);

    await controller.registerUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(STATUS_CODE.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error registering user",
    });
  });

  it('Verifica se ocorreu uma exceção ao criar usuário, deve retornar: "Error processing the created user"', async () => {
    mockTokenService.extractToken.mockRejectedValue(
      new Error("Error processing the created user")
    );

    await controller.registerUser(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(STATUS_CODE.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error processing the created user",
    });
  });

  it('Verifica se o usuário foi criado com sucesso , deve retornar: "User created successfully!"', async () => {
    const date: Date = new Date(2025, 1, 25);

    mockTokenService.extractToken.mockResolvedValue({
      name: "Milena",
      email: "usuariaaceleradora@gmail.com",
      sub: "1568888",
      id: "1",
      provider: "google",
      accessToken: "eysdnsdnsakns",
      iat: 4567,
      exp: 5689,
      jti: "njjdkmk",
    });

    mockTokenService.findUserByEmail.mockResolvedValue(null);

    mockTokenService.registerUser.mockResolvedValue({
      id: 2,
      email: "test@gmail.com",
      provider: "github",
      loginDate: date,
    });

    await controller.registerUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(STATUS_CODE.OK);
    expect(res.json).toHaveBeenCalledWith({
      message: "User created successfully!",
    });
  });
});
