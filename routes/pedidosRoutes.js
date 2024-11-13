
const express = require('express');
const router = express.Router();
const pedidosC = require('../controllers/pedidosController'); //

router.get('/tomar_pedido_delivery', pedidosC.tomar_pedidos_delivery); //json enviar id_pedido, id_usuario
router.get('/delivery_en_casa', pedidosC.delivery_en_casa); //json enviar id_pedido
router.get('/confirmar_entrega', pedidosC.confirmar_entrega); //json enviar id_pedido
router.get('/listar_todos_los_pedidos_admin', pedidosC.listar_todos_los_pedidos_admin); //json devuelve todos los pedidos para el admin 
router.get('/listar_todos_los_pedidos_delivery', pedidosC.listar_todos_los_pedidos_delivery); //json devuelve todos los pedidos para delivery
router.get('/listar_todos_los_pedidos_cliente', pedidosC.listar_todos_los_pedidos_cliente); //json devuelve todos los pedidos  para cliente

module.exports = router;
