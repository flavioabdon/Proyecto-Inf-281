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
                        // Devuelve un botón deshabilitado con el ícono correspondiente
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
    const iconoCategoria = document.getElementById('iconoCategoria').value; // Asumiendo que obtienes el ícono de un campo

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


// Llama a la función al cargar la página
document.addEventListener('DOMContentLoaded', listarCategorias);

