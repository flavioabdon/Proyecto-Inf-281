--------------------------------------------------------------------------
-- Creado: Daniel Tapia    Fecha: 04/10/2024                           --
-- Actividad:                                                           --
-- Funcion que agrega un delivery                             --
------------------------------------------------------------------
--devuelve v_id_usuario y v_id_delivery en lugar de id_usuario y id_delivery
CREATE OR REPLACE FUNCTION fn_adm_insertar_delivery(
	nombreDelivery VARCHAR(30),
	apellidoDelivery VARCHAR(50),
	ciDelivery VARCHAR(15),
	emailDelivery VARCHAR(30),
	nroDelivery VARCHAR(12),
	vehiculoDelivery VARCHAR(50),
	matriculaDelivery  VARCHAR(10),
	sexoDelivery VARCHAR(20),
	fotoDelivery VARCHAR(200),
    usuario VARCHAR(20)
) 
RETURNS TABLE (
    v_id_usuario INT,
	v_id_delivery INT,
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
	tipo_vehiculo VARCHAR(50),
	matricula_vehiculo VARCHAR(10)
) AS $$
DECLARE
	new_codigo_usuario VARCHAR(20);
	v_id_usuario INT;  -- Cambié el nombre de la variable para evitar conflicto
	new_contraseña VARCHAR(255);
BEGIN
	-- Generar el código de usuario
	new_codigo_usuario := UPPER(SUBSTRING(nombreDelivery FROM 1 FOR 1) || SUBSTRING(apellidoDelivery FROM 1 FOR 1) || ciDelivery);
	new_contraseña := md5(ciDelivery);

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
		nombreDelivery, 
		apellidoDelivery, 
		emailDelivery, 
		nroDelivery, 
		new_contraseña, 
		ciDelivery, 
		sexoDelivery, 
		fotoDelivery, 
		NOW(), NOW(),  -- Para las fechas de creación y modificación
		usuario, usuario, 
		'activo', 
		'Delivery')
	RETURNING usuario.id_usuario INTO v_id_usuario;  -- Usamos la variable v_id_usuario en lugar de id_usuario

	-- Insertar en la tabla cliente
	INSERT INTO public.delivery(
	id_usuario, 
	tipo_vehiculo, 
	matricula_vehiculo, 
	fecha_creacion, 
	fecha_modificacion, 
	usuario_creacion, 
	usuario_modificacion, 
	estado_registro)
	VALUES (
	v_id_usuario, 
	vehiculoDelivery, 
	matriculaDelivery, 
	NOW(), NOW(), 
	usuario, usuario, 
	'activo')
	RETURNING id_delivery INTO v_id_delivery;
	-- Devolver los datos insertados
	RETURN QUERY 
	SELECT 
		u.id_usuario,  -- Especificar siempre la tabla para evitar ambigüedad
		d.id_delivery,
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
		d.tipo_vehiculo,
		d.matricula_vehiculo
	FROM public.usuario u
	JOIN public.delivery d ON u.id_usuario = d.id_usuario  -- Asegurarse de que la columna venga de la tabla usuario
	WHERE u.id_usuario = v_id_usuario;  -- Usamos la variable v_id_usuario
END;
$$ LANGUAGE plpgsql;

-- sentencia de apoyo
SELECT * FROM fn_adm_insertar_delivery(
    'Carlos',                        -- nombreDelivery
    'Sánchez',                       -- apellidoDelivery
    '87654321',                      -- ciDelivery
    'carlos.sanchez@example.com',   -- emailDelivery
    '987654321',                    -- nroDelivery
    'Bicicleta',                    -- vehiculoDelivery
    'BIC123',                       -- matriculaDelivery
    'Masculino',                    -- sexoDelivery
    'http://example.com/foto.jpg', -- fotoDelivery
    'admin'                         -- usuario
);


--------------------------------------------------------------------------
-- Creado: Daniel Tapia    Fecha: 04/10/2024                           --
-- Actividad:                                                           --
-- Funcion que lista los deliverys                             --
------------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_listar_deliveries()
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
	tipo_vehiculo VARCHAR(50),
	matricula_vehiculo VARCHAR(10),
	estado_registro VARCHAR(15)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ROW_NUMBER() OVER (ORDER BY d.id_usuario ASC) AS numero_registro,
        d.id_usuario,
		u.nombre,
		u.apellido,
		u.email,
		u.numero_contacto,
		u.ci,
		u.sexo,
		u.fotoperf_url,
		d.fecha_creacion,
		d.fecha_modificacion,
		d.usuario_creacion,
		d.usuario_modificacion,
		d.tipo_vehiculo,
		d.matricula_vehiculo,
		d.estado_registro
    FROM 
        public.USUARIO u, public.DELIVERY d where u.id_usuario = d.id_usuario;
