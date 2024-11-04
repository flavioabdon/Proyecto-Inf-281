document.getElementById('formIniciarSesion').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    const formData = new FormData(this); // Obtener los datos del formulario
    const data = Object.fromEntries(formData); // Convertir a objeto para enviar en JSON

    try {
        const response = await fetch('/auth/formIniciarSesion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            // Mostrar mensaje de inicio de sesión exitoso con SweetAlert2
            Swal.fire({
                icon: 'success',
                title: '¡Bienvenido de nuevo!',
                customClass: {
                    title: 'custom-title', // Aplica tu clase al título
                },
                text: 'Inicio de sesión exitoso. Serás redirigido en breve...',
                timer: 2000, // Tiempo antes de redirigir
                timerProgressBar: true, // Barra de progreso para el tiempo
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading(); // Mostrar el ícono de carga mientras se espera la redirección
                },
                willClose: () => {
                    // Aquí puedes acceder a todos los datos del usuario
                    const usuario = result.usuario; // Guarda los datos del usuario
                    // Guardar datos del usuario en sessionStorage
                    sessionStorage.setItem('usuario', JSON.stringify(usuario));

                    // Redirigir según el rol del usuario
                    switch (usuario.rol) {
                        case 'Cliente':
                            window.location.href = '/productosCliente';
                            break;
                        case 'Artesano':
                            window.location.href = '/indexArtesano';
                            break;
                        case 'Delivery':
                            window.location.href = '/indexDelivery';
                            break;
                        case 'Administrador':
                            window.location.href = '/indexAdmin';
                            break;
                        default:
                            Swal.fire('Error', 'Rol no autorizado', 'error');
                    }
                }
            });
        }
        else {
            // Mostrar error si las credenciales son incorrectas
            Swal.fire({
                icon: 'error',
                title: 'No se pudo iniciar sesión',
                customClass: {
                    title: 'custom-title', // Aplica tu clase al título
                },
                text: result.message || 'Las credenciales no son correctas. Por favor, intenta nuevamente.',
                confirmButtonText: 'Aceptar' // Cambiar el texto del botón de confirmación
            }).then(() => {
                // Limpiar el formulario al cerrar la alerta
                document.getElementById('formIniciarSesion').reset();
            });
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error en el servidor',
            text: 'Hubo un problema al procesar tu solicitud. Por favor, intenta de nuevo más tarde.',
            confirmButtonText: 'Aceptar' // Cambiar el texto del botón de confirmación
        });
    }
});
