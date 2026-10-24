// notificaciones.js — Notification API del navegador

// Muestra una notificación, pero solo si el usuario ya dio permiso
function notificar(titulo, cuerpo) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  const opciones = { body: cuerpo, icon: "img/logo.png" };

  try {
    new Notification(titulo, opciones);
  } catch (error) {
    // Chrome en Android no permite "new Notification": usa el Service Worker si ya existe
    if (navigator.serviceWorker) {
      navigator.serviceWorker.getRegistration().then((registro) => {
        if (registro) registro.showNotification(titulo, opciones);
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const boton = document.getElementById("btn-notificar");
  const mensaje = document.getElementById("notificaciones-mensaje");

  boton.addEventListener("click", () => {
    if (!("Notification" in window)) {
      mensaje.textContent = "Este navegador no soporta notificaciones.";
      return;
    }

    // Abre el cuadro del navegador "Permitir / Bloquear"
    Notification.requestPermission().then((permiso) => {
      if (permiso === "granted") {
        notificar("Birriería Paredes", "¡Listo! Te avisaremos de tus pedidos.");
        mensaje.textContent = "Notificaciones activadas.";
      } else {
        mensaje.textContent = "No diste permiso para notificaciones.";
      }
    });
  });
});