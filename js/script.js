var pagina = 1;
var tituloElegido = "";
var tipoElegido = "";
var scrollBloqueado = false;
$(document).ready(()=>{
    $(".modal-dialog").draggable();
    $("#bBuscar").click(()=>{
        primeravez = true;
        pagina = 1;
        tituloElegido = $('#textoBusqueda').val();
        tipoElegido = $("input[name='tipo']:checked").val();
        $("#tarjetas .tarjeta").remove();
        buscarPeliculas();
    })
    $("#cerrarDescripcion").click(()=>{
        $("#divDescripcion").fadeOut();
    })
    $(window).scroll(function (event) {
        if(!scrollBloqueado){
            var scrollPosition = $(window).height() + $(window).scrollTop();
            var alturaPagina = $(document).height();
            if(scrollPosition > alturaPagina-100){
                scrollBloqueado = true;
                pagina++;
                buscarPeliculas();
            }
        }
    });
});

function buscarPeliculas(){
    $("#pre-loader").attr("style","");
    $.getJSON("https://www.omdbapi.com/?s="+tituloElegido+"&type="+tipoElegido+"&apikey=6f3b0414&page="+pagina,function(respuesta){
            mostrarDatos(respuesta);
            scrollBloqueado = false;
            $("#pre-loader").attr("style","display:none");
    });
}

function mostrarDatos(datos){
    $.each(datos.Search,function(indice,elemento){
        crearTarjeta(elemento);
    });
}
function crearTarjeta(elemento){
    let tarjeta = $("<div>");
    $(tarjeta).attr("class","tarjeta col-md-3 col-xl-2 col-sm-6 offset-1 offset-md-0");
    tarjeta.idPelicula = elemento.imdbID;
    $(tarjeta).click(()=>{
        obtenerDescripcion(tarjeta.idPelicula);
    })
    let imagen = $("<img>");
    $(imagen).on("error",()=>{
        $(imagen).attr("src", "./images/noimage.png");
    });
    $(imagen).attr("class","card-img-top img-fluid rounded");
    $(imagen).attr("src",elemento.Poster);
    $(tarjeta).append(imagen);
    let divTexto = $('<div>');
    $(divTexto).attr("class","card-body");
    let texto = $('<p>');
    $(texto).attr("class","card-text");
    $(texto).html(elemento.Title);
    $(divTexto).append(texto);
    $(tarjeta).append($(divTexto));
    $("#tarjetas").append(tarjeta);
}

function errorImagen(imagen){
    imagen.onerror = "";
    imagen.src = "noimage.png";
    return true;
}

function mostrarDescripcion(datos){
    $("#imagenPelicula, #tituloPelicula, .list-group-item").empty();
    let imagen = $("<img>");
    $(imagen).on("error",()=>{
        $(imagen).attr("src", "./images/noimage.png");
    });
    $(imagen).attr("src",datos.Poster);
    $("#duracion").append("<b>Duración: </b>"+datos.Runtime);
    $("#genero").append("<b>Género: </b>"+datos.Genre);
    $("#estreno").append("<b>Fecha de estreno: </b>"+datos.Released);
    $("#pais").append("<b>País: </b>"+datos.Country);
    $("#puntuacion").append("<b>Puntuación IMDB: </b>"+datos.imdbRating);
    $("#imagenPelicula").append(imagen);
    $("#tituloPelicula").append(datos.Title);
    $("#descripcionPelicula").append("<b>Descripcion: </b>"+datos.Plot);
    $("#year").append("<b>Año: </b>"+datos.Year);
    $("#actores").append("<b>Actores: </b>"+datos.Actors);
    $("#divDescripcion").fadeIn();
}

function obtenerDescripcion(idPelicula){
    $.getJSON("https://www.omdbapi.com/?i="+idPelicula+"&apikey=6f3b0414",(respuesta)=>{
        mostrarDescripcion(respuesta);
    });
}