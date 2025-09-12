import { NextFunction, Request, Response } from "express";
import { StackbyService } from "../../services/StackbyService";
import { STATUS_CODE } from "../../utils/constants";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { StackbyParamsDto } from "../../dtos/StackbyEndpoint.dto";
import { buildStackbyFilter } from "../../utils/filter-factory";
// import { StackbyFilter, StackbyFilterById } from "../../utils/stackby-filter";
import { BadRequestError } from "../../errors/HttpErrors";

export class StackbyController {
  private stackbyService: StackbyService;

  constructor() {
    this.stackbyService = new StackbyService();
  }

  async getStackbyData(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = { ...req.params, ...req.query };

      const dto = plainToInstance(StackbyParamsDto, payload, {
        enableImplicitConversion: true,
      });

      await validateOrReject(dto);

      if (!dto.endpoint) {
        throw new BadRequestError(
          "An endpoint is required. Must be 'Exercises', 'Topics' or 'Themes'."
        );
      }

      const { endpoint } = dto;

      const filter = buildStackbyFilter(dto);

      const data = await this.stackbyService.fetchStackbyData(endpoint, filter);
      return res.status(STATUS_CODE.OK).json(data);
    } catch (error) {
      next(error);
    }
  }
  // toDo: fizemos o filtro pelo stackby API, avaliar necessidade desse método
  // async getFilteredThemes(req: Request, res: Response) {
  //   const dto = plainToInstance(GetThemesDTO, req.query);
  //   const errors = await validate(dto);
  //   const { themeType } = dto;

  //   if (errors.length > 0) {
  //     const messages = errors
  //       .map((err) => Object.values(err.constraints || {}))
  //       .flat();
  //     return res
  //       .status(STATUS_CODE.BAD_REQUEST)
  //       .json({ message: messages.join(", ") });
  //   }

  //   try {

  //     const response = await this.stackyByService.fetchStackbyData("Themes");
  //     const allThemes = response?.data || [];
  //     const filteredThemes = themeType
  //       ? allThemes.filter((theme: any) => {
  //           const category = theme?.field?.category?.toLowerCase?.();
  //           return category === themeType;
  //         })
  //       : allThemes;

  //     return res.status(STATUS_CODE.OK).json({ data: filteredThemes });
  //   } catch (error) {
  //     console.error("Error when searching for themes", error);
  //     if (error instanceof Error) {
  //       return res
  //         .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
  //         .json({ message: `Error processing the request: ${error.message}` });
  //     } else {
  //       return res
  //         .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
  //         .json({ message: "An unexpected error occurred" });
  //     }
  //   }
  // }
}
