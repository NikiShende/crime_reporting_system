const mongoose = require("mongoose");

const RegisterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true }, // 👈 add phone
  password: { type: String, required: true },
  resetPasswordToken:{type:String},
  resetPasswordExpires:{type:Date}
});

// model name must be consistent with your ref
const Register = mongoose.model("Register", RegisterSchema);

module.exports = Register;
