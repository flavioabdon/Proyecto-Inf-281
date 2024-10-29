--------------------------------------------------------------------------
-- Creado: flavio condori    Fecha: 29/10/2024                           --
-- Actividad:                                                           --
-- Funcion productos                                --
------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
-- insertar producto,listar, modificar producto, eliminar, producto
--FUNCIONES INSERTAR PRODUCTO
CREATE OR REPLACE FUNCTION fn_insertar_producto_artesanal(p_json JSON)
RETURNS JSON AS $$
DECLARE
    resultado JSON;
    v_nombre VARCHAR;
    v_descripcion TEXT;
    v_precio DECIMAL;
    v_descuento_porcent DECIMAL;
    v_ruta_imagen VARCHAR;
    v_politica_envio VARCHAR;
    v_peso_kg DECIMAL;
    v_stock INT;
    v_informacion_adicional VARCHAR;
    v_id_usuario INT;
    v_id_almacen INT;
    v_id_categoria INT;
    v_usuario_creacion VARCHAR := 'usuario_default'; -- Asigna el usuario de creación
BEGIN
    -- Extraer los valores del JSON de entrada
    BEGIN
        v_nombre := p_json->>'nombre_Prod';
        v_descripcion := p_json->>'descripcion_Prod';
        v_precio := (p_json->>'precio')::DECIMAL;
        v_descuento_porcent := (p_json->>'descuento_porcent')::DECIMAL;
        v_ruta_imagen := p_json->>'ruta_imagen';
        v_politica_envio := p_json->>'politica_de_Envio';
        v_peso_kg := (p_json->>'peso_kg')::DECIMAL;
        v_stock := (p_json->>'stock')::INT;
        v_informacion_adicional := p_json->>'informacion_Adicional';
        v_id_usuario := (p_json->>'id_usuario')::INT;
        v_id_almacen := (p_json->>'id_almacen')::INT;
        v_id_categoria := (p_json->>'id_categoria')::INT;

        -- Intentamos realizar la inserción en la tabla PRODUCTO_ARTESANAL
        INSERT INTO public.PRODUCTO_ARTESANAL (
            nombre_Prod,
            descripcion_Prod,
            precio,
            descuento_porcent,
            ruta_imagen,
            politica_de_Envio,
            peso_kg,
            stock,
            informacion_Adicional,
            id_artesano,
            id_almacen,
            id_categoria,
            usuario_creacion,
            estado_registro
        ) VALUES (
            v_nombre,
            v_descripcion,
            v_precio,
            v_descuento_porcent,
            v_ruta_imagen,
            v_politica_envio,
            v_peso_kg,
            v_stock,
            v_informacion_adicional,
            v_id_usuario,
            v_id_almacen,
            v_id_categoria,
            v_usuario_creacion,
            'activo'  -- Estado inicial del registro
        );

        -- Si la inserción es exitosa, devolvemos un JSON con estado exitoso
        resultado := json_build_object(
            'estado', 'exitoso',
            'mensaje', 'Producto insertado exitosamente'
        );
    EXCEPTION WHEN OTHERS THEN
        -- Si ocurre un error, devolvemos un JSON con el error
        resultado := json_build_object(
            'estado', 'error',
            'mensaje', SQLERRM
        );
    END;

    -- Retornamos el resultado final como JSON
    RETURN resultado;
END;
$$ LANGUAGE plpgsql;


--FUNCION ACTUALIZAR PRODUCTO
CREATE OR REPLACE FUNCTION fn_actualizar_producto_artesanal(p_json JSON)
RETURNS JSON AS $$
DECLARE
    resultado JSON;
    v_id_prod INT;
