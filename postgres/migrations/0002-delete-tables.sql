--------------------------------------------------------------------------
-- Creado: Flavio Condori    Fecha: 10/10/2024                             --
-- Actividad: ELIMINAR LAS TABLAS CREADAS                                  --
-- 1. Codigo que mustra las tablas que estan en el esquema public          --
-- 2. Codigo que elimina las tablas del esquema public                     --
------------------------------------------------------------------

-- Listar todas las tablas del esquema public
SELECT 'Table: ' || schemaname || '.' || tablename
FROM pg_tables
WHERE schemaname = 'public';

-- Eliminar todas las tablas del esquema public
--	Eliminación segura: se omiten tablas protegidas por extensiones como postgis
do
$$
DECLARE
    r RECORD;
BEGIN
   -- Eliminar todas las tablas del esquema public excepto las de la extensión postgis
   FOR r IN 
       SELECT tablename
       FROM pg_tables
       WHERE schemaname = 'public'
       AND tablename NOT IN ('spatial_ref_sys')  -- Excluir tablas de la extensión postgis
   LOOP
       EXECUTE 'DROP TABLE IF EXISTS public.' || r.tablename || ' CASCADE;';
   END LOOP;
END
$$;