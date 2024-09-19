document.addEventListener('DOMContentLoaded', function () {
  // CLIENTE
  const imageUploadCliente = document.getElementById('imagenCliente');
  const profileImageCliente = document.getElementById('imagenPerfilCliente');
  
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

  // ARTESANO
  const imageUploadArtesano = document.getElementById('imagenArtesano');
  const profileImageArtesano = document.getElementById('imagenPerfilArtesano');
  
  imageUploadArtesano.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        profileImageArtesano.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // DELIVERY
  const imageUploadDelivery = document.getElementById('imagenDelivery');
  const profileImageDelivery = document.getElementById('imagenPerfilDelivery');
  
  imageUploadDelivery.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        profileImageDelivery.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
});
