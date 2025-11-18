import { ThemeService } from "../../services/theme/ThemeService";

/** EXEMPLO DE CLASSE CONSTRUTORA, INJETANDO O RESPECTIVO SERVIÇO */
export class ThemeController {
  private themeService: ThemeService;

  constructor() {
    this.themeService = new ThemeService();
  }
}