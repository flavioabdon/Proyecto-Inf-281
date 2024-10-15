const sequelize = require('../config/database'); // Importa la conexión a la base de datos

// Función para listar todas las clientes
const listarAdminClientes = async () => {
    const query = `
    select *  from fn_listar_clientes()
    `;

    try {
        // Ejecuta la consulta y espera el resultado
        const res = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT // Tipo de consulta SELECT ya que devuelve datos
        });
        return res; // Devuelve las categorías
    } catch (error) {
        console.error('Error al listar clientes:', error); // Manejo de errores
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



module.exports = {
    listarAdminClientes,
    actualizarAdminCliente,
};