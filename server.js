const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importa el paquete cors

// -------------ROUTES-----------

//usuarios
const obtenerDatosUsuariosRoutes = require('./routes/obtenerDatosUsuariosRoutes');

// cliente
const mailRoutes = require('./routes/mailRoutes');
const productoClienteRoutes = require('./routes/productoClienteRoutes');
const comprasClienteRoutes = require('./routes/comprasClienteRoutes');


//Inicio de Sesion
const iniciarSesionRoutes = require('./routes/iniciarSesionRoutes');

//Administrador
const categoriaRoutes = require('./routes/categoriaRoutes');
const comunidadRoutes = require('./routes/comunidadRoutes');
const almacenRoutes = require('./routes/almacenRoutes');
const indexAdminRoutes = require('./routes/indexAdminRoutes');
const adminClienteRoutes = require('./routes/adminClienteRoutes');
const adminArtesanoRoutes = require('./routes/adminArtesanoRoutes');
const adminDeliveryRoutes = require('./routes/adminDeliveryRoutes');

//Artesano
const indexArtesanoRoutes = require('./routes/indexArtesanoRoutes');
const ventasArtesanoRoutes = require('./routes/ventasArtesanoRoutes');
const TodasLasventasArtesanoRoutes = require('./routes/TodasLasventasArtesanoRoutes');

//Delivery
const indexDeliveryRoutes = require('./routes/indexDeliveryRoutes');
const pedidosDeliveryRoutes = require('./routes/pedidosDeliveryRoutes');

//Productos
const productoRoutes = require('./routes/productoRoutes');

//Pedidos
const pedidosRoutes = require('./routes/pedidosRoutes');

const app = express();

// Configurar CORS para permitir todas las IPs
app.use(cors({
  origin: '*', // Permite todos los orígenes
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Headers permitidos
}));

// Configurar el motor de plantillas EJS
app.set('view engine', 'ejs');

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Sirve archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));
// Configurar la carpeta de archivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Utiliza la ruta de iniciar sesión
app.use('/auth', iniciarSesionRoutes); // Ruta base para las rutas de autenticación


// Usar las rutas definidas
//usuarios
app.use('/', obtenerDatosUsuariosRoutes);

//cliente
app.use('/', mailRoutes);
app.use('/', productoClienteRoutes);
app.use('/', comprasClienteRoutes);

//administrador
app.use('/', categoriaRoutes);
app.use('/', almacenRoutes);
app.use('/', comunidadRoutes);
app.use('/', indexAdminRoutes);
app.use('/', adminClienteRoutes);
app.use('/', adminArtesanoRoutes);
app.use('/', adminDeliveryRoutes);
app.use('/', TodasLasventasArtesanoRoutes);

//artesano
app.use('/', indexArtesanoRoutes);
app.use('/', ventasArtesanoRoutes);

//delivery
app.use('/', indexDeliveryRoutes);
app.use('/', pedidosDeliveryRoutes);

//productos
app.use('/', productoRoutes);

//pedidos
app.use('/',pedidosRoutes)

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  const serverUrl = `http://localhost:${PORT}`;
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
  console.log(`Accede al servidor en: ${serverUrl}`);
});
