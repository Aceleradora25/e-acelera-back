import { Response, Request } from "express"
import { ExerciseService } from "../../services/ExerciseService"

export class ExerciseController {
    private exerciseService: ExerciseService

    constructor() {
        this.exerciseService = new ExerciseService()
    }

    async updateExerciseStatus(req: Request, res: Response) {
        const { itemId } = req.params
        const { topicId } = req.params
        const { itemStatus } = req.body
        const email = req.user?.email

        try {
            if (!email) {
                return res.status(401).json({ message: "User not authenticated" })
            }
    
            const user = await this.exerciseService.findUserByEmail(email)
    
            if (!user) {
                return res.status(404).json({ message: "User not found" })
            }

            if (! await this.exerciseService.validateStatus(itemStatus)) {
                return res.status(400).json({ message: "Invalid or missing status value." })
            }

    
            const currentProgress = await this.exerciseService.findProgress(user.id, itemId, topicId)
    
            if (!currentProgress) {
                return res.status(404).json({ message: "Progress not found for the exercise" })
            }
    
            if (currentProgress.itemStatus === itemStatus) {
                return res.status(200).json({ message: "Status value is already being used" });
            }

            const updatedProgress = await this.exerciseService.updatedProgress(user.id, itemId, itemStatus, topicId)

            return res.status(200).json(updatedProgress)

        } catch (error: any) {
            if (error.message.includes("not found") || error.message.includes("Invalid")) {
                return res.status(400).json({ message: error.message })
            }
            console.error(`Error in updateExerciseStatus: ${error.message}`)
            return res.status(500).json({ message: "Internal server error while processing the request" })
        }
    }

    async getTopicExercisesStatus(req: Request, res: Response) {
        const email = req.user?.email
        const { topicId } = req.params

        try {
            if (!email) {
                return res.status(401).json({ message: "User not authenticated" })
            }

            const user = await this.exerciseService.findUserByEmail(email)

            if (!user) {
                return res.status(404).json({ message: "User not found" })
            }

            const getAllExercisesStatus = await this.exerciseService.getStatus(user.id, topicId)

            if (getAllExercisesStatus.length === 0) {
                return res.status(404).json({ message: "Progress not found" })
            }

            return res.status(200).json(getAllExercisesStatus)

        } catch (error: any) {
            return res.status(500).json({ message: "Error processing the request" })
        }
    }
    async getExerciseStatus(req: Request, res: Response){
        const { itemId, topicId } = req.params
        const email = req.user?.email
    
    try {
        if (!email){
            return res.status(401).json({ message: "User not authenticated" })
        }
          const user = await this.exerciseService.findUserByEmail(email)

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        if (!itemId){
            return res.status(404).json({ message: "itemId not found" })
        }

        if (!topicId) {
            return res.status(400).json({ message: "topicId not found" })
        }

        const topicExists = await this.exerciseService.findTopicById(topicId)
        if (!topicExists) {
            return res.status(404).json({ message: "topicId invalid" })
        }

        const exerciseStatus = await this.exerciseService.exerciseStatus(user.id, itemId, topicId)
        
        if (exerciseStatus.length === 0){
            return res.status(404).json({ message: "Status not found"})
        }
        return res.status(200).json(exerciseStatus)

    } catch (error: any) {
        return res.status(500).json({ message: "Error processing the request" })
    }
}
}

