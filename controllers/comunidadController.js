const comunidadModel = require('../models/comunidad');

// Controlador para insertar una nueva Comunidad
const registrarComunidad = async (req, res) => {
    // Obtiene los datos del formulario
    const { departamento, provincia, municipio, nombrecom, longitud, latitud} = req.body;

    // Validación de datos requeridos
    /*if (!v_departamento || !v_provincia || !v_municipio || !v_nombrecom || !v_longitud || !v_latitud) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }*/

    // Validación del formato de ubicación geográfica (latitud y longitud)
    // const geoRefPattern = /^-?\d+\.\d+ -?\d+\.\d+$/; // Patrón regex para verificar el formato
    // if (!geoRefPattern.test(v_ubicacion_geoRef_Com)) {
    //     return res.status(400).json({ message: 'El formato de ubicación geográfica es inválido. Debe ser "latitud longitud"' });
    // }
    
    try {
        // Inserta la nueva comunidad utilizando el modelo
        const nuevaComunidad = await comunidadModel.registrarComunidad(departamento, provincia, municipio, nombrecom, longitud, latitud);
        
        // Devuelve un mensaje de éxito
        res.status(201).json({ message: 'Comunidad creada', comunidad: nuevaComunidad });

    } catch (error) {
        console.error('Error al crear la comunidad:', error);
        // Devuelve un mensaje de error
        res.status(500).json({ message: 'Error al crear la comunidad' });
    }
};

// listar todas las comunidades
const listarComunidades = async (req, res) => {
    try {
        // Llama al modelo para obtener las comunidades
        const comunidades = await comunidadModel.listarComunidades();
        // Devuelve la lista de comunidades
        res.status(200).json(comunidades);
    } catch (error) {
        console.error('Error al listar comunidades:', error);
        // Devuelve un mensaje de error
        res.status(500).json({ message: 'Error al listar comunidades' });
    }
};

// Controlador para actualizar una Comunidad
const actualizarComunidad = async (req, res) => {
    const id_comunidad = req.params.id; // El ID viene desde la URL
    const {departamento, provincia, municipio, nombrecom, longitud, latitud } = req.body; // Datos enviados en el cuerpo

    // Validación de datos requeridos
    if (!departamento || !provincia || !municipio || !nombrecom || !longitud || !latitud) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    try {
        const comunidadActualizada = await comunidadModel.actualizarComunidad(
            id_comunidad,
            departamento,
            provincia,
            municipio,
            nombrecom,
            longitud,
            latitud
        );
        res.status(200).json({ message: 'Comunidad actualizada', comunidad: comunidadActualizada });
    } catch (error) {
        console.error('Error al actualizar la comunidad:', error);
        res.status(500).json({ message: 'Error al actualizar la comunidad' });
    }
};

// Controlador para eliminar una comunidad
const eliminarComunidad = async (req, res) => {
    const id_comunidad = req.params.id; // El ID viene desde la URL
    try {
        await comunidadModel.eliminarComunidad(id_comunidad); // Llama al modelo para eliminar la categoría
        res.status(200).json({ message: 'Comunidad eliminada' });
    } catch (error) {
        console.error('Error al eliminar la comunidad:', error);
        res.status(500).json({ message: 'Error al eliminar la comunidad' });
    }
};

module.exports = {
    registrarComunidad,
    listarComunidades,
    actualizarComunidad,
    eliminarComunidad,
};
