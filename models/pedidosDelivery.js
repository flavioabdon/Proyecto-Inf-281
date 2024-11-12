
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


module.exports = {
    listarPedidos,
};
