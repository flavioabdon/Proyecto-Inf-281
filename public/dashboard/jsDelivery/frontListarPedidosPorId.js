
const usuarioGuardado = JSON.parse(sessionStorage.getItem('usuario'));
const id_usuario_delivery = usuarioGuardado.id_usuario;


async function listarPedidosPorId(id_usuario_delivery) {
    try {
        const response = await fetch(`/listarPedidosDeliveryPorId/${id_usuario_delivery}`);
        if (!response.ok) {
            throw new Error('No se pudieron cargar los pedidos del delivery');
        }

        const pedidos = await response.json();

        // Limpiar la tabla antes de actualizar
        $('#tablaMisPedidos').DataTable().clear().destroy();

        // Inicializar DataTables con los datos actualizados
        $('#tablaMisPedidos').DataTable({
            responsive: true,
            autoWidth: true,
            data: pedidos,
            columns: [
                { data: 'num_fila' }, // Columna para número de fila
                { data: 'id_pedido' },
                {
                    data: 'id_usuario_cliente',
                    render: function (data) {
                        return ` 
                            <button class="btn btn-secondary btn-sm btnUsuarioCliente" data-id="${data}" data-type="cliente">
                                <i class="fas fa-user"></i> Ver Cliente
                            </button>
                        `;
                    }
                },
                {
                    data: 'estado',
                    render: function (data) {
                        let badgeClass, iconClass, text;

                        switch (data) {
                            case "En Almacen":
                                badgeClass = "badge badge-warning";
                                iconClass = "fas fa-warehouse";
                                text = "EN ALMACEN";
                                break;
                            case "En Camino":
                                badgeClass = "badge badge-info";
                                iconClass = "fas fa-truck";
                                text = "EN CAMINO";
                                break;
                            case "En Casa":
                                badgeClass = "badge badge-primary";
                                iconClass = "fas fa-home";
                                text = "EN CASA";
                                break;
                            case "Finalizado":
                                badgeClass = "badge badge-success";
                                iconClass = "fas fa-check-circle";
                                text = "FINALIZADO";
                                break;
                            default:
                                badgeClass = "badge badge-secondary";
                                iconClass = "fas fa-question-circle";
                                text = "DESCONOCIDO";
                        }

                        return `
                            <span class="${badgeClass}" style="text-transform: uppercase; margin: 0; padding: 8px 10px; border-radius: 3px; box-shadow: 1px 1px 5px rgba(0,0,0,0.1);">
                                <i class="${iconClass}" style="margin-right: 8px;"></i> ${text}
                            </span>
                        `;
                    }
                },
                {
                    data: 'num_tracking',
                    render: function (data) {
                        return `<strong>${data}</strong>`;
                    }
                },
                {
                    data: null, // Sin datos directos para esta columna
                    defaultContent: ` 
                        <div class='btn-group'>
                            <button title='Ver Mapa' class='btn btn-primary btn-sm btnDireccionAlmacen'>
                                <i class="fas fa-map-marker-alt"></i> Ver Mapa
                            </button>
                        </div>
                    `
                },
                {
                    data: 'direccion_envio',
                    render: function (data) {
                        // Extraer latitud y longitud
                        const [lat, lng] = data.split(',').map(coord => parseFloat(coord.trim()));

                        // Crear un enlace a Google Maps
                        const mapaUrl = `https://www.google.com/maps?q=${lat},${lng}&hl=es`;

                        return `
                            <a href="${mapaUrl}" target="_blank" class="btn btn-primary btn-sm">
                                <i class="fas fa-map-marker-alt"></i> Ver mapa
                            </a>
                        `;
                    }
                },
                {
                    data: 'costo_envio',
                    render: function (data) {
                        return `<span class="badge badge-success" style="border-radius: 0; padding: 8px 12px;">Bs. ${data}</span>`;
                    }
                },
                {
                    data: null, // Sin datos directos para esta columna
                    defaultContent: ` 
                            <div class='btn-group'>
                                <!-- Botón de detalles con ícono -->
                                <button title='Ver detalles' class='btn btn-secondary btn-sm btnDetalles'>
                                    <i class='fas fa-info-circle'></i> Detalles
                                </button>
                            </div>
                            `
                },
                {
                    data: null, // Sin datos directos para esta columna
                    defaultContent: `
                            <div class='btn-group'>
                                <button title='Notificar' class='btn btn-warning btn-sm btnNotificar'>
                                    <i class='fas fa-bell'></i> Notificar
                                </button>
                            </div>
                            `
                }
            ],

            language: {
                decimal: "",
                emptyTable: "No hay información disponible",
                info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
                infoEmpty: "Mostrando 0 a 0 de 0 registros",
                infoFiltered: "(filtrado de _MAX_ registros totales)",
                lengthMenu: "Mostrar _MENU_ registros por página",
                loadingRecords: "Cargando...",
                processing: "Procesando...",
                search: "Buscar:",
                zeroRecords: "No se encontraron registros coincidentes",
                paginate: {
                    first: "Primero",
                    last: "Último",
                    next: "Siguiente",
                    previous: "Anterior"
                },
                aria: {
                    sortAscending: ": activar para ordenar de forma ascendente",
                    sortDescending: ": activar para ordenar de forma descendente"
                }
            },
            order: [[0, 'desc']],
            columnDefs: [
                {
                    targets: [1],
                    visible: false
                },
                {
                    targets: [0, 2, 4],
                    className: 'text-left'
                }
            ],

        });
    } catch (error) {
        console.error('Error al cargar los pedidos del delivery:', error);
    }
}

