--------------------------------------------------------------------------
-- Creado: Ruddy Cruz    Fecha: 11/10/2024                           --
-- Actividad:                                                           --
-- Funcion que inserta una nueva comunidad                                 --
------------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_insertar_comunidad(
    v_Departamento character varying(15),
    v_provincia character varying(100),
    v_Municipio character varying(100),
    v_nombreCom character varying(100),
    v_ubicacion_geoRef_Com geometry(Point, 4326),
    v_usuario_creacion VARCHAR(20),
    v_estado_registro VARCHAR(15)
) 
RETURNS TABLE (
    id_comunidad INT,
    Departamento VARCHAR(15),
    provincia VARCHAR(100),
    Municipio VARCHAR(100),    
    nombreCom VARCHAR(100),
    ubicacion_geoRef_Com geometry(Point, 4326),
    fecha_creacion TIMESTAMP WITH TIME ZONE,
    fecha_modificacion TIMESTAMP WITH TIME zone,
    usuario_creacion VARCHAR(20),
    estado_registro VARCHAR(15)
) AS $$
BEGIN
    RETURN QUERY
    INSERT INTO public.COMUNIDAD (
        Departamento,
        provincia, 
        Municipio, 
        nombreCom, 
        ubicacion_geoRef_Com,
        usuario_creacion,
        estado_registro
    )
    VALUES (
        v_Departamento, 
        v_provincia, 
        v_Municipio, 
        v_nombreCom, 
        v_ubicacion_geoRef_Com,
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
        public.COMUNIDAD.estado_registro 
        ;  
END;
$$ LANGUAGE plpgsql;

-- Sentencias de apoyo SQL
SELECT * FROM fn_insertar_comunidad(
    'La Paz',               -- Departamento
    'Murillo',    -- provincia
    'Municipio de La Paz',   -- Municipio
    'Comunidad Murillista',     -- nombreCom
    ST_GeomFromText('POINT(-68.1193 -16.5003)', 4326),   -- ubicacion_geoRef_Com
    'Administrador',              -- usuario
    'Activo'                 -- estado
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
    v_ubicacion_geoRef_Com geometry(Point, 4326)
)
RETURNS TABLE(
    id_comunidad INT,
    Departamento VARCHAR(15),
    provincia VARCHAR(100),
    Municipio VARCHAR(100),    
    nombreCom VARCHAR(100),
    ubicacion_geoRef_Com geometry(Point, 4326)
) AS $$
BEGIN
    RETURN QUERY
    UPDATE public.COMUNIDAD
    SET 
        Departamento = v_Departamento,  
        provincia = v_provincia,
        Municipio = v_Municipio,
        nombreCom = v_nombreCom,
        ubicacion_geoRef_Com = v_ubicacion_geoRef_Com
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
SELECT * FROM fn_actualizar_comunidad(2,'CHUQUISACA','SUCRE','MUNICIPIPO SUCRE','COMUNIDAD CHUQUISACA', ST_GeomFromText('POINT(-68.1193 -16.5003)', 4326));


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