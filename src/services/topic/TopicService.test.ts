import { TopicService } from "./TopicService";
import prisma from "../../../client"; 

jest.mock("../../../client", () => ({
  __esModule: true,
  default: {
    topic: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

describe("TopicService - getAllTopics", () => {
  let service: TopicService;

  beforeEach(() => {
    service = new TopicService();
    jest.clearAllMocks();
  });

  it("deve chamar o prisma com os valores de paginação corretos para tópicos", async () => {
    const mockTopics = [{ id: "1", title: "Tópico Teste", themeId: "theme-123" }];
    
    (prisma.topic.findMany as jest.Mock).mockResolvedValue(mockTopics);
    (prisma.topic.count as jest.Mock).mockResolvedValue(1);

    const page = 1;
    const limit = 10;

    const result = await service.getAllTopics(page, limit);

    expect(prisma.topic.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0, 
        take: 10,
      })
    );
    
    expect(result.meta.total).toBe(1);
    expect(result.meta.totalPages).toBe(1);
    expect(result.data).toEqual(mockTopics);
  });
});