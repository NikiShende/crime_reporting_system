const mongoose = require("mongoose");

const RegisterSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
const Register = mongoose.model("register", RegisterSchema); // 👈 must match "ref"

