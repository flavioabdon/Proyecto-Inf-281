--------------------------------------------------------------------------
-- Creado: Flavio Condori    Fecha: 18/9/2024                           --
-- Actividad:                                                           --
-- Script creación de las tablas:Mensajes, usuario, comunidad,artesano  --
-- cliente, delivery                                                    --
------------------------------------------------------------------

--------------------------------------------------------------------------
-- Modificado: Ruddy Cruz    Fecha: 19/9/2024                           --
-- Actividad:                                                           --
-- * Verificacion codificacion UTF8 de la BD.								--
-- * Modificacion de la tabla USUARIO para añadir seguridad HASH y SAL y 	--
--   el campo ROL															--
-- * Creacion de nuevas tablas:.------
-- * Eliminacion del campo codigo_usuario de las tablas: ARTESANO, 
--   CLIENTE y DELIVERY                                     			    --
------------------------------------------------------------------


--crear la base de datos con codificacion UTF8 para caracteres especiales en español
CREATE DATABASE bd281_GIT WITH ENCODING 'UTF8';

--Verificar la codificacion UTF8
SELECT datname, pg_encoding_to_char(encoding)
FROM pg_database
WHERE datname = 'bd281_GIT';

--Setear zona horaria del servidor
SET TIME ZONE 'America/La_Paz';

--crear las tablas
CREATE TABLE public.MENSAJES(
    id_mensajes SERIAL PRIMARY KEY,  -- ID autoincrementable y clave primaria
    "to" VARCHAR(255) NOT NULL,      -- Campo para el destinatario
    subject VARCHAR(255) NOT NULL,   -- Campo para el asunto
    message TEXT NOT NULL,           -- Campo para el mensaje
    fecha_creacion TIMESTAMPTZ ,  -- Fecha de creación con valor por defecto
    fecha_modificacion TIMESTAMPTZ  -- Fecha de modificación con valor por defecto
);


CREATE TABLE IF NOT EXISTS public.USUARIO (
    id_usuario SERIAL PRIMARY KEY,
    codigo_Usuario character varying(20) UNIQUE NOT NULL,  --sera generado a partir del nombre-apellido o ci del usuario
    nombre character varying(30),
    apellido character varying(50),
    email character varying(30) UNIQUE,	--el email es unico por cada usuario
    numero_Contacto VARCHAR(12),	
    --contraseña character varying(20), reemplazamos este campo para añadir seguridad HASH y sal con los sig 2 campos
    hash_contrasena BYTEA NOT NULL,  -- Almacena el hash de la contraseña
    sal BYTEA NOT NULL,              -- Almacena la sal utilizada
    ci character varying(15),
    sexo character varying(3),
    fotoPerf_url character varying(200),
    rol character varying(20) NOT NULL,  -- Ejemplo: 'ADMINISTRADOR', 'ARTESANO', 'CLIENTE', 'DELIVERY'
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_creacion character varying(20),
    usuario_modificacion character varying(20),
    estado_registro character varying(15)
);

CREATE TABLE IF NOT EXISTS public.PERMISO (
    id_permiso SERIAL PRIMARY KEY,
    rol character varying(20) NOT NULL,   -- Rol al que se asigna el permiso: 'ADMINISTRADOR', 'ARTESANO', 'CLIENTE', 'DELIVERY'
    recurso character varying(50) NOT NULL,  -- Ejemplo: 'dashboard_usuarios'
    accion character varying(50) NOT NULL,   -- Ejemplo: 'ver', 'editar', 'borrar'
    UNIQUE (rol, recurso, accion)            -- Asegura que no se repitan combinaciones
);

CREATE EXTENSION postgis;	-- es necesario añadir la extension postgis en el postgresql y luego ejecutar esta linea 

CREATE TABLE IF NOT EXISTS public.COMUNIDAD (
    id_comunidad SERIAL PRIMARY KEY,
    --codigo_comunidad character varying(20) UNIQUE NOT NULL, 
    Departamento character varying(15),
    provincia character varying(100),
    Municipio character varying(100),
    nombreCom character varying(100),
    ubicacion_geoRef_Com geometry(Point, 4326) DEFAULT ST_SetSRID(ST_MakePoint(-68.1193, -16.5000), 4326), --requiere postgis añadido
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_creacion character varying(20),
    usuario_modificacion character varying(20),
    estado_registro character varying(15)
);

