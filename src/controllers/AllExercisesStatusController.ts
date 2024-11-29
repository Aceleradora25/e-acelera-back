import { Response, Request } from "express"
import { AllExercisesStatusService } from "../services/AllExercisesStatusService"

export class AllExercisesStatusController {
    private getAllExercisesStatusService: AllExercisesStatusService

    constructor() {
        this.getAllExercisesStatusService = new AllExercisesStatusService()
    }

    async getTopicExercisesStatus(req: Request, res: Response) {
        const email = req.user?.email
        const { topicId } = req.params

        try {
            if (!email) {
                return res.status(401).json({ message: "User not authenticated" })
            }

            const user = await this.getAllExercisesStatusService.findUserByEmail(email)

            if (!user) {
                return res.status(404).json({ message: "User not found" })
            }

            const getAllExercisesStatus = await this.getAllExercisesStatusService.getStatus(user.id, topicId)

            if (getAllExercisesStatus.length === 0) {
                return res.status(404).json({ message: "Progress not found" })
            }

            return res.status(200).json(getAllExercisesStatus)

        } catch (error: any) {
            return res.status(500).json({ message: "Error processing the request" })
        }
    }

}