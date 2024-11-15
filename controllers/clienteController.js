const nodemailer = require('nodemailer');
const correoConfig = require('../config/mail');
const clienteM = require('../models/cliente');


// enviar correo y guardar el mensaje en la base de datos
exports.registrarCliente = async (req, res) => {
  const { nombreCliente, emailCliente, contrasenaCliente, ciCliente, apellidosCliente, numeroContactoCliente, sexoCliente,
    direccionCliente
  } = req.body; // respuesta del formulario

  // Aquí puedes acceder a la imagen a través de req.file
  const imagenCliente = req.file; // Esto contendrá la información del archivo subido

  // Verificar si se ha subido una imagen
  var fotoPerf_url = imagenCliente ? imagenCliente.path : null; // Guardar solo el path de la imagen

  if (!imagenCliente) {
    return res.status(400).send('No se ha subido ninguna imagen.');
  }

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

    let htmlTemplate = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
      <h2 style="color: #4CAF50;">Confirmación de Cuenta</h2>
      <p>Hola,</p>
      <p>Gracias por registrarte. Para confirmar tu cuenta, utiliza el siguiente código:</p>
      <div style="margin: 20px 0; text-align: center;">
        <span style="font-size: 24px; font-weight: bold; color: #4CAF50;">${codigoAleatorio}</span>
      </div>
      <p>Si no solicitaste este correo, por favor ignóralo.</p>
      <p>¡Gracias!</p>
      <footer style="margin-top: 20px; font-size: 12px; color: #888;">
        <p>Este mensaje fue enviado automáticamente, por favor no responda a este correo.</p>
      </footer>
    </div>
  `;

    // Opciones del correo electrónico
    let mailOptions = {
      from: correoConfig.user,
      to: to,
      subject: subject,
      html: htmlTemplate
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
    var latitud = -16.5000
    var nombre = nombreCliente;
    var apellido = apellidosCliente
    var email = emailCliente;
    var numero_Contacto = numeroContactoCliente;
    var contraseña = contrasenaCliente;
    var ci = ciCliente;
    var sexo = sexoCliente;
    fotoPerf_url;
    const result2 = await clienteM.guardar_usuario_cliente(
      {
        direccion_Envio, longitud, latitud, nombre, apellido, email, numero_Contacto, contraseña, ci, sexo, fotoPerf_url
      }
    )

    // Renderizar la vista validacion.ejs y pasarle el resultado completo
    if (result.status == "success") { //validar si se envio el correo
      if (result2.estado == "exitoso") { //validar si se guardo en la base de datos el usuario
        res.render('cliente/validacionView', { result, result2, message, to });
      }
      else {
        res.json(result2);
      }
    }
    else {
      res.json(result);
    }

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
    const result = await clienteM.verificaCodigo({ emailVerificacion, codigoVerificacion });
    //Recuperar el usuario 
    const usuario = result.usuario;
    //console.log(usuario);
    if (usuario) {
      // Envía todos los datos del usuario y un mensaje de éxito al frontend
      res.status(200).json({
          message: 'Registro exitoso',
          usuario // Enviar todos los datos del usuario
      });
    } else {
        // Si no, devuelve un error de credenciales incorrectas
        res.status(401).json({ message: 'Credenciales incorrectas' });
    }  

  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).render('cliente/validacionView', { result: { status: 'error', message: 'Error al enviar el correo.' } });
  }
};
