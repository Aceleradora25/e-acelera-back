import { Filter } from "adminjs";
import { AdminServiceError } from "../errors/AdminResourceAdapterError.js";
export class AdminResourceAdapter {
    registry;
    constructor(registry) {
        this.registry = registry;
    }
    getResource(name) {
        const resource = this.registry[name];
        if (!resource) {
            throw new AdminServiceError(`Resource '${name}' not found`, 404);
        }
        return resource;
    }
    async list(name, { limit, offset }) {
        try {
            const resource = this.getResource(name);
            const filter = new Filter({}, resource);
            const records = (await resource.find(filter, {
                limit,
                offset,
                sort: { direction: "asc", sortBy: "id" },
            }));
            const total = await resource.count(filter);
            return {
                data: records.map((r) => ({
                    ...r.params,
                })),
                total,
            };
        }
        catch (err) {
            throw new AdminServiceError("Failed to list records", 500, err);
        }
    }
    async getOne(name, id) {
        try {
            const resource = this.getResource(name);
            const record = (await resource.findOne(id));
            if (!record) {
                throw new AdminServiceError(`Record '${id}' not found in '${name}'`, 404);
            }
            return { ...record.params };
        }
        catch (err) {
            throw new AdminServiceError("Failed to fetch record", 500, err);
        }
    }
    async create(name, payload) {
        try {
            const resource = this.getResource(name);
            const record = (await resource.create(payload));
            return { ...record.params };
        }
        catch (err) {
            throw new AdminServiceError("Failed to create record", 400, err);
        }
    }
    async update(name, id, payload) {
        try {
            const resource = this.getResource(name);
            const record = (await resource.update(id, payload));
            return { ...record.params };
        }
        catch (err) {
            throw new AdminServiceError("Failed to update record", 400, err);
        }
    }
    async delete(name, id) {
        try {
            const resource = this.getResource(name);
            await resource.delete(id);
        }
        catch (err) {
            throw new AdminServiceError("Failed to delete record", 400, err);
        }
    }
}
