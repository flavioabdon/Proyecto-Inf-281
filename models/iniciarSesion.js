const sequelize = require('../config/database'); // Importa la conexión a la base de datos

// Función para buscar usuario por email y contraseña
const retornarUsuarioSiExiste = async (emailUsuario, hashedPassword) => {
    const query = `
        SELECT * 
        FROM usuario
        WHERE email = :emailUsuario AND contraseña = :hashedPassword;
    `;

    try {
        // Ejecuta la consulta con los parámetros de email y contraseña
        const res = await sequelize.query(query, {
            replacements: { emailUsuario, hashedPassword },
            type: sequelize.QueryTypes.SELECT // Tipo de consulta SELECT ya que devuelve datos
        });

        // Si se encuentra un usuario, devolverlo
        return res.length > 0 ? res[0] : null;
    } catch (error) {
        console.error('Error al buscar usuario:', error); // Manejo de errores
        throw error; // Lanza el error para que sea manejado en el controlador
    }
};


module.exports = {
   retornarUsuarioSiExiste,
};
