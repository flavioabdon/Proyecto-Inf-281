// models/messageFunction.js
const sequelize = require('../config/database');

const MessageFunction = {
    async saveMessage(data) {
        const result = await sequelize.query(`
            SELECT fn_guardar_mensaje(:data) AS result
        `, { //enviar json
            replacements: { data: JSON.stringify(data) },
            type: sequelize.QueryTypes.SELECT
        });
        return result[0].result; //devuelve json del resultado de la función
    },
    async guardar_usuario_cliente(data) {
        const result = await sequelize.query(`
            SELECT fn_insertar_usuario_cliente(:data) AS result
        `, { //enviar json
            replacements: { data: JSON.stringify(data) },
            type: sequelize.QueryTypes.SELECT
        });
        return result[0].result; //devuelve json del resultado de la función
    },
    async verificaCodigo(data) {
        // Llamar a la función fn_verificar_codigo
        const result = await sequelize.query(`
            SELECT fn_verificar_codigo(:data) AS result
        `, {
            replacements: { data: JSON.stringify(data) },
            type: sequelize.QueryTypes.SELECT
        });

        return result[0].result; // Devuelve el resultado de la verificación
    }
};

module.exports = MessageFunction;