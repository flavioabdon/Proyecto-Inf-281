// Función para mostrar vista previa de la imagen seleccionada
document.getElementById('fotoProd').addEventListener('change', function (event) {
    const input = event.target;
    const preview = document.getElementById('previewImagenProd');

    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = 'block'; // Mostrar la vista previa
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        preview.src = ''; // Ocultar la vista previa si no hay archivo
        preview.style.display = 'none';
    }
});
