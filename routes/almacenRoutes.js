const express = require('express');
const router = express.Router();
const almacenController = require('../controllers/almacenController');

// Ruta para la vista de almacenes
router.get('/almacen', (req, res) => {
    res.render('administrador/almacenView',{ currentPage: "almacen" } ); // Renderiza la vista 'almacenView.ejs'
});

// Ruta para registrar un nuevo almacén
router.post('/formRegistrarAlmacen', almacenController.registrarAlmacen); // Usa el controlador para insertar

// Ruta para listar almacenes
router.get('/listarAlmacenes', almacenController.listarAlmacenes); // Usa el controlador para listar almacenes

// Ruta para actualizar un almacén existente
router.put('/actualizarAlmacen/:id', almacenController.actualizarAlmacen); // usa el controlador para actualizar almacén

// Ruta para eliminar un almacén
router.delete('/eliminarAlmacen/:id', almacenController.eliminarAlmacen); // Usa el controlador para eliminar un almacén

// Ruta para listar un almacén específico por ID de almacen
router.get('/listarAlmacen/:id_almacen', almacenController.listarAlmacenPorId); // Usa el controlador para listar un almacén por ID

// Ruta para listar un almacén específico por ID del producto
router.get('/listarAlmacenIdprod/:id_prod', almacenController.listarAlmacenPorIdproducto); // Usa el controlador para listar un almacén por ID


//Ruta para obtner coordenas de almacen(del primer producto) por id_pedido
router.get('/obtenerCoordenadasAlmacen/:id', almacenController.obtenerCoordenadas); 



//exporta el router para que pueda ser utilizado en server.js
module.exports = router;