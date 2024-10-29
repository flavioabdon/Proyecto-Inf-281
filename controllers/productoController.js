const productoM= require('../models/adminProducto');

//
exports.mostrarProductos = async (req, res) => {
  const {  } = req.body;
  res.render('administrador/productoView', { currentPage: "Productos" });
};
//
exports.listarProductos = async (req, res) => {
  const {  } = req.body;
  try {
    // Consultar en la base de datos usando la función de PostgreSQL
    const result = await productoM.listarProductos();
    // Mostrar el JSON respuesta de postgres
    res.json(result);

  } catch (error) {
    console.error('Error:', error);
    //res.status(500).render('administrador/productoView', { result: { status: 'error', message: 'Error al enviar el correo.' } });
  }
};
//
exports.listarProdCategorias = async (req, res) => {
  const {  } = req.body;
  try {
    // Consultar en la base de datos usando la función de PostgreSQL
    const result = await productoM.listarProdCategorias();
    // Mostrar el JSON respuesta de postgres
    res.json(result);

  } catch (error) {
    console.error('Error:', error);
    //res.status(500).render('administrador/productoView', { result: { status: 'error', message: 'Error al enviar el correo.' } });
  }
};
//
exports.listarProdAlmacenes = async (req, res) => {
  const {  } = req.body;
  try {
    // Consultar en la base de datos usando la función de PostgreSQL
    const result = await productoM.listarProdAlmacenes();
    // Mostrar el JSON respuesta de postgres
    res.json(result);

  } catch (error) {
    console.error('Error:', error);
    //res.status(500).render('administrador/productoView', { result: { status: 'error', message: 'Error al enviar el correo.' } });
  }
};
//
exports.listarProdArtesanos = async (req, res) => {
  const {  } = req.body;
  try {
    // Consultar en la base de datos usando la función de PostgreSQL
    const result = await productoM.listarProdArtesanos();
    // Mostrar el JSON respuesta de postgres
    res.json(result);

  } catch (error) {
    console.error('Error:', error);
    //res.status(500).render('administrador/productoView', { result: { status: 'error', message: 'Error al enviar el correo.' } });
  }
};
//
exports.insertarProducto = async (req, res) => {
  const { 
    nombre_Prod, 
    descripcion_Prod,
    precio, 
    descuento_porcent, 
    ruta_imagen, 
    politica_de_Envio, 
    peso_kg, 
    stock, 
    informacion_Adicional, 
    id_usuario,
    id_pedido, 
    id_almacen, 
    id_categoria
   } = req.body;
   try {
    // Consultar en la base de datos usando la función de PostgreSQL
    const result = await productoM.insertarProducto({nombre_Prod, 
      descripcion_Prod,
      precio, 
      descuento_porcent, 
      ruta_imagen, 
      politica_de_Envio, 
      peso_kg, 
      stock, 
      informacion_Adicional, 
      id_usuario,
      id_pedido, 
      id_almacen, 
      id_categoria }
    );
    // Mostrar el JSON respuesta de postgres
    res.json(result);

  } catch (error) {
    console.error('Error:', error);
    //res.status(500).render('cliente/validacionView', { result: { status: 'error', message: 'Error al enviar el correo.' } });
  }
};
//
exports.actualizarProducto = async (req, res) => {
  const { 
    id_Prod,
    nombre_Prod, 
    descripcion_Prod,
    precio, 
    descuento_porcent, 
    ruta_imagen, 
    politica_de_Envio, 
    peso_kg, 
    stock, 
    informacion_Adicional, 
    id_usuario,
    id_pedido, 
    id_almacen, 
    id_categoria
   } = req.body;
   try {
    // Consultar en la base de datos usando la función de PostgreSQL
    const result = await productoM.modificarProducto({nombre_Prod, 
      id_Prod,
      descripcion_Prod,
      precio, 
      descuento_porcent, 
      ruta_imagen, 
      politica_de_Envio, 
      peso_kg, 
      stock, 
      informacion_Adicional, 
      id_usuario,
      id_pedido, 
      id_almacen, 
      id_categoria }
    );
    // Mostrar el JSON respuesta de postgres
    res.json(result);

  } catch (error) {
    console.error('Error:', error);
    //res.status(500).render('cliente/validacionView', { result: { status: 'error', message: 'Error al enviar el correo.' } });
  }
};
//
exports.eliminarProducto = async (req, res) => {
  const { 
    id_Prod
   } = req.body;
   try {
    // Consultar en la base de datos usando la función de PostgreSQL
    const result = await productoM.eliminarProducto({
      id_Prod }
    );
    // Mostrar el JSON respuesta de postgres
    res.json(result);

  } catch (error) {
    console.error('Error:', error);
    //res.status(500).render('cliente/validacionView', { result: { status: 'error', message: 'Error al enviar el correo.' } });
  }
};
//
exports.mostrarProductoId = async (req, res) => {
  const { 
    id_Prod
   } = req.body;
   try {
    // Consultar en la base de datos usando la función de PostgreSQL
    const result = await productoM.mostrarProductoId({
      id_Prod }
    );
    // Mostrar el JSON respuesta de postgres
    res.json(result);

  } catch (error) {
    console.error('Error:', error);
    //res.status(500).render('cliente/validacionView', { result: { status: 'error', message: 'Error al enviar el correo.' } });
  }
};