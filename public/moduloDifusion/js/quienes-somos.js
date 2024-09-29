const about = document.querySelector(".about");
const btns = document.querySelectorAll(".tab-btn");
const articles = document.querySelectorAll(".content");


about.addEventListener("click", function (e) {
    const id = e.target.dataset.id; /*devuelve el data-id al apretar un btn*/
    if (id) { //id == true (existe el id)
        // remove selected from other buttons
        btns.forEach(function (btn) {
            btn.classList.remove("active");
        });
        // adiciona la clase active al btn presionado
        e.target.classList.add("active");

        //elimina el contenido de el btn presionado
        articles.forEach(function (article) {
            article.classList.remove("active");
        });
        //obtiene el id del btn presionado adicionando la clase active (mostrando el contenido del btn presionado)
        const element = document.getElementById(id);
        element.classList.add("active");
    }
});


// e.target : se presiona el btn por ejm tiene un data-id = history , este se referencia al contenido del article que tiene el id = hystory