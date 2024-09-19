--------------------------------------------------------------------------
-- Creado: Flavio Condori    Fecha: 18/9/2024                           --
-- Actividad:                                                           --
-- Script                                                               --
--                                                                      --
------------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_verificar_codigo(data JSON)
RETURNS JSON AS $$
DECLARE
    v_correo TEXT;
    v_codigo TEXT;
    v_existe BOOLEAN;
BEGIN
    -- Extraer los valores del JSON
    v_correo := data->>'emailVerificacion';
    v_codigo := data->>'codigoVerificacion';

    -- Verificar si existe el correo y el código en la tabla usuarios
    SELECT EXISTS (
		select 1 from "Messages" m 
		where m.to = v_correo and m.message = 'Codigo:' || v_codigo
    ) INTO v_existe;

    IF v_existe THEN
	 	-- Cambiar el estado de pendiente a activo
		update  usuario set estado_registro='activo'
		where email= v_correo;

        -- Retornar un JSON de éxito si el correo y el código son válidos
        RETURN json_build_object('status', 'success', 'message', 'Código verificado correctamente.');
    ELSE
        -- Retornar un JSON de error si el correo o el código no son válidos
        RETURN json_build_object('status', 'error', 'message', 'Correo o código incorrecto.');
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        -- En caso de error, retornar un JSON con el error
        RETURN json_build_object('status', 'error', 'message', SQLERRM);
END;
$$ LANGUAGE plpgsql;

-- Sentencia de apoyo

SELECT fn_verificar_codigo('{"emailVerificacion": "flaviocondori@gmail.com", "codigoVerificacion": "2952"}'::json);
