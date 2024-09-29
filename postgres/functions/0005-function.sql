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