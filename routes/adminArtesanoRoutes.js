const express = require('express');
const router = express.Router();
const adminArtesanoController = require('../controllers/adminArtesanoController');

const upload = require('../config/multerconfig'); // Importa la configuración de multer


// Ruta para la vista de adminitrar usuario artesano
router.get('/adminArtesano', (req, res) => {
    res.render('administrador/adminArtesanoView', { currentPage: "adminArtesano" }); // Renderiza la vista 'adminArtesanoView.ejs'
});

// Ruta para registrar un artesano
router.post('/registrarAdminArtesano', upload.single('fotoArtesano'), adminArtesanoController.registrarAdminArtesano); // Usa el controlador para insertar


// Ruta para listar artesano
router.get('/listarAdminArtesanos', adminArtesanoController.listarAdminArtesanos); // Usa el controlador para listar


// Ruta para actualizar un artesano existente
router.put('/actualizarAdminArtesano/:id', adminArtesanoController.actualizarAdminArtesano);

//Ruta para eliminar artesano
router.delete('/eliminarAdminArtesano/:id',adminArtesanoController.eliminarAdminArtesano); // Usa el controlador para eliminar



module.exports = router;