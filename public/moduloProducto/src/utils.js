

//const allProductsUrl = 'https://www.course-api.com/javascript-store-products';


const allProductsUrl = '/mostrarProductosCliente';

//const singleProductUrl = './src/json/producto.json';

const singleProductUrl = '/mostrarPorIdProductoCliente/';


const getElement = (selection) => {
  const element = document.querySelector(selection);
  if (element) return element;
  throw new Error(
    `Please check "${selection}" selector, no existe tal elemento`
  );
};

const formatPrice = (price) => {
  let formattedPrice = new Intl.NumberFormat('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: false // Desactiva el separador de miles
  }).format(price).replace(/,/g, '.'); // Reemplaza la coma decimal por punto
  return `Bs ${formattedPrice}`;
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
