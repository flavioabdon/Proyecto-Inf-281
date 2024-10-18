const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
// rutas
const mailRoutes = require('./routes/mailRoutes');

const categoriaRoutes = require('./routes/categoriaRoutes');
const comunidadRoutes = require('./routes/comunidadRoutes');
const almacenRoutes = require('./routes/almacenRoutes');
const indexAdminRoutes = require('./routes/indexAdminRoutes');
const adminClienteRoutes = require('./routes/adminClienteRoutes');
const adminArtesanoRoutes = require('./routes/adminArtesanoRoutes');
const adminDeliveryRoutes = require('./routes/adminDeliveryRoutes');

const app = express();



// Configurar el motor de plantillas EJS
app.set('view engine', 'ejs');

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Sirve archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));
// Configurar la carpeta de archivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Usar las rutas definidas
app.use('/', mailRoutes);
app.use('/', categoriaRoutes);
app.use('/', almacenRoutes);
app.use('/', comunidadRoutes);

app.use('/', indexAdminRoutes);
app.use('/', adminClienteRoutes);
app.use('/', adminArtesanoRoutes);
app.use('/', adminDeliveryRoutes);


// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  const serverUrl = `http://localhost:${PORT}`;
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
  console.log(`Accede al servidor en: ${serverUrl}`);
});
