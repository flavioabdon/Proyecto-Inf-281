-----------------------------------------------------------------------------
-- Creado: Flavio Condori    Fecha: 10/10/2024                             --
-- Actividad: ELIMINAR LAS FUNCIONES CREADAS                               --
-- 1. Codigo que mustra las funciones que estan en el esquema public       --
-- 2. Codigo que elimina las funciones del esquema public                  --
-----------------------------------------------------------------------------

-- 1. Listar todas las funciones que empiezan con fn_ en el esquema public
SELECT 'DROP FUNCTION IF EXISTS ' || n.nspname || '.' || proname || '(' || oidvectortypes(proargtypes) || ');'
FROM pg_proc p
LEFT JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' --Modificar Esquema
AND p.proname LIKE 'fn_%'; --Funciones que comienzan con fn_

-- 2.  Eliminar las funciones que empiezan con fn_ en el esquema public
DO
$$
DECLARE
    r RECORD;
BEGIN
   -- Eliminar todas las funciones que empiezan con fn_ en el esquema public
   FOR r IN 
       SELECT n.nspname, proname, oidvectortypes(proargtypes) AS args
       FROM pg_proc p
       LEFT JOIN pg_namespace n ON p.pronamespace = n.oid
       WHERE n.nspname = 'public'
       AND p.proname LIKE 'fn_%'
   LOOP
       EXECUTE 'DROP FUNCTION IF EXISTS ' || r.nspname || '.' || r.proname || '(' || r.args || ');';
   END LOOP;
END
$$;