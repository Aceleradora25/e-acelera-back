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

    it('should return "User not authenticated" if email doesn\'t exist', async () => {
        req.user = undefined

        await controller.getTopicExercisesStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: "User not authenticated" })
    })

    it('should return "User not found" if user doesn\'t exist', async () => {
        mockExerciseService.findUserByEmail.mockResolvedValue(null)

        await controller.getTopicExercisesStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ message: "User not found" })
    })

    it('should return "Progress not found" if no exercise status is found', async () => {
        mockExerciseService.findUserByEmail.mockResolvedValue({ id: 1, email:"teste@gmail.com" })
        mockExerciseService.getStatus.mockResolvedValue([])

        await controller.getTopicExercisesStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ message: "Progress not found" })
    })

    it('should return "Error processing the request" if an error occurs', async () => {
        mockExerciseService.findUserByEmail.mockRejectedValue(new Error("Internal error"))

        await controller.getTopicExercisesStatus(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: "Error processing the request" })
    })

    it('should return the list of exercise statuses when available', async () => {

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
