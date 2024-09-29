document.getElementById('formRegistrarCliente').addEventListener('submit', function (event) {
    // Obtener los valores de las contraseñas
    const password = document.getElementById('contrasenaCliente').value;
    const confirmPassword = document.getElementById('confirmarContrasenaCliente').value;

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden.');
        event.preventDefault(); // Evita que el formulario se envíe
        return;
    }
});
