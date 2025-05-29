import { Request, Response } from "express";
import { TopicService } from "../../services/topic/TopicService";
import { STATUS_CODE } from "../../utils/constants";
import { UserService } from "../../services/UserService";

export class TopicController {
  private topicService: TopicService
  private userService: UserService
  constructor() {
    this.topicService = new TopicService(),
    this.userService = new UserService()
  }

    async getTopicProgress(req: Request, res: Response) {
      const { topicId } = req.params;
      const totalItens = Number(req.query.totalItens); 
      const email = req.user?.email;

      if(!topicId || totalItens < 0 || isNaN(totalItens)) {
        return res.status(STATUS_CODE.BAD_REQUEST).json({ message: "You must pass topicId as a regular param and totalItens type number greater than or equal 0 as a query param." });
      }

      if (!email) {
        return res
          .status(STATUS_CODE.UNAUTHORIZED)
          .json({ message: "User not authenticated" });
      }
      try {
        const user = await this.userService.findUserByEmail(email);

        const topicProgress = await this.topicService.getTopicProgress({ id: user.id, topicId, totalItens });

        return res.status(STATUS_CODE.OK).json(topicProgress);
      } catch (error: any) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: "Error processing the request" });
      }
    }
}