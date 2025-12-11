import { Router } from "express";
import { admin } from "../admin/admin.js";
import { AdminResourceAdapter } from "../admin/admin-resource-adapter.js";
import { buildResourceRegistry, } from "../admin/resource-registry.js";
import { normalizeResourceName } from "../admin/resource-resolver.js";
const parsePagination = (req) => {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 20);
    const offset = (page - 1) * limit;
    return { limit, offset, page };
};
const router = Router();
const registry = buildResourceRegistry(admin);
const adminResourceAdapter = new AdminResourceAdapter(registry);
router.get("/:resource", async (req, res, next) => {
    try {
        const resourceName = normalizeResourceName(req.params.resource);
        const { page, limit, offset } = parsePagination(req);
        const result = await adminResourceAdapter.list(resourceName, {
            limit,
            offset,
        });
        return res.json({
            data: result.data,
            meta: {
                limit,
                page,
                total: result.total,
                totalPages: Math.ceil(result.total / limit),
            },
        });
    }
    catch (err) {
        next(err);
    }
});
router.get("/:resource/:id", async (req, res, next) => {
    try {
        const resourceName = normalizeResourceName(req.params.resource);
        const record = await adminResourceAdapter.getOne(resourceName, req.params.id);
        return res.json(record);
    }
    catch (err) {
        next(err);
    }
});
router.post("/:resource", async (req, res, next) => {
    try {
        const resourceName = normalizeResourceName(req.params.resource);
        const created = await adminResourceAdapter.create(resourceName, req.body);
        return res.json(created);
    }
    catch (err) {
        next(err);
    }
});
router.put("/:resource/:id", async (req, res, next) => {
    try {
        const resourceName = normalizeResourceName(req.params.resource);
        const updated = await adminResourceAdapter.update(resourceName, req.params.id, req.body);
        return res.json(updated);
    }
    catch (err) {
        next(err);
    }
});
router.delete("/:resource/:id", async (req, res, next) => {
    try {
        const resourceName = normalizeResourceName(req.params.resource);
        const deleted = await adminResourceAdapter.delete(resourceName, req.params.id);
        return res.json(deleted);
    }
    catch (err) {
        next(err);
    }
});
export default router;
