const express = require("express");

const { authenticate } = require("../auth/authMiddleware");
const { getEffectivePermissions } = require("../rbac/getEffectivePermissions");
const { requirePermission } = require("../rbac/requirePermission");
const prisma = require("../config/prisma");

const router = express.Router();

/**
 * add user to organisation
 * able to add multiple roles in same organisation
 * using roleNames Array: ["Role1", "Role2"]
 */
router.post(
    "/",
    authenticate,
    requirePermission("user:create"),
    async (req, res) => {
        const { email, roleNames } = req.body;
        const { organisationId } = req.user;

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        for (const roleName of roleNames) {
            const role = await prisma.role.findUnique({
                where: {
                    name_organisationId: {
                        name: roleName,
                        organisationId,
                    },
                },
            });

            if (role) {
                await prisma.memberShip.upsert({
                    where: {
                        userId_organisationId_roleId: {
                            userId: user.id,
                            organisationId,
                            roleId: role.id,
                        },
                    },
                    update: {},
                    create: {
                        userId: user.id,
                        organisationId,
                        roleId: role.id,
                    },
                });
            }
        }

        res.json({ message: "User added to organisation" });
    },
);

//get user effective permission + roles
router.get("/me", authenticate, async (req, res) => {
    const { id, organisationId, organisationName } = req.user;

    if (!organisationId) {
        return res.status(400).json({
            message: "Organisation not selected",
        });
    }

    const effectivePermissions = await getEffectivePermissions(
        id,
        organisationId,
    );

    res.json({
        organisationId,
        organisationName,
        roles: effectivePermissions.roles,
        permissions: effectivePermissions.permissions,
    });
});

//read user
router.get(
    "/",
    authenticate,
    requirePermission("user:read"),
    async (req, res) => {
        const { organisationId } = req.user;

        const users = await prisma.memberShip.findMany({
            where: { organisationId },
            select: {
                id: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        createdAt: true,
                    },
                },
                role: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        const formatted = users.map((m) => ({
            id: m.user.id,
            email: m.user.email,
            role: m.role.name,
        }));

        res.json(formatted);
    },
);

//update user role
router.patch(
    "/:userId",
    authenticate,
    requirePermission("user:update"),
    async (req, res) => {
        const { userId } = req.params;
        const { roleNames } = req.body;
        const { organisationId } = req.user;

        await prisma.memberShip.deleteMany({
            where: { userId, organisationId },
        });

        for (const roleName of roleNames) {
            const role = await prisma.role.findUnique({
                where: {
                    name_organisationId: {
                        name: roleName,
                        organisationId,
                    },
                },
            });

            if (role) {
                await prisma.memberShip.create({
                    data: {
                        userId,
                        organisationId,
                        roleId: role.id,
                    },
                });
            }
        }

        res.json({ message: "User roles updated" });
    },
);

// delete user from org
router.delete(
    "/:userId",
    authenticate,
    requirePermission("user:delete"),
    async (req, res) => {
        const { userId } = req.params;
        const { organisationId } = req.user;

        await prisma.memberShip.deleteMany({
            where: {
                userId,
                organisationId,
            },
        });

        res.json({ message: "User removed from organisation" });
    },
);

module.exports = router;
