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
// router.post(
//     "/",
//     authenticate,
//     requirePermission("user:create"),
//     async (req, res) => {
//         const { email, roleNames } = req.body;
//         const { organisationId } = req.user;

//         const user = await prisma.user.findUnique({
//             where: {
//                 email,
//             },
//         });

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         for (const roleName of roleNames) {
//             const role = await prisma.role.findUnique({
//                 where: {
//                     name_organisationId: {
//                         name: roleName,
//                         organisationId,
//                     },
//                 },
//             });

//             if (role) {
//                 const d1 = await prisma.memberShip.upsert({
//                     where: {
//                         userId_organisationId_roleId: {
//                             userId: user.id,
//                             organisationId,
//                             roleId: role.id,
//                         },
//                     },
//                     update: {},
//                     create: {
//                         userId: user.id,
//                         organisationId,
//                         roleId: role.id,
//                     },
//                 });
//             }
//         }

//         res.json({ message: "User added to organisation" });
//     },
// );

/**
 * get user effective permission + roles
 */
router.get("/me", authenticate, async (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch user info" });
    }
});

//read all user
router.get(
    "/",
    authenticate,
    requirePermission("user:read"),
    async (req, res) => {
        try {
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
        } catch (error) {
            res.status(500).json({ message: "Failed to fetch users" });
        }
    },
);

//update user role
router.patch(
    "/:userId",
    authenticate,
    requirePermission("user:update"),
    async (req, res) => {
        try {
            const { userId } = req.params;
            const { roleIds } = req.body;
            const { organisationId, id: currentUserId } = req.user;

            if (!Array.isArray(roleIds) || roleIds.length === 0) {
                return res.status(400).json({
                    message: "roleIds must be a non-empty array",
                });
            }

            if (userId === currentUserId) {
                return res.status(403).json({
                    message: "You cannot change your own role",
                });
            }

            const roles = await prisma.role.findMany({
                where: {
                    id: { in: roleIds },
                    organisationId,
                },
            });

            if (roleIds.length !== roles.length) {
                return res.status(400).json({
                    message: "One or more roles are invalid",
                });
            }

            const ownerRole = roles.find((r) => r.name === "OWNER");

            if (ownerRole) {
                const existingOwner = await prisma.memberShip.findFirst({
                    where: {
                        organisationId,
                        roleId: ownerRole.id,
                    },
                });

                if (existingOwner && existingOwner.userId !== userId) {
                    return res.status(400).json({
                        message: "Organisation already has an owner",
                    });
                }
            }

            await prisma.$transaction([
                prisma.memberShip.deleteMany({
                    where: { userId, organisationId },
                }),

                prisma.memberShip.createMany({
                    data: roleIds.map((roleId) => ({
                        userId,
                        organisationId,
                        roleId,
                    })),
                }),
            ]);

            res.json({ message: "User roles updated" });
        } catch (error) {
            res.status(500).json({ message: "Failed to update user roles" });
        }
    },
);

// delete user from org
router.delete(
    "/:userId",
    authenticate,
    requirePermission("user:delete"),
    async (req, res) => {
        try {
            const { userId } = req.params;
            const { organisationId, id: currentUserId } = req.user;

            if (userId === currentUserId) {
                return res.status(400).json({
                    message: "You cannot remove yourself from the organisation",
                });
            }

            const memberships = await prisma.memberShip.findMany({
                where: {
                    userId,
                    organisationId,
                },
                include: {
                    role: true,
                    user: {
                        select: {
                            email: true,
                        },
                    },
                },
            });

            if (memberships.length === 0) {
                return res.status(404).json({
                    message: "User not found in organisation",
                });
            }

            const hasOwnerRole = memberships.some((m) => m.role.name === "OWNER");

            if (hasOwnerRole) {
                return res.status(400).json({
                    message: "Cannot remove OWNER from organisation",
                });
            }

            const email = memberships[0].user.email;

            await prisma.$transaction([
                prisma.organisationInvite.deleteMany({
                    where: {
                        email,
                        organisationId,
                    },
                }),
                prisma.memberShip.deleteMany({
                    where: {
                        userId,
                        organisationId,
                    },
                }),
            ]);

            res.json({ message: "User removed from organisation" });
        } catch (error) {
            res.status(500).json({ message: "Failed to remove user" });
        }
    },
);

module.exports = router;
