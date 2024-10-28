require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const path = require('path');
const userRoutes = require('./routes/userRoutes'); // Importa las rutas de usuario

const app = express();

// Configuración de Passport
require('./config/passport')(passport);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('conectado a MongoDB'))
  .catch(err => console.log('Error al conectar con MongoDB:', err));

// Configuración de EJS
app.set('view engine', 'ejs');

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Configuración de la sesión
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key', // Cambia esto a una clave secreta segura
  resave: false,
  saveUninitialized: false,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Configuración de connect-flash
app.use(flash());

// Variables globales
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user || null; // Define `currentUser` para todas las vistas
  next();
});

// Rutas
app.use('/', require('./routes/indexRouters'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/', require('./routes/indexRouters')); // Asegúrate de que esta línea esté presente


// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
