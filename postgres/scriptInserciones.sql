
-- ====================================
-- EXTENSIÓN Y ZONA HORARIA
-- ====================================
CREATE EXTENSION postgis;	
SET TIME ZONE 'America/La_Paz';

-- ====================================
-- TABLA MENSAJES
-- ====================================

CREATE TABLE public.MENSAJES(
    id_mensajes SERIAL PRIMARY KEY,  -- ID autoincrementable y clave primaria
    "to" VARCHAR(255) NOT NULL,      -- Campo para el destinatario
    subject VARCHAR(255) NOT NULL,   -- Campo para el asunto
    message TEXT NOT NULL,           -- Campo para el mensaje
    fecha_creacion TIMESTAMPTZ ,  -- Fecha de creación con valor por defecto
    fecha_modificacion TIMESTAMPTZ  -- Fecha de modificación con valor por defecto
);


-- ====================================
-- TABLA USUARIO
-- ====================================

CREATE TABLE IF NOT EXISTS public.USUARIO (
    id_usuario SERIAL PRIMARY KEY,
    codigo_Usuario character varying(20) UNIQUE NOT NULL,  --sera generado a partir del nombre-apellido o ci del usuario
    nombre character varying(30),
    apellido character varying(50),
    email character varying(30) UNIQUE,	--el email es unico por cada usuario
    numero_Contacto VARCHAR(12),	
    contraseña character varying(255),
    ci character varying(15),
    sexo character varying(20),
    fotoPerf_url character varying(200),
    rol character varying(20) NOT NULL,  -- Ejemplo: 'ADMINISTRADOR', 'ARTESANO', 'CLIENTE', 'DELIVERY'
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_creacion character varying(20),
    usuario_modificacion character varying(20),
    estado_registro character varying(15)
);


