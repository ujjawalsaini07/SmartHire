import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Generic send email function
export const sendEmail = async ({ to, subject, html }) => {
  const { error } = await resend.emails.send({
    from: "Smart Hire <onboarding@resend.dev>", // use this until you add a custom domain
    to,
    subject,
    html,
  });

  if (error) {
    throw new Error(error.message);
  }
};

export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const html = `
    <h2>Email Verification</h2>
    <p>Please verify your email by clicking the link below:</p>
    <a href="${verificationUrl}">Verify Email</a>
    <p>This link will expire soon.</p>
  `;

  await sendEmail({ to: email, subject: "Verify your email", html });
};

export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const html = `
    <h2>Password Reset</h2>
    <p>Click the link below to reset your password:</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>If you didn't request this, ignore this email.</p>
  `;

  await sendEmail({ to: email, subject: "Reset your password", html });
};