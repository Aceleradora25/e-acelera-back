import { Request, Response } from "express";
import { STATUS_CODE } from '../../utils/constants';
import { ProgressService } from '../../services/progress/ProgressService';
import { ProgressController } from './ProgressController';
import { ElementType, ItemStatus } from "@prisma/client";
import { ProgressDTO } from "./Progress.dto";
import { validateSync } from "class-validator";
import { plainToClass } from "class-transformer";
import { Progress, SingleProgressResponse } from "../../types/types";

jest.mock("../../services/Progress/ProgressService")
jest.mock("../../services/UserService")
jest.mock('../../middleware/validateTokenMiddleware.ts', () => ({
  validateTokenMiddleware: jest.fn(),
}));

let controller: ProgressController;
let req: Partial<Request>;
let res: Partial<Response>;
let mockProgressService: jest.Mocked<ProgressService>;

describe("Progress Controller Unit Tests", () => {
  describe("ProgressController - getTopicProgress", () => {
    let controller: ProgressController;
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
      mockProgressService = new ProgressService() as jest.Mocked<ProgressService>;
      controller = new ProgressController();
      controller["progressService"] = mockProgressService;

      req = {
        params: { topicId: "1" },
        query: { totalItens: "12" },
        user: {
          email: "test@gmail.com",
          id: 1
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
      await controller.getTopicProgress(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);

      req.params = { topicId: "1" };
      req.query = {};
      await controller.getTopicProgress(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);

      req.query = { totalItens: "1ab" };
      await controller.getTopicProgress(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);

      req.query = { totalItens: "-5" };
      await controller.getTopicProgress(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
    });

    it("deve retornar 500 em erro interno do service", async () => {
      mockProgressService.getTopicProgress.mockRejectedValue(new Error("err"));
      await controller.getTopicProgress(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ message: "Error processing the request" });
    });

    it("deve retornar 200 e o progresso quando tudo OK", async () => {
      mockProgressService.getTopicProgress.mockResolvedValue({ progress: 75 })
      await controller.getTopicProgress(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.OK);
      expect(res.json).toHaveBeenCalledWith({ progress: 75 });
    });
  });


  describe('UpdateStatusDto', () => {
    it('é válido para um itemStatus Enum correto', () => {
      const dto = plainToClass(ProgressDTO, {
        themeId: '1',
        elementType: ElementType.Exercise,
        itemStatus: ItemStatus.Completed,
      });
      const errors = validateSync(dto);
      expect(errors).toHaveLength(0);
    });

    it('é inválido para um itemStatus inválido', () => {
      const dto = plainToClass(ProgressDTO, {
        themeId: '1',
        elementType: ElementType.Exercise,
        itemStatus: 'Finished' as ItemStatus,
      });
      const errors = validateSync(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isEnum');
    });
  });


  describe("ExerciseController - updateExerciseStatus", () => {
    beforeEach(() => {
      mockProgressService = new ProgressService() as jest.Mocked<ProgressService>;
      controller = new ProgressController();
      controller["progressService"] = mockProgressService;

      req = {
        params: { topicId: "1", itemId: "1" },
        body: { itemStatus: "NotStarted" },
        user: {
          email: "test@gmail.com",
          id: 1
        },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    })

    it("deve retornar o progresso atualizado ao mudar o status ou criar um novo registro", async () => {
      const progress = {
        itemId: "rw12346789",
        itemStatus: ItemStatus.InProgress,
        elementType: ElementType.Exercise,
        topicId: "rw987654321",
        themeId: "1",
        userId: 1,
        modifiedAt: new Date(),
      }

      mockProgressService.saveStatusProgress.mockResolvedValue(progress);
      await controller.saveStatusProgress(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.OK);
      expect(res.json).toHaveBeenCalledWith(progress);

    });

    it('deve retornar "Internal server error while processing the request" em caso de erro no servidor', async () => {
      mockProgressService.saveStatusProgress.mockRejectedValue(new Error("Internal server error"));

      await controller.saveStatusProgress(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error while processing the request",
      });
    });
  });

  describe("ExerciseController - getTopicExercisesStatus", () => {
    beforeEach(() => {
      mockProgressService = new ProgressService() as jest.Mocked<ProgressService>;

      controller = new ProgressController();
      controller["progressService"] = mockProgressService;

      req = {
        params: { topicId: "1", itemId: "1" }, user: {
          email: "test@gmail.com",
          id: 1
        },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it("deve retornar 'topicId não encontrado' se o topicId não existir", async () => {
      req.params = { ...req.params, topicId: "" };
      mockProgressService.getAllProgressByTopic.mockResolvedValue([]);

      await controller.getTopicExercisesStatus(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: "Progress not found" });
    });

    it("deve retornar 'Progresso não encontrado' se o status do exercício não for encontrado", async () => {
      mockProgressService.getAllProgressByTopic.mockResolvedValue([]);

      await controller.getTopicExercisesStatus(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: "Progress not found" });
    });

    it("deve retornar 'Erro ao processar a solicitação' se ocorrer um erro", async () => {
      await controller.getTopicExercisesStatus(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.INTERNAL_SERVER_ERROR);
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

      mockProgressService.getAllProgressByTopic.mockResolvedValue(statusList);

      await controller.getTopicExercisesStatus(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.OK);
      expect(res.json).toHaveBeenCalledWith(statusList);
    });
  });

  describe("ProgressController - getExerciseStatus", () => {
    beforeEach(() => {
      mockProgressService = new ProgressService() as jest.Mocked<ProgressService>;

      controller = new ProgressController();
      controller["progressService"] = mockProgressService;

      req = {
        params: { topicId: "1", itemId: "2" },
        user: {
          email: "test@gmail.com",
          id: 1
        },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it("deve retornar 'itemId não encontrado' se o itemId não existir", async () => {
      req.params = { ...req.params, itemId: "" };
      mockProgressService.getAllProgressByTopic.mockResolvedValue([]);

      await controller.getExerciseStatus(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ message: "itemId is required" });
    });
    it("deve retornar 'status não encontrado' se o status não for encontrado", async () => {
      mockProgressService.getAllProgressByTopic.mockResolvedValue([]);

      await controller.getExerciseStatus(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: "Status not found" });
    });

    it("deve retornar 'Erro ao processar a solicitação' se ocorrer um erro", async () => {
      mockProgressService.getProgressByExerciseId.mockRejectedValue(new Error("INTERNAL_SERVER_ERROR"));

      await controller.getExerciseStatus(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error processing the request",
      });
    });

    it("deve retornar um objeto com itemStatus e itemId quando disponível", async () => {
      const exerciseSuccess: SingleProgressResponse =
      {
        itemId: "rw1726148766181e6dab5",
        topicId: "q",
        themeId: "q",
        itemStatus: ItemStatus.InProgress,
        elementType: ElementType.Exercise,
        modifiedAt: new Date(),
        userId: 1,
      };

      mockProgressService.getProgressByExerciseId.mockResolvedValue(exerciseSuccess);

      await controller.getExerciseStatus(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.OK);
      expect(res.json).toHaveBeenCalledWith(exerciseSuccess);
    })
  })
})
