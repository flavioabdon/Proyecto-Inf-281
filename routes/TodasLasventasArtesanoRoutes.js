const express = require('express');
const router = express.Router();
const TodasLasventasArtesanoController = require('../controllers/TodasLasventasArtesanoController');

router.get('/TodasLasventasArtesano', (req, res) => {
    res.render('administrador/TodasLasventasView', { currentPage: "TodasLasventasView" });
});



router.get('/listarTodasLasVentas', TodasLasventasArtesanoController.listarTodasLasVentas); 

router.get('/listarDetalleVentasArtesano/:id1/:id2', TodasLasventasArtesanoController.listarDetalleVentas);





module.exports = router;

