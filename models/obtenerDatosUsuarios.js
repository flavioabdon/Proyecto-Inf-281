const sequelize = require('../config/database'); // Importa la conexión a la base de datos

// Función para obtener datos del cliente
const obtenerDatosCliente = async (id_usuario) => {
    const query = `
    SELECT * FROM fn_obtener_datos_cliente_por_id($1);
    `;
    const values = [id_usuario];
    try {
        const res = await sequelize.query(query, {
            bind: values,
            type: sequelize.QueryTypes.SELECT
        });
        return res;
    } catch (error) {
        console.error('Error al obtener datos del cliente con id_usuario:', id_usuario, error);
        throw error;
    }
};

// Función para obtener datos del artesano
const obtenerDatosArtesano = async (id_usuario) => {
    const query = `
    SELECT * FROM fn_obtener_datos_artesano_por_id($1);
    `;
    const values = [id_usuario];
    try {
        const res = await sequelize.query(query, {
            bind: values,
            type: sequelize.QueryTypes.SELECT
        });
        return res;
    } catch (error) {
        console.error('Error al obtener datos del artesano con id_usuario:', id_usuario, error);
        throw error;
    }
};

// Función para obtener datos del delivery
const obtenerDatosDelivery = async (id_usuario) => {
    const query = `
    SELECT * FROM fn_obtener_datos_delivery_por_id($1);
    `;
    const values = [id_usuario];
    try {
        const res = await sequelize.query(query, {
            bind: values,
            type: sequelize.QueryTypes.SELECT
        });
        return res;
    } catch (error) {
        console.error('Error al obtener datos del delivery con id_usuario:', id_usuario, error);
        throw error;
    }
};

module.exports = {
    obtenerDatosCliente,
    obtenerDatosArtesano,
    obtenerDatosDelivery,
};

