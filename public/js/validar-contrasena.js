
document.addEventListener('DOMContentLoaded', function () {
    // Selecciona los formularios por sus IDs
    const formCliente = document.getElementById('formRegistrarCliente');
    const formArtesano = document.getElementById('formRegistrarArtesano');
    const formDelivery = document.getElementById('formRegistrarDelivery');

    // Función para validar las contraseñas
    function validatePasswords(form) {
        const password = form.querySelector('input[name="contrasenaCliente"], input[name="contrasenaArtesano"], input[name="contrasenaDelivery"]').value;
        const confirmPassword = form.querySelector('input[name="confirmarContrasenaCliente"], input[name="confirmarContrasenaArtesano"], input[name="confirmarContrasenaDelivery"]').value;

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return false;
        }
        return true;
    }

    // Agrega los manejadores de eventos para cada formulario
    if (formCliente) {
        formCliente.addEventListener('submit', function (event) {
            if (!validatePasswords(formCliente)) {
                event.preventDefault(); // Evita el envío del formulario si las contraseñas no coinciden
            }
        });
    }

    if (formArtesano) {
        formArtesano.addEventListener('submit', function (event) {
            if (!validatePasswords(formArtesano)) {
                event.preventDefault(); // Evita el envío del formulario si las contraseñas no coinciden
            }
        });
    }

    if (formDelivery) {
        formDelivery.addEventListener('submit', function (event) {
            if (!validatePasswords(formDelivery)) {
                event.preventDefault(); // Evita el envío del formulario si las contraseñas no coinciden
            }
        });
    }
});

