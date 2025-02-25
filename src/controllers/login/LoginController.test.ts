
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
    it('Verifica se ocorreu erro ao extrair o token, deve retornar: "Error extracting token"', async () => {
       
        mockTokenService.extractToken.mockResolvedValue(null)

        await controller.registerUser(req as Request, res as Response)
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({message: "Error extracting token"})
    })

    it('Verifica se o usuário existe no banco de dados, deve retornar: "User already exists"', async () => {

        const date: Date = new Date(2025, 1, 24)
        mockTokenService.extractToken.mockResolvedValue({name:"Milena", email:"usuariaaceleradora@gmail.com", sub:"1568888", id:"1", provider:"google", accessToken:"kmmxddvbh", iat:4567, exp:5689, jti:"njjdkmk"})
        mockTokenService.findUserByEmail.mockResolvedValue({id:1, email:"usuariaaceleradora@gmail.com", provider:"google", loginDate:date})

        await controller.registerUser( req as Request, res as Response)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({message: "User already exists"})
    })
    
})
