// models/messageFunction.js
const sequelize = require('../config/database');

const ProductoFunction = {
    async tomar_pedido_delivery(data) {
        // Llamar a la función en la bd
        // Imprimir los datos que se van a insertar
        //console.log('Datos a insertar:', data);
        const result = await sequelize.query(`
            SELECT fn_tomar_pedido_delivery(:data) AS result
        `, {
            replacements: { data: JSON.stringify(data) },
            type: sequelize.QueryTypes.SELECT
        });

        return result[0].result; // Devuelve el resultado de la verificación
    },
    async delivery_en_casa(data) {
        // Llamar a la función en la bd
        // Imprimir los datos que se van a insertar
        //console.log('Datos a insertar:', data);
        const result = await sequelize.query(`
            SELECT fn_delivery_en_casa(:data) AS result
        `, {
            replacements: { data: JSON.stringify(data) },
            type: sequelize.QueryTypes.SELECT
        });

        return result[0].result; // Devuelve el resultado de la verificación
    },
    async confirmar_entrega(data) {
        // Llamar a la función en la bd
        // Imprimir los datos que se van a insertar
        //console.log('Datos a insertar:', data);
        const result = await sequelize.query(`
            SELECT fn_confirmar_entrega(:data) AS result
        `, {
            replacements: { data: JSON.stringify(data) },
            type: sequelize.QueryTypes.SELECT
        });

        return result[0].result; // Devuelve el resultado de la verificación
    },
    async listar_todos_los_pedidos_admin() {
        const result = await sequelize.query(`
            SELECT fn_listar_todos_los_pedidos_para_admin() AS result
        `, {
            type: sequelize.QueryTypes.SELECT
        });
        return result[0].result; // Devuelve JSON del resultado de la función
    },
    async listar_todos_los_pedidos_delivery(data) {
        // Llamar a la función en la bd
        // Imprimir los datos que se van a insertar
        //console.log('Datos a insertar:', data);
        const result = await sequelize.query(`
            SELECT fn_listar_todos_los_pedidos_para_delivery(:data) AS result
        `, {
            replacements: { data: JSON.stringify(data) },
            type: sequelize.QueryTypes.SELECT
        });

        return result[0].result; // Devuelve el resultado de la verificación
    },
    async listar_todos_los_pedidos_cliente(data) {
        // Llamar a la función en la bd
        // Imprimir los datos que se van a insertar
        //console.log('Datos a insertar:', data);
        const result = await sequelize.query(`
            SELECT fn_listar_todos_los_pedidos_de_un_cliente(:data) AS result
        `, {
            replacements: { data: JSON.stringify(data) },
            type: sequelize.QueryTypes.SELECT
        });

        return result[0].result; // Devuelve el resultado de la verificación
    },
};


module.exports = ProductoFunction;