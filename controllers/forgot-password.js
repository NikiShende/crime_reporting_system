// controllers/authController.js
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const User = require("../models/register");

// Forgot Password - send email link & return token (for testing)
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // generate token
    const resetToken = crypto.randomBytes(20).toString("hex");
    console.log("Reset token:", resetToken);

    // save token & expiry to user doc
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
    await user.save();

    // 🚀 For testing: return token in response
    res.json({
      message: "Password reset token generated",
      resetToken: resetToken, // copy this for reset-password API
      expiry: user.resetPasswordExpires,
    });

    // ⚠️ Optional: send mail only in production
    /*
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset",
      text: `You requested a password reset.\n\n
      Click the link to reset your password:\n
      http://localhost:3000/reset-password/${resetToken}\n\n
      This link is valid for 1 hour.`,
    };

    await transporter.sendMail(mailOptions);
    */
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
