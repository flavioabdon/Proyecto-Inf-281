const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

// Ruta para la vista de categorías
router.get('/categoria', (req, res) => {
    res.render('administrador/categoriaView', { currentPage: "categoria" }); // Renderiza la vista 'categoriaView.ejs'
});

// Ruta para registrar una nueva categoría
router.post('/formRegistrarCategoria', categoriaController.registrarCategoria); // Usa el controlador para insertar

// Ruta para listar categorías
router.get('/listarCategorias', categoriaController.listarCategorias); // Usa el controlador para listar categorías

// Ruta para actualizar una categoría existente
router.put('/categoria/:id', categoriaController.actualizarCategoria);


//Ruta para eliminar una categoría
router.delete('/eliminarCategoria/:id', categoriaController.eliminarCategoria); // Usa el controlador para eliminar una categoría


module.exports = router;

