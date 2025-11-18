import { Request, Response } from "express";
import { ExerciseService } from "../../services/exercise/ExerciseService";
import { STATUS_CODE } from "../../utils/constants";

export class ExerciseController {
  private exerciseService: ExerciseService;

  constructor() {
    this.exerciseService = new ExerciseService();
  }

  async getAllExercises(req: Request, res: Response) {
    try {
      const exercises = await this.exerciseService.getAllExercises();
      return res.status(STATUS_CODE.OK).json(exercises);
    } catch (error) {
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "Error fetching exercises" });
    }
  }

  async getExerciseById(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: "Exercise ID is required" });
    }

    try {
      const exercise = await this.exerciseService.getExerciseById(id);

      if (!exercise) {
        return res
          .status(STATUS_CODE.NOT_FOUND)
          .json({ message: "Exercise not found" });
      }

      return res.status(STATUS_CODE.OK).json(exercise);
    } catch (error) {
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "Error fetching exercise" });
    }
  }

  async getExercisesByTopicId(req: Request, res: Response) {
    const { topicId } = req.params;

    if (!topicId) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: "Topic ID is required" });
    }

    try {
      const exercises = await this.exerciseService.getExercisesByTopicId(topicId);
      return res.status(STATUS_CODE.OK).json(exercises);
    } catch (error) {
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "Error fetching exercises by topic ID" });
    }
  }

}