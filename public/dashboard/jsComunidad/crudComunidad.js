//LISTAR
async function listarComunidades() { // listarComunidades
    try {
        const response = await fetch('/listarComunidades'); //ruta de view
        if (!response.ok) {
            throw new Error('No se pudieron cargar los datos de la lista de Comunidades');
        }

        const comunidades = await response.json(); // Convierte la respuesta a JSON

        // Limpiar la tabla antes de actualizar
        $('#tablaComunidad').DataTable().clear().destroy();

        // Inicializar DataTables con los datos actualizados
        $('#tablaComunidad').DataTable({
            responsive: true,
            autoWidth: true,
            data: comunidades,
            columns: [
                { data: 'numero_registro' },
                { data: 'id_comunidad' },
                { data: 'departamento' },
                { data: 'provincia' },
                { data: 'municipio' },
                { data: 'nombrecom' },
                { data: 'ubicacion_georef_com' },
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
                    targets: [0, 4], // Cambia los índices según las columnas que deseas centrar
                    className: 'text-left' // Añade la clase para centrar
                }
            ]
        });
    } catch (error) {
        console.error('Error al cargar las Comunidades:', error); // Manejo de errores
    }
}

// REGISTRAR 
document.getElementById('formRegistrarComunidad').addEventListener('submit', function (event) {
    event.preventDefault();

    
    const departamento = document.getElementById('departamento').value;  
    const provincia = document.getElementById('provincia').value;  
    const municipio = document.getElementById('municipio').value;
    const nombrecom = document.getElementById('nombrecom').value; 
    const longitud = document.getElementById('longitud').value; 
    const latitud = document.getElementById('latitud').value; 
    
    // Cambiar el formato de ubicación geográfica de "12.34 56.78" a "12.34, 56.78"
   // ubicacion_georef_com = ubicacion_georef_com.split(' ').join(',');

    console.log("Datos a registrar:", {
        departamento,
        provincia,
        municipio,
        nombrecom,
        longitud,
        latitud
    }); // Asegúrate de que 'datos' contiene lo correcto
    
    // Envía los datos al servidor Node.js
    fetch('/formRegistrarComunidad', {          //ruta de view
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            departamento: departamento,
            provincia: provincia,
            municipio: municipio,
            nombrecom: nombrecom,
            longitud: longitud,
            latitud: latitud
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ocurrió un error al registrar el comunidad');
            }
            return response.json();
        })
        .then(data => {
            // Muestra una alerta de SweetAlert cuando se registra la comunidad correctamente
            Swal.fire({
                icon: 'success',
                title: 'Comunidad registrada!',
                text: 'La Comunidad ha sido registrada correctamente',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                $('#modalAgregarComunidad').modal('hide');
            });

            // Limpiar el formulario después de registrar la categoría
            document.getElementById('formRegistrarComunidad').reset();

            listarComunidades(); // Llama a tu función para listar las categorías actualizadas
        })
        .catch(error => {
            // Muestra una alerta de SweetAlert cuando ocurre un error
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Ocurrió un error al registrar la comunidad',
                confirmButtonText: 'Aceptar'
            });
            console.error('Error al registrar la comunidad:', error);
        });
});

// ----------------ACTUALIZAR ------------
// Evento para mostrar el modal con los datos de la comunidad a actualizar
document.getElementById('tablaComunidad').addEventListener('click', function (event) {
    const btnEditar = event.target.closest('.btnEditar');
   
    if (btnEditar) {
        // Obtener la fila (tr) más cercana al botón de editar
        const fila = $(btnEditar).closest('tr');

        // Obtener los datos de la comunidad de la fila usando la API del DataTable
        const comunidadData = $('#tablaComunidad').DataTable().row(fila).data();

        // Comprobar si se obtuvo correctamente la comunidad
        if (comunidadData) {
            // Llenar el modal de actualización con los datos de la comunidad
            document.getElementById('idComunidadActualizar').value = comunidadData.id_comunidad;
            document.getElementById('DepartamentoActualizar').value = comunidadData.departamento;
            document.getElementById('provinciaActualizar').value = comunidadData.provincia;
            document.getElementById('municipioActualizar').value = comunidadData.municipio;
            document.getElementById('nombreComActualizar').value = comunidadData.nombrecom;
            document.getElementById('longitudActualizar').value = comunidadData.longitud;
            document.getElementById('latitudActualizar').value = comunidadData.latitud;
            document.getElementById('ubicacion_geoRef_ComActualizar').value = comunidadData.ubicacion_georef_com;
            // Mostrar el modal de actualización
            $('#modalActualizarComunidad').modal('show');
        } else {
            console.error('No se pudo obtener los datos de la comunidad.');
        }
    }
});

