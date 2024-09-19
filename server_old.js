const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Ruta para la página del formulario
app.get('/', (req, res) => {
  res.send(`
    <h2>Enviar correo electrónico</h2>
    <form action="/send-email" method="POST">
      <label for="to">Destinatario:</label><br>
      <input type="email" id="to" name="to" required><br><br>
      <label for="subject">Asunto:</label><br>
      <input type="text" id="subject" name="subject" required><br><br>
      <label for="message">Mensaje:</label><br>
      <textarea id="message" name="message" required></textarea><br><br>
      <button type="submit">Enviar</button>
    </form>
  `);
});

// Ruta para enviar el correo electrónico
app.post('/send-email', (req, res) => {
  const { to, subject, message } = req.body;

  // Configuración de transporte para Gmail
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'fcondoriv@fcpn.edu.bo',  // Tu correo de Gmail
      pass: '4887176lp'  // Tu contraseña de Gmail o contraseña de aplicaciones
    }
  });

  // Opciones del correo electrónico
  let mailOptions = {
    from: 'fcondoriv@fcpn.edu.bo',
    to: to,
    subject: subject,
    text: message
  };

  // Enviar el correo electrónico
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send('Error al enviar el correo: ' + error.message);
    }
    res.send('Correo enviado: ' + info.response);
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
