//LISTAR ALMACENES
async function listarAlmacenes() { // listarCategorias ---> listarAlmacenes
    try {
        const response = await fetch('/listarAlmacenes'); //ruta de view
        if (!response.ok) {
            throw new Error('No se pudieron cargar los datos de las categorías');
        }

        const almacenes = await response.json(); // Convierte la respuesta a JSON

        // Limpiar la tabla antes de actualizar
        $('#tablaAlmacen').DataTable().clear().destroy();

        // Inicializar DataTables con los datos actualizados
        $('#tablaAlmacen').DataTable({
            responsive: true,
            autoWidth: true,
            data: almacenes,
            columns: [
                { data: 'numero_registro' },
                { data: 'id_almacen' },
                { data: 'cod_almacen' },
                { data: 'direccion_almacen' },
                { data: 'capacidad_unid'},
                {
                    data: 'estado_registro',
                    render: function (data) {
                        return data === 'Activo'
                            ? '<span class="badge badge-success">Activo</span>' // Badge verde
                            : '<span class="badge badge-danger">Inactivo</span>'; // Badge rojo
                    }
                },
                {
                    data: null, // Sin datos directos para esta columna
                    defaultContent: `
                        <div class='text-center'>
                            <div class='btn-group'>
                                <button title='Editar' class='btn btn-primary btn-sm btnEditar'>
                                    <i class='fas fa-edit'></i> <!-- Usando Font Awesome -->
                                </button>
                                <button title='Eliminar' class='btn btn-danger btn-sm btnBorrar'>
                                    <i class='fas fa-trash-alt'></i> <!-- Usando Font Awesome -->
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
                    visible: false // Cambia a false si deseas ocultar
                },
                {
                    targets: [0, 4, 5, 6], // Cambia los índices según las columnas que deseas centrar
                    className: 'text-center' // Añade la clase para centrar
                }
            ]
        });
    } catch (error) {
        console.error('Error al cargar las categorías:', error); // Manejo de errores
    }
}

// REGISTRAR ALMACEN
document.getElementById('formRegistrarAlmacen').addEventListener('submit', function (event) {
    event.preventDefault();
    //alert("Hola RUDOLHP");

    const codAlmacen = document.getElementById('codAlmacen').value;  // nombreCategoria ---> codAlmacen
    const direccionAlmacen = document.getElementById('direccionAlmacen').value;   // descripcionCategoria ---> direccionAlmacen
    const capacidadAlmacen = document.getElementById('capacidadAlmacen').value;     // iconoCategoria ---> capacidadAlmacen

    // Envía los datos al servidor Node.js
    fetch('/formRegistrarAlmacen', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            codAlmacen: codAlmacen,
            direccionAlmacen: direccionAlmacen,
            capacidadAlmacen: capacidadAlmacen
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ocurrió un error al registrar el almacen');
            }
            return response.json();
        })
        .then(data => {
            // Muestra una alerta de SweetAlert cuando se registra el almacen correctamente
            Swal.fire({
                icon: 'success',
                title: 'Almacen registrado!',
                text: 'El almacen ha sido registrada correctamente',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                $('#modalAgregarAlmacen').modal('hide');
            });

            // Limpiar el formulario después de registrar la categoría
            document.getElementById('formRegistrarAlmacen').reset();

            listarAlmacenes(); // Llama a tu función para listar las categorías actualizadas
        })
        .catch(error => {
            // Muestra una alerta de SweetAlert cuando ocurre un error
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Ocurrió un error al registrar el almacen',
                confirmButtonText: 'Aceptar'
            });
            console.error('Error al registrar el almacen:', error);
        });
});

// ACTUALIZAR ALMACEN
// Evento para mostrar el modal con los datos deL almacen a actualizar
document.getElementById('tablaAlmacen').addEventListener('click', function (event) {
    const btnEditar = event.target.closest('.btnEditar');
    //alert("holaaaaaa");
    if (btnEditar) {
        // Obtener la fila (tr) más cercana al botón de editar
        const fila = $(btnEditar).closest('tr');

        // Obtener los datos del almacen de la fila usando la API del DataTable
        const almacenData = $('#tablaAlmacen').DataTable().row(fila).data();

        // Comprobar si se obtuvo correctamente el almacen
        if (almacenData) {
            // Llenar el modal de actualización con los datos de la categoría
            document.getElementById('idAlmacenActualizar').value = almacenData.id_almacen;
            document.getElementById('codAlmacenActualizar').value = almacenData.cod_almacen;
            console.log(almacenData.cod_Almacen);
            document.getElementById('direccionAlmacenActualizar').value = almacenData.direccion_almacen;
            document.getElementById('capacidadAlmacenActualizar').value = almacenData.capacidad_unid;

            // Mostrar el modal de actualización
            $('#modalActualizarAlmacen').modal('show');
        } else {
            console.error('No se pudo obtener los datos del almacen.');
        }
    }
});

// Evento para actualizar el almacen al enviar el formulario
document.getElementById('formActualizarAlmacen').addEventListener('submit', function (event) {
    event.preventDefault();

    const idAlmacen = document.getElementById('idAlmacenActualizar').value;
    const codAlmacen = document.getElementById('codAlmacenActualizar').value;
    const direccionAlmacen = document.getElementById('direccionAlmacenActualizar').value;
    const capacidadAlmacen = document.getElementById('capacidadAlmacenActualizar').value;

   

    // Realizar la petición para actualizar el almacen
    fetch(`/almacen/${idAlmacen}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            codAlmacen: codAlmacen,
            direccionAlmacen: direccionAlmacen,
            capacidadAlmacen: capacidadAlmacen
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ocurrió un error al actualizar el almacen');
            }
            return response.json();
        })
        .then(data => {
            // Mostrar una alerta de éxito con SweetAlert
            Swal.fire({
                icon: 'success',
                title: '¡Almacen actualizado!',
                text: 'El almacen ha sido actualizada correctamente.',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                $('#modalActualizarAlmacen').modal('hide'); // Cerrar el modal
            });

            // Limpiar el formulario después de la actualización
            document.getElementById('formActualizarAlmacen').reset();

            listarAlmacenes(); // Actualizar la lista de almacenes
        })
        .catch(error => {
            // Mostrar una alerta de error con SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Ocurrió un error al actualizar el almacen',
                confirmButtonText: 'Aceptar'
            });
            console.error('Error al actualizar el almacen:', error);
        });
});

