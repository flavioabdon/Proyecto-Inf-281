const sequelize = require('../config/database'); // Importa la conexión a la base de datos


// Función para insertar una categoría usando la función almacenada en PostgreSQL
const registrarAlmacen = async (codigo, direccion, capacidad) => {
    const query = `
        SELECT * FROM fn_insertar_almacen($1, $2, $3, $4, $5)
    `;

    // Valores que se van a insertar en la base de datos
    const values = [codigo, direccion, capacidad, "Administrador", "Activo"];

    try {
        // Ejecuta la consulta que llama a la función almacenada y espera el resultado
        const [res] = await sequelize.query(query, {
            bind: values, // Vincula los valores con la consulta
            type: sequelize.QueryTypes.SELECT // Tipo de consulta SELECT ya que devuelve datos
        });
        return res; // Devuelve la categoría insertada
    } catch (error) {
        console.error('Error al registrar almacen:', error); // Manejo de errores más claro
        throw error; // Lanza el error para que sea manejado en el controlador
    }
};




// Función para listar todas las categorías
const listarAlmacenes = async () => {
    const query = `
    SELECT * FROM fn_listar_almacenes();
    `;

    try {
        // Ejecuta la consulta y espera el resultado
        const res = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT // Tipo de consulta SELECT ya que devuelve datos
        });
        return res; // Devuelve las categorías
    } catch (error) {
        console.error('Error al listar almacenes:', error); // Manejo de errores
        throw error; // Lanza el error para que sea manejado en el controlador
    }
};



// Función para actualizar una categoría
const actualizarAlmacen = async (id_almacen, codigo, direccion, capacidad) => {

    const query = `
    SELECT * FROM fn_actualizar_almacen($1, $2, $3, $4);
    `;
    const values = [id_almacen, codigo, direccion, capacidad];

    try {
        const [res] = await sequelize.query(query, {
            bind: values,
            type: sequelize.QueryTypes.SELECT
        });
        return res; // Devuelve el almacen actualizada
    } catch (error) {
        console.error('Error al actualizar el almacen:', error);
        throw error;
    }
};



// Función para eliminar una categoría
const eliminarAlmacen = async (id_almacen) => {
    const query = `
    SELECT fn_eliminar_almacen($1);
    `;
    const values = [id_almacen];

    try {
        await sequelize.query(query, {
            bind: values,
            type: sequelize.QueryTypes.SELECT
        });
        //console.log(`Categoría con ID ${id_almacen} eliminada exitosamente.`);
    } catch (error) {
        console.error('Error al eliminar el almacen:', error);
        throw error;
    }
};

module.exports = {
    registrarAlmacen, // Exporta la función para usarla en otras partes de la aplicación
    listarAlmacenes, // Exporta la función para listar categorías
    actualizarAlmacen,
    eliminarAlmacen,
};