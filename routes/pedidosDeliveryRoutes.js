const express = require('express');
const router = express.Router();
const pedidosDeliveryController = require('../controllers/pedidosDeliveryController');

router.get('/pedidosDelivery', (req, res) => {
    res.render('delivery/pedidosView', { currentPage: "pedidosDelivery" });
});



router.get('/listarTodosLosPedidosDelivery', pedidosDeliveryController.listarPedidos); 

// router.get('/listarDetalleVentasArtesano/:id1/:id2', ventasArtesanoController.listarDetalleVentas);





module.exports = router;
