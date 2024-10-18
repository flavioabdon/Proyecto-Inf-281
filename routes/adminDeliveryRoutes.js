const express = require('express');
const router = express.Router();
const adminDeliveryController = require('../controllers/adminDeliveryController');

const upload = require('../config/multerconfig'); // Importa la configuración de multer


// Ruta para la vista de adminitrar usuario delivery
router.get('/adminDelivery', (req, res) => {
    res.render('administrador/adminDeliveryView', { currentPage: "adminDelivery" }); // Renderiza la vista 'adminDeliveryView.ejs'
});

// Ruta para listar delivery
router.get('/listarAdminDeliveries', adminDeliveryController.listarAdminDeliverys); // Usa el controlador para listar


// Ruta para registrar un delivery
router.post('/registrarAdminDelivery', upload.single('fotoDelivery'), adminDeliveryController.registrarAdminDelivery); // Usa el controlador para insertar


// Ruta para actualizar un delivery existente
router.put('/actualizarAdminDelivery/:id', adminDeliveryController.actualizarAdminDelivery);


//Ruta para eliminar delivery
router.delete('/eliminarAdminDelivery/:id',adminDeliveryController.eliminarAdminDelivery); // Usa el controlador para eliminar



module.exports = router;