// models/user.js
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
   Ncontrol: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  born_date: {type: Date},
  sex :{type: String},
  curp:{type: String},
  date: { type: Date, default: Date.now },
  profileImage: {
    type: String, // Almacena la ruta de la imagen
    default: 'https://via.placeholder.com/100', // Puedes tener una imagen predeterminada
  },
});

module.exports = mongoose.model('Students', UserSchema);
