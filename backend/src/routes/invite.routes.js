const express = require("express");
const crypto = require("crypto");

const { authenticate } = require("../auth/authMiddleware");
const { requirePermission } = require("../rbac/requirePermission");
const prisma = require("../config/prisma");
const { sendInviteEmail } = require("../service/email.service");

const router = express.Router();

const INVITE_EXPIRY_HOURS = 3;

//Create invite for user
router.post(
    "/",
    authenticate,
    requirePermission("user:create"),
    async (req, res) => {
        const { email, roleIds } = req.body;
        const { organisationId, organisationName } = req.user;

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const token = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const expiresAt = new Date(
            Date.now() + INVITE_EXPIRY_HOURS * 60 * 60 * 1000,
        );

        const invite = await prisma.organisationInvite.upsert({
            where: {
                email_organisationId: {
                    email,
                    organisationId,
                },
            },
            update: {
                roleIds,
                tokenHash,
                expiresAt,
            },
            create: {
                email,
                organisationId,
                roleIds,
                tokenHash,
                expiresAt,
            },
        });

        await sendInviteEmail(email, organisationName, token);

        res.status(201).json({
            message: "Invite created",
            inviteToken: token,
        });
    },
);

//Accept invite
router.post("/accept", async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ message: "Token required" });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const invite = await prisma.organisationInvite.findUnique({
        where: { tokenHash },
    });

    if (!invite || invite.accepted) {
        return res.status(400).json({
            message: "Invalid invite",
        });
    }

    if (invite.expiresAt < new Date()) {
        return res.status(400).json({
            message: "Token expires",
        });
    }

    const user = await prisma.user.findUnique({
        where: {
            email: invite.email,
        },
    });

    console.log(user);

    if (!user) {
        return res.status(400).json({
            message: "User not registered",
        });
    }

    await prisma.$transaction(async (tx) => {
        for (const roleId of invite.roleIds) {
            const role = await tx.role.findUnique({
                where: {
                    id: roleId,
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
            where: { tokenHash },
            data: { accepted: true },
        });
    });

    res.json({
        message: "Invite accepted",
    });
});

module.exports = router;
