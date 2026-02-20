const express = require("express");
const prisma = require("../config/prisma");
const { canAccess } = require("../rbac/canAccess");
const apiKeyAuth = require("../auth/apiKey.middleware");
const { authenticate } = require("../auth/authMiddleware");

const router = express.Router();

router.get("/access", apiKeyAuth, async (req, res) => {
    const { organisationId, userId } = req.api;

    res.json({
        message: "API1 key is valid",
        organisationId,
        userId,
    });
});

module.exports = router;
