
const usuarioGuardado = JSON.parse(sessionStorage.getItem('usuario'));
const id_usuario = usuarioGuardado.id_usuario;

// Función para listar ventas de un artesano
async function listarVentas(id_usuario) {
    try {
        const response = await fetch(`/listarVentasArtesano/${id_usuario}`);
        if (!response.ok) {
            throw new Error('No se pudieron cargar las ventas');
        }

        const ventas = await response.json();

        // Limpiar la tabla antes de actualizar
        $('#tablaVentas').DataTable().clear().destroy();

        // Inicializar DataTables con los datos actualizados
        $('#tablaVentas').DataTable({
            responsive: true,
            autoWidth: true,
            data: ventas,
            columns: [
                { data: 'num_fila' },
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
                    data: 'id_usuario_delivery',
                    render: function (data) {
                        return data === null
                            ? `<button class="btn btn-secondary btn-sm" disabled>
                                    <i class="fas fa-times-circle"></i> No Asignado
                               </button>`
                            : `<button class="btn btn-secondary btn-sm btnUsuarioDelivery" data-id="${data}" data-type="delivery">
                                    <i class="fas fa-truck"></i> Ver Delivery
                               </button>`;
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
                    data: 'suma_total',
                    render: function (data) {
                        return `<span class="badge badge-success" style="border-radius: 0; padding: 8px 12px; font-weight: bold;">Bs. ${data}</span>`;
                    }
                },
                {
                    data: null,
                    defaultContent: ` 
                        <div class=''>
                            <div class='btn-group'>
                                <button title='Ver detalles' class='btn btn-secondary btn-sm btnDetalles'>
                                    <i class='fas fa-info-circle'></i> Detalles
                                </button>
                            </div>
                        </div>`
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
            footerCallback: function (row, data, start, end, display) {
                const api = this.api();

                // Calcula la suma total de la columna `suma_total`
                const total = api.column(5, { page: 'current' }).data().reduce((a, b) => {
                    return parseFloat(a) + parseFloat(b);
                }, 0);

                // Actualiza el pie de la tabla con el total
                $(api.column(5).footer()).html(`Bs. ${total.toFixed(2)}`);
            }
        });
    } catch (error) {
        console.error('Error al cargar las ventas del artesano:', error);
    }
}


// Evento Click btnUsuario cliente
document.getElementById('tablaVentas').addEventListener('click', async function (event) {
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

// Evento Click btnUsuario delivery
document.getElementById('tablaVentas').addEventListener('click', async function (event) {
    const boton = event.target.closest('.btnUsuarioDelivery');
    if (boton) {
        // Extraer los atributos del botón (id_usuario)
        const idUsuarioDelivery = boton.getAttribute('data-id');

        // Mostrar el modal
        $('#modalDetalleDelivery').modal('show');

        try {
            // Realizamos una solicitud GET para obtener los detalles del delivery
            const response = await fetch(`/obtenerDatosDelivery/${idUsuarioDelivery}`); // Cambiar la URL según tu enrutamiento

            // Verifica si la respuesta fue exitosa (código 200)
            if (!response.ok) {
                throw new Error('No se pudieron cargar los datos del delivery');
            }

            // Procesar la respuesta JSON
            const data = await response.json();

            // Verificar si se recibió un delivery en los datos
            if (Array.isArray(data) && data.length > 0) {
                const delivery = data[0]; // Accede al primer registro de delivery en el array

                // Asignar los datos al modal
                document.getElementById('nombreDelivery').textContent = delivery.nombre || 'No disponible';
                document.getElementById('apellidoDelivery').textContent = delivery.apellido || 'No disponible';
                document.getElementById('ciDelivery').textContent = delivery.ci || 'No disponible';
                document.getElementById('emailDelivery').textContent = delivery.email || 'No disponible';
                document.getElementById('numeroDelivery').textContent = delivery.numero_contacto || 'No disponible';
                document.getElementById('tipoVehiculo').textContent = delivery.tipo_vehiculo || 'No disponible';
                document.getElementById('matriculaVehiculo').textContent = delivery.matricula_vehiculo || 'No disponible';

            } else {
                // Si no se encuentra el delivery
                alert("No se encontraron datos para el delivery");
            }

        } catch (error) {
            console.error('Error:', error);
            alert('Error al cargar los datos del delivery: ' + error.message);
        }
    }
});



//Evento Click btnDetalles
document.getElementById('tablaVentas').addEventListener('click', async function (event) {
    if (event.target.closest('.btnDetalles')) {
        // Obtener la fila (tr) más cercana al botón de detalles
        const fila = $(event.target).closest('tr');

        // Obtener los datos de la fila seleccionada desde DataTable
        const ventasData = $('#tablaVentas').DataTable().row(fila).data();

        if (ventasData) {
            const id_pedido = ventasData.id_pedido;
            const id_usuario_cliente = ventasData.id_usuario_cliente;

            // Mostrar el modal de detalles
            $('#modalDetalleVentas').modal('show');

            try {
                // Realizamos una solicitud GET para obtener los detalles de ventas del artesano
                const response = await fetch(`/listarDetalleProductosVentasArtesano/${id_usuario_cliente}/${id_pedido}/${id_usuario}`);
                if (!response.ok) {
                    throw new Error('No se pudieron cargar las ventas');
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
                console.error('Error al cargar los detalles de la venta:', error);
            }
        }
    }
});




document.addEventListener('DOMContentLoaded', listarVentas(id_usuario));

