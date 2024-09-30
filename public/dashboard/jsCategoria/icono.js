// JavaScript para manejar la selección de iconos
document.querySelectorAll('.icon-option').forEach(button => {
    button.addEventListener('click', function () {
        // Remover la clase 'active' de todos los botones
        document.querySelectorAll('.icon-option').forEach(btn => btn.classList.remove('active'));

        // Añadir la clase 'active' al botón seleccionado
        this.classList.add('active');

        // Obtener el icono seleccionado
        const icono = this.getAttribute('data-icon');

        // Establecer el valor del input oculto dependiendo de la acción (crear o actualizar)
        const esActualizar = document.getElementById('formActualizarCategoria') !== null; // Comprobar si estamos en el formulario de actualización

        if (esActualizar) {
            document.getElementById('iconoCategoriaActualizar').value = icono; // Para la actualización
        } else {
            document.getElementById('iconoCategoria').value = icono; // Para la creación
        }

        // Mostrar el icono seleccionado al usuario (opcional)
        // document.getElementById('iconoSeleccionado').innerText = icono; // Puedes descomentar si quieres mostrar el icono seleccionado
    });
});
