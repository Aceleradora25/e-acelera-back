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

describe('ExerciseController - updateExerciseStatus', () => {
    let controller: ExerciseController
    let req: Partial<Request>
    let res: Partial<Response>
    let mockExerciseService: jest.Mocked<ExerciseService>

    beforeEach(() => {
        mockExerciseService = new ExerciseService() as jest.Mocked<ExerciseService>

        controller = new ExerciseController()
        controller['exerciseService'] = mockExerciseService

        req = { params: { topicId: "1", itemId: "1" }, body: { itemStatus: "NotStarted" }, user: { email: "test@gmail.com" } }
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
    })

    it('deve retornar "User not authenticated" se o usuário não estiver autenticado', async () => {
        req.user = undefined

        await controller.updateExerciseStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: "User not authenticated." })
    })

    it('deve retornar "User not found" se o usuário não for encontrado', async () => {
        mockExerciseService.findUserByEmail.mockResolvedValue(null)
        
        await controller.updateExerciseStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ message: "User not found." })
    })

    it('deve retornar "Invalid or missing status value" se o status for inválido', async () => {
        mockExerciseService.findUserByEmail.mockResolvedValue({ id: 1, email: "teste@gmail.com" });

        mockExerciseService.validateStatus.mockResolvedValue(false)
        
        await controller.updateExerciseStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid or missing status value." })
    })

    it('deve retornar "Progress record not found for user 1 and item 1, 1" se o progresso não for encontrado', async () => {
        mockExerciseService.findUserByEmail.mockResolvedValue({ id: 1, email: "teste@gmail.com" });

        mockExerciseService.validateStatus.mockResolvedValue(true)

        mockExerciseService.findProgress.mockRejectedValue(new Error("Progress record not found for user 1 and item 1, 1."));
        
        await controller.updateExerciseStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ message: "Progress record not found for user 1 and item 1, 1." })
    })

    it('deve retornar "The status is already up to date" se o status já estiver atualizado', async () => {

        mockExerciseService.findUserByEmail.mockResolvedValue({ id: 1, email: "teste@gmail.com" });

        mockExerciseService.validateStatus.mockResolvedValue(true)

        mockExerciseService.findProgress.mockResolvedValue({ id: 1, itemId: "rw12346789", itemStatus: "NotStarted", elementType: "Exercise", topicId: "rw987654321", userId: 1 });

        await controller.updateExerciseStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ message: "The status is already up to date." })
    })

    it('deve retornar o progresso atualizado ao mudar o status', async () => {
        mockExerciseService.findUserByEmail.mockResolvedValue({ id: 1, email: "teste@gmail.com" });

        mockExerciseService.validateStatus.mockResolvedValue(true);

        mockExerciseService.findProgress.mockResolvedValue({ id: 1, itemId: "rw12346789", itemStatus: "InProgress", elementType: "Exercise", topicId: "rw987654321", userId: 1 });

        mockExerciseService.updatedProgress.mockResolvedValue([{ id: 1, itemId: "rw12346789", itemStatus: "NotStarted", elementType: "Exercise", userId: 1 }]);

        await controller.updateExerciseStatus(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ id: 1, itemId: "rw12346789", itemStatus: "NotStarted", elementType: "Exercise", userId: 1 }]);
    });

    it('deve retornar "Internal server error while processing the request" em caso de erro no servidor', async () => {
        mockExerciseService.findUserByEmail.mockResolvedValue({ id: 1, email: "teste@gmail.com" });
        mockExerciseService.validateStatus.mockResolvedValue(true)
        
        mockExerciseService.findProgress.mockRejectedValue(new Error("Internal server error"));
    
        await controller.updateExerciseStatus(req as Request, res as Response)
    
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: "Internal server error while processing the request." })
    })

})

describe('ExerciseController - getTopicExercisesStatus', () => {
    let controller: ExerciseController
    let req: Partial<Request>
    let res: Partial<Response>
    let mockExerciseService: jest.Mocked<ExerciseService>

    beforeEach(() => {
        mockExerciseService = new ExerciseService() as jest.Mocked<ExerciseService>

        controller = new ExerciseController()
        controller['exerciseService'] = mockExerciseService

        req = { params: { topicId: "1" }, user: { email: "test@gmail.com" } }
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
    })

    it('deve retornar "Usuário não autenticado" se o email não existir', async () => {
        req.user = undefined

        await controller.getTopicExercisesStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: "User not authenticated" })
    })

    it('deve retornar "Usuário não encontrado" se o usuário não existir', async () => {
        mockExerciseService.findUserByEmail.mockResolvedValue(null)

        await controller.getTopicExercisesStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ message: "User not found" })
    })

    it('deve retornar "Progresso não encontrado" se o status do exercício não for encontrado', async () => {
        mockExerciseService.findUserByEmail.mockResolvedValue({ id: 1, email:"teste@gmail.com" })
        mockExerciseService.getStatus.mockResolvedValue([])

        await controller.getTopicExercisesStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ message: "Progress not found" })
    })

    it('deve retornar "Erro ao processar a solicitação" se ocorrer um erro', async () => {
        mockExerciseService.findUserByEmail.mockRejectedValue(new Error("Internal error"))

        await controller.getTopicExercisesStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: "Error processing the request" })
    })

    it('deve retornar a lista de status dos exercícios quando disponível', async () => {

        const statusList: {
            itemId: string;
            itemStatus: ItemStatus;
            elementType: ElementType;
        }[] = [
            { itemId: "1", itemStatus: ItemStatus.Completed, elementType: ElementType.Exercise },
        ];

        mockExerciseService.findUserByEmail.mockResolvedValue({ id: 1, email: "teste@gmail.com" })
        mockExerciseService.getStatus.mockResolvedValue(statusList)

        await controller.getTopicExercisesStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(statusList)
    })
})
