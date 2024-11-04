const express = require('express');
const router = express.Router();

router.get('/productosCliente', (req, res) => {
    res.render('cliente/productosView', { currentPage: "productosCliente" });
});

router.get('/productoCliente', (req, res) => {
    res.render('cliente/productoView', { currentPage: "productoCliente" });
});


module.exports = router;

