const express = require('express');
const router = express.Router();
const obtenerDatosUsuariosController = require('../controllers/obtenerDatosUsuariosController');

//cliente
router.get('/obtenerDatosCliente/:id', obtenerDatosUsuariosController.obtenerDatosCliente); 

//artesano
router.get('/obtenerDatosArtesano/:id', obtenerDatosUsuariosController.obtenerDatosArtesano);

//delivery
router.get('/obtenerDatosDelivery/:id', obtenerDatosUsuariosController.obtenerDatosDelivery);

module.exports = router;

