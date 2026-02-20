const express = require("express");

const { authenticate } = require("../auth/authMiddleware");
const { generateApiKey, hashApiKey } = require("../utils/apiKey");
const prisma = require("../config/prisma");
const { requirePermission } = require("../rbac/requirePermission");

const router = express.Router();

//create api key
router.post("/", authenticate, async (req, res) => {
    const { id: userId, organisationId } = req.user;
    const { name } = req.body;

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1day

    if (!name) {
        return res.status(404).json({ message: "API name required" });
    }

    const rawKey = generateApiKey();
    const keyHash = hashApiKey(rawKey);

    const apiKey = await prisma.apiKey.create({
        data: {
            name,
            keyHash,
            createdByUserId: userId,
            organisationId,
            expiresAt: expiresAt ? new Date(expiresAt) : null,
        },
    });

    res.status(201).json({
        id: apiKey.id,
        name: apiKey.name,
        key: rawKey, //return only once
        expiresAt: apiKey.expiresAt,
    });
});

//list all api key per user per organisation
router.get("/", authenticate, async (req, res) => {
    const { id: userId, organisationId } = req.user;

    try {
        const apiKeys = await prisma.apiKey.findMany({
            where: {
                createdByUserId: userId,
                organisationId,
            },
            select: {
                id: true,
                name: true,
                revoked: true,
                createdAt: true,
                expiresAt: true,
            },

            orderBy: { createdAt: "desc" },
        });

        return res.json(apiKeys);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch API keys" });
    }
});

//list all api key per organisation
router.get(
    "/all",
    authenticate,
    requirePermission("api:read"),
    async (req, res) => {
        const { organisationId } = req.user;

        try {
            const apiKeys = await prisma.apiKey.findMany({
                where: {
                    organisationId,
                },
                select: {
                    id: true,
                    name: true,
                    revoked: true,
                    createdAt: true,
                    expiresAt: true,
                },

                orderBy: { createdAt: "desc" },
            });

            return res.json(apiKeys);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Failed to fetch API keys" });
        }
    },
);

//revoke api key
router.patch("/:id/revoke", authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { organisationId, id: userId } = req.user;

        const apiKey = await prisma.apiKey.findFirst({
            where: {
                id,
                organisationId,
                createdByUserId: userId,
            },
        });

        if (!apiKey) {
            return res.status(404).json({ message: "API key not found" });
        }

        await prisma.apiKey.update({
            where: { id },
            data: { revoked: true },
        });

        res.json({ message: "API key revoked" });
    } catch (error) {
        res.status(500).json({ message: "Failed to revoke key" });
    }
});

//delete api key
router.delete("/:id", authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { organisationId, id: userId } = req.user;

        const apiKey = await prisma.apiKey.findFirst({
            where: {
                id,
                organisationId,
                createdByUserId: userId,
            },
        });

        if (!apiKey) {
            return res.status(404).json({ message: "API key not found" });
        }

        await prisma.apiKey.delete({
            where: { id },
        });

        res.json({ message: "API key deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete key" });
    }
});

module.exports = router;
