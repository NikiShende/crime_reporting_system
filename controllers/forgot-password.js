

// const crypto = require("crypto");
// const nodemailer = require("nodemailer");
// const bcrypt = require("bcryptjs");
// const User = require("../models/register");

// const CLIENT_URL = process.env.CLIENT_URL || "https://crime-reporting-system-71kx.onrender.com";

// // Forgot Password - send email link
// exports.forgotPassword = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // generate token
//     const resetToken = crypto.randomBytes(20).toString("hex");

//     // save token & expiry
//     user.resetPasswordToken = resetToken;
//     user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
//     await user.save();

//     // transporter setup
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER, // your Gmail
//         pass: process.env.EMAIL_PASS, // app password
//       },
//     });

//     // mail options
//     const mailOptions = {
//       to: user.email,
//       from: process.env.EMAIL_USER,
//       subject: "Password Reset - Crime Reporting System",
//       text: `Hello ${user.username || "User"},\n\n
//       You requested a password reset.\n\n
//       Click the link below to reset your password:\n
//       ${CLIENT_URL}/reset-password/${resetToken}\n\n
//       This link is valid for 1 hour.\n\n
//       If you did not request this, please ignore this email.`,
//     };

//     // send mail
//     await transporter.sendMail(mailOptions);

//     // return response with token (for testing)
//     res.json({
//       message: "Password reset link sent to your email",
//       resetToken: resetToken, // ✅ returned for testing
//       expiry: user.resetPasswordExpires, // ✅ optional
//     });
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
      ${CLIENT_URL}/reset-password/${resetToken}\n\n
      This link is valid for 1 hour.\n\n
      If you did not request this, please ignore this email.`,
    };

    // send mail
    await transporter.sendMail(mailOptions);

    // return response with token (for testing)
    res.json({
      message: "Password reset link sent to your email",
      resetToken: resetToken,
      expiry: user.resetPasswordExpires,
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET route for verifying token (when user clicks email link)
exports.verifyResetToken = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send("<h2>Invalid or expired reset link</h2>");
    }

    // Show a simple HTML response (later you can redirect to frontend page)
    res.send(`
      <h2>Reset Password</h2>
      <p>Token is valid. You can now send a POST request with your new password to:</p>
      <pre>${CLIENT_URL}/reset-password/${token}</pre>
      <p>(If using frontend, redirect here with a form)</p>
    `);
  } catch (err) {
    console.error("Verify token error:", err);
    res.status(500).send("<h2>Server error</h2>");
  }
};

// ✅ POST route for actually resetting password
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
