const sequelize = require('../config/database'); // Importa la conexión a la base de datos
// Función para listar todos los artesanos
const listarAdminArtesanos = async () => {
    const query = `
         select * from fn_listar_artesanos();
    `;
    try {
        // Ejecuta la consulta y espera el resultado
        const res = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT // Tipo de consulta SELECT ya que devuelve datos
        });
        return res;
    } catch (error) {
        console.error('Error al listar artesanos:', error); // Manejo de errores
        throw error; // Lanza el error para que sea manejado en el controlador
    }
};



// Función para insertar un artesano usando la función almacenada en PostgreSQL
const registrarAdminArtesano = async (nombre, apellido, ci, email, celular, especialidad, sexo, comunidad, foto, usuario) => {
    const query = `
       SELECT * FROM fn_adm_insertar_artesano($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
    `;

    // Valores que se van a insertar en la base de datos
    const values = [nombre, apellido, ci, email, celular, especialidad, sexo, comunidad, foto, usuario];
    // console.log(values);
    try {
        // Ejecuta la consulta que llama a la función almacenada y espera el resultado
        const [res] = await sequelize.query(query, {
            bind: values, // Vincula los valores con la consulta
            type: sequelize.QueryTypes.SELECT // Tipo de consulta SELECT ya que devuelve datos
        });
        return res; // Devuelve el artesano insertado
    } catch (error) {
        console.error('Error al registrar artesano:', error); // Manejo de errores
        throw error; // Lanza el error para que sea manejado en el controlador
    }
};



// Función para actualizar un artesano
const actualizarAdminArtesano = async (id_artesano, nombre, apellido, ci, email, contacto, especialidad, sexo, comunidad, estado) => {

    const query = `
    SELECT * FROM fn_actualizar_artesano($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
    `;
    const values = [id_artesano, nombre, apellido, ci, email, contacto, especialidad, sexo, comunidad, estado];

    try {
        const [res] = await sequelize.query(query, {
            bind: values,
            type: sequelize.QueryTypes.SELECT
        });
        return res; // Devuelve el artesano actualizado
    } catch (error) {
        console.error('Error al actualizar el artesano:', error);
        throw error;
    }
};


// Función para eliminar una artesano
const eliminarAdminArtesano = async (id_usuario) => {
    const query = `
    SELECT fn_eliminar_artesano($1);
    `;
    const values = [id_usuario];

    try {
        await sequelize.query(query, {
            bind: values,
            type: sequelize.QueryTypes.SELECT
        });
    } catch (error) {
        console.error('Error al eliminar artesano:', error);
        throw error;
    }
};

module.exports = {
    listarAdminArtesanos,
    registrarAdminArtesano,
    actualizarAdminArtesano,
    eliminarAdminArtesano,
};
