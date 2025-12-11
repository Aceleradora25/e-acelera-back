import { getModelByName } from "@adminjs/prisma";

export const TopicResource = {
	options: {
		navigation: "Content",

		properties: {
			description: { type: "richtext" },
			id: {
				isId: true,
				isVisible: { edit: false, filter: true, list: true, show: true },
			},
			references: {},
			shortDescription: {},

			themeId: {
				isVisible: { edit: true, filter: true, list: true, show: true },
				reference: "Theme",
			},

			title: {},
		},
	},
	resource: {
		client: undefined,
		model: getModelByName("Topic"),
	},
};
