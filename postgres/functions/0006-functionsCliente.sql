--------------------------------------------------------------------------
-- Creado: Daniel Tapia    Fecha: 03/10/2024                           --
-- Actividad:                                                           --
-- Funcion que adiciona un cliente                               --
------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_adm_insertar_cliente(
    nombreCliente VARCHAR(30),
	apellidoCliente VARCHAR(50),
	emailCliente VARCHAR(30),
	nroCliente VARCHAR(12),
	ciCliente VARCHAR(15),
	sexoCliente VARCHAR(20),
	fotoCliente VARCHAR(200),
    usuario VARCHAR(20),
	direccionCliente VARCHAR(200),
	longitud VARCHAR(50),
	latitud VARCHAR(50)
) 
RETURNS TABLE (
    id_usuario INT,
	codigo_usuario VARCHAR(20),
	nombre VARCHAR(30),
	apellido VARCHAR(100),
	email VARCHAR(30),
	numero_contacto VARCHAR(12),
	contraseña VARCHAR(255),
	ci VARCHAR(15),
	sexo VARCHAR(20),
	fotoperf_url VARCHAR(200),
	fecha_creacion TIMESTAMP WITH TIME ZONE,
	fecha_modificacion TIMESTAMP WITH TIME ZONE,
	usuario_creacion VARCHAR(20),
	usuario_modificacion VARCHAR(20),
	estado_registro VARCHAR(15),
	rol VARCHAR(20),
	direccion_envio VARCHAR(200),
	ubicacion_geoRef_Cli geometry(Point, 4326)
) AS $$
DECLARE
	c_ubicacion_geoRef_Cli geometry(Point, 4326);
	new_codigo_usuario VARCHAR(20);
	v_id_usuario INT;  -- Cambié el nombre de la variable para evitar conflicto
	new_contraseña VARCHAR(255);
BEGIN
	-- Generar la geometría a partir de longitud y latitud
	c_ubicacion_geoRef_Cli := ST_SetSRID(ST_MakePoint((longitud)::FLOAT, (latitud)::FLOAT), 4326);
	-- Generar el código de usuario
	new_codigo_usuario := UPPER(SUBSTRING(nombreCliente FROM 1 FOR 1) || SUBSTRING(apellidoCliente FROM 1 FOR 1) || ciCliente);
	new_contraseña := md5(ciCliente);

    -- Insertar en la tabla usuario
	INSERT INTO public.usuario (
		codigo_usuario, 
		nombre, apellido, email, 
		numero_contacto, "contraseña", 
		ci, sexo, fotoperf_url, 
		fecha_creacion, fecha_modificacion, 
		usuario_creacion, usuario_modificacion, 
		estado_registro, rol)
	VALUES (
		new_codigo_usuario, 
		nombreCliente, 
		apellidoCliente, 
		emailCliente, 
		nroCliente, 
		new_contraseña, 
		ciCliente, 
		sexoCliente, 
		fotoCliente, 
		NOW(), NOW(),  -- Para las fechas de creación y modificación
		usuario, usuario, 
		'activo', 
		'Cliente')
	RETURNING usuario.id_usuario INTO v_id_usuario;  -- Usamos la variable v_id_usuario en lugar de id_usuario

	-- Insertar en la tabla cliente
	INSERT INTO public.cliente(
		id_usuario,  -- Enlazar con la tabla usuario
		direccion_envio, 
		ubicacion_georef_cli, 
		fecha_creacion, 
		fecha_modificacion, 
		usuario_creacion, 
		usuario_modificacion, 
		estado_registro)
	VALUES (
		v_id_usuario,  -- Usamos la variable v_id_usuario
		direccionCliente, 
		c_ubicacion_geoRef_Cli, 
		NOW(), NOW(), 
		usuario, usuario, 
		'activo');

	-- Devolver los datos insertados
	RETURN QUERY 
	SELECT 
		u.id_usuario,  -- Especificar siempre la tabla para evitar ambigüedad
		u.codigo_usuario,
		u.nombre,
		u.apellido,
		u.email,
		u.numero_contacto,
		u.contraseña,
		u.ci,
		u.sexo,
		u.fotoperf_url,
		u.fecha_creacion,
		u.fecha_modificacion,
		u.usuario_creacion,
		u.usuario_modificacion,
		u.estado_registro,
		u.rol,
		c.direccion_envio,
		c.ubicacion_georef_cli
	FROM public.usuario u
	JOIN public.cliente c ON u.id_usuario = c.id_usuario  -- Asegurarse de que la columna venga de la tabla usuario
	WHERE u.id_usuario = v_id_usuario;  -- Usamos la variable v_id_usuario
END;
$$ LANGUAGE plpgsql;


--pruebita
select md5('lupe123')
select public.fn_adm_insertar_cliente('Lupe','Molina','lalala@gmail.com','74135694',
'10289036','Femenino','http://example.com/foto.jpg',
'ADM','Calle Ejemplo 123','-68.1193','-16.5000');


