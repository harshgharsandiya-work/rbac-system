const express = require("express");

const demoRoutes = require("./routes/demo.routes");
const { requirePermission } = require("./rbac/requirePermission");
const { authenticate } = require("./auth/authMiddleware");
const { signToken } = require("./auth/token");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    req.userId = "10c44724-0164-43e2-aa07-0a790ea3a164";
    req.orgId = "f89da722-1b24-47d8-8c62-a971a50a01b4";
    next();
});

// temp login
app.post("/login", async (req, res) => {
    const { userId, orgId } = req.body;

    const token = signToken({ userId, orgId });

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
