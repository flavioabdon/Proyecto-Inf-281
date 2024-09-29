
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
