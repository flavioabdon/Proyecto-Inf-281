const express = require('express');
const router = express.Router();

const iniciarSesionController = require('../controllers/iniciarSesionController'); // Importa el controlador de autenticación (formIniciarSesion)


///auth/-----> usar el prefijo. configuracion de ruta inicial en server.js
// Ruta para iniciar sesión  /auth/formIniciarSesion
router.post('/formIniciarSesion', iniciarSesionController.retornarUsuarioSiExiste); // Usa el controlador para el inicio de sesión

module.exports = router;