-- ====================================
-- TABLA CLIENTE
-- ====================================
CREATE TABLE IF NOT EXISTS public.CLIENTE (
    id_cliente SERIAL PRIMARY KEY,
	id_usuario INTEGER NOT NULL,
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

-- ====================================
-- TABLA ARTESANO 
-- TABLA COMUNIDAD
-- ====================================

-- ====================================
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

CREATE TABLE IF NOT EXISTS public.ARTESANO (
    id_artesano SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL, 
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

-- ====================================
-- TABLA DELIVERY
-- ====================================

CREATE TABLE IF NOT EXISTS public.DELIVERY (
    id_delivery SERIAL PRIMARY KEY,
	id_usuario INTEGER NOT NULL,
    tipo_vehiculo VARCHAR(50),
    matricula_vehiculo VARCHAR(10),	--**AÑADIR UBICACION GEO REF
    CONSTRAINT fk_delivery_usuario FOREIGN KEY (id_usuario)
        REFERENCES public.USUARIO (id_usuario)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_creacion character varying(20),
    usuario_modificacion character varying(20),
    estado_registro character varying(15)
);

-- ====================================
-- TABLA CATEGORIA
-- ====================================

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

-- ====================================
-- TABLA ALMACEN
-- ====================================
CREATE TABLE IF NOT EXISTS public.ALMACEN (
    id_almacen SERIAL PRIMARY KEY,
    nombre_almacen VARCHAR(50) NOT NULL,	
    ubicacion_geoRef_Alm geometry(Point, 4326) DEFAULT ST_SetSRID(ST_MakePoint(-68.1193, -16.5000), 4326), --requiere postgis añadido
    direccion_almacen VARCHAR(200) NOT NULL,
    capacidad_unid INTEGER NOT NULL,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,		--
    fecha_modificacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_creacion character varying(20),
    usuario_modificacion character varying(20),
    estado_registro character varying(15)
);

-- ====================================
-- TABLA PRODUCTO
-- ====================================

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
    id_artesano INTEGER NOT NULL,	--referencia al usuario ARTESANO
    --id_pedido INTEGER NOT NULL,	
    id_almacen INTEGER NOT NULL,
    id_categoria INTEGER NOT NULL,
    CONSTRAINT fk_productoArtesanal_artesano FOREIGN KEY (id_artesano)
        REFERENCES public.ARTESANO (id_artesano)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    --CONSTRAINT fk_productoArtesanal_pedido FOREIGN KEY (id_pedido)
    --    REFERENCES public.PEDIDO (id_pedido)					--**REVISAR
    --    ON UPDATE CASCADE
    --    ON DELETE CASCADE, 
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


-- ====================================
-- TABLA PEDIDO
-- ====================================
CREATE TABLE IF NOT EXISTS public.PEDIDO (
    id_pedido SERIAL PRIMARY KEY,				--** nroPedido
    direccion_Envio VARCHAR(255) NOT NULL,
    costo_Pedido DECIMAL(10, 2) NOT NULL,
    costo_envio DECIMAL(10, 2) NOT NULL,
    distancia DECIMAL(10, 2),            
    id_cliente INTEGER NOT NULL,	--referencia al usuario CLIENTE
    CONSTRAINT fk_pedido_cliente FOREIGN KEY (id_cliente)
        REFERENCES public.CLIENTE (id_cliente)
        ON UPDATE CASCADE
        ON DELETE CASCADE, 
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,		--
    fecha_modificacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_creacion character varying(20),
    usuario_modificacion character varying(20),
    estado_registro character varying(15)
);


-- ====================================
-- TABLA PRODUCTO - PEDIDO
-- ====================================

CREATE TABLE IF NOT EXISTS public.PEDIDO_PRODUCTO (
    id_pedido_producto SERIAL PRIMARY KEY,
    cantidad INTEGER NOT NULL,             -- Cantidad de productos en el pedido
    id_Prod INTEGER NOT NULL,              -- ID del producto
    id_pedido INTEGER NOT NULL,            -- ID del pedido
    latitud DECIMAL(9, 6),                 -- Latitud geográfica
    longitud DECIMAL(9, 6),                -- Longitud geográfica
    -- Restricciones de claves foráneas
    CONSTRAINT fk_pedido_producto_pedido FOREIGN KEY (id_pedido)
        REFERENCES public.PEDIDO (id_pedido)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    
    CONSTRAINT fk_pedido_producto_producto FOREIGN KEY (id_Prod)
        REFERENCES public.PRODUCTO_ARTESANAL (id_Prod)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    -- Campos de control de creación y modificación
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_creacion character varying(20),
    usuario_modificacion character varying(20),
    estado character varying(35)
);

-- ====================================
-- TABLA ENVIO
-- ====================================

CREATE TABLE IF NOT EXISTS public.ENVIO (
    id_envio SERIAL PRIMARY KEY,
    num_tracking VARCHAR(50) NOT NULL,		--generado RR123456789BO
    estado VARCHAR(50) NOT NULL,	--(en almacen, recibido por delivery, en camino, entregado, ...).
    fecha_estado TIMESTAMP WITH TIME ZONE NOT NULL,
    tipo_envio VARCHAR(30) NOT NULL,	--(urgente, estándar, express).
    id_delivery INTEGER NOT NULL,	--referencia al usuario DELIVERY
    id_pedido INTEGER NOT NULL,		--referencia al tabla PEDIDO
    CONSTRAINT fk_envio_delivery FOREIGN KEY (id_delivery)
        REFERENCES public.DELIVERY (id_delivery)
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




-- ====================================
-- ELIMINACIÓN DE TABLAS ANTERIORES (SI EXISTEN)
-- ====================================
DROP TABLE IF EXISTS public.mensajes;
DROP TABLE IF EXISTS public.usuario;
DROP TABLE IF EXISTS public.cliente;
DROP TABLE IF EXISTS public.artesano;
DROP TABLE IF EXISTS public.delivery;
DROP TABLE IF EXISTS public.comunidad;
DROP TABLE IF EXISTS public.categoria;
DROP TABLE IF EXISTS public.almacen;
DROP TABLE IF EXISTS public.producto_artesanal;
DROP TABLE IF EXISTS public.envio;
DROP TABLE IF EXISTS public.pedido;


-- ====================================
-- INSERCIÓN DE DATOS EN LA TABLA COMUNIDAD
-- ====================================
INSERT INTO public.COMUNIDAD (Departamento, provincia, Municipio, nombreCom, ubicacion_geoRef_Com, usuario_creacion, estado_registro)
VALUES
    ('La Paz', 'Murillo', 'La Paz', 'Villa Fátima', ST_SetSRID(ST_MakePoint(-68.1287, -16.4826), 4326), 'admin', 'activo'),
    ('La Paz', 'Murillo', 'La Paz', 'Obrajes', ST_SetSRID(ST_MakePoint(-68.1193, -16.5277), 4326), 'admin', 'activo'),
    ('La Paz', 'Murillo', 'La Paz', 'Achumani', ST_SetSRID(ST_MakePoint(-68.0921, -16.5525), 4326), 'admin', 'activo'),
    ('La Paz', 'Murillo', 'La Paz', 'Sopocachi', ST_SetSRID(ST_MakePoint(-68.1246, -16.5002), 4326), 'admin', 'activo'),
    ('La Paz', 'Murillo', 'La Paz', 'San Antonio', ST_SetSRID(ST_MakePoint(-68.1095, -16.5183), 4326), 'admin', 'activo'),
    ('La Paz', 'Murillo', 'El Alto', 'Ciudad Satélite', ST_SetSRID(ST_MakePoint(-68.2111, -16.5196), 4326), 'admin', 'activo'),
    ('La Paz', 'Los Andes', 'Pucarani', 'Pucarani', ST_SetSRID(ST_MakePoint(-68.5802, -16.3335), 4326), 'admin', 'activo'),
    ('La Paz', 'Pacajes', 'Patacamaya', 'Patacamaya', ST_SetSRID(ST_MakePoint(-68.3887, -17.2362), 4326), 'admin', 'activo'),
    ('La Paz', 'Omasuyos', 'Achacachi', 'Achacachi', ST_SetSRID(ST_MakePoint(-68.6826, -16.0721), 4326), 'admin', 'activo'),
    ('La Paz', 'Nor Yungas', 'Coroico', 'Coroico', ST_SetSRID(ST_MakePoint(-67.7278, -16.1902), 4326), 'admin', 'activo');

-- ====================================
-- INSERCIÓN DE DATOS EN LA TABLA CATEGORIA
-- ====================================
INSERT INTO categoria (nombre_categoria, descripcion, url_icon_categoria, estado_registro, usuario_creacion) VALUES 
('Ropa', 'Ropa artesanal de alta calidad.', 'fas fa-tshirt', 'Activo', 'admin'),
('Corte', 'Herramientas de corte hechas a mano.', 'fas fa-cut', 'Activo', 'admin'),
('Calcetines', 'Calcetines artesanales únicos.', 'fas fa-socks', 'Activo', 'admin'),
('Ribbons', 'Ribbons decorativos hechos a mano.', 'fas fa-ribbon', 'Activo', 'admin'),
('Corazones', 'Productos que simbolizan el cuidado y amor.', 'fas fa-hand-holding-heart', 'Activo', 'admin'),
('Gafas', 'Gafas artesanales personalizadas.', 'fas fa-glasses', 'Activo', 'admin'),
('Cestas', 'Cestas tejidas a mano para múltiples usos.', 'fas fa-tshirt', 'Activo', 'admin'),
('Joyas', 'Joyas artesanales de diseño exclusivo.', 'fas fa-hand-holding-heart', 'Activo', 'admin'),
('Bolsos', 'Bolsos hechos a mano con materiales reciclados.', 'fas fa-ribbon', 'Activo', 'admin'),
('Decoración', 'Elementos decorativos artesanales.', 'fas fa-socks', 'Activo', 'admin');

-- ====================================
-- INSERCIÓN DE DATOS EN LA TABLA ALMACEN
-- ====================================
INSERT INTO public.ALMACEN 
    (nombre_almacen, ubicacion_geoRef_Alm, direccion_almacen, capacidad_unid, usuario_creacion, usuario_modificacion, estado_registro) 
VALUES
    ('Almacén Central', ST_SetSRID(ST_MakePoint(-68.1210, -16.4998), 4326), 'Calle Principal 123, La Paz', 500, 'admin', 'admin', 'activo'),
    ('Almacén Norte', ST_SetSRID(ST_MakePoint(-68.1202, -16.5012), 4326), 'Av. Norte 456, La Paz', 300, 'admin', 'admin', 'activo'),
    ('Almacén Sur', ST_SetSRID(ST_MakePoint(-68.1185, -16.5020), 4326), 'Calle Sur 789, La Paz', 450, 'admin', 'admin', 'activo'),
    ('Almacén Este', ST_SetSRID(ST_MakePoint(-68.1178, -16.5005), 4326), 'Av. Este 321, La Paz', 350, 'admin', 'admin', 'activo'),
    ('Almacén Oeste', ST_SetSRID(ST_MakePoint(-68.1191, -16.5030), 4326), 'Calle Oeste 654, La Paz', 400, 'admin', 'admin', 'activo'),
    ('Almacén Industrial', ST_SetSRID(ST_MakePoint(-68.1167, -16.5045), 4326), 'Zona Industrial 852, La Paz', 600, 'admin', 'admin', 'activo'),
    ('Almacén de Exportación', ST_SetSRID(ST_MakePoint(-68.1155, -16.5060), 4326), 'Calle Exportación 963, La Paz', 700, 'admin', 'admin', 'activo'),
    ('Almacén de Importación', ST_SetSRID(ST_MakePoint(-68.1143, -16.5075), 4326), 'Av. Importación 741, La Paz', 550, 'admin', 'admin', 'activo'),
    ('Almacén de Materias Primas', ST_SetSRID(ST_MakePoint(-68.1131, -16.5080), 4326), 'Calle Materias Primas 159, La Paz', 650, 'admin', 'admin', 'activo'),
    ('Almacén de Productos Terminados', ST_SetSRID(ST_MakePoint(-68.1118, -16.5095), 4326), 'Av. Productos Terminados 357, La Paz', 750, 'admin', 'admin', 'activo');


-- ====================================
-- INSERCIÓN DE DATOS EN LA TABLA USUARIO-CLIENTE
-- ====================================
INSERT INTO public.USUARIO (
    codigo_Usuario, nombre, apellido, email, numero_Contacto, contraseña, ci, sexo, 
    fotoPerf_url, rol, fecha_creacion, fecha_modificacion, usuario_creacion, usuario_modificacion, estado_registro
) VALUES
    ('CM12345678', 'Christian', 'Medrano', 'christiandmc97@gmail.com', '75231580', MD5('Password1001'), '12345678', 'M', 'uploads/1729139333329-752832548.jpg', 'Administrador', DEFAULT, DEFAULT, 'sistema', NULL, 'activo'),
    ('MC12345678', 'Maria', 'Castro', 'maria.castro@gmail.com', '75231581', MD5('Password1001'), '12345679', 'F', 'uploads/1729139333329-752832548.jpg', 'Cliente', DEFAULT, DEFAULT, 'sistema', NULL, 'activo'),
    ('AL12345678', 'Alejandro', 'Lopez', 'alejandro.lopez@gmail.com', '75231582', MD5('Password1001'), '12345680', 'M', 'uploads/1729139333329-752832548.jpg', 'Cliente', DEFAULT, DEFAULT, 'sistema', NULL, 'activo'),
    ('SS12345678', 'Sofia', 'Sanchez', 'sofia.sanchez@gmail.com', '75231583', MD5('Password1001'), '12345681', 'F', 'uploads/1729139333329-752832548.jpg', 'Cliente', DEFAULT, DEFAULT, 'sistema', NULL, 'activo'),
    ('PD12345678', 'Pedro', 'Diaz', 'pedro.diaz@gmail.com', '75231584', MD5('Password1001'), '12345682', 'M', 'uploads/1729139333329-752832548.jpg', 'Cliente', DEFAULT, DEFAULT, 'sistema', NULL, 'activo'),
    ('LT12345678', 'Laura', 'Torres', 'laura.torres@gmail.com', '75231585', MD5('Password1001'), '12345683', 'F', 'uploads/1729139333329-752832548.jpg', 'Cliente', DEFAULT, DEFAULT, 'sistema', NULL, 'activo'),
    ('JG12345678', 'Jorge', 'Gonzalez', 'jorge.gonzalez@gmail.com', '75231586', MD5('Password1001'), '12345684', 'M', 'uploads/1729139333329-752832548.jpg', 'Cliente', DEFAULT, DEFAULT, 'sistema', NULL, 'activo'),
    ('AN12345678', 'Ana', 'Nunez', 'ana.nunez@gmail.com', '75231587', MD5('Password1001'), '12345685', 'F', 'uploads/1729139333329-752832548.jpg', 'Cliente', DEFAULT, DEFAULT, 'sistema', NULL, 'activo'),
    ('RM12345678', 'Ricardo', 'Mora', 'ricardo.mora@gmail.com', '75231588', MD5('Password1001'), '12345686', 'M', 'uploads/1729139333329-752832548.jpg', 'Cliente', DEFAULT, DEFAULT, 'sistema', NULL, 'activo'),
    ('VA12345678', 'Valeria', 'Alvarez', 'valeria.alvarez@gmail.com', '75231589', MD5('Password1001'), '12345687', 'F', 'uploads/1729139333329-752832548.jpg', 'Cliente', DEFAULT, DEFAULT, 'sistema', NULL, 'activo'),
    ('SM12345678', 'Silvia', 'Melendrez', 'silvia.melendrez@gmail.com', '75231590', MD5('Password1001'), '12345688', 'F', 'uploads/1729139333329-752832548.jpg', 'Cliente', DEFAULT, DEFAULT, 'sistema', NULL, 'activo'
   );

INSERT INTO public.CLIENTE (id_usuario, direccion_Envio, usuario_creacion, estado_registro)
VALUES
(2, 'Calle Falsa 123', 'sistema', 'activo'),
(3, 'Avenida Siempre Viva 742', 'sistema', 'activo'),
(4, 'Boulevard de los Sueños Rotos 45', 'sistema', 'activo'),
(5, 'Plaza Mayor 101', 'sistema', 'activo'),
(6, 'Calle de la Amistad 33', 'sistema', 'activo'),
(7, 'Avenida de la Paz 88', 'sistema', 'activo'),
(8, 'Calle de la Esperanza 5', 'sistema', 'activo'),
(9, 'Calle del Sol 77', 'sistema', 'activo'),
(10, 'Calle del Mar 12', 'sistema', 'activo'),
(11, 'Avenida del Futuro 90', 'sistema', 'activo');


-- ====================================
-- INSERCIÓN DE DATOS EN LA TABLA USUARIO-ARTESANO
-- ====================================
INSERT INTO public.USUARIO (codigo_Usuario, nombre, apellido, email, numero_Contacto, contraseña, ci, sexo, fotoPerf_url, rol, fecha_creacion, fecha_modificacion, usuario_creacion, usuario_modificacion, estado_registro) VALUES
('AR12345678', 'Arturo', 'Rivas', 'arturo.rivas@gmail.com', '75231590', MD5('Password1002'), '12345688', 'M', 'uploads/1729139333329-752832548.jpg', 'Artesano', DEFAULT, DEFAULT, 'sistema', NULL, 'activo'),
('BL12345678', 'Beatriz', 'Lara', 'beatriz.lara@gmail.com', '75231591', MD5('Password1002'), '12345689', 'F', 'uploads/1729139333329-752832548.jpg', 'Artesano', DEFAULT, DEFAULT, 'sistema', NULL, 'activo'),
('MG12345678', 'Miguel', 'Gomez', 'miguel.gomez@gmail.com', '75231592', MD5('Password1002'), '12345690', 'M', 'uploads/1729139333329-752832548.jpg', 'Artesano', DEFAULT, DEFAULT, 'sistema', NULL, 'activo'),
('SC12345678', 'Susana', 'Cruz', 'susana.cruz@gmail.com', '75231593', MD5('Password1002'), '12345691', 'F', 'uploads/1729139333329-752832548.jpg', 'Artesano', DEFAULT, DEFAULT, 'sistema', NULL, 'activo'),
('JA12345678', 'Javier', 'Aguirre', 'javier.aguirre@gmail.com', '75231594', MD5('Password1002'), '12345692', 'M', 'uploads/1729139333329-752832548.jpg', 'Artesano', DEFAULT, DEFAULT, 'sistema', NULL, 'activo'),
('CR12345678', 'Carla', 'Ramos', 'carla.ramos@gmail.com', '75231595', MD5('Password1002'), '12345693', 'F', 'uploads/1729139333329-752832548.jpg', 'Artesano', DEFAULT, DEFAULT, 'sistema', NULL, 'activo'),
('DP12345678', 'Daniel', 'Paredes', 'daniel.paredes@gmail.com', '75231596', MD5('Password1002'), '12345694', 'M', 'uploads/1729139333329-752832548.jpg', 'Artesano', DEFAULT, DEFAULT, 'sistema', NULL, 'activo'),
('LM12345678', 'Lorena', 'Mendoza', 'lorena.mendoza@gmail.com', '75231597', MD5('Password1002'), '12345695', 'F', 'uploads/1729139333329-752832548.jpg', 'Artesano', DEFAULT, DEFAULT, 'sistema', NULL, 'activo'),
('PM12345678', 'Pablo', 'Maldonado', 'pablo.maldonado@gmail.com', '75231598', MD5('Password1002'), '12345696', 'M', 'uploads/1729139333329-752832548.jpg', 'Artesano', DEFAULT, DEFAULT, 'sistema', NULL, 'activo'),
('EM12345678', 'Elena', 'Martinez', 'elena.martinez@gmail.com', '75231599', MD5('Password1002'), '12345697', 'F', 'uploads/1729139333329-752832548.jpg', 'Artesano', DEFAULT, DEFAULT, 'sistema', NULL, 'activo');

INSERT INTO public.ARTESANO (id_usuario, especialidad_Artesano, id_comunidad, usuario_creacion, estado_registro)
VALUES 
(12, 'Cerámica', 1, 'sistema', 'activo'),
(13, 'Tejido', 2, 'sistema', 'activo'),
(14, 'Tallado en madera', 3, 'sistema', 'activo'),
(15, 'Pintura', 4, 'sistema', 'activo'),
(16, 'Joyería', 5, 'sistema', 'activo'),
(17, 'Cestería', 6, 'sistema', 'activo'),
(18, 'Alfarería', 7, 'sistema', 'activo'),
(19, 'Escultura', 8, 'sistema', 'activo'),
(20, 'Diseño gráfico', 9, 'sistema', 'activo'),
(21, 'Manualidades', 10, 'sistema', 	'activo');


-- ====================================
-- INSERCIÓN DE DATOS EN LA TABLA USUARIO-DELIVERY
-- ====================================
INSERT INTO public.USUARIO (codigo_Usuario, nombre, apellido, email, numero_Contacto, contraseña, ci, sexo, fotoPerf_url, rol, fecha_creacion, fecha_modificacion, usuario_creacion, usuario_modificacion, estado_registro) VALUES
('JM12345698', 'Jorge', 'Mendoza', 'jorge.mendoza@gmail.com', '75231600', MD5('Password1003'), '12345698', 'M', 'uploads/1729139333329-752832548.jpg', 'Delivery', DEFAULT, DEFAULT, 'sistema', NULL, 'activo'),
('FL12345699', 'Fabiana', 'Lopez', 'fabiana.lopez@gmail.com', '75231601', MD5('Password1003'), '12345699', 'F', 'uploads/1729139333329-752832548.jpg', 'Delivery', DEFAULT, DEFAULT, 'sistema', NULL, 'activo'),
('PC12345700', 'Pedro', 'Cruz', 'pedro.cruz@gmail.com', '75231602', MD5('Password1003'), '12345700', 'M', 'uploads/1729139333329-752832548.jpg', 'Delivery', DEFAULT, DEFAULT, 'sistema', NULL, 'activo'),
('GV12345701', 'Gabriela', 'Vargas', 'gabriela.vargas@gmail.com', '75231603', MD5('Password1003'), '12345701', 'F', 'uploads/1729139333329-752832548.jpg', 'Delivery', DEFAULT, DEFAULT, 'sistema', NULL, 'activo'),
('MT12345702', 'Miguel', 'Torres', 'miguel.torres@gmail.com', '75231604', MD5('Password1003'), '12345702', 'M', 'uploads/1729139333329-752832548.jpg', 'Delivery', DEFAULT, DEFAULT, 'sistema', NULL, 'activo'),
('AS12345703', 'Ana', 'Sosa', 'ana.sosa@gmail.com', '75231605', MD5('Password1003'), '12345703', 'F', 'uploads/1729139333329-752832548.jpg', 'Delivery', DEFAULT, DEFAULT, 'sistema', NULL, 'activo'),
('DP12345704', 'David', 'Perez', 'david.perez@gmail.com', '75231606', MD5('Password1003'), '12345704', 'M', 'uploads/1729139333329-752832548.jpg', 'Delivery', DEFAULT, DEFAULT, 'sistema', NULL, 'activo'),
('CS12345705', 'Claudia', 'Sanchez', 'claudia.sanchez@gmail.com', '75231607', MD5('Password1003'), '12345705', 'F', 'uploads/1729139333329-752832548.jpg', 'Delivery', DEFAULT, DEFAULT, 'sistema', NULL, 'activo'),
('LB12345706', 'Luis', 'Bravo', 'luis.bravo@gmail.com', '75231608', MD5('Password1003'), '12345706', 'M', 'uploads/1729139333329-752832548.jpg', 'Delivery', DEFAULT, DEFAULT, 'sistema', NULL, 'activo'),
('ET12345707', 'Esteban', 'Tello', 'esteban.tello@gmail.com', '75231609', MD5('Password1003'), '12345707', 'M', 'uploads/1729139333329-752832548.jpg', 'Delivery', DEFAULT, DEFAULT, 'sistema', NULL, 'activo');
INSERT INTO public.DELIVERY (id_usuario, tipo_vehiculo, matricula_vehiculo, usuario_creacion, usuario_modificacion, estado_registro) VALUES
(22, 'Moto', 'MOT-123', 'sistema', NULL, 'activo'),
(23, 'Bicicleta', 'BIC-456', 'sistema', NULL, 'activo'),
(24, 'Auto', 'AUT-789', 'sistema', NULL, 'activo'),
(25, 'Camioneta', 'CAM-321', 'sistema', NULL, 'activo'),
(26, 'Furgoneta', 'FUR-654', 'sistema', NULL, 'activo'),
(27, 'Scooter', 'SCO-987', 'sistema', NULL, 'activo'),
(28, 'Camión', 'CAM-159', 'sistema', NULL, 'activo'),
(29, 'Triciclo', 'TRI-753', 'sistema', NULL, 'activo'),
(30, 'Auto Eléctrico', 'ELE-258', 'sistema', NULL, 'activo'),
(31, 'Taxi', 'TAX-369', 'sistema', NULL, 'activo');


-- ====================================
-- INSERCIÓN DE PRODUCTOS
-- ====================================
INSERT INTO producto_artesanal (
    nombre_Prod, descripcion_Prod, precio, descuento_porcent, ruta_imagen, 
    politica_de_Envio, peso_kg, stock, informacion_Adicional, id_artesano, id_almacen, id_categoria
) VALUES 
('Vasija de barro', 'Vasija de barro hecha a mano, ideal para almacenar agua o como pieza decorativa.', 150.99, 5.00, 
 'uploads/imagen1.jpg', 'Envío a todo el país', 1.5, 10, 
 '#A52A2A', 1, 3, 2),

('Jarrón de cerámica', 'Jarrón pintado a mano con diseños florales, perfecto para centros de mesa.', 250.50, 10.00, 
 'uploads/imagen2.jpg', 'Envío gratuito en compras mayores a Bs.50', 2.0, 15, 
 '#4682B4', 1, 7, 5),

('Cesta de mimbre', 'Cesta tejida a mano, ideal para regalos o almacenamiento.', 120.75, 0.00, 
 'uploads/imagen3.jpg', 'Envío estándar', 0.8, 20, 
 '#D2B48C', 1, 5, 1),

('Cuenco de madera', 'Cuenco de madera tallado, perfecto para servir ensaladas.', 180.99, 12.50, 
 'uploads/imagen4.jpg', 'Envío rápido', 1.2, 12, 
 '#8B4513', 1, 2, 3),

('Mantel de lino', 'Mantel artesanal de lino, suave y resistente, perfecto para ocasiones especiales.', 300.00, 15.00, 
 'uploads/imagen5.jpg', 'Envío gratuito', 0.5, 30, 
 '#C0C0C0', 1, 1, 4),

('Taza de barro', 'Taza rústica de barro, ideal para café o té.', 110.50, 5.00, 
 'uploads/imagen6.jpg', 'Envío a todo el país', 0.4, 25, 
 '#FF6347', 1, 4, 6),

('Escultura de madera', 'Escultura tallada, pieza única que fusiona arte y naturaleza.', 600.00, 20.00, 
 'uploads/imagen7.jpg', 'Envío gratuito en compras mayores a $100', 3.0, 5, 
 '#A0522D', 1, 10, 8),

('Bolso de tela', 'Bolso ecológico hecho a mano, ideal para el uso diario.', 130.00, 8.00, 
 'uploads/imagen8.jpg', 'Envío rápido', 0.6, 18, 
 '#008000', 1, 6, 7),

('Lámpara de cerámica', 'Lámpara decorativa de cerámica, estilo vintage, ideal para iluminar espacios.', 400.00, 15.00, 
 'uploads/imagen9.jpg', 'Envío gratuito', 1.8, 8, 
 '#FFD700', 1, 9, 9),

('Figurita de barro', 'Figurita de barro pintada a mano, ideal para decoración.', 90.00, 5.00, 
 'uploads/imagen10.jpg', 'Envío estándar', 0.3, 22, 
 '#B22222', 1, 8, 10);



-- ----------------------------------------------
-- CONSULTAS DE DATOS
-- ----------------------------------------------
select * from mensajes m ;
select * from usuario u;
select * from cliente c ;
select * from artesano m ;
select * from delivery d ;

select * from comunidad;
select * from categoria c ;
select * from almacen a ;

select * from producto_artesanal pa ;