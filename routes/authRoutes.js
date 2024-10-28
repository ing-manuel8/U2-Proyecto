// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const userAuthController = require('../controllers/authController');

// Configuración de `multer` para el almacenamiento de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Define la carpeta de destino
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Define un nombre de archivo único
  }
});

const upload = multer({ storage });

// Ruta de registro con `multer` para manejar el archivo `profileImage`
router.post('/register', upload.single('profileImage'), userAuthController.registerUser);

router.post('/login', userAuthController.loginUser);
router.get('/logout', userAuthController.logoutUser);

module.exports = router;
