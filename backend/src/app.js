const cors = require("cors");
const express = require("express");

//routes
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

app.get("/", (req, res) => {
    res.status(200).json("IAM Backend running...");
});
app.use("/api/auth", authRoutes);
app.use("/api/permissions", permissionsRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/users", userRoutes);
app.use("/api/invite", inviteRoutes);
app.use("/api/organisation", organisationRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
});

module.exports = app;
