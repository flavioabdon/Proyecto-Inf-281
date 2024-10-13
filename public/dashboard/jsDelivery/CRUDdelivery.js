async function listarDeliverys() {
    try {
        const response = await fetch('/listarDeliverys'); // Ajusta esta URL según tu backend
        if (!response.ok) {
            throw new Error('No se pudieron cargar los datos de los deliverys');
        }

        const deliverys = await response.json(); // Convierte la respuesta a JSON

        // Limpiar la tabla antes de actualizar (verificar si ya está inicializada)
        if ($.fn.DataTable.isDataTable('#tablaDelivery')) {
            $('#tablaDelivery').DataTable().clear().destroy();
        }

        // Inicializar DataTables con los datos actualizados
        $('#tablaDelivery').DataTable({
            responsive: true,
            autoWidth: true,
            data: deliverys,
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
                { data: 'tipo_vehiculo' },
                { data: 'matricula_vehiculo' },
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
        console.error('Error al cargar los deliverys:', error); // Manejo de errores
    }
}

$(document).ready(function() {
    listarDeliverys();
});


// REGISTRAR CATEGORÍA
document.getElementById('formRegistrarDelivery').addEventListener('submit', function (event) {
    event.preventDefault();
    const nombreDelivery = document.getElementById('nombreDelivery').value;
    const apellidoDelivery = document.getElementById('apellidoDelivery').value;
    const emailDelivery = document.getElementById('emailDelivery').value;
    const celularDelivery = document.getElementById('celularDelivery').value;
    const ciDelivery = document.getElementById('ciDelivery').value;
    const sexoDelivery = document.getElementById('sexoDelivery').value;
    const fotoDelivery = document.getElementById('fotoDelivery').value;
    const vehiculoDelivery = document.getElementById('vehiculoDelivery').value;
    const matriculaDelivery = document.getElementById('matriculaDelivery').value;

    // Envía los datos al servidor Node.js
    fetch('/formRegistrarDelivery', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombreDelivery: nombreDelivery,
            apellidoDelivery:apellidoDelivery,
            emailDelivery:emailDelivery,
            celularDelivery:celularDelivery,
            ciDelivery:ciDelivery,
            sexoDelivery:sexoDelivery,
            fotoDelivery:fotoDelivery,
            vehiculoDelivery:vehiculoDelivery,
            matriculaDelivery:matriculaDelivery
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ocurrió un error al registrar el delivery');
            }
            return response.json().catch(() => {
                throw new Error('La respuesta no es un JSON válido');
            });
        })
        .then(data => {
            // Muestra una alerta de SweetAlert cuando se registra la categoría correctamente
            Swal.fire({
                icon: 'success',
                title: '¡Delivery registrado!',
                text: 'El delivery ha sido registrado correctamente',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                $('#modalAgregarDelivery').modal('hide');
            });

            // Limpiar el formulario después de registrar la categoría
            document.getElementById('formRegistrarDelivery').reset();

            listarDeliverys(); // Llama a tu función para listar las categorías actualizadas
        })
        .catch(error => {
            // Muestra una alerta de SweetAlert cuando ocurre un error
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Ocurrió un error al registrar el delivery',
                confirmButtonText: 'Aceptar'
            });
            console.error('Error al registrar el delivery:', error);
        });
});

