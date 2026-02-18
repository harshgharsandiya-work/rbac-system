const prisma = require("../config/prisma");
const { hashToken } = require("../utils/hash");
const { verifyToken } = require("./token");

async function authenticate(req, res, next) {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing token" });
    }

    const token = header.split(" ")[1];

    try {
        const payload = verifyToken(token);

        const tokenHash = hashToken(token);

        const session = await prisma.session.findUnique({
            where: {
                tokenHash,
            },
        });

        if (!session) {
            return res.status(401).json({ message: "Session not found" });
        }

        if (session.revoked) {
            return res.status(401).json({ message: "Session revoked" });
        }

        if (session.expiresAt < new Date()) {
            return res.status(401).json({ message: "Session expired" });
        }

        req.user = {
            id: payload.userId,
            organisationId: payload.organisationId || null,
            organisationName: payload.organisationName,
            sessionId: payload.sessionId,
        };

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = { authenticate };
