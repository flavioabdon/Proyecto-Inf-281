const sequelize = require('../config/database'); // Importa la conexión a la base de datos

// Función para listar ventas
const listarVentas = async (id_usuario) => {
    const query = `
    SELECT * FROM fn_listar_ventas_artesano($1);
    `;
    const values = [id_usuario];
    try {
        // Ejecuta la consulta y espera el resultado
        const res = await sequelize.query(query, {
            bind: values,
            type: sequelize.QueryTypes.SELECT
        });

        return res; // Devuelve las ventas del artesano
    } catch (error) {
        console.error('Error al listar ventas artesano con id_usuario:', id_usuario, error); // Mejora en el manejo de errores
        throw error; // Lanza el error para que sea manejado en el controlador
    }
};


// Función para listar ventas
const listarDetalleVentas = async (id_usuario_cliente, id_pedido, id_usuario_artesano) => {
    const query = `
    SELECT * FROM fn_listar_productos_ventas_artesano($1,$2,$3);
    `;
    const values = [id_usuario_cliente, id_pedido, id_usuario_artesano];
    try {
        // Ejecuta la consulta y espera el resultado
        const res = await sequelize.query(query, {
            bind: values,
            type: sequelize.QueryTypes.SELECT
        });

        return res; // Devuelve las ventas del artesano
    } catch (error) {
        console.error('Error al listar detalle ventas artesano', error); // Mejora en el manejo de errores
        throw error; // Lanza el error para que sea manejado en el controlador
    }
};


module.exports = {
    listarVentas,
    listarDetalleVentas,
};
