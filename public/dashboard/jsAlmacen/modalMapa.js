let map;
let marker;
let mapInitialized = false; // Variable para rastrear si el mapa ya se inicializó

function initMap() {
  if (!mapInitialized) {
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: -16.500849, lng: -68.173632 },
      zoom: 12,
    });

    // Crear el marcador movible al centro inicial del mapa
    marker = new google.maps.Marker({
      position: { lat: -16.500849, lng: -68.173632 },
      map: map,
      draggable: true, // Hacer el marcador arrastrable
    });

   // Actualizar las coordenadas cuando se arrastra el marcador 
    marker.addListener("dragend", () => {
        const posicion = marker.getPosition();
        document.getElementById("ubicacionAlmacen").value = `${posicion.lat()} ${posicion.lng()}`;
    });

    // Actualizar las coordenadas cuando se arrastra el marcador para la actualización
    marker.addListener("dragend", () => {
        const posicionActualizar = marker.getPosition();
        document.getElementById("ubicacionAlmacenActualizar").value = `${posicionActualizar.lat()} ${posicionActualizar.lng()}`;
    });

    // Permitir clics en el mapa para mover el marcador
    map.addListener("click", (event) => {
        marker.setPosition(event.latLng);
        document.getElementById("ubicacionAlmacen").value = `${event.latLng.lat()} ${event.latLng.lng()}`;
    });

    mapInitialized = true; // Marcar como inicializado
  }
}

// Mostrar el mapa cuando se abre el modal
document.getElementById("abrirMapa").addEventListener("click", () => {
  $("#segundoModal").modal("show");
});
document.getElementById("abrirMapa2").addEventListener("click", () => {
    $("#segundoModal").modal("show");
  });
// Cargar el mapa al mostrar el modal
$("#segundoModal").on("shown.bs.modal", function () {
  initMap();
});

