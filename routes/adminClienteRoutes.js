const express = require('express');
const router = express.Router();
const adminClienteController = require('../controllers/adminClienteController');

const upload = require('../config/multerconfig'); // Importa la configuración de multer

// Ruta para la vista de adminitrar usuario cliente
router.get('/adminCliente', (req, res) => {
    res.render('administrador/adminClienteView', { currentPage: "adminCliente" }); // Renderiza la vista 'adminClienteView.ejs'
});

// Ruta para registrar un cliente
router.post('/registrarAdminCliente', upload.single('fotoCliente'), adminClienteController.registrarAdminCliente); // Usa el controlador para insertar

// Ruta para listar clientes
router.get('/listarAdminClientes', adminClienteController.listarAdminClientes); // Usa el controlador para listar clientes

// Ruta para actualizar un cliente existente
router.put('/actualizarAdminCliente/:id', adminClienteController.actualizarAdminCliente);

//Ruta para eliminar cliente
router.delete('/eliminarAdminCliente/:id',adminClienteController.eliminarAdminCliente); // Usa el controlador para eliminar un cliente

module.exports = router;