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
    const nombreArtesano = document.getElementById('nombreArtesano').value;
    const apellidoArtesano = document.getElementById('apellidoArtesano').value;
    const emailArtesano = document.getElementById('emailArtesano').value;
    const celularArtesano = document.getElementById('celularArtesano').value;
    const ciArtesano = document.getElementById('ciArtesano').value;
    const sexoArtesano = document.getElementById('sexoArtesano').value;
    const fotoArtesano = document.getElementById('fotoArtesano').value;
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
            especialidadArtesano:especialidadArtesano,
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
                text: error.message || 'Ocurrió un error al registrar el artesano',
                confirmButtonText: 'Aceptar'
            });
            console.error('Error al registrar el artesano:', error);
        });
});

// ELIMINAR CATEGORÍA
document.getElementById('tablaArtesano').addEventListener('click', function (event) {
    if (event.target.closest('.btnBorrar')) {
        // Obtener la fila (tr) más cercana al botón de eliminar
        const fila = $(event.target).closest('tr');

        // Obtener el ID de la categoría de la fila usando DataTable
        const artesanoId = $('#tablaArtesano').DataTable().row(fila).data().id_usuario;
        // Mostrar una confirmación de eliminación utilizando SweetAlert
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Quieres eliminar este artesano?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Envía la solicitud de eliminación al servidor Node.js
                fetch(`/eliminarArtesano/${artesanoId}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Ocurrió un error al eliminar el artesano');
                    }
                    return response.json();
                })
                .then(data => {
                    // Muestra una alerta de SweetAlert cuando se elimina la categoría correctamente
                    Swal.fire({
                        icon: 'success',
                        title: '¡Artesano eliminado!',
                        text: 'El artesano ha  sido eliminado correctamente',
                        confirmButtonText: 'Aceptar'
                    });

                    // Actualiza la tabla de categorías
                    listarArtesanos(); // Llama a tu función para listar las categorías actualizadas
                })
                .catch(error => {
                    // Muestra una alerta de SweetAlert cuando ocurre un error
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error.message || 'Ocurrió un error al eliminar al artesano',
                        confirmButtonText: 'Aceptar'
                    });
                    console.error('Error al eliminar el artesano:', error);
                });
            }
        });
    }
});

// ACTUALIZAR CATEGORÍA
/*document.getElementById('tablaArtesano').addEventListener('click', function (event) {
    const btnEditar = event.target.closest('.btnEditar');

    if (btnEditar) {
        // Obtener la fila (tr) más cercana al botón de editar
        const fila = $(btnEditar).closest('tr');

        // Obtener los datos de la categoría de la fila usando la API del DataTable
        const clienteData = $('#tablaArtesano').DataTable().row(fila).data();
        console.log(clienteData.nombre);

        // Comprobar si se obtuvo correctamente la categoría
        if (clienteData) {
            // Llenar el modal de actualización con los datos de la categoría
            document.getElementById('idArtesanoActualizar').value = clienteData.id_usuario;
            document.getElementById('nombreArtesanoActualizar').value = clienteData.nombre;
            document.getElementById('apellidoArtesanoActualizar').value = clienteData.apellido;
            document.getElementById('emailArtesanoActualizar').value = clienteData.email;
            document.getElementById('celularArtesanoActualizar').value = clienteData.numero_contacto;
            document.getElementById('ciArtesanoActualizar').value = clienteData.ci;
            document.getElementById('sexoArtesanoActualizar').value = clienteData.sexo;
            document.getElementById('fotoArtesanoActualizar').value = clienteData.fotoperf_url;
            document.getElementById('especialidadArtesanoActualizar').value = clienteData.especialidad_artesano;
            //document.getElementById('nroComunidadArtesanoActualizar').value = clienteData.nombrecom;
            document.getElementById('estado_c').value = clienteData.estado_registro;
            // Mostrar el modal de actualización
            $('#modalActualizarArtesano').modal('show');
        } else {
            console.error('No se pudo obtener los datos del artesano.');
        }
    }
});*/
/*document.getElementById('formActualizarArtesano').addEventListener('submit', function (event) {
    event.preventDefault();
    
    
    const idArtesano = document.getElementById('idArtesanoActualizar').value;
    const nombreArtesano = document.getElementById('nombreArtesanoActualizar').value;
    const apellidoArtesano = document.getElementById('apellidoArtesanoActualizar').value;
    const emailArtesano = document.getElementById('emailArtesanoActualizar').value;
    const celularArtesano = document.getElementById('celularArtesanoActualizar').value;
    const ciArtesano = document.getElementById('ciArtesanoActualizar').value;
    const sexoArtesano = document.getElementById('sexoArtesanoActualizar').value;
    const fotoArtesano = document.getElementById('fotoArtesanoActualizar').value;
    const especialidadArtesano = document.getElementById('especialidadArtesanoActualizar').value;
    const estadoArtesano = document.getElementById('estado_c').value;
    //const nroComunidadArtesano = document.getElementById('nroComunidadArtesanoActualizar').value;

    const datosCliente = {
        nombreArtesano: nombreArtesano,
        apellidoArtesano: apellidoArtesano,
        emailArtesano: emailArtesano,
        celularArtesano: celularArtesano,
        ciArtesano: ciArtesano,
        sexoArtesano: sexoArtesano,
        fotoArtesano: fotoArtesano,
        especialidadArtesano: especialidadArtesano,
        //nroComunidadArtesano: nroComunidadArtesano,
        estadoArtesano: estadoArtesano
    };

    // Mostrar los datos en la consola en formato JSON
    console.log('Datos que se están enviando:', JSON.stringify(datosCliente, null, 2));


    // Realizar la petición para actualizar la categoría
    fetch(`/artesano/${idArtesano}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombreArtesano: nombreArtesano,
            apellidoArtesano: apellidoArtesano,
            emailArtesano: emailArtesano,
            celularArtesano: celularArtesano,
            ciArtesano: ciArtesano,
            sexoArtesano: sexoArtesano,
            fotoArtesano: fotoArtesano,
            especialidadArtesano: especialidadArtesano,
            //nroComunidadArtesano: nroComunidadArtesano,
            estadoArtesano: estadoArtesano
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ocurrió un error al actualizar el artesano');
            }
            return response.json();
        })
        .then(data => {
            // Mostrar una alerta de éxito con SweetAlert
            Swal.fire({
                icon: 'success',
                title: '¡Artesano actualizado!',
                text: 'El artesano ha sido actualizado correctamente.',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                $('#modalActualizarArtesano').modal('hide'); // Cerrar el modal
            });

            // Limpiar el formulario después de la actualización
            document.getElementById('formActualizarArtesano').reset();

            listarArtesanos(); // Actualizar la lista de categorías
        })
        .catch(error => {
            // Mostrar una alerta de error con SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Ocurrió un error al actualizar el artesano',
                confirmButtonText: 'Aceptar'
            });
            console.error('Error al actualizar el artesano:', error);
        });
});*/

document.addEventListener('DOMContentLoaded', listarArtesanos);