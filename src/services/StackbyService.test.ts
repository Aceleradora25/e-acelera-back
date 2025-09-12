process.env.STACKBY_BASE_URL = "http://fakeurl";
process.env.STACKBY_SECRET_KEY = "fakekey";

import { StackbyService } from "./StackbyService";
import { StackbyEndpoint, StackbyDataResponse } from "../types/types";

describe("StackbyService", () => {
  let service: StackbyService;

  beforeEach(() => {
    service = new StackbyService();
    jest.clearAllMocks();
  });

  describe("fetchStackbyData", () => {
    beforeAll(() => {
      global.fetch = jest.fn();
      jest.clearAllMocks();
    });

    it("retorna dados em caso de sucesso", async () => {
      const mockJson = jest.fn().mockResolvedValue({ data: "ok" });
      (fetch as jest.Mock).mockResolvedValue({ ok: true, json: mockJson });
      const result = await service.fetchStackbyData("endpoint", null);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("http://fakeurl/endpoint"),
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            "x-api-key": "fakekey",
          }),
        })
      );
      expect(result).toEqual({ data: "ok" });
    });

    it.skip("retorna erro se response.ok for false", async () => {
      (fetch as jest.Mock).mockResolvedValue({ ok: false });
      const result = await service.fetchStackbyData("endpoint", null);
      expect(result).toEqual({
        error: "Failed to fetch data from the API. Please try again later.",
      });
    });

    it.skip("retorna erro se lançar exceção", async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error("fail"));
      const result = await service.fetchStackbyData("endpoint", null);
      expect(result).toEqual({
        error: "Internal server error: Error: fail",
      });
    });
  });

  describe("calculateTotalItems", () => {
    it("calcula corretamente para THEMES", () => {
      const mockThemes: StackbyDataResponse = {
        data: [
          {
            id: "theme1",
            field: {
              rowId: "1",
              sequence: 1,
              isConfigure: 0,
              favourite: 0,
              totalItems: null,
              completedItems: null,
              dueDateTimestamp: null,
              checklistId: null,
              remainderId: null,
              updatedAt: "",
              createdAt: "",
              title: "",
              description: "",
              topicsInfo: "topic1,topic2",
              cardDescription: "",
              image: null,
              topics: "",
              category: "",
              topicsDescription: "",
              alt: "",
            },
          },
        ],
      };
      const mockTopics: StackbyDataResponse = {
        data: [
          {
            id: "topic1",
            field: {
              rowId: "1",
              sequence: 1,
              isConfigure: 0,
              favourite: 0,
              totalItems: null,
              completedItems: null,
              dueDateTimestamp: null,
              checklistId: null,
              remainderId: null,
              updatedAt: "",
              createdAt: "",
              title: "",
              description: "",
              cardDescription: "",
              video: "",
              references: "",
              theme: "",
              exercises: "",
              exercisesDescription: "",
              exercisesInfo: "ex1,ex2",
              videoDescription: "",
              videoLink: "",
              videoReference: "",
              videoInfo: "video1",
            },
          },
          {
            id: "topic2",
            field: {
              rowId: "2",
              sequence: 2,
              isConfigure: 0,
              favourite: 0,
              totalItems: null,
              completedItems: null,
              dueDateTimestamp: null,
              checklistId: null,
              remainderId: null,
              updatedAt: "",
              createdAt: "",
              title: "",
              description: "",
              cardDescription: "",
              video: "",
              references: "",
              theme: "",
              exercises: "",
              exercisesDescription: "",
              exercisesInfo: "ex3,ex4",
              videoDescription: "",
              videoLink: "",
              videoReference: "",
              videoInfo: "video2",
            },
          },
        ],
      };
      const result = service.calculateTotalItems(
        "theme1",
        StackbyEndpoint.THEMES,
        mockThemes,
        mockTopics
      );
      expect(result).toBe(6);
    });

    it("calcula corretamente para TOPICS", () => {
      const mockTopics: StackbyDataResponse = {
        data: [
          {
            id: "topic1",
            field: {
              rowId: "1",
              sequence: 1,
              isConfigure: 0,
              favourite: 0,
              totalItems: null,
              completedItems: null,
              dueDateTimestamp: null,
              checklistId: null,
              remainderId: null,
              updatedAt: "",
              createdAt: "",
              title: "",
              description: "",
              cardDescription: "",
              video: "",
              references: "",
              theme: "",
              exercises: "",
              exercisesDescription: "",
              exercisesInfo: "ex1,ex2,ex3",
              videoDescription: "",
              videoLink: "",
              videoReference: "",
              videoInfo: "video1",
            },
          },
        ],
      };
      const result = service.calculateTotalItems(
        "topic1",
        StackbyEndpoint.TOPICS,
        mockTopics
      );
      expect(result).toBe(4);
    });
  });
});