--------------------------------------------------------------------------
-- Creado: Daniel Tapia    Fecha: 03/10/2024                           --
-- Actividad:                                                           --
-- Funcion que lista un cliente                               --
------------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_listar_clientes()
RETURNS TABLE (
    numero_registro BIGINT,
    id_usuario INT,
    nombre VARCHAR(30),
    apellido VARCHAR(100),
    email VARCHAR(30),
    numero_contacto VARCHAR(12),
    ci VARCHAR(15),
    sexo VARCHAR(20),
    fotoperf_url VARCHAR(200),
    fecha_creacion TIMESTAMP WITH TIME ZONE,
    fecha_modificacion TIMESTAMP WITH TIME ZONE,
    usuario_creacion VARCHAR(20),
    usuario_modificacion VARCHAR(20),
    direccion_envio VARCHAR(200),
    longitud DOUBLE PRECISION,
    latitud DOUBLE PRECISION,
    estado_registro VARCHAR(15)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ROW_NUMBER() OVER (ORDER BY c.id_usuario ASC) AS numero_registro,
        c.id_usuario,
        u.nombre,
        u.apellido,
        u.email,
        u.numero_contacto,
        u.ci,
        u.sexo,
        u.fotoperf_url,
        c.fecha_creacion,
        c.fecha_modificacion,
        c.usuario_creacion,
        c.usuario_modificacion,
        c.direccion_envio,
        ST_X(c.ubicacion_georef_cli) AS longitud,
        ST_Y(c.ubicacion_georef_cli) AS latitud,
        c.estado_registro
    FROM 
        public.USUARIO u, public.CLIENTE c 
    WHERE 
        u.id_usuario = c.id_usuario;
END;
$$ LANGUAGE plpgsql;
--pruebita
select fn_listar_clientes()



--------------------------------------------------------------------------
-- Creado: Daniel Tapia    Fecha: 03/10/2024                           --
-- Actividad:                                                           --
-- Funcion que actualiza un cliente                               --
------------------------------------------------------------------
--------------------------------------------------------------------------
-- Creado: Christian Medrani   Fecha: 15/10/2024                           --
-- Actividad:                                                           --
-- Se obio  algunos datos(debatir si son necesarios actualizarlos)
-- en la Funcion de actualizacion
------------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_actualizar_cliente(
    id_usuario_C INT,
    ciCliente VARCHAR(15),
    nombreCliente VARCHAR(30),
    apellidoCliente VARCHAR(50),
    emailCliente VARCHAR(30),
    direccionCliente VARCHAR(200),
    nroCliente VARCHAR(12),
    sexoCliente VARCHAR(20),
    estado_c VARCHAR(15)
)
RETURNS TABLE(
    id_usuario INT,
    codigo_usuario VARCHAR(20),
    nombre VARCHAR(30),
    apellido VARCHAR(100),
    email VARCHAR(30),
    numero_contacto VARCHAR(12),
    contraseña VARCHAR(255),
    ci VARCHAR(15),
    sexo VARCHAR(20),
    fotoperf_url VARCHAR(200),
    fecha_creacion TIMESTAMP WITH TIME ZONE,
    fecha_modificacion TIMESTAMP WITH TIME ZONE,
    usuario_creacion VARCHAR(20),
    usuario_modificacion VARCHAR(20),
    estado_registro VARCHAR(15),
    rol VARCHAR(20),
    direccion_envio VARCHAR(200),
    ubicacion_geoRef_Cli geometry(Point, 4326)
) AS $$
BEGIN
    -- Actualizar la tabla usuario
    UPDATE public.usuario u
    SET 
        nombre = nombreCliente,
        apellido = apellidoCliente,
        email = emailCliente,
        numero_contacto = nroCliente,
        ci = ciCliente,
        sexo = sexoCliente,
        fecha_modificacion = NOW(),
        estado_registro = estado_c
    WHERE u.id_usuario = id_usuario_C;

    -- Actualizar la tabla cliente
    UPDATE public.cliente c
    SET 
        fecha_modificacion = NOW(),
        direccion_envio = direccionCliente,
        estado_registro = estado_c
    WHERE c.id_usuario = id_usuario_C;

    -- Devolver los datos actualizados
    RETURN QUERY 
    SELECT 
        u.id_usuario,
        u.codigo_usuario,
        u.nombre,
        u.apellido,
        u.email,
        u.numero_contacto,
        u."contraseña",
        u.ci,
        u.sexo,
        u.fotoperf_url,
        u.fecha_creacion,
        u.fecha_modificacion,
        u.usuario_creacion,
        u.usuario_modificacion,
        u.estado_registro,
        u.rol,
        c.direccion_envio,
        c.ubicacion_georef_cli
    FROM public.usuario u
    JOIN public.cliente c ON u.id_usuario = c.id_usuario
    WHERE u.id_usuario = id_usuario_C;

END;
$$ LANGUAGE plpgsql;

SELECT * FROM fn_actualizar_cliente(
    1,                          -- id_usuario_C (ID del cliente que se actualizará)
    '12345678',                 -- ciCliente (Carnet de Identidad del cliente)
    'Juan',                     -- nombreCliente (Nuevo nombre del cliente)
    'Pérez',                    -- apellidoCliente (Nuevo apellido del cliente)
    'juan.perez@example.com',    -- emailCliente (Nuevo email del cliente)
    'Calle Falsa 123',          -- direccionCliente (Nueva dirección del cliente)
    '76543210',                 -- nroCliente (Nuevo número de contacto del cliente)
    'M',                        -- sexoCliente (Nuevo sexo del cliente, 'M' o 'F')
    'activo'                    -- estado_c (Estado del registro, por ejemplo 'activo' o 'inactivo')
);



--------------------------------------------------------------------------
-- Creado: Daniel Tapia    Fecha: 03/10/2024                           --
-- Actividad:                                                           --
-- Funcion que eliminar un cliente                               --
------------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_eliminar_cliente(p_id_cliente INT)
RETURNS VOID AS $$
BEGIN
    DELETE FROM cliente c WHERE c.id_usuario = p_id_cliente;
	DELETE FROM usuario u WHERE u.id_usuario = p_id_cliente;  
END;
$$ LANGUAGE plpgsql;
