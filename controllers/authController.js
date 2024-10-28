// controllers/userController.js
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const path = require('path');
const fs = require('fs');

exports.registerUser = async (req, res) => {
  const { name, email, password, password2, controlNumber, birthDate, sex, role } = req.body;
  let errors = [];

  console.log('Datos recibidos:', req.body); // Verifica que los datos se reciben
  console.log('Archivo recibido:', req.file); // Verifica que el archivo se recibe

  if (!name || !email || !password || !password2 || !controlNumber || !birthDate || !sex || !role) {
    errors.push({ msg: 'Por favor llena todos los campos' });
  }

  if (password !== password2) {
    errors.push({ msg: 'Las contraseñas no coinciden' });
  }

  if (password && password.length < 6) {
    errors.push({ msg: 'La contraseña debe tener al menos 6 caracteres' });
  }

  if (errors.length > 0) {
    req.flash('error_msg', errors.map(error => error.msg).join('. '));
    return res.redirect('/');
  }

  try {
    // Verifica si el correo ya está registrado
    const userExists = await User.findOne({ email });
    if (userExists) {
      req.flash('error_msg', 'El correo electrónico ya está registrado');
      return res.redirect('/');
    }

    // Crea un nuevo usuario
    const newUser = new User({
      name,
      email,
      password,
      profileImage: req.file ? req.file.filename : 'default-avatar.png', // Usa la imagen o una predeterminada
      controlNumber,
      birthDate,
      sex,
      role,
    });

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();
    req.flash('success_msg', 'Estás registrado y ahora puedes iniciar sesión');
    res.redirect('/');
  } catch (error) {
    console.error('Error durante el registro:', error);
    req.flash('error_msg', 'Hubo un error al registrar el usuario');
    res.redirect('/');
  }
};


// Login User
exports.loginUser = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true
  })(req, res, next);
};

// Logout User
exports.logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      req.flash('error_msg', 'Hubo un problema al cerrar sesión. Intenta de nuevo.');
      return res.redirect('/');
    }
    req.flash('success_msg', 'Has cerrado sesión correctamente');
    res.redirect('/');
  });
};
