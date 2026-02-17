const { transporter } = require("../config/mailer");

async function sendEmail({ to, subject, html }) {
    await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        html,
    });
}

async function sendVerificationEmail(email, token) {
    const html = `
    <div style="font-family: Arial; padding:20px;">
      <h2>Email Verification</h2>
      <p>Your verification code:</p>
      <h1>${token}</h1>
      <p>This code expires in 10 minutes.</p>
    </div>
    `;

    return sendEmail({
        to: email,
        subject: "Verify your email",
        html,
    });
}

async function sendForgotPasswordEmail(email, token) {
    const html = `
    <div style="font-family: Arial; padding:20px;">
      <h2>Forgot password reset</h2>
      <p>Your reset password code:</p>
      <h1>${token}</h1>
      <p>This code expires in 10 minutes.</p>
    </div>
    `;

    return sendEmail({
        to: email,
        subject: "Reset your password",
        html,
    });
}

module.exports = {
    sendVerificationEmail,
    sendForgotPasswordEmail,
};
