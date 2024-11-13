--------------------------------------------------------------------------
-- Creado: flavio condori    Fecha: 12/11/2024                          --
-- Actividad:                                                           --
-- Funciones para manejo de los pedidos                                 --           
--------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_registrar_pedido(data JSONB)
RETURNS JSONB AS $$
DECLARE
    -- Variables para almacenar información del pedido
    v_id_pedido INTEGER;
    v_direccion_envio VARCHAR(255);
    v_costo_pedido DECIMAL(10, 2);
    v_costo_total DECIMAL(10,2);
    v_costo_envio DECIMAL(10, 2);
    v_distancia DECIMAL(10, 2);
    v_latitud DECIMAL(9, 6);
    v_longitud DECIMAL(9, 6);
    v_id_usuario INTEGER;
    v_id_cliente INTEGER;
    v_usuario_creacion VARCHAR(20);
    
    -- Variables para los datos de cada producto en el pedido
    v_producto JSONB;
    v_cantidad INTEGER;
    v_id_prod INTEGER;
    v_stock_actual INTEGER;

    -- Variable de salida para el resultado final
    resultado JSONB;
BEGIN
    -- Extraer datos del pedido desde el JSON
    v_direccion_envio := data->>'direccion_envio';
    v_costo_pedido := (data->>'costo_pedido')::DECIMAL;
    v_costo_total :=  (data->>'costo_total')::DECIMAL;
    v_costo_envio := (data->>'costo_envio')::DECIMAL;
    v_distancia := (data->>'distancia')::DECIMAL;
    v_id_usuario := (data->>'id_usuario')::INTEGER;
    v_latitud := (data->>'latitud_envio')::DECIMAL;
    v_longitud := (data->>'longitud_envio')::DECIMAL;
    v_usuario_creacion := data->>'usuario_creacion';

    -- Recuperar el id_cliente a partir del id_usuario
    SELECT clie.id_cliente INTO v_id_cliente 
    FROM usuario usr 
    JOIN cliente clie ON usr.id_usuario = clie.id_usuario	
    WHERE usr.id_usuario = v_id_usuario;

    -- Insertar en la tabla PEDIDO y obtener el id_pedido generado
    INSERT INTO public.PEDIDO (
        direccion_envio, costo_pedido, costo_envio, distancia, id_cliente, usuario_creacion,estado_registro
    )
    VALUES (
        v_direccion_envio, v_costo_pedido, v_costo_envio, v_distancia, v_id_cliente, v_id_usuario,'En almacen'
    )
    RETURNING id_pedido INTO v_id_pedido;

    -- Insertar cada producto en la tabla PEDIDO_PRODUCTO y actualizar el stock
    FOR v_producto IN SELECT * FROM jsonb_array_elements(data->'productos')
    LOOP
        v_cantidad := (v_producto->>'cantidad')::INTEGER;
        v_id_prod := (v_producto->>'id_prod')::INTEGER;

        -- Insertar en PEDIDO_PRODUCTO
        INSERT INTO public.PEDIDO_PRODUCTO ( 
            cantidad, id_prod, latitud, longitud,  id_pedido, usuario_creacion,estado
        )
        VALUES (
            v_cantidad, v_id_prod, v_latitud, v_longitud, v_id_pedido, v_id_usuario,'En Almacen'
        );

        -- Descontar cantidad del stock en PRODUCTO_ARTESANAL
        SELECT stock INTO v_stock_actual 
        FROM producto_artesanal 
        WHERE id_prod = v_id_prod;

        IF v_stock_actual IS NULL OR v_stock_actual < v_cantidad THEN
            RAISE EXCEPTION 'Stock insuficiente para el producto ID %', v_id_prod;
        ELSE
            UPDATE producto_artesanal
            SET stock = stock - v_cantidad
            WHERE id_prod = v_id_prod;
        END IF;
    END LOOP;

    -- Verificar si se insertó algún producto; si no, lanzar excepción
    IF NOT EXISTS (SELECT 1 FROM public.PEDIDO_PRODUCTO WHERE id_pedido = v_id_pedido) THEN
        RAISE EXCEPTION 'No se encontraron productos.';
    END IF;

    -- Asignar resultado exitoso
    resultado := json_build_object(
        'estado', 'exito',
        'mensaje', 'Pedido registrado exitosamente',
        'id_pedido', v_id_pedido
    );

    RETURN resultado;

EXCEPTION
    WHEN OTHERS THEN
        -- Capturar el mensaje de error en caso de que ocurra
        RETURN json_build_object(
            'estado', 'error',
            'mensaje', SQLERRM
        );
