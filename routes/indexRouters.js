// routes/index.js
const express = require('express');
const router = express.Router();

// Home Page
router.get('/', (req, res) => res.render('index', { user: req.user }));

// Ruta para el perfil del usuario
router.get('/profile', (req, res) => {
    if (!req.user) {
      req.flash('error_msg', 'Por favor, inicia sesión para ver tu perfil');
      return res.redirect('/auth/login');
    }
    res.render('profile'); // Renderiza profile.ejs
  });
  
  // Ruta para la página "Acerca de"
  router.get('/about', (req, res) => {
    res.render('about'); // Renderiza about.ejs
  });
  
module.exports = router;
