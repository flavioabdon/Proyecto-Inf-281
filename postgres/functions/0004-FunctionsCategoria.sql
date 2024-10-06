--------------------------------------------------------------------------
-- Creado: Christian Medrano    Fecha: 29/9/2024                           --
-- Actividad:                                                           --
-- Funcion que inserta una nueva Categoria                                 --
------------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_insertar_categoria(
    nombreCategoria VARCHAR(100),
    descripcionCategoria TEXT,
    iconoCategoria VARCHAR(255),
    estado VARCHAR(15),
    usuario VARCHAR(20)
) 
RETURNS TABLE (
    id_categoria INT,
    nombre_Categoria VARCHAR(100),
    descripcion TEXT,
    url_icon_Categoria VARCHAR(255),
    estado_registro VARCHAR(15),
    usuario_creacion VARCHAR(20),
    fecha_creacion TIMESTAMP WITH TIME ZONE,
    fecha_modificacion TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    INSERT INTO public.CATEGORIA (
        nombre_Categoria, 
        descripcion, 
        url_icon_Categoria, 
        estado_registro, 
        usuario_creacion
    )
    VALUES (
        nombreCategoria, 
        descripcionCategoria, 
        iconoCategoria, 
        estado, 
        usuario
    )
    RETURNING 
        public.CATEGORIA.id_categoria,  -- Usar el nombre de la tabla para evitar ambigüedad
        public.CATEGORIA.nombre_Categoria, 
        public.CATEGORIA.descripcion, 
        public.CATEGORIA.url_icon_Categoria, 
        public.CATEGORIA.estado_registro, 
        public.CATEGORIA.usuario_creacion, 
        public.CATEGORIA.fecha_creacion,
        public.CATEGORIA.fecha_modificacion;  
END;
$$ LANGUAGE plpgsql;

-- Sentecias de apoyo SQL
SELECT * FROM fn_insertar_categoria(
    'Nueva Categoría',           -- nombreCategoria
    'Descripción de la categoría', -- descripcionCategoria
    'url/al/icono.png',         -- iconoCategoria
    'Activo',                   -- estado
    'UsuarioAdmin'              -- usuario
);


--------------------------------------------------------------------------
-- Creado: Christian Medrano    Fecha: 29/9/2024                           --
-- Actividad:                                                           --
-- Funcion que listar todas las categorias                                --
------------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_listar_categorias()
RETURNS TABLE (
    numero_registro BIGINT,
    id_categoria INT,
    nombre_categoria VARCHAR(100),
    descripcion TEXT,
    url_icon_categoria VARCHAR(255),
    estado_registro VARCHAR(15)  
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ROW_NUMBER() OVER (ORDER BY c.id_categoria ASC) AS numero_registro,
        c.id_categoria,
        c.nombre_Categoria,
        c.descripcion,
        c.url_icon_Categoria,
        c.estado_registro
    FROM 
        public.CATEGORIA c;
END;
$$ LANGUAGE plpgsql;


-- Sentencia de Apoyo
SELECT * FROM fn_listar_categorias();

--------------------------------------------------------------------------
-- Creado: Christian Medrano    Fecha: 29/9/2024                           --
-- Actividad:                                                           --
-- Funcion que actualiza una categoria                               --
------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_actualizar_categoria(
    p_id_categoria INT,
    p_nombre_categoria VARCHAR,
    p_descripcion TEXT,  
    p_url_icon_categoria VARCHAR
)
RETURNS TABLE(
    id_categoria INT, 
    nombre_categoria VARCHAR, 
    descripcion TEXT,  
    url_icon_categoria VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    UPDATE categoria
    SET 
        nombre_categoria = p_nombre_categoria,  
        descripcion = p_descripcion,
        url_icon_categoria = p_url_icon_categoria
    WHERE categoria.id_categoria = p_id_categoria
    RETURNING 
        categoria.id_categoria, 
        categoria.nombre_categoria, 
        categoria.descripcion, 
        categoria.url_icon_categoria; 
END;
$$ LANGUAGE plpgsql;

-- Sentencia de Apoyo
SELECT * FROM fn_actualizar_categoria(1, 'Nuevo Nombre', 'Nueva Descripción', 'url/nuevo_icono.png');

--------------------------------------------------------------------------
-- Creado: Christian Medrano    Fecha: 29/9/2024                           --
-- Actividad:                                                           --
-- Funcion que elimina una categoria                               --
------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_eliminar_categoria(p_id_categoria INT)
RETURNS VOID AS $$
BEGIN
    DELETE FROM categoria WHERE id_categoria = p_id_categoria;  
END;
$$ LANGUAGE plpgsql;

-- Sentencia de apoyo(no muestra nada)
SELECT fn_eliminar_categoria(58);