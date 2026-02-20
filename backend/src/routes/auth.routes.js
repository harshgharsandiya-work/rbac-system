const express = require("express");
const bcrypt = require("bcryptjs");

const { signToken } = require("../auth/token");
const prisma = require("../config/prisma");
const { hashPassword, verifyPassword } = require("../auth/password");
const { authenticate } = require("../auth/authMiddleware");
const { getEffectivePermissions } = require("../rbac/getEffectivePermissions");
const {
    sendVerificationEmail,
    sendForgotPasswordEmail,
} = require("../service/email.service");
const {
    createVerificationToken,
    verifyToken,
} = require("../service/token.service");
const { hashToken } = require("../utils/hash");
const { defaultPermissions } = require("../utils/permissions");

const router = express.Router();

//register
router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required" });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (user && user.isActive) {
            return res
                .status(400)
                .json({ message: "User is already registered" });
        }

        const passwordHash = await hashPassword(password);

        const newUser = await prisma.user.upsert({
            where: { email },
            update: {
                passwordHash,
                isActive: false,
            },
            create: {
                email,
                passwordHash,
                isActive: false,
            },
        });

        const token = await createVerificationToken(newUser.id, "EMAIL_VERIFY");
        await sendVerificationEmail(newUser.email, token);

        res.json({
            message: "Verification email sent",
            email: newUser.email,
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

//verify mail
router.post("/verify-email", async (req, res) => {
    const { email, token } = req.body;

    if (!email || !token) {
        return res
            .status(400)
            .json({ message: "Email and token are required" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                memberShips: {
                    include: {
                        organisation: true,
                        role: true,
                    },
                },
            },
        });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        await verifyToken(user.id, "EMAIL_VERIFY", token);

        await prisma.user.update({
            where: { id: user.id },
            data: { isActive: true },
        });

        if (!user.memberShips.length) {
            await prisma.$transaction(async (tx) => {
                const organisation = await tx.organisation.create({
                    data: {
                        name: `${email.split("@")[0]}'s Workspace`,
                        slug: `${email.replace(/[.@]/g, "-")}`,
                    },
                });

                const ownerRole = await tx.role.create({
                    data: {
                        organisationId: organisation.id,
                        name: "OWNER",
                        isSystem: true,
                    },
                });

                const permissionRecords = [];
                for (const perm of defaultPermissions) {
                    const permission = await tx.permission.upsert({
                        where: {
                            key_organisationId: {
                                key: perm.key,
                                organisationId: organisation.id,
                            },
                        },
                        update: {},
                        create: {
                            key: perm.key,
                            organisationId: organisation.id,
                            description: perm.description,
                        },
                    });
                    permissionRecords.push(permission);
                }

                await tx.rolePermission.createMany({
                    data: permissionRecords.map((p) => ({
                        roleId: ownerRole.id,
                        permissionId: p.id,
                    })),
                    skipDuplicates: true,
                });

                await tx.memberShip.create({
                    data: {
                        userId: user.id,
                        organisationId: organisation.id,
                        roleId: ownerRole.id,
                        isOwner: true,
                    },
                });
            });
        }

        res.json({
            message: "Mail successfully verified",
            email: user.email,
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

// login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required" });
        }

        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                memberShips: {
                    include: {
                        organisation: true,
                        role: true,
                    },
                },
            },
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (!user.isActive) {
            const verificationToken = await prisma.verificationToken.findFirst({
                where: {
                    userId: user.id,
                    type: "EMAIL_VERIFY",
                },
            });

            if (
                !verificationToken ||
                verificationToken.expiresAt < new Date()
            ) {
                const newToken = await createVerificationToken(
                    user.id,
                    "EMAIL_VERIFY",
                );

                await sendVerificationEmail(user.email, newToken);
                return res.status(403).json({
                    message: "Verification expired. New email sent.",
                });
            }

            return res.status(403).json({
                message: "Please verify your mail before logging in",
            });
        }

        if (!user.memberShips.length) {
            return res.status(403).json({
                message: "No organisation found. Please contact support.",
            });
        }

        const defaultOrg = user.memberShips[0].organisation;

        const userAgent = req.headers["user-agent"] || "unknown";
        const ipAddress = req.ip || "unknown";

        const sessionId = crypto.randomUUID();
        const token = signToken({
            userId: user.id,
            organisationId: defaultOrg.id,
            organisationName: defaultOrg.name,
            sessionId,
        });
        const tokenHash = hashToken(token);

        const sessionExpireAt = new Date(Date.now() + 60 * 60 * 1000);

        await prisma.session.upsert({
            where: {
                userId_userAgent_ipAddress: {
                    userId: user.id,
                    userAgent,
                    ipAddress,
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
                userId: user.id,
                tokenHash,
                revoked: false,
                userAgent,
                ipAddress,
                expiresAt: sessionExpireAt,
            },
        });

        const effectivePermissions = await getEffectivePermissions(
            user.id,
            defaultOrg.id,
        );

        res.json({
            email: user.email,
            token,
            organisationId: defaultOrg.id,
            organisationName: defaultOrg.name,
            organisationStatus: defaultOrg.isActive,
            roles: effectivePermissions.roles,
            permissions: effectivePermissions.permissions,
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

//password reset using current password (logged in user)
router.post("/reset-password", authenticate, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res
                .status(400)
                .json({ message: "Current and new password are required" });
        }

        const userId = req.user.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        const isValid = await verifyPassword(
            currentPassword,
            user.passwordHash,
        );

        if (!isValid) {
            return res.status(400).json({
                message: "Current password is incorrect",
            });
        }

        const newPasswordHash = await hashPassword(newPassword);

        await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash: newPasswordHash },
        });

        res.json({ message: "Password successfully updated" });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

//forgot password (using email verification)
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({
                message: "Account not exist",
            });
        }

        const token = await createVerificationToken(user.id, "PASSWORD_RESET");

        await sendForgotPasswordEmail(user.email, token);

        return res.status(200).json({
            message: "Reset OTP send to email",
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

//verify reset password token --> set new password
router.post("/reset-password-token", async (req, res) => {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
        return res
            .status(400)
            .json({ message: "Email, token, and new password are required" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new Error("User not found");
        }

        await verifyToken(user.id, "PASSWORD_RESET", token);

        const newPasswordHash = await hashPassword(newPassword);

        await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash: newPasswordHash },
        });
        res.json({
            message: "Password successfully reset",
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message,
        });
    }
});

//logout current device
router.post("/logout", authenticate, async (req, res) => {
    try {
        const { sessionId } = req.user;

        await prisma.session.update({
            where: { id: sessionId },
            data: { revoked: true },
        });

        return res.json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

//logout all device
router.post("/logout-all", authenticate, async (req, res) => {
    try {
        const { id } = req.user;

        await prisma.session.updateMany({
            where: { userId: id, revoked: false },
            data: { revoked: true },
        });

        res.json({ message: "Logged out from all devices" });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

module.exports = router;
