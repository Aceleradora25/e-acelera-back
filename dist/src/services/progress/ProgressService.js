import { ItemStatus } from "@prisma/client";
import prisma from "../../../client.js";
import { IdType, } from "../../types/types.js";
export class ProgressService {
    calculateProgressPercentage(totalUserItens, totalItens) {
        return {
            progress: totalUserItens && totalItens
                ? Math.floor((totalUserItens / totalItens) * 100)
                : 0,
        };
    }
    filterTheme(themes, themeId) {
        return themes.data.find((theme) => theme.id === themeId);
    }
    filterTopics(topics, topicIds) {
        return topics.data.filter((topic) => topicIds.includes(topic.id));
    }
    getTopicTotalItems(topicField) {
        let exerciseCount = 0;
        if (topicField.exercisesInfo && topicField.exercisesInfo !== "Untitle") {
            exerciseCount = topicField.exercisesInfo
                .split(",")
                .filter(Boolean).length;
        }
        const videoCount = topicField.videoInfo ? 1 : 0;
        return exerciseCount + videoCount;
    }
    async getTopicCompletedCount(userId, topicId) {
        return await prisma.progress.count({
            where: {
                itemStatus: ItemStatus.Completed,
                topicId,
                userId,
            },
        });
    }
    async calculateTopicProgress(userId, topic) {
        const topicField = topic.field;
        const total = this.getTopicTotalItems(topicField);
        const completed = await this.getTopicCompletedCount(userId, topic.id);
        const progress = total ? Math.floor((completed / total) * 100) : 0;
        return { completed, progress, topicId: topic.id, total };
    }
    async calculateAllTopicsProgress(userId, topics) {
        const topicsProgress = [];
        let totalCompleted = 0;
        for (const topic of topics) {
            const { topicId, progress, completed } = await this.calculateTopicProgress(userId, topic);
            topicsProgress.push({ progress, topicId });
            totalCompleted += completed;
        }
        return { topicsProgress, totalCompleted };
    }
    async calculateThemeProgress(userId, topics, totalItems) {
        const { topicsProgress, totalCompleted } = await this.calculateAllTopicsProgress(userId, topics);
        const progress = totalItems
            ? Math.floor((totalCompleted / totalItems) * 100)
            : 0;
        return { progress, topics: topicsProgress };
    }
    async getProgressPercentageById({ userId, id, idType }, totalItems, themes, topics) {
        try {
            if (idType === IdType.THEME_ID && themes && topics) {
                const theme = this.filterTheme(themes, id);
                if (!theme)
                    return { progress: 0, topics: [] };
                const field = theme.field;
                const topicIds = field.topicsInfo
                    ? field.topicsInfo.split(",").filter(Boolean)
                    : [];
                const filteredTopics = this.filterTopics(topics, topicIds);
                return await this.calculateThemeProgress(userId, filteredTopics, totalItems);
            }
            else {
                const completedCount = await prisma.progress.count({
                    where: {
                        userId,
                        [idType]: id,
                        itemStatus: ItemStatus.Completed,
                    },
                });
                return this.calculateProgressPercentage(completedCount, totalItems);
            }
        }
        catch (_error) {
            throw new Error("Error fetching user progress from database");
        }
    }
    async getSingleStatusProgressByItemId(itemId, userId) {
        try {
            return await prisma.progress.findFirst({
                where: {
                    itemId,
                    userId,
                },
            });
        }
        catch (_error) {
            throw new Error("Error fetching user progress from database");
        }
    }
    async getAllStatusProgressById({ id, idType, userId }) {
        try {
            return await prisma.progress.findMany({
                where: {
                    userId,
                    [idType]: id,
                },
            });
        }
        catch (_error) {
            throw new Error("Error fetching user progress from database");
        }
    }
    async saveStatusProgress({ elementType, itemId, itemStatus, themeId, topicId, userId, }) {
        try {
            const createdProgress = await prisma.progress.upsert({
                create: {
                    elementType,
                    itemId,
                    itemStatus,
                    themeId,
                    topicId,
                    userId,
                },
                update: { itemStatus },
                where: {
                    itemId_userId: {
                        itemId,
                        userId,
                    },
                },
            });
            return createdProgress;
        }
        catch (_error) {
            throw new Error("Error saving progress status");
        }
    }
}
