const express = require("express");

const demoRoutes = require("./routes/demo.routes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json("IAM Backend running...");
});

app.use("/api", demoRoutes);

module.exports = app;
