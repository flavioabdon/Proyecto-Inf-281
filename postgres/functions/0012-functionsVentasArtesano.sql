--------------------------------------------------------------------------
-- Creado: Christian Medrano    Fecha: 8/11/2024                           --
-- Actividad:                                                           --
-- Funciones ventas de un artesano                               --
------------------------------------------------------------------
-- LISTA VENTAS POR ID_USUARIO
CREATE OR REPLACE FUNCTION fn_listar_ventas_artesano(p_id_usuario INT)
RETURNS TABLE (
    num_fila BIGINT,
    id_pedido INT,
    datos_cliente TEXT,
    estado TEXT,
    suma_total NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ROW_NUMBER() OVER(ORDER BY pe.id_pedido) AS num_fila,
        pe.id_pedido,
        CONCAT(u.ci, ' - ', u.nombre, ' ', u.apellido) AS datos_cliente,
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
        usuario AS u ON u.id_usuario = c.id_usuario 
    INNER JOIN 
        artesano AS a ON a.id_artesano = pa.id_artesano
    WHERE 
        a.id_usuario = p_id_usuario
    GROUP BY 
        pe.id_pedido, datos_cliente, pp.estado
    ORDER BY 
        pe.id_pedido;
END;
$$ LANGUAGE plpgsql;

-- sentencia de apoyo
SELECT * FROM fn_listar_ventas_artesano(12);  


-- LISTAS DETALLE DE VENTAS ARTESANO MUESTRA PRODUCTOS  SUBTOTAL POR ID_USUARIO,ID_PEDIDO  
CREATE OR REPLACE FUNCTION fn_listar_detalle_ventas_artesano(
    p_id_usuario INT,
    pe_id_pedido INT
)
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
        a.id_usuario = p_id_usuario 
        AND pe.id_pedido = pe_id_pedido;
END;
$$ LANGUAGE plpgsql;

-- sentencia de apoyo
SELECT * FROM fn_listar_detalle_ventas_artesano(12, 2);
