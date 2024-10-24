import { formatPrice, getElement } from '../utils.js';
const cartItemsDOM = getElement('.cart-items');
const addToCartDOM = ({ id, nombre, precio, imagen, amount }) => {
  const article = document.createElement('article');
  article.classList.add('cart-item');
  article.setAttribute('data-id', id);
  article.innerHTML = `
    <img src="${imagen}"
              class="cart-item-img"
              alt="${nombre}"
            />  
            <div>
              <h4 class="cart-item-name">${nombre}</h4>
              <p class="cart-item-price">${formatPrice(precio)}</p>
              <button class="cart-item-remove-btn" data-id="${id}">remover</button>
            </div>
          
            <div>
              <button class="cart-item-increase-btn" data-id="${id}">
                <i class="fas fa-chevron-up"></i>
              </button>
              <p class="cart-item-amount" data-id="${id}">${amount}</p>
              <button class="cart-item-decrease-btn" data-id="${id}">
                <i class="fas fa-chevron-down"></i>
              </button>
            </div>
  `;
  cartItemsDOM.appendChild(article);
};

export default addToCartDOM;
