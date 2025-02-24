
import { Request, Response } from "express"
import { TokenService } from "../../services/TokenService"
import { LoginController } from "./LoginController"

jest.mock("../../services/TokenService")
let controller: LoginController
let req: Partial<Request>
let res: Partial<Response>
let mockTokenService: jest.Mocked<TokenService>

describe('LoginController - registerUser', () => {

    beforeEach(() => {
        mockTokenService = new TokenService() as jest.Mocked<TokenService>

        controller = new LoginController()
        controller['tokenService'] = mockTokenService

        req = {user: { email: "test@gmail.com" }, headers: {authorization: "Bearer algo2"} }
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
    })
    it('Verifica se o token é invalido ou expirado, deve retornar: "Expired or invalid token"', async () => {
        req =  {headers: {authorization: "kaaa"}}

        await controller.registerUser(req as Request, res as Response)
        expect(res.status).toHaveBeenCalledWith(498)
        expect(res.json).toHaveBeenCalledWith({ message: "Expired or invalid token" })
    })
})
