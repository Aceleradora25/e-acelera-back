import { Request, Response } from "express";
import { TopicService } from "../../services/topic/TopicService";
import { STATUS_CODE } from "../../utils/constants";
import { GetTopicByIdDTO } from "../../dtos/GetTopicById.dto";
import { plainToInstance } from "class-transformer";
import { validateOrReject, ValidationError } from "class-validator";
import { GetTopicsByThemeIdDTO } from "../../dtos/GetTopicsByThemeId.dto";

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
    const dto = plainToInstance(GetTopicByIdDTO, req.params, { enableImplicitConversion: true });

    try {
      await validateOrReject(dto);
      const topic = await this.topicService.getTopicById(dto.id);

      if (!topic) {
        return res
          .status(STATUS_CODE.NOT_FOUND)
          .json({ message: "Topic not found" });
      }

      return res.status(STATUS_CODE.OK).json(topic);
    } catch (error) {
       if (Array.isArray(error) && error.every(err => err instanceof ValidationError)) {
        return res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ message: "Invalid Topic ID" });
      }
      
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "Error fetching topic" });
    }
  }

  async getTopicsByThemeId(req: Request, res: Response) {
    const dto = plainToInstance(GetTopicsByThemeIdDTO, req.params, { enableImplicitConversion: true });

    try {
      await validateOrReject(dto);
      const topics = await this.topicService.getTopicsByThemeId(dto.themeId);
      return res.status(STATUS_CODE.OK).json(topics);
    } catch (error) {
       if (Array.isArray(error) && error.every(err => err instanceof ValidationError)) {
        return res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ message: "Invalid Theme ID" });
      }
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "Error fetching topics by theme ID" });
    }
  }
}