END;
$$ LANGUAGE plpgsql;

--Sentencia de apoyo
select * from pedido_producto pp ;
--
SELECT fn_registrar_pedido('{
    "direccion_envio": "Calle  123",
    "costo_pedido": 150.75,
    "costo total": 170.75,
    "costo_envio": 20.00,
    "distancia": 5.2,
    "id_usuario": 6,
    "latitud_envio":19.432608,
	"longitud_envio":-99.133209,
    "productos": [
        {
            "cantidad": 2,
            "id_prod": 36
          
        },
        {
            "cantidad": 1,
            "id_prod": 37
        }
    ]
}'::jsonb) AS resultado;
--------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_tomar_pedido_delivery(data JSONB)
RETURNS JSONB AS $$
DECLARE
    -- Variables para almacenar los datos de entrada
    v_id_pedido INTEGER;
    v_id_usuario INTEGER;
    v_id_delivery INTEGER;

    -- Variables para el número de seguimiento
    v_num_tracking VARCHAR(20);
    v_ultimo_tracking VARCHAR(20);

    -- Variable para almacenar el resultado de la función
    resultado JSONB;
BEGIN
    -- Extraer los datos del JSON de entrada
    v_id_pedido := (data->>'id_pedido')::INTEGER;
    v_id_usuario := (data->>'id_usuario')::INTEGER;

    -- Extraer el id_delivery
    SELECT de.id_delivery INTO v_id_delivery
    FROM usuario us 
    JOIN delivery de 
    ON us.id_usuario = de.id_usuario 
    WHERE us.id_usuario = v_id_usuario;

    -- Verificar si el pedido existe
    IF NOT EXISTS (SELECT 1 FROM PEDIDO WHERE id_pedido = v_id_pedido) THEN
        RETURN json_build_object(
            'estado', 'error',
            'mensaje', 'El pedido especificado no existe'
        );
    END IF;

    -- Actualizar el estado del pedido a "En camino"
    UPDATE PEDIDO
    SET estado_registro = 'En camino'
    WHERE id_pedido = v_id_pedido;

    -- Actualizar el estado de todos los productos del pedido a "En camino"
    UPDATE PEDIDO_PRODUCTO
    SET estado = 'En camino'
    WHERE id_pedido = v_id_pedido;

    -- Obtener el último número de tracking generado
    SELECT num_tracking INTO v_ultimo_tracking
    FROM envio
    WHERE num_tracking IS NOT NULL
    ORDER BY fecha_creacion DESC
    LIMIT 1;

    -- Generar el nuevo número de tracking
    IF v_ultimo_tracking IS NOT NULL THEN
        v_num_tracking := 'RB' || TO_CHAR(SUBSTRING(v_ultimo_tracking FROM 3 FOR 8)::INTEGER + 1, 'FM00000000') || 'BO';
    ELSE
        v_num_tracking := 'RB00000001BO';
    END IF;

    -- Insertar en la tabla envio
    INSERT INTO envio (
        num_tracking, estado, fecha_estado, tipo_envio, id_delivery, id_pedido, fecha_creacion, fecha_modificacion, usuario_creacion, usuario_modificacion, estado_registro
    )
    VALUES (
        v_num_tracking, 'En camino', CURRENT_TIMESTAMP, 'Estandar', v_id_delivery, v_id_pedido, CURRENT_TIMESTAMP, NULL, NULL, NULL, 'En camino'
    );

    -- Preparar la respuesta de éxito
    resultado := json_build_object(
        'estado', 'exito',
        'mensaje', 'Pedido asignado al delivery y puesto en camino',
        'id_pedido', v_id_pedido,
        'id_delivery', v_id_delivery,
        'num_tracking', v_num_tracking
    );

    RETURN resultado;

EXCEPTION
    WHEN OTHERS THEN
        -- Capturar el mensaje de error en caso de que ocurra
        RETURN json_build_object(
            'estado', 'error',
            'mensaje', SQLERRM
        );
END;
$$ LANGUAGE plpgsql;
--Sentencia de apoyo
SELECT fn_tomar_pedido_delivery('{
    "id_pedido": 18,
    "id_usuario": 8
}'::jsonb) AS resultado;
----------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_delivery_en_casa(data JSONB)
RETURNS JSONB AS $$
DECLARE
    -- Variables para almacenar datos de entrada
    v_id_pedido INTEGER;

    -- Variable para el resultado de la función
    resultado JSONB;
