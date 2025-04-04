import { ExerciseController } from "./ExerciseController"
import { Request, Response } from "express"
import { ExerciseService } from "../../services/ExerciseService"
import { STATUS_CODE } from "../../utils/constants"

enum ItemStatus {
    Completed = "Completed",
    InProgress = "InProgress",
    NotStarted = "NotStarted",
}

enum ElementType {
    Exercise = "Exercise",
    Video = "Video",
}

jest.mock("../../services/ExerciseService")
let controller: ExerciseController
let req: Partial<Request>
let res: Partial<Response>
let mockExerciseService: jest.Mocked<ExerciseService>

describe('ExerciseController - updateExerciseStatus', () => {

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

        expect(res.status).toHaveBeenCalledWith(STATUS_CODE.UNAUTHORIZED)
        expect(res.json).toHaveBeenCalledWith({ message: "User not authenticated" })
    })

    it('deve retornar "User not found" se o usuário não for encontrado', async () => {
        mockExerciseService.findUserByEmail.mockResolvedValue(null)

        await controller.updateExerciseStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(STATUS_CODE.NOT_FOUND)
        expect(res.json).toHaveBeenCalledWith({ message: "User not found" })
    })

    it('deve retornar "Invalid or missing status value" se o status for inválido', async () => {
        const date: Date = new Date(2025, 1, 24)

        mockExerciseService.findUserByEmail.mockResolvedValue({ id: 1, email: "teste@gmail.com", provider: "google", loginDate: date });

        mockExerciseService.validateStatus.mockResolvedValue(false)

        await controller.updateExerciseStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST)
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid or missing status value." })
    })

    it('deve retornar "Progress record not found for user 1 and item 1, 1" se o progresso não for encontrado', async () => {
        const date: Date = new Date(2025, 1, 24)

        mockExerciseService.findUserByEmail.mockResolvedValue({ id: 1, email: "teste@gmail.com", provider: "google", loginDate: date });

        mockExerciseService.validateStatus.mockResolvedValue(true)

        mockExerciseService.findProgress.mockRejectedValue(new Error("Progress record not found for user 1 and item 1, 1."));

        await controller.updateExerciseStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST)
        expect(res.json).toHaveBeenCalledWith({ message: "Progress record not found for user 1 and item 1, 1." })
    })

    it('deve retornar "The status is already up to date" se o status já estiver atualizado', async () => {

        const date: Date = new Date(2025, 1, 24)

        mockExerciseService.findUserByEmail.mockResolvedValue({ id: 1, email: "teste@gmail.com", provider: "google", loginDate: date });

        mockExerciseService.validateStatus.mockResolvedValue(true)

        mockExerciseService.findProgress.mockResolvedValue({ id: 1, itemId: "rw12346789", itemStatus: "NotStarted", elementType: "Exercise", topicId: "rw987654321", userId: 1 });

        await controller.updateExerciseStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(STATUS_CODE.OK)
        expect(res.json).toHaveBeenCalledWith({ message: "Status value is already being used" })
    })

    it('deve retornar o progresso atualizado ao mudar o status', async () => {
        const date: Date = new Date(2025, 1, 24)

        mockExerciseService.findUserByEmail.mockResolvedValue({ id: 1, email: "teste@gmail.com", provider: "google", loginDate: date });

        mockExerciseService.validateStatus.mockResolvedValue(true);

        mockExerciseService.findProgress.mockResolvedValue({ id: 1, itemId: "rw12346789", itemStatus: "InProgress", elementType: "Exercise", topicId: "rw987654321", userId: 1 });

        const progress = [{ id: 1, itemId: "rw12346789", itemStatus: ItemStatus.NotStarted, elementType: ElementType.Exercise, userId: 1 }]

        mockExerciseService.updatedProgress.mockResolvedValue(progress);

        await controller.updateExerciseStatus(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(STATUS_CODE.OK);
        expect(res.json).toHaveBeenCalledWith(progress);
    });

    it('deve retornar "Internal server error while processing the request" em caso de erro no servidor', async () => {
        const date: Date = new Date(2025, 1, 24)

        mockExerciseService.findUserByEmail.mockResolvedValue({ id: 1, email: "teste@gmail.com", provider: "google", loginDate: date });
        mockExerciseService.validateStatus.mockResolvedValue(true)

        mockExerciseService.findProgress.mockRejectedValue(new Error("Internal server error"));

        await controller.updateExerciseStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(STATUS_CODE.INTERNET_SERVER_ERROR)
        expect(res.json).toHaveBeenCalledWith({ message: "Internal server error while processing the request" })
    })

})