BEGIN
    -- Extraer el id del producto del JSON de entrada
    v_id_prod := (p_json->>'id_Prod')::INT;

    -- Intentamos realizar la actualización en la tabla PRODUCTO_ARTESANAL
    UPDATE public.PRODUCTO_ARTESANAL
    SET 
        nombre_Prod = COALESCE(NULLIF(p_json->>'nombre_Prod', ''), nombre_Prod),
        descripcion_Prod = COALESCE(NULLIF(p_json->>'descripcion_Prod', ''), descripcion_Prod),
        precio = COALESCE(NULLIF(p_json->>'precio', '')::DECIMAL, precio),
        descuento_porcent = COALESCE(NULLIF(p_json->>'descuento_porcent', '')::DECIMAL, descuento_porcent),
        ruta_imagen = COALESCE(NULLIF(p_json->>'ruta_imagen', ''), ruta_imagen),
        politica_de_Envio = COALESCE(NULLIF(p_json->>'politica_de_Envio', ''), politica_de_Envio),
        peso_kg = COALESCE(NULLIF(p_json->>'peso_kg', '')::DECIMAL, peso_kg),
        stock = COALESCE(NULLIF(p_json->>'stock', '')::INT, stock),
        informacion_Adicional = COALESCE(NULLIF(p_json->>'informacion_Adicional', ''), informacion_Adicional),
        id_artesano = COALESCE(NULLIF(p_json->>'id_usuario', '')::INT, id_artesano),
        id_almacen = COALESCE(NULLIF(p_json->>'id_almacen', '')::INT, id_almacen),
        id_categoria = COALESCE(NULLIF(p_json->>'id_categoria', '')::INT, id_categoria),
        fecha_modificacion = CURRENT_TIMESTAMP  -- Actualiza la fecha de modificación
    WHERE id_Prod = v_id_prod;

    -- Verificar si se actualizó algún registro
    IF NOT FOUND THEN
        resultado := json_build_object(
            'estado', 'error',
            'mensaje', 'Producto no encontrado'
        );
    ELSE
        -- Si la actualización es exitosa, devolvemos un JSON con estado exitoso
        resultado := json_build_object(
            'estado', 'exitoso',
            'mensaje', 'Producto actualizado exitosamente'
        );
    END IF;

    -- Retornamos el resultado final como JSON
    RETURN resultado;
EXCEPTION WHEN OTHERS THEN
    -- Si ocurre un error, devolvemos un JSON con el error
    resultado := json_build_object(
        'estado', 'error',
        'mensaje', SQLERRM
    );
    RETURN resultado;
END;
$$ LANGUAGE plpgsql;

--FUNCION MUESTRA PRODUCTO POR ID
CREATE OR REPLACE FUNCTION fn_mostrar_producto_artesanal(p_json JSON)
RETURNS JSON AS $$
DECLARE
    resultado JSON;
BEGIN
    -- Intentamos realizar la consulta del producto
    BEGIN
        SELECT json_build_object(
            'estado', 'exitoso',
            'mensaje', 'Consulta exitosa',
            'producto', json_build_object(
                'id_Prod', pa.id_Prod,
                'nombre_Prod', pa.nombre_Prod,
                'descripcion_Prod', pa.descripcion_Prod,
                'precio', pa.precio,
                'descuento_porcent', pa.descuento_porcent,
                'ruta_imagen', pa.ruta_imagen,
                'politica_de_Envio', pa.politica_de_Envio,
                'peso_kg', pa.peso_kg,
                'stock', pa.stock,
                'informacion_Adicional', pa.informacion_adicional,
                'id_artesano', pa.id_artesano,
                'id_almacen', pa.id_almacen,
                'id_categoria', pa.id_categoria,
                'fecha_creacion', pa.fecha_creacion,
                'artesano', json_build_object(
                    'id_artesano', a.id_artesano,
                    'especialidad_artesano', a.especialidad_artesano
                ),
                'usuario', json_build_object(
                    'id_usuario', us.id_usuario,
                    'nombre', us.nombre,
                    'apellido', us.apellido,
                    'email', us.email
                ),
                'almacen', json_build_object(
                    'id_almacen', a2.id_almacen,
                    'nombre_almacen', a2.nombre_almacen,
                    'ubicacion', a2.ubicacion_georef_alm
                ),
                'categoria', json_build_object(
                    'id_categoria', c.id_categoria,
                    'nombre_categoria', c.nombre_categoria,
                    'descripcion_categoria', c.descripcion
                )
            )
        )
        INTO resultado
        FROM public.PRODUCTO_ARTESANAL pa
        JOIN public.artesano a ON a.id_artesano = pa.id_artesano
        JOIN public.almacen a2 ON a2.id_almacen = pa.id_almacen
        JOIN public.categoria c ON c.id_categoria = pa.id_categoria
		JOIN public.usuario us ON us.id_usuario = a.id_usuario
        WHERE pa.id_Prod = (p_json->>'id_Prod')::INT;

        -- Si no se encuentra el producto, lanzamos un error
        IF resultado IS NULL THEN
            RAISE EXCEPTION 'Producto no encontrado';
        END IF;

    EXCEPTION WHEN OTHERS THEN
        -- Si ocurre un error, capturamos el mensaje de error
        resultado := json_build_object(
            'estado', 'error',
            'mensaje', SQLERRM
        );
    END;

    -- Retornamos el resultado final como JSON
    RETURN resultado;
