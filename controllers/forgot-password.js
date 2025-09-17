// // controllers/authController.js
// const crypto = require("crypto");
// const nodemailer = require("nodemailer");
// const bcrypt = require("bcryptjs");
// const User = require("../models/register");

// // Forgot Password - send email link & return token (for testing)
// const CLIENT_URL = process.env.CLIENT_URL || "https://crime-reporting-system-71kx.onrender.com";

// // Forgot Password - send email link & return token (for testing)
// exports.forgotPassword = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // generate token
//     const resetToken = crypto.randomBytes(20).toString("hex");
//     console.log("Reset token:", resetToken);

//     // save token & expiry
//     user.resetPasswordToken = resetToken;
//     user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
//     await user.save();

//     // 🚀 For testing: return token in response
//     res.json({
//       message: "Password reset token generated",
//       resetToken: resetToken,
//       resetLink: `${CLIENT_URL}/api/reset-password/${resetToken}`, // <-- deployed link
//       expiry: user.resetPasswordExpires,
//     });

//     // ⚠️ Send mail in production
//     /*
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       to: user.email,
//       from: process.env.EMAIL_USER,
//       subject: "Password Reset",
//       text: `You requested a password reset.\n\n
//       Click the link to reset your password:\n
//       ${CLIENT_URL}/api/reset-password/${resetToken}\n\n
//       This link is valid for 1 hour.`,
//     };

//     await transporter.sendMail(mailOptions);
//     */
//   } catch (err) {
//     console.error("Forgot password error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Reset Password API
// exports.resetPassword = async (req, res) => {
//   const { token } = req.params;
//   const { password } = req.body;

//   try {
//     const user = await User.findOne({
//       resetPasswordToken: token,
//       resetPasswordExpires: { $gt: Date.now() }, // still valid
//     });

//     if (!user) return res.status(400).json({ message: "Invalid or expired token" });

//     // hash new password
//     user.password = await bcrypt.hash(password, 10);
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;

//     await user.save();

//     res.json({ message: "Password reset successful", email: user.email });
//   } catch (err) {
//     console.error("Reset password error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
// controllers/authController.js

const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const User = require("../models/register");

const CLIENT_URL = process.env.CLIENT_URL || "https://crime-reporting-system-71kx.onrender.com";

// Forgot Password - send email link
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // save token & expiry
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
    await user.save();

    // transporter setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    // mail options
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset - Crime Reporting System",
      text: `Hello ${user.username || "User"},\n\n
      You requested a password reset.\n\n
      Click the link below to reset your password:\n
      ${CLIENT_URL}/api/reset-password/${resetToken}\n\n
      This link is valid for 1 hour.\n\n
      If you did not request this, please ignore this email.`,
    };

    // send mail
    await transporter.sendMail(mailOptions);

    // return response with token (for testing)
    res.json({
      message: "Password reset link sent to your email",
      resetToken: resetToken, // ✅ returned for testing
      expiry: user.resetPasswordExpires, // ✅ optional
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Reset Password API
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // still valid
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    // hash new password
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password reset successful", email: user.email });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};