describe('ExerciseController - getTopicExercisesStatus', () => {

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

        expect(res.status).toHaveBeenCalledWith(STATUS_CODE.UNAUTHORIZED)
        expect(res.json).toHaveBeenCalledWith({ message: "User not authenticated" })
    })

    it("deve retornar 'Usuário não encontrado' se o usuário não existir", async () => {
        mockExerciseService.findUserByEmail.mockResolvedValue(null)

        await controller.getTopicExercisesStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ message: "User not found" })
    })

    it("deve retornar 'Progresso não encontrado' se o status do exercício não for encontrado", async () => {
        const date: Date = new Date(2025, 1, 24)

        mockExerciseService.findUserByEmail.mockResolvedValue({ id: 1, email: "teste@gmail.com", provider: "google", loginDate: date })
        mockExerciseService.getStatus.mockResolvedValue([])

        await controller.getTopicExercisesStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(STATUS_CODE.NOT_FOUND)
        expect(res.json).toHaveBeenCalledWith({ message: "Progress not found" })
    })

    it("deve retornar 'Erro ao processar a solicitação' se ocorrer um erro", async () => {
        mockExerciseService.findUserByEmail.mockRejectedValue(new Error("Internal error"))

        await controller.getTopicExercisesStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(STATUS_CODE.INTERNET_SERVER_ERROR)
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

        const date: Date = new Date(2025, 1, 24)

        mockExerciseService.findUserByEmail.mockResolvedValue({ id: 1, email: "teste@gmail.com", provider: "google", loginDate: date })
        mockExerciseService.getStatus.mockResolvedValue(statusList)

        await controller.getTopicExercisesStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(STATUS_CODE.OK)
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

        expect(res.status).toHaveBeenCalledWith(STATUS_CODE.UNAUTHORIZED)
        expect(res.json).toHaveBeenCalledWith({ message: "User not authenticated" })
    })

    it("deve retornar 'Usuário não encontrado' se o usuário não existir", async () => {
        mockExerciseService.findUserByEmail.mockResolvedValue(null)

        await controller.getExerciseStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(STATUS_CODE.NOT_FOUND)
        expect(res.json).toHaveBeenCalledWith({ message: "User not found" })
    })

    it("deve retornar 'itemId não encontrado' se o itemId não existir", async () => {

        req.params = { ...req.params, itemId: "" }
        const date: Date = new Date(2025, 1, 24)

        mockExerciseService.findUserByEmail.mockResolvedValue({ id: 1, email: "teste@gmail.com", provider: "google", loginDate: date })
        mockExerciseService.exerciseStatus.mockResolvedValue([])

        await controller.getExerciseStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(STATUS_CODE.NOT_FOUND)
        expect(res.json).toHaveBeenCalledWith({ message: "itemId not found" })
    })

    it("deve retornar 'topicId não encontrado' se o topicId não existir", async () => {

        req.params = { ...req.params, topicId: "" }

        const date: Date = new Date(2025, 1, 24)

        mockExerciseService.findUserByEmail.mockResolvedValue({ id: 1, email: "teste@gmail.com", provider: "google", loginDate: date })
        mockExerciseService.exerciseStatus.mockResolvedValue([])

        await controller.getExerciseStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST)
        expect(res.json).toHaveBeenCalledWith({ message: "topicId not found" })
    })

    it("deve retornar 'topicId inválido' se o topicId for inválido", async () => {

        req.params = { ...req.params, topicId: "rw1726148766181e6da" }


        const date: Date = new Date(2025, 1, 24)

        mockExerciseService.findUserByEmail.mockResolvedValue({ id: 1, email: "teste@gmail.com", provider: "google", loginDate: date })
        mockExerciseService.findTopicById.mockResolvedValue(null)

        await controller.getExerciseStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(STATUS_CODE.NOT_FOUND)
        expect(res.json).toHaveBeenCalledWith({ message: "topicId invalid" })
    })

    it("deve retornar 'status não encontrado' se o status não for encontrado", async () => {

        const topicValidation: { id: number; itemId: string; elementType: ElementType; userId: number; itemStatus: ItemStatus; topicId: string } = {
            id: 1,
            itemId: "rw1726148766181e6dab5",
            elementType: ElementType.Exercise,
            userId: 1,
            itemStatus: ItemStatus.Completed,
            topicId: "rw17212367802520ba251"
        }

        const date: Date = new Date(2025, 1, 24)

        mockExerciseService.findUserByEmail.mockResolvedValue({ id: 1, email: "teste@gmail.com", provider: "google", loginDate: date })
        mockExerciseService.findTopicById.mockResolvedValue(topicValidation)
        mockExerciseService.exerciseStatus.mockResolvedValue([])

        await controller.getExerciseStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(STATUS_CODE.NOT_FOUND)
        expect(res.json).toHaveBeenCalledWith({ message: "Status not found" })
    })

    it("deve retornar 'Erro ao processar a solicitação' se ocorrer um erro", async () => {
        mockExerciseService.findUserByEmail.mockRejectedValue(new Error("Internal error"))

        await controller.getExerciseStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(STATUS_CODE.INTERNET_SERVER_ERROR)
        expect(res.json).toHaveBeenCalledWith({ message: "Error processing the request" })
    })

    it("deve retornar um objeto com itemStatus e itemId quando disponível", async () => {

        const topicValidation: { id: number; itemId: string; elementType: ElementType; userId: number; itemStatus: ItemStatus; topicId: string } = {
            id: 1,
            itemId: "rw1726148766181e6dab5",
            elementType: ElementType.Exercise,
            userId: 1,
            itemStatus: ItemStatus.Completed,
            topicId: "rw17212367802520ba251"
        }

        const exerciseSuccess: { itemStatus: ItemStatus; itemId: string }[] = [{

            itemStatus: ItemStatus.InProgress,
            itemId: "rw1726148766181e6dab5"
        }]

        const date: Date = new Date(2025, 1, 24)

        mockExerciseService.findUserByEmail.mockResolvedValue({ id: 1, email: "teste@gmail.com", provider: "google", loginDate: date })
        mockExerciseService.findTopicById.mockResolvedValue(topicValidation)
        mockExerciseService.exerciseStatus.mockResolvedValue(exerciseSuccess)

        await controller.getExerciseStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(STATUS_CODE.OK)
        expect(res.json).toHaveBeenCalledWith(exerciseSuccess)
    })
})
