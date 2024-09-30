--------------------------------------------------------------------------
-- Creado: Christian Medrano    Fecha: 29/9/2024                           --
-- Actividad:                                                           --
-- Funcion que listar todas las categorias                                --
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

