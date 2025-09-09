import { Request, Response } from "express";
import { STATUS_CODE } from "../../utils/constants";
import { ProgressService } from "../../services/progress/ProgressService";
import { ProgressController } from "./ProgressController";
import { ElementType, ItemStatus } from "@prisma/client";
import { SaveStatusProgressDTO } from "../../dtos/SaveStatusProgress.dto";
import { validateSync } from "class-validator";
import { plainToClass } from "class-transformer";
import { SingleProgressResponse } from "../../types/types";
import { StackbyService } from "../../services/StackbyService";

jest.mock("../../services/Progress/ProgressService");
jest.mock("../../services/UserService");
jest.mock("../../services/StackbyService");
jest.mock("../../middleware/validateTokenMiddleware.ts", () => ({
  validateTokenMiddleware: jest.fn(),
}));

let controller: ProgressController;
let req: Partial<Request>;
let res: Partial<Response>;
let mockProgressService: jest.Mocked<ProgressService>;
let mockStackbyService: jest.Mocked<StackbyService>;

describe("Progress Controller Unit Tests", () => {
  describe("getTopicProgress", () => {
    let controller: ProgressController;
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
      mockProgressService =
        new ProgressService() as jest.Mocked<ProgressService>;
      mockStackbyService = new StackbyService() as jest.Mocked<StackbyService>;
      controller = new ProgressController();
      controller["progressService"] = mockProgressService;
      controller["stackbyService"] = mockStackbyService;

      req = {
        params: { id: "1", idType: "topicId" },
        query: { totalItens: "12" },
        user: {
          email: "test@gmail.com",
          id: 1,
        },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("deve retornar 400 se faltarem params ou query inválida", async () => {
      req.params = {};
      await controller.getTopicExercisesStatusProgress(
        req as Request,
        res as Response
      );
      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);

      req.params = { topicId: "1" };
      req.query = {};
      await controller.getTopicExercisesStatusProgress(
        req as Request,
        res as Response
      );
      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);

      req.query = { totalItens: "1ab" };
      await controller.getTopicExercisesStatusProgress(
        req as Request,
        res as Response
      );
      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);

      req.query = { totalItens: "-5" };
      await controller.getTopicExercisesStatusProgress(
        req as Request,
        res as Response
      );
      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
    });

    it("deve retornar 500 em erro interno do service", async () => {
      mockStackbyService.calculateTotalItems.mockReturnValue(10);
      mockProgressService.getProgressPercentageById.mockRejectedValue(
        new Error("err")
      );
      await controller.getProgressPercentageById(
        req as Request,
        res as Response
      );
      expect(res.status).toHaveBeenCalledWith(
        STATUS_CODE.INTERNAL_SERVER_ERROR
      );
      expect(res.json).toHaveBeenCalledWith({
        message: "Error processing the request",
      });
    });

    it("deve retornar 200 e o progresso quando tudo OK", async () => {
      mockStackbyService.calculateTotalItems.mockReturnValue(10);
      mockProgressService.getProgressPercentageById.mockResolvedValue({
        progress: 75,
      });

      await controller.getProgressPercentageById(
        req as Request,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.OK);
      expect(res.json).toHaveBeenCalledWith({ progress: 75 });
    });
  });

  describe("UpdateStatusDto", () => {
    it("é válido para um itemStatus Enum correto", () => {
      const dto = plainToClass(SaveStatusProgressDTO, {
        themeId: "1",
        elementType: ElementType.Exercise,
        itemStatus: ItemStatus.Completed,
      });
      const errors = validateSync(dto);
      expect(errors).toHaveLength(0);
    });

    it("é inválido para um itemStatus inválido", () => {
      const dto = plainToClass(SaveStatusProgressDTO, {
        themeId: "1",
        elementType: ElementType.Exercise,
        itemStatus: "Finished" as ItemStatus,
      });
      const errors = validateSync(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty("isEnum");
    });
  });

  describe("saveStatusProgress", () => {
    beforeEach(() => {
      mockProgressService =
        new ProgressService() as jest.Mocked<ProgressService>;
      controller = new ProgressController();
      controller["progressService"] = mockProgressService;

      req = {
        params: { topicId: "1", itemId: "1" },
        body: { itemStatus: "NotStarted" },
        user: {
          email: "test@gmail.com",
          id: 1,
        },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("deve retornar o progresso atualizado ao mudar o status ou criar um novo registro", async () => {
      const progress = {
        itemId: "rw12346789",
        itemStatus: ItemStatus.InProgress,
        elementType: ElementType.Exercise,
        topicId: "rw987654321",
        themeId: "1",
        userId: 1,
        modifiedAt: new Date(),
      };

      mockProgressService.saveStatusProgress.mockResolvedValue(progress);
      await controller.saveStatusProgress(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.OK);
      expect(res.json).toHaveBeenCalledWith(progress);
    });

    it('deve retornar "Internal server error while processing the request" em caso de erro no servidor', async () => {
      mockProgressService.saveStatusProgress.mockRejectedValue(
        new Error("Internal server error")
      );

      await controller.saveStatusProgress(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(
        STATUS_CODE.INTERNAL_SERVER_ERROR
      );
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error while processing the request",
      });
    });
  });

  describe("getTopicExercisesStatusProgress", () => {
    beforeEach(() => {
      mockProgressService =
        new ProgressService() as jest.Mocked<ProgressService>;

      controller = new ProgressController();
      controller["progressService"] = mockProgressService;

      req = {
        params: {
          id: "1",
          idType: "topicId",
        },
        user: {
          email: "test@gmail.com",
          id: 1,
        },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it("deve retornar 'topicId não encontrado' se o topicId não existir", async () => {
      mockProgressService.getAllStatusProgressById.mockResolvedValue([]);

      await controller.getTopicExercisesStatusProgress(
        req as Request,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: "Progress not found" });
    });

    it("deve retornar 'Progresso não encontrado' se o status do exercício não for encontrado", async () => {
      req.params = {
        itemId: "1",
      };

      mockProgressService.getAllStatusProgressById.mockResolvedValue([]);

      await controller.getExerciseStatusProgress(
        req as Request,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: "Status not found" });
    });

    it("deve retornar 'Erro ao processar a solicitação' se ocorrer um erro", async () => {
      mockProgressService.getAllStatusProgressById.mockRejectedValue(
        new Error("err")
      );
      await controller.getTopicExercisesStatusProgress(
        req as Request,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(
        STATUS_CODE.INTERNAL_SERVER_ERROR
      );
      expect(res.json).toHaveBeenCalledWith({
        message: "Error processing the request",
      });
    });

    it("deve retornar a lista de status dos exercícios quando disponível", async () => {
      const statusList: SingleProgressResponse[] = [
        {
          itemId: "rw1726148766181e6dab5",
          elementType: ElementType.Exercise,
          userId: 1,
          itemStatus: ItemStatus.Completed,
          topicId: "rw17212367802520ba251",
          themeId: "1",
          modifiedAt: new Date(),
        },
      ];

      mockProgressService.getAllStatusProgressById.mockResolvedValue(
        statusList
      );

      await controller.getTopicExercisesStatusProgress(
        req as Request,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.OK);
      expect(res.json).toHaveBeenCalledWith(statusList);
    });
  });

  describe("getExerciseStatusProgress", () => {
    beforeEach(() => {
      mockProgressService =
        new ProgressService() as jest.Mocked<ProgressService>;

      controller = new ProgressController();
      controller["progressService"] = mockProgressService;

      req = {
        params: { topicId: "1", itemId: "2" },
        user: {
          email: "test@gmail.com",
          id: 1,
        },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it("deve retornar 'itemId não encontrado' se o itemId não existir", async () => {
      req.params = { ...req.params, itemId: "" };
      mockProgressService.getAllStatusProgressById.mockResolvedValue([]);

      await controller.getExerciseStatusProgress(
        req as Request,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: "You must pass an itemId and a topicId as params.",
      });
    });
    it("deve retornar 'status não encontrado' se o status não for encontrado", async () => {
      mockProgressService.getAllStatusProgressById.mockResolvedValue([]);

      await controller.getExerciseStatusProgress(
        req as Request,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: "Status not found" });
    });

    it("deve retornar 'Erro ao processar a solicitação' se ocorrer um erro", async () => {
      mockProgressService.getSingleStatusProgressByItemId.mockRejectedValue(
        new Error("INTERNAL_SERVER_ERROR")
      );

      await controller.getExerciseStatusProgress(
        req as Request,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(
        STATUS_CODE.INTERNAL_SERVER_ERROR
      );
      expect(res.json).toHaveBeenCalledWith({
        message: "Error processing the request",
      });
    });

    it("deve retornar um objeto com itemStatus e itemId quando disponível", async () => {
      const exerciseSuccess: SingleProgressResponse = {
        userId: 1,
        itemId: "rw1726148766181e6dab5",
        topicId: "q",
        themeId: "q",
        itemStatus: ItemStatus.InProgress,
        elementType: ElementType.Exercise,
        modifiedAt: new Date(),
      };

      mockProgressService.getSingleStatusProgressByItemId.mockResolvedValue(
        exerciseSuccess
      );

      await controller.getExerciseStatusProgress(
        req as Request,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.OK);
      expect(res.json).toHaveBeenCalledWith(exerciseSuccess);
    });
  });
});
