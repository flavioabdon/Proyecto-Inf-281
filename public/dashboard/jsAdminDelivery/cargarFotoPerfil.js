document.addEventListener('DOMContentLoaded', function () {

    // DELIVERY
    const imageUploadCliente = document.getElementById('fotoDelivery');
    const profileImageCliente = document.getElementById('imagenPerfilDelivery');
    
    imageUploadCliente.addEventListener('change', function () {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          profileImageCliente.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  });
  