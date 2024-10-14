const adminClienteModel = require('../models/adminCliente');



// listar todas las categorías
const listarClientes = async (req, res) => {
    try {
        // Llama al modelo para obtener las categorías
        const clientes = await adminClienteModel.listarClientes();
        // Devuelve la lista de categorías
        res.status(200).json(clientes);
    } catch (error) {
        console.error('Error al listar clientes:', error);
        // Devuelve un mensaje de error
        res.status(500).json({ message: 'Error al listar clientes' });
    }
};




module.exports = {
    listarClientes,
};
