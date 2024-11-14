const express = require('express');
const router = express.Router();
const pedidosDeliveryController = require('../controllers/pedidosDeliveryController');

router.get('/pedidosDelivery', (req, res) => {
    res.render('delivery/pedidosView', { currentPage: "pedidosDelivery" });
});

router.get('/listarTodosLosPedidosDelivery', pedidosDeliveryController.listarPedidos); 


router.get('/misPedidosDelivery', (req, res) => {
    res.render('delivery/pedidosPorIdView', { currentPage: "misPedidosDelivery" });
});

router.get('/listarPedidosDeliveryPorId/:id', pedidosDeliveryController.listarPedidosPorId); 


module.exports = router;
