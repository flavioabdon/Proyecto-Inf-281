//LISTAR CATEGORIAS
async function listarCategorias() {
    try {
        const response = await fetch('/listarCategorias'); //ruta de view
        if (!response.ok) {
            throw new Error('No se pudieron cargar los datos de las categorías');
        }

        const categorias = await response.json(); // Convierte la respuesta a JSON

        // Limpiar la tabla antes de actualizar
        $('#tablaCategoria').DataTable().clear().destroy();

        // Inicializar DataTables con los datos actualizados
        $('#tablaCategoria').DataTable({
            responsive: true,
            autoWidth: true,
            data: categorias,
            columns: [
                { data: 'numero_registro' },
                { data: 'id_categoria' },
                { data: 'nombre_categoria' },
                { data: 'descripcion' },
                {
                    data: 'url_icon_categoria',
                    render: function (data) {
                        return `
                            <button type="button" class="btn btn-primary icon-option" disabled>
                                <i class="${data} fa-sm"></i>
                            </button>
                        `;
                    }
                },
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


// REGISTRAR CATEGORÍA
document.getElementById('formRegistrarCategoria').addEventListener('submit', function (event) {
    event.preventDefault();

    const nombreCategoria = document.getElementById('nombreCategoria').value;
    const descripcionCategoria = document.getElementById('descripcionCategoria').value;
    const iconoCategoria = document.getElementById('iconoCategoria').value; 

    // Validación del campo oculto (iconoCategoria)
    if (!iconoCategoria) {
        Swal.fire({
            icon: 'warning',
            title: 'Campo obligatorio',
            text: 'El ícono de la categoría es obligatorio.',
            confirmButtonText: 'Aceptar'
        });
        return; // Detiene el envío del formulario
    }

    // Envía los datos al servidor Node.js
    fetch('/formRegistrarCategoria', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombreCategoria: nombreCategoria,
            descripcionCategoria: descripcionCategoria,
            iconoCategoria: iconoCategoria
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ocurrió un error al registrar la categoría');
            }
            return response.json();
        })
        .then(data => {
            // Muestra una alerta de SweetAlert cuando se registra la categoría correctamente
            Swal.fire({
                icon: 'success',
                title: '¡Categoría registrada!',
                text: 'La categoría ha sido registrada correctamente',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                $('#modalAgregarCategoria').modal('hide');
            });

            // Limpiar el formulario después de registrar la categoría
            document.getElementById('formRegistrarCategoria').reset();

            listarCategorias(); // Llama a tu función para listar las categorías actualizadas
        })
        .catch(error => {
            // Muestra una alerta de SweetAlert cuando ocurre un error
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Ocurrió un error al registrar la categoría',
                confirmButtonText: 'Aceptar'
            });
            console.error('Error al registrar la categoría:', error);
        });
});

// ACTUALIZAR CATEGORIA
// Evento para mostrar el modal con los datos de la categoría a actualizar
document.getElementById('tablaCategoria').addEventListener('click', function (event) {
    const btnEditar = event.target.closest('.btnEditar');

    if (btnEditar) {
        // Obtener la fila (tr) más cercana al botón de editar
        const fila = $(btnEditar).closest('tr');

        // Obtener los datos de la categoría de la fila usando la API del DataTable
        const categoriaData = $('#tablaCategoria').DataTable().row(fila).data();

        // Comprobar si se obtuvo correctamente la categoría
        if (categoriaData) {
            // Llenar el modal de actualización con los datos de la categoría
            document.getElementById('idCategoriaActualizar').value = categoriaData.id_categoria;
            document.getElementById('nombreCategoriaActualizar').value = categoriaData.nombre_categoria;
            document.getElementById('descripcionCategoriaActualizar').value = categoriaData.descripcion;
            document.getElementById('iconoCategoriaActualizar').value = categoriaData.url_icon_categoria;

            // Mostrar el modal de actualización
            $('#modalActualizarCategoria').modal('show');
        } else {
            console.error('No se pudo obtener los datos de la categoría.');
        }
    }
});

// Evento para actualizar la categoría al enviar el formulario
document.getElementById('formActualizarCategoria').addEventListener('submit', function (event) {
    event.preventDefault();

    const idCategoria = document.getElementById('idCategoriaActualizar').value;
    const nombreCategoria = document.getElementById('nombreCategoriaActualizar').value;
    const descripcionCategoria = document.getElementById('descripcionCategoriaActualizar').value;
    const iconoCategoria = document.getElementById('iconoCategoriaActualizar').value;

   

    // Realizar la petición para actualizar la categoría
    fetch(`/categoria/${idCategoria}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombreCategoria: nombreCategoria,
            descripcionCategoria: descripcionCategoria,
            iconoCategoria: iconoCategoria
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ocurrió un error al actualizar la categoría');
            }
            return response.json();
        })
        .then(data => {
            // Mostrar una alerta de éxito con SweetAlert
            Swal.fire({
                icon: 'success',
                title: '¡Categoría actualizada!',
                text: 'La categoría ha sido actualizada correctamente.',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                $('#modalActualizarCategoria').modal('hide'); // Cerrar el modal
            });

            // Limpiar el formulario después de la actualización
            document.getElementById('formActualizarCategoria').reset();

            listarCategorias(); // Actualizar la lista de categorías
        })
        .catch(error => {
            // Mostrar una alerta de error con SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Ocurrió un error al actualizar la categoría',
                confirmButtonText: 'Aceptar'
            });
            console.error('Error al actualizar la categoría:', error);
        });
});




// Llama a la función al cargar la página
document.addEventListener('DOMContentLoaded', listarCategorias);

