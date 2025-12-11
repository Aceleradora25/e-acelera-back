import { type BaseRecord, type BaseResource, Filter } from "adminjs";
import { AdminServiceError } from "../errors/AdminResourceAdapterError.js";
import type { ModelTypes } from "./model-types.js";
import type { ResourceName } from "./resource-registry.js";

export class AdminResourceAdapter {
	constructor(private registry: Record<ResourceName, BaseResource>) {}

	private getResource<N extends ResourceName>(name: N): BaseResource {
		const resource = this.registry[name];
		if (!resource) {
			throw new AdminServiceError(`Resource '${name}' not found`, 404);
		}
		return resource;
	}

	async list<N extends ResourceName>(
		name: N,
		{ limit, offset }: { limit: number; offset: number },
	) {
		try {
			const resource = this.getResource(name);
			const filter = new Filter({}, resource);

			const records = (await resource.find(filter, {
				limit,
				offset,
				sort: { direction: "asc", sortBy: "id" },
			})) as BaseRecord[];

			const total = await resource.count(filter);

			return {
				data: records.map((r) => ({
					...(r.params as ModelTypes[N]),
				})),
				total,
			};
		} catch (err) {
			throw new AdminServiceError("Failed to list records", 500, err);
		}
	}

	async getOne<N extends ResourceName>(name: N, id: string) {
		try {
			const resource = this.getResource(name);
			const record = (await resource.findOne(id)) as BaseRecord | null;

			if (!record) {
				throw new AdminServiceError(
					`Record '${id}' not found in '${name}'`,
					404,
				);
			}

			return { ...(record.params as ModelTypes[N]) };
		} catch (err) {
			throw new AdminServiceError("Failed to fetch record", 500, err);
		}
	}

	async create<N extends ResourceName>(
		name: N,
		payload: Partial<ModelTypes[N]>,
	) {
		try {
			const resource = this.getResource(name);
			const record = (await resource.create(payload)) as BaseRecord;

			return { ...(record.params as ModelTypes[N]) };
		} catch (err) {
			throw new AdminServiceError("Failed to create record", 400, err);
		}
	}

	async update<N extends ResourceName>(
		name: N,
		id: string,
		payload: Partial<ModelTypes[N]>,
	) {
		try {
			const resource = this.getResource(name);
			const record = (await resource.update(id, payload)) as BaseRecord;

			return { ...(record.params as ModelTypes[N]) };
		} catch (err) {
			throw new AdminServiceError("Failed to update record", 400, err);
		}
	}

	async delete<N extends ResourceName>(name: N, id: string): Promise<void> {
		try {
			const resource = this.getResource(name);
			await resource.delete(id);
		} catch (err) {
			throw new AdminServiceError("Failed to delete record", 400, err);
		}
	}
}
