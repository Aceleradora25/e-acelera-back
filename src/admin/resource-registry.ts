import type AdminJS from "adminjs";
import type { BaseResource } from "adminjs";
import type { ModelTypes } from "./model-types.js";

export type ResourceName = keyof ModelTypes;

export const buildResourceRegistry = (
	admin: AdminJS,
): Record<ResourceName, BaseResource> => {
	const map: Partial<Record<ResourceName, BaseResource>> = {};

	admin.resources.forEach((resource) => {
		const name = resource._decorated?.id() || resource.id();
		if (!name) return;

		map[name as ResourceName] = resource;
	});
	return map as Record<ResourceName, BaseResource>;
};
