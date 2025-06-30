import { Request, Response } from "express";
import { StackbyService } from "../../services/stackbyService"
import { STATUS_CODE } from "../../utils/constants";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { StackbyParamsDto } from "../../dtos/StackbyEndpoint.dto";

export class StackbyController {
  private stackyByService: StackbyService;

  constructor() {
    this.stackyByService = new StackbyService();
  }

  async getStackbyData( req: Request, res: Response ) {
    const dto = plainToInstance(StackbyParamsDto, req.params);
    const errors = await validate(dto);
    const { endpoint } = dto;

    if (errors.length > 0) {
      const messages = errors.map(err => Object.values(err.constraints || {})).flat();
      return res.status(STATUS_CODE.BAD_REQUEST).json({ message: messages.join(", ") });
    }

    if(!endpoint) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({ message: "An endpoint is required. Must be 'Exercises', 'Topics' or 'Themes'." });
    }

    try {
      const data = await this.stackyByService.fetchStackbyData(endpoint);
      return res.status(STATUS_CODE.OK).json(data);
    } catch (error) {
      return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: "Error processing the request" });
    }
  }
}