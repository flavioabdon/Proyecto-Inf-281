
const comprasClienteModel = require('../models/comprasCliente');


// listar 
const listarCompras = async (req, res) => {
    const id_usuario = req.params.id; //
    try {
        const comprasCliente = await comprasClienteModel.listarCompras(id_usuario);
        // Devuelve la lista 
        res.status(200).json(comprasCliente);
    } catch (error) {
        console.error('Error al listar compras cliente:', error);
        // Devuelve un mensaje de error
        res.status(500).json({ message: 'Error al listar compras cliente' });
    }
};


const listarDetalleCompras = async (req, res) => {
    const id_usuario = req.params.id1;
    const id_pedido = req.params.id2;
    try {
        // Llama al modelo
        const detalleComprasCliente = await comprasClienteModel.listarDetalleCompras(id_usuario,id_pedido);
        // Devuelve la lista 
        res.status(200).json(detalleComprasCliente);
    } catch (error) {
        console.error('Error al listar delalle compras cliente:', error);
        // Devuelve un mensaje de error
        res.status(500).json({ message: 'Error al listar detalle compras cliente' });
    }
};

module.exports = {
   listarCompras,
   listarDetalleCompras
};


