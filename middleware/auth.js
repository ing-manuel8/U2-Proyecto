// middleware/auth.js

exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'admin') {
      return next();
  }
  req.flash('error_msg', 'Acceso denegado. Solo los administradores pueden realizar esta acción.');
  res.redirect('/users'); // Redirige a la lista de usuarios
};

exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'Por favor, inicia sesión para acceder a esta página.');
  res.redirect('/');
};
