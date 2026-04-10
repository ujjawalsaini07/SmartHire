// import User from "../models/User.model.js";
// import { sendEmail } from "../utils/emailService.js"; // Adjust path to your service file
// import Notification from "../models/Notification.model.js";

// /**
//  * @desc    Recruiter contacts a candidate directly
//  * @route   POST /api/v1/emails/contact-candidate
//  * @access  Private (Recruiter)
//  */
// export const contactCandidate = async (req, res) => {
//   try {
//     const { candidateId, subject, message } = req.body;
//     const recruiterName = `${req.user.firstName} ${req.user.lastName}`; // Assuming attached by middleware

//     // 1. Validate input
//     if (!candidateId || !subject || !message) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide candidateId, subject, and message",
//       });
//     }

//     // 2. Find Candidate
//     const candidate = await User.findById(candidateId);
//     if (!candidate) {
//       return res.status(404).json({
//         success: false,
//         message: "Candidate not found",
//       });
//     }

//     // 3. Construct Email HTML
//     // We wrap the message to look professional
//    const emailHtml = `
//   <div style="font-family: Arial, sans-serif; line-height: 1.5;">
//     <h3>New Message from Recruiter via Smart Hire</h3>
    
//     <p><strong>From:</strong> ${escapeHtml(recruiterName)}</p>
    
//     <hr />
    
//     <h4>${escapeHtml(subject)}</h4>
//     <p>${formatMessage(message)}</p>
    
//     <hr />
//   </div>
// `;

//     // 4. Send Email
//     // We set the "replyTo" as the recruiter's email so the candidate can reply directly
//     // Note: Since our generic helper might not support replyTo yet, we use the transporter directly or update helper
//     // For now, we will just send it normally.
//     await sendEmail({
//       to: candidate.email,
//       subject: `[Smart Hire] ${subject}`,
//       html: emailHtml,
//     });

//     // 5. Create Notification
//     await Notification.create({
//       user: candidateId,
//       type: "email",
//       title: "New Message from Recruiter",
//       message: `You received a message from ${recruiterName}: ${subject}. Please check your email inbox.`,
//     });

//     res.status(200).json({
//       success: true,
//       message: "Email sent to candidate successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error sending email",
//       error: error.message,
//     });
//   }
// };

// /**
//  * @desc    Admin sends broadcast email to users
//  * @route   POST /api/v1/emails/admin/broadcast
//  * @access  Private (Admin)
//  */
// export const sendBroadcastEmail = async (req, res) => {
//   try {
//     const { targetRole, subject, message } = req.body;

//     // 1. Validate Input
//     if (!subject || !message) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide subject and message",
//       });
//     }

//     // 2. Determine Recipients
//     let query = {};
//     if (targetRole && targetRole !== "all") {
//       query.role = targetRole;
//     }

//     // Fetch users (select only email to be lightweight)
//     const users = await User.find(query).select("email");

//     if (users.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No users found for the specified target",
//       });
//     }

//     // 3. Construct Email HTML
//     const emailHtml = `
//       <h3>Announcement from Smart Hire Admin</h3>
//       <hr />
//       <h3>${subject}</h3>
//       <div style="white-space: pre-wrap;">${message}</div>
//       <hr />
//       <p><small>You are receiving this email because you are a registered user of Smart Hire.</small></p>
//     `;

//     // 4. Send Emails (Bulk)
//     // Sending individually to avoid exposing all emails in "To" field
//     // In production, use a queue (like BullMQ) for this. For now, Promise.all is okay for small batches.
//     const emailPromises = users.map((user) =>
//       sendEmail({
//         to: user.email,
//         subject: `[Announcement] ${subject}`,
//         html: emailHtml,
//       })
//     );

//     await Promise.allSettled(emailPromises);

//     res.status(200).json({
//       success: true,
//       message: `Broadcast email queued for ${users.length} users`,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error sending broadcast emails",
//       error: error.message,
//     });
//   }
// };

// /**
//  * @desc    Admin contacts a recruiter directly
//  * @route   POST /api/v1/emails/admin/contact-recruiter
//  * @access  Private (Admin)
//  */
// export const adminContactRecruiter = async (req, res) => {
//   try {
//     const { recruiterId, subject, message } = req.body;

//     if (!recruiterId || !subject || !message) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide recruiterId, subject, and message",
//       });
//     }

//     const recruiter = await User.findById(recruiterId);
//     if (!recruiter) {
//       return res.status(404).json({
//         success: false,
//         message: "Recruiter not found",
//       });
//     }

//    const emailHtml = `
//   <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
//     <h3 style="margin-bottom: 10px;">Message from SmartHire System Admin</h3>
//     <hr style="border: none; border-top: 1px solid #ddd;" />
//     <h4 style="margin-top: 20px;">${escapeHtml(subject)}</h4>
//     <p style="margin-top: 10px;">
//       ${formatMessage(message)}
//     </p>
//     <hr style="border: none; border-top: 1px solid #ddd; margin-top: 20px;" />
//     <p style="font-size: 12px; color: gray;">
//       This is an administrative email from SmartHire.
//     </p>
//   </div>
// `;

