import { ExerciseController } from "./ExerciseController"
import { Request, Response } from "express"
import { ExerciseService } from "../services/ExerciseService"

enum ItemStatus {
    Completed = "Completed",
    InProgress = "InProgress",
    NotStarted = "NotStarted",
}

enum ElementType {
    Exercise = "Exercise",
    Video = "Video",
}

jest.mock("../services/ExerciseService")

let controller: ExerciseController
let req: Partial<Request>
let res: Partial<Response>
let mockExerciseService: jest.Mocked<ExerciseService>
describe("ExerciseController - getTopicExercisesStatus", () => {
    
    beforeEach(() => {
        mockExerciseService = new ExerciseService() as jest.Mocked<ExerciseService>

        controller = new ExerciseController()
        controller["exerciseService"] = mockExerciseService

        req = { params: { topicId: "1" }, user: { email: "test@gmail.com" } }
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
    })

    it("deve retornar 'Usuário não autenticado' se o email não existir", async () => {
        req.user = undefined

        await controller.getTopicExercisesStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: "User not authenticated" })
    })

    it("deve retornar 'Usuário não encontrado' se o usuário não existir", async () => {
        mockExerciseService.findUserByEmail.mockResolvedValue(null)

        await controller.getTopicExercisesStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ message: "User not found" })
    })

    it("deve retornar 'Progresso não encontrado' se o status do exercício não for encontrado", async () => {
        mockExerciseService.findUserByEmail.mockResolvedValue({ id: 1, email:"teste@gmail.com" })
        mockExerciseService.getStatus.mockResolvedValue([])

        await controller.getTopicExercisesStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ message: "Progress not found" })
    })

    it("deve retornar 'Erro ao processar a solicitação' se ocorrer um erro", async () => {
        mockExerciseService.findUserByEmail.mockRejectedValue(new Error("Internal error"))

        await controller.getTopicExercisesStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: "Error processing the request" })
    })

    it("deve retornar a lista de status dos exercícios quando disponível", async () => {

        const statusList: {
            itemId: string;
            itemStatus: ItemStatus;
            elementType: ElementType;
        }[] = [
            { itemId: "1", itemStatus: ItemStatus.Completed, elementType: ElementType.Exercise },
        ]

        mockExerciseService.findUserByEmail.mockResolvedValue({ id: 1, email: "teste@gmail.com" })
        mockExerciseService.getStatus.mockResolvedValue(statusList)

        await controller.getTopicExercisesStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(statusList)
    })
   
})

describe("ExerciseController - getExerciseStatus", () => {
   
    beforeEach(() => {
        mockExerciseService = new ExerciseService() as jest.Mocked<ExerciseService>
    
        controller = new ExerciseController()
        controller["exerciseService"] = mockExerciseService
    
        req = { params: { topicId: "1", itemId: "2" }, user: { email: "teste@gmail.com" }, } 
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } 
    })
    
    it("deve retornar 'Usuário não autenticado' se o email não existir", async () => {
        req.user = undefined

        await controller.getExerciseStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: "User not authenticated" })
    })    

    it("deve retornar 'Usuário não encontrado' se o usuário não existir", async () => {
        mockExerciseService.findUserByEmail.mockResolvedValue(null)

        await controller.getExerciseStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ message: "User not found" })
    })

    it("deve retornar 'itemId não encontrado' se o itemId não existir", async () => {
        
        req.params = { ...req.params, itemId: "" }
        
        mockExerciseService.findUserByEmail.mockResolvedValue({ id: 1, email: "teste@gmail.com" })
        mockExerciseService.exerciseStatus.mockResolvedValue([])
        
        await controller.getExerciseStatus(req as Request, res as Response)
        
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ message: "itemId not found" })
    })

    it("deve retornar 'topicId não encontrado' se o topicId não existir", async () => {
        
        req.params = { ...req.params, topicId: "" }
        
        mockExerciseService.findUserByEmail.mockResolvedValue({ id: 1, email: "teste@gmail.com" })
        mockExerciseService.exerciseStatus.mockResolvedValue([])
        
        await controller.getExerciseStatus(req as Request, res as Response)
        
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ message: "topicId not found" })
    })

    it("deve retornar 'topicId inválido' se o topicId for inválido", async () => {
        
        req.params = { ...req.params, topicId: "rw1726148766181e6da" }

        
        mockExerciseService.findUserByEmail.mockResolvedValue({ id: 1, email: "teste@gmail.com" })
        mockExerciseService.findTopicById.mockResolvedValue(null)
        
        await controller.getExerciseStatus(req as Request, res as Response)
        
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ message: "topicId invalid" })
    })

    it("deve retornar 'status não encontrado' se o status não for encontrado", async () => {
        
        const topicValidation: {id: number; itemId: string; elementType: ElementType; userId: number; itemStatus: ItemStatus; topicId: string} = {
            id: 1,
            itemId: "rw1726148766181e6dab5",
            elementType: ElementType.Exercise,
            userId: 1,
            itemStatus: ItemStatus.Completed,
            topicId: "rw17212367802520ba251"
            }
        
        mockExerciseService.findUserByEmail.mockResolvedValue({ id: 1, email: "teste@gmail.com" })
        mockExerciseService.findTopicById.mockResolvedValue(topicValidation)
        mockExerciseService.exerciseStatus.mockResolvedValue([])
        
        await controller.getExerciseStatus(req as Request, res as Response)
        
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ message: "Status not found" })
    })

    it("deve retornar 'Erro ao processar a solicitação' se ocorrer um erro", async () => {
        mockExerciseService.findUserByEmail.mockRejectedValue(new Error("Internal error"))

        await controller.getExerciseStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: "Error processing the request" })
    })

    it("deve retornar um objeto com itemStatus e itemId quando disponível", async () => {
        
        const topicValidation: {id: number; itemId: string; elementType: ElementType; userId: number; itemStatus: ItemStatus; topicId: string} = {
            id: 1,
            itemId: "rw1726148766181e6dab5",
            elementType: ElementType.Exercise,
            userId: 1,
            itemStatus: ItemStatus.Completed,
            topicId: "rw17212367802520ba251"
            }

        const exerciseSuccess: { itemStatus: ItemStatus; itemId: string } [] = [{
            
            itemStatus: ItemStatus.InProgress,
            itemId: "rw1726148766181e6dab5"
        }]

        mockExerciseService.findUserByEmail.mockResolvedValue({ id: 1, email: "teste@gmail.com" })
        mockExerciseService.findTopicById.mockResolvedValue(topicValidation)
        mockExerciseService.exerciseStatus.mockResolvedValue(exerciseSuccess)
        
        await controller.getExerciseStatus(req as Request, res as Response)
        
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(exerciseSuccess)
    })
})
