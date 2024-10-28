// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const AlumnosControllerr = require('../controllers/AlumnosController');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth'); // Importar los middlewares de autenticació

const upload = require('../config/multer');

// Rutas para usuarios
router.get('/', ensureAuthenticated, AlumnosController.getAlumno); // Mostrar la lista de usuarios
router.get('/new', ensureAuthenticated, AlumnosController.showCreateAlumnoForm); // Mostrar formulario de creación de usuario
router.post('/new', ensureAuthenticated, upload.single('profileImage'), AlumnosController.createAlumno); // Crear un nuevo usuario
router.get('/edit/:id', ensureAuthenticated, AlumnosController.showEditAlumnoForm); // Mostrar formulario de edición de usuario
router.post('/edit/:id', ensureAuthenticated, upload.single('profileImage'), AlumnosController.updateAlumno); // Actualizar un usuario
router.post('/delete/:id', ensureAuthenticated, AlumnosController.deleteAlumno); // Eliminar un usuario

module.exports = router;
