const prisma = require("../config/prisma");
const { hashApiKey } = require("../utils/apiKey");

async function apiKeyAuth(req, res, next) {
    try {
        const header = req.headers["x-api-key"];

        if (!header) {
            return res.status(401).json({
                message: "API key is required",
            });
        }

        const hashed = hashApiKey(header);

        const apiKey = await prisma.apiKey.findUnique({
            where: {
                keyHash: hashed,
            },
            include: {
                organisation: true,
                user: true,
            },
        });

        if (!apiKey || apiKey.revoked) {
            return res.status(401).json({ message: "Invalid API key" });
        }

        if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
            return res.status(401).json({
                message: "API key expired",
            });
        }

        req.api = {
            organisationId: apiKey.organisationId,
            userId: apiKey.createdByUserId,
        };

        next();
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = apiKeyAuth;
