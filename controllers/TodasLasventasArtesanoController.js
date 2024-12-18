const TodasLasventasArtesanoModel = require('../models/TodasLasventasArtesano');

// listar 
const listarTodasLasVentas = async (req, res) => {
    //const id_usuario = req.params.id; //
    try {
        // Llama al modelo para obtener las ventas
        const ventasArtesano = await TodasLasventasArtesanoModel.listarVentas();
        // Devuelve la lista 
        res.status(200).json(ventasArtesano);
    } catch (error) {
        console.error('Error al listar ventas artesano en el controlador:', error);
        // Devuelve un mensaje de error
        res.status(500).json({ message: 'Error al listar ventas artesano en el Controlador' });
    }
};


const listarDetalleVentas = async (req, res) => {
    const id_usuario = req.params.id1;
    const id_pedido = req.params.id2;
    try {
        // Llama al modelo para obtener las ventas
        const detalleVentasArtesano = await TodasLasventasArtesanoModel.listarDetalleVentas(id_usuario,id_pedido);
        // Devuelve la lista 
        res.status(200).json(detalleVentasArtesano);
    } catch (error) {
        console.error('Error al listar delalle de ventas artesano:', error);
        // Devuelve un mensaje de error
        res.status(500).json({ message: 'Error al listar detalle de ventas artesano' });
    }
};

module.exports = {
   listarTodasLasVentas,
   listarDetalleVentas
};


