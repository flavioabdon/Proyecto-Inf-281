// models/messageFunction.js
const sequelize = require('../config/database');

const ProductoFunction = {
    async listarProductos() {
        const result = await sequelize.query(`
            SELECT fn_lst_productos() AS result
        `, {
            type: sequelize.QueryTypes.SELECT
        });
        return result[0].result; // Devuelve JSON del resultado de la función
    },
    async listarProdCategorias() {
        const result = await sequelize.query(`
            SELECT fn_lst_categorias() AS result
        `, {
            type: sequelize.QueryTypes.SELECT
        });
        return result[0].result; // Devuelve JSON del resultado de la función
    },
    async listarProdAlmacenes() {
        const result = await sequelize.query(`
            SELECT fn_lst_almacenes() AS result
        `, {
            type: sequelize.QueryTypes.SELECT
        });
        return result[0].result; // Devuelve JSON del resultado de la función
    },
    async listarProdArtesanos() {
        const result = await sequelize.query(`
            SELECT fn_lst_artesanos() AS result
        `, {
            type: sequelize.QueryTypes.SELECT
        });
        return result[0].result; // Devuelve JSON del resultado de la función
    },
    async insertarProducto(data) {
        // Llamar a la función en la bd
        // Imprimir los datos que se van a insertar
        //console.log('Datos a insertar:', data);
        const result = await sequelize.query(`
            SELECT fn_insertar_producto_artesanal(:data) AS result
        `, {
            replacements: { data: JSON.stringify(data) },
            type: sequelize.QueryTypes.SELECT
        });

        return result[0].result; // Devuelve el resultado de la verificación
    },

    async registrarPedido(data) {
        // Llamar a la función en la bd
        // Imprimir los datos que se van a insertar
        //console.log('Datos a insertar:', data);
        const result = await sequelize.query(`
            SELECT fn_registrar_pedido(:data) AS result
        `, {
            replacements: { data: JSON.stringify(data) },
            type: sequelize.QueryTypes.SELECT
        });

        return result[0].result; // Devuelve el resultado de la verificación
    },
    async modificarProducto(data) {
        // Llamar a la función en la bd
        const result = await sequelize.query(`
            SELECT fn_actualizar_producto_artesanal(:data) AS result
        `, {
            replacements: { data: JSON.stringify(data) },
            type: sequelize.QueryTypes.SELECT
        });

        return result[0].result; // Devuelve el resultado de la verificación
    },
    async eliminarProducto(data) {
        // Llamar a la función en la bd
        const result = await sequelize.query(`
            SELECT fn_eliminar_producto(:data) AS result
        `, {
            replacements: { data: JSON.stringify(data) },
            type: sequelize.QueryTypes.SELECT
        });

        return result[0].result; // Devuelve el resultado de la verificación
    },
    async mostrarProductoId(data) {
        // Llamar a la función en la bd
        const result = await sequelize.query(`
            SELECT fn_mostrar_producto_artesanal(:data) AS result
        `, {
            replacements: { data: JSON.stringify(data) },
            type: sequelize.QueryTypes.SELECT
        });

        return result[0].result; // Devuelve el resultado de la verificación
    },
    async mostrarProductosCliente() {
        const result = await sequelize.query(`
            SELECT fn_lst_productos_cliente() AS result
        `, {
            type: sequelize.QueryTypes.SELECT
        });
        return result[0].result; // Devuelve JSON del resultado de la función
    },

    async mostrarPorIdProductoCliente(data) {
        // Llamar a la función en la bd
        const result = await sequelize.query(`
            SELECT fn_obtiene_porIdproducto_cliente(:data) AS result
        `, {
            replacements: { data: JSON.stringify(data) },
            type: sequelize.QueryTypes.SELECT
        });

        return result[0].result; // Devuelve el resultado de la verificación
    },

    // Nuevo método para listar productos del artesano por usuarioID
    async listarProductosArtesanoX(id_usuario) {
        console.log("ID de usuario artesano en el Model:", id_usuario);
        const result = await sequelize.query(`
            SELECT fn_listar_productos_artesanoX(:id_usuario) AS result
        `, {
            replacements: { id_usuario: id_usuario },
            type: sequelize.QueryTypes.SELECT
        });

        return result[0].result; // Devuelve el JSON con el resultado de la función
    },
};


module.exports = ProductoFunction;