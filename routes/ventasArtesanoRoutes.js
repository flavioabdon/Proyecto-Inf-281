const express = require('express');
const router = express.Router();
const ventasArtesanoController = require('../controllers/ventasArtesanoController');

router.get('/ventasArtesano', (req, res) => {
    res.render('artesano/ventasView', { currentPage: "ventasArtesano" });
});



router.get('/listarVentasArtesano/:id', ventasArtesanoController.listarVentas); 

router.get('/listarDetalleVentasArtesano/:id1/:id2', ventasArtesanoController.listarDetalleVentas);





module.exports = router;

