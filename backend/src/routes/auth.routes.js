const express = require("express");

const { signToken } = require("../auth/token");
const prisma = require("../config/prisma");
const { hashPassword, verifyPassword } = require("../auth/password");
const { authenticate } = require("../auth/authMiddleware");

const router = express.Router();

//register
router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (user) {
        return res.status(400).json({ message: "User is aldready registered" });
    }

    //hash password
    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
        },
    });

    res.json({
        message: "User registered",
        user: newUser.email,
    });
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

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    //if user has no organisation --> create default one
    if (!user.memberShips.length) {
        const organisation = await prisma.organisation.create({
            data: {
                name: `${email.split("@")[0]}'s Workspace`,
            },
        });

        //create owner role
        const ownerRole = await prisma.role.create({
            data: {
                organisationId: organisation.id,
                name: "OWNER",
            },
        });

        //set of default permission
        const defaultPermissions = [
            "user:create",
            "user:read",
            "user:update",
            "user:delete",
            "role:create",
            "role:read",
            "role:update",
            "role:delete",
            "permission:create",
            "permission:read",
            "permission:update",
            "permission:delete",
        ];

        for (const key of defaultPermissions) {
            const permission = await prisma.permission.upsert({
                where: {
                    key_organisationId: {
                        key,
                        organisationId: organisation.id,
                    },
                },
                update: {},
                create: {
                    key,
                    organisationId: organisation.id,
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
            },
        });

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
    }

    //pick default org (logic: first org)
    const defaultOrg = user.memberShips[0].organisation;

    const token = signToken({
        userId: user.id,
        organisationId: defaultOrg.id,
        organisationName: defaultOrg.name,
    });

    const organisations = user.memberShips.map((m) => ({
        id: m.id,
        name: m.organisation.name,
        role: m.role.name,
    }));

    res.json({ token, organisations, activeOrganisation: defaultOrg });
});

// switch organisation
router.post("/switch-org", authenticate, async (req, res) => {
    const { organisationId } = req.body;

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
    membership.organisation.name;

    const token = signToken({
        userId: req.user.id,
        organisationId,
        organisationName: membership.organisation.name,
    });

    res.json({ token });
});

module.exports = router;
