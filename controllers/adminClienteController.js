const adminClienteModel = require('../models/adminCliente');



// listar clientes
const listarAdminClientes = async (req, res) => {
    try {
        // Llama al modelo para obtener las categorías
        const clientes = await adminClienteModel.listarAdminClientes();
        // Devuelve la lista de categorías
        res.status(200).json(clientes);
    } catch (error) {
        console.error('Error al listar clientes:', error);
        // Devuelve un mensaje de error
        res.status(500).json({ message: 'Error al listar clientes' });
    }
};

// Controlador para insertar un nuevo cliente
const registrarAdminCliente = async (req, res) => {
    // Obtiene los datos del formulario, incluyendo el archivo
    const { nombreCliente, apellidoCliente, ciCliente, emailCliente, celularCliente, direccionCliente, sexoCliente, longitudCliente, latitudCliente } = req.body;
    const fotoCliente = req.file; // El archivo de imagen se obtiene con middleware como multer

    try {
        // Inserta el nuevo artesano utilizando el modelo
        const nuevoCliente = await adminClienteModel.registrarAdminCliente(
            nombreCliente,
            apellidoCliente,
            ciCliente,
            emailCliente,
            celularCliente,
            direccionCliente,
            sexoCliente,
            longitudCliente,
            latitudCliente,
            fotoCliente ? fotoCliente.path : null, // foto
            'admin'
        );

        // Devuelve un mensaje de éxito
        res.status(201).json({ message: 'Cliente registrado con éxito', cliente: nuevoCliente });

    } catch (error) {
        console.error('Error al registrar el cliente:', error);
        // Devuelve un mensaje de error
        res.status(500).json({ message: 'Error al registrar el cliente' });
    }
};


// Controlador para actualizar un cliente
const actualizarAdminCliente = async (req, res) => {
    const id_usuario = req.params.id; // El ID viene desde la URL
    const {
        ciCliente,
        nombreCliente,
        apellidoCliente,
        emailCliente,
        direccionCliente,
        celularCliente,
        sexoCliente,
        estadoCliente
    } = req.body; // Datos enviados en el cuerpo

     // Verificar los datos recibidos
    //  console.log('ID cliente recibido:', id_usuario);
    //  console.log('Datos del cuerpo recibidos:', req.body);
 

    try {
        const clienteActualizado = await adminClienteModel.actualizarAdminCliente(
            id_usuario,
            ciCliente,
            nombreCliente,
            apellidoCliente,
            emailCliente,
            direccionCliente,
            celularCliente,
            sexoCliente,
            estadoCliente
        );
        res.status(200).json({ message: 'Cliente actualizado', cliente: clienteActualizado });
    } catch (error) {
        console.error('Error al actualizar el cliente:', error);
        res.status(500).json({ message: 'Error al actualizar el cliente' });
    }
};

// Controlador para eliminar un cliente
const eliminarAdminCliente = async (req, res) => {
    const id_usuario = req.params.id; // El ID viene desde la URL
    try {
        await adminClienteModel.eliminarAdminCliente(id_usuario); // Llama al modelo para eliminar la categoría
        res.status(200).json({ message: 'Cliente eliminado' });
    } catch (error) {
        console.error('Error al eliminar al Cliente:', error);
        res.status(500).json({ message: 'Error al eliminar el Cliente' });
    }
};



module.exports = {
    listarAdminClientes,
    registrarAdminCliente,
    actualizarAdminCliente,
    eliminarAdminCliente,
};
