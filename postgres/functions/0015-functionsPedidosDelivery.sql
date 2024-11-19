
--------------------------------------------------------------------------
-- Creado: Christian Medrano    Fecha:18/11/2024                           --
-- Actividad:                                                           --
-- Funciones obtiene todos los pedidos pa los deliveris(para luego tomar un pedido) --
------------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_listar_todos_los_pedidos()
RETURNS TABLE (
    num_fila BIGINT,
    id_pedido INT,
    id_usuario_cliente INT,
    id_artesanos TEXT, -- Aquí se almacenará el STRING_AGG
    estado TEXT,
    direccion_envio TEXT,
    costo_envio NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ROW_NUMBER() OVER(ORDER BY pe.id_pedido) AS num_fila,
        pe.id_pedido,
        u_cliente.id_usuario AS id_usuario_cliente,
        STRING_AGG(DISTINCT u_artesano.id_usuario::TEXT, ', ') AS id_artesanos, 
        pp.estado::TEXT AS estado, 
        CONCAT(pp.latitud, ', ', pp.longitud) AS direccion_envio,
        pe.costo_envio
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
    INNER JOIN 
        usuario AS u_artesano ON u_artesano.id_usuario = a.id_usuario 
    LEFT JOIN 
        envio AS e ON e.id_pedido = pe.id_pedido
    LEFT JOIN 
        delivery AS d ON d.id_delivery = e.id_delivery
    LEFT JOIN 
        usuario AS u_delivery ON u_delivery.id_usuario = d.id_usuario
    WHERE 
        pp.estado = 'En Almacen' 
        AND pe.costo_envio != 0
    GROUP BY 
        pe.id_pedido, u_cliente.id_usuario, pp.estado, pp.latitud, pp.longitud, pe.costo_envio
    ORDER BY 
        pe.id_pedido;
END;
$$ LANGUAGE plpgsql;

-- sentencia de apoyo
select * from fn_listar_todos_los_pedidos();


--------------------------------------------------------------------------
-- Creado: Christian Medrano    Fecha:18/11/2024                           --
-- Actividad:                                                           --
-- Funciones obtiene pedidos asignados del delivery por id --
----------------------------------
CREATE OR REPLACE FUNCTION fn_listar_pedidos_delivery_por_id(id_usuario_delivery INT)
RETURNS TABLE(
    num_fila BIGINT,
    id_pedido INT,
    id_usuario_cliente INT,
    id_artesanos TEXT, -- Cambio para reflejar múltiples artesanos
    num_tracking VARCHAR(50), 
    direccion_envio TEXT,
    estado TEXT,
    costo_envio DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ROW_NUMBER() OVER(ORDER BY pe.id_pedido) AS num_fila,
        pe.id_pedido,
        u_cliente.id_usuario AS id_usuario_cliente,
        STRING_AGG(DISTINCT u_artesano.id_usuario::TEXT, ', ') AS id_artesanos, -- Corrección aplicada
        e.num_tracking, 
        CONCAT(pp.latitud, ', ', pp.longitud) AS direccion_envio,
        pp.estado::TEXT AS estado, 
        pe.costo_envio
    FROM 
        producto_artesanal AS pa
    INNER JOIN 
        pedido_producto AS pp ON pa.id_Prod = pp.id_Prod
    INNER JOIN 
        pedido AS pe ON pe.id_pedido = pp.id_pedido
    INNER JOIN 
        cliente AS c ON c.id_cliente = pe.id_cliente 
    INNER JOIN 
        usuario AS u_cliente ON u_cliente.id_usuario = c.id_usuario 
    INNER JOIN 
        artesano AS a ON a.id_artesano = pa.id_artesano
    INNER JOIN 
        usuario AS u_artesano ON u_artesano.id_usuario = a.id_usuario 
    LEFT JOIN 
        envio AS e ON e.id_pedido = pe.id_pedido
    LEFT JOIN 
        delivery AS d ON d.id_delivery = e.id_delivery
    LEFT JOIN 
        usuario AS u_delivery ON u_delivery.id_usuario = d.id_usuario
    WHERE 
        pe.costo_envio != 0 
        AND u_delivery.id_usuario = id_usuario_delivery
    GROUP BY 
        pe.id_pedido, 
        u_cliente.id_usuario, 
        e.num_tracking, 
        pp.estado, 
        pp.latitud, 
        pp.longitud, 
        pe.costo_envio
    ORDER BY 
        pe.id_pedido;
END;
$$ LANGUAGE plpgsql;


-- Sentencia de apoyo
SELECT * FROM fn_listar_pedidos_delivery_por_id(22);