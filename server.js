const express = require('express');
const bodyParser = require('body-parser');
const mailRoutes = require('./routes/mailRoutes');

const app = express();

// Configurar el motor de plantillas EJS
app.set('view engine', 'ejs');

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));


// Usar las rutas definidas
app.use('/', mailRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
