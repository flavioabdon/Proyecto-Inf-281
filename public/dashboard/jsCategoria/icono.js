// Función para manejar la selección de iconos al crear una categoría
function manejarSeleccionIconoCategoria() {
    document.querySelectorAll('.icon-option').forEach(button => {
        button.addEventListener('click', function() {
            // Remover la clase 'active' de todos los botones
            document.querySelectorAll('.icon-option').forEach(btn => btn.classList.remove('active'));

            // Añadir la clase 'active' al botón seleccionado
            this.classList.add('active');

            // Obtener el icono seleccionado
            const icono = this.getAttribute('data-icon');

            // Establecer el valor del input oculto para la creación
            document.getElementById('iconoCategoria').value = icono; // Para la creación

            // Mostrar el icono seleccionado al usuario (opcional)
            // document.getElementById('iconoSeleccionado').innerText = icono; // Puedes descomentar si quieres mostrar el icono seleccionado
        });
    });
}

// Función para manejar la selección de iconos al actualizar una categoría
function manejarSeleccionIconoActualizar() {
    document.querySelectorAll('.icon-option').forEach(button => {
        button.addEventListener('click', function() {
            // Remover la clase 'active' de todos los botones
            document.querySelectorAll('.icon-option').forEach(btn => btn.classList.remove('active'));

            // Añadir la clase 'active' al botón seleccionado
            this.classList.add('active');

            // Obtener el icono seleccionado
            const icono = this.getAttribute('data-icon');

            // Establecer el valor del input oculto para la actualización
            document.getElementById('iconoCategoriaActualizar').value = icono; // Para la actualización

            // Mostrar el icono seleccionado al usuario (opcional)
            // document.getElementById('iconoSeleccionado').innerText = icono; // Puedes descomentar si quieres mostrar el icono seleccionado
        });
    });
}

// Llama a las funciones según la situación
manejarSeleccionIconoCategoria();  // Para la creación de categorías
manejarSeleccionIconoActualizar();  // Para la actualización de categorías
