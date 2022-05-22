//verificar que el usuario exista
function userLog() {
  const token = JSON.parse(localStorage.getItem("datos"));
  if (!token) {
    window.location.replace(`login.html`);
  }
}
userLog();

const ApiKey = "249f222afb1002186f4d88b2b5418b55&";
let page = "page=";
let iter = 1;
const userGuardado = JSON.parse(localStorage.getItem("datos"));
const { nombre, apellido, genero } = userGuardado;

//buscar y mostrar las peliculas.
async function getMovies(url) {
  const resp = await fetch(url);
  const respData = await resp.json();

  movies(respData.results);
}

// Muestra  generos en index
function changeGenres(data) {
  const divContenedor = document.getElementById("interes");
  const localDatos = JSON.parse(localStorage.getItem("datos"));
  data.forEach((element) => {
    const opcion = document.createElement("option");
    opcion.innerHTML = element.name;
    opcion.value = element.id;
    divContenedor.append(opcion);
  });

  divContenedor.value = localDatos.genero;

  //funcion que cambia peliculas por genero
  divContenedor.addEventListener("change", (e) => {
    e.preventDefault();
    const generoNuevo = e.target.value;

    const editaDatos = { ...localDatos, genero: generoNuevo };

    localStorage.setItem("datos", JSON.stringify(editaDatos));
    const contenedor = document.getElementById("main-grid");
    contenedor.innerHTML = "";
    getMovies(
      `https://api.themoviedb.org/3/discover/movie?api_key=${ApiKey}&with_genres=${generoNuevo}&language=es-ES${
        page + iter
      }`
    );
  });
}

//obtiene los generos de la API
async function getGenero(url) {
  const resp = await fetch(url);
  const respData = await resp.json();

  changeGenres(respData.genres);
}

window.addEventListener("load", function () {
  getGenero(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${ApiKey}&language=es-ES`
  );
  getMovies(
    `https://api.themoviedb.org/3/discover/movie?api_key=${ApiKey}&with_genres=${genero}&language=es-ES&${
      page + iter
    }`
  );
  showList();
  changePage();
});

//guarda la pelicula en el localStroge
function favoriteList(addList, idPelicula) {
  addList.addEventListener("click", (e) => {
    e.preventDefault();
    const userList = JSON.parse(localStorage.getItem("intereses"));

    let peliculaAgregada = idPelicula;

    let newList = [...userList, peliculaAgregada];
    let arrayUnico = [...new Set(newList)];
    localStorage.setItem("intereses", JSON.stringify(arrayUnico));
    addList.innerHTML = "✔";
  });
}

//Recorre las peliculas y solicita la creacion de las Cards
function movies(data) {
  const contenedor = document.getElementById("main-grid");

  data.forEach((element) => {
    createMovieCard(element, contenedor);
  });
}

//Crea las cards
function createMovieCard(itemPeli, contenedor, Isok) {
  let divCard = document.createElement("div");
  divCard.classList.add("filmcard");
  divCard.id = "card";
  let divHeader = document.createElement("div");
  divHeader.classList.add("card-header");
  let divInfoUp = document.createElement("div");
  divInfoUp.classList.add("upInfo");
  let valoracion = document.createElement("span");
  valoracion.classList.add("valoracion");
  let divImagen = document.createElement("figure");
  divImagen.classList.add("imagen");
  let imagen = document.createElement("img");
  let divInfoDown = document.createElement("div");
  divInfoDown.classList.add("downInfo");
  let boton = document.createElement("button");
  boton.classList.add("boton-trailer");
  let listBoton = document.createElement("button");
  listBoton.classList.add("Agregar-lista");

  addEvent(boton, itemPeli.id);

  const userList = JSON.parse(localStorage.getItem("intereses"));
  let checkOut = userList.includes(itemPeli.id);
  if (checkOut) {
    listBoton.innerHTML = "✔";
  } else {
    listBoton.innerHTML = "+";
  }

  divInfoUp.innerText = itemPeli.title;
  valoracion.innerHTML = itemPeli.vote_average;
  imagen.src = "https://image.tmdb.org/t/p/w500/" + itemPeli.poster_path;

  favoriteList(listBoton, itemPeli.id);

  divImagen.append(imagen);
  boton.innerText = "ver Trailer";

  divHeader.append(divInfoUp, valoracion);
  divInfoDown.append(boton, listBoton);
  if (Isok) {
    listBoton.style.display = "none";
    divInfoDown.style.display = "block";
  }
  divCard.append(divHeader, divImagen, divInfoDown);
  contenedor.append(divCard);
}
//redirige a la pagina del trailer.
function addEvent(btn, idPelicula) {
  btn.addEventListener("click", () =>
    window.location.replace(`trailer.html?${idPelicula}`)
  );
}
//Mostrar los favoritos
function showList() {
  const listadoFavoritos = document.getElementById("milista");

  listadoFavoritos.addEventListener("click", (e) => {
    e.preventDefault();
    const listadoDePeliculas = JSON.parse(localStorage.getItem("intereses"));
    const contenedor = document.getElementById("main-grid");
    if (!listadoDePeliculas.length == 0) {
      contenedor.innerHTML = "";

      for (let i = 0; i < listadoDePeliculas.length; i++) {
        urlItem = `https://api.themoviedb.org/3/movie/${listadoDePeliculas[i]}?api_key=${ApiKey}&language=es-ES`;
        getMovieData(urlItem, contenedor);
        const btnPaginacion = (document.getElementById(
          "botones"
        ).style.display = "none");
      }
      deleteList();
    } else {
      Swal.fire({
        icon: "error",
        title: "No tienes peliculas en tu lista",
      });
    }
  });
}

//obtiene los datos de los favoritos
async function getMovieData(urlItem, contenedor) {
  const r = await fetch(urlItem);
  const respData = await r.json();

  createMovieCard(respData, contenedor, true);
}
//funcion para borrar los favoritos
function deleteList() {
  document.getElementById("milista").style.display = "none";
  let contenedor = document.getElementById("header-cnt");
  let btnBorrar = document.createElement("button");
  contenedor.append(btnBorrar);
  btnBorrar.classList.add("btn-borrar");
  btnBorrar.innerText = "Borrar listado";
  btnBorrar.addEventListener("click", () => {
    localStorage.setItem("intereses", JSON.stringify([]));
    window.location.reload();
  });
}
//Navegar entre paginas
function changePage() {
  paginacion = document.querySelectorAll(".paginas");
  let contenedor = document.getElementById("main-grid");

  paginacion.forEach((e) => {
    e.addEventListener("click", () => {
      if (e.id === "next") {
        iter++;
        contenedor.innerHTML = "";
        getMovies(
          `https://api.themoviedb.org/3/discover/movie?api_key=${ApiKey}&with_genres=${genero}&language=es-ES&${
            page + iter
          }`
        );
      }
      if (e.id === "prev" && iter > 1) {
        iter--;
        contenedor.innerHTML = "";
        getMovies(
          `https://api.themoviedb.org/3/discover/movie?api_key=${ApiKey}&with_genres=${genero}&language=es-ES&${
            page + iter
          }`
        );
      }
    });
  });
}
