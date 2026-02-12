const express = require("express");

const { authenticate } = require("../auth/authMiddleware");
const { requirePermission } = require("../rbac/requirePermission");
const prisma = require("../config/prisma");

const router = express.Router();

//create permission
router.post(
    "/",
    authenticate,
    requirePermission("permission:create"),
    async (req, res) => {
        const { key } = req.body;
        const { organisationId } = req.user;

        const keyExist = await prisma.permission.findUnique({
            where: {
                key_organisationId: {
                    key,
                    organisationId,
                },
            },
        });

        if (keyExist) {
            return res.status(401).json({
                message: "Permission key is aldready used",
            });
        }

        const permission = await prisma.permission.create({
            data: {
                key,
                organisationId,
            },
        });

        res.status(201).json(permission);
    },
);

//read all permission
router.get(
    "/",
    authenticate,
    requirePermission("permission:read"),
    async (req, res) => {
        const { organisationId } = req.user;

        const permissions = await prisma.permission.findMany({
            where: {
                organisationId,
            },
        });
        res.json(permissions);
    },
);

//update permission
router.patch(
    "/:permissionId",
    authenticate,
    requirePermission("permission:update"),
    async (req, res) => {
        const { permissionId } = req.params;
        const { key } = req.body;
        const { organisationId } = req.user;

        const permission = await prisma.permission.findFirst({
            where: {
                id: permissionId,
                organisationId,
            },
        });

        if (!permission) {
            return res.status(404).json({
                message: "Permission not found",
            });
        }

        const updated = await prisma.permission.update({
            where: {
                id: permissionId,
            },
            data: {
                key,
            },
        });

        res.json({
            message: "Permission is updated",
            updated,
        });
    },
);

//delete permission
router.delete(
    "/:permissionId",
    authenticate,
    requirePermission("permission:delete"),
    async (req, res) => {
        const { permissionId } = req.params;
        const { organisationId } = req.user;

        const permission = await prisma.permission.findFirst({
            where: {
                id: permissionId,
                organisationId,
            },
        });

        if (!permission) {
            return res.status(404).json({
                message: "Permission not found",
            });
        }

        const permissionUsageCount = await prisma.rolePermission.count({
            where: {
                permissionId: permissionId,
            },
        });

        if (permissionUsageCount > 0) {
            return res.status(400).json({
                message:
                    "Permission was assigned to roles. Remove it from roles first.",
            });
        }

        await prisma.permission.delete({
            where: {
                id: permissionId,
            },
        });

        res.json({
            message: `${permission.key} permission deleted`,
        });
    },
);

module.exports = router;
