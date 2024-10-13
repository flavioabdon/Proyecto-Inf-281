async function listarClientes() {
    try {
        const response = await fetch('/listarClientes'); // Ajusta esta URL según tu backend
        if (!response.ok) {
            throw new Error('No se pudieron cargar los datos de los clientes');
        }

        const clientes = await response.json(); // Convierte la respuesta a JSON

        // Limpiar la tabla antes de actualizar (verificar si ya está inicializada)
        $('#tablaCliente').DataTable().clear().destroy();

        // Inicializar DataTables con los datos actualizados
        $('#tablaCliente').DataTable({
            responsive: true,
            autoWidth: true,
            data: clientes,
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
                { data: 'direccion_envio' },
                { data: 'longitud' },
                { data: 'latitud' },
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
        console.error('Error al cargar los clientes:', error); // Manejo de errores
    }
}

// REGISTRAR CATEGORÍA
document.getElementById('formRegistrarClienteC').addEventListener('submit', function (event) {
    event.preventDefault();
    const nombreCliente = document.getElementById('nombreCliente').value;
    const apellidoCliente = document.getElementById('apellidoCliente').value;
    const emailCliente = document.getElementById('emailCliente').value;
    const celularCliente = document.getElementById('celularCliente').value;
    const ciCliente = document.getElementById('ciCliente').value;
    const sexoCliente = document.getElementById('sexoCliente').value;
    const fotoCliente = document.getElementById('fotoCliente').value;
    const direccionCliente = document.getElementById('direccionCliente').value;
    const latitud = document.getElementById('latitudCliente').value;
    const longitud = document.getElementById('longitudCliente').value;

    // Envía los datos al servidor Node.js
    fetch('/formRegistrarClienteC', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombreCliente: nombreCliente,
            apellidoCliente:apellidoCliente,
            emailCliente:emailCliente,
            celularCliente:celularCliente,
            ciCliente:ciCliente,
            sexoCliente:sexoCliente,
            fotoCliente:fotoCliente,
            direccionCliente:direccionCliente,
            latitud:latitud,
            longitud:longitud
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ocurrió un error al registrar el cliente');
            }
            return response.json().catch(() => {
                throw new Error('La respuesta no es un JSON válido');
            });
        })
        .then(data => {
            // Muestra una alerta de SweetAlert cuando se registra la categoría correctamente
            Swal.fire({
                icon: 'success',
                title: '¡Cliente registrado!',
                text: 'El cliente ha sido registrado correctamente',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                $('#modalAgregarCliente').modal('hide');
            });

            // Limpiar el formulario después de registrar la categoría
            document.getElementById('formRegistrarClienteC').reset();

            listarClientes(); // Llama a tu función para listar las categorías actualizadas
        })
        .catch(error => {
            // Muestra una alerta de SweetAlert cuando ocurre un error
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Ocurrió un error al registrar el cliente',
                confirmButtonText: 'Aceptar'
            });
            console.error('Error al registrar el cliente:', error);
        });
});