END;
$$ LANGUAGE plpgsql;


--FUNCION  LISTAR TODOS LOS PRODUCTOS
CREATE OR REPLACE FUNCTION fn_lst_productos()
RETURNS JSON AS $$
DECLARE
    resultado JSON;
BEGIN
    -- Intentamos realizar la consulta de todos los productos
    BEGIN
        SELECT json_build_object(
            'estado', 'exitoso',
            'mensaje', 'Consulta exitosa',
            'productos', json_agg(
                json_build_object(
                    'id_Prod', pa.id_Prod,
                    'nombre_Prod', pa.nombre_Prod,
                    'descripcion_Prod', pa.descripcion_Prod,
                    'precio', pa.precio,
                    'descuento_porcent', pa.descuento_porcent,
                    'ruta_imagen', pa.ruta_imagen,
                    'politica_de_Envio', pa.politica_de_Envio,
                    'peso_kg', pa.peso_kg,
                    'stock', pa.stock,
                    'informacion_Adicional', pa.informacion_adicional,
                    'id_artesano', pa.id_artesano,
                    'id_almacen', pa.id_almacen,
                    'id_categoria', pa.id_categoria,
                    'fecha_creacion', pa.fecha_creacion,
                    'artesano', json_build_object(
                        'id_artesano', a.id_artesano,
                        'especialidad_artesano', a.especialidad_artesano
                    ),
                    'usuario', json_build_object(
                        'id_usuario', us.id_usuario,
                        'nombre', us.nombre,
                        'apellido', us.apellido,
                        'email', us.email
                    ),
                    'almacen', json_build_object(
                        'id_almacen', a2.id_almacen,
                        'nombre_almacen', a2.nombre_almacen,
                        'ubicacion', a2.ubicacion_georef_alm
                    ),
                    'categoria', json_build_object(
                        'id_categoria', c.id_categoria,
                        'nombre_categoria', c.nombre_categoria,
                        'descripcion_categoria', c.descripcion
                    )
                )
            )
        ) INTO resultado
        FROM public.PRODUCTO_ARTESANAL pa
        JOIN public.artesano a ON a.id_artesano = pa.id_artesano
        JOIN public.almacen a2 ON a2.id_almacen = pa.id_almacen
        JOIN public.categoria c ON c.id_categoria = pa.id_categoria
        JOIN public.usuario us ON us.id_usuario = a.id_usuario;

        -- Si no se encuentran productos, lanzamos un error
        IF resultado IS NULL THEN
            RAISE EXCEPTION 'No se encontraron productos.';
        END IF;

    EXCEPTION WHEN OTHERS THEN
        -- Si ocurre un error, capturamos el mensaje de error
        resultado := json_build_object(
            'estado', 'error',
            'mensaje', SQLERRM
        );
    END;

    -- Retornamos el resultado final como JSON
    RETURN resultado;
END;
$$ LANGUAGE plpgsql;

