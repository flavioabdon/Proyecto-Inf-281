--------------------------------------------------------------------------
-- Creado: Flavio Condori    Fecha: 18/9/2024                           --
-- Actividad:                                                           --
-- Script creación de las tablas:Mensajes, usuario, comunidad,artesano  --
-- cliente, delivery                                                    --
------------------------------------------------------------------

--setear zona horaria del servidor
SET TIME ZONE 'America/La_Paz';

--crear las tablas
CREATE TABLE public.mensajes (
    id SERIAL PRIMARY KEY,           -- ID autoincrementable y clave primaria
    "to" VARCHAR(255) NOT NULL,     -- Campo para el destinatario
    subject VARCHAR(255) NOT NULL,   -- Campo para el asunto
    message TEXT NOT NULL,           -- Campo para el mensaje
    fecha_creacion TIMESTAMPTZ ,  -- Fecha de creación con valor por defecto
    fecha_modificacion TIMESTAMPTZ  -- Fecha de modificación con valor por defecto
);
CREATE TABLE IF NOT EXISTS public.usuario (
    id SERIAL PRIMARY KEY,
    codigo_Usuario character varying(20) UNIQUE NOT NULL,
    nombre character varying(30),
    apellido character varying(50),
    email character varying(30) UNIQUE,
    numero_Contacto VARCHAR(12),
    contraseña character varying(20),
    ci character varying(15),
    sexo character varying(3),
    fotoPerf_url character varying(200),
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_creacion character varying(20),
    usuario_modificacion character varying(20),
    estado_registro character varying(15)
);
CREATE TABLE IF NOT EXISTS public.comunidad (
    id SERIAL PRIMARY KEY,
    codigo_comunidad character varying(20) UNIQUE NOT NULL,
    Departamento character varying(15),
    provincia character varying(100),
    Municipio character varying(100),
    nombreCom character varying(100),
    ubicacion_geoRef_Com geometry(Point, 4326) DEFAULT ST_SetSRID(ST_MakePoint(-68.1193, -16.5000), 4326),
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_creacion character varying(20),
    usuario_modificacion character varying(20),
    estado_registro character varying(15)
);

CREATE TABLE IF NOT EXISTS public.artesano (
    id SERIAL PRIMARY KEY,
    codigo_Usuario VARCHAR(20) NOT NULL,
    especialidad_Artesano VARCHAR(50),
    codigo_comunidad character varying(20),
    CONSTRAINT fk_artesano_usuario FOREIGN KEY (codigo_Usuario)
        REFERENCES public.usuario (codigo_Usuario)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_artesano_comunidad FOREIGN KEY (codigo_comunidad)
        REFERENCES public.comunidad (codigo_comunidad)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_creacion character varying(20),
    usuario_modificacion character varying(20),
    estado_registro character varying(15)
);

CREATE TABLE IF NOT EXISTS public.cliente (
    id SERIAL PRIMARY KEY,
    codigo_Usuario VARCHAR(20) NOT NULL,
    direccion_Envio VARCHAR(100),
    ubicacion_geoRef_Cli geometry(Point, 4326) DEFAULT ST_SetSRID(ST_MakePoint(-68.1193, -16.5000), 4326),
    CONSTRAINT fk_codigo_usuario_cliente FOREIGN KEY (codigo_Usuario)
        REFERENCES public.usuario (codigo_Usuario)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_creacion character varying(20),
    usuario_modificacion character varying(20),
    estado_registro character varying(15)
);

CREATE TABLE IF NOT EXISTS public.delivery (
    id SERIAL PRIMARY KEY,
    codigo_Usuario VARCHAR(20) NOT NULL,
    tipo_vehiculo VARCHAR(50),
    matricula_vehiculo VARCHAR(10),
    CONSTRAINT fk_codigo_usuario_delivery FOREIGN KEY (codigo_Usuario)
        REFERENCES public.usuario (codigo_Usuario)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_creacion character varying(20),
    usuario_modificacion character varying(20),
    estado_registro character varying(15)
);