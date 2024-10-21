//una vez guardado los datos en session storage se accede a los datos


// Recuperar los datos del usuario almacenados
const usuarioGuardado = JSON.parse(sessionStorage.getItem('usuario'));


// Verificar si hay usuario guardado y mostrar su nombre, apellido, rol e ID
if (usuarioGuardado) {
    // Actualizar el contenido del span con el nombre y apellido del usuario
    document.getElementById('nombreApellidoUsuario').textContent = `${usuarioGuardado.nombre} ${usuarioGuardado.apellido}`;
  
} else {
    document.getElementById('nombreApellidoUsuario').textContent = 'invitado'; // O cualquier otro valor por defecto
}
