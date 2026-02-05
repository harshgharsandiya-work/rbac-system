require("dotenv").config();

const prisma = require("./config/prisma");

const app = require("./app");

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
