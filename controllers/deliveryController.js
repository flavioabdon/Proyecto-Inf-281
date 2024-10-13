const deliveryModel = require('../models/delivery');

// Controlador para insertar una nueva categoría
const registrarDelivery = async (req, res) => {
    // Obtiene los datos del formulario
    const { nombreDelivery, apellidoDelivery, emailDelivery, celularDelivery, ciDelivery, sexoDelivery, fotoDelivery, vehiculoDelivery, matriculaDelivery } = req.body;

    try {
        // Inserta la nueva categoría utilizando el modelo
        const nuevoDelivery = await deliveryModel.registrarDelivery(nombreDelivery, apellidoDelivery, emailDelivery, celularDelivery, ciDelivery, sexoDelivery, fotoDelivery, vehiculoDelivery, matriculaDelivery);
        // Devuelve un mensaje de éxito

        res.status(201).json({ message: 'Delivery  creado', delivery: nuevoDelivery });

    } catch (error) {
        console.error('Error al crear al cliente:', error);
        // Devuelve un mensaje de error
        res.status(500).json({ message: 'Error al crear al delivery' });
    }
};

// listar todas las categorías
const listarDeliverys = async (req, res) => {
    try {
        // Llama al modelo para obtener las categorías
        const deliverys = await deliveryModel.listarDeliverys();
        // Devuelve la lista de categorías
        res.status(200).json(deliverys);
    } catch (error) {
        console.error('Error al listar deliverys:', error);
        // Devuelve un mensaje de error
        res.status(500).json({ message: 'Error al listar deliverys' });
    }
};


// Controlador para eliminar una categoría
const eliminarDelivery = async (req, res) => {
    const id_usuario = req.params.id; // El ID viene desde la URL
    try {
        await clienteModel.eliminarDelivery(id_usuario); // Llama al modelo para eliminar la categoría
        res.status(200).json({ message: 'Delivery eliminado' });
    } catch (error) {
        console.error('Error al eliminar el delivery:', error);
        res.status(500).json({ message: 'Error al eliminar el delivery' });
    }
};

// Controlador para actualizar una categoría
const actualizarDelivery = async (req, res) => {
    const id_delivery = req.params.id; // El ID viene desde la URL
    const { nombreDelivery, apellidoDelivery, emailDelivery, celularDelivery, ciDelivery, sexoDelivery, fotoDelivery, vehiculoDelivery, matriculaDelivery, estadoDelivery } = req.body; // Datos enviados en el cuerpo
    try {
        const clienteActualizado = await deliveryModel.actualizarDelivery(
            id_delivery,
            nombreDelivery, apellidoDelivery, emailDelivery, celularDelivery, ciDelivery, sexoDelivery, fotoDelivery, vehiculoDelivery, matriculaDelivery, estadoDelivery
        );
        res.status(200).json({ message: 'Delivery actualizado', delivery: clienteActualizado });
    } catch (error) {
        console.error('Error al actualizar el delivery:', error);
        res.status(500).json({ message: 'Error al actualizar el delivery' });
    }
};
module.exports = {
    registrarDelivery,
    listarDeliverys,
    actualizarDelivery,
    eliminarDelivery
};
