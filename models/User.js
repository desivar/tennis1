const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed password
  role: { type: String, enum: ['client', 'admin', 'sales'], default: 'client' },
  // Add other relevant fields if needed
});

module.exports = mongoose.model('User', UserSchema);