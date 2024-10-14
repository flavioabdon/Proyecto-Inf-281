// config/multerConfig.js
const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Aquí se guardarán las imágenes
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, "imagenCliente" + '-' + uniqueSuffix + path.extname(file.originalname)); // Nombre único para la imagen
  }
});

// Middleware de multer
const upload = multer({ storage: storage });

module.exports = upload;
