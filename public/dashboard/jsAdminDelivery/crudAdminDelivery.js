

// LISTAR DELIVERIES
async function listarDeliveries() {
    try {
        const response = await fetch('/listarAdminDeliveries'); // Cambia la ruta según corresponda
        if (!response.ok) {
            throw new Error('No se pudieron cargar los datos de los deliveries');
        }

        const deliveries = await response.json(); // Convierte la respuesta a JSON

        // Limpiar la tabla antes de actualizar
        $('#tablaDelivery').DataTable().clear().destroy();

        // Inicializar DataTables con los datos actualizados
        $('#tablaDelivery').DataTable({
            responsive: true,
            autoWidth: true,
            data: deliveries,
            columns: [
                { data: 'numero_registro' },
                { data: 'id_usuario' },
                { data: 'ci' },
                { data: 'nombre' },
                { data: 'apellido' },
                { data: 'email' },
                { data: 'tipo_vehiculo' },  // Vehículo del delivery
                { data: 'matricula_vehiculo' },  // Placa del vehículo
                { data: 'numero_contacto' },
                { data: 'sexo' },
                {
                    data: 'fotoperf_url',
                    render: function (data) {
                        const imagePath = data.replace(/\\/g, '/');
                        return `
                                <div style="display: flex; align-items: center; justify-content: center;">
                                    <img src="${imagePath}" 
                                        alt="Foto de Perfil" 
                                        style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid #ccc;">
                                </div>
                                `;
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
                    targets: [0, 2, 7, 8, 9], // Cambia los índices según las columnas que deseas centrar
                    className: 'text-left'
                }
            ]
        });
    } catch (error) {
        console.error('Error al cargar los deliveries:', error); // Manejo de errores
    }
}


// REGISTRAR DELIVERY
document.getElementById('formRegistrarDelivery').addEventListener('submit', function (event) {
    event.preventDefault();

    // Extraer los valores de los campos del formulario
    const nombreDelivery = document.getElementById('nombreDelivery').value;
    const fotoDelivery = document.getElementById('fotoDelivery').files[0]; // Para manejar archivos
    const apellidoDelivery = document.getElementById('apellidoDelivery').value;
    const ciDelivery = document.getElementById('ciDelivery').value;
    const emailDelivery = document.getElementById('emailDelivery').value;
    const celularDelivery = document.getElementById('celularDelivery').value;
    const tipoVehiculoDelivery = document.getElementById('tipoVehiculoDelivery').value;
    const matriculaVehiculoDelivery = document.getElementById('matriculaVehiculoDelivery').value;
    const sexoDelivery = document.getElementById('sexoDelivery').value;

    // Validación de campos obligatorios
    if (!fotoDelivery) {
        Swal.fire({
            icon: 'warning',
            title: 'Campo obligatorio',
            text: 'La imagen de perfil del delivery es obligatoria.',
            confirmButtonText: 'Aceptar'
        });
        return; // Detiene el envío del formulario
    }

    // Crear un objeto FormData para enviar datos de texto y archivo
    const formData = new FormData();
    formData.append('nombreDelivery', nombreDelivery);
    formData.append('fotoDelivery', fotoDelivery);
    formData.append('apellidoDelivery', apellidoDelivery);
    formData.append('ciDelivery', ciDelivery);
    formData.append('emailDelivery', emailDelivery);
    formData.append('celularDelivery', celularDelivery);
    formData.append('tipoVehiculoDelivery', tipoVehiculoDelivery);
    formData.append('matriculaVehiculoDelivery', matriculaVehiculoDelivery);
    formData.append('sexoDelivery', sexoDelivery);

    // Envía los datos al servidor Node.js
    fetch('/registrarAdminDelivery', {
        method: 'POST',
        body: formData // Enviar el FormData con los datos
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ocurrió un error al registrar el delivery');
            }
            return response.json();
        })
        .then(data => {
            // Muestra una alerta de SweetAlert cuando se registra el delivery correctamente
            Swal.fire({
                icon: 'success',
                title: '¡Delivery registrado!',
                text: 'El delivery ha sido registrado correctamente',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                $('#modalAgregarDelivery').modal('hide');
            });

            // Limpiar el formulario después de registrar el delivery
            document.getElementById('formRegistrarDelivery').reset();

            listarDeliveries(); // Llama a tu función para listar los deliveries actualizados
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


//---------------------------ACTUALIZAR----------------------------
// Evento para mostrar el modal con los datos del Delivery a actualizar
document.getElementById('tablaDelivery').addEventListener('click', function (event) {
    const btnEditar = event.target.closest('.btnEditar');  // Buscar el botón de editar más cercano
    if (btnEditar) {
        // Obtener la fila (tr) más cercana al botón de editar
        const fila = $(btnEditar).closest('tr');

        // Obtener los datos del delivery de la fila usando la API del DataTable
        const deliveryData = $('#tablaDelivery').DataTable().row(fila).data();

        // Comprobar si se obtuvo correctamente los datos del delivery
        if (deliveryData) {
            // Llenar el modal de actualización con los datos del delivery
            document.getElementById('ActualizarDeliveryId').value = deliveryData.id_usuario;  // Asegúrate de que este ID sea correcto
            document.getElementById('nombreDeliveryActualizar').value = deliveryData.nombre;
            document.getElementById('apellidoDeliveryActualizar').value = deliveryData.apellido;
            document.getElementById('ciDeliveryActualizar').value = deliveryData.ci;
            document.getElementById('emailDeliveryActualizar').value = deliveryData.email;
            document.getElementById('numeroContactoDeliveryActualizar').value = deliveryData.numero_contacto;
            document.getElementById('tipoVehiculoActualizar').value = deliveryData.tipo_vehiculo;
            document.getElementById('matriculaVehiculoActualizar').value = deliveryData.matricula_vehiculo;
            document.getElementById('sexoDeliveryActualizar').value = deliveryData.sexo;
            document.getElementById('estadoDeliveryActualizar').value = deliveryData.estado_registro;

            // Mostrar el modal de actualización
            $('#modalActualizarDelivery').modal('show');
        } else {
            console.error('No se pudo obtener los datos del delivery.');
        }
    }
});
// Evento para actualizar el Delivery al enviar el formulario
document.getElementById('formActualizarDelivery').addEventListener('submit', function (event) {
    event.preventDefault();

    const idDelivery = document.getElementById('ActualizarDeliveryId').value;
    const nombreDelivery = document.getElementById('nombreDeliveryActualizar').value;
    const apellidoDelivery = document.getElementById('apellidoDeliveryActualizar').value;
    const ciDelivery = document.getElementById('ciDeliveryActualizar').value;
    const emailDelivery = document.getElementById('emailDeliveryActualizar').value;
    const numeroContactoDelivery = document.getElementById('numeroContactoDeliveryActualizar').value;
    const tipoVehiculo = document.getElementById('tipoVehiculoActualizar').value;
    const matriculaVehiculo = document.getElementById('matriculaVehiculoActualizar').value;
    const sexoDelivery = document.getElementById('sexoDeliveryActualizar').value;
    const estadoDelivery = document.getElementById('estadoDeliveryActualizar').value;
    // Realizar la petición para actualizar el delivery
    fetch(`/actualizarAdminDelivery/${idDelivery}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombreDelivery: nombreDelivery,
            apellidoDelivery: apellidoDelivery,
            ciDelivery: ciDelivery,
            emailDelivery: emailDelivery,
            numeroContactoDelivery: numeroContactoDelivery,
            tipoVehiculo: tipoVehiculo,
            matriculaVehiculo: matriculaVehiculo,
            sexoDelivery: sexoDelivery,
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
                text: 'Los datos del delivery han sido actualizados correctamente.',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                $('#modalActualizarDelivery').modal('hide'); // Cerrar el modal
            });

            // Limpiar el formulario después de la actualización
            document.getElementById('formActualizarDelivery').reset();

            listarDeliveries(); // Actualizar la lista de deliveries
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
});
//-------------------------FIN ACTUALIZAR-----------------------------


// ELIMINAR DELIVERY
document.getElementById('tablaDelivery').addEventListener('click', function (event) {
    if (event.target.closest('.btnBorrar')) {
        // Obtener la fila (tr) más cercana al botón de eliminar
        const fila = $(event.target).closest('tr');

        // Obtener el ID del delivery de la fila usando DataTable
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
                fetch(`/eliminarAdminDelivery/${deliveryId}`, {
                    method: 'DELETE'
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Ocurrió un error al eliminar el delivery');
                        }
                        return response.json();
                    })
                    .then(data => {
                        // Muestra una alerta de SweetAlert cuando se elimina el delivery correctamente
                        Swal.fire({
                            icon: 'success',
                            title: '¡Delivery eliminado!',
                            text: 'El delivery ha sido eliminado correctamente',
                            confirmButtonText: 'Aceptar'
                        });

                        // Actualiza la tabla de deliverys
                        listarDeliveries(); // Llama a tu función para listar los deliverys actualizados
                    })
                    .catch(error => {
                        // Muestra una alerta de SweetAlert cuando ocurre un error
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: error.message || 'Ocurrió un error al eliminar el delivery',
                            confirmButtonText: 'Aceptar'
                        });
                        console.error('Error al eliminar el delivery:', error);
                    });
            }
        });
    }
});




document.addEventListener('DOMContentLoaded', listarDeliveries);

