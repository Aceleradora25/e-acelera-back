import prisma from "../../../client";
import { pagination } from "../../utils/pagination";

export class TopicService {
	async getAllTopics(page: number = 1, limit: number = 10) {
		const { skip, take } = pagination(page, limit);

		const [topics, total] = await Promise.all([
		prisma.topic.findMany({
			include: {
				exercises: true,
				theme: true,
				video: true,
			},
			skip,
			take,
		}),
      prisma.topic.count({ where: {} }),
    ]); 
	 return {
      data: topics,
      meta: { total, page, limit: take, totalPages: Math.ceil(total / take) },
    };
	}

	async getTopicById(id: string) {
		return await prisma.topic.findUnique({
			include: {
				exercises: true,
				theme: true,
				video: true,
			},
			where: { id },
		});
	}

	async getTopicsByThemeId(themeId: string) {
		return await prisma.topic.findMany({
			include: {
				exercises: true,
				video: true,
			},
			where: { themeId },
		});
	}
}
