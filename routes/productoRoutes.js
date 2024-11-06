
const express = require('express');
const router = express.Router();
const productosC = require('../controllers/productoController'); //


const upload = require('../config/multerconfig'); // Importa la configuración de multer

// Ruta para la vista
router.get('/adminProducto', (req, res) => {
    res.render('administrador/adminProductoView', { currentPage: "adminProducto" }); // Renderiza la vista
});
// Ruta crud productos
// router.get('/productos',productosC.mostrarProductos); //view productos
router.get('/listarProductos', productosC.listarProductos); //json devuelve todos los productos 
router.get('/listarProdCategorias', productosC.listarProdCategorias); //json devuelve todas las categorias
router.get('/listarProdAlmacenes', productosC.listarProdAlmacenes); //json devuelve todos los almacenes
router.get('/listarDatosArtesanos', productosC.listarProdArtesanos); //json devuelve todos los artesanos
router.post('/insertarProducto', upload.single('fotoProd'), productosC.insertarProducto); //json ok
router.put('/actualizarProducto/:id', productosC.actualizarProducto); //json ok
router.delete('/eliminarProducto/:id', productosC.eliminarProducto); //json  ok
router.get('/mostrarProductoId/:id', productosC.mostrarProductoId); // json ok

//muestra todos productos la vista del cliente (carrito)
router.get('/mostrarProductosCliente', productosC.mostrarProductosCliente); // json ok 
//muestra el producto por id enviado
router.get('/mostrarPorIdProductoCliente/:id', productosC.mostrarPorIdProductoCliente); // json ok 

// router.get('/registrarPedido'
router.post('/registrarPedido', productosC.registrarPedido); //json recibe pedido


module.exports = router;
