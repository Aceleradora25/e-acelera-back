import { Response, Request } from "express";
import { AllExercisesService } from "../services/AllExercisesService";

export class AllExercisesController {
    private getAllService: AllExercisesService

    constructor() {
        this.getAllService = new AllExercisesService()
    }

    async getAllStatus(req: Request, res: Response) {
        const email = req.user?.email
        const { topicId } = req.params;

        try {
            if (!email) {
                return res.status(401).json({ message: "User not authenticated" });
            }

            const user = await this.getAllService.findUserByEmail(email)

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const getAllStatus = await this.getAllService.getStatus(user.id, topicId);

            return res.status(200).json(getAllStatus);

        } catch (error: any) {
            return res.status(500).json({ message: "Error processing the request" });
        }
    }

}