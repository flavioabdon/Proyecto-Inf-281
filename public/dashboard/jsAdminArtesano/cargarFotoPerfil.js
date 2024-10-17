document.addEventListener('DOMContentLoaded', function () {

    // ARTESANO
    const imageUploadCliente = document.getElementById('fotoArtesano');
    const profileImageCliente = document.getElementById('imagenPerfilArtesano');
    
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
  