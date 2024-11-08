
const usuarioGuardado = JSON.parse(sessionStorage.getItem('usuario'));
const id_usuario = usuarioGuardado.id_usuario;


// Función para listar ventas de un artesano
async function listarVentas(id_usuario) {
    try {
        // Realizamos una solicitud GET para obtener las ventas del artesano
        const response = await fetch(`/listarVentasArtesano/${id_usuario}`); // Cambiar la URL según tu enrutamiento
        if (!response.ok) {
            throw new Error('No se pudieron cargar las ventas');
        }

        const ventas = await response.json(); // Convierte la respuesta a JSON

        // Limpiar la tabla antes de actualizar
        $('#tablaVentas').DataTable().clear().destroy();

        // Inicializar DataTables con los datos actualizados
        $('#tablaVentas').DataTable({
            responsive: true,
            autoWidth: true,
            data: ventas,
            columns: [
                { data: 'num_fila' }, // Columna para número de fila
                { data: 'id_pedido' },
                { data: 'datos_cliente' },
                {
                    data: 'estado',
                    render: function (data) {
                        // Si el estado es NULL, reemplazamos con un badge naranja "EN CAMINO" y un ícono de entrega
                        if (data === null) {
                            return `
                                <span class="badge badge-warning" style="text-transform: uppercase;">
                                    <i class="fas fa-truck" style="margin-right: 5px;"></i> EN CAMINO
                                </span>
                            `;
                        }
                        // Si el estado no es NULL, mostramos el estado original con un badge correspondiente
                        return `<span class="badge badge-${getBadgeClass(data)}" style="text-transform: uppercase;">${data}</span>`;
                    }
                },
                {
                    data: 'suma_total',
                    render: function (data) {
                        // Usamos un badge cuadrado con el texto 'Bs.' delante del valor
                        return `<span class="badge badge-success" style="border-radius: 0; padding: 8px 12px;">Bs. ${data}</span>`;
                    }
                },

                {
                    data: null, // Sin datos directos para esta columna
                    defaultContent: ` 
                        <div class='text-center'>
                            <div class='btn-group'>
                                <!-- Botón de detalles con ícono -->
                                <button title='Ver detalles' class='btn btn-info btn-sm btnDetalles'>
                                    <i class='fas fa-info-circle'></i> Detalles
                                </button>
                            </div>
                        </div>`
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
                    targets: [0, 2, 4], // Centrar columnas
                    className: 'text-left'
                }
            ]
        });
    } catch (error) {
        console.error('Error al cargar las ventas del artesano:', error);
    }
}


document.getElementById('tablaVentas').addEventListener('click', async function (event) {
    if (event.target.closest('.btnDetalles')) {
        // Obtener la fila (tr) más cercana al botón de detalles
        const fila = $(event.target).closest('tr');

        // Obtener los datos de la fila seleccionada desde DataTable
        const ventasData = $('#tablaVentas').DataTable().row(fila).data();

        if (ventasData) {
            const id_pedido = ventasData.id_pedido;

            // Mostrar el modal de detalles
            $('#modalDetalleVentas').modal('show');

            try {
                // Realizamos una solicitud GET para obtener los detalles de ventas del artesano
                const response = await fetch(`/listarDetalleVentasArtesano/${id_usuario}/${id_pedido}`);
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

