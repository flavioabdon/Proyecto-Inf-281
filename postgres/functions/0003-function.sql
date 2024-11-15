--------------------------------------------------------------------------
-- Creado: Flavio Condori    Fecha: 18/9/2024                           --
-- Actividad:                                                           --
-- Script                                                               --
--                                                                      --
------------------------------------------------------------------
--------------------------------------------------------------------------
-- Modificado: Ruddy Cruz    Fecha: 27/9/2024                           --
-- Actividad:                                                           --				
-- * Modificacion de la fucion: fn_verificar_codigo	(cambiar el estado  --
--   de pendiente a activo) el cliente y el usuario comparten id_usuario--
--   por la logica de especializacion   lineas 155-157                  --
------------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_verificar_codigo(data JSON)
RETURNS JSON AS $$
DECLARE
    v_correo TEXT;
    v_codigo TEXT;
    v_existe BOOLEAN;
    v_usuario JSON;
BEGIN
    -- Extraer los valores del JSON
    v_correo := data->>'emailVerificacion';
    v_codigo := data->>'codigoVerificacion';

    -- Verificar si existe el correo y el código en la tabla mensajes
    SELECT EXISTS (
        SELECT 1 
        FROM mensajes m 
        WHERE m.to = v_correo 
          AND m.message = 'Codigo:' || v_codigo
    ) INTO v_existe;

    IF v_existe THEN
        -- Cambiar el estado de pendiente a activo
        UPDATE usuario 
        SET estado_registro = 'activo'
        WHERE email = v_correo;

        UPDATE cliente c 
        SET estado_registro = 'activo'
        WHERE c.id_usuario = (
            SELECT u.id_usuario 
            FROM usuario u 
            WHERE u.email = v_correo
        );

        -- Obtener los datos del usuario
        SELECT row_to_json(u) 
        INTO v_usuario
        FROM usuario u
        WHERE u.email = v_correo;

        -- Retornar un JSON de éxito junto con los datos del usuario
        RETURN json_build_object(
            'status', 'success',
            'message', 'Código verificado correctamente.',
            'usuario', v_usuario
        );
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