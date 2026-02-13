const express = require("express");
const crypto = require("crypto");

const { authenticate } = require("../auth/authMiddleware");
const { requirePermission } = require("../rbac/requirePermission");
const prisma = require("../config/prisma");

const router = express.Router();

//Create invite for user
router.post(
    "/",
    authenticate,
    requirePermission("user:create"),
    async (req, res) => {
        const { email, roleNames } = req.body;
        const { organisationId } = req.user;

        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000); // 3 hours

        const invite = await prisma.organisationInvite.upsert({
            where: {
                email_organisationId: {
                    email,
                    organisationId,
                },
            },
            update: {
                roleNames,
                token,
                expiresAt,
            },
            create: {
                email,
                organisationId,
                roleNames,
                token,
                expiresAt,
            },
        });

        res.status(201).json({
            message: "Invite created",
            //TODO: send via mail
            inviteToken: token,
        });
    },
);

//Accept invite
router.post("/accept", async (req, res) => {
    const { token } = req.body;

    const invite = await prisma.organisationInvite.findUnique({
        where: { token },
    });

    if (!invite || invite.accepted) {
        return res.json(400).json({
            message: "Invalid invite",
        });
    }

    if (invite.expiresAt < new Date()) {
        return res.json(400).json({
            message: "Token expires",
        });
    }

    const user = await prisma.user.findUnique({
        where: {
            email: invite.email,
        },
    });

    if (!user) {
        return res.status(400).json({
            message: "User not registered",
        });
    }

    await prisma.$transaction(async (tx) => {
        for (const roleName of invite.roleNames) {
            const role = await tx.role.findUnique({
                where: {
                    name_organisationId: {
                        name: roleName,
                        organisationId: invite.organisationId,
                    },
                },
            });

            if (role) {
                await tx.memberShip.upsert({
                    where: {
                        userId_organisationId_roleId: {
                            userId: user.id,
                            organisationId: invite.organisationId,
                            roleId: role.id,
                        },
                    },
                    update: {},
                    create: {
                        userId: user.id,
                        organisationId: invite.organisationId,
                        roleId: role.id,
                    },
                });
            }
        }

        await tx.organisationInvite.update({
            where: { token },
            data: { accepted: true },
        });
    });

    res.json({
        message: "Invite accepted",
    });
});

module.exports = router;
