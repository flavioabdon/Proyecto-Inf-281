--------------------------------------------------------------------------
-- Creado: Ruddy Cruz    Fecha: 11/10/2024                           --
-- Actividad:                                                           --
-- Funcion que inserta una nueva comunidad                                 --
------------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_insertar_comunidad(
    v_departamento character varying(15),
    v_provincia character varying(100),
    v_municipio character varying(100),
    v_nombreCom character varying(100),
    v_longitud VARCHAR(50),
	v_latitud VARCHAR(50),
    v_usuario_creacion VARCHAR(20),
    v_estado_registro VARCHAR(15)
) 
RETURNS TABLE (
    id_comunidad INT,
    departamento VARCHAR(15),
    provincia VARCHAR(100),
    municipio VARCHAR(100),    
    nombreCom VARCHAR(100),
    ubicacion_georef_com geometry(Point, 4326),
    fecha_creacion TIMESTAMP WITH TIME ZONE,
    fecha_modificacion TIMESTAMP WITH TIME zone,
    usuario_creacion VARCHAR(20),
    estado_registro VARCHAR(15)
) AS $$
DECLARE
	c_ubicacion_georef_cli geometry(Point, 4326);
BEGIN
    -- IF NOT v_ubicacion_georef_com ~ '^-?\d+(\.\d+)?\s-?\d+(\.\d+)?$' THEN
    -- RAISE EXCEPTION 'Las coordenadas proporcionadas no son válidas. Formato esperado: "longitud latitud"';
    -- END IF;

    -- Geolocalizacion a partir de longitud y latitud
	c_ubicacion_geoRef_Cli := ST_SetSRID(ST_MakePoint((v_longitud)::FLOAT, (v_latitud)::FLOAT), 4326);    

    -- Convierte el texto de ubicación a un tipo geometry (punto geoespacial)
    -- c_ubicacion_georef_cli := ST_GeomFromText('POINT(' || v_ubicacion_geoRef_Com || ')', 4326);

    -- Inserta los datos en la tabla COMUNIDAD y devuelve los resultados
    RETURN QUERY 
    INSERT INTO public.COMUNIDAD (
        departamento,
        provincia, 
        municipio, 
        nombreCom, 
        ubicacion_geoRef_Com,
        usuario_creacion,
        estado_registro
    )
    VALUES (
        v_departamento, 
        v_provincia, 
        v_municipio, 
        v_nombreCom, 
        c_ubicacion_georef_cli,
        v_usuario_creacion,
        v_estado_registro
    )

    RETURNING 
        public.COMUNIDAD.id_comunidad,
        public.COMUNIDAD.Departamento, 
        public.COMUNIDAD.provincia, 
        public.COMUNIDAD.Municipio, 
        public.COMUNIDAD.nombreCom,
		public.COMUNIDAD.ubicacion_geoRef_Com,
        public.COMUNIDAD.fecha_creacion,
        public.COMUNIDAD.fecha_modificacion,
		public.COMUNIDAD.usuario_creacion,
        public.COMUNIDAD.estado_registro ; 
         
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'ERROR AL INSERTAR COMUNIDAD EN SQL-ELEFANTE: %', SQLERRM;  -- Muestra el mensaje de error
        RETURN;  -- Opcional: puedes decidir cómo manejar el retorno en caso de error
END;
$$ LANGUAGE plpgsql;

-- Sentencias de apoyo SQL
SELECT * FROM fn_insertar_comunidad(
    'La Paz',               -- Departamento
    'Murillo',    -- provincia
    'Municipio de La Paz',   -- Municipio
    'Comunidad Murillista',     -- nombreCom
    '-68.1193',   -- ubicacion_geoRef_Com  longitud 
    '-16.5003',   -- ubicacion_geoRef_Com  latitud
    'Administrador',              -- usuario
    'Activo'                 -- estado
);
SELECT * FROM fn_insertar_comunidad(
    'Cochabamba',         -- v_departamento
    'Cercado',            -- v_provincia
    'Cochabamba',         -- v_municipio
    'Comunidad XYZ',      -- v_nombreCom
    '-68.1193',   -- ubicacion_geoRef_Com  longitud 
    '-16.5003',   -- ubicacion_geoRef_Com  latitud
    'AdminUser',          -- v_usuario_creacion
    'Activo'              -- v_estado_registro
);

