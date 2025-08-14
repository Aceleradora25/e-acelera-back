import { Request, Response } from "express";
import { ProgressService } from "../../services/progress/ProgressService";
import {
  STACKBY_ENDPOINTS_HASHTABLE,
  STATUS_CODE,
} from "../../utils/constants";
import { SaveStatusProgressDTO } from "../../dtos/SaveStatusProgress.dto";
import { plainToInstance } from "class-transformer";
import { StackbyService } from "../../services/StackbyService";
import { IdType, StackbyEndpoint} from "../../types/types";
import { ProgressDTO } from "../../dtos/Progress.dto";

export class ProgressController {
  private progressService: ProgressService;
  private stackbyService: StackbyService;

  constructor() {
    this.progressService = new ProgressService();
    this.stackbyService = new StackbyService();
  }

  async getProgressPercentageById(req: Request, res: Response) {
    const { id, idType } = plainToInstance(ProgressDTO, req.params);
    const userId = req.user?.id!;

    const endpoint = STACKBY_ENDPOINTS_HASHTABLE[idType as IdType]!;
    if (!endpoint) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: "You must pass a valid id and an idType as params." });
    }

    try {
      const topics = await this.stackbyService.fetchStackbyData(StackbyEndpoint.TOPICS);
      if (idType === IdType.THEME_ID) {
        const themes = await this.stackbyService.fetchStackbyData(StackbyEndpoint.THEMES);
        const totalItems = this.stackbyService.calculateTotalItems(id, endpoint, themes, topics);
        const result = await this.progressService.getProgressPercentageById(
          { userId, id, idType },
          totalItems,
          themes,
          topics
        );
        return res.status(STATUS_CODE.OK).json(result);
      } else {
        const totalItems = this.stackbyService.calculateTotalItems(id, endpoint, topics);
        const topicProgress = await this.progressService.getProgressPercentageById(
          {
            userId,
            id,
            idType,
          },
          totalItems
        );
        return res.status(STATUS_CODE.OK).json(topicProgress);
      }
    } catch (error) {
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "Error processing the request" });
    }
  }

  async saveStatusProgress(req: Request, res: Response) {
    const { topicId, itemId } = req.params;
    const { themeId, elementType, itemStatus } = plainToInstance(
      SaveStatusProgressDTO,
      req.body
    );
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

      return res.status(STATUS_CODE.OK).json(updatedProgress);
    } catch (error) {
      return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error while processing the request",
      });
    }
  }

  async getTopicExercisesStatusProgress(req: Request, res: Response) {
    const { id, idType } = plainToInstance(ProgressDTO, req.params);
    const userId = req.user?.id!;

    if (!idType || !id) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: "You must pass an id and an idType as params." });
    }

    try {
      const allProgressByTopic =
        await this.progressService.getAllStatusProgressById({
          id,
          idType: IdType.TOPIC_ID,
          userId,
        });

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

  async getExerciseStatusProgress(req: Request, res: Response) {
    const { itemId } = req.params;
    const userId = req.user?.id!;

    if (!itemId) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: "You must pass an itemId and a topicId as params." });
    }

    try {
      const exerciseStatus =
        await this.progressService.getSingleStatusProgressByItemId(
          itemId,
          userId
        );

      if (!exerciseStatus) {
        return res
          .status(STATUS_CODE.NOT_FOUND)
          .json({ message: "Status not found" });
      }

      return res.status(STATUS_CODE.OK).json(exerciseStatus);
    } catch (error) {
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "Error processing the request" });
    }
  }

  async getThemeProgress(req: Request, res: Response) {
    const userId = req.user?.id!;
    const ids = req.query.ids as string[] | undefined;

    try {
      const themes = await this.stackbyService.fetchStackbyData(StackbyEndpoint.THEMES);
      const topics = await this.stackbyService.fetchStackbyData(StackbyEndpoint.TOPICS);

      const filteredThemes = ids
        ? themes.data.filter((theme) => ids.includes(theme.id))
        : themes.data;

      const progressList = await Promise.all(
        filteredThemes.map(async (theme) => {

          const totalItems = this.stackbyService.calculateTotalItems(
            theme.id,
            StackbyEndpoint.THEMES,
            themes,
            topics
          );

          const resultTheme = await this.progressService.getProgressPercentageById(
            { userId, id: theme.id, idType: IdType.THEME_ID },
            totalItems,
            themes,
            topics
          );
          
          return { id: theme.id, progress: resultTheme.progress };
        }
      ));
      
      return res.status(STATUS_CODE.OK).json(progressList);

    } catch (error) {
      console.error("Erro ao processar getThemeProgress:", error);
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "Error processing the request" });
    }
  }
}
