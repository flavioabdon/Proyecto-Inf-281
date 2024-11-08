
CREATE OR REPLACE FUNCTION fn_listar_compras_cliente(id_usuario_cliente INT)
RETURNS TABLE (
    num_fila BIGINT,
    id_pedido INT,
    datos_artesano TEXT,
    estado TEXT,
    suma_total NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT  
        ROW_NUMBER() OVER (ORDER BY pe.id_pedido) AS num_fila, 
        pe.id_pedido,  
        CONCAT(ua.ci, ' - ', ua.nombre, ' ', ua.apellido) AS datos_artesano, 
        pp.estado::TEXT,  
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
        artesano AS a ON a.id_artesano = pa.id_artesano
    INNER JOIN 
        usuario AS ua ON ua.id_usuario = a.id_usuario  
    WHERE 
        c.id_usuario = id_usuario_cliente
    GROUP BY
        pe.id_pedido, 
        pp.estado,  
        ua.ci,  
        ua.nombre, 
        ua.apellido  
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