// Evento para actualizar la comunidad al enviar el formulario
document.getElementById('formActualizarComunidad').addEventListener('submit', function (event) {
    event.preventDefault();

    const id_comunidad = document.getElementById('idComunidadActualizar').value;
    const departamento = document.getElementById('DepartamentoActualizar').value;
    const provincia = document.getElementById('provinciaActualizar').value;
    const municipio = document.getElementById('municipioActualizar').value;
    const nombrecom = document.getElementById('nombreComActualizar').value;
    const longitud = document.getElementById('longitudActualizar').value;
    const latitud = document.getElementById('latitudActualizar').value;
   // const ubicacion_geoRef_Com = document.getElementById('ubicacion_geoRef_ComActualizar').value;


    // Realizar la petición para actualizar la comunidad
    fetch(`/actualizarComunidad/${id_comunidad}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            departamento: departamento,
            provincia: provincia,
            municipio: municipio,
            nombrecom: nombrecom,
            longitud: longitud,
            latitud: latitud
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ocurrió un error al actualizar la comunidad');
            }
            return response.json();
        })
        .then(data => {
            // Mostrar una alerta de éxito con SweetAlert
            Swal.fire({
                icon: 'success',
                title: '¡ Comunidad actualizada!',
                text: 'La Comunidad ha sido actualizado correctamente.',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                $('#modalActualizarComunidad').modal('hide'); // Cerrar el modal
            });

            // Limpiar el formulario después de la actualización
            document.getElementById('formActualizarComunidad').reset();

            listarComunidades(); // Actualizar la lista de comunidades
        })
        .catch(error => {
            // Mostrar una alerta de error con SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Ocurrió un error al actualizar la comunidad',
                confirmButtonText: 'Aceptar'
            });
            console.error('Error al actualizar la comunidad:', error);
        });
});
// -----------------FIN ACTUALIZAR--------------


// ELIMINAR 
document.getElementById('tablaComunidad').addEventListener('click', function (event) {
    if (event.target.closest('.btnBorrar')) {
        // Obtener la fila (tr) más cercana al botón de eliminar
        const fila = $(event.target).closest('tr');

        // Obtener el ID a de la fila usando DataTable
        const comunidadId = $('#tablaComunidad').DataTable().row(fila).data().id_comunidad;
        // Mostrar una confirmación de eliminación utilizando SweetAlert
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Quieres eliminar esta Comunidad?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Envía la solicitud de eliminación al servidor Node.js
                fetch(`/eliminarComunidad/${comunidadId}`, {
                    method: 'DELETE'
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Ocurrió un error al eliminar la comunidad');
                        }
                        return response.json();
                    })
                    .then(data => {
                        // Muestra una alerta de SweetAlert cuando se elimina la comunidad correctamente
                        Swal.fire({
                            icon: 'success',
                            title: '¡ Comunidad eliminada!',
                            text: 'La Comunidad ha sido eliminada correctamente',
                            confirmButtonText: 'Aceptar'
                        });

                        // Actualiza la tabla de comunidades
                        listarComunidades(); // Llama a tu función para listar las comunidades actualizados
                    })
                    .catch(error => {
                        // Muestra una alerta de SweetAlert cuando ocurre un error
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: error.message || 'Ocurrió un error al eliminar la comunidad',
                            confirmButtonText: 'Aceptar'
                        });
                        console.error('Error al eliminar la comunidad:', error);
                    });
            }
        });
    }
});


// Llama a la función al cargar la página
document.addEventListener('DOMContentLoaded', listarComunidades);




async function iniciarMapa(){
    // Verifica si el navegador soporta la geolocalización
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            // Obtenemos la latitud y longitud del usuario
            var latitud = position.coords.latitude;
            var longitud = position.coords.longitude;

            // Creamos el objeto de coordenadas con la ubicación actual
            var coordenadas = {
                lng: longitud,
                lat: latitud
            };

            // Llamamos a la función para generar el mapa con las coordenadas actuales
            generarMapa(coordenadas);
        }, function(error) {
            // En caso de error, podrías manejarlo mostrando un mensaje o usar coordenadas por defecto
            console.error("Error al obtener la ubicación: ", error);
            
            // Opcional: Usar coordenadas por defecto en caso de error
            var coordenadasDefecto = {
                lng: -68.13123068164457, // Ejemplo de longitud por defecto
                lat: -16.49976308893619  // Ejemplo de latitud por defecto
            };
            generarMapa(coordenadasDefecto);
        });
    } else {
        // Si el navegador no soporta geolocalización, usar coordenadas por defecto
        console.error("Geolocalización no soportada por este navegador.");
        var coordenadasDefecto = {
            lng: -68.13123068164457,
            lat: -16.49976308893619
        };
        generarMapa(coordenadasDefecto);
    }
}
document.addEventListener('DOMContentLoaded', iniciarMapa);

async function generarMapa(coordenadas){
        var mapa = new google.maps.Map(document.getElementById('mapa'),{
            zoom: 18,
            center: new google.maps.LatLng(coordenadas.lat, coordenadas.lng)
        });
        marcador = new google.maps.Marker({
            map: mapa,
            draggable: true,
            position: new google.maps.LatLng(coordenadas.lat, coordenadas.lng)
        });
        marcador.addListener('dragend',function(event){
            document.getElementById("latitud").value=this.getPosition().lat();
            document.getElementById("longitud").value=this.getPosition().lng();
        })
}
document.addEventListener('DOMContentLoaded', generarMapa);