--FUNCION ELIMINAR TODOS LOS PRODUCTOS
CREATE OR REPLACE FUNCTION fn_eliminar_producto(p_json JSON)
RETURNS JSON AS $$
DECLARE
    resultado JSON;
BEGIN
    -- Intentamos eliminar el producto
    DELETE FROM public.PRODUCTO_ARTESANAL p
    WHERE p.id_Prod = (p_json->>'id_Prod')::INT
    RETURNING json_build_object(
        'estado', 'exitoso',
        'mensaje', 'Producto eliminado exitosamente'
    ) INTO resultado;

    -- Si no se encontró el producto, lanzar un error
    IF NOT FOUND THEN
        resultado := json_build_object(
            'estado', 'error',
            'mensaje', 'Producto no encontrado'
        );
    END IF;

    -- Retornamos el resultado final como JSON
    RETURN resultado;

EXCEPTION WHEN OTHERS THEN
    -- Si ocurre un error, capturamos el mensaje de error
    resultado := json_build_object(
        'estado', 'error',
        'mensaje', SQLERRM
    );

    -- Retornamos el resultado final como JSON
    RETURN resultado;
END;
$$ LANGUAGE plpgsql;

--FUNCION LISTAR CATEGORIAS
CREATE OR REPLACE FUNCTION fn_lst_categorias()
RETURNS JSON AS $$
DECLARE
    resultado JSON;
BEGIN
    -- Intentamos realizar la consulta de las categorías
    BEGIN
        resultado := json_build_object(
            'estado', 'exitoso',
            'mensaje', 'consulta exitosa',
            'categorias', (
                SELECT json_agg(
                    json_build_object(
                        'idCategoria', c.id_categoria,
                        'nombreCategoria', c.nombre_Categoria,
                        'descripcion', c.descripcion,
                        'urlIconoCategoria', c.url_icon_Categoria,
                        'fechaCreacion', c.fecha_creacion,
                        'estadoRegistro', c.estado_registro
                    )
                )
                FROM public.CATEGORIA c
            )
        );
    EXCEPTION WHEN OTHERS THEN
        -- Si ocurre un error, capturamos el mensaje de error
        resultado := json_build_object(
            'estado', 'error',
            'mensaje', SQLERRM
        );
    END;

    -- Retornamos el resultado final como JSON
    RETURN resultado;
END;
$$ LANGUAGE plpgsql;

--FUNCION LISTAR ALMACENES
CREATE OR REPLACE FUNCTION fn_lst_almacenes()
RETURNS JSON AS $$
DECLARE
    resultado JSON;
BEGIN
    -- Intentamos realizar la consulta de los almacenes
    BEGIN
        resultado := json_build_object(
            'estado', 'exitoso',
            'mensaje', 'consulta exitosa',
            'almacenes', (
                SELECT json_agg(
                    json_build_object(
                        'idAlmacen', a.id_almacen,
                        'nombre_almacen', a.nombre_almacen,
                        'ubicacionGeoRef', ST_AsText(a.ubicacion_geoRef_Alm), -- Convierte la geometría a texto
                        'direccionAlmacen', a.direccion_almacen,
                        'capacidad', a.capacidad_unid,
                        'fechaCreacion', a.fecha_creacion,
                        'estadoRegistro', a.estado_registro
                    )
                )
                FROM public.ALMACEN a
            )
        );
    EXCEPTION WHEN OTHERS THEN
        -- Si ocurre un error, capturamos el mensaje de error
        resultado := json_build_object(
            'estado', 'error',
            'mensaje', SQLERRM
        );
    END;

    -- Retornamos el resultado final como JSON
    RETURN resultado;
END;
$$ LANGUAGE plpgsql;

--FUNCION LISTAR ARTESANOS
CREATE OR REPLACE FUNCTION fn_lst_artesanos()
RETURNS JSON AS $$
DECLARE
    resultado JSON;
