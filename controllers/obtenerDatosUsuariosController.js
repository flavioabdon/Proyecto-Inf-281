const obtenerDatosUsuariosModel = require('../models/obtenerDatosUsuarios');

// datos por id_usuario_cliente
const obtenerDatosCliente = async (req, res) => {
    const id_usuario = req.params.id; //
    try {
        const datosCliente = await obtenerDatosUsuariosModel.obtenerDatosCliente(id_usuario);
        // Devuelve datos
        res.status(200).json(datosCliente);
    } catch (error) {
        console.error('Error al obtener datos del cliente:', error);
        // Devuelve un mensaje de error
        res.status(500).json({ message: 'Error al obtener datos del cliente' });
    }
};


// Controlador para obtener datos del artesano
const obtenerDatosArtesano = async (req, res) => {
    const id_usuario = req.params.id;
    try {
        const datosArtesano = await obtenerDatosUsuariosModel.obtenerDatosArtesano(id_usuario); 
        res.status(200).json(datosArtesano);
    } catch (error) {
        console.error('Error al obtener datos del artesano:', error);
        res.status(500).json({ message: 'Error al obtener datos del artesano' });
    }
};

// Controlador para obtener datos del delivery
const obtenerDatosDelivery = async (req, res) => {
    const id_usuario = req.params.id;
    try {
        const datosDelivery = await obtenerDatosUsuariosModel.obtenerDatosDelivery(id_usuario); 
        res.status(200).json(datosDelivery);
    } catch (error) {
        console.error('Error al obtener datos del delivery:', error);
        res.status(500).json({ message: 'Error al obtener datos del delivery' });
    }
};


module.exports = {
    obtenerDatosCliente,
    obtenerDatosArtesano,
    obtenerDatosDelivery,
 };
 
 