// Evento Click btnUsuario cliente
document.getElementById('tablaMisPedidos').addEventListener('click', async function (event) {
    const boton = event.target.closest('.btnUsuarioCliente');
    if (boton) {

        // Extraer los atributos del botón (id_usuario)
        const idUsuarioCliente = boton.getAttribute('data-id');

        // Mostrar el modal
        $('#modalDetalleCliente').modal('show');

        try {
            // Realizamos una solicitud GET para obtener los detalles del cliente
            const response = await fetch(`/obtenerDatosCliente/${idUsuarioCliente}`); // Cambiar la URL según tu enrutamiento

            // Verifica si la respuesta fue exitosa (código 200)
            if (!response.ok) {
                throw new Error('No se pudieron cargar los datos del cliente');
            }

            // Procesar la respuesta JSON
            const data = await response.json();

            // Verificar si se recibió un cliente en los datos
            if (Array.isArray(data) && data.length > 0) {
                const cliente = data[0]; // Accede al primer cliente en el array

                // Asignar los datos al modal
                document.getElementById('nombreCliente').textContent = cliente.nombre || 'No disponible';
                document.getElementById('apellidoCliente').textContent = cliente.apellido || 'No disponible';
                document.getElementById('ciCliente').textContent = cliente.ci || 'No disponible';
                document.getElementById('emailCliente').textContent = cliente.email || 'No disponible';
                document.getElementById('numeroCliente').textContent = cliente.numero_contacto || 'No disponible';

            } else {
                // Si no se encuentra el cliente
                alert("No se encontraron datos para el cliente");
            }

        } catch (error) {
            console.error('Error:', error);
            alert('Error al cargar los datos del cliente: ' + error.message);
        }
    }
});


//Evento Click btnDetalles
document.getElementById('tablaMisPedidos').addEventListener('click', async function (event) {
    if (event.target.closest('.btnDetalles')) {
        // Obtener la fila (tr) más cercana al botón de detalles
        const fila = $(event.target).closest('tr');

        // Obtener los datos de la fila seleccionada desde DataTable
        const pedidosData = $('#tablaMisPedidos').DataTable().row(fila).data();

        if (pedidosData) {
            const id_pedido = pedidosData.id_pedido;
            const id_usuario_cliente = pedidosData.id_usuario_cliente;
            // Mostrar el modal de detalles
            $('#modalDetalleVentas').modal('show');

            try {
                // Realizamos una solicitud GET para obtener los detalles de ventas del artesano
                const response = await fetch(`/listarDetalleVentasArtesano/${id_usuario_cliente}/${id_pedido}`);
                if (!response.ok) {
                    throw new Error('No se pudieron cargar los productos de las ventas');
                }

                const detalleVentas = await response.json(); // Convierte la respuesta a JSON

                // Inicializar DataTable solo cuando el modal se haya mostrado
                $('#modalDetalleVentas').on('shown.bs.modal', function () {
                    // Limpiar y destruir cualquier instancia previa de DataTable
                    $('#tablaDetalleVentas').DataTable().clear().destroy();

                    // Inicializar DataTable con los detalles obtenidos
                    $('#tablaDetalleVentas').DataTable({
                        responsive: true, // Hacer la tabla responsive
                        autoWidth: false, // Para que DataTable maneje el ancho de las columnas automáticamente
                        data: detalleVentas, // Datos que se cargan en la tabla
                        columns: [
                            { data: 'num_fila' },
                            { data: 'id_prod' },
                            { data: 'nombre_prod' },
                            { data: 'descripcion_prod' },
                            {
                                data: 'informacion_adicional',
                                render: function (data) {
                                    return `
                                       <div style="width: 50%; height: 20px; background-color: ${data}; border-radius: 4px; border: 1px solid gray;"></div>
                                    `;
                                }
                            },
                            {
                                data: 'ruta_imagen', // Accede a ruta_imagen
                                render: function (data) {
                                    const imagePath = data.replace(/\\/g, '/');
                                    return `
                                        <div style="display: flex; align-items: center; justify-content: center;">
                                            <img src="${imagePath}" 
                                                alt="Imagen del Producto" 
                                                style="width: 150px; height: 150px; object-fit: cover; border: 2px solid #ccc;">
                                        </div>
                                    `;
                                }
                            },
                            { data: 'precio' },
                            { data: 'cantidad' },
                            {
                                data: 'subtotal',
                                render: function (data) {
                                    // Usamos un badge cuadrado con el texto 'Bs.' delante del valor
                                    return `<span class="badge badge-primary" style="border-radius: 0; padding: 8px 12px;">Bs. ${data}</span>`;
                                }
                            },
                            {
                                data: 'nombre_completo_artesano',
                                render: function (data) {
                                    return `<strong>${data}</strong>`;
                                }
                            },
                            { data: 'email_artesano' },
                            { data: 'numero_artesano' },

                        ],

                        language: {
                            "decimal": "",
                            "emptyTable": "No hay información disponible",
                            "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
                            "infoEmpty": "Mostrando 0 a 0 de 0 registros",
                            "infoFiltered": "(filtrado de _MAX_ registros totales)",
                            "lengthMenu": "Mostrar _MENU_ registros por página",
                            "loadingRecords": "Cargando...",
                            "processing": "Procesando...",
                            "search": "Buscar:",
                            "zeroRecords": "No se encontraron registros coincidentes",
                            "paginate": {
                                "first": "Primero",
                                "last": "Último",
                                "next": "Siguiente",
                                "previous": "Anterior"
                            },
                            "aria": {
                                "sortAscending": ": activar para ordenar de forma ascendente",
                                "sortDescending": ": activar para ordenar de forma descendente"
                            }
                        },
                        order: [[0, 'desc']], // Ordenar por la primera columna por defecto
                        columnDefs: [
                            {
                                targets: [1], // Ocultar la columna ID si es necesario
                                visible: false
                            },
                            {
                                targets: [0, 2, 4], // Centrar las columnas especificadas
                                className: 'text-left'
                            }
                        ]
                    });
                });
            } catch (error) {
                console.error('Error al cargar los productos de las ventas:', error);
            }
        }
    }
});

