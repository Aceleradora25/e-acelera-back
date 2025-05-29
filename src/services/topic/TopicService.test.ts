
const mFindMany = jest.fn();
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    progress: { findMany: mFindMany }
  })),
  ItemStatus: { Completed: 'Completed', InProgress: 'InProgress', NotStarted: 'NotStarted' },
}));

import { TopicService } from './TopicService';

describe("TopicService - Unit Tests", ()=> {
  let topicService: TopicService;

  beforeEach(() => {
    mFindMany.mockReset();
    topicService = new TopicService();
  });

  describe("calculateProgress - Unit Tests", ()=> {() => {
    it("deve retornar 0 quando totalTopicItens for 0 ou totalUserItens for 0", () => {
      expect(topicService.calculateProgress(0, 0)).toEqual({ progress: 0 });
      expect(topicService.calculateProgress(5, 0)).toEqual({ progress: 0 });
      expect(topicService.calculateProgress(0, 10)).toEqual({ progress: 0 });
    });

    it("deve calcular corretamente e arredondar para baixo", () => {
      expect(topicService.calculateProgress(6, 12)).toEqual({ progress: 50 });
      expect(topicService.calculateProgress(1, 3)).toEqual({ progress: 33 });
      expect(topicService.calculateProgress(2, 5)).toEqual({ progress: 40 });
    });

    it("deve lidar com totalUserItens > totalTopicItens sem crash", () => {
      expect(topicService.calculateProgress(10, 2)).toEqual({ progress: 500 });
    });
  }
  })

  describe("getTopicProgress - Unit Tests", ()=> {    
    it('retorna progresso 0 se totalTopicItens for 0', async () => {
      mFindMany.mockResolvedValue([
        { id: 1, itemId: 'x', itemStatus: 'Completed', elementType: 'Video', topicId: 't', modifiedAt: new Date(), userId: 1 }
      ]);
      const result = await topicService.getTopicProgress({ id: 1, topicId: 't', totalItens: 0 });
      expect(mFindMany).toHaveBeenCalledWith({
        where: { userId: 1, topicId: 't', itemStatus: 'Completed' }
      });
      expect(result).toEqual({ progress: 0 });
    });

    it('calcula corretamente o progresso quando há itens completados', async () => {
      mFindMany.mockResolvedValue([
        { id: 1, itemId: 'i1', itemStatus: 'Completed', elementType: 'Video', topicId: 't1', modifiedAt: new Date(), userId: 1 },
        { id: 2, itemId: 'i2', itemStatus: 'Completed', elementType: 'Article', topicId: 't1', modifiedAt: new Date(), userId: 1 },
      ]);
      const result = await topicService.getTopicProgress({ id: 1, topicId: 't1', totalItens: 10 });
      expect(result).toEqual({ progress: 20 });
    });

    it('lança erro se o findMany falhar', async () => {
      mFindMany.mockRejectedValue(new Error('DB fail'));
      await expect(
        topicService.getTopicProgress({ id: 1, topicId: 't1', totalItens: 5 })
      ).rejects.toThrow('Error fetching user from database');
    });
  })
});
