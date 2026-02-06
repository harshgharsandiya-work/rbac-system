const express = require("express");
const prisma = require("../config/prisma");
const { canAccess } = require("../rbac/canAccess");

const router = express.Router();

router.post("/demo", async (req, res) => {
    const { userId, orgId } = req.body;

    const canCreate = await canAccess(userId, orgId, "project:create");
    res.json({
        canCreate,
    });
});

module.exports = router;
