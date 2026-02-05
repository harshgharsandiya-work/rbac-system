const express = require("express");
const { hasPermission } = require("../rbac/permissionCheck");
const prisma = require("../config/prisma");

const router = express.Router();

router.get("/demo", async (req, res) => {
    const user = await prisma.user.findUnique({
        where: {
            email: "user@example.com",
        },
    });

    const isAllowed = await hasPermission(user.id, "user:read");

    if (!isAllowed) {
        return res.status(403).json({ message: "Forbidden" });
    }

    res.json({ message: "You can read users" });
});

module.exports = router;
