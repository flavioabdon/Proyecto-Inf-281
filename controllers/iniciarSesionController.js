const iniciarSesionModel = require('../models/iniciarSesion');
const crypto = require('crypto'); // Importar el módulo crypto

// Verifica si el usuario Existe y redirige según el rol
const retornarUsuarioSiExiste = async (req, res) => {
    const { emailUsuario, password } = req.body; // Datos que se envían desde el formulario

    try {
        // Cifrar la contraseña ingresada con MD5
        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

        // Verifica si el usuario existe con esas credenciales
        const usuario = await iniciarSesionModel.retornarUsuarioSiExiste(emailUsuario, hashedPassword);

        if (usuario) {
            // Envía todos los datos del usuario y un mensaje de éxito al frontend
            res.status(200).json({
                message: 'Inicio de sesión exitoso',
                usuario // Enviar todos los datos del usuario
            });
        } else {
            // Si no, devuelve un error de credenciales incorrectas
            res.status(401).json({ message: 'Credenciales incorrectas' });
        }
    } catch (error) {
        console.error('Error al verificar usuario:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = {
    retornarUsuarioSiExiste,
};
