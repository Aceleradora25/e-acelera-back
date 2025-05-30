import { Response, Request } from "express"
import { ExerciseService } from "../../services/ExerciseService"
import { STATUS_CODE } from "../../utils/constants"

export class ExerciseController {
  private exerciseService: ExerciseService

  constructor() {
    this.exerciseService = new ExerciseService()
  }

  async updateExerciseStatus(req: Request, res: Response) {
    const { itemId } = req.params;
    const { topicId } = req.params;
    const { elementType, itemStatus } = req.body;
    const email = req.user?.email;
    
    try {
      if (!email) {
        return res
          .status(STATUS_CODE.UNAUTHORIZED)
          .json({ message: "User not authenticated" })
      }

      const user = await this.exerciseService.findUserByEmail(email)

      if (!user) {
        return res
          .status(STATUS_CODE.NOT_FOUND)
          .json({ message: "User not found" })
      }

      const isValidStatus = this.exerciseService.validateStatus(itemStatus)

      if (!isValidStatus) {
        return res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ message: "Invalid or missing status value." })
      }

      const updatedProgress = await this.exerciseService.saveStatus(
        itemId,
        elementType,
        user.id,
        itemStatus,
        topicId
      )

      return res.status(STATUS_CODE.OK).json(updatedProgress)
    } catch (error: any) {
      if (
        error.message.includes("not found") ||
        error.message.includes("Invalid")
      ) {
        return res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ message: error.message })

      }

      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({
          message: "Internal server error while processing the request",
        })
    }
  }

  async getTopicExercisesStatus(req: Request, res: Response) {
    const email = req.user?.email
    const { topicId } = req.params

    try {
      if (!email) {
        return res
          .status(STATUS_CODE.UNAUTHORIZED)
          .json({ message: "User not authenticated" })
      }

      const user = await this.exerciseService.findUserByEmail(email)

      if (!user) {
        return res
          .status(STATUS_CODE.NOT_FOUND)
          .json({ message: "User not found" })
      }

      const getAllExercisesStatus = await this.exerciseService.getStatus(
        user.id,
        topicId
      )

      if (getAllExercisesStatus.length === 0) {
        return res
          .status(STATUS_CODE.NOT_FOUND)
          .json({ message: "Progress not found" })
      }

      return res.status(STATUS_CODE.OK).json(getAllExercisesStatus)
    } catch (error: any) {
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "Error processing the request" })
    }
  }

  async getExerciseStatus(req: Request, res: Response) {
    const { itemId, topicId } = req.params
    const email = req.user?.email

    try {
      if (!email) {
        return res
          .status(STATUS_CODE.UNAUTHORIZED)
          .json({ message: "User not authenticated" })
      }
      const user = await this.exerciseService.findUserByEmail(email)

      if (!user) {
        return res
          .status(STATUS_CODE.NOT_FOUND)
          .json({ message: "User not found" })
      }

      if (!itemId) {
        return res
          .status(STATUS_CODE.NOT_FOUND)
          .json({ message: "itemId not found" })
      }

      if (!topicId) {
        return res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ message: "topicId not found" })
      }

      try {
        await this.exerciseService.findTopicById(topicId)
        
      } catch (error) {
        return res.status(STATUS_CODE.NOT_FOUND).json({ message: "topicId invalid" })
      }

      const exerciseStatus = await this.exerciseService.exerciseStatus(
        user.id,
        itemId,
        topicId
      )

      if (exerciseStatus.length === 0) {
        return res
          .status(STATUS_CODE.NOT_FOUND)
          .json({ message: "Status not found" })
      }
      return res.status(STATUS_CODE.OK).json(exerciseStatus)
    } catch (error: any) {
      return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: "Error processing the request" })
    }
  }

  async saveStatusElement(req: Request, res: Response) {
    const { topicId, itemId } = req.params
    const { elementType, itemStatus } = req.body
    const email = req.user?.email

    try {
      if (!email) {
        return res
          .status(STATUS_CODE.UNAUTHORIZED)
          .json({ message: "User not authenticated" })
      }

      const user = await this.exerciseService.findUserByEmail(email)

      if (!user) {
        return res
          .status(STATUS_CODE.NOT_FOUND)
          .json({ message: "User not found" })
      }

      if (!itemId) {
        return res.status(STATUS_CODE.NOT_FOUND).json({ message: "itemId not found" })
      }

      if (!topicId) {
        return res
          .status(STATUS_CODE.NOT_FOUND)
          .json({ message: "topicId not found" })
      }

      const isValidElementType =
        this.exerciseService.validateElementType(elementType)

      if (!isValidElementType) {
        return res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ message: "Invalid or missing element type." })
      }

      const isValidStatus = this.exerciseService.validateStatus(itemStatus)

      if (!isValidStatus) {
        return res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ message: "Invalid or missing status value." })
      }

      const findExercise = await this.exerciseService.findItemById(itemId)

      const saveProgressStatusCode = findExercise.length
        ? STATUS_CODE.OK
        : STATUS_CODE.CREATED

      const savedStatus = await this.exerciseService.saveStatus(
        itemId,
        elementType,
        user.id,
        itemStatus,
        topicId
      )

      return res.status(saveProgressStatusCode).json(savedStatus)
    } catch (error) {
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "Error processing the request" })
    }
  }
}
