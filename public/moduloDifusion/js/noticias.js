// local reviews data
const reviews = [
  {
    id: 1,
    name: 'Susana Medina',
    job: 'Artesano',
    img: 'https://media.istockphoto.com/id/469250582/es/foto/retrato-de-mujer-feliz-en-islas-flotantes-de-uros-lago-tititcaca.jpg?s=612x612&w=0&k=20&c=ufcgKO1QnymqNtvbCgdQJ0giRChdMNsdAhkKG8VSzuE=',
    text: "¡Feria de Artesanías en la Comunidad de Mallasa!, Te invitamos a nuestra feria de artesanías este sábado, 14 de septiembre, de 10:00 a.m. a 4:00 p.m. en la Plaza Principal de Mallasa, ubicada en la Avenida Copacabana. Descubre una variedad de productos hechos a mano, desde hermosos tejidos hasta cerámicas únicas, elaborados por artesanos locales. Ven con tu familia y amigos para disfrutar de un día lleno de cultura, tradición y creatividad. ¡No te lo pierdas!",
  },
  {
    id: 2,
    name: 'Juana Padilla',
    job: 'Delivery',
    img: 'https://media.istockphoto.com/id/1323400501/es/foto/feliz-disparo-a-la-cabeza-de-una-joven-latina-con-fondo-de-expresi%C3%B3n-de-sonrisa-con-espacio-de.jpg?s=612x612&w=0&k=20&c=q9TJAWtBda17lPYhRv1XWlCnQThkbc7f73AZbgIcH4o=',
    text: '¡Gran Feria de Artesanías en la Comunidad de Achumani!, El domingo, 15 de septiembre, desde las 9:00 a.m. hasta las 5:00 p.m., acompáñanos en la Plaza de los Artesanos, ubicada en la Calle 21 de Achumani, para una jornada especial dedicada a las artesanías bolivianas. Habrá una exhibición de tejidos, joyería y tallados en madera. Disfruta de la música en vivo y la comida tradicional mientras apoyas a nuestros talentosos artesanos locales. ¡Te esperamos!',
  },
  {
    id: 3,
    name: 'Pedro Machaca',
    job: 'Comunario',
    img: 'https://sce.bo/wp-content/uploads/2018/08/Dise%C3%B1o-sin-t%C3%ADtulo-4.png',
    text: '¡Vive la Cultura en la Feria de Artesanías de Cota Cota!,Este viernes, 20 de septiembre, de 11:00 a.m. a 7:00 p.m., ven a la Plaza de Cota Cota, situada en la Avenida Ballivián, para disfrutar de nuestra feria de artesanías. Habrá una increíble variedad de productos artesanales, incluyendo textiles andinos y piezas de cerámica hechas a mano. Esta es una gran oportunidad para encontrar algo único y especial, mientras apoyas a los artesanos locales. ¡Ven y sé parte de esta celebración de la cultura boliviana!',
  },
  {
    id: 4,
    name: 'Juan Chavez',
    job: 'Comunario',
    img: 'https://media.istockphoto.com/id/1394671605/es/foto/retrato-de-hombre-boliviano-con-sombrero-mirando-hacia-otro-lado-en-la-monta%C3%B1a.jpg?s=2048x2048&w=is&k=20&c=UmuOruPu88Dsoic84VJyVBKTlEqYSDCWKOh9-O-LLPs=',
    text: '¡No te pierdas la Feria de Artesanías en la Comunidad de San Miguel!, Acompáñanos el sábado, 21 de septiembre, de 10:00 a.m. a 6:00 p.m., en la Plaza de San Miguel, ubicada en la Calle René Moreno, Zona Sur. Disfruta de una exhibición de artesanías, como joyería, textiles y tallados, todos hechos a mano por nuestros artesanos locales. Ven y apoya a las comunidades artesanales de La Paz, mientras te sumerges en la cultura y tradición de Bolivia. ¡Te esperamos con los brazos abiertos!',
  },
];

// select items
const img = document.getElementById('person-img');
const author = document.getElementById('author');
const job = document.getElementById('job');
const info = document.getElementById('info');

const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

// set starting item
let currentItem = 0;
let autoChangeInterval;

//load initial item
window.addEventListener("DOMContentLoaded", function () {
  showPerson(currentItem);
  startAutoChange();
});

//show person based on item index
function showPerson(person) {
  const item = reviews[person];
  img.src = item.img;
  author.textContent = item.name;
  job.textContent = item.job;
  info.textContent = item.text;
}

//btn next and prev
nextBtn.addEventListener("click", function () {
  currentItem++;
  if (currentItem > reviews.length - 1) {
    currentItem = 0;
  }
  showPerson(currentItem);
  stopAutoChange();
});

prevBtn.addEventListener("click", function () {
  currentItem--;
  if (currentItem < 0) {
    currentItem = reviews.length - 1;
  }
  showPerson(currentItem);
  stopAutoChange();
});

// Automatic change every 10 seconds
function startAutoChange() {
  autoChangeInterval = setInterval(function () {
    currentItem++;
    if (currentItem > reviews.length - 1) {
      currentItem = 0;
    }
    showPerson(currentItem);
  }, 4000); 
}

// Stop automatic change
function stopAutoChange() {
  clearInterval(autoChangeInterval); // Detiene el cambio automático
}