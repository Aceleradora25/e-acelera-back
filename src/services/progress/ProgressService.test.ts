import { ProgressService } from './ProgressService';
import { ItemStatus, ElementType } from '@prisma/client';
import { prismaMock } from "../../../singleton"

let progressService: ProgressService;
beforeEach(() => {
  jest.clearAllMocks();
  progressService = new ProgressService();
});
describe("progressService - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  });

  describe("calculateProgress - Unit Tests", () => {
    it("deve retornar 0 quando totalTopicItens for 0 ou totalUserItens for 0", () => {
      expect(progressService.calculateProgress(0, 0)).toEqual({ progress: 0 });
      expect(progressService.calculateProgress(5, 0)).toEqual({ progress: 0 });
      expect(progressService.calculateProgress(0, 10)).toEqual({ progress: 0 });
    });

    it("deve calcular corretamente e arredondar para baixo", () => {
      expect(progressService.calculateProgress(6, 12)).toEqual({ progress: 50 });
      expect(progressService.calculateProgress(1, 3)).toEqual({ progress: 33 });
      expect(progressService.calculateProgress(2, 5)).toEqual({ progress: 40 });
    });

    it("deve lidar com totalUserItens > totalTopicItens sem crash", () => {
      expect(progressService.calculateProgress(10, 2)).toEqual({ progress: 500 });
    });
  })

  describe("getTopicProgress - Unit Tests", () => {
    it('retorna progresso 0 se totalTopicItens for 0', async () => {
      prismaMock.progress.findMany.mockResolvedValue([
        { itemId: 'x', itemStatus: 'Completed', elementType: 'Video', topicId: 't', modifiedAt: new Date(), userId: 1, themeId: "t1" }
      ]);
      const result = await progressService.getTopicProgress({ userId: 1, topicId: 't', totalItens: 0 });

      expect(result).toEqual({ progress: 0 });
    });

    it('calcula corretamente o progresso quando há itens completados', async () => {
      const userItensMock = [
        { itemId: 'i1', itemStatus: ItemStatus.Completed, elementType: ElementType.Video, topicId: 't1', modifiedAt: new Date(), userId: 1, themeId: "t1" },
        { itemId: 'i2', itemStatus: ItemStatus.Completed, elementType: ElementType.Exercise, topicId: 't1', modifiedAt: new Date(), userId: 1, themeId: "t1" },
      ]
      prismaMock.progress.findMany.mockResolvedValue(userItensMock);

      const result = await progressService.getTopicProgress({ userId: 1, topicId: 't1', totalItens: 10 });
      expect(result).toEqual({ progress: 20 });
    });

    it('lança erro se o findMany falhar', async () => {
      prismaMock.progress.findMany.mockRejectedValue(() => new Error('DB fail'));
      await expect(
        progressService.getTopicProgress({ userId: 1, topicId: 't1', totalItens: 5 })
      ).rejects.toThrow('Error fetching user progress from database');
    });
  })

  describe("saveStatusProgress - Unit Tets", () => {
      it("deve chamar prisma.progress.upsert com os dados corretos e retornar o progresso criado", async () => {
        const mockProgress = {
          itemId: "item123",
          userId: 1,
          itemStatus: ItemStatus.Completed,
          themeId: "theme123",
          elementType: ElementType.Video,
          topicId: "topic123",
          modifiedAt: new Date(),
        };

        prismaMock.progress.upsert.mockResolvedValue(mockProgress);

        const result = await progressService.saveStatusProgress({
          itemId: mockProgress.itemId,
          userId: mockProgress.userId,
          itemStatus: mockProgress.itemStatus,
          themeId: mockProgress.themeId,
          elementType: mockProgress.elementType,
          topicId: mockProgress.topicId,
        });

        expect(prismaMock.progress.upsert).toHaveBeenCalledWith({
          where: {
            itemId_userId: {
              itemId: mockProgress.itemId,
              userId: mockProgress.userId,
            },
          },
          update: { itemStatus: mockProgress.itemStatus },
          create: {
            itemId: mockProgress.itemId,
            elementType: mockProgress.elementType,
            userId: mockProgress.userId,
            itemStatus: mockProgress.itemStatus,
            topicId: mockProgress.topicId,
            themeId: mockProgress.themeId,
          },
        });

        expect(result).toEqual(mockProgress);
      });

      it("deve lançar erro quando o upsert falhar", async () => {
        prismaMock.progress.upsert.mockRejectedValue(new Error("DB error"));

        await expect(
          progressService.saveStatusProgress({
            itemId: "item123",
            userId: 1,
            itemStatus: ItemStatus.Completed,
            themeId: "theme123",
            elementType: ElementType.Video,
            topicId: "topic123",
          })
        ).rejects.toThrow("Error saving progress status");
      });
    })

});
