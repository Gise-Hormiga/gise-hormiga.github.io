// Usuario ejemplo cargado Juan/juan@ejemplo/1234
export function iniciarLogin() {
    const btnEntrar = document.querySelector("#btnEntrar");

    if (btnEntrar) {
        btnEntrar.addEventListener("click", () => mostrarLogin());
    }
}

export function mostrarLogin(callback) {
    Swal.fire({
        title: "¡Te damos la bienvenida!",
        html: `
        <input type="email" id="swalEmail" class="swal2-input" placeholder="Email">
        <input type="password" id="swalPassword" class="swal2-input" placeholder="Contraseña">
        <p style="margin-top: 1em;">¿No tenés cuenta? <a href="#" id="linkRegistro">Registrate</a></p>
      `,
        showCancelButton: true,
        confirmButtonText: "Ingresar",
        cancelButtonText: "Cancelar",
        customClass: {
            popup: 'mi-popup',
            title: 'mi-titulo',
            confirmButton: 'mi-boton-confirmar',
            cancelButton: 'mi-boton-cancelar'
        },
        didOpen: () => {
            const linkRegistro = document.querySelector("#linkRegistro");
            if (linkRegistro) {
                linkRegistro.addEventListener("click", (e) => {
                    e.preventDefault();
                    Swal.close();
                    mostrarRegistro(callback); // callback también al registro
                });
            }
        },
        preConfirm: () => {
            const email = document.querySelector("#swalEmail").value;
            const password = document.querySelector("#swalPassword").value;

            if (!email || !password) {
                Swal.showValidationMessage("Completá ambos campos");
                return false;
            }

            const usuarios = obtenerUsuarios();
            const usuario = usuarios.find(u => u.email === email && u.password === password);

            if (!usuario) {
                Swal.showValidationMessage("Usuario no encontrado. ¡Tenés que registrarte!");
                return false;
            }

            return usuario;
        }
    }).then((result) => {
        if (result.isConfirmed && result.value) {
            const usuario = result.value;
            guardarUsuarioLogueado(usuario);
            Swal.fire({
                text: `¡Hola ${usuario.nombre}!`,
                title: "Ingresaste con éxito",
                icon: "success",
                confirmButtonText: "Ok",
                customClass: {
                    popup: "mi-popup",
                    title: "mi-titulo",
                    confirmButton: 'mi-boton-confirmar'
                }
            }).then(() => {
                if (typeof callback === "function") {
                    callback();
                }
            });
        }
    });
}

function mostrarRegistro(callback) {
    Swal.fire({
        title: "Registrate",
        html: `
        <input type="text" id="swalNombre" class="swal2-input" placeholder="Nombre">
        <input type="email" id="swalEmail" class="swal2-input" placeholder="Email">
        <input type="password" id="swalPassword" class="swal2-input" placeholder="Contraseña">
      `,
        showCancelButton: true,
        confirmButtonText: "Registrar",
        cancelButtonText: "Cancelar",
        customClass: {
            popup: 'mi-popup',
            title: 'mi-titulo',
            confirmButton: 'mi-boton-confirmar',
            cancelButton: 'mi-boton-cancelar'
        },
        preConfirm: () => {
            const nombre = document.querySelector("#swalNombre").value;
            const email = document.querySelector("#swalEmail").value;
            const password = document.querySelector("#swalPassword").value;

            if (!nombre || !email || !password) {
                Swal.showValidationMessage("Completá todos los campos");
                return false;
            }

            const usuarios = obtenerUsuarios();
            const yaExiste = usuarios.some(u => u.email === email);

            if (yaExiste) {
                Swal.showValidationMessage("Este email ya está registrado");
                return false;
            }

            const nuevoUsuario = { nombre, email, password };
            usuarios.push(nuevoUsuario);
            guardarUsuarios(usuarios);

            return nuevoUsuario;
        },
    }).then((result) => {
        if (result.isConfirmed && result.value) {
            guardarUsuarioLogueado(result.value);
            Swal.fire({
                title: `¡Hola ${result.value.nombre}!`,
                text: "Te registraste con éxito.",
                icon: "success",
                confirmButtonText: "Ok",
                customClass: {
                    popup: 'mi-popup',
                    title: 'mi-titulo',
                    confirmButton: 'mi-boton-confirmar'
                }

            }).then(() => {
                if (typeof callback === "function") {
                    callback(); //
                }
            });
        }
    });
}

function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem("usuariosIniciales")) || [];
}

function guardarUsuarios(usuarios) {
    localStorage.setItem("usuariosIniciales", JSON.stringify(usuarios));
}

function guardarUsuarioLogueado(usuario) {
    localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));
}

export function cerrarSesion() {
    localStorage.removeItem("usuarioLogueado");
    Swal.fire({
        title: "Sesión cerrada",
        text: "Saliste de tu cuenta",
        icon: "info",
        confirmButtonText: "Ok",
        customClass: {
            popup: 'mi-popup',
            title: 'mi-titulo',
            confirmButton: 'mi-boton-confirmar',
        },
    }).then(() => {

        location.reload();
    });
}

export function configurarBotonCerrar() {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
    const btnCerrar = document.querySelector("#btnCerrar");

    if (btnCerrar && usuario) {
        btnCerrar.classList.remove("d-none");
        btnCerrar.addEventListener("click", cerrarSesion);
    }
}