const pedidoM = require('../models/adminPedido');

//
exports.tomar_pedidos_delivery = async (req, res) => {
  // Transformar req.body a un objeto normal si es necesario
  const body = Object.assign({}, req.body);

  // Construir el objeto JSON con las propiedades esperadas
  const pedidoData = {
    id_pedido: body.id_pedido,
    id_usuario: body.id_usuario
  };

  console.log('pedido data:', pedidoData);

  try {
    // Consultar en la base de datos usando el JSON pedidoData
    const result = await pedidoM.tomar_pedido_delivery(pedidoData);
    // console.log("resultado", result);
    // Mostrar el JSON respuesta de postgres
    res.json(result);

  } catch (error) {
    console.error('Error:', error);
    //res.status(500).json({ status: 'error', message: 'Error al insertar el pedido.' });
  }
};
//
exports.delivery_en_casa = async (req, res) => {
    // Transformar req.body a un objeto normal si es necesario
    const body = Object.assign({}, req.body);
  
    // Construir el objeto JSON con las propiedades esperadas
    const pedidoData = {
      id_pedido: body.id_pedido
    };
  
    //console.log('pedido data:', pedidoData);
  
    try {
      // Consultar en la base de datos usando el JSON pedidoData
      const result = await pedidoM.delivery_en_casa(pedidoData);
      // console.log("resultado", result);
      // Mostrar el JSON respuesta de postgres
      res.json(result);
  
    } catch (error) {
      console.error('Error:', error);
      //res.status(500).json({ status: 'error', message: 'Error al insertar el pedido.' });
    }
  };
//
exports.confirmar_entrega = async (req, res) => {
    // Transformar req.body a un objeto normal si es necesario
    const body = Object.assign({}, req.body);
  
    // Construir el objeto JSON con las propiedades esperadas
    const pedidoData = {
      id_pedido: body.id_pedido
    };
  
    //console.log('pedido data:', pedidoData);
  
    try {
      // Consultar en la base de datos usando el JSON pedidoData
      const result = await pedidoM.confirmar_entrega(pedidoData);
      // console.log("resultado", result);
      // Mostrar el JSON respuesta de postgres
      res.json(result);
  
    } catch (error) {
      console.error('Error:', error);
      //res.status(500).json({ status: 'error', message: 'Error al insertar el pedido.' });
    }
  };
//
exports.listar_todos_los_pedidos_admin = async (req, res) => {
    const { } = req.body;
    try {
      // Consultar en la base de datos usando la función de PostgreSQL
      const result = await pedidoM.listar_todos_los_pedidos_admin();
      // Mostrar el JSON respuesta de postgres
      res.json(result);
  
    } catch (error) {
      console.error('Error:', error);
      //res.status(500).render('administrador/pedidoView', { result: { status: 'error', message: 'Error al enviar el correo.' } });
    }
  };
  //
  exports.confirmar_entrega = async (req, res) => {
    // Transformar req.body a un objeto normal si es necesario
    const body = Object.assign({}, req.body);
  
    // Construir el objeto JSON con las propiedades esperadas
    const pedidoData = {
      id_pedido: body.id_pedido
    };
  
    //console.log('pedido data:', pedidoData);
  
    try {
      // Consultar en la base de datos usando el JSON pedidoData
      const result = await pedidoM.confirmar_entrega(pedidoData);
      // console.log("resultado", result);
      // Mostrar el JSON respuesta de postgres
      res.json(result);
  
    } catch (error) {
      console.error('Error:', error);
      //res.status(500).json({ status: 'error', message: 'Error al insertar el pedido.' });
    }
  };
//
exports.listar_todos_los_pedidos_delivery = async (req, res) => {
    // Transformar req.body a un objeto normal si es necesario
    const body = Object.assign({}, req.body);
  
    // Construir el objeto JSON con las propiedades esperadas
    const pedidoData = {
      id_usuario: body.id_usuario
    };
  
    //console.log('pedido data:', pedidoData);
  
    try {
      // Consultar en la base de datos usando el JSON pedidoData
      const result = await pedidoM.listar_todos_los_pedidos_delivery(pedidoData);
      // console.log("resultado", result);
      // Mostrar el JSON respuesta de postgres
      res.json(result);
  
    } catch (error) {
      console.error('Error:', error);
      //res.status(500).json({ status: 'error', message: 'Error al insertar el pedido.' });
    }
  };
//
exports.listar_todos_los_pedidos_cliente = async (req, res) => {
    // Transformar req.body a un objeto normal si es necesario
    const body = Object.assign({}, req.body);
  
    // Construir el objeto JSON con las propiedades esperadas
    const pedidoData = {
      id_usuario: body.id_usuario
    };
  
    //console.log('pedido data:', pedidoData);
  
    try {
      // Consultar en la base de datos usando el JSON pedidoData
      const result = await pedidoM.listar_todos_los_pedidos_cliente(pedidoData);
      // console.log("resultado", result);
      // Mostrar el JSON respuesta de postgres
      res.json(result);
  
    } catch (error) {
      console.error('Error:', error);
      //res.status(500).json({ status: 'error', message: 'Error al insertar el pedido.' });
    }
  };
//