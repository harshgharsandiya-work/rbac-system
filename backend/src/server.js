require("dotenv").config();

const express = require("express");
const prisma = require("./config/prisma");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json("IAM Backend running...");
});

const PORT = process.env.PORT || 4000;

(async () => {
    try {
        await prisma.$connect();
        console.log("Database connected!");
        app.listen(
            PORT,
            console.log(`Server running at http://localhost:${PORT}`),
        );
    } catch (error) {
        console.error("Database connection failed", error);
        process.exit(1);
    }
})();
