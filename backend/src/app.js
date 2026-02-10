const express = require("express");

const demoRoutes = require("./routes/demo.routes");
const { requirePermission } = require("./rbac/requirePermission");
const { authenticate } = require("./auth/authMiddleware");
const { signToken } = require("./auth/token");
const prisma = require("./config/prisma");
const { verifyPassword } = require("./auth/password");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    req.userId = "10c44724-0164-43e2-aa07-0a790ea3a164";
    req.organisationId = "f89da722-1b24-47d8-8c62-a971a50a01b4";
    next();
});

// login
app.post("/login", async (req, res) => {
    const { email, password, organisationId } = req.body;

    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            memberShips: {
                where: { organisationId },
            },
        },
    });

    if (!user || user.memberShips.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken({ userId: user.id, organisationId });

    res.json({ token });
});

app.post(
    "/projects",
    authenticate,
    requirePermission("user:create"),
    (req, res) => {
        res.json({ message: "Project created 🎉" });
    },
);

app.get("/", (req, res) => {
    res.status(200).json("IAM Backend running...");
});

app.use("/api", demoRoutes);

module.exports = app;
