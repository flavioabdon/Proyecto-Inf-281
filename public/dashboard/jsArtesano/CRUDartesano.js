async function listarArtesanos() {
    try {
        const response = await fetch('/listarArtesanos'); // Ajusta esta URL según tu backend
        if (!response.ok) {
            throw new Error('No se pudieron cargar los datos de los artesanos');
        }

        const artesanos = await response.json(); // Convierte la respuesta a JSON

        // Limpiar la tabla antes de actualizar (verificar si ya está inicializada)
        if ($.fn.DataTable.isDataTable('#tablaArtesano')) {
            $('#tablaArtesano').DataTable().clear().destroy();
        }

        // Inicializar DataTables con los datos actualizados
        $('#tablaArtesano').DataTable({
            responsive: true,
            autoWidth: true,
            data: artesanos,
            columns: [
                { data: 'numero_registro' },
                { data: 'id_usuario' },
                { data: 'nombre' },
                { data: 'apellido' },
                { data: 'email' },
                { data: 'numero_contacto' },
                { data: 'ci' },
                { data: 'sexo' },
                { data: 'fotoperf_url' },
                { data: 'fecha_creacion' },
                { data: 'fecha_modificacion' },
                { data: 'usuario_creacion' },
                { data: 'usuario_modificacion' },
                { data: 'especialidad_artesano' },
                { data: 'nombrecom' },
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
                                    <i class='fas fa-edit'></i>
                                </button>
                                <button title='Eliminar' class='btn btn-danger btn-sm btnBorrar'>
                                    <i class='fas fa-trash-alt'></i>
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
        console.error('Error al cargar los artesanos:', error); // Manejo de errores
    }
}
// REGISTRAR CATEGORÍA
document.getElementById('formRegistrarArtesano').addEventListener('submit', function (event) {
    event.preventDefault();
    const nombreArtesano = document.getElementById('nombreCliente').value;
    const apellidoArtesano = document.getElementById('apellidoCliente').value;
    const emailArtesano = document.getElementById('emailCliente').value;
    const celularArtesano = document.getElementById('celularCliente').value;
    const ciArtesano = document.getElementById('ciCliente').value;
    const sexoArtesano = document.getElementById('sexoCliente').value;
    const fotoArtesano = document.getElementById('fotoCliente').value;
    const especialidadArtesano = document.getElementById('especialidadArtesano').value;
    const nroComunidad = document.getElementById('nroComunidad').value;

    // Envía los datos al servidor Node.js
    fetch('/formRegistrarArtesano', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombreArtesano: nombreArtesano,
            apellidoArtesano:apellidoArtesano,
            emailArtesano:emailArtesano,
            celularArtesano:celularArtesano,
            ciArtesano:ciArtesano,
            sexoArtesano:sexoArtesano,
            fotoArtesano:fotoArtesano,
            especialidad:especialidadArtesano,
            nroComunidad:nroComunidad
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ocurrió un error al registrar el artesano');
            }
            return response.json().catch(() => {
                throw new Error('La respuesta no es un JSON válido');
            });
        })
        .then(data => {
            // Muestra una alerta de SweetAlert cuando se registra la categoría correctamente
            Swal.fire({
                icon: 'success',
                title: '¡Artesano registrado!',
                text: 'El artesano ha sido registrado correctamente',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                $('#modalAgregarArtesano').modal('hide');
            });

            // Limpiar el formulario después de registrar la categoría
            document.getElementById('formRegistrarArtesano').reset();

            listarArtesanos(); // Llama a tu función para listar las categorías actualizadas
        })
        .catch(error => {
            // Muestra una alerta de SweetAlert cuando ocurre un error
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Ocurrió un error al registrar el cliente',
                confirmButtonText: 'Aceptar'
            });
            console.error('Error al registrar el artesano:', error);
        });
});

// Llamar a la función listarClientes cuando la página esté lista
$(document).ready(function() {
    listarArtesanos();
});