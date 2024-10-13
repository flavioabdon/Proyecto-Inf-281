const sequelize = require('../config/database'); // Importa la conexión a la base de datos


// Función para insertar una comunidad usando la función almacenada en PostgreSQL
const registrarComunidad = async (Departamento, provincia, Municipio, nombreCom, ubicacion_geoRef_Com) => {
    const query = `
        SELECT * FROM fn_insertar_comunidad($1, $2, $3, $4, $5, $6, $7)
    `;

    // Valores que se van a insertar en la base de datos
    const values = [Departamento, provincia, Municipio, nombreCom, ubicacion_geoRef_Com, "Administrador", "Activo"];

    try {
        // Ejecuta la consulta que llama a la función almacenada y espera el resultado
        const [res] = await sequelize.query(query, {
            bind: values, // Vincula los valores con la consulta
            type: sequelize.QueryTypes.SELECT // Tipo de consulta SELECT ya que devuelve datos
        });
        return res; // Devuelve la comunidad insertada
    } catch (error) {
        console.error('Error al registrar comunidad:', error); // Manejo de errores más claro
        throw error; // Lanza el error para que sea manejado en el controlador
    }
};



// Función para listar todas las comunidades
const listarComunidades = async () => {
    const query = `
    SELECT * FROM fn_listar_comunidades();
    `;

    try {
        // Ejecuta la consulta y espera el resultado
        const res = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT // Tipo de consulta SELECT ya que devuelve datos
        });
        return res; // Devuelve las comunidades
    } catch (error) {
        console.error('Error al listar comunidades:', error); // Manejo de errores
        throw error; // Lanza el error para que sea manejado en el controlador
    }
};



// Función para actualizar una comunidad
const actualizarComunidad = async (id_comunidad, Departamento, provincia, Municipio, nombreCom, ubicacion_geoRef_Com) => {

    const query = `
    SELECT * FROM fn_actualizar_comunidad($1, $2, $3, $4, $5, $6);
    `;
    const values = [id_comunidad, Departamento, provincia, Municipio, nombreCom, ubicacion_geoRef_Com];

    try {
        const [res] = await sequelize.query(query, {
            bind: values,
            type: sequelize.QueryTypes.SELECT
        });
        return res; // Devuelve la comunidad actualizada
    } catch (error) {
        console.error('Error al actualizar la comunidad:', error);
        throw error;
    }
};


// Función para eliminar una comunidad
const eliminarComunidad = async (id_comunidad) => {
    const query = `
    SELECT fn_eliminar_comunidad($1);
    `;
    const values = [id_comunidad];

    try {
        await sequelize.query(query, {
            bind: values,
            type: sequelize.QueryTypes.SELECT
        });
        //console.log(`Categoría con ID ${id_comunidad} eliminada exitosamente.`);
    } catch (error) {
        console.error('Error al eliminar la comunidad:', error);
        throw error;
    }
};

module.exports = {
    registrarComunidad, // Exporta la función para usarla en otras partes de la aplicación
    listarComunidades, // Exporta la función para listar comunidades
    actualizarComunidad,
    eliminarComunidad,
};
