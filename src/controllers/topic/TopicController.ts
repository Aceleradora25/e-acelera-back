import { Request, Response } from "express";
import { TopicService } from "../../services/TopicService";
import { STATUS_CODE } from "../../utils/constants";

export class TopicController {
  private topicService: TopicService;
  constructor() {
    this.topicService = new TopicService();
  }

    async getTopicProgress(req: Request, res: Response) {
      const { topicId } = req.params;
      const totalItens = Number(req.query.totalItens); 
      const email = req.user?.email;

      if(!topicId || !totalItens || isNaN(Number(totalItens))) {
        return res.status(STATUS_CODE.BAD_REQUEST).json({ message: "You must pass topicId as a regular param and totalItens type number as a query param." });
      }

      if (!email) {
        return res
          .status(STATUS_CODE.UNAUTHORIZED)
          .json({ message: "User not authenticated" });
      }
      try {
        const topicProgress = await this.topicService.getTopicProgress({ email, topicId, totalItens });
        return res.status(STATUS_CODE.OK).json(topicProgress);
      } catch (error: any) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: "Error processing the request" });
      }
    }
}