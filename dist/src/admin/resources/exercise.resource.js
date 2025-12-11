import { getModelByName } from "@adminjs/prisma";
export const ExerciseResource = {
    options: {
        navigation: "Content",
        properties: {
            description: { type: "richtext" },
            id: {
                isId: true,
                isVisible: { edit: false, filter: true, list: true, show: true },
            },
            sequence: {},
            shortDescription: {},
            title: {},
            topicId: {
                isVisible: { edit: true, filter: true, list: true, show: true },
                reference: "Topic",
            },
        },
    },
    resource: {
        client: undefined,
        model: getModelByName("Exercise"),
    },
};
