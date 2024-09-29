const sequelize = require('../config/database'); // Importa la conexión a la base de datos


// Función para insertar una categoría usando la función almacenada en PostgreSQL
const registrarCategoria = async (nombre, descripcion, icono) => {
    const query = `
        SELECT * FROM fn_insertar_categoria($1, $2, $3, $4, $5)
    `;

    // Valores que se van a insertar en la base de datos
    const values = [nombre, descripcion, icono, "Activo", "Admin"];

    try {
        // Ejecuta la consulta que llama a la función almacenada y espera el resultado
        const [res] = await sequelize.query(query, {
            bind: values, // Vincula los valores con la consulta
            type: sequelize.QueryTypes.SELECT // Tipo de consulta SELECT ya que devuelve datos
        });
        return res; // Devuelve la categoría insertada
    } catch (error) {
        console.error('Error al registrar categoría:', error); // Manejo de errores más claro
        throw error; // Lanza el error para que sea manejado en el controlador
    }
};



// Función para listar todas las categorías
const listarCategorias = async () => {
    const query = `
    SELECT * FROM fn_listar_categorias();
    `;

    try {
        // Ejecuta la consulta y espera el resultado
        const res = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT // Tipo de consulta SELECT ya que devuelve datos
        });
        return res; // Devuelve las categorías
    } catch (error) {
        console.error('Error al listar categorías:', error); // Manejo de errores
        throw error; // Lanza el error para que sea manejado en el controlador
    }
};



module.exports = {
    registrarCategoria, // Exporta la función para usarla en otras partes de la aplicación
    listarCategorias, // Exporta la función para listar categorías
};
