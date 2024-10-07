const sequelize = require('../config/database'); // Importa la conexión a la base de datos


// Función para insertar una categoría usando la función almacenada en PostgreSQL
const registrarArtesano = async (nombre, appellido, email, nro, ci, sexo, foto, especialidad, nroComunidad) => {
    const query = `
        SELECT * FROM fn_adm_insertar_artesano($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;

    // Valores que se van a insertar en la base de datos
    const values = [nombre, appellido, email, nro, ci, sexo, foto,"ADM", especialidad, nroComunidad];

    try {
        // Ejecuta la consulta que llama a la función almacenada y espera el resultado
        const [res] = await sequelize.query(query, {
            bind: values, // Vincula los valores con la consulta
            type: sequelize.QueryTypes.SELECT // Tipo de consulta SELECT ya que devuelve datos
        });
        return res; // Devuelve la categoría insertada
    } catch (error) {
        console.error('Error al registrar artesano:', error); // Manejo de errores más claro
        throw error; // Lanza el error para que sea manejado en el controlador
    }
};




// Función para listar todas las categorías
const listarArtesanos = async () => {
    const query = `
    select * from fn_listar_artesanos()
    `;

    try {
        // Ejecuta la consulta y espera el resultado
        const res = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT // Tipo de consulta SELECT ya que devuelve datos
        });
        return res; // Devuelve las categorías
    } catch (error) {
        console.error('Error al listar artesanos:', error); // Manejo de errores
        throw error; // Lanza el error para que sea manejado en el controlador
    }
};



// Función para actualizar una categoría
const actualizarArtesano = async (id, nombre, apellido, email, nro, ci, sexo, foto, especialidad, nroComunidad, estado) => {

    const query = `
    SELECT * FROM fn_actualizar_artesano($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);
    `;
    const values = [id, nombre, apellido, email, nro, ci, sexo, foto, "ADM", especialidad, nroComunidad, estado];

    try {
        const [res] = await sequelize.query(query, {
            bind: values,
            type: sequelize.QueryTypes.SELECT
        });
        return res; // Devuelve la categoría actualizada
    } catch (error) {
        console.error('Error al actualizar el artesano:', error);
        throw error;
    }
};



// Función para eliminar una categoría
const eliminarArtesano = async (id_artesano) => {
    const query = `
    SELECT fn_eliminar_artesano($1);
    `;
    const values = [id_artesano];

    try {
        await sequelize.query(query, {
            bind: values,
            type: sequelize.QueryTypes.SELECT
        });
        //console.log(`Categoría con ID ${id_categoria} eliminada exitosamente.`);
    } catch (error) {
        console.error('Error al eliminar el artesano:', error);
        throw error;
    }
};

module.exports = {
    registrarArtesano, // Exporta la función para usarla en otras partes de la aplicación
    listarArtesanos,
    actualizarArtesano,
    eliminarArtesano
};