const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Register' }, // 'Register' is correct if using register model
  email: { type: String, required: true },
  loginTime: { type: Date, default: Date.now },
  token: { type: String },
});

module.exports = mongoose.models.Login || mongoose.model('Login', loginSchema);
