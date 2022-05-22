const peliId = window.location.search.replace("?", "");
window.addEventListener("load", async () => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${peliId}/videos?api_key=249f222afb1002186f4d88b2b5418b55`
  );
  const { results } = await response.json();
  let filtrado = results.find((e) => e.type === "Trailer");
  const key = filtrado?.key;

  creaTrailer(key);
});

//crea y muestra el trailer
function creaTrailer(idPelicula) {
  const contenedor = document.getElementById("trailer");
  const youtubeDiv = document.createElement("div");

  if (idPelicula) {
    youtubeDiv.classList.add("youtube-trailer");

    youtubeDiv.innerHTML = `<iframe src="https://www.youtube.com/embed/${idPelicula}
      " title="YouTube video player" modestbranding=1&rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> `;
  } else {
    let noTrailer = document.createElement("p");
    noTrailer.classList.add("not-trailer");
    noTrailer.innerText =
      "No hay registros de trailrs de la pelicula seleccionada";
    youtubeDiv.append(noTrailer);
  }
  const divLateral = document.createElement("div");
  divLateral.classList.add("lateral");
  let volver = document.createElement("button");
  volver.classList.add("boton-volver");
  volver.innerText = "volver";
  divLateral.append(volver);
  contenedor.append(youtubeDiv, divLateral);

  volver.addEventListener("click", () => window.location.replace("index.html"));
}