document.getElementById('tablaMisPedidos').addEventListener('click', function (event) {
    if (event.target.closest('.btnNotificar')) {
        // Obtener la fila (tr) más cercana al botón de notificar
        const fila = $(event.target).closest('tr');

        // Obtener los datos de la fila desde DataTable
        const data = $('#tablaMisPedidos').DataTable().row(fila).data();
        const id_pedido = data.id_pedido;
        const estado_pedido = data.estado; // Suponiendo que "estado" es el campo del estado en la tabla

        // Verificar si el estado del pedido es "En Camino"
        if (estado_pedido !== "En Camino") {
            Swal.fire({
                icon: 'warning',
                title: 'Estado no válido',
                text: 'Solo puedes notificar pedidos que están "En Camino".',
                confirmButtonText: 'Aceptar'
            });
            return; // Salir si el estado no es válido
        }

        // Mostrar una confirmación de notificación utilizando SweetAlert
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Quieres notificar al cliente que su pedido ya se encuentra en su casa?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, Notificar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Envía la solicitud para notificar al cliente al servidor
                fetch('/delivery_en_casa', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id_pedido: id_pedido,
                    })
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Ocurrió un error al notificar al cliente');
                        }
                        return response.json();
                    })
                    .then(data => {
                        // Muestra una alerta de SweetAlert cuando la notificación es enviada correctamente
                        Swal.fire({
                            icon: 'success',
                            title: '¡Notificación enviada!',
                            text: 'El cliente ha sido notificado que su pedido ya se encuentra en su casa.',
                            confirmButtonText: 'Aceptar'
                        }).then(() => {
                            // Redirige a la página de "Mis Pedidos"
                            window.location.href = '/misPedidosDelivery';
                        });

                        listarPedidosPorId(id_usuario_delivery); // Re-actualiza la lista de pedidos
                    })
                    .catch(error => {
                        // Muestra una alerta de SweetAlert cuando ocurre un error
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: error.message || 'Ocurrió un error al notificar al cliente.',
                            confirmButtonText: 'Aceptar'
                        });
                        console.error('Error al notificar al cliente:', error);
                    });
            }
        });
    }
});


//Evento Click btnDireccionAlmacen(Coordenadas)
document.getElementById('tablaMisPedidos').addEventListener('click', async function (event) {
    if (event.target.closest('.btnDireccionAlmacen')) {
        // Obtener la fila (tr) más cercana al botón
        const fila = $(event.target).closest('tr');
        // Obtener el ID del pedido desde DataTable
        const id_pedido = $('#tablaMisPedidos').DataTable().row(fila).data().id_pedido;

        const longitudI = -68.13575604248047;
        const latitudI = -16.5066583477171;
        // Configuración de la ubicación del cliente y creación del mapa
        const location = { lat: latitudI, lng: longitudI };
        map1 = new google.maps.Map(document.getElementById("map1"), {
            center: location,
            zoom: 12,
        });
        const response = await fetch(`/obtenerCoordenadasAlmacenes/${id_pedido}`);

        // Verifica si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        // Extrae el JSON de la respuesta
        const coordenadas = await response.json();
        coordenadas.forEach(almacen => {
            const { latitud, longitud } = almacen;

            // Crear marcador para el almacén
            new google.maps.Marker({
                position: { lat: latitud, lng: longitud },
                map: map1,
                title: `Almacén ID: ${almacen.id_almacen}`, // Mostrar ID del almacén al pasar el cursor
            });
        });
        $('#modalMapa').modal('show');
    }
});



document.addEventListener('DOMContentLoaded', listarPedidosPorId(id_usuario_delivery));

