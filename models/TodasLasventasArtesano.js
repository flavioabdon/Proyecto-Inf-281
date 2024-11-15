const sequelize = require('../config/database'); // Importa la conexión a la base de datos

// Función para listar ventas
const listarVentas = async () => {
    const query = `
    SELECT * FROM fn_listar_todas_las_ventas_artesano();
    `;
    const values = [];
    try {
        // Ejecuta la consulta y espera el resultado
        const res = await sequelize.query(query, {
            bind: values,
            type: sequelize.QueryTypes.SELECT
        });

        return res; // Devuelve las ventas del artesano
    } catch (error) {
        console.error('Error al listar todas las ventas en el modelo', error); // Mejora en el manejo de errores
        throw error; // Lanza el error para que sea manejado en el controlador
    }
};


// Función para listar ventas
const listarDetalleVentas = async (id_usuario, id_pedido) => {
    const query = `
    SELECT * FROM fn_listar_detalle_ventas_artesano($1,$2);
    `;
    const values = [id_usuario, id_pedido];
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
