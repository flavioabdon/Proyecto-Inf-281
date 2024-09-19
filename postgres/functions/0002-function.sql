--------------------------------------------------------------------------
-- Creado: Flavio Condori    Fecha: 18/9/2024                           --
-- Actividad:                                                           --
-- Script creación de las tablas:Mensajes, usuario, comunidad,artesano  --
-- cliente, delivery                                                    --
------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_guardar_mensaje(data JSON)
RETURNS JSON AS $$
DECLARE
    v_to TEXT;
    v_subject TEXT;
    v_message TEXT;
BEGIN
    -- Extraer los valores del JSON
    v_to := data->>'to';
    v_subject := data->>'subject';
    v_message := data->>'message';

    -- Insertar el mensaje en la tabla Messages
    INSERT INTO public.mensajes ("to", subject, message, "fecha_creacion")
    VALUES (v_to, v_subject, v_message, NOW());

    -- Retornar un JSON de éxito
    RETURN json_build_object('status', 'success', 'message', 'Mensaje guardado correctamente.');
EXCEPTION
    WHEN OTHERS THEN
        -- En caso de error, retornar un JSON con el error
        RETURN json_build_object('status', 'error', 'message', SQLERRM);
END;
$$ LANGUAGE plpgsql;

--sentencias de ayoyo
SELECT fn_guardar_mensaje('{
    "to": "test@mail.com",
    "subject": "subject",	
    "message": "mensaje"
}');