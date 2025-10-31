// src/controllers/stackby/StackbyDebugController.ts
import { StackbyDataResponse, DataItem, ExercisesField } from "../../types/types";
import { Request, Response } from "express";
import { StackbyService } from "../../services/StackbyService";
import { StackbyEndpoint } from "../../types/types";

export class StackbyDebugController {
  private stackbyService: StackbyService;

  constructor() {
    this.stackbyService = new StackbyService();
  }

  // Lista todos os exercícios com o rowId do tópico
  public listExercisesByTopic = async (req: Request, res: Response) => {
    try {
      const exercisesData = await this.stackbyService.fetchStackbyData(StackbyEndpoint.EXERCISES);

      const exercisesByTopic = exercisesData.data
        .filter((e: DataItem): e is DataItem & { field: ExercisesField } => 
          'topics' in e.field
        )
        .map((e: DataItem & { field: ExercisesField }) => ({
          exerciseId: e.field.rowId,
          title: e.field.title,
          topicId: e.field.topics, // agora o TypeScript sabe que existe
        }));

      res.json({ exercises: exercisesByTopic });
    } catch (error) {
      console.error("Erro ao listar exercícios:", error);
      res.status(500).json({ error: "Erro ao listar exercícios" });
    }
  };

  // Lista todos os tópicos
  public listAllTopics = async (req: Request, res: Response) => {
    try {
      const topics = await this.stackbyService.fetchStackbyData(StackbyEndpoint.TOPICS);

      const simplified = topics.data.map((t: DataItem) => ({
        rowId: t.field.rowId,
        title: t.field.title,
      }));

      res.json({ topics: simplified });
    } catch (error) {
      console.error("Erro ao buscar tópicos do Stackby:", error);
      res.status(500).json({ error: "Erro ao buscar tópicos do Stackby" });
    }
  };

  // Testa todos os tópicos e verifica se existem exercícios
  public testAllTopicsExercises = async (req: Request, res: Response) => {
    try {
      const topics = await this.stackbyService.fetchStackbyData(StackbyEndpoint.TOPICS);

      const results = [];

      for (const topic of topics.data) {
        const topicId = topic.field.rowId;

        try {
          const exercises = await this.stackbyService.fetchStackbyData(StackbyEndpoint.EXERCISES);

          const found = exercises.data.some(
            (item: any) => item.field.topics === topicId
          );

          results.push({
            topicId,
            title: topic.field.title,
            exercisesFound: found,
          });
        } catch (error) {
          results.push({
            topicId,
            title: topic.field.title,
            exercisesFound: false,
            error: (error as Error).message,
          });
        }
      }

      res.json({ results });
    } catch (error) {
      console.error("Erro ao testar exercícios dos tópicos:", error);
      res.status(500).json({ error: "Erro ao testar exercícios dos tópicos" });
    }
  };
}
