import { TokenService } from "../../services/TokenService.js";
import { STATUS_CODE } from "../../utils/constants.js";
import { LoginController } from "./LoginController.js";
jest.mock("../../services/TokenService");
let controller;
let req;
let res;
let mockTokenService;
describe("LoginController - registerUser", () => {
    beforeEach(() => {
        mockTokenService = new TokenService();
        controller = new LoginController();
        controller["tokenService"] = mockTokenService;
        req = {
            headers: { authorization: "Bearer eysncskwnsopmcsabuwsa" },
            user: {
                email: "test@gmail.com",
                id: 1,
            },
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('Verifica se o token é expirado ou invalido, deve retornar: "Expired or invalid token"', async () => {
        req = { headers: { authorization: "eynkdsflmdnas" } };
        await controller.registerUser(req, res);
        expect(res.status).toHaveBeenCalledWith(STATUS_CODE.TOKEN_EXPIRED);
        expect(res.json).toHaveBeenCalledWith({
            message: "Expired or invalid token",
        });
    });
    it('Verifica se ocorreu erro ao extrair o token, deve retornar: "Error extracting token"', async () => {
        mockTokenService.extractToken.mockResolvedValue(null);
        await controller.registerUser(req, res);
        expect(res.status).toHaveBeenCalledWith(STATUS_CODE.INTERNAL_SERVER_ERROR);
        expect(res.json).toHaveBeenCalledWith({
            message: "Error extracting token",
        });
    });
    it('Verifica se o usuário existe no banco de dados, deve retornar: "User already exists"', async () => {
        const date = new Date(2025, 1, 25);
        mockTokenService.extractToken.mockResolvedValue({
            accessToken: "eysdnsdnsakns",
            email: "usuariaaceleradora@gmail.com",
            exp: 5689,
            iat: 4567,
            id: "1",
            jti: "njjdkmk",
            name: "Milena",
            provider: "google",
            sub: "1568888",
        });
        mockTokenService.findUserByEmail.mockResolvedValue({
            email: "usuariaaceleradora@gmail.com",
            id: 1,
            loginDate: date,
            provider: "google",
        });
        await controller.registerUser(req, res);
        expect(res.status).toHaveBeenCalledWith(STATUS_CODE.OK);
        expect(res.json).toHaveBeenCalledWith({ message: "User already exists" });
    });
    it('Verifica se ocorreu um erro ao registrar o usuário, deve retornar: "Error registering user"', async () => {
        mockTokenService.extractToken.mockResolvedValue({
            accessToken: "eysdnsdnsakns",
            email: "usuariaaceleradora@gmail.com",
            exp: 5689,
            iat: 4567,
            id: "1",
            jti: "njjdkmk",
            name: "Milena",
            provider: "google",
            sub: "1568888",
        });
        mockTokenService.findUserByEmail.mockResolvedValue(null);
        mockTokenService.registerUser.mockResolvedValue(null);
        await controller.registerUser(req, res);
        expect(res.status).toHaveBeenCalledWith(STATUS_CODE.INTERNAL_SERVER_ERROR);
        expect(res.json).toHaveBeenCalledWith({
            message: "Error registering user",
        });
    });
    it('Verifica se ocorreu uma exceção ao criar usuário, deve retornar: "Error processing the created user"', async () => {
        mockTokenService.extractToken.mockRejectedValue(new Error("Error processing the created user"));
        await controller.registerUser(req, res);
        expect(res.status).toHaveBeenCalledWith(STATUS_CODE.INTERNAL_SERVER_ERROR);
        expect(res.json).toHaveBeenCalledWith({
            message: "Error processing the created user",
        });
    });
    it('Verifica se o usuário foi criado com sucesso , deve retornar: "User created successfully!"', async () => {
        const date = new Date(2025, 1, 25);
        mockTokenService.extractToken.mockResolvedValue({
            accessToken: "eysdnsdnsakns",
            email: "usuariaaceleradora@gmail.com",
            exp: 5689,
            iat: 4567,
            id: "1",
            jti: "njjdkmk",
            name: "Milena",
            provider: "google",
            sub: "1568888",
        });
        mockTokenService.findUserByEmail.mockResolvedValue(null);
        mockTokenService.registerUser.mockResolvedValue({
            email: "test@gmail.com",
            id: 2,
            loginDate: date,
            provider: "github",
        });
        await controller.registerUser(req, res);
        expect(res.status).toHaveBeenCalledWith(STATUS_CODE.OK);
        expect(res.json).toHaveBeenCalledWith({
            message: "User created successfully!",
        });
    });
});
