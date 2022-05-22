window.addEventListener("load", function () {
  class usuario {
    constructor(nombre, apellido, genero) {
      this.nombre = nombre;
      this.apellido = apellido;
      this.genero = genero;
    }
  }

  const botonEnviar = document.getElementById("btnEnviar");

  botonEnviar.addEventListener("click", () => {
    const userName = document.getElementById("username").value;
    const userLastName = document.getElementById("lastname").value;
    let userSelect = document.getElementById("interes").value;
    let miLista = [];
    if (!userName | !userLastName) {
      Swal.fire({
        icon: "error",
        title: "Completa los datos por favor",
      });
    } else {
      const nuevoUsuario = new usuario(userName, userLastName, userSelect);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `Usuario creado con exito! Bienvenido ${userName}`,
        showConfirmButton: false,
        timer: 1500,
      });

      setTimeout(function () {
        localStorage.setItem("datos", JSON.stringify(nuevoUsuario));
        localStorage.setItem("intereses", JSON.stringify(miLista));
        window.location.replace(`index.html`);
      }, 2000);
    }
  });
});

function muestraGeneros(data) {
  const divContenedor = document.getElementById("interes");

  data.forEach((element) => {
    const opcion = document.createElement("option");
    opcion.innerHTML = element.name;
    opcion.value = element.id;
    divContenedor.append(opcion);
  });
}
getGenero(
  "https://api.themoviedb.org/3/genre/movie/list?api_key=249f222afb1002186f4d88b2b5418b55&language=es-ES"
);
async function getGenero(url) {
  const resp = await fetch(url);
  const respData = await resp.json();

  muestraGeneros(respData.genres);
}
