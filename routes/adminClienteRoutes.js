const express = require('express');
const router = express.Router();
const adminClienteController = require('../controllers/adminClienteController');

// Ruta para la vista de adminitrar usuario cliente
router.get('/adminCliente', (req, res) => {
    res.render('administrador/adminClienteView', { currentPage: "adminCliente" }); // Renderiza la vista 'adminClienteView.ejs'
});

// Ruta para listar clientes
router.get('/listarAdminClientes', adminClienteController.listarClientes); // Usa el controlador para listar categorías



module.exports = router;