--------------------------------------------------------------------------
-- Creado: Ruddy Cruz    Fecha: 11/10/2024                           --
-- Actividad:                                                           --
-- Funcion que listar todas las comunidades                                --
------------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_listar_comunidades()
RETURNS TABLE (
    numero_registro BIGINT,
    id_comunidad INT,
    Departamento VARCHAR(15),
    provincia VARCHAR(100),
    Municipio VARCHAR(100),    
    nombreCom VARCHAR(100),
    ubicacion_geoRef_Com geometry(Point, 4326),
    estado_registro VARCHAR(15)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ROW_NUMBER() OVER (ORDER BY c.id_comunidad ASC) AS numero_registro,
        c.id_comunidad,
        c.Departamento,
        c.provincia,
        c.Municipio,
        c.nombreCom,
        c.ubicacion_geoRef_Com,
        c.estado_registro
    FROM 
        public.COMUNIDAD c;
END;
$$ LANGUAGE plpgsql;

-- Sentencia de Apoyo
SELECT * FROM fn_listar_comunidades();


--------------------------------------------------------------------------
-- Creado: Ruddy Cruz    Fecha: 11/10/2024                           --
-- Actividad:                                                           --
-- Funcion que actualiza comunidad                                  --
------------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_actualizar_comunidad(
    v_id_comunidad INT,
    v_Departamento character varying(15),
    v_provincia character varying(100),
    v_Municipio character varying(100),
    v_nombreCom character varying(100),
    v_longitud VARCHAR(50),
	v_latitud VARCHAR(50)
)
RETURNS TABLE(
    id_comunidad INT,
    Departamento VARCHAR(15),
    provincia VARCHAR(100),
    Municipio VARCHAR(100),    
    nombreCom VARCHAR(100),
    ubicacion_geoRef_Com geometry(Point, 4326)
) AS $$
DECLARE
	c_ubicacion_georef_cli geometry(Point, 4326);
BEGIN
    -- Geolocalizacion a partir de longitud y latitud
	c_ubicacion_geoRef_Cli := ST_SetSRID(ST_MakePoint((v_longitud)::FLOAT, (v_latitud)::FLOAT), 4326); 
    RETURN QUERY
    UPDATE public.COMUNIDAD
    SET 
        Departamento = v_Departamento,  
        provincia = v_provincia,
        Municipio = v_Municipio,
        nombreCom = v_nombreCom,
        ubicacion_geoRef_Com = c_ubicacion_geoRef_Cli
    WHERE COMUNIDAD.id_comunidad = v_id_comunidad
    RETURNING 
        COMUNIDAD.id_comunidad, 
        COMUNIDAD.Departamento, 
        COMUNIDAD.provincia, 
        COMUNIDAD.Municipio,
        COMUNIDAD.nombreCom, 
        COMUNIDAD.ubicacion_geoRef_Com; 
END;
$$ LANGUAGE plpgsql;

-- Sentencia de Apoyo
SELECT * FROM fn_actualizar_comunidad(2,'CHUQUISACA','SUCRE','MUNICIPIPO SUCRE','COMUNIDAD CHUQUISACA', '-66.1193','-15.5003');


--------------------------------------------------------------------------
-- Creado: Ruddy Cruz    Fecha: 11/10/2024                           --
-- Actividad:                                                           --
-- Funcion que elimina una comunidad                     --
------------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_eliminar_comunidad(v_id_comunidad INT)
RETURNS VOID AS $$
BEGIN
    DELETE FROM public.COMUNIDAD WHERE COMUNIDAD.id_comunidad = v_id_comunidad;  
END;
$$ LANGUAGE plpgsql;

-- Sentencia de apoyo (no muestra nada)
SELECT fn_eliminar_comunidad(4); -- Cambia 4 por el ID del almacén que deseas eliminar