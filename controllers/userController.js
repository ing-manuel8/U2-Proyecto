// controllers/userController.js
const sharp = require('sharp');
const User = require('../models/user'); // Importar el modelo de usuario
const bcrypt = require('bcryptjs');

// Mostrar la lista de usuarios
exports.getUsers = async (req, res) => {
  try {  const page = parseInt(req.query.page) || 1; // Página actual
    const limit = parseInt(req.query.limit) || 10; // Límite de resultados por página
    const searchQuery = req.query.search || ''; // Término de búsqueda

    // Crear un filtro de búsqueda basado en el nombre o correo electrónico
    const filter = searchQuery
      ? {
          $or: [
            { name: { $regex: searchQuery, $options: 'i' } },
            { email: { $regex: searchQuery, $options: 'i' } }
          ]
        }
      : {};

    // Obtener los usuarios de la base de datos con paginación
    const users = await User.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / limit);

    // Renderizar la vista con usuarios, página actual y total de páginas
    res.render('users', {
      users,
      currentPage: page,
      totalPages,
      searchQuery,
      user: req.user
    });
  } catch (err) {
    console.error('Error al obtener la lista de usuarios:', err);
    req.flash('error_msg', 'Error al cargar la lista de usuarios.');
    res.redirect('/');
  }
};

// Mostrar el formulario para crear un nuevo usuario
exports.showCreateUserForm = (req, res) => {
  res.render('users/new', { user: req.user }); // Renderiza el formulario de creación de usuario
};
// controllers/userController.js
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, password2, controlNumber, birthDate, sex, role } = req.body;

    // Validación de contraseñas
    if (password !== password2) {
      req.flash('error_msg', 'Las contraseñas no coinciden');
      return res.redirect('/users');
    }

    // Crear el nuevo usuario con la ruta de la imagen
    const newUser = new User({
      name,
      email,
      controlNumber,
      birthDate,
      sex,
      role,
      profileImage: req.file ? `/uploads/${req.file.filename}` : '/images/user-default.png', // Ruta correcta para la imagen
    });

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();
    req.flash('success_msg', 'Usuario creado exitosamente');
    res.redirect('/users');
  } catch (error) {
    console.error('Error al crear usuario:', error);
    req.flash('error_msg', 'Error al crear el usuario');
    res.redirect('/users');
  }
};


// Mostrar el formulario de edición de un usuario
exports.showEditUserForm = async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Buscar el usuario por ID
    if (!user) {
      req.flash('error_msg', 'Usuario no encontrado.');
      return res.redirect('/users');
    }
    res.render('users/edit', { user, user: req.user }); // Renderiza el formulario de edición
  } catch (err) {
    console.error('Error al cargar el usuario para editar:', err);
    req.flash('error_msg', 'Error al cargar el usuario.');
    res.redirect('/users');
  }
};
exports.updateUser = async (req, res) => {
  try {
    const { name, email, controlNumber, birthDate, sex, role, password } = req.body;
    const updates = { name, email, controlNumber, birthDate, sex, role };

    // Si hay una nueva imagen de perfil, actualízala
    if (req.file) {
      updates.profileImage = `/uploads/${req.file.filename}`;
    }

    // Si se proporciona una nueva contraseña, encripta y actualiza
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    // Actualiza el usuario en la base de datos
    await User.findByIdAndUpdate(req.params.id, updates);
    req.flash('success_msg', 'Usuario actualizado exitosamente');
    res.redirect('/users');
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    req.flash('error_msg', 'Error al actualizar el usuario');
    res.redirect('/users');
  }
};


// Eliminar un usuario
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id); // Eliminar el usuario por ID
    req.flash('success_msg', 'Usuario eliminado correctamente.');
    res.redirect('/users');
  } catch (err) {
    console.error('Error al eliminar usuario:', err);
    req.flash('error_msg', 'Error al eliminar el usuario.');
    res.redirect('/users');
  }
};


exports.listUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Página actual (por defecto es 1)
    const limit = 10; // Número de usuarios por página

    // Calcular el número total de usuarios y páginas
    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    // Obtener usuarios para la página actual
    const users = await User.find()
      .skip((page - 1) * limit)
      .limit(limit);

    res.render('users', {
      users,
      currentPage: page,
      totalPages,
      searchQuery: req.query.search || '', // Mantiene la búsqueda si hay una
    });
  } catch (error) {
    console.error('Error al listar usuarios:', error);
    res.redirect('/'); // Redirige o maneja el error según sea necesario
  }
};