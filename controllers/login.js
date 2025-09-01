const User = require("../models/register"); // if register.js exports Register model
const Login = require("../models/login");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;


  try {
    const allUsers = await User.find();
console.log("All users in DB:", allUsers);

   const user = await User.findOne({ email });
console.log("Trying to find user with email:", email);

    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  expiresIn: "1d",
});

    
    
  


    // Save login data
    await Login.create({
      userId: user._id,
      email: user.email,
      token: token,
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login error" });
  }
};
