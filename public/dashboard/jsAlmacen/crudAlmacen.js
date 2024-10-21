//LISTAR
async function listarAlmacenes() { // listarAlmacenes
    try {
        const response = await fetch('/listarAlmacenes'); //ruta de view
        if (!response.ok) {
            throw new Error('No se pudieron cargar los datos de la lista de almacenes');
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
                { data: 'nombre_almacen' },
                { data: 'direccion_almacen' },
                {
                    data: 'capacidad_unid',
                    render: function (data) {
                        return `<span class="badge badge-pill badge-info">${data}</span>`;
                    }
                },
                {
                    data: 'estado_registro',
                    render: function (data) {
                        return data === 'activo'
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
                    targets: [0, 4], // Cambia los índices según las columnas que deseas centrar
                    className: 'text-left' // Añade la clase para centrar
                }
            ]
        });
    } catch (error) {
        console.error('Error al cargar los almacenes:', error); // Manejo de errores
    }
}

// REGISTRAR 
document.getElementById('formRegistrarAlmacen').addEventListener('submit', function (event) {
    event.preventDefault();
   

    const nombreAlmacen = document.getElementById('nombreAlmacen').value;  
    const direccionAlmacen = document.getElementById('direccionAlmacen').value;  
    const capacidadAlmacen = document.getElementById('capacidadAlmacen').value;   

    // Envía los datos al servidor Node.js
    fetch('/formRegistrarAlmacen', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombreAlmacen: nombreAlmacen,
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
                text: 'El almacen ha sido registrado correctamente',
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

// ----------------ACTUALIZAR ------------
// Evento para mostrar el modal con los datos deL almacen a actualizar
document.getElementById('tablaAlmacen').addEventListener('click', function (event) {
    const btnEditar = event.target.closest('.btnEditar');
   
    if (btnEditar) {
        // Obtener la fila (tr) más cercana al botón de editar
        const fila = $(btnEditar).closest('tr');

        // Obtener los datos del almacen de la fila usando la API del DataTable
        const almacenData = $('#tablaAlmacen').DataTable().row(fila).data();

        // Comprobar si se obtuvo correctamente el almacen
        if (almacenData) {
            // Llenar el modal de actualización con los datos de la categoría
            document.getElementById('idAlmacenActualizar').value = almacenData.id_almacen;
            document.getElementById('nombreAlmacenActualizar').value = almacenData.nombre_almacen;
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
    const nombreAlmacen = document.getElementById('nombreAlmacenActualizar').value;
    const direccionAlmacen = document.getElementById('direccionAlmacenActualizar').value;
    const capacidadAlmacen = document.getElementById('capacidadAlmacenActualizar').value;



    // Realizar la petición para actualizar el almacen
    fetch(`/actualizarAlmacen/${idAlmacen}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombreAlmacen: nombreAlmacen,
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
                text: 'El almacen ha sido actualizado correctamente.',
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
// -----------------FIN ACTUALIZAR--------------


// ELIMINAR 
document.getElementById('tablaAlmacen').addEventListener('click', function (event) {
    if (event.target.closest('.btnBorrar')) {
        // Obtener la fila (tr) más cercana al botón de eliminar
        const fila = $(event.target).closest('tr');

        // Obtener el ID a de la fila usando DataTable
        const almacenId = $('#tablaAlmacen').DataTable().row(fila).data().id_almacen;
        // Mostrar una confirmación de eliminación utilizando SweetAlert
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Quieres eliminar este almacen?',
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
                            throw new Error('Ocurrió un error al eliminar el almacen');
                        }
                        return response.json();
                    })
                    .then(data => {
                        // Muestra una alerta de SweetAlert cuando se elimina el almacen correctamente
                        Swal.fire({
                            icon: 'success',
                            title: '¡Almacen eliminado!',
                            text: 'El almacen ha sido eliminado correctamente',
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

    