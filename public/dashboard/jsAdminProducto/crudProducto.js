
// LISTAR PRODUCTOS
async function listarProductos() {
    try {
        const response = await fetch('/listarProductos'); // Cambia la ruta según corresponda
        if (!response.ok) {
            throw new Error('No se pudieron cargar los datos de los productos');
        }

        const data = await response.json(); // Convierte la respuesta a JSON

        // Accede solo a la propiedad 'productos'
        const productos = data.productos;

        // Limpiar la tabla antes de actualizar
        $('#tablaProducto').DataTable().clear().destroy();

        // Inicializar DataTables con los datos actualizados
        $('#tablaProducto').DataTable({
            responsive: true,
            autoWidth: true,
            data: productos,
            columns: [
                { data: null, render: (data, type, row, meta) => meta.row + 1 }, // Número de registro
                { data: 'id_Prod' }, // Accede a id_Prod
                { data: 'nombre_Prod' }, // Accede a nombre_Prod
                { data: 'descripcion_Prod' }, // Accede a descripcion_Prod
                { data: 'categoria.nombre_categoria' }, // Accede a nombre_categoria dentro de la categoría
                {
                    data: 'informacion_Adicional',
                    render: function (data) {
                        return `
                           <div style="width: 50%; height: 20px; background-color: ${data}; border-radius: 4px; border: 1px solid gray;"></div>
                        `;
                    }
                },

                { data: 'peso_kg' }, // Accede a peso_kg
                { data: 'stock' }, // Accede a stock
                { data: 'precio' }, // Accede a precio
                { data: 'descuento_porcent' }, // Accede a descuento_porcent
                { data: 'politica_de_Envio' }, // Accede a politica_de_Envio
                { data: 'almacen.nombre_almacen' }, // Accede a nombre_almacen dentro del almacen
                {
                    data: 'ruta_imagen', // Accede a ruta_imagen
                    render: function (data) {
                        const imagePath = data.replace(/\\/g, '/');
                        return `
                    <div style="display: flex; align-items: center; justify-content: center;">
                        <img src="${imagePath}" 
                            alt="Imagen del Producto" 
                            style="width: 150px; height: 150px; object-fit: cover; border: 2px solid #ccc;">
                    </div>
                `;
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
                </div>`
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
                    targets: [0, 6, 7], // Cambia los índices según las columnas que deseas centrar
                    className: 'text-left' // Añade la clase para centrar
                }
            ]
        });
    } catch (error) {
        console.error('Error al cargar los productos:', error); // Manejo de errores
    }
}


// CARGAR ID CATEGORIAS
document.addEventListener("DOMContentLoaded", function () {
    // Obtener el select del campo de categoría
    const categoriaSelect = document.getElementById("idCategoria");

    // Función para cargar categorías
    function cargarCategorias() {
        fetch('/listarCategorias') // Cambia esto al endpoint de tu API
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta API listarCategorias');
                }
                return response.json(); // respuesta JSON
            })
            .then(data => {
                // Limpiar las opciones actuales antes de cargar nuevas
                categoriaSelect.innerHTML = '<option value="">Selecciona una categoría</option>'; // Opción predeterminada

                // Recorrer los datos y crear opciones para el select
                data.forEach(categoria => {
                    const option = document.createElement("option");
                    option.value = categoria.id_categoria; // El ID de la categoría será el valor
                    option.textContent = categoria.nombre_categoria; // El nombre de la categoría será el texto visible
                    categoriaSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error al cargar categorías:', error);
            });
    }

    // Llamar a la función para cargar las categorías al cargar la página
    cargarCategorias();
});
//CARGAR ID ALMACENES
document.addEventListener("DOMContentLoaded", function () {
    // Obtener el select del campo de almacén
    const almacenSelect = document.getElementById("idAlmacen");

    // Función para cargar almacenes
    function cargarAlmacenes() {
        fetch('listarAlmacenes') // Cambia esto al endpoint de tu API
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta API listarAlmacenes');
                }
                return response.json(); // respuesta JSON
            })
            .then(data => {
                // Limpiar las opciones actuales antes de cargar nuevas
                almacenSelect.innerHTML = '<option value="">Selecciona un almacén</option>'; // Opción predeterminada

                // Recorrer los datos y crear opciones para el select
                data.forEach(almacen => {
                    const option = document.createElement("option");
                    option.value = almacen.id_almacen; // El ID del almacén será el valor
                    option.textContent = almacen.nombre_almacen; // El nombre del almacén será el texto visible
                    almacenSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error al cargar almacenes:', error);
            });
    }

    // Llamar a la función para cargar los almacenes al cargar la página
    cargarAlmacenes();
});
// CARGAR ID ARTESANOS
document.addEventListener("DOMContentLoaded", function () {
    // Obtener el select id_artesano
    const usuarioSelect = document.getElementById("id_artesano");

    // Función para cargar usuarios
    function cargarUsuarios() {
        fetch('/listarDatosArtesanos') // Cambia esto al endpoint de tu API
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta API listarAdminArtesanos');
                }
                return response.json(); // respuesta JSON
            })
            .then(data => {
                // Verificar que el estado sea exitoso antes de cargar los datos
                if (data.estado !== "exitoso") {
                    throw new Error(data.mensaje); // Lanza un error si la consulta no fue exitosa
                }

                // Limpiar las opciones actuales antes de cargar nuevas
                usuarioSelect.innerHTML = '<option value="">Selecciona un usuario</option>'; // Opción predeterminada

                // Recorrer los datos y crear opciones para el select
                data.datos.forEach(artesano => {
                    const option = document.createElement("option");
                    option.value = artesano.idArtesano; // El ID del artesano será el valor
                    option.textContent = `${artesano.nombre} ${artesano.apellido} - ${artesano.ci} `; // El nombre y apellido serán el texto visible
                    usuarioSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error al cargar usuarios:', error);
            });
    }

    // Llamar a la función para cargar los usuarios al cargar la página
    cargarUsuarios();
});


// REGISTRAR PRODUCTO
document.getElementById('formRegistrarProducto').addEventListener('submit', function (event) {
    event.preventDefault();

    // Extraer los valores de los campos del formulario
    const nombreProd = document.getElementById('nombreProd').value;
    const descripcionProd = document.getElementById('descripcionProd').value;
    const precioProd = document.getElementById('precioProd').value;
    const descuentoProd = document.getElementById('descuentoProd').value;
    const fotoProd = document.getElementById('fotoProd').files[0]; // Para manejar archivos
    const politicaEnvio = document.getElementById('politicaEnvio').value;
    const pesoProd = document.getElementById('pesoProd').value;
    const stockProd = document.getElementById('stockProd').value;
    const informacionAdicional = document.getElementById('informacionAdicional').value;
    const idUsuario = document.getElementById('id_artesano').value;
    const idAlmacen = document.getElementById('idAlmacen').value;
    const idCategoria = document.getElementById('idCategoria').value;


    // Validación de campos obligatorios
    if (!fotoProd) {
        Swal.fire({
            icon: 'warning',
            title: 'Campo obligatorio',
            text: 'La imagen del producto es obligatoria.',
            confirmButtonText: 'Aceptar'
        });
        return; // Detiene el envío del formulario
    }

    // Crear un objeto FormData para enviar datos de texto y archivo
    const formData = new FormData();
    formData.append('nombreProd', nombreProd);
    formData.append('descripcionProd', descripcionProd);
    formData.append('precioProd', precioProd);
    formData.append('descuentoProd', descuentoProd);
    formData.append('fotoProd', fotoProd);
    formData.append('politicaEnvio', politicaEnvio);
    formData.append('pesoProd', pesoProd);
    formData.append('stockProd', stockProd);
    formData.append('informacionAdicional', informacionAdicional);
    formData.append('idUsuario', idUsuario);
    formData.append('idAlmacen', idAlmacen);
    formData.append('idCategoria', idCategoria);

    // Envía los datos al servidor Node.js
    fetch('/insertarProducto', {
        method: 'POST',
        body: formData // Enviar el FormData con los datos
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ocurrió un error al registrar el producto');
            }
            return response.json();
        })
        .then(data => {
            // Muestra una alerta de SweetAlert cuando se registra el producto correctamente
            Swal.fire({
                icon: 'success',
                title: '¡Producto registrado!',
                text: 'El producto ha sido registrado correctamente',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                $('#modalAgregarProducto').modal('hide');
            });

            // Limpiar el formulario después de registrar el producto
            document.getElementById('formRegistrarProducto').reset();

            listarProductos(); // Llama a tu función para listar los productos actualizados

        })
        .catch(error => {
            // Muestra una alerta de SweetAlert cuando ocurre un error
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Ocurrió un error al registrar el producto',
                confirmButtonText: 'Aceptar'
            });
            console.error('Error al registrar el producto:', error);
        });
});


//------------ACTUALIZAR----------------

// CARGAR ID CATEGORIAS
document.addEventListener("DOMContentLoaded", function () {
    // Obtener el select del campo de categoría
    const categoriaSelect = document.getElementById("categoriaActualizarProducto");

    // Función para cargar categorías
    function cargarCategoriasActualizar() {
        fetch('/listarCategorias') // Cambia esto al endpoint de tu API
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta API listarCategorias');
                }
                return response.json(); // respuesta JSON
            })
            .then(data => {
                // Limpiar las opciones actuales antes de cargar nuevas
                categoriaSelect.innerHTML = '<option value="">Selecciona una categoría</option>'; // Opción predeterminada

                // Recorrer los datos y crear opciones para el select
                data.forEach(categoria => {
                    const option = document.createElement("option");
                    option.value = categoria.id_categoria; // El ID de la categoría será el valor
                    option.textContent = categoria.nombre_categoria; // El nombre de la categoría será el texto visible
                    categoriaSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error al cargar categorías:', error);
            });
    }

    // Llamar a la función para cargar las categorías al cargar la página
    cargarCategoriasActualizar();
});

//CARGAR ID ALMACENES
document.addEventListener("DOMContentLoaded", function () {
    // Obtener el select del campo de almacén
    const almacenSelect = document.getElementById("almacenActualizarProducto");

    // Función para cargar almacenes
    function cargarAlmacenesActualizar() {
        fetch('listarAlmacenes') // Cambia esto al endpoint de tu API
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta API listarAlmacenes');
                }
                return response.json(); // respuesta JSON
            })
            .then(data => {
                // Limpiar las opciones actuales antes de cargar nuevas
                almacenSelect.innerHTML = '<option value="">Selecciona un almacén</option>'; // Opción predeterminada

                // Recorrer los datos y crear opciones para el select
                data.forEach(almacen => {
                    const option = document.createElement("option");
                    option.value = almacen.id_almacen; // El ID del almacén será el valor
                    option.textContent = almacen.nombre_almacen; // El nombre del almacén será el texto visible
                    almacenSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error al cargar almacenes:', error);
            });
    }

    // Llamar a la función para cargar los almacenes al cargar la página
    cargarAlmacenesActualizar();
});

// CARGAR ID ARTESANOS
document.addEventListener("DOMContentLoaded", function () {
    // Obtener el select id_artesano
    const usuarioSelect = document.getElementById("idArtesanoActualizarProducto");

    // Función para cargar usuarios
    function cargarUsuariosActualizar() {
        fetch('/listarDatosArtesanos') // Cambia esto al endpoint de tu API
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta API listarAdminArtesanos');
                }
                return response.json(); // respuesta JSON
            })
            .then(data => {
                // Verificar que el estado sea exitoso antes de cargar los datos
                if (data.estado !== "exitoso") {
                    throw new Error(data.mensaje); // Lanza un error si la consulta no fue exitosa
                }

                // Limpiar las opciones actuales antes de cargar nuevas
                usuarioSelect.innerHTML = '<option value="">Selecciona un usuario</option>'; // Opción predeterminada

                // Recorrer los datos y crear opciones para el select
                data.datos.forEach(artesano => {
                    const option = document.createElement("option");
                    option.value = artesano.idArtesano; // El ID del artesano será el valor
                    option.textContent = `${artesano.nombre} ${artesano.apellido} - ${artesano.ci} `; // El nombre y apellido serán el texto visible
                    usuarioSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error al cargar usuarios:', error);
            });
    }

    // Llamar a la función para cargar los usuarios al cargar la página
    cargarUsuariosActualizar();
});

// Evento para mostrar el modal con los datos del producto a actualizar
document.getElementById('tablaProducto').addEventListener('click', function (event) {
    const btnEditar = event.target.closest('.btnEditar');  // Buscar el botón de editar más cercano
    if (btnEditar) {
        // Obtener la fila (tr) más cercana al botón de editar
        const fila = $(btnEditar).closest('tr');

        // Obtener los datos del producto de la fila usando la API del DataTable
        const productoData = $('#tablaProducto').DataTable().row(fila).data();

        // Comprobar si se obtuvo correctamente los datos del producto
        if (productoData) {
            // Llenar el modal de actualización con los datos del producto
            document.getElementById('ActualizarProductoId').value = productoData.id_Prod;
            document.getElementById('nombreActualizarProducto').value = productoData.nombre_Prod;
            document.getElementById('descripcionActualizarProducto').value = productoData.descripcion_Prod;
            document.getElementById('categoriaActualizarProducto').value = productoData.id_categoria;
            document.getElementById('informacionAdicionalActualizar').value = productoData.informacion_Adicional;
            document.getElementById('pesoActualizarProducto').value = productoData.peso_kg;
            document.getElementById('stockActualizarProducto').value = productoData.stock;
            document.getElementById('precioActualizarProducto').value = productoData.precio;
            document.getElementById('descuentoActualizarProducto').value = productoData.descuento_porcent;
            document.getElementById('politicaEnvioActualizar').value = productoData.politica_de_Envio;
            document.getElementById('almacenActualizarProducto').value = productoData.id_almacen;
            document.getElementById('idArtesanoActualizarProducto').value = productoData.id_artesano;


            // Mostrar el modal de actualización
            $('#modalActualizarProducto').modal('show');
        } else {
            console.error('No se pudo obtener los datos del producto.');
        }
    }
});

// Evento para actualizar el producto al enviar el formulario
document.getElementById('formActualizarProducto').addEventListener('submit', function (event) {
    event.preventDefault();

    // Obtener los valores de los campos del formulario
    const idProducto = document.getElementById('ActualizarProductoId').value;
    const nombreProducto = document.getElementById('nombreActualizarProducto').value;
    const descripcionProducto = document.getElementById('descripcionActualizarProducto').value;
    const categoriaProducto = document.getElementById('categoriaActualizarProducto').value;
    const informacionAdicionalProducto = document.getElementById('informacionAdicionalActualizar').value;
    const pesoProducto = document.getElementById('pesoActualizarProducto').value;
    const stockProducto = document.getElementById('stockActualizarProducto').value;
    const precioProducto = document.getElementById('precioActualizarProducto').value;
    const descuentoProducto = document.getElementById('descuentoActualizarProducto').value;
    const politicaEnvioProducto = document.getElementById('politicaEnvioActualizar').value;
    const almacenProducto = document.getElementById('almacenActualizarProducto').value;
    const idArtesanoProducto = document.getElementById('idArtesanoActualizarProducto').value;
    // Aquí puedes agregar la variable para la imagen, si la estás manejando
    // let imagenUrl = /* tu lógica para obtener la URL de la imagen */;

    // Realizar la petición para actualizar el producto
    fetch(`/actualizarProducto/${idProducto}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombreProd: nombreProducto,
            descripcionProd: descripcionProducto,
            idCategoria: categoriaProducto,
            informacionAdicional: informacionAdicionalProducto,
            pesoProd: pesoProducto,
            stockProd: stockProducto,
            precioProd: precioProducto,
            descuentoProd: descuentoProducto,
            politicaEnvio: politicaEnvioProducto,
            idAlmacen: almacenProducto,
            idUsuario: idArtesanoProducto,
            // Si tienes una imagen, también puedes incluirla aquí
            // rutaImagen: imagenUrl
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ocurrió un error al actualizar el producto');
            }
            return response.json();
        })
        .then(data => {
            // Mostrar una alerta de éxito con SweetAlert
            Swal.fire({
                icon: 'success',
                title: '¡Producto actualizado!',
                text: 'Los datos del producto han sido actualizados correctamente.',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                $('#modalActualizarProducto').modal('hide'); // Cerrar el modal
            });

            // Limpiar el formulario después de la actualización
            document.getElementById('formActualizarProducto').reset();

            // Aquí puedes agregar la lógica para actualizar la lista de productos si es necesario
            listarProductos(); // Llama a la función para listar productos actualizada
        })
        .catch(error => {
            // Mostrar una alerta de error con SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Ocurrió un error al actualizar el producto',
                confirmButtonText: 'Aceptar'
            });
            console.error('Error al actualizar el producto:', error);
        });
});


