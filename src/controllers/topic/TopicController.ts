import { Request, Response } from "express";
import { TopicService } from "../../services/topic/TopicService";
import { STATUS_CODE } from "../../utils/constants";

export class TopicController {
  private topicService: TopicService;

  constructor() {
    this.topicService = new TopicService();
  }

  async getAllTopics(req: Request, res: Response) {
    try {
      const topics = await this.topicService.getAllTopics();
      return res.status(STATUS_CODE.OK).json(topics);
    } catch (error) {
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "Error fetching topics" });
    }
  }

  async getTopicById(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: "Topic ID is required" });
    }

    try {
      const topic = await this.topicService.getTopicById(id);

      if (!topic) {
        return res
          .status(STATUS_CODE.NOT_FOUND)
          .json({ message: "Topic not found" });
      }

      return res.status(STATUS_CODE.OK).json(topic);
    } catch (error) {
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "Error fetching topic" });
    }
  }

  async getTopicsByThemeId(req: Request, res: Response) {
    const { themeId } = req.params;

    if (!themeId) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: "Theme ID is required" });
    }

    try {
      const topics = await this.topicService.getTopicsByThemeId(themeId);
      return res.status(STATUS_CODE.OK).json(topics);
    } catch (error) {
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "Error fetching topics by theme ID" });
    }
  }
}