// carrito.js — Carrito de compras con localStorage
// localStorage guarda el carrito dentro del navegador: sobrevive al recargar
// la página y a cerrar la pestaña.

const CLAVE_CARRITO = "carrito";

// Lee el carrito guardado (si no hay nada, regresa un array vacío)
function leerCarrito() {
  const guardado = localStorage.getItem(CLAVE_CARRITO); // localStorage solo guarda texto
  return guardado ? JSON.parse(guardado) : [];          // JSON.parse lo convierte a array
}

// Guarda el carrito (JSON.stringify lo convierte a texto)
function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

// AGREGAR: suma el producto, o le sube la cantidad si ya estaba
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
}

// SUMAR / RESTAR: cambia la cantidad; si llega a 0, el producto se quita solo
function cambiarCantidad(id, delta) {
  const carrito = leerCarrito();
  const item = carrito.find((item) => item.id === id);
  if (!item) return;

  item.cantidad += delta;
  const actualizado = item.cantidad <= 0 ? carrito.filter((i) => i.id !== id) : carrito;

  guardarCarrito(actualizado);
  pintarCarrito();
}

// QUITAR: elimina el producto sin importar su cantidad
function quitarDelCarrito(id) {
  const carrito = leerCarrito().filter((item) => item.id !== id);
  guardarCarrito(carrito);
  pintarCarrito();
}

// Dibuja el carrito en pantalla a partir de lo que hay en localStorage y calcula el TOTAL
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

// Un solo listener en la lista atiende los clics de TODOS los botones (+, −, Quitar),
// incluso los que se crean después cada vez que se vuelve a pintar el carrito.
function manejarClicCarrito(evento) {
  const boton = evento.target.closest("button[data-accion]");
  if (!boton) return;

  const id = Number(boton.dataset.id);
  if (boton.dataset.accion === "sumar") cambiarCantidad(id, 1);
  if (boton.dataset.accion === "restar") cambiarCantidad(id, -1);
  if (boton.dataset.accion === "quitar") quitarDelCarrito(id);
}

// Al cargar la página, pinta lo que ya estaba guardado (así persiste al recargar)
document.addEventListener("DOMContentLoaded", () => {
  pintarCarrito();
  document.getElementById("carrito-lista").addEventListener("click", manejarClicCarrito);
});