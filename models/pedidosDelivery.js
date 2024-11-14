
const sequelize = require('../config/database'); // Importa la conexión a la base de datos

const listarPedidos = async () => {
    const query = `
    SELECT * FROM fn_listar_todos_los_pedidos();
    `;
    try {
        const res = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
        });
        return res;
    } catch (error) {
        console.error('Error al listar todos los pedidos:', error);
        throw error;
    }
};


const listarPedidosPorId = async (id_usuario) => {
    const query = `
    SELECT * FROM fn_listar_pedidos_delivery_por_id($1);
    `;
    const values = [id_usuario];
    try {
        // Ejecuta la consulta y espera el resultado
        const res = await sequelize.query(query, {
            bind: values,
            type: sequelize.QueryTypes.SELECT
        });

        return res; 
    } catch (error) {
        console.error('Error al listar pedidos con id_usuario:', id_usuario, error); 
        throw error; 
    }
};


module.exports = {
    listarPedidos,
    listarPedidosPorId,
};
