const productoM = require('../models/adminProducto');

//
exports.mostrarProductos = async (req, res) => {
  const { } = req.body;
  res.render('administrador/productoView', { currentPage: "Productos" });
};
//
exports.listarProductos = async (req, res) => {
  const { } = req.body;
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
  const { } = req.body;
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
  const { } = req.body;
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
  const { } = req.body;
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
  const ruta_imagen = req.file ? req.file.path : null; // Obtener el path del archivo

  // Transformar req.body a un objeto normal si es necesario
  const body = Object.assign({}, req.body);

  // Construir el objeto JSON con las propiedades esperadas
  const productoData = {
    nombre_Prod: body.nombreProd,
    descripcion_Prod: body.descripcionProd,
    precio: body.precioProd,
    descuento_porcent: body.descuentoProd,
    ruta_imagen: ruta_imagen,
    politica_de_Envio: body.politicaEnvio,
    peso_kg: body.pesoProd,
    stock: body.stockProd,
    informacion_Adicional: body.informacionAdicional,
    id_usuario: body.idUsuario,
    id_almacen: body.idAlmacen,
    id_categoria: body.idCategoria
  };

  //console.log('Producto data:', productoData);

  try {
    // Consultar en la base de datos usando el JSON productoData
    const result = await productoM.insertarProducto(productoData);
    // console.log("resultado", result);
    // Mostrar el JSON respuesta de postgres
    res.json(result);

  } catch (error) {
    console.error('Error:', error);
    //res.status(500).json({ status: 'error', message: 'Error al insertar el producto.' });
  }
};
//
exports.actualizarProducto = async (req, res) => {
  //const ruta_imagen = req.file ? req.file.path : null; // Obtener el path del archivo si hay uno nuevo

  // Convertir req.body a un objeto regular en caso de ser necesario
  const body = Object.assign({}, req.body);
  // Crear un objeto JSON con los datos del producto
  const productoData = {
    id_Prod: req.params.id,
    nombre_Prod: body.nombreProd,
    descripcion_Prod: body.descripcionProd,
    precio: body.precioProd,
    descuento_porcent: body.descuentoProd,
    // ruta_imagen: ruta_imagen, // Actualizar la ruta de imagen solo si existe un archivo
    politica_de_Envio: body.politicaEnvio,
    peso_kg: body.pesoProd,
    stock: body.stockProd,
    informacion_Adicional: body.informacionAdicional,
    id_usuario: body.idUsuario,
    id_almacen: body.idAlmacen,
    id_categoria: body.idCategoria
  };

  //console.log('Producto data (actualización):', productoData);

  try {
    // Llamada al modelo para actualizar el producto con el JSON
    const result = await productoM.modificarProducto(productoData);
    // console.log("resultado", result);
    // Enviar el resultado como respuesta JSON
    res.json(result);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 'error', message: 'Error al actualizar el producto.' });
  }
};

//
exports.eliminarProducto = async (req, res) => {
  // Convertir req.body a un objeto regular en caso de ser necesario
  const body = Object.assign({}, req.body);

  // Crear un objeto JSON con el ID del producto a eliminar
  const productoData = {
    id_Prod: req.params.id
  };

  //console.log('Producto data (eliminación):', productoData);

  try {
    // Llamada al modelo para eliminar el producto con el JSON
    const result = await productoM.eliminarProducto(productoData);
    // console.log("resultado", result);
    // Enviar el resultado como respuesta JSON
    res.json(result);

  } catch (error) {
    console.error('Error:', error);
    //res.status(500).json({ status: 'error', message: 'Error al eliminar el producto.' });
  }
};
//
exports.mostrarProductoId = async (req, res) => {
  // Convertir req.body a un objeto regular en caso de ser necesario
  const body = Object.assign({}, req.body);

  // Crear un objeto JSON con el ID del producto
  const productoData = {
    id_Prod: req.params.id
  };

  console.log('Producto data (mostrar por ID):', productoData);

  try {
    // Llamada al modelo para mostrar el producto por ID
    const result = await productoM.mostrarProductoId(productoData);
    console.log("resultado", result);
    // Enviar el resultado como respuesta JSON
    res.json(result);

  } catch (error) {
    console.error('Error:', error);
    //res.status(500).json({ status: 'error', message: 'Error al mostrar el producto.' });
  }
};

exports.mostrarProductosCliente = async (req, res) => {
  const { } = req.body;
  try {
    // Consultar en la base de datos usando la función de PostgreSQL
    const result = await productoM.mostrarProductosCliente();
    // Mostrar el JSON respuesta de postgres
    res.json(result);

  } catch (error) {
    console.error('Error:', error);
    //res.status(500).render('administrador/productoView', { result: { status: 'error', message: 'Error al enviar el correo.' } });
  }
};


exports.mostrarPorIdProductoCliente = async (req, res) => {
  // Convertir req.body a un objeto regular en caso de ser necesario
  const body = Object.assign({}, req.body);

  // Crear un objeto JSON con el ID del producto
  const productoData = {
    id: req.params.id
  };

  //console.log('Producto data (mostrar por ID):', productoData);

  try {
    // Llamada al modelo para mostrar el producto por ID
    const result = await productoM.mostrarPorIdProductoCliente(productoData);
    // console.log("resultado", result);
    // Enviar el resultado como respuesta JSON
    res.json(result);

  } catch (error) {
    console.error('Error:', error);
    //res.status(500).json({ status: 'error', message: 'Error al mostrar el producto.' });
  }
};

exports.registrarPedido = async (req, res) => {
  // Extraer los datos del pedido desde req.body
  const body = req.body;

  // Crear un objeto JSON con los datos del pedido
  const pedidoData = {
    direccion_envio: body.direccion_envio,
    costo_pedido: body.costo_pedido,
    costo_total: body.costo_total,
    costo_envio: body.costo_envio,
    distancia: body.distancia,
    id_usuario: body.id_usuario,
    latitud_envio: body.latitud_envio,
    longitud_envio: body.longitud_envio,
    productos: body.productos  // Se espera que esto sea un arreglo de productos
  };

  // Log para ver los datos recibidos
  console.log('Pedido data:', pedidoData);

  try {
    // Llamada al modelo para registrar el pedido con el JSON
    const result = await productoM.registrarPedido(pedidoData);

    // Enviar el resultado como respuesta JSON
    res.json(result);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 'error', message: 'Error al registrar el pedido.' });
  }
};

// Nuevo controlador para listar productos del artesano por usuarioID
exports.listarProductosArtesanoX = async (req, res) => {
  // Obtener el usuarioID desde los parámetros de la solicitud (puedes ajustarlo según cómo pases el usuarioID)
  const { id_usuario } = req.params;
  console.log("ID de usuario en controlador:", id_usuario);  // Verifica el valor

  try {
    // Llamada al modelo para obtener los productos por usuarioID
    const result = await productoM.listarProductosArtesanoX(id_usuario);
    console.log("Resultado productos artesano X:", result);

    // Enviar el resultado como respuesta JSON
    res.json(result);

  } catch (error) {
    console.error('Error:', error);
    // Responder con un error si algo sale mal
    res.status(500).json({ status: 'error', message: 'Error al listar los productos del artesano.' });
  }
};