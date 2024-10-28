// controllers/alumnoController.js
const sharp = require('sharp');
const Alumno = require('../models/Alumnos'); // Importar el modelo de Alumno

// Mostrar la lista de alumnos
exports.getAlumnos = async (req, res) => {
  try {
    const alumnos = await Alumno.find(); // Obtener todos los alumnos de la base de datos
    res.render('alumnos', { alumnos, user: req.user }); // Renderiza la vista de alumnos
  } catch (err) {
    console.error('Error al obtener la lista de alumnos:', err);
    req.flash('error_msg', 'Error al cargar la lista de alumnos.');
    res.redirect('/');
  }
};

// Mostrar el formulario para crear un nuevo alumno
exports.showCreateAlumnoForm = (req, res) => {
  res.render('alumnos/new', { user: req.user }); // Renderiza el formulario de creación de alumno
};

// Crear un nuevo alumno
exports.createAlumno = async (req, res) => {
  const { name, email, role, password } = req.body;
  let profileImage = '/images/user-default.png';
  if (req.file) {
    profileImage = req.file.filename; // Guardar el nombre del archivo subido
  }
  try {
    const newAlumno = new Alumno({ name, email, role, password, profileImage }); // Crear un nuevo alumno
    await newAlumno.save(); // Guardar el alumno en la base de datos
    req.flash('success_msg', 'Alumno creado correctamente.');
    res.redirect('/alumnos'); // Redirigir a la lista de alumnos
  } catch (err) {
    console.error('Error al crear alumno:', err);
    req.flash('error_msg', 'Error al crear el alumno.');
    res.redirect('/alumnos/new');
  }
};

// Mostrar el formulario de edición de un alumno
exports.showEditAlumnoForm = async (req, res) => {
  try {
    const alumno = await Alumno.findById(req.params.id); // Buscar el alumno por ID
    if (!alumno) {
      req.flash('error_msg', 'Alumno no encontrado.');
      return res.redirect('/alumnos');
    }
    res.render('alumnos/edit', { alumno, user: req.user }); // Renderiza el formulario de edición
  } catch (err) {
    console.error('Error al cargar el alumno para editar:', err);
    req.flash('error_msg', 'Error al cargar el alumno.');
    res.redirect('/alumnos');
  }
};

// Actualizar un alumno existente
exports.updateAlumno = async (req, res) => {
  const { name, email, role } = req.body;
  let profileImage;

  if (req.file) {
    profileImage = req.file.filename; // Guardar la nueva imagen si se carga
  }
  try {
    await Alumno.findByIdAndUpdate(req.params.id, { name, email, role, profileImage }); // Actualizar el alumno
    req.flash('success_msg', 'Alumno actualizado correctamente.');
    res.redirect('/alumnos');
  } catch (err) {
    console.error('Error al actualizar alumno:', err);
    req.flash('error_msg', 'Error al actualizar el alumno.');
    res.redirect(`/alumnos/edit/${req.params.id}`);
  }
};

// Eliminar un alumno
exports.deleteAlumno = async (req, res) => {
  try {
    await Alumno.findByIdAndDelete(req.params.id); // Eliminar el alumno por ID
    req.flash('success_msg', 'Alumno eliminado correctamente.');
    res.redirect('/alumnos');
  } catch (err) {
    console.error('Error al eliminar alumno:', err);
    req.flash('error_msg', 'Error al eliminar el alumno.');
    res.redirect('/alumnos');
  }
};
