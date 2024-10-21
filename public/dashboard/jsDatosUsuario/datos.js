document.addEventListener("DOMContentLoaded", function () {
    // Recuperar los datos del usuario almacenados
    const usuarioGuardado = JSON.parse(sessionStorage.getItem('usuario'));

    // Inicializa valores por defecto
    const rolPorDefecto = 'No especificado';
    const imagenPorDefecto = '/dashboard/img/loading.jpg';
    
    // Verificar si hay usuario guardado
    if (usuarioGuardado) {
        // Actualizar el contenido del span con el rol del usuario
        document.getElementById('rolUsuario').textContent = usuarioGuardado.rol || rolPorDefecto; // Valor por defecto

        // Mostrar la foto de perfil
        document.getElementById('imagenUsuario').src = usuarioGuardado.fotoperf_url || imagenPorDefecto; // Imagen por defecto si no hay URL

        // Actualizar el contenido del input con el ID del usuario
        document.getElementById('id_usuario_sesion').value = usuarioGuardado.id_usuario || ''; // Asigna el ID del usuario
    } else {
        // Establecer valores por defecto si no hay usuario guardado
        document.getElementById('rolUsuario').textContent = rolPorDefecto; // Valor por defecto
        document.getElementById('imagenUsuario').src = imagenPorDefecto; // Imagen por defecto
        document.getElementById('id_usuario_sesion').value = ''; // Valor por defecto para el ID
    }
});
