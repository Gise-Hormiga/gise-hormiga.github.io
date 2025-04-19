//Junto al material y lo aprendido, muchas cosas me ayudó el chat a poder ordenar y poner en lógica lo que quise lograr y todas las sugerencias las fuí probando y adapatando

import { iniciarLogin, mostrarLogin, configurarBotonCerrar } from "./login.js";

iniciarLogin();
configurarBotonCerrar();

// ID desde la URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// Traigo casas desde JSON
fetch("../data/casas.json")
  .then(res => res.json())
  .then(casas => {
    const casa = casas.find(c => c.id == id);
    if (!casa) return mostrarError("Casa no encontrada.");

    renderizarDetalle(casa);
    configurarFormularioReserva(casa);
    mostrarGaleria(casa);
  })
  .catch(error => {
    console.error("Error al cargar casas:", error);
    mostrarError("Error al cargar los datos de la casa.");
  });

// Función mostar mensaje de error en contenedor
function mostrarError(mensaje) {
  document.querySelector("#detalleCasa").innerHTML = `<p>${mensaje}</p>`;
}

// Funciónr renderizar detalle casa
function renderizarDetalle(casa) {
  const detalle = document.querySelector("#detalleCasa");
  detalle.innerHTML = `
    <div class="container my-4">
      <div class="row">
        <div class="col-md-8">
          <p><i class="bi bi-geo-alt-fill"></i> ${casa.ubicacion}</p>
          <h2 class="fw-bold mb-3">${casa.titulo}</h2>
          <p><strong>Descripción:</strong> ${casa.descripcion}</p>
          <p><strong>Servicios:</strong> ${casa.servicios.join(", ")}</p>
          <p><strong>Precio por noche:</strong> <span>$${casa.precio}</span></p>
        </div>
        <div class="col-md-4">
          <div class="card shadow p-4 rounded-4">
            <h4 class="text-center mb-3">ARS $${casa.precio}/Noche</h4>
            <form id="formReserva">
              <div class="mb-3">
                <label for="checkin" class="form-label">Desde</label>
                <input type="date" class="form-control" id="checkin" required>
              </div>
              <div class="mb-3">
                <label for="checkout" class="form-label">Hasta</label>
                <input type="date" class="form-control" id="checkout" required>
              </div>
              <div class="mb-3">
                <label for="huespedes" class="form-label">Personas</label>
                <input type="number" class="form-control" id="huespedes" min="1" max="10" required>
              </div>
              <p id="totalReserva" class="text-center fw-semibold mb-3"></p>
              <button type="submit" class="btn-reservar w-100">Reservar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Función mostar galería de imagenes
function mostrarGaleria(casa) {
  const galeria = document.querySelector("#galeriaImagenes");
  galeria.innerHTML = "";
  casa.imagenes.forEach(img => {
    const imagen = document.createElement("img");
    imagen.src = img;
    imagen.alt = `Imagen de ${casa.titulo}`;
    imagen.classList.add("imagen-detalle");
    galeria.appendChild(imagen);
  });
}

// Función configurar formulario reserva
function configurarFormularioReserva(casa) {
  const form = document.querySelector("#formReserva");
  const checkinInput = document.querySelector("#checkin");
  const checkoutInput = document.querySelector("#checkout");
  const totalReserva = document.querySelector("#totalReserva");

  function calcularTotal() {
    const checkin = new Date(checkinInput.value);
    const checkout = new Date(checkoutInput.value);

    if (!isNaN(checkin) && !isNaN(checkout) && checkout > checkin) {
      const noches = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
      const total = noches * casa.precio;
      totalReserva.textContent = `Total: $${total} por ${noches} noche(s)`;
    } else {
      totalReserva.textContent = "";
    }
  }

  checkinInput.addEventListener("change", calcularTotal);
  checkoutInput.addEventListener("change", calcularTotal);

  form.addEventListener("submit", e => {
    e.preventDefault();
    const usuarioGuardado = localStorage.getItem("usuarioLogueado");

    if (!usuarioGuardado) {
      Swal.fire({
        title: "¡Necesitás iniciar sesión!",
        text: "Para realizar una reserva, por favor iniciá sesión.",
        icon: "warning",
        confirmButtonText: "Iniciar sesión",
        customClass: {
          popup: "mi-popup",
          title: "mi-titulo",
          confirmButton: "mi-boton-confirmar",
        },
      }).then(result => {
        if (result.isConfirmed) {
          mostrarLogin(() => realizarReserva(casa));
        }
      });
    } else {
      realizarReserva(casa);
    }
  });
}

// Función realizar la reserva
function realizarReserva(casa) {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
  const checkin = document.querySelector("#checkin").value;
  const checkout = document.querySelector("#checkout").value;
  const huespedes = document.querySelector("#huespedes").value;

  const reserva = {
    casaId: casa.id,
    casaNombre: casa.titulo,
    checkin,
    checkout,
    huespedes,
    usuario: usuario.email
  };

  const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
  reservas.push(reserva);
  localStorage.setItem("reservas", JSON.stringify(reservas));

  Swal.fire({
    icon: "success",
    title: "¡Reserva confirmada!",
    text: `Gracias por reservar, ${usuario.nombre}`,
    confirmButtonText: "Ir al inicio",
    customClass: {
      popup: "mi-popup",
      title: "mi-titulo",
      confirmButton: "mi-boton-confirmar"
    },
  }).then(() => {
    window.location.href = "../index.html";
  });
}

// Botón en nav volver a ver todos los alojamientos
const botonAlojamientos = document.querySelector("#btn-alojamientos");
botonAlojamientos.addEventListener("click", () => {
  window.location.href = "../index.html?mostrar=todas";
});



