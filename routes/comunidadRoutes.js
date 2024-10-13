const express = require('express');
const router = express.Router();
const comunidadController = require('../controllers/comunidadController');

// Ruta para la vista de almacenes
router.get('/comunidad', (req, res) => {
    res.render('administrador/comunidadView'); // Renderiza la vista 'almacenView.ejs'
});

// Ruta para registrar un nuevo almacén
router.post('/formRegistrarAlmacen', almacenController.registrarAlmacen); // Usa el controlador para insertar

// Ruta para listar almacenes
router.get('/listarAlmacenes', almacenController.listarAlmacenes); // Usa el controlador para listar almacenes

// Ruta para actualizar un almacén existente
router.put('/almacen/:id', almacenController.actualizarAlmacen); // Actualizar almacén

// Ruta para eliminar un almacén
router.delete('/eliminarAlmacen/:id', almacenController.eliminarAlmacen); // Usa el controlador para eliminar un almacén

module.exports = router;