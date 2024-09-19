const { Sequelize } = require('sequelize');

// Configura la conexión a la base de datos
const sequelize = new Sequelize('postgres', 'postgres', '', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;