//     await sendEmail({
//       to: recruiter.email,
//       subject: `[SmartHire Admin] ${subject}`,
//       html: emailHtml,
//     });

//     await Notification.create({
//       user: recruiterId,
//       type: "admin_alert",
//       title: "New Message from Admin",
//       message: `Admin sent you a message: ${subject}. Please check your email inbox.`,
//     });

//     res.status(200).json({
//       success: true,
//       message: "Admin email sent to recruiter successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error sending admin email",
//       error: error.message,
//     });
//   }
// };


import User from "../models/User.model.js";
import { sendEmail } from "../utils/emailService.js";
import Notification from "../models/Notification.model.js";

// ─── Helpers ────────────────────────────────────────────────────────────────

const escapeHtml = (str = "") =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const formatMessage = (str = "") =>
  escapeHtml(str).replace(/\n/g, "<br/>");

// ────────────────────────────────────────────────────────────────────────────

/**
 * @desc    Recruiter contacts a candidate directly
 * @route   POST /api/v1/emails/contact-candidate
 * @access  Private (Recruiter)
 */
export const contactCandidate = async (req, res) => {
  try {
    const { candidateId, subject, message } = req.body;
    const recruiterName = req.user.name;
    const recruiterEmail = req.user.email;

    if (!candidateId || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide candidateId, subject, and message",
      });
    }

    const candidate = await User.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h3>New Message from Recruiter via Smart Hire</h3>
        <p><strong>From:</strong> ${escapeHtml(recruiterName)}</p>
        <hr style="border: none; border-top: 1px solid #ddd;" />
        <h4>${escapeHtml(subject)}</h4>
        <p>${formatMessage(message)}</p>
        <hr style="border: none; border-top: 1px solid #ddd;" />
        <p style="font-size: 12px; color: gray;">
          You can reply directly to this email to respond to the recruiter.
        </p>
      </div>
    `;

    await sendEmail({
      to: candidate.email,
      replyTo: recruiterEmail,
      subject: `[Smart Hire] ${subject}`,
      html: emailHtml,
    });

    await Notification.create({
      user: candidateId,
      type: "email",
      title: "New Message from Recruiter",
      message: `You received a message from ${recruiterName}: ${subject}. Please check your email inbox.`,
    });

    res.status(200).json({
      success: true,
      message: "Email sent to candidate successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error sending email",
      error: error.message,
    });
  }
};

/**
 * @desc    Admin sends broadcast email to users
 * @route   POST /api/v1/emails/admin/broadcast
 * @access  Private (Admin)
 */
export const sendBroadcastEmail = async (req, res) => {
  try {
    const { targetRole, subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide subject and message",
      });
    }

    let query = {};
    if (targetRole && targetRole !== "all") {
      query.role = targetRole;
    }

    const users = await User.find(query).select("email");

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found for the specified target",
      });
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h3>Announcement from Smart Hire Admin</h3>
        <hr style="border: none; border-top: 1px solid #ddd;" />
        <h4>${escapeHtml(subject)}</h4>
        <p>${formatMessage(message)}</p>
        <hr style="border: none; border-top: 1px solid #ddd;" />
        <p style="font-size: 12px; color: gray;">
          You are receiving this email because you are a registered user of Smart Hire.
        </p>
      </div>
    `;

    const emailPromises = users.map((user) =>
      sendEmail({
        to: user.email,
        subject: `[Announcement] ${subject}`,
        html: emailHtml,
      })
    );

    await Promise.allSettled(emailPromises);

    res.status(200).json({
      success: true,
      message: `Broadcast email queued for ${users.length} users`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error sending broadcast emails",
      error: error.message,
    });
  }
};

/**
 * @desc    Admin contacts a recruiter directly
 * @route   POST /api/v1/emails/admin/contact-recruiter
 * @access  Private (Admin)
 */
export const adminContactRecruiter = async (req, res) => {
  try {
    const { recruiterId, subject, message } = req.body;

    if (!recruiterId || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide recruiterId, subject, and message",
      });
    }
    const replyTo = req.user.email; // reply to this email
    const recruiter = await User.findById(recruiterId);
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: "Recruiter not found",
      });
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h3>Message from SmartHire System Admin</h3>
        <hr style="border: none; border-top: 1px solid #ddd;" />
        <h4>${escapeHtml(subject)}</h4>
        <p>${formatMessage(message)}</p>
        <hr style="border: none; border-top: 1px solid #ddd;" />
        <p style="font-size: 12px; color: gray;">
          This is an administrative email from SmartHire.
        </p>
      </div>
    `;

    await sendEmail({
      to: recruiter.email,
      subject: `[SmartHire Admin] ${subject}`,
      html: emailHtml,
      replyTo,
    });

    await Notification.create({
      user: recruiterId,
      type: "admin_alert",
      title: "New Message from Admin",
      message: `Admin sent you a message: ${subject}. Please check your email inbox.`,
    });

    res.status(200).json({
      success: true,
      message: "Admin email sent to recruiter successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error sending admin email",
      error: error.message,
    });
  }
};