const express = require("express");

const { authenticate } = require("../auth/authMiddleware");
const { requirePermission } = require("../rbac/requirePermission");
const prisma = require("../config/prisma");
const { defaultPermissions } = require("../utils/permissions");
const { signToken } = require("../auth/token");
const { hashToken } = require("../utils/hash");

const router = express.Router();

/**
 * create organisation
 */
router.post("/", authenticate, async (req, res) => {
    const { name, slug } = req.body;
    const { id: userId } = req.user;

    try {
        const orgExist = await prisma.organisation.findUnique({
            where: {
                slug,
            },
        });

        if (orgExist) {
            return res.status(409).json({
                message: "Slug must be unique",
            });
        }

        const organisation = await prisma.$transaction(async (tx) => {
            //organisation
            const org = await tx.organisation.create({
                data: {
                    name,
                    slug,
                },
            });

            const ownerRole = await tx.role.create({
                data: {
                    name: "OWNER",
                    isSystem: true,
                    organisationId: org.id,
                },
            });

            //create default permission(skip duplicates)
            const p = await tx.permission.createMany({
                data: defaultPermissions.map((perm) => ({
                    key: perm.key,
                    description: perm.description,
                    organisationId: org.id,
                })),
                skipDuplicates: true,
            });

            const permissions = await tx.permission.findMany({
                where: {
                    organisationId: org.id,
                    key: {
                        in: defaultPermissions.map((p) => p.key),
                    },
                },
            });

            await tx.rolePermission.createMany({
                data: permissions.map((perm) => ({
                    roleId: ownerRole.id,
                    permissionId: perm.id,
                })),
                skipDuplicates: true,
            });

            //memership
            await tx.memberShip.create({
                data: {
                    userId,
                    organisationId: org.id,
                    roleId: ownerRole.id,
                    isOwner: true,
                },
            });
            return org;
        });

        return res.json(organisation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * delete organisation
 */
router.delete(
    "/:organisationId",
    authenticate,
    requirePermission("organisation:delete"),
    async (req, res) => {
        const { organisationId } = req.params;
        const { id: userId } = req.user;

        try {
            const organisationExist = await prisma.organisation.findUnique({
                where: { id: organisationId },
            });

            if (!organisationExist) {
                return res
                    .status(404)
                    .json({ message: "Organisation not found" });
            }

            const membership = await prisma.memberShip.findFirst({
                where: {
                    userId,
                    organisationId,
                },
                include: {
                    role: true,
                },
            });

            if (!membership) {
                return res.status(403).json({
                    message: "You are not a member of this organisation",
                });
            }

            //TODO: role based organisation delete
            //For now owner can delete organisation
            if (!membership.isOwner) {
                return res.status(403).json({
                    message: "Only owner can delete organisation",
                });
            }

            //delete transaction
            await prisma.$transaction(async (tx) => {
                //membership
                await tx.memberShip.deleteMany({
                    where: {
                        organisationId,
                    },
                });

                //role permissions
                await tx.rolePermission.deleteMany({
                    where: {
                        role: {
                            organisationId,
                        },
                    },
                });

                //role
                await tx.role.deleteMany({
                    where: {
                        organisationId,
                    },
                });

                //permission
                await tx.permission.deleteMany({
                    where: {
                        organisationId,
                    },
                });

                //organisation
                await tx.organisation.delete({
                    where: {
                        id: organisationId,
                    },
                });
            });

            return res.json({
                message: "Organisation deleted successfully",
            });
        } catch (error) {
            return res.status(400).json({
                error: error.message,
            });
        }
    },
);

/**
 * switch organisation
 */
router.post("/switch", authenticate, async (req, res) => {
    const { organisationId } = req.body;
    const { id: userId } = req.user;

    const membership = await prisma.memberShip.findFirst({
        where: {
            userId: req.user.id,
            organisationId,
        },
        include: {
            organisation: true,
        },
    });

    if (!membership) {
        return res.status(403).json({ message: "Not a member of this org" });
    }

    //session implement
    const sessionId = crypto.randomUUID();
    const token = signToken({
        userId: req.user.id,
        organisationId,
        organisationName: membership.organisation.name,
        sessionId,
    });

    const tokenHash = hashToken(token);

    const sessionExpireAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.session.upsert({
        where: {
            userId_userAgent_ipAddress: {
                userId,
                userAgent: req.headers["user-agent"],
                ipAddress: req.ip,
            },
        },
        update: {
            id: sessionId,
            tokenHash,
            revoked: false,
            expiresAt: sessionExpireAt,
        },
        create: {
            id: sessionId,
            userId,
            tokenHash,
            revoked: false,
            userAgent: req.headers["user-agent"],
            ipAddress: req.ip,
            expiresAt: sessionExpireAt,
        },
    });

    res.json({ token });
});

module.exports = router;
