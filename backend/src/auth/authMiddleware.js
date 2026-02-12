const { verifyToken } = require("./token");

function authenticate(req, res, next) {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing token" });
    }

    const token = header.split(" ")[1];

    try {
        const payload = verifyToken(token);

        req.user = {
            id: payload.userId,
            organisationId: payload.organisationId || null,
            organisationName: payload.organisationName,
        };

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = { authenticate };
