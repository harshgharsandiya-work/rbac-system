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

const router = express.Router();

//register
router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (user && user.isActive) {
        return res.status(400).json({ message: "User is aldready registered" });
    }

    //hash password
    const passwordHash = await hashPassword(password);

    const newUser = await prisma.user.upsert({
        where: {
            email,
        },
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
});

//verify mail
router.post("/verify-email", async (req, res) => {
    const { email, token } = req.body;

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
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

    try {
        await verifyToken(user.id, "EMAIL_VERIFY", token);

        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                isActive: true,
            },
        });

        //if user has no organisation --> create default one
        if (!user.memberShips.length) {
            const organisation = await prisma.organisation.create({
                data: {
                    name: `${email.split("@")[0]}'s Workspace`,
                    slug: `${email.replace(/[.@]/g, "-")}`,
                },
            });

            //create owner role
            const ownerRole = await prisma.role.create({
                data: {
                    organisationId: organisation.id,
                    name: "OWNER",
                    isSystem: true,
                },
            });

            //set of default permission
            const defaultPermissions = [
                {
                    key: "user:create",
                    description:
                        "Allows creating new users in the organisation",
                },
                {
                    key: "user:read",
                    description: "Allows viewing users in the organisation",
                },
                {
                    key: "user:update",
                    description: "Allows updating user information",
                },
                {
                    key: "user:delete",
                    description: "Allows deleting users",
                },
                {
                    key: "role:create",
                    description: "Allows creating new roles",
                },
                {
                    key: "role:read",
                    description: "Allows viewing roles",
                },
                {
                    key: "role:update",
                    description: "Allows updating roles",
                },
                {
                    key: "role:delete",
                    description: "Allows deleting roles",
                },
                {
                    key: "permission:create",
                    description: "Allows creating permissions",
                },
                {
                    key: "permission:read",
                    description: "Allows viewing permissions",
                },
                {
                    key: "permission:update",
                    description: "Allows updating permissions",
                },
                {
                    key: "permission:delete",
                    description: "Allows deleting permissions",
                },
            ];

            for (const perm of defaultPermissions) {
                const permission = await prisma.permission.upsert({
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

                await prisma.rolePermission.create({
                    data: {
                        roleId: ownerRole.id,
                        permissionId: permission.id,
                    },
                });
            }

            // assign owner membership
            await prisma.memberShip.create({
                data: {
                    userId: user.id,
                    organisationId: organisation.id,
                    roleId: ownerRole.id,
                    isOwner: true,
                },
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
    const { email, password } = req.body;

    let user = await prisma.user.findUnique({
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

        if (!verificationToken || verificationToken.expiresAt < new Date()) {
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

    user = await prisma.user.findUnique({
        where: {
            id: user.id,
        },
        include: {
            memberShips: {
                include: {
                    organisation: true,
                    role: true,
                },
            },
        },
    });

    //pick default org (logic: first org)
    const defaultOrg = user.memberShips[0].organisation;

    //session based login
    const sessionId = crypto.randomUUID();
    const token = signToken({
        userId: user.id,
        organisationId: defaultOrg.id,
        organisationName: defaultOrg.name,
        sessionId,
    });
    const tokenHash = hashToken(token);

    const sessionExpireAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.session.upsert({
        where: {
            userId_userAgent_ipAddress: {
                userId: user.id,
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
            userId: user.id,
            tokenHash,
            revoked: false,
            userAgent: req.headers["user-agent"],
            ipAddress: req.ip,
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
        roles: effectivePermissions.roles,
        permissions: effectivePermissions.permissions,
    });
});

//password reset using current password (logged in user)
router.post("/reset-password", authenticate, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const userId = req.user.id;

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    const isValid = await verifyPassword(currentPassword, user.passwordHash);

    if (!isValid) {
        return res.status(400).json({
            message: "Current password is incorrect",
        });
    }

    const newPasswordHash = await hashPassword(newPassword);

    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            passwordHash: newPasswordHash,
        },
    });

    res.json({ message: "Password successfully updated" });
});

//forgot password (using email verification)
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
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
});

//verify reset password token --> set new password
router.post("/reset-password-token", async (req, res) => {
    const { email, token, newPassword } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        await verifyToken(user.id, "PASSWORD_RESET", token);

        const newPasswordHash = await hashPassword(newPassword);

        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                passwordHash: newPasswordHash,
            },
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

//TODO: two factor

//logout current device
router.post("/logout", authenticate, async (req, res) => {
    const { sessionId } = req.user;

    await prisma.session.update({
        where: { id: sessionId },
        data: {
            revoked: true,
        },
    });

    return res.json({ message: "Logged out successfully" });
});

//logout all device
router.post("/logout-all", authenticate, async (req, res) => {
    const { id } = req.user;

    await prisma.session.updateMany({
        where: { userId: id, revoked: false },
        data: { revoked: true },
    });

    res.json({ message: "Logged out from all devices" });
});

module.exports = router;
