document.getElementById('completeForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Obtiene la dirección y el id_usuario desde el almacenamiento de sesión
    const direccion = document.getElementById("direccionCliente").value;
    const usuarioGuardado = JSON.parse(sessionStorage.getItem('usuario'));
    const id_usuario = usuarioGuardado.id_usuario;

    // Obtiene los elementos del carrito
    const cartItems = document.querySelectorAll(".cart-item");

    // Crea un array para almacenar los datos del carrito
    const cartData = [];

    // Recorre cada artículo y extrae el ID y la cantidad
    cartItems.forEach(item => {
        const id = item.getAttribute("data-id"); // Obtiene el data-id
        const amount = item.querySelector(".cart-item-amount").textContent.trim(); // Obtiene la cantidad

        // Agrega el objeto con id y cantidad al array
        cartData.push({
            id: id,
            cantidad: parseInt(amount) // Convierte la cantidad a número
        });
    });

    // Crea un objeto con la información completa para el JSON
    const orderData = {
        id_usuario: id_usuario,
        direccion: direccion,
        productos: cartData
    };

    // Convierte el objeto a JSON
    const orderJson = JSON.stringify(orderData);

    // Muestra el JSON en una alerta
    alert(`Datos del pedido: ${orderJson}`);

    // También puedes mostrarlo en la consola si prefieres
    console.log(orderJson);
});
