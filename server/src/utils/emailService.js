import nodemailer from "nodemailer";


const getTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendEmail = async ({ to, subject, html }) => {

  const transporter = getTransporter(); 
  
  await transporter.sendMail({
    from: `"Smart Hire" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: subject,
    html: html,
  });
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