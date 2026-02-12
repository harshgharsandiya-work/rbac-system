const express = require("express");
const prisma = require("../config/prisma");
const { canAccess } = require("../rbac/canAccess");

const router = express.Router();

router.post("/demo", async (req, res) => {
    const { userId, organisationId } = req.body;

    const canCreate = await canAccess(userId, organisationId, "project:create");
    res.json({
        canCreate,
    });
});

module.exports = router;
