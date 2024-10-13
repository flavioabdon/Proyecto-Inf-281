const sequelize = require('../config/database'); // Importa la conexión a la base de datos


// Función para insertar una categoría usando la función almacenada en PostgreSQL
const registrarDelivery = async (nombre, appellido, email, nro, ci, sexo, foto, vehiculo, matricula) => {
    const query = `
        SELECT * FROM fn_adm_insertar_delivery($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;

    // Valores que se van a insertar en la base de datos
    const values = [nombre, appellido, email, nro, ci, sexo, foto,"ADM", vehiculo, matricula];

    try {
        // Ejecuta la consulta que llama a la función almacenada y espera el resultado
        const [res] = await sequelize.query(query, {
            bind: values, // Vincula los valores con la consulta
            type: sequelize.QueryTypes.SELECT // Tipo de consulta SELECT ya que devuelve datos
        });
        return res; // Devuelve la categoría insertada
    } catch (error) {
        console.error('Error al registrar delivery:', error); // Manejo de errores más claro
        throw error; // Lanza el error para que sea manejado en el controlador
    }
};

// Función para listar todas las categorías
const listarDeliverys = async () => {
    const query = `
    select *  from fn_listar_deliverys()
    `;

    try {
        // Ejecuta la consulta y espera el resultado
        const res = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT // Tipo de consulta SELECT ya que devuelve datos
        });
        return res; // Devuelve las categorías
    } catch (error) {
        console.error('Error al listar deliverys:', error); // Manejo de errores
        throw error; // Lanza el error para que sea manejado en el controlador
    }
};

// Función para eliminar una categoría
const eliminarDelivery = async (id_usuario) => {
    const query = `
    SELECT fn_eliminar_delivery($1);
    `;
    const values = [id_usuario];

    try {
        await sequelize.query(query, {
            bind: values,
            type: sequelize.QueryTypes.SELECT
        });
    } catch (error) {
        console.error('Error al eliminar el delivery:', error);
        throw error;
    }
};

module.exports = {
    registrarDelivery, 
    listarDeliverys,
    //actualizarCliente,
    eliminarDelivery
};