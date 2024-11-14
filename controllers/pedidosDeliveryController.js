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

// listar 
const listarPedidosPorId = async (req, res) => {
    const id_usuario = req.params.id; //
    try {
       
        const pedidosDeliveryPorId = await pedidosDeliveryModel.listarPedidosPorId(id_usuario);
        // Devuelve la lista 
        res.status(200).json(pedidosDeliveryPorId);
    } catch (error) {
        console.error('Error al listar pedidos por id', error);
        // Devuelve un mensaje de error
        res.status(500).json({ message: 'Error al listar pedidos por id' });
    }
};

module.exports = {
    listarPedidos,
    listarPedidosPorId,
 };
 
 
 