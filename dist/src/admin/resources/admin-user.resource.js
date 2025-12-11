import { getModelByName } from "@adminjs/prisma";
import bcrypt from "bcryptjs";
export const AdminUserResource = {
    options: {
        actions: {
            edit: {
                before: async (request) => {
                    if (request.payload?.password) {
                        request.payload.password = await bcrypt.hash(request.payload.password, 10);
                    }
                    else {
                        delete request.payload?.password;
                    }
                    return request;
                },
            },
            new: {
                before: async (request) => {
                    if (request.payload?.password) {
                        request.payload.password = await bcrypt.hash(request.payload.password, 10);
                    }
                    return request;
                },
            },
        },
        navigation: "Administration",
        properties: {
            createdAt: { isVisible: false },
            email: {},
            id: {
                isId: true,
                isVisible: { edit: false, filter: true, list: true, show: true },
            },
            password: {
                isVisible: {
                    edit: true,
                    filter: false,
                    list: false,
                    show: false,
                },
                type: "password",
            },
            role: {
                availableValues: [
                    { label: "Admin", value: "ADMIN" },
                    { label: "Editor", value: "EDITOR" },
                    { label: "Viewer", value: "VIEWER" },
                ],
            },
            updatedAt: { isVisible: false },
        },
    },
    resource: {
        client: undefined,
        model: getModelByName("AdminUser"),
    },
};