BEGIN
    -- Extraer el id_pedido del JSON de entrada
    v_id_pedido := (data->>'id_pedido')::INTEGER;

    -- Verificar si el pedido existe
    IF NOT EXISTS (SELECT 1 FROM pedido WHERE id_pedido = v_id_pedido) THEN
        RETURN json_build_object(
            'estado', 'error',
            'mensaje', 'El pedido especificado no existe'
        );
    END IF;

    -- Actualizar el estado del pedido a 'En casa'
    UPDATE pedido
    SET estado_registro = 'En casa'
    WHERE id_pedido = v_id_pedido;

    -- Actualizar el estado de todos los productos del pedido a 'En casa'
    UPDATE pedido_producto
    SET estado = 'En casa'
    WHERE id_pedido = v_id_pedido;

    -- Actualizar el estado de envío a 'En casa'
    UPDATE envio
    SET estado_registro = 'En casa',
        estado = 'En casa',
        fecha_modificacion = CURRENT_TIMESTAMP
    WHERE id_pedido = v_id_pedido;

    -- Preparar la respuesta de éxito
    resultado := json_build_object(
        'estado', 'exito',
        'mensaje', 'El pedido ha sido actualizado a En casa',
        'id_pedido', v_id_pedido
    );

    RETURN resultado;

EXCEPTION
    WHEN OTHERS THEN
        -- Capturar y retornar el mensaje de error
        RETURN json_build_object(
            'estado', 'error',
            'mensaje', SQLERRM
        );
END;
$$ LANGUAGE plpgsql;
--
SELECT fn_delivery_en_casa('{
    "id_pedido": 18
}'::jsonb);
--------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_confirmar_entrega(data JSONB)
RETURNS JSONB AS $$
DECLARE
    -- Variables para almacenar datos de entrada
    v_id_pedido INTEGER;

    -- Variable para el resultado de la función
    resultado JSONB;
BEGIN
    -- Extraer el id_pedido del JSON de entrada
    v_id_pedido := (data->>'id_pedido')::INTEGER;

    -- Verificar si el pedido existe
    IF NOT EXISTS (SELECT 1 FROM pedido WHERE id_pedido = v_id_pedido) THEN
        RETURN json_build_object(
            'estado', 'error',
            'mensaje', 'El pedido especificado no existe'
        );
    END IF;

    -- Actualizar el estado del pedido a 'Finalizado'
    UPDATE pedido
    SET estado_registro = 'Finalizado'
    WHERE id_pedido = v_id_pedido;

    -- Actualizar el estado de todos los productos del pedido a 'Finalizado'
    UPDATE pedido_producto
    SET estado = 'Finalizado'
    WHERE id_pedido = v_id_pedido;

    -- Actualizar el estado de envío a 'Finalizado'
    UPDATE envio
    SET estado_registro = 'Finalizado',
        estado = 'Finalizado',
        fecha_modificacion = CURRENT_TIMESTAMP
    WHERE id_pedido = v_id_pedido;

    -- Preparar la respuesta de éxito
    resultado := json_build_object(
        'estado', 'exito',
        'mensaje', 'El pedido ha sido confirmado como entregado y finalizado',
        'id_pedido', v_id_pedido
    );

    RETURN resultado;

EXCEPTION
    WHEN OTHERS THEN
        -- Capturar y retornar el mensaje de error
        RETURN json_build_object(
            'estado', 'error',
            'mensaje', SQLERRM
        );
END;
$$ LANGUAGE plpgsql;
--
SELECT fn_confirmar_entrega('{
    "id_pedido": 18
}'::jsonb);
---------------------------------------------------------------------------
-- Funcion que lista todos los pedidos(En almacen, En camino, En Casa, Finalizados)
CREATE OR REPLACE FUNCTION fn_listar_todos_los_pedidos_para_admin()
RETURNS JSONB AS $$
DECLARE
    resultado JSONB;
