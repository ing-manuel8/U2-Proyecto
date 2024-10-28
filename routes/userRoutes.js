// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAdmin, ensureAuthenticated } = require('../middleware/auth'); // Importa isAdmin y ensureAuthenticated
const upload = require('../config/multer');

// Rutas para usuarios
router.get('/', ensureAuthenticated, userController.getUsers);
router.get('/new', ensureAuthenticated, userController.showCreateUserForm);
router.post('/new', ensureAuthenticated, upload.single('profileImage'), userController.createUser);
router.get('/edit/:id', ensureAuthenticated, userController.showEditUserForm);
router.post('/edit/:id', isAdmin, upload.single('profileImage'), userController.updateUser); // Aplicar isAdmin
router.post('/delete/:id', isAdmin, userController.deleteUser); // Aplicar isAdmin

module.exports = router;
