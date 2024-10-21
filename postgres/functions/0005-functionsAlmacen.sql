--------------------------------------------------------------------------
-- Creado: Ruddy Cruz    Fecha: 03/10/2024                           --
-- Actividad:                                                           --
-- Funcion que inserta un nuevo almacen                                 --
------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_insertar_almacen(
    v_nombre_almacen VARCHAR(20),
    v_direccion_almacen VARCHAR(200),
    v_capacidad_unid INTEGER,
    v_usuario_creacion VARCHAR(20),
    v_estado_registro VARCHAR(15)
) 
RETURNS TABLE (
    id_almacen INT,
    nombre_almacen VARCHAR(20),
    ubicacion_geoRef_Alm geometry(Point, 4326),
    direccion_almacen VARCHAR(200),
    capacidad_unid INTEGER,
    fecha_creacion TIMESTAMP WITH TIME ZONE,
    fecha_modificacion TIMESTAMP WITH TIME zone,
    usuario_creacion VARCHAR(20),
    estado_registro VARCHAR(15)
) AS $$
BEGIN
    RETURN QUERY
    INSERT INTO public.ALMACEN (
        nombre_almacen,
        direccion_almacen, 
        capacidad_unid, 
        usuario_creacion, 
        estado_registro
    )
    VALUES (
        v_nombre_almacen, 
        v_direccion_almacen, 
        v_capacidad_unid, 
        v_usuario_creacion, 
        v_estado_registro
    )
    RETURNING 
        public.ALMACEN.id_almacen,
        public.ALMACEN.nombre_almacen, 
        public.ALMACEN.ubicacion_geoRef_Alm, 
        public.ALMACEN.direccion_almacen, 
        public.ALMACEN.capacidad_unid,
		public.ALMACEN.fecha_creacion,
        public.ALMACEN.fecha_modificacion,
        public.ALMACEN.usuario_creacion,
		public.ALMACEN.estado_registro 
        ;  
END;
$$ LANGUAGE plpgsql;

-- Sentencias de apoyo SQL
SELECT * FROM fn_insertar_almacen(
    'Almacen002',               -- cod_Almacen
    'Z/Principal C/Uno N/2222',    -- direccion_almacen
     1000,                         -- capacidad_unid
    'Activo',                   -- estado
    'Administrador'              -- usuario
);


--------------------------------------------------------------------------
-- Creado: Ruddy Cruz    Fecha: 03/10/2024                           --
-- Actividad:                                                           --
-- Funcion que listar todas los almacenes                                --
------------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_listar_almacenes()
RETURNS TABLE (
    numero_registro BIGINT,
    id_almacen INT,
    nombre_almacen VARCHAR(20),
    direccion_almacen VARCHAR(200),
    capacidad_unid INTEGER,
    estado_registro VARCHAR(15)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ROW_NUMBER() OVER (ORDER BY a.id_almacen ASC) AS numero_registro,
        a.id_almacen,
        a.nombre_almacen,
        a.direccion_almacen,
        a.capacidad_unid,
        a.estado_registro
    FROM 
        public.ALMACEN a;
END;
$$ LANGUAGE plpgsql;

-- Sentencia de Apoyo
SELECT * FROM fn_listar_almacenes();


--------------------------------------------------------------------------
-- Creado: Ruddy Cruz    Fecha: 03/10/2024                           --
-- Actividad:                                                           --
-- Funcion que actualiza almacen                                  --
------------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_actualizar_almacen(
    v_id_almacen INT,
    v_nombre_almacen VARCHAR(20),
    v_direccion_almacen VARCHAR(200),
    v_capacidad_unid INTEGER
)
RETURNS TABLE(
    id_almacen INT, 
    nombre_almacen VARCHAR(20),
    direccion_almacen VARCHAR(200),
    capacidad_unid INTEGER
) AS $$
BEGIN
    RETURN QUERY
    UPDATE public.ALMACEN
    SET 
        nombre_almacen = v_nombre_almacen,  
        direccion_almacen = v_direccion_almacen,
        capacidad_unid = v_capacidad_unid
    WHERE almacen.id_almacen = v_id_almacen
    RETURNING 
        almacen.id_almacen, 
        almacen.nombre_almacen, 
        almacen.direccion_almacen, 
        almacen.capacidad_unid; 
END;
$$ LANGUAGE plpgsql;

-- Sentencia de Apoyo
SELECT * FROM fn_actualizar_almacen(2,'Nuevo Código','Nueva Dirección', 2000);


--------------------------------------------------------------------------
-- Creado: Ruddy Cruz    Fecha: 03/10/2024                           --
-- Actividad:                                                           --
-- Funcion que elimina una almacen                     --
------------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_eliminar_almacen(v_id_almacen INT)
RETURNS VOID AS $$
BEGIN
    DELETE FROM public.ALMACEN WHERE ALMACEN.id_almacen = v_id_almacen;  
END;
$$ LANGUAGE plpgsql;

-- Sentencia de apoyo (no muestra nada)
SELECT fn_eliminar_almacen(1); -- Cambia 1 por el ID del almacén que deseas eliminar