const CryptoJS = require('crypto-js');
const express = require('express');
const router = express.Router();
const clienteC = require ('../controllers/clienteController'); //
//const loginC = require('../controllers/loginController');
const Usuario = require('../models/Usuario');

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

//Ruta para iniciar sesion

router.post('/formIniciarSesion', async (req, res) => {

  const { usuario, password } = req.body;
  
  const hashedPassword = CryptoJS.MD5(password).toString();

  try {
    // Buscar usuario por email y contraseña
    const user = await Usuario.findOne({
      where: {
        email: usuario,
        contraseña: hashedPassword
      },
      attributes: ['nombre', 'apellido', 'rol'] // Obtener solo los campos necesarios
    });

    if (user) {
      // Si el usuario es encontrado, devolver sus datos
      console.log(user.dataValues.rol)
      const area = user.dataValues.rol
      if(area ==='Administrador'){
        res.redirect('/indexAdmin');
      }else{
        res.redirect('/indexAdmin');
      }
      
      //res.json(user);

    } else {
      // Si no se encuentra el usuario, devolver null
      //res.json("null");
      res.render('cliente/registrarView');
    }
  } catch (error) {
    console.error('Error al autenticar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
