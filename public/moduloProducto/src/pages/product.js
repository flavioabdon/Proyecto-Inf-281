// global imports
import '../toggleSidebar.js';
import '../cart/toggleCart.js';
import '../cart/setupCart.js';
// specific
import { addToCart } from '../cart/setupCart.js';
import { singleProductUrl, getElement, formatPrice } from '../utils.js';

// selections
const loading = getElement('.page-loading');
const centerDOM = getElement('.single-product-center');
const pageTitleDOM = getElement('.page-hero-title');
const imgDOM = getElement('.single-product-img');
const titleDOM = getElement('.single-product-title');
const companyDOM = getElement('.single-product-company');
const priceDOM = getElement('.single-product-price');
const colorsDOM = getElement('.single-product-colors');
const descDOM = getElement('.single-product-desc');
const cartBtn = getElement('.addToCartBtn');

// cart product
let productID;

// show product when page loads
window.addEventListener('DOMContentLoaded', async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const urlID = urlParams.get('id');

  try {
    const response = await fetch(`${singleProductUrl}${urlID}`);
    if (response.status >= 200 && response.status <= 299) {
      const product = await response.json();
      //alert(JSON.stringify(product, null, 2));


      // grab data
      const { id, caracteristicas } = product;
      productID = id;

      const { nombre, descripcion, categoria, precio, colores } = caracteristicas;
      const image = caracteristicas.imagen[0].formato.grande.url;
      // set values

      document.title = `${nombre.toUpperCase()} | PA`;
      pageTitleDOM.textContent = `Producto / ${nombre}`;
      imgDOM.src = image;
      titleDOM.textContent = nombre;
      companyDOM.textContent = `Categoria ${categoria}`;
      priceDOM.textContent = formatPrice(precio);
      descDOM.textContent = descripcion;
      colores.forEach((color) => {
        const span = document.createElement('span');
        span.classList.add('product-color');
        span.style.backgroundColor = `${color}`;
        colorsDOM.appendChild(span);
      });
    } else {
      console.log(response.status, response.statusText);
      centerDOM.innerHTML = `
    <div>
    <h3 class="error">Lo siento, algo salió mal.</h3>
    <a href="index.html" class="btn">Volver a inicio</a>
    </div> 
     `;
    }
  } catch (error) {
    console.log(error);
  }

  loading.style.display = 'none';
});

cartBtn.addEventListener('click', function () {
  addToCart(productID);
});
