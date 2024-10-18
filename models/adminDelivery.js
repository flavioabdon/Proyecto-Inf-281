const sequelize = require('../config/database'); // Importa la conexión a la base de datos
// Función para listar todos los deliverys
const listarAdminDeliverys = async () => {
    const query = `
         select * from fn_listar_deliveries();
    `;
    try {
        // Ejecuta la consulta y espera el resultado
        const res = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT // Tipo de consulta SELECT ya que devuelve datos
        });
        return res;
    } catch (error) {
        console.error('Error al listar deliverys:', error); // Manejo de errores
        throw error; // Lanza el error para que sea manejado en el controlador
    }
};



// Función para insertar un delivery usando la función almacenada en PostgreSQL
const registrarAdminDelivery = async (nombre, apellido, ci, email, celular, tipoVehiculo, matriculaVehiculo, sexo, foto, usuario) => {
    const query = `
       SELECT * FROM fn_adm_insertar_delivery($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
    `;

    // Valores que se van a insertar en la base de datos
    const values = [nombre, apellido, ci, email, celular, tipoVehiculo, matriculaVehiculo, sexo, foto, usuario];
    // console.log(values);
    try {
        // Ejecuta la consulta que llama a la función almacenada y espera el resultado
        const [res] = await sequelize.query(query, {
            bind: values, // Vincula los valores con la consulta
            type: sequelize.QueryTypes.SELECT // Tipo de consulta SELECT ya que devuelve datos
        });
        return res; // Devuelve el delivery insertado
    } catch (error) {
        console.error('Error al registrar delivery:', error); // Manejo de errores
        throw error; // Lanza el error para que sea manejado en el controlador
    }
};


// Función para actualizar un delivery
const actualizarAdminDelivery = async (id_delivery, nombre, apellido, ci, email, contacto, tipoVehiculo, matricula, sexo, estado) => {
    const query = `
    SELECT * FROM fn_actualizar_delivery($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
    `;
    const values = [id_delivery, nombre, apellido, ci, email, contacto, tipoVehiculo, matricula, sexo, estado];

    try {
        const [res] = await sequelize.query(query, {
            bind: values,
            type: sequelize.QueryTypes.SELECT
        });
        return res; // Devuelve el delivery actualizado
    } catch (error) {
        console.error('Error al actualizar el delivery:', error);
        throw error;
    }
};


// Función para eliminar una delivery
const eliminarAdminDelivery = async (id_usuario) => {
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
        console.error('Error al eliminar delivery:', error);
        throw error;
    }
};

module.exports = {
    listarAdminDeliverys,
    registrarAdminDelivery,
    actualizarAdminDelivery,
    eliminarAdminDelivery,
};
