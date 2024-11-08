const sequelize = require('../config/database'); // Importa la conexión a la base de datos

// Función para listar
const listarCompras = async (id_usuario) => {
    const query = `
    SELECT * FROM fn_listar_compras_cliente($1);
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
        console.error('Error al listar compras cliente con id_usuario:', id_usuario, error); 
        throw error; // Lanza el error para que sea manejado en el controlador
    }
};


// Función para listar detalle
const listarDetalleCompras = async (id_usuario, id_pedido) => {
    const query = `
    SELECT * FROM fn_listar_detalle_compras_cliente($1,$2);
    `;
    const values = [id_usuario, id_pedido];
    try {
        // Ejecuta la consulta y espera el resultado
        const res = await sequelize.query(query, {
            bind: values,
            type: sequelize.QueryTypes.SELECT
        });

        return res; 
    } catch (error) {
        console.error('Error al listar detalle compras cliente', error); 
        throw error; // Lanza el error para que sea manejado en el controlador
    }
};


module.exports = {
    listarCompras,
    listarDetalleCompras,
};
