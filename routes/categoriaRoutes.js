const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

// Ruta para la vista de categorías
router.get('/categoria', (req, res) => {
    res.render('administrador/categoriaView'); // Renderiza la vista 'categoriaView.ejs'
});

// Ruta para registrar una nueva categoría
router.post('/formRegistrarCategoria', categoriaController.registrarCategoria); // Usa el controlador para insertar



module.exports = router;

