import { ThemeService } from "./ThemeService";
import prisma from "../../../client"; 

jest.mock("../../../client", () => ({
  __esModule: true,
  default: {
    theme: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

describe("ThemeService - getThemes", () => {
  let service: ThemeService;

  beforeEach(() => {
    service = new ThemeService();
    jest.clearAllMocks();
  });

  it("deve chamar o prisma com os valores de paginação corretos", async () => {
    const mockThemes = [{ id: "1", title: "Tema Teste" }];
    (prisma.theme.findMany as jest.Mock).mockResolvedValue(mockThemes);
    (prisma.theme.count as jest.Mock).mockResolvedValue(1);

    const page = 1;
    const limit = 10;

    const result = await service.getThemes(undefined, page, limit);

    expect(prisma.theme.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0, 
        take: 10,
      })
    );

    expect(result.meta.total).toBe(1);
    expect(result.meta.totalPages).toBe(1);
    expect(result.data).toEqual(mockThemes);
  });
});