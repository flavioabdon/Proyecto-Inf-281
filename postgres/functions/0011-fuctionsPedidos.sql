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
            v_cantidad, v_id_prod, v_latitud, v_longitud, v_id_pedido, v_id_usuario,'En almacen'
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
