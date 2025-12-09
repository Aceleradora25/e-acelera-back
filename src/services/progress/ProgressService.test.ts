import { ElementType, ItemStatus } from "@prisma/client";
import { prismaMock } from "@/root/singleton.js";
import { ProgressService } from "@/services/progress/ProgressService.js";
import { IdType } from "@/types/types.js";

let progressService: ProgressService;
beforeEach(() => {
	jest.clearAllMocks();
	progressService = new ProgressService();
});

describe("ProgressService", () => {
	describe("calculateProgressPercentage", () => {
		it("retorna 0 quando totalUserItens ou totalItens for 0", () => {
			expect(progressService.calculateProgressPercentage(0, 0)).toEqual({
				progress: 0,
			});
			expect(progressService.calculateProgressPercentage(5, 0)).toEqual({
				progress: 0,
			});
			expect(progressService.calculateProgressPercentage(0, 10)).toEqual({
				progress: 0,
			});
		});

		it("calcula corretamente e arredonda para baixo", () => {
			expect(progressService.calculateProgressPercentage(6, 12)).toEqual({
				progress: 50,
			});
			expect(progressService.calculateProgressPercentage(1, 3)).toEqual({
				progress: 33,
			});
			expect(progressService.calculateProgressPercentage(2, 5)).toEqual({
				progress: 40,
			});
		});

		it("lida com totalUserItens > totalItens", () => {
			expect(progressService.calculateProgressPercentage(10, 2)).toEqual({
				progress: 500,
			});
		});
	});

	describe("getProgressPercentageById", () => {
		it("retorna progresso 0 se totalItens for 0", async () => {
			const result = await progressService.getProgressPercentageById(
				{ id: "1", idType: IdType.TOPIC_ID, userId: 1 },
				0,
			);
			expect(result).toEqual({ progress: 0 });
		});

		it("calcula corretamente o progresso quando há itens completados", async () => {
			prismaMock.progress.count.mockResolvedValue(2);
			const result = await progressService.getProgressPercentageById(
				{ id: "1", idType: IdType.TOPIC_ID, userId: 1 },
				10,
			);
			expect(result).toEqual({ progress: 20 });
		});

		it("lança erro se o count falhar", async () => {
			prismaMock.progress.count.mockRejectedValue(new Error("DB fail"));
			await expect(
				progressService.getProgressPercentageById(
					{ id: "1", idType: IdType.TOPIC_ID, userId: 1 },
					5,
				),
			).rejects.toThrow("Error fetching user progress from database");
		});

		it("retorna {progress: 0, topics: []} se theme não encontrado", async () => {
			const themes = { data: [] };
			const topics = { data: [] };
			const result = await progressService.getProgressPercentageById(
				{ id: "notfound", idType: IdType.THEME_ID, userId: 1 },
				10,
				themes,
				topics,
			);
			expect(result).toEqual({ progress: 0, topics: [] });
		});

		it("retorna progresso 0 se topicsInfo está vazio", async () => {
			const themes = {
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
							rowId: "",
							sequence: 0,
							title: "",
							topics: "",
							topicsDescription: "",
							topicsInfo: "",
							totalItems: null,
							updatedAt: "",
						},
						id: "theme1",
					},
				],
			};
			const topics = { data: [] };
			const result = await progressService.getProgressPercentageById(
				{ id: "theme1", idType: IdType.THEME_ID, userId: 1 },
				10,
				themes,
				topics,
			);
			expect(result).toEqual({ progress: 0, topics: [] });
		});

		it("calcula progresso de theme com tópicos e exercícios", async () => {
			const themes = {
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
							rowId: "",
							sequence: 0,
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
			const topics = {
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
							rowId: "",
							sequence: 0,
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
							exercisesInfo: "",
							favourite: 0,
							isConfigure: 0,
							references: "",
							remainderId: null,
							rowId: "",
							sequence: 0,
							theme: "",
							title: "",
							totalItems: null,
							updatedAt: "",
							video: "",
							videoDescription: "",
							videoInfo: "",
							videoLink: "",
							videoReference: "",
						},
						id: "topic2",
					},
				],
			};
			prismaMock.progress.count.mockResolvedValue(1);
			const result = await progressService.getProgressPercentageById(
				{ id: "theme1", idType: IdType.THEME_ID, userId: 1 },
				3,
				themes,
				topics,
			);
			expect(result.progress).toBeGreaterThanOrEqual(0);
			if ("topics" in result) {
				expect(Array.isArray(result.topics)).toBe(true);
			}
		});
	});

	describe("getSingleStatusProgressByItemId", () => {
		it("retorna o progresso correto para o itemId e userId", async () => {
			const mockProgress = {
				elementType: ElementType.Exercise,
				itemId: "item1",
				itemStatus: ItemStatus.Completed,
				modifiedAt: new Date(),
				themeId: "theme1",
				topicId: "topic1",
				userId: 1,
			};
			prismaMock.progress.findFirst.mockResolvedValue(mockProgress);
			const result = await progressService.getSingleStatusProgressByItemId(
				"item1",
				1,
			);
			expect(result).toEqual(mockProgress);
		});

		it("lança erro quando findFirst falhar", async () => {
			prismaMock.progress.findFirst.mockRejectedValue(new Error("DB error"));
			await expect(
				progressService.getSingleStatusProgressByItemId("item1", 1),
			).rejects.toThrow("Error fetching user progress from database");
		});
	});

	describe("getAllStatusProgressById", () => {
		it("retorna todos os status para o id e userId", async () => {
			const mockList = [
				{
					elementType: ElementType.Exercise,
					itemId: "item1",
					itemStatus: ItemStatus.Completed,
					modifiedAt: new Date(),
					themeId: "theme1",
					topicId: "topic1",
					userId: 1,
				},
				{
					elementType: ElementType.Video,
					itemId: "item2",
					itemStatus: ItemStatus.InProgress,
					modifiedAt: new Date(),
					themeId: "theme2",
					topicId: "topic2",
					userId: 1,
				},
			];
			prismaMock.progress.findMany.mockResolvedValue(mockList);
			const result = await progressService.getAllStatusProgressById({
				id: "item1",
				idType: IdType.TOPIC_ID,
				userId: 1,
			});
			expect(result).toEqual(mockList);
		});

		it("lança erro quando findMany falhar", async () => {
			prismaMock.progress.findMany.mockRejectedValue(new Error("DB error"));
			await expect(
				progressService.getAllStatusProgressById({
					id: "item1",
					idType: IdType.TOPIC_ID,
					userId: 1,
				}),
			).rejects.toThrow("Error fetching user progress from database");
		});
	});

	describe("saveStatusProgress", () => {
		it("chama prisma.progress.upsert com os dados corretos e retorna o progresso criado", async () => {
			const mockProgress = {
				elementType: ElementType.Video,
				itemId: "item123",
				itemStatus: ItemStatus.Completed,
				modifiedAt: new Date(),
				themeId: "theme123",
				topicId: "topic123",
				userId: 1,
			};
			prismaMock.progress.upsert.mockResolvedValue(mockProgress);
			const result = await progressService.saveStatusProgress({
				elementType: mockProgress.elementType,
				itemId: mockProgress.itemId,
				itemStatus: mockProgress.itemStatus,
				themeId: mockProgress.themeId,
				topicId: mockProgress.topicId,
				userId: mockProgress.userId,
			});
			expect(prismaMock.progress.upsert).toHaveBeenCalledWith({
				create: {
					elementType: mockProgress.elementType,
					itemId: mockProgress.itemId,
					itemStatus: mockProgress.itemStatus,
					themeId: mockProgress.themeId,
					topicId: mockProgress.topicId,
					userId: mockProgress.userId,
				},
				update: { itemStatus: mockProgress.itemStatus },
				where: {
					itemId_userId: {
						itemId: mockProgress.itemId,
						userId: mockProgress.userId,
					},
				},
			});
			expect(result).toEqual(mockProgress);
		});

		it("lança erro quando o upsert falha", async () => {
			prismaMock.progress.upsert.mockRejectedValue(new Error("DB error"));
			await expect(
				progressService.saveStatusProgress({
					elementType: ElementType.Video,
					itemId: "item123",
					itemStatus: ItemStatus.Completed,
					themeId: "theme123",
					topicId: "topic123",
					userId: 1,
				}),
			).rejects.toThrow("Error saving progress status");
		});
	});
});
