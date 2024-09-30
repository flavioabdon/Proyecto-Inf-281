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