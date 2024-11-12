document.getElementById('completeForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Variable de control para evitar múltiples envíos
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    // Obtiene la dirección y el id_usuario desde el almacenamiento de sesión
    const tipoPago = document.getElementById('tipoPago').value;
    const tarjeta = document.getElementById('tarjeta').value;
    const expiracion = document.getElementById('expiracion').value;
    const cvv = document.getElementById('cvv').value;
    const latitud = document.getElementById('latitudCliente').value;
    const longitud = document.getElementById('longitudCliente').value;
    const pedido = document.getElementById('costoPedido').value;
    const total = document.getElementById('costoTotal').value;
    const costoEnvio = total - pedido;
    const distancia = document.getElementById('distanciaTotal').value;
    const direccion = document.getElementById('direccionCliente').value;
    const usuarioGuardado = JSON.parse(sessionStorage.getItem('usuario'));
    const id_usuario = usuarioGuardado.id_usuario;

    // Validaciones
    if(tipoPago=='tarjeta'){
        if (!tipoPago) {
            alert('Por favor, seleccione un tipo de pago.');
            this.isSubmitting = false;
            return;
        }
        const tarjetaRegex = /^\d{13,19}$/;
        if (!tarjetaRegex.test(tarjeta)) {
            alert('Por favor, ingrese un número de tarjeta válido (entre 13 y 19 dígitos).');
            this.isSubmitting = false;
            return;
        }
        const expiracionRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!expiracionRegex.test(expiracion)) {
            alert('Por favor, ingrese una fecha de expiración válida en formato MM/YY.');
            this.isSubmitting = false;
            return;
        }
        const cvvRegex = /^\d{3,4}$/;
        if (!cvvRegex.test(cvv)) {
            alert('Por favor, ingrese un código CVV válido (3 o 4 dígitos).');
            this.isSubmitting = false;
            return;
        }
    }

    // Procesamiento de los elementos del carrito
    const cartItems = document.querySelectorAll(".cart-item");
    const cartData = [];

    cartItems.forEach(item => {
        const id = item.getAttribute("data-id");
        const amount = item.querySelector(".cart-item-amount").textContent.trim();
        cartData.push({ cantidad: parseInt(amount), id_prod: id });
    });

    // Crea el objeto de datos de pedido
    const orderData = {
        direccion_envio: direccion,
        costo_pedido: pedido,
        costo_total: total,
        costo_envio: costoEnvio,
        distancia: distancia,
        id_usuario: id_usuario,
        latitud_envio: latitud,
        longitud_envio: longitud,
        productos: cartData
    };

    const orderJson = JSON.stringify(orderData);

    // Enviar el pedido
    fetch('/registrarPedido', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: orderJson 
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        return response.json(); 
    })
    .then(data => {
        return Swal.fire({
            icon: 'success',
            title: '¡Felicidades!',
            text: 'El pedido ha sido realizado correctamente',
            confirmButtonText: 'Aceptar'
        });
    })
    .then(() => {
        generarPDF(); // Generar el PDF
        window.location.href = '/productosCliente'; // Redirigir a la página
    })
    .catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Ocurrió un error al realizar el pedido',
            confirmButtonText: 'Aceptar'
        });
        console.error('Hubo un problema con la solicitud:', error);
    })
    .finally(() => {
        // Restablece la variable de control
        this.isSubmitting = false;
    });
});
function generarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Datos del pedido
    const nombre = document.getElementById("nombreCliente").value;
    const apellido = document.getElementById("apellidoCliente").value;
    const ci = document.getElementById("ciCliente").value;
    const direccion = document.getElementById("direccionCliente").value;
    const tipoEnvio = document.getElementById("tipoEnvio").value;
    const costoTotal = parseFloat(document.getElementById("costoTotal").value) || 0;
    const costoPedido = parseFloat(document.getElementById("costoPedido").value) || 0;
    const lat = document.getElementById("latitudCliente").value;
    const lon = document.getElementById("longitudCliente").value;
    const ubicacion = lat+','+lon;
    const tipoPago = document.getElementById("tipoPago").value;

    // Calcular costo de envío (solo si es "Envio con Delivery")
    let costoEnvio = 0;
    if (tipoEnvio === "delivery") {
        costoEnvio = costoTotal - costoPedido;
    }

    // Fecha actual
    const fechaActual = new Date().toLocaleDateString();

    // Estilo del encabezado
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Reporte de Venta", 105, 20, null, null, "center");

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Fecha: ${fechaActual}`, 10, 30);

    // Sección de detalles del cliente
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Detalles del Cliente", 10, 40);
    doc.setLineWidth(0.5);
    doc.line(10, 42, 200, 42);  // Línea divisoria

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const clienteInfo = [
      { label: "Nombre:", value: nombre },
      { label: "Apellido:", value: apellido },
      { label: "C.I.:", value: ci },
      { label: "Dirección:", value: direccion },
      { label: "Ubicacion:", value: ubicacion }
    ];

    let yOffset = 50;
    clienteInfo.forEach(info => {
        doc.text(`${info.label}`, 10, yOffset);
        doc.text(`${info.value}`, 60, yOffset);
        yOffset += 10;
    });
    // Sección de productos
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Detalles de los Productos", 10, yOffset);
    doc.line(10, yOffset + 2, 200, yOffset + 2);  // Línea divisoria

    yOffset += 10;

    const cartItems = document.querySelectorAll(".cart-item");
    cartItems.forEach((item, index) => {
        const nombreProducto = item.querySelector(".cart-item-name").textContent.trim();
        const precioProducto = item.querySelector(".cart-item-price").textContent.trim();
        const cantidadProducto = item.querySelector(".cart-item-amount").textContent.trim();

        // Agregar datos del producto al PDF
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Producto ${index + 1}:`, 10, yOffset);
        doc.text(`Nombre: ${nombreProducto}`, 20, yOffset + 10);
        doc.text(`Precio: ${precioProducto}`, 20, yOffset + 20);
        doc.text(`Cantidad: ${cantidadProducto}`, 20, yOffset + 30);
        yOffset += 40;  // Ajustar el espacio vertical para el siguiente producto
    });

     // Sección de detalles del pedido
     doc.setFontSize(14);
     doc.setFont("helvetica", "bold");
     doc.text("Detalles del Pedido", 10, yOffset);
     doc.line(10, yOffset + 2, 200, yOffset + 2);  // Línea divisoria
 
     yOffset += 10;
     const pedidoInfo = [
       { label: "Tipo de Envío:", value: tipoEnvio === "directo" ? "Recojo directo" : "Envio con Delivery" },
       { label: "Costo Total:", value: `Bs ${costoTotal.toFixed(2)}` }
     ];
 
     pedidoInfo.forEach(info => {
         doc.setFontSize(12);
         doc.setFont("helvetica", "normal");
         doc.text(`${info.label}`, 10, yOffset);
         doc.text(`${info.value}`, 60, yOffset);
         yOffset += 10;
     });
 
     // Mostrar el campo "Costo de Envío" solo si el tipo de envío es "Envio con Delivery"
     if (tipoEnvio === "delivery") {
         doc.setFontSize(12);
         doc.setFont("helvetica", "normal");
         doc.text("Costo de Envío:", 10, yOffset);
         doc.text(`Bs ${costoEnvio.toFixed(2)}`, 60, yOffset);
         yOffset += 10;
     }
        
    // Sección de pago
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Detalles de Pago", 10, yOffset);
    doc.line(10, yOffset + 2, 200, yOffset + 2);  // Línea divisoria

    yOffset += 10;
    
    if (tipoPago === "tarjeta") {
        const pagoInfo = [
            { label: "Tipo de Pago:", value: "Tarjeta" },
            { label: "Nro de Tarjeta:", value: `**** **** **** ${tarjeta.slice(-4)}` },
            { label: "Fecha de Expiración:", value: expiracion },
            { label: "Código CVV:", value: "***" } // Ocultar CVV
        ];
        
        pagoInfo.forEach(info => {
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.text(`${info.label}`, 10, yOffset);
            doc.text(`${info.value}`, 60, yOffset);
            yOffset += 10;
        });
    } else if (tipoPago === "qr") {
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("Método de Pago: Pago con QR", 10, yOffset);
        yOffset += 10;
    }

    // Pie de página
    doc.setLineWidth(0.2);
    doc.line(10, 280, 200, 280);  // Línea divisoria en el pie de página
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Gracias por su compra", 105, 285, null, null, "center");

    // Guardar el documento
    doc.save('reporte_de_venta.pdf');
};