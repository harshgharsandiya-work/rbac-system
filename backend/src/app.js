const cors = require("cors");
const express = require("express");

const { requirePermission } = require("./rbac/requirePermission");
const { authenticate } = require("./auth/authMiddleware");

//routes
const demoRoutes = require("./routes/demo.routes");
const authRoutes = require("./routes/auth.routes");
const permissionsRoutes = require("./routes/permissions.routes");
const rolesRoutes = require("./routes/roles.routes");
const userRoutes = require("./routes/user.routes");
const inviteRoutes = require("./routes/invite.routes");
const organisationRoutes = require("./routes/organisation.routes");

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }),
);
app.use(express.json());

app.post(
    "/projects",
    authenticate,
    requirePermission("project:create"),
    (req, res) => {
        res.json({ message: "Project created 🎉" });
    },
);

app.get("/", (req, res) => {
    res.status(200).json("IAM Backend running...");
});

app.use("/api", demoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/permissions", permissionsRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/users", userRoutes);
app.use("/api/invite", inviteRoutes);
app.use("/api/organisation", organisationRoutes);

module.exports = app;
