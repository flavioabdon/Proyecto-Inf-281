const clienteModel = require('../models/clienteS');

// Controlador para insertar una nueva categoría
const registrarCliente = async (req, res) => {
    // Obtiene los datos del formulario
    const { nombreCliente, apellidoCliente, emailCliente, celularCliente, ciCliente, sexoCliente, fotoCliente, direccionCliente, latitud, longitud } = req.body;

    try {
        // Inserta la nueva categoría utilizando el modelo
        const nuevoCliente = await clienteModel.registrarCliente(nombreCliente, apellidoCliente, emailCliente, celularCliente, ciCliente, sexoCliente, fotoCliente, direccionCliente, latitud, longitud);
        // Devuelve un mensaje de éxito

        res.status(201).json({ message: 'Cliente  creado', cliente: nuevoCliente });

    } catch (error) {
        console.error('Error al crear al cliente:', error);
        // Devuelve un mensaje de error
        res.status(500).json({ message: 'Error al crear al cliente' });
    }
};



// listar todas las categorías
const listarClientes = async (req, res) => {
    try {
        // Llama al modelo para obtener las categorías
        const clientes = await clienteModel.listarClientes();
        // Devuelve la lista de categorías
        res.status(200).json(clientes);
    } catch (error) {
        console.error('Error al listar clientes:', error);
        // Devuelve un mensaje de error
        res.status(500).json({ message: 'Error al listar clientes' });
    }
};

// Controlador para actualizar una categoría
const actualizarCliente = async (req, res) => {
    const id_cliente = req.params.id; // El ID viene desde la URL
    const { nombreCliente, apellidoCliente, emailCliente, celularCliente, ciCliente, sexoCliente, fotoCliente, direccionCliente, estado_c, latitud, longitud } = req.body; // Datos enviados en el cuerpo
    try {
        const clienteActualizado = await clienteModel.actualizarCliente(
            id_cliente,
            nombreCliente, apellidoCliente, emailCliente, celularCliente, ciCliente, sexoCliente, fotoCliente, direccionCliente, latitud, longitud, estado_c
        );
        res.status(200).json({ message: 'Cliente actualizado', cliente: clienteActualizado });
    } catch (error) {
        console.error('Error al actualizar el cliente:', error);
        res.status(500).json({ message: 'Error al actualizar el cliente' });
    }
};

// Controlador para eliminar una categoría
const eliminarCliente = async (req, res) => {
    const id_cliente = req.params.id; // El ID viene desde la URL
    try {
        await clienteModel.eliminarCliente(id_cliente); // Llama al modelo para eliminar la categoría
        res.status(200).json({ message: 'Cliente eliminado' });
    } catch (error) {
        console.error('Error al eliminar el cliente:', error);
        res.status(500).json({ message: 'Error al eliminar el cliente' });
    }
};

module.exports = {
    registrarCliente,
    listarClientes,
    actualizarCliente,
    eliminarCliente,
};
