const categoriaModel = require('../models/categoria');

// Controlador para insertar una nueva categoría
const registrarCategoria = async (req, res) => {
    // Obtiene los datos del formulario
    const { nombreCategoria, descripcionCategoria, iconoCategoria } = req.body;

    try {
        // Inserta la nueva categoría utilizando el modelo
        const nuevaCategoria = await categoriaModel.registrarCategoria(nombreCategoria, descripcionCategoria, iconoCategoria);
        // Devuelve un mensaje de éxito
        res.status(201).json({ message: 'Categoría creada', categoria: nuevaCategoria });
    } catch (error) {
        console.error('Error al crear la categoría:', error);
        // Devuelve un mensaje de error
        res.status(500).json({ message: 'Error al crear la categoría' });
    }
};

module.exports = {
    registrarCategoria,
};
