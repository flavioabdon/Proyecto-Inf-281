--------------------------------------------------------------------------
-- Creado: Flavio Condori    Fecha: 18/9/2024                           --
-- Actividad:                                                           --
-- Funcion que inserta un nuevo usuario                                 --
------------------------------------------------------------------
--------------------------------------------------------------------------
-- Modificado: Ruddy Cruz    Fecha: 27/9/2024                           --
-- Actividad:                                                           --
-- Se añadio la variable y el campo rol con valor por default a Cliente--
-- Hash md5 a la contraseña para coincidir con la BD 					--                 		                                --
------------------------------------------------------------------
--------------------------------------------------------------------------
-- Creado: Flavio Condori    Fecha: 29/10/2024                           --
-- Actividad:                                                           --
-- Se corrigio la funcion segun la estructura de la base de datos  
CREATE OR REPLACE FUNCTION public.fn_insertar_usuario_cliente(data JSONB)
RETURNS JSONB AS $$
DECLARE
    v_codigo_usuario VARCHAR(20);
    v_direccion_envio VARCHAR(100);
    v_ubicacion_geoRef_Cli geometry(Point, 4326);

    v_id_usuario NUMERIC;

    v_nombre VARCHAR(30);
    v_apellido VARCHAR(50);
    v_email VARCHAR(30);
    v_numero_contacto VARCHAR(12);
    v_contraseña VARCHAR(20);
    v_ci VARCHAR(15);
    v_sexo VARCHAR(20);
    v_fotoPerf_url VARCHAR(200);
	v_rol VARCHAR(20);
BEGIN
    v_direccion_envio := data->>'direccion_Envio';
    v_ubicacion_geoRef_Cli := ST_SetSRID(ST_MakePoint((data->>'longitud')::FLOAT, (data->>'latitud')::FLOAT), 4326);

    v_nombre := data->>'nombre';
    v_apellido := data->>'apellido';
    v_email := data->>'email';
    v_numero_contacto := data->>'numero_Contacto';
    v_contraseña := data->>'contraseña';
    v_ci := data->>'ci';
    v_sexo := data->>'sexo';
    v_fotoPerf_url := data->>'fotoPerf_url';
	v_rol := data->>'rol';

    -- Generar codigo_usuario a partir de la inicial del nombre, inicial del apellido y el ci
    v_codigo_usuario := UPPER(SUBSTRING(v_nombre FROM 1 FOR 1) || SUBSTRING(v_apellido FROM 1 FOR 1) || v_ci);

    -- Insertar el nuevo usuario en la tabla usuario
    INSERT INTO public.usuario(codigo_Usuario, nombre, apellido, email, numero_Contacto, contraseña, ci, sexo, fotoPerf_url, fecha_creacion, usuario_creacion, estado_registro, rol)
    VALUES (v_codigo_usuario, v_nombre, v_apellido, v_email, v_numero_contacto,md5(v_contraseña), v_ci, v_sexo, v_fotoPerf_url, CURRENT_TIMESTAMP, 'sistema', 'pendiente','Cliente');

    --recuperar el id del usuraio
    select u.id_usuario INTO v_id_usuario from usuario u order by fecha_creacion desc limit 1;

    -- Insertar el nuevo cliente en la tabla cliente
    INSERT INTO public.cliente(id_usuario, direccion_Envio, ubicacion_geoRef_Cli, fecha_creacion, usuario_creacion, estado_registro)
    VALUES (v_id_usuario,v_direccion_envio, v_ubicacion_geoRef_Cli, CURRENT_TIMESTAMP, 'sistema', 'pendiente');

    -- Devolver un JSON de éxito
    RETURN jsonb_build_object('estado','exitoso','mensaje', 'Usuario registrado exitosamente');
EXCEPTION
    WHEN unique_violation THEN
        RETURN jsonb_build_object('estado','error', 'mensaje','El código de usuario o el email ya existe');
    WHEN others THEN
        RETURN jsonb_build_object('estado','error','mensaje', SQLERRM);
END;
$$ LANGUAGE plpgsql;

-- Sentecias de apoyo SQL
SELECT public.fn_insertar_usuario_cliente('{
    "direccion_Envio": "Calle Ejemplo 123",
    "longitud": -68.1193,
    "latitud": -16.5000,
    "nombre": "Jauan",
    "apellido": "Pérez",
    "email": "juana.peraeazaa@example.com",
    "numero_Contacto": "1234567890",
    "contraseña": "contraseña123",
    "ci": "123451678",
    "sexo": "M",
    "fotoPerf_url": "http://example.com/foto.jpg"
}'::JSONB);
