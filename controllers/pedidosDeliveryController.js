const pedidosDeliveryModel = require('../models/pedidosDelivery');

// listar 
const listarPedidos = async (req, res) => {
    try {
        const pedidosDelivery = await pedidosDeliveryModel.listarPedidos();
        // Devuelve la lista 
        res.status(200).json(pedidosDelivery);
    } catch (error) {
        console.error('Error al listar todos los pedidos:', error);
        // Devuelve un mensaje de error
        res.status(500).json({ message: 'Error al listar todos los pedidos' });
    }
};


module.exports = {
    listarPedidos,
 };
 
 
 