BEGIN
    -- Intentamos realizar la consulta de los artesanos
    BEGIN
        resultado := json_build_object(
            'estado', 'exitoso',
            'mensaje', 'consulta exitosa',
            'datos', (
                SELECT json_agg(
                    json_build_object(
                        'idArtesano', a.id_usuario,
                        'nombre', u.nombre,
                        'apellido', u.apellido,
                        'email', u.email,
                        'ci', u.ci,
                        'numero_contacto', u.numero_Contacto,
                        'sexo', u.sexo,
                        'fotoPerfil', u.fotoPerf_url,
                        'rol', u.rol,
                        'fecha_creacion', a.fecha_creacion,
                        'fecha_modificacion', a.fecha_modificacion,
                        'especialidad', a.especialidad_Artesano,
                        'idComunidad', a.id_comunidad,
                        'nombreComunidad', c.nombreCom
                    )
                )
                FROM public.ARTESANO a
                JOIN public.USUARIO u ON a.id_usuario = u.id_usuario
                LEFT JOIN public.COMUNIDAD c ON a.id_comunidad = c.id_comunidad
            )
        );
    EXCEPTION WHEN OTHERS THEN
        -- Si ocurre un error, capturamos el mensaje de error
        resultado := json_build_object(
            'estado', 'error',
            'mensaje', SQLERRM,
            'datos', NULL
        );SELECT fn_lst_artesanos();
    END;

    -- Retornamos el resultado final como JSON
    RETURN resultado;
END;
$$ LANGUAGE plpgsql;


-----------------------------------------------------------------------------
--CONSULTAS DE AYUDA
--CONSULTA INSERTAR PRUDUCTO
SELECT fn_insertar_producto_artesanal(
    json_build_object(
        'nombre_Prod', 'Vasija de barro',
        'descripcion_Prod', 'Vasija hecha a mano con barro natural',
        'precio', 25.99,
        'descuento_porcent', 5.00,
        'ruta_imagen', 'http://example.com/images/vasija.jpg',
        'politica_de_Envio', 'Envío a todo el país',
        'peso_kg', 1.5,
        'stock', 10,
        'informacion_Adicional', 'Color: Terracota',
        'id_usuario', 2,
        'id_almacen', 1,
        'id_categoria', 1
    )
);

-- CONSULTA ACTUALIZAR PRODUCTO
select * from producto_artesanal pa ;
SELECT fn_actualizar_producto_artesanal( --revisar
    json_build_object(
        'id_Prod', 5,  -- ID del producto a actualizar
        'nombre_Prod', 'Nueva gorra',
        'descripcion_Prod', 'Taza hecha a mano con diseño exclusivo',
        'precio', 15.50,
        'descuento_porcent', 10.00,  -- Nuevo parámetro: descuento en porcentaje
        'ruta_imagen', 'http://example.com/taza.jpg',  -- URL de la imagen
        'politica_de_Envio', 'Envío gratuito en pedidos mayores a $50',
        'peso_kg', 0.5,  -- Peso en kilogramos
        'stock', 20,  -- Cantidad en stock
        'informacion_Adicional', 'Color: Azul, Material: Cerámica',  -- Información adicional
        'id_usuario', 2,  -- ID del artesano
        'id_almacen', 1,  -- ID del almacén
        'id_categoria', 1  -- ID de la categoría
    )
);


--CONSULTA LISTAR TODOS LOS PRODUCTOS
SELECT fn_lst_productos();

--CONSULTA MOSRTRAR PRODUCTO POR ID
SELECT fn_mostrar_producto_artesanal( --revisar
    json_build_object(
        'id_Prod',2   -- ID del producto que deseas consultar
    )
);

--CONSULTA ELIMINAR PRODUCTO
SELECT fn_eliminar_producto(
    json_build_object('id_Prod', 5)  -- Cambia 1 por el ID del producto que deseas eliminar
);

--CONSULTA LISTAR CATEGORIAS
select fn_lst_categorias();

--COSULSTA LISTAR ALMACENES
select fn_lst_almacenes();

--CONSULTA LISTAR ARTESANOS
SELECT fn_lst_artesanos();

