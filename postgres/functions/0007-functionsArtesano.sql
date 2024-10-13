--------------------------------------------------------------------------
-- Creado: Daniel Tapia    Fecha: 04/10/2024                           --
-- Actividad:                                                           --
-- Funcion que adicionar un artesano                             --
------------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_adm_insertar_artesano(
    nombreArtesano VARCHAR(30),
	apellidoArtesano VARCHAR(50),
	emailArtesano VARCHAR(30),
	nroArtesano VARCHAR(12),
	ciArtesano VARCHAR(15),
	sexoArtesano VARCHAR(20),
	fotoArtesano VARCHAR(200),
    usuario VARCHAR(20),
	especialidadArtesano VARCHAR(200),
	v_id_comunidad INTEGER
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
	especialidad_artesano VARCHAR(50),
	id_comunidad INT
) AS $$
DECLARE
	new_codigo_usuario VARCHAR(20);
	v_id_usuario INT;  -- Cambié el nombre de la variable para evitar conflicto
	new_contraseña VARCHAR(255);
BEGIN
	-- Generar el código de usuario
	new_codigo_usuario := UPPER(SUBSTRING(nombreArtesano FROM 1 FOR 1) || SUBSTRING(apellidoArtesano FROM 1 FOR 1) || ciArtesano);
	new_contraseña := md5(ciArtesano);
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
		nombreArtesano, 
		apellidoArtesano, 
		emailArtesano, 
		nroArtesano, 
		new_contraseña, 
		ciArtesano, 
		sexoArtesano, 
		fotoArtesano, 
		NOW(), NOW(),  -- Para las fechas de creación y modificación
		usuario, usuario, 
		'activo', 
		'Artesano')
	RETURNING usuario.id_usuario INTO v_id_usuario;  -- Usamos la variable v_id_usuario en lugar de id_usuario

	-- Insertar en la tabla cliente
	INSERT INTO public.artesano(
	id_usuario, 
	especialidad_artesano, 
	id_comunidad, 
	fecha_creacion, 
	fecha_modificacion, 
	usuario_creacion, 
	usuario_modificacion, 
	estado_registro)
	VALUES (
	v_id_usuario, 
	especialidadArtesano, 
	v_id_comunidad, 
	NOW(), 
	NOW(), 
	usuario, 
	usuario, 
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
		a.especialidad_artesano,
		a.id_comunidad
	FROM public.usuario u
	JOIN public.artesano a ON u.id_usuario = a.id_usuario  -- Asegurarse de que la columna venga de la tabla usuario
	WHERE u.id_usuario = v_id_usuario;  -- Usamos la variable v_id_usuario
END;
$$ LANGUAGE plpgsql;

--pruebita
select md5('lupe123')
select public.fn_adm_insertar_artesano('Hulk','Hogan','lalaho@gmail.com','74135694'
,'17129036','Masculino','http://example.com/foto.jpg',
'ADM','Costuras',1);


--------------------------------------------------------------------------
-- Creado: Daniel Tapia    Fecha: 04/10/2024                           --
-- Actividad:                                                           --
-- Funcion que lista los artesano                             --
------------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_listar_artesanos()
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
	especialidad_artesano VARCHAR(50),
	nombrecom VARCHAR(100),
	estado_registro VARCHAR(15)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ROW_NUMBER() OVER (ORDER BY a.id_usuario ASC) AS numero_registro,
        a.id_usuario,
		u.nombre,
		u.apellido,
		u.email,
		u.numero_contacto,
		u.ci,
		u.sexo,
		u.fotoperf_url,
		a.fecha_creacion,
		a.fecha_modificacion,
		a.usuario_creacion,
		a.usuario_modificacion,
		a.especialidad_artesano,
		c.nombrecom,
		a.estado_registro
    FROM 
        public.USUARIO u, public.ARTESANO a, public.COMUNIDAD c where u.id_usuario = a.id_usuario and a.id_comunidad = c.id_comunidad;
END;
$$ LANGUAGE plpgsql;
--pruebita
select * from fn_listar_artesanos()

--------------------------------------------------------------------------
-- Creado: Daniel Tapia    Fecha: 04/10/2024                           --
-- Actividad:                                                           --
-- Funcion que actualiza un artesano                             --
------------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_actualizar_artesano(
    id_usuario_C INT,
    nombreArtesano VARCHAR(30),
	apellidoArtesano VARCHAR(50),
	emailArtesano VARCHAR(30),
	nroArtesano VARCHAR(12),
	ciArtesano VARCHAR(15),
	sexoArtesano VARCHAR(20),
	fotoArtesano VARCHAR(200),
    usuario VARCHAR(20),
	espArtesano VARCHAR(50),
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
	especialidad_artesano VARCHAR(50),
	id_comunidad INT
) AS $$
BEGIN
	-- Actualizar la tabla usuario
	UPDATE public.usuario u
	SET 
		nombre = nombreArtesano,
		apellido = apellidoArtesano,
		email = emailArtesano,
		numero_contacto = nroArtesano,
		ci = ciArtesano,
		sexo = sexoArtesano,
		fotoperf_url = fotoArtesano,
		fecha_modificacion = NOW(),
		usuario_modificacion = usuario,
		estado_registro = estado_c
	WHERE u.id_usuario = id_usuario_C;  -- Corrección en el WHERE

	-- Actualizar la tabla artesano
	UPDATE public.artesano a
	SET 
		fecha_modificacion = NOW(),
		usuario_modificacion = usuario,
		estado_registro = estado_c,
		especialidad_artesano = espArtesano
	WHERE a.id_usuario = id_usuario_C;  -- Corrección en el WHERE

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
		a.especialidad_artesano,
		a.id_comunidad
	FROM public.usuario u
	JOIN public.artesano a ON u.id_usuario = a.id_usuario
	WHERE u.id_usuario = id_usuario_C;

END;
$$ LANGUAGE plpgsql;


--pruebita
select fn_actualizar_artesano(7,'Hulk','Hogan','lalaho@gmail.com','74135694',
'17129036','Masculino','http://example.com/foto.jpg',
'ADM','Costuras','pendiente')
select * from artesano

--------------------------------------------------------------------------
-- Creado: Daniel Tapia    Fecha: 04/10/2024                           --
-- Actividad:                                                           --
-- Funcion que elimina un artesano                             --
------------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_eliminar_artesano(p_id_artesano INT)
RETURNS VOID AS $$
BEGIN
    DELETE FROM artesano a WHERE a.id_usuario = p_id_artesano;
	DELETE FROM usuario u WHERE u.id_usuario = p_id_artesano;  
END;
$$ LANGUAGE plpgsql;
--pruebita