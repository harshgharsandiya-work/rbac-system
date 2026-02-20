const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

async function verifyEmailConnection() {
    try {
        await transporter.verify();
        console.log("Mail server ready");
    } catch (error) {
        console.error("Mail server error: ", error);
    }
}

verifyEmailConnection();

module.exports = {
    transporter,
    verifyEmailConnection,
};