// ELIMINAR CATEGORÍA
document.getElementById('tablaCliente').addEventListener('click', function (event) {
    if (event.target.closest('.btnBorrar')) {
        // Obtener la fila (tr) más cercana al botón de eliminar
        const fila = $(event.target).closest('tr');

        // Obtener el ID de la categoría de la fila usando DataTable
        const clienteId = $('#tablaCliente').DataTable().row(fila).data().id_usuario;
        // Mostrar una confirmación de eliminación utilizando SweetAlert
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Quieres eliminar esta cliente?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Envía la solicitud de eliminación al servidor Node.js
                fetch(`/eliminarCliente/${clienteId}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Ocurrió un error al eliminar el cliente');
                    }
                    return response.json();
                })
                .then(data => {
                    // Muestra una alerta de SweetAlert cuando se elimina la categoría correctamente
                    Swal.fire({
                        icon: 'success',
                        title: '¡Cliente eliminado!',
                        text: 'El cliente ha  sido eliminado correctamente',
                        confirmButtonText: 'Aceptar'
                    });

                    // Actualiza la tabla de categorías
                    listarClientes(); // Llama a tu función para listar las categorías actualizadas
                })
                .catch(error => {
                    // Muestra una alerta de SweetAlert cuando ocurre un error
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error.message || 'Ocurrió un error al eliminar al cliente',
                        confirmButtonText: 'Aceptar'
                    });
                    console.error('Error al eliminar el cliente:', error);
                });
            }
        });
    }
});


// ACTUALIZAR CATEGORIA
// Evento para mostrar el modal con los datos de la categoría a actualizar
/*document.getElementById('tablaCliente').addEventListener('click', function (event) {
    const btnEditar = event.target.closest('.btnEditar');

    if (btnEditar) {
        // Obtener la fila (tr) más cercana al botón de editar
        const fila = $(btnEditar).closest('tr');

        // Obtener los datos de la categoría de la fila usando la API del DataTable
        const clienteData = $('#tablaCliente').DataTable().row(fila).data();

        // Comprobar si se obtuvo correctamente la categoría
        if (clienteData) {
            // Llenar el modal de actualización con los datos de la categoría
            document.getElementById('idClienteActualizar').value = clienteData.id_usuario;
            document.getElementById('nombreClienteActualizar').value = clienteData.nombre;
            document.getElementById('apellidoClienteActualizar').value = clienteData.apellido;
            document.getElementById('emailClienteActualizar').value = clienteData.email;
            document.getElementById('celularClienteActualizar').value = clienteData.numero_contacto;
            document.getElementById('ciClienteActualizar').value = clienteData.ci;
            document.getElementById('sexoClienteActualizar').value = clienteData.sexo;
            document.getElementById('fotoClienteActualizar').value = clienteData.fotoperf_url;
            document.getElementById('direccionClienteActualizar').value = clienteData.direccion_envio;
            document.getElementById('longitudClienteActualizar').value = clienteData.longitud;
            document.getElementById('latitudClienteActualizar').value = clienteData.latitud;
            document.getElementById('estado_c').value = clienteData.estado_registro;

            // Mostrar el modal de actualización
            $('#modalActualizarCliente').modal('show');
        } else {
            console.error('No se pudo obtener los datos del cliente.');
        }
    }
});*/
// Evento para actualizar la categoría al enviar el formulario
/*document.getElementById('formActualizarCliente').addEventListener('submit', function(event) {
    event.preventDefault();  // Evita que el formulario se envíe de manera tradicional

    // Obtener los valores de los campos del formulario
    const idCliente = document.getElementById('idClienteActualizar').value;
    const nombreCliente = document.getElementById('nombreClienteActualizar').value;
    const apellidoCliente = document.getElementById('apellidoClienteActualizar').value;
    const emailCliente = document.getElementById('emailClienteActualizar').value;
    const celularCliente = document.getElementById('celularClienteActualizar').value;
    const ciCliente = document.getElementById('ciClienteActualizar').value;
    const sexoCliente = document.getElementById('sexoClienteActualizar').value;
    const fotoCliente = document.getElementById('fotoClienteActualizar').value;
    const direccionCliente = document.getElementById('direccionClienteActualizar').value;
    const latitud = document.getElementById('latitudClienteActualizar').value;
    const longitud = document.getElementById('longitudClienteActualizar').value;
    const estadoCliente = document.getElementById('estado_c').value;

    // Crear el objeto JSON con los datos
    const clienteData = {
        nombreCliente: nombreCliente,
        apellidoCliente: apellidoCliente,
        emailCliente: emailCliente,
        celularCliente: celularCliente,
        ciCliente: ciCliente,
        sexoCliente: sexoCliente,
        fotoCliente: fotoCliente,
        direccionCliente: direccionCliente,
        latitud: latitud,
        longitud: longitud,
        estadoCliente: estadoCliente
    };

        // Enviar la solicitud PUT con los datos en formato JSON
        fetch(`/cliente/${idCliente}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clienteData) // Convertir el objeto a JSON
        })

        .then(response => {
            if (!response.ok) {
                throw new Error('Ocurrió un error al actualizar el cliente');
            }
            return response.json();
        })
        .then(data => {
            // Mostrar una alerta de éxito con SweetAlert
            Swal.fire({
                icon: 'success',
                title: '¡Cliente  actualizado!',
                text: 'El cliente ha sido actualizado correctamente.',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                $('#modalActualizarCliente').modal('hide'); // Cerrar el modal
            });

            // Limpiar el formulario después de la actualización
            document.getElementById('formActualizarCliente').reset();

            listarClientes(); // Actualizar la lista de categorías
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
});*/


document.addEventListener('DOMContentLoaded', listarClientes);