END;
$$ LANGUAGE plpgsql;
--pruebita
select * from fn_listar_deliveries();



--------------------------------------------------------------------------
-- Creado: Daniel Tapia    Fecha: 04/10/2024                           --
-- Actividad:                                                           --
-- Funcion que actualiza un delivery                            --
------------------------------------------------------------------

--------------------------------------------------------------------------
-- Creado: Christian Medrano    Fecha: 17/10/2024                           --
-- Actividad:                                                           --
-- Correcion a la funcion actualizar                          --
------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_actualizar_delivery(
    p_id_usuario INTEGER,
    p_nombre VARCHAR(30),
    p_apellido VARCHAR(50),
    p_ci VARCHAR(15),
    p_email VARCHAR(30),
    p_numero_contacto VARCHAR(12),
    p_tipo_vehiculo VARCHAR(50),
    p_matricula_vehiculo VARCHAR(10),
    p_sexo VARCHAR(20),
    p_estado VARCHAR(15)
) RETURNS TABLE (
    v_id_usuario INT,
	v_id_delivery INT,
    nombre VARCHAR(30),
    apellido VARCHAR(50),
    ci VARCHAR(15),
    email VARCHAR(30),
    numero_contacto VARCHAR(12),
    tipo_vehiculo VARCHAR(50),
    matricula_vehiculo VARCHAR(10),
    sexo VARCHAR(20),
    estado_registro VARCHAR(15)
) AS $$
BEGIN
    -- Actualizar los datos en la tabla USUARIO
    UPDATE public.USUARIO u
    SET
        nombre = p_nombre,
        apellido = p_apellido,
        ci = p_ci,
        email = p_email,
        numero_Contacto = p_numero_contacto,
        sexo = p_sexo,
        fecha_modificacion = CURRENT_TIMESTAMP,
        estado_registro = p_estado
    WHERE u.id_usuario = p_id_usuario;

    -- Actualizar los datos en la tabla DELIVERY
    UPDATE public.DELIVERY d
    SET
        tipo_vehiculo = p_tipo_vehiculo,
        matricula_vehiculo = p_matricula_vehiculo,
        fecha_modificacion = CURRENT_TIMESTAMP,
        estado_registro = p_estado
    WHERE d.id_usuario = p_id_usuario;

    -- Devolver los datos actualizados
    RETURN QUERY
    SELECT
        u.id_usuario,
		d.id_delivery,
        u.nombre,
        u.apellido,
        u.ci,
        u.email,
        u.numero_contacto,
        d.tipo_vehiculo,
        d.matricula_vehiculo,
        u.sexo,
        u.estado_registro
    FROM public.USUARIO u
    INNER JOIN public.DELIVERY d ON u.id_usuario = d.id_usuario
    WHERE u.id_usuario = p_id_usuario;
END;
$$ LANGUAGE plpgsql;

-- sentencia de apoyo
SELECT * FROM fn_actualizar_delivery(
    6,                             -- p_id_usuario
    'Juan',                        -- p_nombre
    'Pérez',                       -- p_apellido
    '123456789',                   -- p_ci
    'juan@example.com',     -- p_email
    '987654321',                  -- p_numero_contacto
    'Motocicleta',                -- p_tipo_vehiculo
    '1234AB',                     -- p_matricula_vehiculo
    'M',                  -- p_sexo
    'activo'                      -- p_estado
);



--------------------------------------------------------------------------
-- Creado: Daniel Tapia    Fecha: 04/10/2024                           --
-- Actividad:                                                           --
-- Funcion que elimina un delivery                            --
------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_eliminar_delivery(p_id_usuario INT)
RETURNS VOID AS $$
BEGIN
    DELETE FROM delivery d WHERE d.id_usuario = p_id_usuario;
	DELETE FROM usuario u WHERE u.id_usuario = p_id_usuario;  
END;
$$ LANGUAGE plpgsql;

--pruebita