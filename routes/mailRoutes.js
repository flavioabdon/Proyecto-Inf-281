
const express = require('express');
const router = express.Router();
const clienteC = require ('../controllers/clienteController'); //


const upload = require('../config/multerconfig'); // Importa la configuración de multer

// Ruta para mostrar el index
router.get('/', (req, res) => {
  //res.render('form');
  res.render('index');
});

// Ruta para mostrar formulario iniciar-sesion & registrarCliente
router.get('/login-registrar', (req, res) => {
    //res.render('form');
    res.render('cliente/registrarView');
  });

// Ruta para registrarse
router.post('/formRegistrarCliente', upload.single('imagenCliente'), clienteC.registrarCliente);


// Ruta verificar codigo
router.post('/verificarCodigo',clienteC.verificarCodigo);



module.exports = router;
