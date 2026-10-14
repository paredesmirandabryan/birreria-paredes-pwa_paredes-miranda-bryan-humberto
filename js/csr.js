// csr.js — Renderizado en el Cliente (CSR) + filtro por categoría
const contenedorCatalogo = document.getElementById("catalogo");

fetch("catalogo.json")
  .then((respuesta) => respuesta.json())
  .then((productos) => {
    contenedorCatalogo.innerHTML = "";
    contenedorCatalogo.removeAttribute("aria-busy");

    productos.forEach((producto) => {
      const tarjeta = document.createElement("div");
      tarjeta.className = "producto";
      // guardamos la categoría en la tarjeta para poder filtrarla después
      tarjeta.dataset.categoria = producto.categoria;

      tarjeta.innerHTML = `
        <img class="producto__foto" src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
        <strong>${producto.nombre}</strong>
        <span class="precio">$${producto.precio}</span>
        <p>Stock: ${producto.stock}</p>
        <button type="button" data-id="${producto.id}">Agregar</button>
      `;

      contenedorCatalogo.appendChild(tarjeta);

      // carrito.js se conecta en el punto 2; mientras no exista, no hace nada
      tarjeta.querySelector("button").addEventListener("click", () => {
        if (typeof agregarAlCarrito === "function") agregarAlCarrito(producto);
      });
    });

    crearFiltros(productos);
  })
  .catch((error) => {
    contenedorCatalogo.innerHTML = "<p>No se pudo cargar el catálogo. Intenta más tarde.</p>";
    contenedorCatalogo.removeAttribute("aria-busy");
    console.error("Error al cargar catálogo:", error);
  });

// Crea los botones de categoría y oculta las tarjetas que no coinciden
function crearFiltros(productos) {
  // categorías sin repetir, en el orden en que aparecen en catalogo.json
  const categorias = [...new Set(productos.map((p) => p.categoria))];

  const barra = document.createElement("div");
  barra.className = "filtros";
  barra.setAttribute("role", "group");
  barra.setAttribute("aria-label", "Filtrar por categoría");

  ["Todos", ...categorias].forEach((categoria) => {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.textContent = categoria;
    boton.setAttribute("aria-pressed", categoria === "Todos" ? "true" : "false");

    boton.addEventListener("click", () => {
      barra.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", "false"));
      boton.setAttribute("aria-pressed", "true");

      contenedorCatalogo.querySelectorAll(".producto").forEach((tarjeta) => {
        tarjeta.hidden = categoria !== "Todos" && tarjeta.dataset.categoria !== categoria;
      });
    });

    barra.appendChild(boton);
  });

  // la barra va justo antes del catálogo
  contenedorCatalogo.before(barra);
}