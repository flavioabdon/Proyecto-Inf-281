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



// listar todas las categorías
const listarCategorias = async (req, res) => {
    try {
        // Llama al modelo para obtener las categorías
        const categorias = await categoriaModel.listarCategorias();
        // Devuelve la lista de categorías
        res.status(200).json(categorias);
    } catch (error) {
        console.error('Error al listar categorías:', error);
        // Devuelve un mensaje de error
        res.status(500).json({ message: 'Error al listar categorías' });
    }
};

// Controlador para actualizar una categoría
const actualizarCategoria = async (req, res) => {
    const id_categoria = req.params.id; // El ID viene desde la URL
    const { nombreCategoria, descripcionCategoria, iconoCategoria } = req.body; // Datos enviados en el cuerpo

    try {
        const categoriaActualizada = await categoriaModel.actualizarCategoria(
            id_categoria,
            nombreCategoria,
            descripcionCategoria,
            iconoCategoria
        );
        res.status(200).json({ message: 'Categoría actualizada', categoria: categoriaActualizada });
    } catch (error) {
        console.error('Error al actualizar la categoría:', error);
        res.status(500).json({ message: 'Error al actualizar la categoría' });
    }
};

// Controlador para eliminar una categoría
const eliminarCategoria = async (req, res) => {
    const id_categoria = req.params.id; // El ID viene desde la URL
    try {
        await categoriaModel.eliminarCategoria(id_categoria); // Llama al modelo para eliminar la categoría
        res.status(200).json({ message: 'Categoría eliminada' });
    } catch (error) {
        console.error('Error al eliminar la categoría:', error);
        res.status(500).json({ message: 'Error al eliminar la categoría' });
    }
};


// listar todas las categorías usadas por el Artesano X
const listarCategoriasDelArtesano = async (req, res) => {
    const { id_usuario } = req.params;
    console.log("ID de usuario en controlador:", id_usuario);  // Verifica el valor
    try {
         // Llama al modelo para obtener las categorías, pasando el id_usuario como argumento
         const categorias = await categoriaModel.listarCategoriasDelArtesano(id_usuario);

        // Devuelve la lista de categorías
        res.status(200).json(categorias);
    } catch (error) {
        console.error('Error al listar categorías:', error);
        // Devuelve un mensaje de error
        res.status(500).json({ message: 'Error al listar categorías' });
    }
};

module.exports = {
    registrarCategoria,
    listarCategorias,
    actualizarCategoria,
    eliminarCategoria,
    listarCategoriasDelArtesano,
};


