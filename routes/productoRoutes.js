
const express = require('express');
const router = express.Router();
const productosC = require ('../controllers/productoController'); //


const upload = require('../config/multerconfig'); // Importa la configuración de multer


// Ruta crud productos
//router.get('/productos',productosC.mostrarProductos); //view productos
router.get('/listarProductos',productosC.listarProductos); //json devuelve todos los productos 
router.get('/listarProdCategorias',productosC.listarProdCategorias); //json devuelve todas las categorias
router.get('/listarProdAlmacenes',productosC.listarProdAlmacenes); //json devuelve todos los almacenes
router.get('/listarProdArtesanos',productosC.listarProdArtesanos); //json devuelve todos los artesanos
router.post('/insertarProducto',productosC.insertarProducto); //json ok
router.put('/actualizarProducto',productosC.actualizarProducto); //json ok
router.delete('/eliminarProducto',productosC.eliminarProducto); //json  ok
router.post('/mostrarProductoId',productosC.mostrarProductoId); // json ok

module.exports = router;
