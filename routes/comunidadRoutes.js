const express = require('express');
const router = express.Router();
const comunidadController = require('../controllers/comunidadController');

// Ruta para la vista de Comunidades
router.get('/comunidad', (req, res) => {
    res.render('administrador/comunidadView',{ currentPage: "comunidad" }); // Renderiza la vista 'comunidadView.ejs'
});

//Ruta para registrar una nueva Comunidad
router.post('/formRegistrarComunidad', comunidadController.registrarComunidad); // Usa el controlador para insertar comunidades

//Ruta para listar Comunidades
router.get('/listarComunidades', comunidadController.listarComunidades); // Usa el controlador para listar Comunidades

//Ruta para actualizar una Comunidad existente
router.put('/actualizarComunidad/:id', comunidadController.actualizarComunidad); // Actualizar Comunidad

//Ruta para eliminar una Comunidad
router.delete('/eliminarComunidad/:id', comunidadController.eliminarComunidad); // Usa el controlador para eliminar una Comunidad

module.exports = router;