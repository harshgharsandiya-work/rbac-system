const express = require("express");

const { authenticate } = require("../auth/authMiddleware");
const { requirePermission } = require("../rbac/requirePermission");
const prisma = require("../config/prisma");

const router = express.Router();

//create role (along with included permission)
router.post(
    "/",
    authenticate,
    requirePermission("role:create"),
    async (req, res) => {
        const { name, permissions } = req.body;

        const { organisationId, organisationName } = req.user;

        const isRoleExist = await prisma.role.findUnique({
            where: {
                name_organisationId: {
                    name,
                    organisationId,
                },
            },
        });
        if (isRoleExist) {
            return res.status(400).json({
                message: "Role is aldready exist",
            });
        }

        const role = await prisma.role.create({
            data: {
                name,
                organisationId,
            },
        });

        if (!Array.isArray(permissions)) {
            return res.status(400).json({
                message: "You must provide permission array",
            });
        }

        for (const key of permissions) {
            const permission = await prisma.permission.findUnique({
                where: {
                    key_organisationId: {
                        key,
                        organisationId,
                    },
                },
            });

            if (permission) {
                await prisma.rolePermission.create({
                    data: {
                        roleId: role.id,
                        permissionId: permission.id,
                    },
                });
            }
        }

        res.status(200).json({
            message: `${role.name} was created ${organisationName}`,
            role,
        });
    },
);

//read all roles
router.get(
    "/",
    authenticate,
    requirePermission("role:read"),
    async (req, res) => {
        const { organisationId } = req.user;

        const roles = await prisma.role.findMany({
            where: {
                organisationId,
            },
            select: {
                id: true,
                name: true,
                rolePermissions: {
                    select: {
                        permission: {
                            select: {
                                key: true,
                            },
                        },
                    },
                },
            },
        });

        const formatted = roles.map((role) => ({
            id: role.id,
            name: role.name,
            permissions: role.rolePermissions.map((rp) => rp.permission.key),
        }));

        res.json(formatted);
    },
);

//update full role (along with all included permission)
router.patch(
    "/:roleId",
    authenticate,
    requirePermission("role:update"),
    async (req, res) => {
        const { roleId } = req.params;
        const { name, permissions } = req.body;
        const { organisationId } = req.user;

        if (!Array.isArray(permissions)) {
            return res.status(400).json({
                message: "Permissions must be an array",
            });
        }

        const role = await prisma.role.findFirst({
            where: {
                id: roleId,
                organisationId,
            },
        });

        if (!role) {
            return res.status(404).json({
                message: "Role not found",
            });
        }

        const duplicate = await prisma.role.findUnique({
            where: {
                name_organisationId: {
                    name,
                    organisationId,
                },
            },
        });

        if (duplicate && duplicate.id !== roleId) {
            return res.status(400).json({
                message: "Role name already exists in this organisation",
            });
        }

        try {
            await prisma.$transaction(async (tx) => {
                //update role name
                await tx.role.update({
                    where: {
                        id: roleId,
                    },
                    data: {
                        name,
                    },
                });

                //delete all old role-permission mapping
                await tx.rolePermission.deleteMany({
                    where: { roleId },
                });

                //fetch all permissions in one query
                const permissionRecords = await tx.permission.findMany({
                    where: {
                        organisationId,
                        key: { in: permissions },
                    },
                });

                const rolePermissionData = permissionRecords.map((perm) => ({
                    roleId,
                    permissionId: perm.id,
                }));

                //bulk insert
                if (rolePermissionData.length > 0) {
                    await tx.rolePermission.createMany({
                        data: rolePermissionData,
                        skipDuplicates: true,
                    });
                }
            });

            res.json({
                message: "Role updated successfully",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Something went wrong",
            });
        }
    },
);

//delete role
router.delete(
    "/:roleId",
    authenticate,
    requirePermission("role:delete"),
    async (req, res) => {
        const { roleId } = req.params;
        const { organisationId } = req.user;

        try {
            await prisma.$transaction(async (tx) => {
                const role = await tx.role.findFirst({
                    where: {
                        id: roleId,
                        organisationId,
                    },
                });

                if (!role) {
                    throw new Error("ROLE_NOT_FOUND");
                }

                const roleUsageCount = await tx.memberShip.count({
                    where: {
                        roleId,
                    },
                });

                if (roleUsageCount > 0) {
                    throw new Error("ROLE_IN_USE");
                }

                // delete role-permission mapping
                await tx.rolePermission.deleteMany({
                    where: { roleId },
                });

                // delete role
                await tx.role.delete({
                    where: {
                        id: roleId,
                    },
                });
            });
            res.json({
                message: `Role is delete`,
            });
        } catch (error) {
            if (error.message === "ROLE_NOT_FOUND") {
                return res.status(404).json({
                    message: "Role not found",
                });
            }
            if (error.message === "ROLE_IN_USE") {
                return res.status(400).json({
                    message: "Role is assigned to users. Remove it first.",
                });
            }

            console.error(error);
            return res.status(500).json({
                message: "Something went wrong",
            });
        }
    },
);

module.exports = router;
