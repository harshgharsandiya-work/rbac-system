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

async function sendInviteEmail(email, organisationName, token) {
    const inviteUrl = `${process.env.FRONTEND_URL}/accept-invite?token=${token}`;

    const html = `
    <h2>You're Invited </h2>
    <p>You have been invited to join <b>${organisationName}</b>.</p>
    <a href="${inviteUrl}" 
         style="padding:10px 16px;background:#000;color:#fff;text-decoration:none;border-radius:6px;">
         Accept Invite
    </a>
    <p>If you didn’t expect this email, ignore it.</p>
    `;

    await sendEmail({
        to: email,
        subject: "Invite Mail to join organisation",
        html,
    });
}

module.exports = {
    sendVerificationEmail,
    sendForgotPasswordEmail,
    sendInviteEmail,
};
