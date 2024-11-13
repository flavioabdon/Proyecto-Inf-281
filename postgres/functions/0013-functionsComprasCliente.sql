

--------------------------------------------------------------------------
-- Creado: Christian Medrano    Fecha:13/11/2024                           --
-- Actividad:                                                           --
-- Funciones lista las compras y sus detalles(productos comprados) que realizo el cliente --
------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_listar_compras_cliente(id_usuario_cliente INT)
RETURNS TABLE (
    num_fila BIGINT,
    id_pedido INT,
    id_usuario_artesano INT,
    id_usuario_delivery INT,
    estado TEXT,
    suma_total_productos NUMERIC,
    costo_envio NUMERIC,
    suma_total NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT  
        ROW_NUMBER() OVER (ORDER BY pe.id_pedido) AS num_fila,
        pe.id_pedido,
        u_artesano.id_usuario AS id_usuario_artesano,
        u_delivery.id_usuario AS id_usuario_delivery,
        pp.estado::TEXT AS estado, 
        SUM(pa.precio * pp.cantidad) AS suma_total_productos,
        pe.costo_envio,
        SUM(pa.precio * pp.cantidad) + pe.costo_envio AS suma_total
    FROM 
        producto_artesanal pa
    INNER JOIN 
        pedido_producto pp ON pa.id_Prod = pp.id_Prod
    INNER JOIN 
        pedido pe ON pe.id_pedido = pp.id_pedido
    INNER JOIN 
        cliente c ON c.id_cliente = pe.id_cliente 
    INNER JOIN 
        usuario u_cliente ON u_cliente.id_usuario = c.id_usuario 
    INNER JOIN 
        artesano a ON a.id_artesano = pa.id_artesano
    INNER JOIN
        usuario u_artesano ON u_artesano.id_usuario = a.id_usuario 
    LEFT JOIN 
        envio e ON e.id_pedido = pe.id_pedido
    LEFT JOIN 
        delivery d ON d.id_delivery = e.id_delivery
    LEFT JOIN 
        usuario u_delivery ON u_delivery.id_usuario = d.id_usuario
    WHERE 
        c.id_usuario = id_usuario_cliente
    GROUP BY 
        pe.id_pedido, 
        u_artesano.id_usuario, 
        u_delivery.id_usuario, 
        pp.estado
    ORDER BY 
        pe.id_pedido;
END;
$$ LANGUAGE plpgsql;

   
-- sentenciade apoyo
SELECT * FROM fn_listar_compras_cliente(2);    


CREATE OR REPLACE FUNCTION fn_listar_detalle_compras_cliente(id_usuario_cliente INT, pe_id_pedido INT)
RETURNS TABLE (
    num_fila BIGINT,
    id_prod INT,
    nombre_prod TEXT,
    descripcion_prod TEXT,
    informacion_adicional TEXT,
    ruta_imagen TEXT,
    precio NUMERIC,
    cantidad INT,
    subTotal NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ROW_NUMBER() OVER (ORDER BY pa.id_prod) AS num_fila, 
        pa.id_prod,
        pa.nombre_prod::TEXT,
        pa.descripcion_prod::TEXT,
        pa.informacion_adicional::TEXT,
        pa.ruta_imagen::TEXT,
        pa.precio,
        pp.cantidad,
        (pa.precio * pp.cantidad) AS subTotal
    FROM 
        producto_artesanal pa
    INNER JOIN 
        pedido_producto pp ON pa.id_Prod = pp.id_Prod
    INNER JOIN 
        pedido AS pe ON pe.id_pedido = pp.id_pedido
    INNER JOIN 
        cliente AS c ON c.id_cliente = pe.id_cliente 
    INNER JOIN 
        usuario AS u ON u.id_usuario = c.id_usuario 
    INNER JOIN 
        artesano AS a ON a.id_artesano = pa.id_artesano
    WHERE 
        c.id_usuario = id_usuario_cliente AND pe.id_pedido = pe_id_pedido;
END;
$$ LANGUAGE plpgsql;

-- sentencia de apoyo
SELECT * FROM fn_listar_detalle_compras_cliente(2, 3);