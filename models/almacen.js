const sequelize = require('../config/database'); // Importa la conexión a la base de datos


// Función para insertar usando la función almacenada en PostgreSQL
const registrarAlmacen = async (nombre, ubicacionGeoRefAlm, direccion, capacidad) => {
    const query = `
        SELECT * FROM fn_insertar_almacen($1, $2, $3, $4, $5, $6)
    `;

    // Valores que se van a insertar en la base de datos
    const values = [nombre, ubicacionGeoRefAlm, direccion, capacidad, "Administrador", "Activo"];

    try {
        // Ejecuta la consulta que llama a la función almacenada y espera el resultado
        const [res] = await sequelize.query(query, {
            bind: values, // Vincula los valores con la consulta
            type: sequelize.QueryTypes.SELECT // Tipo de consulta SELECT ya que devuelve datos
        });
        return res; // Devuelve el almacen insertado
    } catch (error) {
        console.error('Error al registrar almacen en el modelo:', error); // Manejo de errores más claro
        throw error; // Lanza el error para que sea manejado en el controlador
    }
};


// Función para listar 
const listarAlmacenes = async () => {
    const query = `
    SELECT * FROM fn_listar_almacenes();
    `;

    try {
        // Ejecuta la consulta y espera el resultado
        const res = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT // Tipo de consulta SELECT ya que devuelve datos
        });
        return res; // Devuelve datos almacenes
    } catch (error) {
        console.error('Error al listar almacenes:', error); // Manejo de errores
        throw error; // Lanza el error para que sea manejado en el controlador
    }
};


// Función para actualizar 
const actualizarAlmacen = async (id_almacen, nombre, ubicacionGeoRefAlm, direccion, capacidad) => {

    const query = `
    SELECT * FROM fn_actualizar_almacen($1, $2, $3, $4, $5, $6);
    `;
    const values = [id_almacen, nombre, ubicacionGeoRefAlm, direccion, capacidad, "Administrador"];

    try {
        const [res] = await sequelize.query(query, {
            bind: values,
            type: sequelize.QueryTypes.SELECT
        });
        return res; // Devuelve el almacen actualizado
    } catch (error) {
        console.error('Error al actualizar el almacen:', error);
        throw error;
    }
};



// Función para eliminar
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
        //console.log(`Almacen con ID ${id_almacen} eliminado exitosamente.`);
    } catch (error) {
        console.error('Error al eliminar el almacen:', error);
        throw error;
    }
};

// Función para listar un almacén específico por id_almacen
const listarAlmacenPorId = async (id_almacen) => {
    console.log("ID de almacen:", id_almacen);
    const query = `
    SELECT * FROM fn_listar_almacenes_ID($1);
    `;

    try {
        // Ejecuta la consulta con el parámetro id_almacen usando bind
        const res = await sequelize.query(query, {
            bind: [id_almacen], // Cambiado a bind y arreglo de valores
            type: sequelize.QueryTypes.SELECT // Tipo de consulta SELECT ya que devuelve datos
        });
        return res; // Devuelve datos del almacén específico
    } catch (error) {
        console.error('Error al listar el almacén por ID:', error); // Manejo de errores
        throw error; // Lanza el error para ser manejado en el controlador
    }
};

// Función para listar un almacén específico por id_producto
const listarAlmacenPorIdproducto = async (id_prod) => {
    console.log("ID de Producto en el modelo:", id_prod);
    const query = `
    SELECT * FROM fn_listar_almacenes_IDproductoGEO($1);
    `;

    try {
        // Ejecuta la consulta con el parámetro id_almacen
        const res = await sequelize.query(query, {
            bind: [id_prod], // Reemplaza :id_almacen con el valor proporcionado
            type: sequelize.QueryTypes.SELECT // Tipo de consulta SELECT ya que devuelve datos
        });
        return res; // Devuelve datos del almacén específico
    } catch (error) {
        console.error('Error al listar el almacén por ID del Producto:', error); // Manejo de errores
        throw error; // Lanza el error para ser manejado en el controlador
    }
};


// Función para listar ventas
const obtenerCoordenadas = async (id_pedido) => {
    const query = `
    SELECT * FROM fn_obtener_coordenadas_direccion_almacen($1);
    `;
    const values = [id_pedido];
    try {
        // Ejecuta la consulta y espera el resultado
        const res = await sequelize.query(query, {
            bind: values,
            type: sequelize.QueryTypes.SELECT
        });

        return res; 
    } catch (error) {
        console.error('Error al obtener coordenadas almacen con id_pedido:', id_pedido, error); 
        throw error; 
    }
};

module.exports = {
    registrarAlmacen, // Exporta la función para usarla en otras partes de la aplicación
    listarAlmacenes, // Exporta la función para listar almacenes
    actualizarAlmacen, // Exporta la función para actualizar almacenes
    eliminarAlmacen,    //Exporta la funcion para eliminar almacen
    listarAlmacenPorId, //Exporta la funcion para listar almacen especifico por ID de almacen
    listarAlmacenPorIdproducto, //Exporta la funcion para listar almacen especifico por ID de producto
    obtenerCoordenadas,
};
