// csr.js — Renderizado en el Cliente (CSR)
// El HTML llega con el <div id="catalogo"> vacío; este archivo, ya corriendo
// en el navegador, pide los datos con fetch() y construye las tarjetas.

// 1) Buscamos el contenedor vacío que dejamos en index.html
const contenedorCatalogo = document.getElementById("catalogo");

// 2) fetch() le pide catalogo.json al servidor
fetch("catalogo.json")
  .then((respuesta) => respuesta.json()) // convierte el texto en un array de objetos
  .then((productos) => {
    // 3) Ya tenemos los 15 productos: limpiamos el contenedor y dibujamos
    contenedorCatalogo.innerHTML = "";
    contenedorCatalogo.removeAttribute("aria-busy");

    productos.forEach((producto) => {
      const tarjeta = document.createElement("div");
      tarjeta.className = "producto";

      tarjeta.innerHTML = `
        <img class="producto__foto" src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
        <strong>${producto.nombre}</strong>
        <span class="precio">$${producto.precio}</span>
        <p>Stock: ${producto.stock}</p>
        <button type="button" data-id="${producto.id}">Agregar</button>
      `;

      contenedorCatalogo.appendChild(tarjeta);

      // Conecta el botón con carrito.js (se crea en el avance 2).
      // Mientras ese archivo no exista, el botón simplemente no hace nada.
      tarjeta.querySelector("button").addEventListener("click", () => {
        if (typeof agregarAlCarrito === "function") agregarAlCarrito(producto);
      });
    });
  })
  .catch((error) => {
    contenedorCatalogo.innerHTML = "<p>No se pudo cargar el catálogo. Intenta más tarde.</p>";
    contenedorCatalogo.removeAttribute("aria-busy");
    console.error("Error al cargar catálogo:", error);
  });