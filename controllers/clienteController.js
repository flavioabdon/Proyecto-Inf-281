const nodemailer = require('nodemailer');
const correoConfig = require('../config/mail');
const clienteM = require('../models/cliente');


// enviar correo y guardar el mensaje en la base de datos
exports.registrarCliente = async (req, res) => {
  const { nombreCliente, emailCliente, contrasenaCliente,ciCliente,
    imagenCliente,apellidosCliente,numeroContactoCliente,sexoCliente,
    direccionCliente
  } = req.body; // respuesta del formulario

  var to = emailCliente;
  var subject = 'Confirmar cuenta';
  var codigoAleatorio = Math.floor(1000 + Math.random() * 9000); //1000-9999 generar numero random de cuatro cifras
  var message = 'Codigo:' + codigoAleatorio;
  try {
    // Configuración de transporte para Gmail
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: correoConfig.user,
        pass: correoConfig.pass
      }
    });

    // Opciones del correo electrónico
    let mailOptions = {
      from: correoConfig.user ,
      to: to,
      subject: subject,
      text: message
    };

    // Enviar el correo electrónico
    await transporter.sendMail(mailOptions);

    // Guardar el mensaje en la base de datos usando la función de PostgreSQL
    // to -> destinatario
    // subject -> titulo del correo
    // message -> cuerpo
    const result = await clienteM.saveMessage({ to, subject, message });

    var direccion_Envio = direccionCliente;
    var longitud = -68.1193;
    var latitud= -16.5000
    var nombre= nombreCliente;
    var apellido= apellidosCliente
    var email= emailCliente;
    var numero_Contacto= numeroContactoCliente;
    var contraseña= contrasenaCliente;
    var ci= ciCliente;
    var sexo= sexoCliente;
    var fotoPerf_url= imagenCliente;
    const result2 = await clienteM.guardar_usuario_cliente(
      {
        direccion_Envio, longitud, latitud, nombre,apellido,email,numero_Contacto,contraseña,ci,sexo,fotoPerf_url
      }
    )


    // Renderizar la vista validacion.ejs y pasarle el resultado completo
    res.render('cliente/validacionView', { result, message, to });
    //res.json(result2); //imprimir json
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).render('cliente/validacionView', { result: { status: 'error', message: 'Error al enviar el correo.' } });
  }
};

// Verificar codigo y correo en la base de datos
exports.verificarCodigo = async (req, res) => {
  const { emailVerificacion, codigoVerificacion } = req.body;
  try {
    // Consultar en la base de datos usando la función de PostgreSQL
    const result = await clienteM.verificaCodigo({ emailVerificacion,codigoVerificacion });
    // Mostrar el JSON respuesta de postgres
    res.json(result);
    
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).render('cliente/validacionView', { result: { status: 'error', message: 'Error al enviar el correo.' } });
  }
};
