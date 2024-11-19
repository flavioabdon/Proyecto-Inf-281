
const usuarioGuardado = JSON.parse(sessionStorage.getItem('usuario'));
const id_usuario = usuarioGuardado.id_usuario;


// Función para listar compras cliente
async function listarCompras(id_usuario) {
    try {

        const response = await fetch(`/listarComprasCliente/${id_usuario}`);
        if (!response.ok) {
            throw new Error('No se pudieron cargar las compras');
        }

        const compras = await response.json(); // Convierte la respuesta a JSON

        // Limpiar la tabla antes de actualizar
        $('#tablaCompras').DataTable().clear().destroy();

        // Inicializar DataTables con los datos actualizados
        $('#tablaCompras').DataTable({
            responsive: true,
            autoWidth: true,
            data: compras,
            columns: [
                { data: 'num_fila' }, // Columna para número de fila
                { data: 'id_pedido' },
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
                            <span class="${badgeClass}" style="text-transform: uppercase; margin:0; padding: 8px 10px; border-radius: 3px; box-shadow: 1px 1px 5px rgba(0,0,0,0.1);">
                                <i class="${iconClass}" style="margin-right: 8px;"></i> ${text}
                            </span>
                        `;
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
                },
                {
                    data: 'suma_total_productos',
                    render: function (data) {
                        // Agregar el prefijo "Bs." y aplicar negritas
                        return `<strong>Bs. ${data}</strong>`;
                    }
                },
                {
                    data: 'costo_envio',
                    render: function (data) {
                        // Verificar si el valor es 0 y mostrar "Recojo directo", sino mostrar "Bs." con el valor
                        return data == 0 ? `<strong>Recojo Directo</strong>` : `<strong>Bs. ${data}</strong>`;
                    }
                },
                {
                    data: 'suma_total',
                    render: function (data) {
                        // Usamos un badge cuadrado con el texto 'Bs.' delante del valor
                        return `<span class="badge badge-primary" style="border-radius: 0; padding: 8px 12px;">Bs. ${data}</span>`;
                    }
                },
                {
                    data: null,
                    defaultContent: ` 
                        <div class=''>
                            <div class='btn-group'>
                                <button title='Confirmar Pedido' class='btn btn-success btn-sm btnConfirmar'>
                                    <i class='fas fa-check-circle'></i> Confirmar Pedido
                                </button>
                            </div>
                        </div>`,
                }
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
            order: [[0, 'desc']],
            columnDefs: [
                {
                    targets: [1], // Puedes ocultar la columna de ID si es necesario
                    visible: false
                },
                {
                    targets: [0, 2, 4, 5], // Centrar columnas
                    className: 'text-left'
                }
            ],
            footerCallback: function (row, data, start, end, display) {
                const api = this.api();

                // Calcula la suma total de la columna `suma_total`
                const total = api.column(7, { page: 'current' }).data().reduce((a, b) => {
                    return parseFloat(a) + parseFloat(b);
                }, 0);

                // Actualiza el pie de la tabla con el total
                $(api.column(7).footer()).html(`Bs. ${total.toFixed(2)}`);
            }
        });
    } catch (error) {
        console.error('Error al cargar las compras del cliente', error);
    }
}

// Función detalleCompras
document.getElementById('tablaCompras').addEventListener('click', async function (event) {
    if (event.target.closest('.btnDetalles')) {
        // Obtener la fila (tr) más cercana al botón de detalles
        const fila = $(event.target).closest('tr');

        // Obtener los datos de la fila seleccionada desde DataTable
        const comprasData = $('#tablaCompras').DataTable().row(fila).data();

        if (comprasData) {
            const id_pedido = comprasData.id_pedido;

            // Mostrar el modal de detalles
            $('#modalDetalleCompras').modal('show');

            try {

                const response = await fetch(`/listarDetalleComprasCliente/${id_usuario}/${id_pedido}`);
                if (!response.ok) {
                    throw new Error('No se pudieron cargar las compras');
                }

                const detalleCompras = await response.json(); // Convierte la respuesta a JSON

                // Inicializar DataTable solo cuando el modal se haya mostrado
                $('#modalDetalleCompras').on('shown.bs.modal', function () {
                    // Limpiar y destruir cualquier instancia previa de DataTable
                    $('#tablaDetalleCompras').DataTable().clear().destroy();

                    // Inicializar DataTable con los detalles obtenidos
                    $('#tablaDetalleCompras').DataTable({
                        responsive: true, // Hacer la tabla responsive
                        autoWidth: false, // Para que DataTable maneje el ancho de las columnas automáticamente
                        data: detalleCompras, // Datos que se cargan en la tabla
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
                console.error('Error al cargar los detalles de compras:', error);
            }
        }
    }
});

// Evento Click btnUsuario delivery
document.getElementById('tablaCompras').addEventListener('click', async function (event) {
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

// Evento Click Confirmar Pedido
document.getElementById('tablaCompras').addEventListener('click', function (event) {
    if (event.target.closest('.btnConfirmar')) {
        // Obtener la fila (tr) más cercana al botón
        const fila = $(event.target).closest('tr');

        // Obtener el ID del pedido y el estado desde DataTable
        const id_pedido = $('#tablaCompras').DataTable().row(fila).data().id_pedido;
        const estado = $('#tablaCompras').DataTable().row(fila).data().estado;

        // Verificar si el estado es "En Casa"
        if (estado === "En Casa") {
            // Mostrar una confirmación de notificación utilizando SweetAlert
            Swal.fire({
                title: '¿Estás seguro?',
                text: '¿Quieres notificar al artesano que tu pedido ya ha llegado a tu casa?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, Notificar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Envía la solicitud para notificar al artesano que el pedido llegó
                    fetch('/confirmar_entrega', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id_pedido: id_pedido })
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Ocurrió un error al notificar al artesano');
                            }
                            return response.json();
                        })
                        .then(data => {
                            // Muestra una alerta de SweetAlert cuando la notificación es enviada correctamente
                            Swal.fire({
                                icon: 'success',
                                title: '¡Notificación enviada!',
                                text: 'El artesano ha sido notificado que tu pedido ya llegó a tu casa.',
                                confirmButtonText: 'Aceptar'
                            })
                            listarCompras(id_usuario);
                        })
                        .catch(error => {
                            // Muestra una alerta de error en caso de fallo
                            Swal.fire({
                                icon: 'error',
                                title: 'Error al notificar',
                                text: error.message || 'Ocurrió un error al notificar al artesano.',
                                confirmButtonText: 'Aceptar'
                            });
                            console.error('Error al notificar al artesano:', error);
                        });
                }
            });
        } else {
            // Si el estado no es "En Casa", muestra un mensaje de advertencia
            Swal.fire({
                icon: 'warning',
                title: 'Acción no permitida',
                text: 'Solo puedes notificar la llegada del pedido una vez el estado sea "En Casa".',
                confirmButtonText: 'Aceptar'
            });
        }
    }
});




document.addEventListener('DOMContentLoaded', listarCompras(id_usuario));

