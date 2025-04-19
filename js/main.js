import { iniciarLogin, configurarBotonCerrar } from "./login.js";
iniciarLogin();
configurarBotonCerrar();

let casas = [];
let casasGuardadas = [];

const contenedorDestacadas = document.querySelector("#contenedor-destacadas");
const contenedorTodasCasas = document.querySelector("#contenedor-todas-casas");
const seccionTodasCasas = document.querySelector("#todas-las-casas");
const seccionDestacadas = document.querySelector("#destacadas");
const seccionPreguntas = document.querySelector(".contenedor-preguntas");
const casasContainer = document.querySelector("#casas-por-categoria");
const botonAlojamientos = document.querySelector("#btn-alojamientos");
const botonBuscar = document.querySelector(".buscar");
const categoriaSelect = document.querySelector("#categoria");

// Obtener casas desde JSON
fetch("data/casas.json")
  .then(res => res.json())
  .then(data => {
    casas = data;
    localStorage.setItem("casas", JSON.stringify(casas));
    casasGuardadas = casas;
    inicializarVista();
  })
  .catch(error => {
    console.error("Error_al_cargar_casas:", error);
    contenedorDestacadas.innerHTML = "<p>Error al cargar los alojamientos.</p>";
  });

// Vista inicial
function inicializarVista() {
  const params = new URLSearchParams(window.location.search);
  const mostrar = params.get("mostrar");

  // Ocultamos todas las secciones
  seccionDestacadas.classList.add("hidden");
  seccionTodasCasas.classList.add("hidden");
  seccionPreguntas.classList.add("hidden");
  casasContainer.classList.add("hidden");

  if (mostrar === "todas") {
    const titulo = document.querySelector("#titulo-general");
    if (titulo) {
      titulo.innerText = "Todos los Alojamientos";
    }
    seccionTodasCasas.classList.remove("hidden");
    cargarTodas(casasGuardadas);
  } else {
    seccionDestacadas.classList.remove("hidden");
    seccionPreguntas.classList.remove("hidden");
    cargarDestacadas();
  }

  const ver = params.get("ver");
  if (ver === "todas") {
    seccionTodasCasas.classList.remove("hidden");
    seccionTodasCasas.scrollIntoView({ behavior: "smooth" });
  }
}

// Mostrar destacadas
function cargarDestacadas() {
  const destacadas = casasGuardadas.filter(casa => casa.destacada);
  contenedorDestacadas.innerHTML = "";

  destacadas.forEach(casa => {
    const div = document.createElement("div");
    div.classList.add("casa");
    div.innerHTML = `
      <img class="casa-imagen" src="${casa.imagen}" alt="${casa.titulo}">
      <div class="casa-detalles">
        <h3 class="casa-titulo">${casa.titulo}</h3>
        <p class="casa-precio">$${casa.precio} por noche</p>
        <button class="casa-reserva">Más Info</button>
      </div>
    `;
    contenedorDestacadas.appendChild(div);

    const boton = div.querySelector(".casa-reserva");
    boton.addEventListener("click", () => {
      window.location.href = `../pages/detalle.html?id=${casa.id}`;
    });
  });

  casasContainer.classList.add("hidden");
}

// Mostrar todas las casas
function cargarTodas(casas) {
  contenedorTodasCasas.innerHTML = "";

  casas.forEach(casa => {
    const div = document.createElement("div");
    div.classList.add("casa");
    div.innerHTML = `
      <img class="casa-imagen" src="${casa.imagen}" alt="${casa.titulo}">
      <div class="casa-detalles">
        <h3 class="casa-titulo">${casa.titulo}</h3>
        <p class="casa-precio">$${casa.precio} por noche</p>
        <button class="casa-reserva">Reservar</button>
      </div>
    `;
    contenedorTodasCasas.appendChild(div);

    const boton = div.querySelector(".casa-reserva");
    boton.addEventListener("click", () => {
      window.location.href = `../pages/detalle.html?id=${casa.id}`;
    });
  });
}

// Botón Alojamientos para mostrar todas las casas
botonAlojamientos.addEventListener("click", () => {
  // Mostrar sección de todas las casas
  seccionTodasCasas.classList.remove("hidden");
  seccionDestacadas.classList.add("hidden");
  casasContainer.classList.add("hidden");
  seccionPreguntas.classList.add("hidden");

  // Resetear títulos al ver todas las casas-----------CREO QUE NO RESULTÓ Y REPITE LOS TITULOS--------------
  const tituloCategoria = document.querySelector("#titulo-categoria");
  const tituloGeneral = document.querySelector("#titulo-general");

  if (tituloCategoria) {
    tituloCategoria.textContent = "";
    tituloCategoria.style.display = "none";
  }

  if (tituloGeneral) {
    tituloGeneral.textContent = "Todos los Alojamientos", "Las más elegidas";
    tituloGeneral.style.display = "block";
  }

  // Mostrar todas las casas
  cargarTodas(casasGuardadas);
  seccionTodasCasas.scrollIntoView({ behavior: "smooth" });
});


// Buscar por categoría
botonBuscar.addEventListener("click", () => {
  const categoriaId = categoriaSelect.value;

  seccionDestacadas.classList.add("hidden");
  seccionTodasCasas.classList.add("hidden");
  seccionPreguntas.classList.add("hidden");

  casasContainer.classList.remove("hidden");
  casasContainer.scrollIntoView({ behavior: "smooth" });
  mostrarCasas(categoriaId);
});

// Mostrar casas filtradas por categoria
function mostrarCasas(categoriaId = "") {
  const casasFiltradas = casas.filter(casa => casa.categoria.id === categoriaId || categoriaId === "");
  casasContainer.innerHTML = "";

  const tituloCategoria = document.querySelector("#titulo-categoria");
  const tituloGeneral = document.querySelector("#titulo-general");

  if (categoriaId !== "") {
    const categoriaNombre = casas.find(casa => casa.categoria.id === categoriaId)?.categoria.nombre;
    tituloCategoria.textContent = `${categoriaNombre || ""}`;
    tituloCategoria.style.display = "block";
    tituloGeneral.style.display = "none"; // ocultar titulo general
  } else {
    tituloCategoria.textContent = "";
    tituloCategoria.style.display = "none";
    tituloGeneral.style.display = "block"; // mostrar titulo general
  }

  if (casasFiltradas.length > 0) {
    casasFiltradas.forEach(casa => {
      const div = document.createElement("div");
      div.classList.add("casa");
      div.innerHTML = `
        <img class="casa-imagen" src="${casa.imagen}" alt="${casa.titulo}">
        <div class="casa-detalles">
          <h3 class="casa-titulo">${casa.titulo}</h3>
          <p class="casa-precio">$${casa.precio} por noche</p>
          <button class="casa-reserva">RESERVAR</button>
        </div>
      `;
      casasContainer.appendChild(div);

      const boton = div.querySelector(".casa-reserva");
      boton.addEventListener("click", () => {
        window.location.href = `../pages/detalle.html?id=${casa.id}`;
      });
    });
  } else {
    casasContainer.innerHTML = "<p>No hay casas disponibles para esta categoría.</p>";
  }
}


