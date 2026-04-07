// ─── Core sender (External API) ──────────────────────────────────────────────

export const sendEmail = async ({ to, subject, html }) => {
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
    console.error(`[EMAIL] Failed to send to ${to} via external API: ${err.message}`);
  }
};

// ─── Verification email ──────────────────────────────────────────────────────

export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Verify your email</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellspacing="0" cellpadding="0" style="padding:30px 0;background:#f3f4f6;">
    <tr>
      <td align="center">
        <table width="520" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background:#2563eb;padding:28px;text-align:left;">
              <h2 style="margin:0;color:#ffffff;font-size:22px;">Smart Hire</h2>
              <p style="margin:6px 0 0;color:#dbeafe;font-size:13px;">Verify your email address</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px;">
              <p style="margin:0 0 18px;font-size:15px;color:#333;line-height:1.6;">
                Thank you for signing up. Please confirm your email address to activate your account.
              </p>

              <table cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" bgcolor="#2563eb" style="border-radius:6px;">
                    <a href="${verificationUrl}" 
                       style="display:inline-block;padding:12px 26px;font-size:14px;color:#ffffff;text-decoration:none;font-weight:bold;">
                      Verify Email
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:20px 0 0;font-size:13px;color:#666;">
                If the button doesn't work, copy and paste this link:
              </p>
              <p style="word-break:break-all;font-size:13px;color:#2563eb;">
                ${verificationUrl}
              </p>

              <p style="margin-top:18px;font-size:12px;color:#999;">
                If you did not create this account, you can ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px;text-align:center;font-size:12px;color:#aaa;">
              © 2026 Smart Hire. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();

  await sendEmail({ to: email, subject: "Verify your Smart Hire account", html });
};

// ─── Password reset email ────────────────────────────────────────────────────

export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Reset your password</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellspacing="0" cellpadding="0" style="padding:30px 0;background:#f3f4f6;">
    <tr>
      <td align="center">
        <table width="520" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background:#7c3aed;padding:28px;text-align:left;">
              <h2 style="margin:0;color:#ffffff;font-size:22px;">Smart Hire</h2>
              <p style="margin:6px 0 0;color:#ede9fe;font-size:13px;">Password reset request</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px;">
              <p style="margin:0 0 18px;font-size:15px;color:#333;line-height:1.6;">
                A request was received to reset your password. Click below to proceed.
              </p>

              <table cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" bgcolor="#7c3aed" style="border-radius:6px;">
                    <a href="${resetUrl}" 
                       style="display:inline-block;padding:12px 26px;font-size:14px;color:#ffffff;text-decoration:none;font-weight:bold;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:20px 0 0;font-size:13px;color:#666;">
                If the button doesn't work, copy and paste this link:
              </p>
              <p style="word-break:break-all;font-size:13px;color:#7c3aed;">
                ${resetUrl}
              </p>

              <p style="margin-top:18px;font-size:12px;color:#999;">
                If you did not request this, you can ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px;text-align:center;font-size:12px;color:#aaa;">
              © 2026 Smart Hire. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();

  await sendEmail({ to: email, subject: "Reset your Smart Hire password", html });
};