CREATE TABLE IF NOT EXISTS public.ADMINISTRADOR (
    id_usuario SERIAL PRIMARY KEY,
    --codigo_Usuario VARCHAR(20) NOT NULL UNIQUE,  -- sera generado a partir del nombre-apellido o ci del usuario
    descripcion_Admin VARCHAR(100),
    nivel_acceso INTEGER,                         -- Puedes añadir un campo para definir el nivel de acceso
    CONSTRAINT fk_administrador_usuario FOREIGN KEY (id_usuario)
        REFERENCES public.USUARIO (id_usuario)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_creacion character varying(20),
    usuario_modificacion character varying(20),
    estado_registro character varying(15)
);

CREATE TABLE IF NOT EXISTS public.ARTESANO (
    id_usuario SERIAL PRIMARY KEY,
    --codigo_Usuario VARCHAR(20) NOT NULL,
    especialidad_Artesano VARCHAR(50),
    id_comunidad INTEGER NOT NULL,
    CONSTRAINT fk_artesano_usuario FOREIGN KEY (id_usuario)
        REFERENCES public.USUARIO (id_usuario)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_artesano_comunidad FOREIGN KEY (id_comunidad)
        REFERENCES public.COMUNIDAD (id_comunidad)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_creacion character varying(20),
    usuario_modificacion character varying(20),
    estado_registro character varying(15)
);

CREATE TABLE IF NOT EXISTS public.CLIENTE (
    id_usuario SERIAL PRIMARY KEY,
    --codigo_Usuario VARCHAR(20) NOT NULL,
    direccion_Envio VARCHAR(200),
    ubicacion_geoRef_Cli geometry(Point, 4326) DEFAULT ST_SetSRID(ST_MakePoint(-68.1193, -16.5000), 4326),
    CONSTRAINT fk_cliente_usuario FOREIGN KEY (id_usuario)
        REFERENCES public.USUARIO (id_usuario)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_creacion character varying(20),
    usuario_modificacion character varying(20),
    estado_registro character varying(15)
);

CREATE TABLE IF NOT EXISTS public.DELIVERY (
    id_usuario SERIAL PRIMARY KEY,
    --codigo_Usuario VARCHAR(20) NOT NULL,
    tipo_vehiculo VARCHAR(50),
    matricula_vehiculo VARCHAR(10),	--**AÑADIR UBICACION GEO REF
    CONSTRAINT fk_delivery_usuario FOREIGN KEY (id_usuario)
        REFERENCES public.usuario (id_usuario)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_creacion character varying(20),
    usuario_modificacion character varying(20),
    estado_registro character varying(15)
);


CREATE TABLE IF NOT EXISTS public.RED_SOCIAL (
    id_redSocial SERIAL PRIMARY KEY,
    nombre VARCHAR(50),
    urlPerfil character varying(200),
    tipoDeRedSocial character varying(50),
    id_usuario INTEGER NOT NULL,	--referencia al usuario ARTESANO
    CONSTRAINT fk_redSocial_artesano FOREIGN KEY (id_usuario)
        REFERENCES public.ARTESANO (id_usuario)
        ON UPDATE CASCADE
        ON DELETE CASCADE, 
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,		--En el diagramaER esta como fechaReg
    fecha_modificacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_creacion character varying(20),
    usuario_modificacion character varying(20),
    estado_registro character varying(15)
);


