const express = require('express');
const router = express.Router();
const comprasClienteController = require('../controllers/comprasClienteController');

router.get('/comprasCliente', (req, res) => {
    res.render('cliente/comprasView', { currentPage: "comprasCliente" });
});



router.get('/listarComprasCliente/:id', comprasClienteController.listarCompras); 

router.get('/listarDetalleComprasCliente/:id1/:id2', comprasClienteController.listarDetalleCompras);





module.exports = router;
