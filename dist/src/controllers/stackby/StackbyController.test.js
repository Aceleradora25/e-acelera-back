import { StackbyEndpoint } from "../../types/types.js";
import { STATUS_CODE } from "../../utils/constants.js";
import { StackbyController } from "./StackbyController.js";
describe("StackbyController", () => {
    let controller;
    let req;
    let res;
    let next;
    beforeEach(() => {
        controller = new StackbyController();
        req = { params: {} };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });
    describe("getStackbyData", () => {
        it("retorna 400 se endpoint for inválido", async () => {
            req.params = { endpoint: "Invalid" };
            await controller.getStackbyData(req, res, next);
            expect(res.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
            expect(res.json).toHaveBeenCalledWith({
                message: "Endpoint must be one of: Exercises, Topics, Themes",
            });
        });
        it("retorna 400 se endpoint não for informado", async () => {
            req.params = {};
            await controller.getStackbyData(req, res, next);
            expect(res.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
            expect(res.json).toHaveBeenCalledWith({
                message: "Endpoint must be one of: Exercises, Topics, Themes",
            });
        });
        it("retorna 200 e os dados em caso de sucesso", async () => {
            req.params = { endpoint: StackbyEndpoint.TOPICS };
            const fetchMock = jest
                // biome-ignore lint/suspicious/noExplicitAny: TODO: WIP
                .spyOn(controller.stackyByService, "fetchStackbyData")
                .mockResolvedValue({ data: "ok" });
            await controller.getStackbyData(req, res, next);
            expect(fetchMock).toHaveBeenCalledWith(StackbyEndpoint.TOPICS);
            expect(res.status).toHaveBeenCalledWith(STATUS_CODE.OK);
            expect(res.json).toHaveBeenCalledWith({ data: "ok" });
            fetchMock.mockRestore();
        });
        it("retorna 500 em erro interno", async () => {
            req.params = { endpoint: StackbyEndpoint.THEMES };
            const fetchMock = jest
                // biome-ignore lint/suspicious/noExplicitAny: TODO: WIP
                .spyOn(controller.stackyByService, "fetchStackbyData")
                .mockRejectedValue(new Error("fail"));
            await controller.getStackbyData(req, res, next);
            expect(res.status).toHaveBeenCalledWith(STATUS_CODE.INTERNAL_SERVER_ERROR);
            expect(res.json).toHaveBeenCalledWith({
                message: "Error processing the request",
            });
            fetchMock.mockRestore();
        });
    });
});
