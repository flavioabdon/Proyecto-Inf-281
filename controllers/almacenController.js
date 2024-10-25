const almacenModel = require('../models/almacen');

// registrar
const registrarAlmacen = async (req, res) => {
    // Obtiene los datos del formulario
    const { nombreAlmacen, direccionAlmacen, capacidadAlmacen } = req.body;

    try {
        // Inserta el nuevo almacen 
        const nuevoAlmacen = await almacenModel.registrarAlmacen(nombreAlmacen, direccionAlmacen, capacidadAlmacen);
        
        // Devuelve un mensaje de éxito
        res.status(201).json({ message: 'Almacen creado', almacen: nuevoAlmacen });

    } catch (error) {
        console.error('Error al crear el almacen:', error);
        // Devuelve un mensaje de error
        res.status(500).json({ message: 'Error al crear el almacen' });
    }
};

// listar
const listarAlmacenes = async (req, res) => {
    try {
        // Llama al modelo para obtener los almacenes
        const almacenes = await almacenModel.listarAlmacenes();
        // Devuelve la lista de almacenes
        res.status(200).json(almacenes);
    } catch (error) {
        console.error('Error al listar almacenes:', error);
        // Devuelve un mensaje de error
        res.status(500).json({ message: 'Error al listar almacenes' });
    }
};

// Controlador para actualizar
const actualizarAlmacen = async (req, res) => {
    const id_almacen = req.params.id; // El ID viene desde la URL
    const { nombreAlmacen, direccionAlmacen, capacidadAlmacen } = req.body; // Datos enviados en el cuerpo

    try {
        const almacenActualizada = await almacenModel.actualizarAlmacen(
            id_almacen,
            nombreAlmacen,
            direccionAlmacen,
            capacidadAlmacen
        );
        res.status(200).json({ message: 'Almacen actualizado', almacen: almacenActualizada });
    } catch (error) {
        console.error('Error al actualizar el almacen:', error);
        res.status(500).json({ message: 'Error al actualizar el almacen' });
    }
};

// Controlador para eliminar
const eliminarAlmacen = async (req, res) => {
    const id_almacen = req.params.id; // El ID viene desde la URL
    try {
        await almacenModel.eliminarAlmacen(id_almacen); // Llama al modelo para eliminar
        res.status(200).json({ message: 'Almacen eliminado' });
    } catch (error) {
        console.error('Error al eliminar el almacen:', error);
        res.status(500).json({ message: 'Error al eliminar el almacen' });
    }
};

module.exports = {
    registrarAlmacen,
    listarAlmacenes,
    actualizarAlmacen,
    eliminarAlmacen,
};
