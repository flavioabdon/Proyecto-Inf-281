
const adminArtesanoModel = require('../models/adminArtesano');


// listar Artesanos
const listarAdminArtesanos = async (req, res) => {
    try {
        const Artesanos = await adminArtesanoModel.listarAdminArtesanos();
        res.status(200).json(Artesanos);
    } catch (error) {
        console.error('Error al listar Artesanos:', error);
        // Devuelve un mensaje de error
        res.status(500).json({ message: 'Error al listar Artesanos' });
    }
};


// Controlador para insertar un nuevo artesano
const registrarAdminArtesano = async (req, res) => {
    // Obtiene los datos del formulario, incluyendo el archivo
    const { nombreArtesano, apellidoArtesano, ciArtesano, emailArtesano, celularArtesano, especialidadArtesano, sexoArtesano, comunidadArtesano } = req.body;
    const fotoArtesano = req.file; // El archivo de imagen se obtiene con middleware como multer

    try {
        // Inserta el nuevo artesano utilizando el modelo
        const nuevoArtesano = await adminArtesanoModel.registrarAdminArtesano(
            nombreArtesano,
            apellidoArtesano,
            ciArtesano,
            emailArtesano,
            celularArtesano,
            especialidadArtesano,
            sexoArtesano,
            comunidadArtesano,
            fotoArtesano ? fotoArtesano.path : null, // foto
            'admin'
        );

        // Devuelve un mensaje de éxito
        res.status(201).json({ message: 'Artesano registrado con éxito', artesano: nuevoArtesano });

    } catch (error) {
        console.error('Error al registrar el artesano:', error);
        // Devuelve un mensaje de error
        res.status(500).json({ message: 'Error al registrar el artesano' });
    }
};

// Controlador para actualizar un artesano
const actualizarAdminArtesano = async (req, res) => {
    const id_usuario = req.params.id; // El ID viene desde la URL
    const {
        nombreArtesano,
        apellidoArtesano,
        ciArtesano,
        emailArtesano,
        numeroContactoArtesano,
        especialidadArtesano,
        sexoArtesano,
        comunidadArtesano,
        estadoArtesano
    } = req.body; // Datos enviados en el cuerpo

    // Verificar los datos recibidos
    //  console.log('ID cliente recibido:', id_usuario);
    //  console.log('Datos del cuerpo recibidos:', req.body);

    try {
        // Llamada a la función del modelo para actualizar los datos del artesano
        const artesanoActualizado = await adminArtesanoModel.actualizarAdminArtesano(
            id_usuario,
            nombreArtesano,
            apellidoArtesano,
            ciArtesano,
            emailArtesano,
            numeroContactoArtesano,
            especialidadArtesano,
            sexoArtesano,
            comunidadArtesano,
            estadoArtesano
        );

        // Responder con éxito si todo salió bien
        res.status(200).json({ message: 'Artesano actualizado', artesano: artesanoActualizado });
    } catch (error) {
        console.error('Error al actualizar el artesano:', error);
        res.status(500).json({ message: 'Error al actualizar artesano' });
    }
};



// Controlador para eliminar un artesano
const eliminarAdminArtesano = async (req, res) => {
    const id_usuario = req.params.id; // El ID viene desde la URL
    try {
        await adminArtesanoModel.eliminarAdminArtesano(id_usuario); // Llama al modelo para eliminar
        res.status(200).json({ message: 'Artesano eliminado' });
    } catch (error) {
        console.error('Error al eliminar al Artesano:', error);
        res.status(500).json({ message: 'Error al eliminar Artesano' });
    }
};



module.exports = {
    listarAdminArtesanos,
    registrarAdminArtesano,
    actualizarAdminArtesano,
    eliminarAdminArtesano,
};
