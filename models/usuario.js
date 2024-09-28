const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ruta al archivo de conexión a la base de datos

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  codigo_usuario: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  nombre: {
    type: DataTypes.STRING(30)
  },
  apellido: {
    type: DataTypes.STRING(50)
  },
  email: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true
  },
  numero_contacto: {
    type: DataTypes.STRING(12)
  },
  contraseña: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  ci: {
    type: DataTypes.STRING(15)
  },
  sexo: {
    type: DataTypes.STRING(20)
  },
  fotoperf_url: {
    type: DataTypes.STRING(200)
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  fecha_modificacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  usuario_creacion: {
    type: DataTypes.STRING(20)
  },
  usuario_modificacion: {
    type: DataTypes.STRING(20)
  },
  estado_registro: {
    type: DataTypes.STRING(15)
  },
  rol: {
    type: DataTypes.STRING(20)
  }
}, {
  tableName: 'usuario', // Especificar el nombre exacto de la tabla en la base de datos
  timestamps: false
});

module.exports = Usuario;