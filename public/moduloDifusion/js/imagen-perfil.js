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
});
