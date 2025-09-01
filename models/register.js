const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const registerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // ensures uniqueness at DB level
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"], // email format validation
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // enforce min length
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: [/^[0-9]{10}$/, "Phone must be 10 digits"], // only 10 digit numbers
  },
}, { timestamps: true });

// 🔒 Hash password before saving
registerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // only hash if modified
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔑 Add method for comparing password
registerSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.models.Register || mongoose.model('Register', registerSchema);
