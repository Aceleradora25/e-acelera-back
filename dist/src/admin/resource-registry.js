export const buildResourceRegistry = (admin) => {
    const map = {};
    admin.resources.forEach((resource) => {
        const name = resource._decorated?.id() || resource.id();
        if (!name)
            return;
        map[name] = resource;
    });
    return map;
};