BEGIN
    -- Construir el resultado agrupado en objetos JSON
    resultado := jsonb_agg(
        jsonb_build_object(
            'pedido', jsonb_build_object(
				'estado_pedido', p.estado_registro,
                'id_pedido', p.id_pedido,
                'direccion_envio', p.direccion_envio,
                'costo_envio', p.costo_envio,
                'distancia', p.distancia
            ),
            'productos', (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'cantidad', pp.cantidad,
                        'latitud', pp.latitud,
                        'longitud', pp.longitud,
                        'nombre_prod', pa.nombre_prod,
                        'ruta_imagen', pa.ruta_imagen,
                        'precio', pa.precio,
                        'descuento_porcent', pa.descuento_porcent,
                        'descripcion_prod', pa.descripcion_prod,
                        'politica_de_envio', pa.politica_de_envio,
                        'peso_kg', pa.peso_kg,
                        'stock', pa.stock
                    )
                )
                FROM pedido_producto pp
                JOIN producto_artesanal pa ON pa.id_prod = pp.id_prod
                WHERE pp.id_pedido = p.id_pedido
            ),
            'envio', jsonb_build_object(
                'num_tracking', e.num_tracking
            ),
            'delivery', jsonb_build_object(
                'nombre', u.nombre,
                'apellido', u.apellido,
                'email', u.email,
                'numero_contacto', u.numero_contacto,
                'fotoperf_url', u.fotoperf_url
            ),
            'cliente', jsonb_build_object(
                'nombre', u2.nombre,
                'apellido', u2.apellido,
                'email', u2.email,
                'numero_contacto', u2.numero_contacto,
                'fotoperf_url', u2.fotoperf_url
            )
        )
    )
    FROM pedido p
    LEFT JOIN envio e ON e.id_pedido = p.id_pedido
    LEFT JOIN delivery d ON d.id_delivery = e.id_delivery
    LEFT JOIN usuario u ON u.id_usuario = d.id_usuario
    JOIN cliente c ON p.id_cliente = c.id_cliente
    JOIN usuario u2 ON u2.id_usuario = c.id_usuario;

    -- Retornar el resultado
    RETURN resultado;

EXCEPTION
    WHEN OTHERS THEN
        -- Capturar el mensaje de error en caso de problemas
        RETURN jsonb_build_object(
            'estado', 'error',
            'mensaje', SQLERRM
        );
END;
$$ LANGUAGE plpgsql;
--
SELECT fn_listar_todos_los_pedidos_para_admin();
-----------------------------------------------------------------------------------
-- Funcion que lista todos los pedidos tomados por un delivery a partir de su id_usuario
CREATE OR REPLACE FUNCTION fn_listar_todos_los_pedidos_para_delivery(data JSONB)
RETURNS JSONB AS $$
DECLARE
    resultado JSONB := '[]'::JSONB;
    -- Variables para recuperar información del JSON
    v_id_usuario INTEGER;
BEGIN
    -- Extraer el id_usuario del JSON
    v_id_usuario := (data->>'id_usuario')::INTEGER;

    -- Construir el resultado agrupado en objetos JSON
    SELECT jsonb_agg(
        jsonb_build_object(
            'pedido', jsonb_build_object(
				'estado_pedido', p.estado_registro,
                'id_pedido', p.id_pedido,
                'direccion_envio', p.direccion_envio,
                'costo_envio', p.costo_envio,
                'distancia', p.distancia
            ),
            'productos', (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'cantidad', pp.cantidad,
                        'latitud', pp.latitud,
                        'longitud', pp.longitud,
                        'nombre_prod', pa.nombre_prod,
                        'ruta_imagen', pa.ruta_imagen,
                        'precio', pa.precio,
                        'descuento_porcent', pa.descuento_porcent,
                        'descripcion_prod', pa.descripcion_prod,
                        'politica_de_envio', pa.politica_de_envio,
                        'peso_kg', pa.peso_kg,
                        'stock', pa.stock
                    )
                )
                FROM pedido_producto pp
                JOIN producto_artesanal pa ON pa.id_prod = pp.id_prod
                WHERE pp.id_pedido = p.id_pedido
            ),
            'envio', jsonb_build_object(
                'num_tracking', e.num_tracking
            ),
            'delivery', jsonb_build_object(
                'nombre', u.nombre,
                'apellido', u.apellido,
                'email', u.email,
                'numero_contacto', u.numero_contacto,
                'fotoperf_url', u.fotoperf_url
            ),
            'cliente', jsonb_build_object(
                'nombre', u2.nombre,
                'apellido', u2.apellido,
                'email', u2.email,
                'numero_contacto', u2.numero_contacto,
                'fotoperf_url', u2.fotoperf_url
            )
        )
    )
    INTO resultado
    FROM pedido p
    LEFT JOIN envio e ON e.id_pedido = p.id_pedido
    LEFT JOIN delivery d ON d.id_delivery = e.id_delivery
    LEFT JOIN usuario u ON u.id_usuario = d.id_usuario
    JOIN cliente c ON p.id_cliente = c.id_cliente
    JOIN usuario u2 ON u2.id_usuario = c.id_usuario
    WHERE u.id_usuario = v_id_usuario;

    -- Si no hay resultados, retornar un mensaje vacío
    IF resultado IS NULL THEN
        RETURN jsonb_build_object(
            'estado', 'exito',
            'mensaje', 'No hay pedidos asignados para este delivery',
            'pedidos', '[]'::JSONB
        );
    END IF;

    -- Retornar el resultado
    RETURN jsonb_build_object(
        'estado', 'exito',
        'mensaje', 'Pedidos recuperados correctamente',
        'pedidos', resultado
    );

