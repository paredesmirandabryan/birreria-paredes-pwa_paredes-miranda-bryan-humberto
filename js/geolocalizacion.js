// geolocalizacion.js — Ubicación del cliente + ruta hasta la sucursal
// El navegador SIEMPRE pide permiso antes de compartir la ubicación.
// Solo funciona en https:// o en localhost.

// CAMBIA estas coordenadas por las de tu sucursal (ver el paso 3.4)
const SUCURSAL = {
  nombre: "Birriería Paredes",
  lat: 29.00921146687666,
  lon: -110.90377522502918,
};

// Distancia en línea recta (km) entre dos puntos. Es el respaldo si no hay ruta por calles.
function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
  const radioTierraKm = 6371;
  const aRadianes = (grados) => (grados * Math.PI) / 180;

  const dLat = aRadianes(lat2 - lat1);
  const dLon = aRadianes(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(aRadianes(lat1)) * Math.cos(aRadianes(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return radioTierraKm * c;
}

// Pide al servicio público OSRM la ruta real por calles (gratis, sin API key).
// Devuelve { coords, distanciaKm, duracionMin } o null si falla.
async function obtenerRuta(origenLat, origenLon) {
  const url =
    "https://router.project-osrm.org/route/v1/driving/" +
    `${origenLon},${origenLat};${SUCURSAL.lon},${SUCURSAL.lat}` +
    "?overview=full&geometry=geojson";

  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    if (datos.code !== "Ok") return null;

    const ruta = datos.routes[0];
    return {
      // OSRM da [lon, lat]; Leaflet quiere [lat, lon]
      coords: ruta.geometry.coordinates.map(([lon, lat]) => [lat, lon]),
      distanciaKm: ruta.distance / 1000,
      duracionMin: ruta.duration / 60,
    };
  } catch (error) {
    console.error("No se pudo calcular la ruta:", error);
    return null;
  }
}

let mapa; // el mapa de Leaflet se crea una sola vez y se reutiliza

function dibujarMapa(origenLat, origenLon, coordsRuta) {
  const contenedor = document.getElementById("mapa-ruta");
  contenedor.hidden = false;

  if (!mapa) {
    // "L" es el objeto global que crea la librería Leaflet
    mapa = L.map(contenedor);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; colaboradores de OpenStreetMap",
      maxZoom: 19,
    }).addTo(mapa);
  } else {
    mapa.eachLayer((capa) => {
      if (capa instanceof L.Marker || capa instanceof L.Polyline) mapa.removeLayer(capa);
    });
  }

  const puntoUsuario = [origenLat, origenLon];
  const puntoSucursal = [SUCURSAL.lat, SUCURSAL.lon];

  L.marker(puntoUsuario).addTo(mapa).bindPopup("Tú estás aquí").openPopup();
  L.marker(puntoSucursal).addTo(mapa).bindPopup(SUCURSAL.nombre);

  const hayRuta = Array.isArray(coordsRuta) && coordsRuta.length > 0;
  const linea = hayRuta ? coordsRuta : [puntoUsuario, puntoSucursal];
  const estiloLinea = hayRuta
    ? { color: "#9a3412", weight: 5 }
    : { color: "#78716c", weight: 3, dashArray: "6 6" }; // punteada = línea recta

  L.polyline(linea, estiloLinea).addTo(mapa);
  mapa.fitBounds(L.latLngBounds([puntoUsuario, puntoSucursal]), { padding: [30, 30] });

  // Leaflet no calcula bien su tamaño si el contenedor estaba oculto
  setTimeout(() => mapa.invalidateSize(), 0);
}

document.addEventListener("DOMContentLoaded", () => {
  const boton = document.getElementById("btn-ubicacion");
  const mensaje = document.getElementById("ubicacion-mensaje");

  boton.addEventListener("click", () => {
    if (!("geolocation" in navigator)) {
      mensaje.textContent = "Este dispositivo no reporta ubicación.";
      return;
    }

    mensaje.textContent = "Buscando tu ubicación…";

    navigator.geolocation.getCurrentPosition(
      // Si el usuario acepta compartir su ubicación
      async (posicion) => {
        const { latitude, longitude } = posicion.coords;
        const mapaUrl = `https://www.openstreetmap.org/directions?from=${latitude}%2C${longitude}&to=${SUCURSAL.lat}%2C${SUCURSAL.lon}`;

        mensaje.textContent = "Calculando la ruta hasta la sucursal…";
        const ruta = await obtenerRuta(latitude, longitude);
        dibujarMapa(latitude, longitude, ruta ? ruta.coords : null);

        if (ruta) {
          mensaje.innerHTML =
            `Ruta hasta ${SUCURSAL.nombre}: <strong>${ruta.distanciaKm.toFixed(1)} km</strong> · ` +
            `~${Math.round(ruta.duracionMin)} min en auto. ` +
            `<a href="${mapaUrl}" target="_blank" rel="noopener">Abrir en el mapa</a>`;
        } else {
          const distanciaKm = calcularDistanciaKm(latitude, longitude, SUCURSAL.lat, SUCURSAL.lon);
          mensaje.innerHTML =
            `No se pudo calcular la ruta por calles; línea recta de ` +
            `<strong>${distanciaKm.toFixed(1)} km</strong> hasta ${SUCURSAL.nombre}. ` +
            `<a href="${mapaUrl}" target="_blank" rel="noopener">Abrir en el mapa</a>`;
        }
      },
      // Si el usuario rechaza o hay un error
      (error) => {
        mensaje.textContent = "No se pudo obtener tu ubicación: " + error.message;
      }
    );
  });
});