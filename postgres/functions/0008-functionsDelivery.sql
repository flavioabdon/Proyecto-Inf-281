--------------------------------------------------------------------------
-- Creado: Daniel Tapia    Fecha: 04/10/2024                           --
-- Actividad:                                                           --
-- Funcion que agrega un delivery                             --
------------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_adm_insertar_delivery(
    nombreDelivery VARCHAR(30),
	apellidoDelivery VARCHAR(50),
	emailDelivery VARCHAR(30),
	nroDelivery VARCHAR(12),
	ciDelivery VARCHAR(15),
	sexoDelivery VARCHAR(20),
	fotoDelivery VARCHAR(200),
    usuario VARCHAR(20),
	vehiculoDelivery VARCHAR(50),
	matriculaDelivery  VARCHAR(10)
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
		d.tipo_vehiculo,
		d.matricula_vehiculo
	FROM public.usuario u
	JOIN public.delivery d ON u.id_usuario = d.id_usuario  -- Asegurarse de que la columna venga de la tabla usuario
	WHERE u.id_usuario = v_id_usuario;  -- Usamos la variable v_id_usuario
END;
$$ LANGUAGE plpgsql;

--pruebita
select md5('lupe123')
select public.fn_adm_insertar_delivery('Mario','Bros','lanintenda@gmail.com','74965694',
'171201329','Masculino','http://example.com/foto.jpg',
'ADM','moto','xyz666');
select * from usuario


--------------------------------------------------------------------------
-- Creado: Daniel Tapia    Fecha: 04/10/2024                           --
-- Actividad:                                                           --
-- Funcion que lista los deliverys                             --
------------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_listar_deliverys()
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
select fn_listar_deliverys()


--------------------------------------------------------------------------
-- Creado: Daniel Tapia    Fecha: 04/10/2024                           --
-- Actividad:                                                           --
-- Funcion que actualiza un delivery                            --
------------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_actualizar_delivery(
    id_usuario_C INT,
    nombreDelivery VARCHAR(30),
	apellidoDelivery VARCHAR(50),
	emailDelivery VARCHAR(30),
	nroDelivery VARCHAR(12),
	ciDelivery VARCHAR(15),
	sexoDelivery VARCHAR(20),
	fotoDelivery VARCHAR(200),
    usuario VARCHAR(20),
	estado_c VARCHAR(15),
	vehiculoDelivery VARCHAR(50),
	matriculaDelivery VARCHAR(10)
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
	tipo_vehiculo VARCHAR(50),
	matricula_vehiculo VARCHAR(10)
) AS $$
BEGIN
	-- Actualizar la tabla usuario
	UPDATE public.usuario u
	SET 
		nombre = nombreDelivery,
		apellido = apellidoDelivery,
		email = emailDelivery,
		numero_contacto = nroDelivery,
		ci = ciDelivery,
		sexo = sexoDelivery,
		fotoperf_url = fotoDelivery,
		fecha_modificacion = NOW(),
		usuario_modificacion = usuario,
		estado_registro = estado_c
	WHERE u.id_usuario = id_usuario_C;

	-- Actualizar la tabla delivery
	UPDATE public.delivery d
	SET 
		fecha_modificacion = NOW(),
		usuario_modificacion = usuario,
		estado_registro = estado_c,
		tipo_vehiculo = vehiculoDelivery,
		matricula_vehiculo = matriculaDelivery
	WHERE d.id_usuario = id_usuario_C;

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
		d.tipo_vehiculo,
		d.matricula_vehiculo
	FROM public.usuario u
	JOIN public.delivery d ON u.id_usuario = d.id_usuario
	WHERE u.id_usuario = id_usuario_C;

EXCEPTION
	-- Manejo de errores
	WHEN OTHERS THEN
		RAISE EXCEPTION 'Error actualizando el delivery con id_usuario %: %', id_usuario_C, SQLERRM;
END;
$$ LANGUAGE plpgsql;


--pruebita
select fn_actualizar_delivery(8,'Mario','Bros','lanintenda@gmail.com','74965694',
'171201329','Masculino','http://example.com/foto.jpg',
'ADM','pendiente','moto','xyz666');
select * from usuario
select * from delivery


--------------------------------------------------------------------------
-- Creado: Daniel Tapia    Fecha: 04/10/2024                           --
-- Actividad:                                                           --
-- Funcion que actualiza un delivery                            --
------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_eliminar_delivery(p_id_delivery INT)
RETURNS VOID AS $$
BEGIN
    DELETE FROM delivery d WHERE d.id_usuario = p_id_delivery;
	DELETE FROM usuario u WHERE u.id_usuario = p_id_delivery;  
END;
$$ LANGUAGE plpgsql;

--pruebita
