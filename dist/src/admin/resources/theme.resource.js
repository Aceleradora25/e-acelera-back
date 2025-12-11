import { getModelByName } from "@adminjs/prisma";
export const ThemeResource = {
    options: {
        actions: {},
        navigation: "Content",
        properties: {
            alt: {},
            category: {
                availableValues: [
                    { label: "Leveling", value: "Leveling" },
                    { label: "Self Study", value: "SelfStudy" },
                ],
            },
            createdAt: { isVisible: false },
            description: { type: "richtext" },
            id: {
                isId: true,
                isVisible: { edit: false, filter: true, list: true, show: true },
            },
            image: {},
            sequence: {},
            shortDescription: {},
            title: { isVisible: true },
            updatedAt: { isVisible: false },
        },
    },
    resource: {
        client: undefined,
        model: getModelByName("Theme"),
    },
};
