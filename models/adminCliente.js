const sequelize = require('../config/database'); // Importa la conexión a la base de datos

// Función para listar todos los clientes
const listarAdminClientes = async () => {
    const query = `
    select *  from fn_listar_clientes()
    `;

    try {
        // Ejecuta la consulta y espera el resultado
        const res = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT // Tipo de consulta SELECT ya que devuelve datos
        });
        return res; 
    } catch (error) {
        console.error('Error al listar clientes:', error); // Manejo de errores
        throw error; // Lanza el error para que sea manejado en el controlador
    }
};

// Función para insertar un cliente usando la función almacenada en PostgreSQL
const registrarAdminCliente = async (nombre, apellido, ci, email, celular, direccion, sexo, longitud, latitud, foto, usuario) => {
    const query = `
       SELECT * FROM fn_adm_insertar_cliente($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
    `;

    // Valores que se van a insertar en la base de datos
    const values = [nombre, apellido, email, celular, ci, sexo, foto, usuario, direccion, longitud, latitud];
    // console.log(values);
    try {
        // Ejecuta la consulta que llama a la función almacenada y espera el resultado
        const [res] = await sequelize.query(query, {
            bind: values, // Vincula los valores con la consulta
            type: sequelize.QueryTypes.SELECT // Tipo de consulta SELECT ya que devuelve datos
        });
        return res; // Devuelve el artesano insertado
    } catch (error) {
        console.error('Error al registrar cliente:', error); // Manejo de errores
        throw error; // Lanza el error para que sea manejado en el controlador
    }
};

// Función para actualizar un cliente
const actualizarAdminCliente = async (id_usuario, ci, nombre, apellido, email, direccion, numero_contacto, sexo, estado) => {

    const query = `
    SELECT fn_actualizar_cliente($1, $2, $3, $4, $5, $6, $7, $8, $9);
    `;
    const values = [id_usuario, ci, nombre, apellido, email, direccion, numero_contacto, sexo, estado];

    try {
        const [res] = await sequelize.query(query, {
            bind: values,
            type: sequelize.QueryTypes.SELECT
        });
        return res; // Devuelve la categoría actualizada
    } catch (error) {
        console.error('Error al actualizar el cliente:', error);
        throw error;
    }
};

// Funcion para eliminar un Cliente
const eliminarAdminCliente = async (id_usuario) => {
    const query = `
    SELECT fn_eliminar_cliente($1);
    `;
    const values = [id_usuario];

    try {
        await sequelize.query(query, {
            bind: values,
            type: sequelize.QueryTypes.SELECT
        });
    } catch (error) {
        console.error('Error al eliminar al Cliente:', error);
        throw error;
    }
};


module.exports = {
    listarAdminClientes,
    registrarAdminCliente,
    actualizarAdminCliente,
    eliminarAdminCliente,
};