// models/user.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now },
  profileImage: { type: String, default: '/images/user-default.png' }, // Imagen predeterminada
  controlNumber: { type: String, required: true },
  birthDate: { type: Date, required: true },
  sex: { type: String, enum: ['M', 'F', 'O'], required: true },
  role: { type: String, enum: ['admin', 'user', 'guest'], required: true },
});

module.exports = mongoose.model('User', UserSchema);
