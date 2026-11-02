// app.js — muestra si la app tiene conexión (el Service Worker se registra en index.html)

function actualizarPildoraConexion() {
  const pildora = document.getElementById("estado-conexion");
  if (navigator.onLine) {
    pildora.textContent = "conectado";
    pildora.classList.remove("sin-conexion");
  } else {
    pildora.textContent = "sin conexión";
    pildora.classList.add("sin-conexion");
  }
}

document.addEventListener("DOMContentLoaded", actualizarPildoraConexion);

// La intro se desvanece sola con CSS; al terminar la quitamos del documento
const intro = document.querySelector(".intro");
if (intro) {
  intro.addEventListener("animationend", (evento) => {
    if (evento.animationName === "intro-salida") intro.remove();
  });
  setTimeout(() => intro.remove(), 2500); // respaldo por si no hay animaciones
}
window.addEventListener("online", actualizarPildoraConexion);
window.addEventListener("offline", actualizarPildoraConexion);