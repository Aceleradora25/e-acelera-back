import { StackbyController } from "./StackbyController";
import { STATUS_CODE } from "../../utils/constants";
import { NextFunction, Request, Response } from "express";
import { StackbyEndpoint } from "../../types/types";

describe("StackbyController", () => {
  let controller: StackbyController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    controller = new StackbyController();
    req = { params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn() as jest.MockedFunction<NextFunction>;
    jest.clearAllMocks();
  });

  describe("getStackbyData", () => {
    it("retorna 400 se endpoint for inválido", async () => {
      req.params = { endpoint: "Invalid" };
      await controller.getStackbyData(
        req as Request,
        res as Response,
        next as NextFunction
      );
      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: "Endpoint must be one of: Exercises, Topics, Themes",
      });
    });

    it("retorna 400 se endpoint não for informado", async () => {
      req.params = {};
      await controller.getStackbyData(
        req as Request,
        res as Response,
        next as NextFunction
      );
      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: "Endpoint must be one of: Exercises, Topics, Themes",
      });
    });

    it("retorna 200 e os dados em caso de sucesso", async () => {
      req.params = { endpoint: StackbyEndpoint.TOPICS };
      const fetchMock = jest
        .spyOn((controller as any).stackyByService, "fetchStackbyData")
        .mockResolvedValue({ data: "ok" });
      await controller.getStackbyData(
        req as Request,
        res as Response,
        next as NextFunction
      );
      expect(fetchMock).toHaveBeenCalledWith(StackbyEndpoint.TOPICS);
      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.OK);
      expect(res.json).toHaveBeenCalledWith({ data: "ok" });
      fetchMock.mockRestore();
    });

    it("retorna 500 em erro interno", async () => {
      req.params = { endpoint: StackbyEndpoint.THEMES };
      const fetchMock = jest
        .spyOn((controller as any).stackyByService, "fetchStackbyData")
        .mockRejectedValue(new Error("fail"));
      await controller.getStackbyData(
        req as Request,
        res as Response,
        next as NextFunction
      );
      expect(res.status).toHaveBeenCalledWith(
        STATUS_CODE.INTERNAL_SERVER_ERROR
      );
      expect(res.json).toHaveBeenCalledWith({
        message: "Error processing the request",
      });
      fetchMock.mockRestore();
    });
  });
});
