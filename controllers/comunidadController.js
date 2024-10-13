const comunidadModel = require('../models/comunidad');

// Controlador para insertar una nueva Comunidad
const registrarComunidad = async (req, res) => {
    // Obtiene los datos del formulario
    const { v_Departamento, v_provincia, v_Municipio, v_nombreCom, v_ubicacion_geoRef_Com } = req.body;

    try {
        // Inserta el nuevo comunidad utilizando el modelo
        const nuevaComunidad = await comunidadModel.registrarComunidad(v_Departamento, v_provincia, v_Municipio, v_nombreCom, v_ubicacion_geoRef_Com);
        
        // Devuelve un mensaje de éxito
        res.status(201).json({ message: 'Comunidad creada', comunidad: nuevaComunidad });

    } catch (error) {
        console.error('Error al crear el comunidad:', error);
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
    const {Departamento, provincia, Municipio, nombreCom, ubicacion_geoRef_Com } = req.body; // Datos enviados en el cuerpo

    try {
        const comunidadActualizada = await comunidadModel.actualizarComunidad(
            id_comunidad,
            Departamento,
            provincia,
            Municipio,
            nombreCom,
            ubicacion_geoRef_Com
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
