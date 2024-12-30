window.onload = ocultarDiv();

function ocultarDiv() {
    setTimeout(function() {
      const div = document.getElementById('load-content');
      div.style.transition = 'opacity 1s';  // Añadimos una transición para que se desvanezca suavemente
      div.style.opacity = '0';  // Cambiamos la opacidad a 0 (invisible)
      setTimeout(function (){
        div.style.display = "none";
      },700);
    }, 1000);  // Espera 1 segundos
  }