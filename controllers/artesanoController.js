const artesanoModel = require('../models/artesano');

// Controlador para insertar una nueva categoría
const registrarArtesano = async (req, res) => {
    // Obtiene los datos del formulario
    const { nombreArtesano, apellidoArtesano, emailArtesano, celularArtesano, ciArtesano, sexoArtesano, fotoArtesano, especialidadArtesano, nroComunidad } = req.body;

    try {
        // Inserta la nueva categoría utilizando el modelo
        const nuevoArtesano = await artesanoModel.registrarArtesano(nombreArtesano, apellidoArtesano, emailArtesano, celularArtesano, ciArtesano, sexoArtesano, fotoArtesano, especialidadArtesano, nroComunidad);
        // Devuelve un mensaje de éxito

        res.status(201).json({ message: 'Artesano  creado', artesano: nuevoArtesano });

    } catch (error) {
        console.error('Error al crear al artesano:', error);
        // Devuelve un mensaje de error
        res.status(500).json({ message: 'Error al crear al artesano' });
    }
};



// listar todas las categorías
const listarArtesanos = async (req, res) => {
    try {
        // Llama al modelo para obtener las categorías
        const artesanos = await artesanoModel.listarArtesanos();
        // Devuelve la lista de categorías
        res.status(200).json(artesanos);
    } catch (error) {
        console.error('Error al listar artesanos:', error);
        // Devuelve un mensaje de error
        res.status(500).json({ message: 'Error al listar artesanos' });
    }
};

// Controlador para actualizar una categoría
const actualizarArtesano = async (req, res) => {
    const id_artesano = req.params.id; // El ID viene desde la URL
    const { nombreArtesano, apellidoArtesano, emailArtesano, celularArtesano, ciArtesano, sexoArtesano, fotoArtesano, especialidadArtesano, estadoArtesano } = req.body; // Datos enviados en el cuerpo
    try {
        const artesanoActualizado = await artesanoModel.actualizarArtesano(
            id_artesano,
            nombreArtesano, apellidoArtesano, emailArtesano, celularArtesano, ciArtesano, sexoArtesano, fotoArtesano, especialidadArtesano, estadoArtesano
        );
        res.status(200).json({ message: 'Artesano actualizado', artesano: artesanoActualizado });
    } catch (error) {
        console.error('Error al actualizar el artesano:', error);
        res.status(500).json({ message: 'Error al actualizar el artesano' });
    }
};

// Controlador para eliminar una categoría
const eliminarArtesano = async (req, res) => {
    const id_artesano = req.params.id; // El ID viene desde la URL
    try {
        await artesanoModel.eliminarArtesano(id_artesano); // Llama al modelo para eliminar la categoría
        res.status(200).json({ message: 'artesano eliminado' });
    } catch (error) {
        console.error('Error al eliminar el artesano:', error);
        res.status(500).json({ message: 'Error al eliminar el artesano' });
    }
};

module.exports = {
    registrarArtesano,
    listarArtesanos,
    actualizarArtesano,
    eliminarArtesano,
};
