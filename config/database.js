const { Sequelize } = require('sequelize');

// Define las variables de configuración
const dbName = 'bd281_GIT';       // Nombre de la base de datos
const dbUser = 'postgres';       // Nombre de usuario
const dbPassword = '123456789';
const dbHost = 'localhost';      // Host de la base de datos

// Configura la conexión a la base de datos
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: 'postgres',
  logging: false,
});

// Función para verificar la conexión
const verificarConexion = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida con éxito.');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
};

// Llama a la función para probar la conexión
verificarConexion();

module.exports = sequelize;