// ELIMINAR CATEGORÍA
document.getElementById('tablaDelivery').addEventListener('click', function (event) {
    if (event.target.closest('.btnBorrar')) {
        // Obtener la fila (tr) más cercana al botón de eliminar
        const fila = $(event.target).closest('tr');

        // Obtener el ID de la categoría de la fila usando DataTable
        const deliveryId = $('#tablaDelivery').DataTable().row(fila).data().id_usuario;
        // Mostrar una confirmación de eliminación utilizando SweetAlert
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Quieres eliminar este delivery?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Envía la solicitud de eliminación al servidor Node.js
                fetch(`/eliminarDelivery/${deliveryId}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Ocurrió un error al eliminar el delivery');
                    }
                    return response.json();
                })
                .then(data => {
                    // Muestra una alerta de SweetAlert cuando se elimina la categoría correctamente
                    Swal.fire({
                        icon: 'success',
                        title: '¡Delivery eliminado!',
                        text: 'El delivery ha  sido eliminado correctamente',
                        confirmButtonText: 'Aceptar'
                    });

                    // Actualiza la tabla de categorías
                    listarDeliverys(); // Llama a tu función para listar las categorías actualizadas
                })
                .catch(error => {
                    // Muestra una alerta de SweetAlert cuando ocurre un error
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error.message || 'Ocurrió un error al eliminar al delivery',
                        confirmButtonText: 'Aceptar'
                    });
                    console.error('Error al eliminar el delivery:', error);
                });
            }
        });
    }
});
//-----ACTUALIZAR DELIVERYS
/*document.getElementById('tablaDelivery').addEventListener('click', function (event) {
    const btnEditar = event.target.closest('.btnEditar');

    if (btnEditar) {
        // Obtener la fila (tr) más cercana al botón de editar
        const fila = $(btnEditar).closest('tr');

        // Obtener los datos de la categoría de la fila usando la API del DataTable
        const clienteData = $('#tablaDelivery').DataTable().row(fila).data();
        console.log(clienteData.nombre);

        // Comprobar si se obtuvo correctamente la categoría
        if (clienteData) {
            // Llenar el modal de actualización con los datos de la categoría
            document.getElementById('idDeliveryActualizar').value = clienteData.id_usuario;
            document.getElementById('nombreDeliveryActualizar').value = clienteData.nombre;
            document.getElementById('apellidoDeliveryActualizar').value = clienteData.apellido;
            document.getElementById('emailDeliveryActualizar').value = clienteData.email;
            document.getElementById('celularDeliveryActualizar').value = clienteData.numero_contacto;
            document.getElementById('ciDeliveryActualizar').value = clienteData.ci;
            document.getElementById('sexoDeliveryActualizar').value = clienteData.sexo;
            document.getElementById('fotoDeliveryActualizar').value = clienteData.fotoperf_url;
            document.getElementById('vehiculoDeliveryActualizar').value = clienteData.tipo_vehiculo;
            document.getElementById('matriculaDeliveryActualizar').value = clienteData.matricula_vehiculo;
            document.getElementById('estado_c').value = clienteData.estado_registro;
            // Mostrar el modal de actualización
            $('#modalActualizarDelivery').modal('show');
        } else {
            console.error('No se pudo obtener los datos del delivery.');
        }
    }
});*/
/*document.getElementById('formActualizarDelivery').addEventListener('submit', function (event) {
    event.preventDefault();
    
    
    const idDelivery = document.getElementById('idDeliveryActualizar').value;
    const nombreDelivery = document.getElementById('nombreDeliveryActualizar').value;
    const apellidoDelivery = document.getElementById('apellidoDeliveryActualizar').value;
    const emailDelivery = document.getElementById('emailDeliveryActualizar').value;
    const celularDelivery = document.getElementById('celularDeliveryActualizar').value;
    const ciDelivery = document.getElementById('ciDeliveryActualizar').value;
    const sexoDelivery = document.getElementById('sexoDeliveryActualizar').value;
    const fotoDelivery = document.getElementById('fotoDeliveryActualizar').value;
    const vehiculoDelivery = document.getElementById('vehiculoDeliveryActualizar').value;
    const estadoDelivery = document.getElementById('estado_c').value;
    const matriculaDelivery = document.getElementById('matriculaDeliveryActualizar').value;

    const datosCliente = {
        nombreDelivery: nombreDelivery,
        apellidoDelivery: apellidoDelivery,
        emailDelivery: emailDelivery,
        celularDelivery: celularDelivery,
        ciDelivery: ciDelivery,
        sexoDelivery: sexoDelivery,
        fotoDelivery: fotoDelivery,
        vehiculoDelivery: vehiculoDelivery,
        matriculaDelivery: matriculaDelivery,
        estadoDelivery: estadoDelivery
    };

    // Mostrar los datos en la consola en formato JSON
    console.log('Datos que se están enviando:', JSON.stringify(datosCliente, null, 2));


    // Realizar la petición para actualizar la categoría
    fetch(`/delivery/${idDelivery}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombreDelivery: nombreDelivery,
            apellidoDelivery: apellidoDelivery,
            emailDelivery: emailDelivery,
            celularDelivery: celularDelivery,
            ciDelivery: ciDelivery,
            sexoDelivery: sexoDelivery,
            fotoDelivery: fotoDelivery,
            vehiculoDelivery: vehiculoDelivery,
            matriculaDelivery: matriculaDelivery,
            estadoDelivery: estadoDelivery
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ocurrió un error al actualizar el delivery');
            }
            return response.json();
        })
        .then(data => {
            // Mostrar una alerta de éxito con SweetAlert
            Swal.fire({
                icon: 'success',
                title: '¡Delivery actualizado!',
                text: 'El delivery ha sido actualizado correctamente.',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                $('#modalActualizarDelivery').modal('hide'); // Cerrar el modal
            });

            // Limpiar el formulario después de la actualización
            document.getElementById('formActualizarDelivery').reset();

            listarDeliverys(); // Actualizar la lista de categorías
        })
        .catch(error => {
            // Mostrar una alerta de error con SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Ocurrió un error al actualizar el delivery',
                confirmButtonText: 'Aceptar'
            });
            console.error('Error al actualizar el delivery:', error);
        });
});*/
document.addEventListener('DOMContentLoaded', listarDeliverys);
