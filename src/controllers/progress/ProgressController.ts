import { Request, Response } from "express";
import { ProgressService } from "../../services/progress/ProgressService";
import { STATUS_CODE } from "../../utils/constants";
import { ProgressDTO } from "./Progress.dto";
import { plainToClass } from "class-transformer";

export class ProgressController {
  private progressService: ProgressService
  constructor() {
    this.progressService = new ProgressService()
  }

  async getTopicProgress(req: Request, res: Response) {
    const { topicId } = req.params;
    const totalItens = Number(req.query.totalItens);
    const id = req.user?.id!;

    if (!topicId || totalItens < 0 || isNaN(totalItens)) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({ message: "You must pass topicId as a regular param and totalItens type number greater than or equal 0 as a query param." });
    }

    try {
      const topicProgress = await this.progressService.getTopicProgress({ userId: id, topicId, totalItens });

      return res.status(STATUS_CODE.OK).json(topicProgress);
    } catch (error) {
      return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: "Error processing the request" });
    }
  }

  async saveStatusProgress(req: Request, res: Response) {
    console.log(req.user);
    
    const { topicId, itemId } = req.params;
    const {
      themeId,
      elementType,
      itemStatus
    } = plainToClass(ProgressDTO, req.body);
    const id = req.user?.id!;

    try {
      const updatedProgress = await this.progressService.saveStatusProgress({
        itemId,
        elementType,
        userId: id,
        itemStatus,
        themeId,
        topicId,
      });
      console.log(updatedProgress);
      
      return res.status(STATUS_CODE.OK).json(updatedProgress);
    } catch (error) {
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({
          message: "Internal server error while processing the request",
        });
    }
  }

  async getTopicExercisesStatus(req: Request, res: Response) {
    const { topicId } = req.params;
    const id = req.user?.id!;

    try {
      const allProgressByTopic = await this.progressService.getAllProgressByTopic(
        +id,
        topicId
      );

      if (allProgressByTopic.length === 0) {
        return res
          .status(STATUS_CODE.NOT_FOUND)
          .json({ message: "Progress not found" });
      }

      return res.status(STATUS_CODE.OK).json(allProgressByTopic);
    } catch (error) {
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "Error processing the request" });
    }
  }

  async getExerciseStatus(req: Request, res: Response) {
    const { itemId } = req.params;
    const id = req.user?.id!;

    try {
      if (!itemId) {
        return res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ message: "itemId is required" });
      }

      const exerciseStatus = await this.progressService.getProgressByExerciseId(
        +id,
        itemId
      );

      if (!exerciseStatus) {
        return res
          .status(STATUS_CODE.NOT_FOUND)
          .json({ message: "Status not found" });
      }

      return res.status(STATUS_CODE.OK).json(exerciseStatus);
    } catch (error) {
      return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: "Error processing the request" });
    }
  }
}