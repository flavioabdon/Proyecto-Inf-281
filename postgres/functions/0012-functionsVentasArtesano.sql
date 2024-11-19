--------------------------------------------------------------------------
-- Creado: Christian Medrano    Fecha: 11/11/2024                           --
-- Actividad:                                                           --
-- Funciones ventas de un artesano                               --
------------------------------------------------------------------
-- LISTA VENTAS POR ID_USUARIO
CREATE OR REPLACE FUNCTION fn_listar_ventas_artesano(p_id_usuario_artesano INT)
RETURNS TABLE (
    num_fila BIGINT,
    id_pedido INT,
    id_usuario_cliente INT,
    id_usuario_delivery INT,
    estado TEXT,
    suma_total NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ROW_NUMBER() OVER(ORDER BY pe.id_pedido) AS num_fila,
        pe.id_pedido,
        u_cliente.id_usuario AS id_usuario_cliente,
        u_delivery.id_usuario AS id_usuario_delivery,
        pp.estado::TEXT AS estado, 
        SUM(pa.precio * pp.cantidad) AS suma_total
    FROM 
        producto_artesanal pa
    INNER JOIN 
        pedido_producto pp ON pa.id_Prod = pp.id_Prod
    INNER JOIN 
        pedido AS pe ON pe.id_pedido = pp.id_pedido
    INNER JOIN 
        cliente AS c ON c.id_cliente = pe.id_cliente 
    INNER JOIN 
        usuario AS u_cliente ON u_cliente.id_usuario = c.id_usuario 
    INNER JOIN 
        artesano AS a ON a.id_artesano = pa.id_artesano
    LEFT JOIN 
        envio AS e ON e.id_pedido = pe.id_pedido
    LEFT JOIN 
        delivery AS d ON d.id_delivery = e.id_delivery
    LEFT JOIN 
        usuario AS u_delivery ON u_delivery.id_usuario = d.id_usuario
    WHERE 
        a.id_usuario = p_id_usuario_artesano
    GROUP BY 
        pe.id_pedido, id_usuario_cliente, id_usuario_delivery, pp.estado
    ORDER BY 
        pe.id_pedido;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM fn_listar_ventas_artesano(12);  


--------------------------------------------------------------------------
-- Creado: Christian Medrano    Fecha: 18/11/2024                           --
-- Actividad:                                                           --
-- Funciones ventas de un artesano                               --
------------------------------------------------------------------

-- LISTAS DETALLE DE VENTAS ARTESANO MUESTRA PRODUCTOS  SUBTOTAL POR ID_USUARIO,ID_PEDIDO  

CREATE OR REPLACE FUNCTION fn_listar_detalle_ventas_artesano(id_usuario_cliente INT, pe_id_pedido INT)
RETURNS TABLE (
    num_fila BIGINT,
    nombre_completo_artesano TEXT,
    email_artesano TEXT,
    numero_artesano TEXT, 
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
        CONCAT(u_artesano.nombre, ' ', u_artesano.apellido)::TEXT AS nombre_completo_artesano,  
        u_artesano.email::TEXT AS email_artesano,  
        u_artesano.numero_contacto::TEXT AS numero_artesano,  
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
        pedido_producto pp ON pa.id_prod = pp.id_prod
    INNER JOIN 
        pedido pe ON pe.id_pedido = pp.id_pedido
    INNER JOIN 
        cliente c ON c.id_cliente = pe.id_cliente 
    INNER JOIN 
        usuario u ON u.id_usuario = c.id_usuario 
    INNER JOIN 
        artesano a ON a.id_artesano = pa.id_artesano
    INNER JOIN 
        usuario u_artesano ON u_artesano.id_usuario = a.id_usuario 
    WHERE 
        c.id_usuario = id_usuario_cliente
        AND pe.id_pedido = pe_id_pedido;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM fn_listar_detalle_ventas_artesano(2, 7);


--------------------------------------------------------------------------
-- Creado: Christian Medrano    Fecha: 18/11/2024                           --
-- Actividad:                                                           --
-- Funciones ventas de un artesano en productos (detalles en productos(subtotal,descripcion,etc))                           --
------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_listar_productos_ventas_artesano(id_usuario_cliente INT, pe_id_pedido INT, id_usuario_artesano INT)
RETURNS TABLE (
    num_fila BIGINT,
    nombre_completo_artesano TEXT,
    email_artesano TEXT,
    numero_artesano TEXT, 
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
        CONCAT(u_artesano.nombre, ' ', u_artesano.apellido)::TEXT AS nombre_completo_artesano,  
        u_artesano.email::TEXT AS email_artesano,  
        u_artesano.numero_contacto::TEXT AS numero_artesano,  
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
        pedido_producto pp ON pa.id_prod = pp.id_prod
    INNER JOIN 
        pedido pe ON pe.id_pedido = pp.id_pedido
    INNER JOIN 
        cliente c ON c.id_cliente = pe.id_cliente 
    INNER JOIN 
        usuario u ON u.id_usuario = c.id_usuario 
    INNER JOIN 
        artesano a ON a.id_artesano = pa.id_artesano
    INNER JOIN 
        usuario u_artesano ON u_artesano.id_usuario = a.id_usuario 
    WHERE 
        c.id_usuario = id_usuario_cliente
        AND pe.id_pedido = pe_id_pedido
        AND u_artesano.id_usuario = id_usuario_artesano;
END;
$$ LANGUAGE plpgsql;

-- sentencia de apoyo
SELECT * FROM fn_listar_productos_ventas_artesano(2, 6, 12);




--------------------------------------------------------------------------
-- Creado: Rudolph    Fecha: 14/11/2024                           --
-- Actividad:                                                           --
-- Funciones ventas                   --
------------------------------------------------------------------
-- LISTA TODAS LAS VENTAS 
CREATE OR REPLACE FUNCTION fn_listar_todas_las_ventas_artesano()
RETURNS TABLE (
    num_fila BIGINT,
    id_pedido INT,
    id_usuario_cliente INT,
    id_usuario_delivery INT,
    id_usuario_artesano INT,
    estado TEXT,
    suma_total NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ROW_NUMBER() OVER(ORDER BY pe.id_pedido) AS num_fila,
        pe.id_pedido,
        u_cliente.id_usuario AS id_usuario_cliente,
        u_delivery.id_usuario AS id_usuario_delivery,
        a.id_artesano AS id_usuaio_artesano,
        pp.estado::TEXT AS estado, 
        SUM(pa.precio * pp.cantidad) AS suma_total
    FROM 
        producto_artesanal pa
    INNER JOIN 
        pedido_producto pp ON pa.id_Prod = pp.id_Prod
    INNER JOIN 
        pedido AS pe ON pe.id_pedido = pp.id_pedido
    INNER JOIN 
        cliente AS c ON c.id_cliente = pe.id_cliente 
    INNER JOIN 
        usuario AS u_cliente ON u_cliente.id_usuario = c.id_usuario 
    INNER JOIN 
        artesano AS a ON a.id_artesano = pa.id_artesano
    LEFT JOIN 
        envio AS e ON e.id_pedido = pe.id_pedido
    LEFT JOIN 
        delivery AS d ON d.id_delivery = e.id_delivery
    LEFT JOIN 
        usuario AS u_delivery ON u_delivery.id_usuario = d.id_usuario
    GROUP BY 
        pe.id_pedido, id_usuario_cliente, id_usuario_delivery, id_usuaio_artesano, pp.estado
    ORDER BY 
        pe.id_pedido;
END;
$$ LANGUAGE plpgsql; 
