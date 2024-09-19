// Función que captura los datos del formulario
function capturarDatosFormulario() {
    const form = document.getElementById('formCliente');
  
    if (form) { // Asegurarse de que el formulario existe antes de agregar el event listener
      form.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita el envío del formulario
  
        // Capturar los valores de los inputs
        const nombre = document.getElementById('nombres').value;
       
        // Mostrar los datos en la consola
        console.log('Nombre:', nombre);
        alert('REGISTRADO')
      
      });
    } else {
      console.error('El formulario no se ha encontrado en el DOM');
    }
  }
  