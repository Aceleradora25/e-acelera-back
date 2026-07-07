process.env.STACKBY_BASE_URL = "http://fakeurl";
process.env.STACKBY_SECRET_KEY = "fakekey";

import { StackbyService } from "../services/StackbyService.js";
import { type StackbyDataResponse, StackbyEndpoint } from "../types/types.js";

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
			(fetch as jest.Mock).mockResolvedValue({ json: mockJson, ok: true });
			const result = await service.fetchStackbyData("endpoint", null);
			expect(fetch).toHaveBeenCalledWith(
				expect.stringContaining("http://fakeurl/endpoint"),
				expect.objectContaining({
					headers: expect.objectContaining({
						"x-api-key": "fakekey",
					}),
					method: "GET",
				}),
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
						field: {
							alt: "",
							cardDescription: "",
							category: "",
							checklistId: null,
							completedItems: null,
							createdAt: "",
							description: "",
							dueDateTimestamp: null,
							favourite: 0,
							image: null,
							isConfigure: 0,
							remainderId: null,
							rowId: "1",
							sequence: 1,
							title: "",
							topics: "",
							topicsDescription: "",
							topicsInfo: "topic1,topic2",
							totalItems: null,
							updatedAt: "",
						},
						id: "theme1",
					},
				],
			};
			const mockTopics: StackbyDataResponse = {
				data: [
					{
						field: {
							cardDescription: "",
							checklistId: null,
							completedItems: null,
							createdAt: "",
							description: "",
							dueDateTimestamp: null,
							exercises: "",
							exercisesDescription: "",
							exercisesInfo: "ex1,ex2",
							favourite: 0,
							isConfigure: 0,
							references: "",
							remainderId: null,
							rowId: "1",
							sequence: 1,
							theme: "",
							title: "",
							totalItems: null,
							updatedAt: "",
							video: "",
							videoDescription: "",
							videoInfo: "video1",
							videoLink: "",
							videoReference: "",
						},
						id: "topic1",
					},
					{
						field: {
							cardDescription: "",
							checklistId: null,
							completedItems: null,
							createdAt: "",
							description: "",
							dueDateTimestamp: null,
							exercises: "",
							exercisesDescription: "",
							exercisesInfo: "ex3,ex4",
							favourite: 0,
							isConfigure: 0,
							references: "",
							remainderId: null,
							rowId: "2",
							sequence: 2,
							theme: "",
							title: "",
							totalItems: null,
							updatedAt: "",
							video: "",
							videoDescription: "",
							videoInfo: "video2",
							videoLink: "",
							videoReference: "",
						},
						id: "topic2",
					},
				],
			};
			const result = service.calculateTotalItems(
				"theme1",
				StackbyEndpoint.THEMES,
				mockThemes,
				mockTopics,
			);
			expect(result).toBe(6);
		});

		it("calcula corretamente para TOPICS", () => {
			const mockTopics: StackbyDataResponse = {
				data: [
					{
						field: {
							cardDescription: "",
							checklistId: null,
							completedItems: null,
							createdAt: "",
							description: "",
							dueDateTimestamp: null,
							exercises: "",
							exercisesDescription: "",
							exercisesInfo: "ex1,ex2,ex3",
							favourite: 0,
							isConfigure: 0,
							references: "",
							remainderId: null,
							rowId: "1",
							sequence: 1,
							theme: "",
							title: "",
							totalItems: null,
							updatedAt: "",
							video: "",
							videoDescription: "",
							videoInfo: "video1",
							videoLink: "",
							videoReference: "",
						},
						id: "topic1",
					},
				],
			};
			const result = service.calculateTotalItems(
				"topic1",
				StackbyEndpoint.TOPICS,
				mockTopics,
			);
			expect(result).toBe(4);
		});
	});
});
