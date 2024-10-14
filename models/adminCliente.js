const sequelize = require('../config/database'); // Importa la conexión a la base de datos

// Función para listar todas las clientes
const listarClientes = async () => {
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


module.exports = {
    listarClientes, 
};