// LISTAR CATEGORIAS DEL ARTESANO
async function listarCategoriasDelArtesano() {
    try {
        const usuarioGuardado = JSON.parse(sessionStorage.getItem('usuario'));
        //alert(usuarioGuardado);
        console.log(usuarioGuardado);
        const id_usuario = usuarioGuardado.id_usuario;
        console.log(id_usuario);
        const response = await fetch(`/listarCategoriasDelArtesano/${id_usuario}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('No se pudieron cargar los datos de las categorías');
        }

        const categorias = await response.json();

        // Limpiar y reinicializar la tabla con DataTables
        $('#tablaCategoria').DataTable().clear().destroy();

        // Inicializar DataTable con los datos de categorías
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
                        return `<button type="button" class="btn btn-primary icon-option" disabled>
                                    <i class="${data} fa-sm"></i>
                                </button>`;
                    }
                },
                {
                    data: 'estado_registro',
                    render: function (data) {
                        return data === 'Activo'
                            ? '<span class="badge badge-success">Activo</span>'
                            : '<span class="badge badge-danger">Inactivo</span>';
                    }
                },
                // {
                //      data: null,
                //      defaultContent: `<div class='text-center'>
                //                          <div class='btn-group'>
                //                              <button title='Editar' class='btn btn-primary btn-sm btnEditar'>
                //                                  <i class='fas fa-edit'></i>
                //                              </button>
                //                              <button title='Eliminar' class='btn btn-danger btn-sm btnBorrar'>
                //                                  <i class='fas fa-trash-alt'></i>
                //                              </button>
                //                          </div>
                //                      </div>`
                //  }
            ],
            language: {
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
            },
            order: [[0, 'desc']],
            columnDefs: [
                { targets: [1], visible: false }, // Oculta columna de ID si es necesario
                { targets: [0], className: 'text-left' } // Ajusta alineación de la columna
            ]
        });
    } catch (error) {
        console.error('Error al cargar las categorías:', error);
    }
}

// Llama a la función al cargar la página
document.addEventListener('DOMContentLoaded', listarCategoriasDelArtesano);
