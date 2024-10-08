const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mailRoutes = require('./routes/mailRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const almacenRoutes = require('./routes/almacenRoutes');
const admRoutes = require('./routes/admRoutes');

const app = express();

// Configurar el motor de plantillas EJS
app.set('view engine', 'ejs');

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Sirve archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Usar las rutas definidas
app.use('/', mailRoutes);
app.use('/', categoriaRoutes);
app.use('/', almacenRoutes);
app.use('/', admRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  const serverUrl = `http://localhost:${PORT}`;
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
  console.log(`Accede al servidor en: ${serverUrl}`);
});