EXCEPTION
    WHEN OTHERS THEN
        -- Capturar el mensaje de error en caso de problemas
        RETURN jsonb_build_object(
            'estado', 'error',
            'mensaje', SQLERRM
        );
END;
$$ LANGUAGE plpgsql;
-- Sentencia de apoyo
SELECT fn_listar_todos_los_pedidos_para_delivery('{
    "id_usuario": 2
}'::jsonb) AS resultado;
----------------------------------------------------------------------------------
-- Funcion que lista todos los pedidos de un cliente a partir de su id_usuario
CREATE OR REPLACE FUNCTION fn_listar_todos_los_pedidos_de_un_cliente(data JSONB)
RETURNS JSONB AS $$
DECLARE
    resultado JSONB := '[]'::JSONB;
    -- Variables para recuperar información del JSON
    v_id_usuario INTEGER;
BEGIN
    -- Extraer el id_usuario del JSON
    v_id_usuario := (data->>'id_usuario')::INTEGER;

    -- Construir el resultado agrupado en objetos JSON
    SELECT jsonb_agg(
        jsonb_build_object(
            'pedido', jsonb_build_object(
				'estado_pedido', p.estado_registro,
                'id_pedido', p.id_pedido,
                'direccion_envio', p.direccion_envio,
                'costo_envio', p.costo_envio,
                'distancia', p.distancia
            ),
            'productos', (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'cantidad', pp.cantidad,
                        'latitud', pp.latitud,
                        'longitud', pp.longitud,
                        'nombre_prod', pa.nombre_prod,
                        'ruta_imagen', pa.ruta_imagen,
                        'precio', pa.precio,
                        'descuento_porcent', pa.descuento_porcent,
                        'descripcion_prod', pa.descripcion_prod,
                        'politica_de_envio', pa.politica_de_envio,
                        'peso_kg', pa.peso_kg,
                        'stock', pa.stock
                    )
                )
                FROM pedido_producto pp
                JOIN producto_artesanal pa ON pa.id_prod = pp.id_prod
                WHERE pp.id_pedido = p.id_pedido
            ),
            'envio', jsonb_build_object(
                'num_tracking', e.num_tracking
            ),
            'delivery', jsonb_build_object(
                'nombre', u.nombre,
                'apellido', u.apellido,
                'email', u.email,
                'numero_contacto', u.numero_contacto,
                'fotoperf_url', u.fotoperf_url
            ),
            'cliente', jsonb_build_object(
                'nombre', u2.nombre,
                'apellido', u2.apellido,
                'email', u2.email,
                'numero_contacto', u2.numero_contacto,
                'fotoperf_url', u2.fotoperf_url
            )
        )
    )
    INTO resultado
    FROM pedido p
    LEFT JOIN envio e ON e.id_pedido = p.id_pedido
    LEFT JOIN delivery d ON d.id_delivery = e.id_delivery
    LEFT JOIN usuario u ON u.id_usuario = d.id_usuario
    JOIN cliente c ON p.id_cliente = c.id_cliente
    JOIN usuario u2 ON u2.id_usuario = c.id_usuario
    WHERE u2.id_usuario = v_id_usuario;

    -- Si no hay resultados, retornar un mensaje vacío
    IF resultado IS NULL THEN
        RETURN jsonb_build_object(
            'estado', 'exito',
            'mensaje', 'No hay pedidos asignados para este delivery',
            'pedidos', '[]'::JSONB
        );
    END IF;

    -- Retornar el resultado
    RETURN jsonb_build_object(
        'estado', 'exito',
        'mensaje', 'Pedidos recuperados correctamente',
        'pedidos', resultado
    );

EXCEPTION
    WHEN OTHERS THEN
        -- Capturar el mensaje de error en caso de problemas
        RETURN jsonb_build_object(
            'estado', 'error',
            'mensaje', SQLERRM
        );
END;
$$ LANGUAGE plpgsql;
-- Consulta de ayuda
SELECT fn_listar_todos_los_pedidos_de_un_cliente('{
    "id_usuario": 6
}'::jsonb) AS resultado;
