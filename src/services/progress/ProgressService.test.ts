import { ProgressService } from './ProgressService';
import { ItemStatus, ElementType } from '@prisma/client';
import { prismaMock } from "../../../singleton"
import { IdType } from '../../types/types';

let progressService: ProgressService;
beforeEach(() => {
  jest.clearAllMocks();
  progressService = new ProgressService();
});

describe('ProgressService', () => {
  describe('calculateProgressPercentage', () => {
    it('retorna 0 quando totalUserItens ou totalItens for 0', () => {
      expect(progressService.calculateProgressPercentage(0, 0)).toEqual({ progress: 0 });
      expect(progressService.calculateProgressPercentage(5, 0)).toEqual({ progress: 0 });
      expect(progressService.calculateProgressPercentage(0, 10)).toEqual({ progress: 0 });
    });

    it('calcula corretamente e arredonda para baixo', () => {
      expect(progressService.calculateProgressPercentage(6, 12)).toEqual({ progress: 50 });
      expect(progressService.calculateProgressPercentage(1, 3)).toEqual({ progress: 33 });
      expect(progressService.calculateProgressPercentage(2, 5)).toEqual({ progress: 40 });
    });

    it('lida com totalUserItens > totalItens', () => {
      expect(progressService.calculateProgressPercentage(10, 2)).toEqual({ progress: 500 });
    });
  });

  describe('getProgressPercentageById', () => {
    it('retorna progresso 0 se totalItens for 0', async () => {
      const result = await progressService.getProgressPercentageById(
        { userId: 1, id: '1', idType: IdType.TOPIC_ID },
        0
      );
      expect(result).toEqual({ progress: 0 });
    });

    it('calcula corretamente o progresso quando há itens completados', async () => {
      prismaMock.progress.count.mockResolvedValue(2);
      const result = await progressService.getProgressPercentageById(
        { userId: 1, id: '1', idType: IdType.TOPIC_ID },
        10
      );
      expect(result).toEqual({ progress: 20 });
    });

    it('lança erro se o count falhar', async () => {
      prismaMock.progress.count.mockRejectedValue(new Error('DB fail'));
      await expect(
        progressService.getProgressPercentageById(
          { userId: 1, id: '1', idType: IdType.TOPIC_ID },
          5
        )
      ).rejects.toThrow('Error fetching user progress from database');
    });

    it('retorna {progress: 0, topics: []} se theme não encontrado', async () => {
      const themes = { data: [] };
      const topics = { data: [] };
      const result = await progressService.getProgressPercentageById(
        { userId: 1, id: 'notfound', idType: IdType.THEME_ID },
        10,
        themes,
        topics
      );
      expect(result).toEqual({ progress: 0, topics: [] });
    });

    it('retorna progresso 0 se topicsInfo está vazio', async () => {
      const themes = {
        data: [
          {
            id: 'theme1',
            field: {
              topicsInfo: '',
              cardDescription: '',
              image: null,
              topics: '',
              category: '',
              topicsDescription: '',
              alt: '',
              rowId: '',
              sequence: 0,
              isConfigure: 0,
              favourite: 0,
              totalItems: null,
              completedItems: null,
              dueDateTimestamp: null,
              checklistId: null,
              remainderId: null,
              updatedAt: '',
              createdAt: '',
              title: '',
              description: '',
            },
          },
        ],
      };
      const topics = { data: [] };
      const result = await progressService.getProgressPercentageById(
        { userId: 1, id: 'theme1', idType: IdType.THEME_ID },
        10,
        themes,
        topics
      );
      expect(result).toEqual({ progress: 0, topics: [] });
    });

    it('calcula progresso de theme com tópicos e exercícios', async () => {
      const themes = {
        data: [
          {
            id: 'theme1',
            field: {
              topicsInfo: 'topic1,topic2',
              cardDescription: '',
              image: null,
              topics: '',
              category: '',
              topicsDescription: '',
              alt: '',
              rowId: '',
              sequence: 0,
              isConfigure: 0,
              favourite: 0,
              totalItems: null,
              completedItems: null,
              dueDateTimestamp: null,
              checklistId: null,
              remainderId: null,
              updatedAt: '',
              createdAt: '',
              title: '',
              description: '',
            },
          },
        ],
      };
      const topics = {
        data: [
          {
            id: 'topic1',
            field: {
              exercisesInfo: 'ex1,ex2',
              videoInfo: 'video1',
              cardDescription: '',
              video: '',
              references: '',
              theme: '',
              exercises: '',
              exercisesDescription: '',
              videoDescription: '',
              videoLink: '',
              videoReference: '',
              rowId: '',
              sequence: 0,
              isConfigure: 0,
              favourite: 0,
              totalItems: null,
              completedItems: null,
              dueDateTimestamp: null,
              checklistId: null,
              remainderId: null,
              updatedAt: '',
              createdAt: '',
              title: '',
              description: '',
            },
          },
          {
            id: 'topic2',
            field: {
              exercisesInfo: '',
              videoInfo: '',
              cardDescription: '',
              video: '',
              references: '',
              theme: '',
              exercises: '',
              exercisesDescription: '',
              videoDescription: '',
              videoLink: '',
              videoReference: '',
              rowId: '',
              sequence: 0,
              isConfigure: 0,
              favourite: 0,
              totalItems: null,
              completedItems: null,
              dueDateTimestamp: null,
              checklistId: null,
              remainderId: null,
              updatedAt: '',
              createdAt: '',
              title: '',
              description: '',
            },
          },
        ],
      };
      prismaMock.progress.count.mockResolvedValue(1);
      const result = await progressService.getProgressPercentageById(
        { userId: 1, id: 'theme1', idType: IdType.THEME_ID },
        3,
        themes,
        topics
      );
      expect(result.progress).toBeGreaterThanOrEqual(0);
      if ('topics' in result) {
        expect(Array.isArray(result.topics)).toBe(true);
      }
    });
  });

  describe('getSingleStatusProgressByItemId', () => {
    it('retorna o progresso correto para o itemId e userId', async () => {
      const mockProgress = {
        itemId: 'item1',
        userId: 1,
        itemStatus: ItemStatus.Completed,
        topicId: 'topic1',
        themeId: 'theme1',
        elementType: ElementType.Exercise,
        modifiedAt: new Date(),
      };
      prismaMock.progress.findFirst.mockResolvedValue(mockProgress);
      const result = await progressService.getSingleStatusProgressByItemId(
        'item1',
        1
      );
      expect(result).toEqual(mockProgress);
    });

    it('lança erro quando findFirst falhar', async () => {
      prismaMock.progress.findFirst.mockRejectedValue(new Error('DB error'));
      await expect(
        progressService.getSingleStatusProgressByItemId('item1', 1)
      ).rejects.toThrow('Error fetching user progress from database');
    });
  });

  describe('getAllStatusProgressById', () => {
    it('retorna todos os status para o id e userId', async () => {
      const mockList = [
        {
          itemId: 'item1',
          userId: 1,
          itemStatus: ItemStatus.Completed,
          topicId: 'topic1',
          themeId: 'theme1',
          elementType: ElementType.Exercise,
          modifiedAt: new Date(),
        },
        {
          itemId: 'item2',
          userId: 1,
          itemStatus: ItemStatus.InProgress,
          topicId: 'topic2',
          themeId: 'theme2',
          elementType: ElementType.Video,
          modifiedAt: new Date(),
        },
      ];
      prismaMock.progress.findMany.mockResolvedValue(mockList);
      const result = await progressService.getAllStatusProgressById({
        id: 'item1',
        idType: IdType.TOPIC_ID,
        userId: 1,
      });
      expect(result).toEqual(mockList);
    });

    it('lança erro quando findMany falhar', async () => {
      prismaMock.progress.findMany.mockRejectedValue(new Error('DB error'));
      await expect(
        progressService.getAllStatusProgressById({
          id: 'item1',
          idType: IdType.TOPIC_ID,
          userId: 1,
        })
      ).rejects.toThrow('Error fetching user progress from database');
    });
  });

  describe('saveStatusProgress', () => {
    it('chama prisma.progress.upsert com os dados corretos e retorna o progresso criado', async () => {
      const mockProgress = {
        itemId: 'item123',
        userId: 1,
        itemStatus: ItemStatus.Completed,
        themeId: 'theme123',
        elementType: ElementType.Video,
        topicId: 'topic123',
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

    it('lança erro quando o upsert falha', async () => {
      prismaMock.progress.upsert.mockRejectedValue(new Error('DB error'));
      await expect(
        progressService.saveStatusProgress({
          itemId: 'item123',
          userId: 1,
          itemStatus: ItemStatus.Completed,
          themeId: 'theme123',
          elementType: ElementType.Video,
          topicId: 'topic123',
        })
      ).rejects.toThrow('Error saving progress status');
    });
  });
});
