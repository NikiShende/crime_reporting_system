const User = require("../models/register");
const bcrypt = require("bcryptjs");

exports.registerUser = async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    // hash password here before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword, // 👈 save hashed password, not raw
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    console.error("Register error:", err);

    // if duplicate error
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email or phone already exists" });
    }

    res.status(500).json({ message: "Server error" });
  }
};
