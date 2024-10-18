

// LISTAR ARTESANOS
async function listarArtesanos() {
    try {
        const response = await fetch('/listarAdminArtesanos'); // Cambia la ruta según corresponda
        if (!response.ok) {
            throw new Error('No se pudieron cargar los datos de los artesanos');
        }

        const artesanos = await response.json(); // Convierte la respuesta a JSON

        // Limpiar la tabla antes de actualizar
        $('#tablaArtesano').DataTable().clear().destroy();

        // Inicializar DataTables con los datos actualizados
        $('#tablaArtesano').DataTable({
            responsive: true,
            autoWidth: true,
            data: artesanos,
            columns: [
                { data: 'numero_registro' },
                { data: 'id_usuario' },
                { data: 'ci' },
                { data: 'nombre' },
                { data: 'apellido' },
                { data: 'email' },
                { data: 'numero_contacto' },
                { data: 'especialidad_artesano' },
                { data: 'nombrecom' },
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
                    targets: [0, 2, 6], // Cambia los índices según las columnas que deseas centrar
                    className: 'text-left' // Añade la clase para centrar
                }
            ]
        });
    } catch (error) {
        console.error('Error al cargar los artesanos:', error); // Manejo de errores
    }
}


//------------REGISTRAR ARTESANO----------------
//CARGA LAS COMUNIDADES EN EL CAMPO DE COMUNIDAD AL REGISTRAR ARTESANO
document.addEventListener("DOMContentLoaded", function () {
    // Obtener el select
    const comunidadSelect = document.getElementById("comunidadArtesano");

    // Función para cargar comunidades
    function cargarComunidades() {
        fetch('listarComunidades')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta API listarComunidades');
                }
                return response.json(); // respuesta JSON
            })
            .then(data => {
                // Recorrer los datos y crear opciones para el select
                data.forEach(comunidad => {
                    const option = document.createElement("option");
                    option.value = comunidad.id_comunidad; // El ID de la comunidad será el valor
                    option.textContent = comunidad.nombrecom; // El nombre de la comunidad será el texto visible
                    comunidadSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error al cargar comunidades:', error);
            });
    }

    // Llamar a la función para cargar las comunidades al cargar la página
    cargarComunidades();
});
// REGISTRAR ARTESANO
document.getElementById('formRegistrarArtesano').addEventListener('submit', function (event) {
    event.preventDefault();

    // Extraer los valores de los campos del formulario
    const nombreArtesano = document.getElementById('nombreArtesano').value;
    const fotoArtesano = document.getElementById('fotoArtesano').files[0]; // Para manejar archivos
    const apellidoArtesano = document.getElementById('apellidoArtesano').value;
    const ciArtesano = document.getElementById('ciArtesano').value;
    const emailArtesano = document.getElementById('emailArtesano').value;
    const celularArtesano = document.getElementById('celularArtesano').value;
    const especialidadArtesano = document.getElementById('especialidadArtesano').value;
    const sexoArtesano = document.getElementById('sexoArtesano').value;
    const comunidadArtesano = document.getElementById('comunidadArtesano').value;

    // Validación de campos obligatorios
    if (!fotoArtesano) {
        Swal.fire({
            icon: 'warning',
            title: 'Campo obligatorio',
            text: 'La imagen de perfil del artesano es obligatoria.',
            confirmButtonText: 'Aceptar'
        });
        return; // Detiene el envío del formulario
    }

    // Crear un objeto FormData para enviar datos de texto y archivo
    const formData = new FormData();
    formData.append('nombreArtesano', nombreArtesano);
    formData.append('fotoArtesano', fotoArtesano);
    formData.append('apellidoArtesano', apellidoArtesano);
    formData.append('ciArtesano', ciArtesano);
    formData.append('emailArtesano', emailArtesano);
    formData.append('celularArtesano', celularArtesano);
    formData.append('especialidadArtesano', especialidadArtesano);
    formData.append('sexoArtesano', sexoArtesano);
    formData.append('comunidadArtesano', comunidadArtesano);

    // Recorre el FormData y muestra cada clave y valor en un alert
    // formData.forEach((value, key) => {
    //     alert(`Clave: ${key},
    //          Valor: ${value}`);
    // });

    // Envía los datos al servidor Node.js
    fetch('/registrarAdminArtesano', {
        method: 'POST',
        body: formData // Enviar el FormData con los datos
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ocurrió un error al registrar el artesano');
            }
            return response.json();
        })
        .then(data => {
            // Muestra una alerta de SweetAlert cuando se registra el artesano correctamente
            Swal.fire({
                icon: 'success',
                title: '¡Artesano registrado!',
                text: 'El artesano ha sido registrado correctamente',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                $('#modalAgregarArtesano').modal('hide');
            });

            // Limpiar el formulario después de registrar el artesano
            document.getElementById('formRegistrarArtesano').reset();

            listarArtesanos(); // Llama a tu función para listar los artesanos actualizados

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

//------------FIN DE REGISTRAR ----------------



//-----------------ACTUALIZAR UN ARTESANO
//CARGA LAS COMUNIDADES EN EL CAMPO DE COMUNIDAD AL ACTUALIZAR UN ARTESANO
document.addEventListener("DOMContentLoaded", function () {
    // Obtener el select del modal de actualización
    const comunidadSelectActualizar = document.getElementById("comunidadArtesanoActualizar");

    // Función para cargar comunidades
    function cargarComunidadesActualizar() {
        fetch('listarComunidades')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta API listarComunidades');
                }
                return response.json(); // respuesta JSON
            })
            .then(data => {
                // Limpiar las opciones actuales antes de cargar nuevas
                comunidadSelectActualizar.innerHTML = '';

                // Recorrer los datos y crear opciones para el select
                data.forEach(comunidad => {
                    const option = document.createElement("option");
                    option.value = comunidad.id_comunidad; // El ID de la comunidad será el valor
                    option.textContent = comunidad.nombrecom; // El nombre de la comunidad será el texto visible
                    comunidadSelectActualizar.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error al cargar comunidades:', error);
            });
    }

    // Llamar a la función para cargar las comunidades al cargar la página
    cargarComunidadesActualizar();
});

// Evento para mostrar el modal con los datos del artesano a actualizar
document.getElementById('tablaArtesano').addEventListener('click', function (event) {
    const btnEditar = event.target.closest('.btnEditar');  // Buscar el botón de editar más cercano
    if (btnEditar) {
        // Obtener la fila (tr) más cercana al botón de editar
        const fila = $(btnEditar).closest('tr');

        // Obtener los datos del artesano de la fila usando la API del DataTable
        const artesanoData = $('#tablaArtesano').DataTable().row(fila).data();

        // Comprobar si se obtuvo correctamente los datos del artesano
        if (artesanoData) {
            // Llenar el modal de actualización con los datos del artesano
            document.getElementById('ActualizarArtesanoId').value = artesanoData.id_usuario;
            document.getElementById('nombreArtesanoActualizar').value = artesanoData.nombre;
            document.getElementById('apellidoArtesanoActualizar').value = artesanoData.apellido;
            document.getElementById('ciArtesanoActualizar').value = artesanoData.ci;
            document.getElementById('emailArtesanoActualizar').value = artesanoData.email;
            document.getElementById('numeroContactoArtesanoActualizar').value = artesanoData.numero_contacto;
            document.getElementById('especialidadArtesanoActualizar').value = artesanoData.especialidad_artesano;
            document.getElementById('estadoArtesanoActualizar').value = artesanoData.estado_registro;


            // Seleccionar el valor correcto en el campo de sexo
            document.getElementById('sexoArtesanoActualizar').value = artesanoData.sexo;

            // Comparar nombrecom con las opciones del select y seleccionar el valor correspondiente
            const comunidadSelect = document.getElementById('comunidadArtesanoActualizar');
            const opciones = Array.from(comunidadSelect.options); // Convertir opciones a un array

            // Usar find para buscar la opción correspondiente
            const opcionSeleccionada = opciones.find(opcion => opcion.textContent === artesanoData.nombrecom);

            if (opcionSeleccionada) {
                comunidadSelect.value = opcionSeleccionada.value; // Asignar el valor si hay coincidencia
            }
            // Mostrar el modal de actualización
            $('#modalActualizarArtesano').modal('show');
        } else {
            console.error('No se pudo obtener los datos del artesano.');
        }
    }
});

// Evento para actualizar el artesano al enviar el formulario
document.getElementById('formActualizarArtesano').addEventListener('submit', function (event) {
    event.preventDefault();

    const idArtesano = document.getElementById('ActualizarArtesanoId').value;
    const nombreArtesano = document.getElementById('nombreArtesanoActualizar').value;
    const apellidoArtesano = document.getElementById('apellidoArtesanoActualizar').value;
    const ciArtesano = document.getElementById('ciArtesanoActualizar').value;
    const emailArtesano = document.getElementById('emailArtesanoActualizar').value;
    const numeroContactoArtesano = document.getElementById('numeroContactoArtesanoActualizar').value;
    const especialidadArtesano = document.getElementById('especialidadArtesanoActualizar').value;
    const sexoArtesano = document.getElementById('sexoArtesanoActualizar').value;
    const comunidadArtesano = document.getElementById('comunidadArtesanoActualizar').value;
    const estadoArtesano = document.getElementById('estadoArtesanoActualizar').value;

    // Realizar la petición para actualizar el artesano
    fetch(`/actualizarAdminArtesano/${idArtesano}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombreArtesano: nombreArtesano,
            apellidoArtesano: apellidoArtesano,
            ciArtesano: ciArtesano,
            emailArtesano: emailArtesano,
            numeroContactoArtesano: numeroContactoArtesano,
            especialidadArtesano: especialidadArtesano,
            sexoArtesano: sexoArtesano,
            comunidadArtesano: comunidadArtesano,
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
                text: 'Los datos del artesano han sido actualizados correctamente.',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                $('#modalActualizarArtesano').modal('hide'); // Cerrar el modal
            });

            // Limpiar el formulario después de la actualización
            document.getElementById('formActualizarArtesano').reset();

            listarArtesanos(); // Actualizar la lista de artesanos
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
});

//--------------FIN DE ACTUALIZAR-----------------


// ELIMINAR ARTESANO
document.getElementById('tablaArtesano').addEventListener('click', function (event) {
    if (event.target.closest('.btnBorrar')) {
        // Obtener la fila (tr) más cercana al botón de eliminar
        const fila = $(event.target).closest('tr');

        // Obtener el ID del artesano de la fila usando DataTable
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
                fetch(`/eliminarAdminArtesano/${artesanoId}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Ocurrió un error al eliminar el artesano');
                    }
                    return response.json();
                })
                .then(data => {
                    // Muestra una alerta de SweetAlert cuando se elimina el artesano correctamente
                    Swal.fire({
                        icon: 'success',
                        title: '¡Artesano eliminado!',
                        text: 'El artesano ha sido eliminado correctamente',
                        confirmButtonText: 'Aceptar'
                    });

                    // Actualiza la tabla de artesanos
                    listarArtesanos(); // Llama a tu función para listar los artesanos actualizados
                })
                .catch(error => {
                    // Muestra una alerta de SweetAlert cuando ocurre un error
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error.message || 'Ocurrió un error al eliminar el artesano',
                        confirmButtonText: 'Aceptar'
                    });
                    console.error('Error al eliminar el artesano:', error);
                });
            }
        });
    }
});








document.addEventListener('DOMContentLoaded', listarArtesanos);

