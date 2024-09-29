// JavaScript para manejar la selección de iconos
document.querySelectorAll('.icon-option').forEach(button => {
    button.addEventListener('click', function() {
        // Remover la clase 'active' de todos los botones
        document.querySelectorAll('.icon-option').forEach(btn => btn.classList.remove('active'));

        // Añadir la clase 'active' al botón seleccionado
        this.classList.add('active');

        // Obtener el icono seleccionado
        const icono = this.getAttribute('data-icon');

        // Establecer el valor del input oculto
        document.getElementById('iconoCategoria').value = icono;

        // Mostrar el icono seleccionado al usuario
        //document.getElementById('iconoSeleccionado').innerText = icono;
    });
});
