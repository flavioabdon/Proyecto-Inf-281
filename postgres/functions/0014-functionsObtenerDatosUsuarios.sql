
--------------------------------------------------------------------------
-- Creado: Christian Medrano    Fecha:11/11/2024                           --
-- Actividad:                                                           --
-- Funciones obtiene todos los datos del cliente,artesano,delivery por id_usuario --
------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_obtener_datos_cliente_por_id(id_usuario_cliente INT)
RETURNS TABLE (
    nombre VARCHAR,
    apellido VARCHAR,
    ci VARCHAR,
    email VARCHAR,
    numero_contacto VARCHAR,
    direccion_envio VARCHAR,
    ubicacion_geoRef_Cli TEXT  -- Aquí cambiamos el tipo a TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.nombre,
        u.apellido,
        u.ci,
        u.email,
        u.numero_contacto,
        c.direccion_Envio,
        ST_AsText(c.ubicacion_geoRef_Cli)  -- Convertir la geometría del punto a texto
    FROM public.USUARIO u
    INNER JOIN public.CLIENTE c ON u.id_usuario = c.id_usuario
    WHERE u.id_usuario = id_usuario_cliente;
END;
$$ LANGUAGE plpgsql;

-- sentencia de apoyo
SELECT * FROM fn_obtener_datos_cliente_por_id(2);


CREATE OR REPLACE FUNCTION fn_obtener_datos_artesano_por_id(id_usuario_artesano INTEGER)
RETURNS TABLE(
    nombre VARCHAR,
    apellido VARCHAR,
    ci VARCHAR,
    email VARCHAR,
    numero_contacto VARCHAR,
    especialidad_artesano VARCHAR,
    id_artesano INTEGER  -- Se añade el id_artesano
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.nombre,
        u.apellido,
        u.ci,
        u.email,
        u.numero_contacto,
        a.especialidad_artesano,
        a.id_artesano  -- Selección de id_artesano
    FROM usuario u
    INNER JOIN artesano a ON u.id_usuario = a.id_usuario
    WHERE u.id_usuario = id_usuario_artesano;
END;
$$ LANGUAGE plpgsql;


-- sentencia de apoyo
select * from fn_obtener_datos_artesano_por_id(12);



CREATE OR REPLACE FUNCTION fn_obtener_datos_delivery_por_id(id_usuario_delivery INTEGER)
RETURNS TABLE(
    nombre VARCHAR,
    apellido VARCHAR,
    ci VARCHAR,
    email VARCHAR,
    numero_contacto VARCHAR,
    tipo_vehiculo VARCHAR,
    matricula_vehiculo VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.nombre,
        u.apellido,
        u.ci,
        u.email,
        u.numero_contacto,
        d.tipo_vehiculo,
        d.matricula_vehiculo
    FROM usuario u
    INNER JOIN delivery d ON u.id_usuario = d.id_usuario
    WHERE u.id_usuario = id_usuario_delivery;
END;
$$ LANGUAGE plpgsql;

-- sentencia de apoyo
select * from fn_obtener_datos_delivery_por_id(22);
