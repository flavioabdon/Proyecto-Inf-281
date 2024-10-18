
const adminDeliveryModel = require('../models/adminDelivery');


// listar Deliveries
const listarAdminDeliverys = async (req, res) => {
    try {
        const Deliverys = await adminDeliveryModel.listarAdminDeliverys();
        res.status(200).json(Deliverys);
    } catch (error) {
        console.error('Error al listar Deliveries:', error);
        // Devuelve un mensaje de error
        res.status(500).json({ message: 'Error al listar Deliveries' });
    }
};



// Controlador para insertar un nuevo delivery
const registrarAdminDelivery = async (req, res) => {
    // Obtiene los datos del formulario, incluyendo el archivo
    const { nombreDelivery, apellidoDelivery, ciDelivery, emailDelivery, celularDelivery, tipoVehiculoDelivery, matriculaVehiculoDelivery, sexoDelivery } = req.body;
    const fotoDelivery = req.file; // El archivo de imagen se obtiene con middleware como multer

    try {
        // Inserta el nuevo delivery utilizando el modelo
        const nuevoDelivery = await adminDeliveryModel.registrarAdminDelivery(
            nombreDelivery,
            apellidoDelivery,
            ciDelivery,
            emailDelivery,
            celularDelivery,
            tipoVehiculoDelivery,
            matriculaVehiculoDelivery,
            sexoDelivery,
            fotoDelivery ? fotoDelivery.path : null, // foto
            'admin'
        );

        // Devuelve un mensaje de éxito
        res.status(201).json({ message: 'Delivery registrado con éxito', delivery: nuevoDelivery });

    } catch (error) {
        console.error('Error al registrar el delivery:', error);
        // Devuelve un mensaje de error
        res.status(500).json({ message: 'Error al registrar el delivery' });
    }
};



// Controlador para actualizar un delivery
const actualizarAdminDelivery = async (req, res) => {
    const id_delivery = req.params.id; // El ID viene desde la URL
    const {
        nombreDelivery,
        apellidoDelivery,
        ciDelivery,
        emailDelivery,
        numeroContactoDelivery,
        tipoVehiculo,
        matriculaVehiculo,
        sexoDelivery,
        estadoDelivery
    } = req.body; // Datos enviados en el cuerpo

    // Verificar los datos recibidos
    // console.log('ID delivery recibido:', id_delivery);
    // console.log('Datos del cuerpo recibidos:', req.body);

    try {
        // Llamada a la función del modelo para actualizar los datos del delivery
        const deliveryActualizado = await adminDeliveryModel.actualizarAdminDelivery(
            id_delivery,
            nombreDelivery,
            apellidoDelivery,
            ciDelivery,
            emailDelivery,
            numeroContactoDelivery,
            tipoVehiculo,
            matriculaVehiculo,
            sexoDelivery,
            estadoDelivery
        );

        // Responder con éxito si todo salió bien
        res.status(200).json({ message: 'Delivery actualizado', delivery: deliveryActualizado });
    } catch (error) {
        console.error('Error al actualizar el delivery:', error);
        res.status(500).json({ message: 'Error al actualizar delivery' });
    }
};



// Controlador para eliminar un delivery
const eliminarAdminDelivery = async (req, res) => {
    const id_usuario = req.params.id; // El ID viene desde la URL
    try {
        await adminDeliveryModel.eliminarAdminDelivery(id_usuario); // Llama al modelo para eliminar
        res.status(200).json({ message: 'Delivery eliminado' });
    } catch (error) {
        console.error('Error al eliminar al Delivery:', error);
        res.status(500).json({ message: 'Error al eliminar Delivery' });
    }
};



module.exports = {
    listarAdminDeliverys,
    registrarAdminDelivery,
    actualizarAdminDelivery,
    eliminarAdminDelivery,
};
