const sequelize = require('../config/database'); // Importa la conexión a la base de datos

// Función para insertar una categoría usando la función almacenada en PostgreSQL
const registrarCliente = async (nombre, appellido, email, nro, ci, sexo, foto, direccion, longitud, latitud) => {
    const query = `
        SELECT * FROM fn_adm_insertar_cliente($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `;

    // Valores que se van a insertar en la base de datos
    const values = [nombre, appellido, email, nro, ci, sexo, foto,"ADM", direccion, longitud, latitud];

    try {
        // Ejecuta la consulta que llama a la función almacenada y espera el resultado
        const [res] = await sequelize.query(query, {
            bind: values, // Vincula los valores con la consulta
            type: sequelize.QueryTypes.SELECT // Tipo de consulta SELECT ya que devuelve datos
        });
        return res; // Devuelve la categoría insertada
    } catch (error) {
        console.error('Error al registrar cliente:', error); // Manejo de errores más claro
        throw error; // Lanza el error para que sea manejado en el controlador
    }
};

// Función para listar todas las categorías
const listarClientes = async () => {
    const query = `
    select *  from fn_listar_clientes()
    `;

    try {
        // Ejecuta la consulta y espera el resultado
        const res = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT // Tipo de consulta SELECT ya que devuelve datos
        });
        return res; // Devuelve las categorías
    } catch (error) {
        console.error('Error al listar clientes:', error); // Manejo de errores
        throw error; // Lanza el error para que sea manejado en el controlador
    }
};



// Función para actualizar una categoría
const actualizarCliente = async (id, nombre, apellido, email, nro, ci, sexo, foto, direccion, longitud, latitud, estado) => {

    const query = `
    SELECT fn_actualizar_cliente($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);
    `;
    const values = [id, nombre, apellido, email, nro, ci, sexo, foto, "ADM", direccion, longitud, latitud, estado];
    
    console.log('Valores enviados:', values);

    try {
        const [res] = await sequelize.query(query, {
            bind: values,
            type: sequelize.QueryTypes.SELECT
        });
        return res; // Devuelve la categoría actualizada
    } catch (error) {
        console.error('Error al actualizar el cliente:', error);
        throw error;
    }
};



// Función para eliminar una categoría
const eliminarCliente = async (id_cliente) => {
    const query = `
    SELECT fn_eliminar_cliente($1);
    `;
    const values = [id_cliente];

    try {
        await sequelize.query(query, {
            bind: values,
            type: sequelize.QueryTypes.SELECT
        });
    } catch (error) {
        console.error('Error al eliminar el cliente:', error);
        throw error;
    }
};

module.exports = {
    registrarCliente, 
    listarClientes, 
    actualizarCliente,
    eliminarCliente
};