// ─── Core sender (External API) ──────────────────────────────────────────────

export const sendEmail = async ({ to, subject, html }) => {
  // Guard: gracefully skip if no API URL is configured
  if (!process.env.EMAIL_API_URL) {
    console.warn("[EMAIL] Skipped — EMAIL_API_URL not set in .env");
    return;
  }

  try {
    const response = await fetch(process.env.EMAIL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: to,
        subject: subject,
        content: html,
      }),
    });

    if (!response.ok) {
      throw new Error(`External API responded with status: ${response.status}`);
    }

    console.info(`[EMAIL] Sent to ${to} via external API successfully.`);
  } catch (err) {
    // Log the error but don't re-throw — keeps the API route alive
    console.error(`[EMAIL] Failed to send to ${to} via external API: ${err.message}`);
  }
};

// ─── Verification email ──────────────────────────────────────────────────────

export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify your email – Smart Hire</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#2563eb,#1e40af);padding:32px 40px;">
              <p style="margin:0 0 4px;font-size:12px;font-weight:600;letter-spacing:2px;color:rgba(255,255,255,0.75);text-transform:uppercase;">Smart Hire</p>
              <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#ffffff;">Verify your email</h1>
              <span style="display:inline-block;padding:4px 14px;background:rgba(255,255,255,0.2);border-radius:20px;font-size:12px;font-weight:600;color:#fff;letter-spacing:0.5px;">✉ ACTION REQUIRED</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.6;">
                Thanks for signing up! Click the button below to verify your email address and activate your account.
              </p>
              <a href="${verificationUrl}"
                 style="display:inline-block;padding:14px 32px;background:#2563eb;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;">
                Verify Email
              </a>
              <p style="margin:24px 0 0;font-size:13px;color:#9ca3af;">
                Or paste this link in your browser:<br/>
                <span style="color:#2563eb;word-break:break-all;">${verificationUrl}</span>
              </p>
              <p style="margin:16px 0 0;font-size:13px;color:#9ca3af;">This link will expire soon. If you didn't create an account, you can safely ignore this email.</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:0 40px 32px;">
              <p style="margin:0;font-size:12px;color:#d1d5db;text-align:center;">© 2026 Smart Hire &nbsp;|&nbsp; All rights reserved</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();

  await sendEmail({ to: email, subject: "Verify your Smart Hire account ✉", html });
};

// ─── Password reset email ────────────────────────────────────────────────────

export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset your password – Smart Hire</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#7c3aed,#5b21b6);padding:32px 40px;">
              <p style="margin:0 0 4px;font-size:12px;font-weight:600;letter-spacing:2px;color:rgba(255,255,255,0.75);text-transform:uppercase;">Smart Hire</p>
              <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#ffffff;">Reset your password</h1>
              <span style="display:inline-block;padding:4px 14px;background:rgba(255,255,255,0.2);border-radius:20px;font-size:12px;font-weight:600;color:#fff;letter-spacing:0.5px;">🔐 SECURITY NOTICE</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.6;">
                We received a request to reset your password. Click the button below to choose a new one.
              </p>
              <a href="${resetUrl}"
                 style="display:inline-block;padding:14px 32px;background:#7c3aed;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;">
                Reset Password
              </a>
              <p style="margin:24px 0 0;font-size:13px;color:#9ca3af;">
                Or paste this link in your browser:<br/>
                <span style="color:#7c3aed;word-break:break-all;">${resetUrl}</span>
              </p>
              <p style="margin:16px 0 0;font-size:13px;color:#9ca3af;">If you didn't request a password reset, you can safely ignore this email. Your password will not change.</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:0 40px 32px;">
              <p style="margin:0;font-size:12px;color:#d1d5db;text-align:center;">© 2026 Smart Hire &nbsp;|&nbsp; All rights reserved</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();

  await sendEmail({ to: email, subject: "Reset your Smart Hire password 🔐", html });
};