// ELIMINAR CATEGORÍA
document.getElementById('tablaAlmacen').addEventListener('click', function (event) {
    if (event.target.closest('.btnBorrar')) {
        // Obtener la fila (tr) más cercana al botón de eliminar
        const fila = $(event.target).closest('tr');

        // Obtener el ID de la categoría de la fila usando DataTable
        const almacenId = $('#tablaAlmacen').DataTable().row(fila).data().id_almacen;
        // Mostrar una confirmación de eliminación utilizando SweetAlert
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Quieres eliminar esta categoría?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Envía la solicitud de eliminación al servidor Node.js
                fetch(`/eliminarAlmacen/${almacenId}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Ocurrió un error al eliminar la categoría');
                    }
                    return response.json();
                })
                .then(data => {
                    // Muestra una alerta de SweetAlert cuando se elimina el almacen correctamente
                    Swal.fire({
                        icon: 'success',
                        title: '¡Almacen eliminado!',
                        text: 'El almacen ha sido eliminada correctamente',
                        confirmButtonText: 'Aceptar'
                    });

                    // Actualiza la tabla de almacenes
                    listarAlmacenes(); // Llama a tu función para listar los almacenes actualizados
                })
                .catch(error => {
                    // Muestra una alerta de SweetAlert cuando ocurre un error
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error.message || 'Ocurrió un error al eliminar el almacen',
                        confirmButtonText: 'Aceptar'
                    });
                    console.error('Error al eliminar el almacen:', error);
                });
            }
        });
    }
});


// Llama a la función al cargar la página
document.addEventListener('DOMContentLoaded', listarAlmacenes);