//--------------------FIN ACTUALIZAR----------------



// ELIMINAR PRODUCTO
document.getElementById('tablaProducto').addEventListener('click', function (event) {
    if (event.target.closest('.btnBorrar')) {
        // Obtener la fila (tr) más cercana al botón de eliminar
        const fila = $(event.target).closest('tr');

        // Obtener el ID del producto de la fila usando DataTable
        const idProducto = $('#tablaProducto').DataTable().row(fila).data().id_Prod;

        // Mostrar una confirmación de eliminación utilizando SweetAlert
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Quieres eliminar este producto?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Envía la solicitud de eliminación al servidor Node.js
                fetch(`/eliminarProducto/${idProducto}`, {
                    method: 'DELETE'
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Ocurrió un error al eliminar el producto');
                        }
                        return response.json();
                    })
                    .then(data => {
                        // Muestra una alerta de SweetAlert cuando se elimina el producto correctamente
                        Swal.fire({
                            icon: 'success',
                            title: '¡Producto eliminado!',
                            text: 'El producto ha sido eliminado correctamente',
                            confirmButtonText: 'Aceptar'
                        });

                        // Actualiza la tabla de productos
                        listarProductos(); // Llama a tu función para listar los productos actualizados
                    })
                    .catch(error => {
                        // Muestra una alerta de SweetAlert cuando ocurre un error
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: error.message || 'Ocurrió un error al eliminar el producto',
                            confirmButtonText: 'Aceptar'
                        });
                        console.error('Error al eliminar el producto:', error);
                    });
            }
        });
    }
});


document.addEventListener('DOMContentLoaded', listarProductos);

