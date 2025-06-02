import { Response, Request } from "express"
import { ThemeService } from "../../services/ThemeService"
import { ExerciseService } from "../../services/ExerciseService"
import { STATUS_CODE } from "../../utils/constants"

export class ThemeController {
  private themeService: ThemeService
  private exerciseService: ExerciseService;

  constructor() {
    this.themeService = new ThemeService();
    this.exerciseService = new ExerciseService();
  }

  async getThemeProgress(req: Request, res: Response) {
    const { themeId } = req.params;
    const email = req.user?.email;
    
    try {
      if (!themeId) {
        return res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ message: "You must pass themeId as a param.",});
      }

      const topics = await this.themeService.getThemeProgress(themeId)

      if (!email) {
        return res
          .status(STATUS_CODE.UNAUTHORIZED)
          .json({ message: "User not authenticated.",})
      }

      const user = await this.exerciseService.findUserByEmail(email)

      if (!user) {
        return res
          .status(STATUS_CODE.NOT_FOUND)
          .json({ message: "User not found" })
      }

      if (!topics || topics.length=== 0) {
        return res.status(STATUS_CODE.NOT_FOUND).json({ message: "No topics found for this theme" });
      }
      const progressList = await Promise.all(
        topics.map(async (topic: any) => {
          const progress = await this.exerciseService.getStatus(user.id, topic.id);
          return {
            topicId: topic.id,
            topicName: topic.name,
            progress, 
          };
        })
      );
      
      return res.status(STATUS_CODE.OK).json({
        themeId,
        progress: progressList,
      });
     } catch (error) {
      console.error(error);
      return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        message: "Error retrieving progress for theme."
      });
    }
  }
}