CREATE TABLE IF NOT EXISTS public.EVENTOS_NOTICIAS (
    id_evento SERIAL PRIMARY KEY,
    fecha_Ini TIMESTAMP WITH TIME ZONE NOT NULL,
    fecha_Fin TIMESTAMP WITH TIME ZONE NOT null,
    contenido TEXT,  				 -- Para la descripción larga del evento
    url_Imag_Evento VARCHAR(255), 	 -- Almacenar la ruta o URL de la imagen
    id_usuario INTEGER NOT NULL,	 --referencia al usuario ARTESANO
    CONSTRAINT fk_eventosNoticias_artesano FOREIGN KEY (id_usuario)
        REFERENCES public.ARTESANO (id_usuario)
        ON UPDATE CASCADE
        ON DELETE CASCADE, 
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,		
    fecha_modificacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_creacion character varying(20),
    usuario_modificacion character varying(20),
    estado_registro character varying(15)
);


CREATE TABLE IF NOT EXISTS public.PEDIDO (
    id_pedido SERIAL PRIMARY KEY,				--** nroPedido
    direccion_Envio VARCHAR(255) NOT NULL,
    costo_Pedido DECIMAL(10, 2) NOT NULL,
    costo_envio DECIMAL(10, 2) NOT NULL,
    distancia DECIMAL(10, 2),            
    id_usuario INTEGER NOT NULL,	--referencia al usuario CLIENTE
    CONSTRAINT fk_pedido_cliente FOREIGN KEY (id_usuario)
        REFERENCES public.CLIENTE (id_usuario)
        ON UPDATE CASCADE
        ON DELETE CASCADE, 
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,		--
    fecha_modificacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_creacion character varying(20),
    usuario_modificacion character varying(20),
    estado_registro character varying(15)
);


CREATE TABLE IF NOT EXISTS public.ENVIO (
    id_envio SERIAL PRIMARY KEY,
    num_tracking VARCHAR(50) NOT NULL,		--generado RR123456789BO
    estado VARCHAR(50) NOT NULL,	--(en almacen, recibido por delivery, en camino, entregado, ...).
    fecha_estado TIMESTAMP WITH TIME ZONE NOT NULL,
    tipo_envio VARCHAR(30) NOT NULL,	--(urgente, estándar, express).
    id_usuario INTEGER NOT NULL,	--referencia al usuario DELIVERY
    id_pedido INTEGER NOT NULL,		--referencia al tabla PEDIDO
    CONSTRAINT fk_envio_delivery FOREIGN KEY (id_usuario)
        REFERENCES public.DELIVERY (id_usuario)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_envio_pedido FOREIGN KEY (id_pedido)
        REFERENCES public.PEDIDO (id_pedido)
        ON UPDATE CASCADE
        ON DELETE CASCADE, 
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,		--
    fecha_modificacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_creacion character varying(20),
    usuario_modificacion character varying(20),
    estado_registro character varying(15)
);


CREATE TABLE IF NOT EXISTS public.PAGO_TRANSACCION (
	id_pago SERIAL PRIMARY KEY,
    codigo_Pago VARCHAR(50) NOT NULL,
    estado_Pago VARCHAR(20) NOT NULL,	--Ej: (PENDIENTE/COMPLETADO/ERROR_PAGO)
    metodo_Pago VARCHAR(20) NOT NULL,	--Ej: (EFECTIVO/TARJETA/QR)
    --fecha_Pago TIMESTAMP WITH TIME ZONE default  CURRENT_TIMESTAMP, 
    monto DECIMAL(10, 2) NOT NULL,          -- Monto total del pago
    referencia VARCHAR(50),                  -- Referencia externa ej: (PAY_12345, VISA_123456, ...)
    id_usuario INTEGER NOT NULL,	--referencia al usuario CLIENTE
    id_pedido INTEGER NOT NULL,
    CONSTRAINT fk_pagoTransaccion_cliente FOREIGN KEY (id_usuario)
        REFERENCES public.CLIENTE (id_usuario)
        ON UPDATE CASCADE
        ON DELETE CASCADE, 
    CONSTRAINT fk_pagoTransaccion_pedido FOREIGN KEY (id_pedido)
        REFERENCES public.PEDIDO (id_pedido)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT  CURRENT_TIMESTAMP, 	--**ES LO MISMO Q fecha_Pago 
    fecha_modificacion TIMESTAMP WITH TIME ZONE default CURRENT_TIMESTAMP,
    usuario_creacion character varying(20),
    usuario_modificacion character varying(20),
    estado_registro character varying(15)
);

