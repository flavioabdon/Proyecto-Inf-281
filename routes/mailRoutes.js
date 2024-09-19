const express = require('express');
const router = express.Router();
const clienteC = require ('../controllers/clienteController'); //

// Ruta para mostrar el formulario
router.get('/', (req, res) => {
  //res.render('form');
  res.render('index');
});

// Ruta para mostrar formulario inscripcion
router.get('/ingreso_registro', (req, res) => {
    //res.render('form');
    res.render('cliente/registrarView');
  });

// Ruta para registrarse
router.post('/formRegistrarCliente',clienteC.registrarCliente);  

// Ruta verificar codigo
router.post('/verificarCodigo',clienteC.verificarCodigo);

module.exports = router;
