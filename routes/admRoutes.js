const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteSController');
const artesanoController = require('../controllers/artesanoController');

//-------------------------------CLIENTES------------------------------
router.get('/cliente', (req, res) => {
    res.render('dashboard/clienteView');
});
// Ruta para registrar una nueva categoría
router.post('/formRegistrarClienteC', clienteController.registrarCliente); // Usa el controlador para insertar

// Ruta para listar categorías
router.get('/listarClientes', clienteController.listarClientes); // Usa el controlador para listar categorías

// Ruta para actualizar una categoría existente
router.put('/cliente/:id', clienteController.actualizarCliente);


//Ruta para eliminar una categoría
router.delete('/eliminarCliente/:id', clienteController.eliminarCliente); // Usa el controlador para eliminar una categoría

//----------------------------ARTESANOS-------------------------------
router.get('/artesano', (req, res) => {
    res.render('dashboard/artesanoView');
});
// Ruta para registrar una nueva categoría
router.post('/formRegistrarArtesano', artesanoController.registrarArtesano); // Usa el controlador para insertar

// Ruta para listar categorías
router.get('/listarArtesanos', artesanoController.listarArtesanos); // Usa el controlador para listar categorías

// Ruta para actualizar una categoría existente
//router.put('/artesano/:id', artesanoController.actualizarArtesanos);


//Ruta para eliminar una categoría
//router.delete('/eliminarArtesano/:id', artesanoController.eliminarArtesano); // Usa el controlador para eliminar una categoría
//------------------------DELIVERYS------------------------------------
router.get('/delivery', (req, res) => {
    res.render('dashboard/deliveryView');
});
module.exports = router;
