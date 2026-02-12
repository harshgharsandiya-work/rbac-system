const { canAccess } = require("./canAccess");

/**
 * RBAC Middleware
 * @todo userId and organisationId temp for now
 */

function requirePermission(permissionKey) {
    return async function (req, res, next) {
        const userId = req.user.id;
        const organisationId = req.user.organisationId;

        if (!userId || !organisationId) {
            return res.status(403).json({ message: "Unauthenticated" });
        }

        const allowed = await canAccess(userId, organisationId, permissionKey);

        if (!allowed) {
            return res.status(403).json({ message: "Forbidden" });
        }

        next();
    };
}

module.exports = { requirePermission };
