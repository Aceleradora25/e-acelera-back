import { PrismaClient } from "@prisma/client";
import { UserService } from "./UserService";

const prisma = new PrismaClient()

interface TopicProgress {
  topicId: string,
  totalItens: number,
  email: string
}

export class TopicService {
  private readonly userService: UserService;
  constructor(){
    this.userService = new UserService()
  }

  async getTopicProgress ({ email, topicId, totalItens }: TopicProgress) {
    try {
      const user = await this.userService.findUserByEmail(email);
      const userItens = await prisma.progress.findMany({ where: { userId: user.id, topicId } });      
      return {
        progress: userItens ? Math.round(userItens.length/totalItens * 100): 0
      }
    } catch (error) {
      throw new Error("Error fetching user from database");
    }
  }  
}