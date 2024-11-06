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

// Listar un almacén específico por ID del Almacen
const listarAlmacenPorId = async (req, res) => {
    const { id_almacen } = req.params; // Obtiene el id_almacen de los parámetros de la URL
    console.log("ID de almacen en controlador:", id_almacen);  // Verifica el valor
    try {
        // Llama al modelo para obtener el almacén específico
        const almacen = await almacenModel.listarAlmacenPorId(id_almacen);

        if (almacen.length === 0) {
            // Si no se encuentra el almacén, devuelve un mensaje de error
            return res.status(404).json({ message: 'Almacén no encontrado' });
        }

        // Devuelve los datos del almacén
        res.status(200).json(almacen);
    } catch (error) {
        console.error('Error al listar el almacén por ID:', error);
        // Devuelve un mensaje de error
        res.status(500).json({ message: 'Error al listar el almacén' });
    }
};

// Listar un almacén específico por ID del Producto
const listarAlmacenPorIdproducto = async (req, res) => {
    const { id_prod } = req.params; // Obtiene el id_almacen de los parámetros de la URL
    console.log("ID de prducto en controlador:", id_prod);  // Verifica el valor
    try {
        // Llama al modelo para obtener el almacén específico
        const almacen = await almacenModel.listarAlmacenPorIdproducto(id_prod);

        if (almacen.length === 0) {
            // Si no se encuentra el almacén, devuelve un mensaje de error
            return res.status(404).json({ message: 'Almacén por IDprod no encontrado' });
        }

        // Devuelve los datos del almacén
        res.status(200).json(almacen);
    } catch (error) {
        console.error('Error al listar el almacén por ID del producto:', error);
        // Devuelve un mensaje de error
        res.status(500).json({ message: 'Error al listar el almacén por IDprod' });
    }
};

module.exports = {
    registrarAlmacen,
    listarAlmacenes,
    actualizarAlmacen,
    eliminarAlmacen,
    listarAlmacenPorId,
    listarAlmacenPorIdproducto,
};
