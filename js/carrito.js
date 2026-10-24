// carrito.js — Carrito con localStorage + sincronización al volver la conexión

const CLAVE_CARRITO = "carrito";

function leerCarrito() {
  const guardado = localStorage.getItem(CLAVE_CARRITO);
  return guardado ? JSON.parse(guardado) : [];
}

function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

function agregarAlCarrito(producto) {
  const carrito = leerCarrito();
  const existente = carrito.find((item) => item.id === producto.id);

  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1,
    });
  }

  guardarCarrito(carrito);
  pintarCarrito();

  // Notificación útil: solo aparece si el usuario ya dio permiso (punto 2)
  if (typeof notificar === "function") {
    notificar("Pedido agregado", `${producto.nombre} se agregó a tu carrito.`);
  }
}

function cambiarCantidad(id, delta) {
  const carrito = leerCarrito();
  const item = carrito.find((item) => item.id === id);
  if (!item) return;

  item.cantidad += delta;
  const actualizado = item.cantidad <= 0 ? carrito.filter((i) => i.id !== id) : carrito;

  guardarCarrito(actualizado);
  pintarCarrito();
}

function quitarDelCarrito(id) {
  const carrito = leerCarrito().filter((item) => item.id !== id);
  guardarCarrito(carrito);
  pintarCarrito();
}

function pintarCarrito() {
  const carrito = leerCarrito();
  const lista = document.getElementById("carrito-lista");
  const total = document.getElementById("carrito-total");

  lista.innerHTML = "";
  let suma = 0;

  if (carrito.length === 0) {
    lista.innerHTML = '<li class="carrito-vacio">Tu carrito está vacío.</li>';
  }

  carrito.forEach((item) => {
    const subtotal = item.precio * item.cantidad;
    suma += subtotal;

    const li = document.createElement("li");
    li.innerHTML = `
      <span class="carrito-nombre">${item.nombre}</span>
      <span class="carrito-cantidad">
        <button type="button" data-accion="restar" data-id="${item.id}" aria-label="Quitar una unidad de ${item.nombre}">−</button>
        <span class="carrito-cantidad__valor">${item.cantidad}</span>
        <button type="button" data-accion="sumar" data-id="${item.id}" aria-label="Agregar una unidad de ${item.nombre}">+</button>
      </span>
      <span class="carrito-precio">$${subtotal}</span>
      <button type="button" class="carrito-quitar" data-accion="quitar" data-id="${item.id}">Quitar</button>
    `;
    lista.appendChild(li);
  });

  total.textContent = suma;
}

function manejarClicCarrito(evento) {
  const boton = evento.target.closest("button[data-accion]");
  if (!boton) return;

  const id = Number(boton.dataset.id);
  if (boton.dataset.accion === "sumar") cambiarCantidad(id, 1);
  if (boton.dataset.accion === "restar") cambiarCantidad(id, -1);
  if (boton.dataset.accion === "quitar") quitarDelCarrito(id);
}

// SINCRONIZAR: en una app real aquí iría un fetch() con method "POST" al servidor.
// Lo simulamos para practicar el patrón sin conexión -> con conexión.
function sincronizarCarrito() {
  const mensaje = document.getElementById("carrito-mensaje");

  // navigator.onLine: el navegador dice si hay internet
  if (!navigator.onLine) {
    mensaje.textContent = "Sin conexión: tu carrito se enviará cuando vuelva el internet.";
    return;
  }

  const carrito = leerCarrito();
  if (carrito.length === 0) {
    mensaje.textContent = "Tu carrito está vacío: no hay nada que enviar.";
    return;
  }

  const piezas = carrito.reduce((suma, item) => suma + item.cantidad, 0);
  mensaje.textContent = `Carrito enviado: ${piezas} producto(s). ✓ (simulado)`;

  if (typeof notificar === "function") {
    notificar("Carrito enviado", `Se envió tu pedido de ${piezas} producto(s).`);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  pintarCarrito();
  document.getElementById("carrito-lista").addEventListener("click", manejarClicCarrito);
  document.getElementById("btn-sincronizar").addEventListener("click", sincronizarCarrito);

  // El navegador avisa cuando se pierde o regresa la conexión
  window.addEventListener("online", () => {
    if (leerCarrito().length > 0) {
      sincronizarCarrito(); // vuelve el internet: se "envía" el carrito y se avisa
    } else {
      document.getElementById("carrito-mensaje").textContent = "Conexión restablecida.";
    }
  });

  window.addEventListener("offline", () => {
    document.getElementById("carrito-mensaje").textContent =
      "Se perdió la conexión. Tu carrito se guarda y se enviará al volver.";
  });
});