CREATE TABLE IF NOT EXISTS public.ALMACEN (
    id_almacen SERIAL PRIMARY KEY,
    cod_Almacen VARCHAR(20) NOT NULL,	--sera generado a partir del id_usuario, nombre o ci
    ubicacion_geoRef_Alm geometry(Point, 4326) DEFAULT ST_SetSRID(ST_MakePoint(-68.1193, -16.5000), 4326), --requiere postgis añadido
    direccion_almacen VARCHAR(200) NOT NULL,
    capacidad_unid INTEGER NOT NULL,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,		--
    fecha_modificacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_creacion character varying(20),
    usuario_modificacion character varying(20),
    estado_registro character varying(15)
);

CREATE TABLE IF NOT EXISTS public.CATEGORIA (
    id_categoria SERIAL PRIMARY KEY,
    url_icon_Categoria VARCHAR(255), 	 -- Almacenar la ruta o URL del icono
    descripcion TEXT,  				 -- Para la descripción de la categoria
    nombre_Categoria VARCHAR(100),
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,		--
    fecha_modificacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_creacion character varying(20),
    usuario_modificacion character varying(20),
    estado_registro character varying(15)
);

CREATE TABLE IF NOT EXISTS public.PRODUCTO_ARTESANAL (
    id_Prod SERIAL PRIMARY KEY,
    nombre_Prod VARCHAR(100) not NULL,
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    precio DECIMAL(10, 2) NOT NULL,
    descuento_porcent DECIMAL(10, 2) NOT NULL,
    ruta_imagen VARCHAR(255), 	 -- Almacenar la ruta o URL de la imagen del producto
    descripcion_Prod text not NULL,  				 -- Para la descripción del producto
    politica_de_Envio VARCHAR(100) not NULL,
    peso_kg DECIMAL(10, 2) NOT NULL,
    stock INTEGER not null,
    informacion_Adicional VARCHAR(100) not NULL, 	--Ej (Talla, Color, Material, ...)
    id_usuario INTEGER NOT NULL,	--referencia al usuario ARTESANO
    id_pedido INTEGER NOT NULL,	
    id_almacen INTEGER NOT NULL,
    id_categoria INTEGER NOT NULL,
    CONSTRAINT fk_productoArtesanal_artesano FOREIGN KEY (id_usuario)
        REFERENCES public.ARTESANO (id_usuario)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_productoArtesanal_pedido FOREIGN KEY (id_pedido)
        REFERENCES public.PEDIDO (id_pedido)					--**REVISAR
        ON UPDATE CASCADE
        ON DELETE CASCADE, 
    CONSTRAINT fk_productoArtesanal_almacen FOREIGN KEY (id_almacen)
        REFERENCES public.ALMACEN (id_almacen)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
        CONSTRAINT fk_productoArtesanal_categoria FOREIGN KEY (id_categoria)
        REFERENCES public.CATEGORIA (id_categoria)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,		--
    fecha_modificacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_creacion character varying(20),
    usuario_modificacion character varying(20),
    estado_registro character varying(15)
);

CREATE TABLE IF NOT EXISTS public.IMAGEN_PRODUCTO (
    id_ImagenProd SERIAL PRIMARY KEY,
    url_Imag_Prod VARCHAR(255) not null, 	 -- Almacenar la ruta o URL de la imagen
    orden_reelevancia INTEGER not null,
    descripcionImagProd VARCHAR(255) not null,
    id_Prod INTEGER NOT NULL,	 --referencia al PRODUCTO_ARTESANAL
    CONSTRAINT fk_imagenProducto_productoArtesanal FOREIGN KEY (id_Prod)
        REFERENCES public.PRODUCTO_ARTESANAL (id_Prod)
        ON UPDATE CASCADE
        ON DELETE CASCADE, 
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,		
    fecha_modificacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_creacion character varying(20),
    usuario_modificacion character varying(20),
    estado_registro character varying(15)
);

SHOW default_transaction_read_only;
SET default_transaction_read_only = off;
SELECT pg_is_in_recovery();




