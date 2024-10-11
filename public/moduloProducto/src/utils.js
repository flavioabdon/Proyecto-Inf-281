

//const allProductsUrl = 'https://www.course-api.com/javascript-store-products';


const allProductsUrl = './src/json/productos.json';

const singleProductUrl = './src/json/producto.json';

const getElement = (selection) => {
  const element = document.querySelector(selection);
  if (element) return element;
  throw new Error(
    `Please check "${selection}" selector, no existe tal elemento`
  );
};

const formatPrice = (price) => {
  let formattedPrice = new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
  }).format((price).toFixed(2));
  return formattedPrice;
};


const getStorageItem = (item) => {
  let storageItem = localStorage.getItem(item);
  if (storageItem) {
    storageItem = JSON.parse(localStorage.getItem(item));
  } else {
    storageItem = [];
  }
  return storageItem;
};

const setStorageItem = (name, item) => {
  localStorage.setItem(name, JSON.stringify(item));
};

export {
  allProductsUrl,
  singleProductUrl,
  getElement,
  formatPrice,
  getStorageItem,
  setStorageItem,
};
