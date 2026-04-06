import nodemailer from "nodemailer";

const getTransporter = () => {
  // 1. Grab the variables
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  // 2. The Trap: If they are missing, crash with a loud error in the Render logs
  if (!user || !pass) {
    console.error("=========================================");
    console.error("🚨 NODEMAILER FATAL ERROR 🚨");
    console.error("EMAIL_USER is:", user ? `Found (${user})` : "UNDEFINED OR EMPTY");
    console.error("EMAIL_PASS is:", pass ? "Found (Hidden for security)" : "UNDEFINED OR EMPTY");
    console.error("=========================================");
    throw new Error("Cannot connect to Gmail. Environment variables are missing or empty on the Render server.");
  }

  // 3. Create the transporter safely
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      // .trim() removes invisible accidental spaces copied from the Render dashboard
      user: user.trim(), 
      pass: pass.trim(),
    },
  });
};

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = getTransporter(); 
  
  await transporter.sendMail({
    from: `"Smart Hire" <${process.env.EMAIL_USER.trim()}>`,
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