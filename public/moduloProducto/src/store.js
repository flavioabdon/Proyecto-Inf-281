import { getStorageItem, setStorageItem } from './utils.js';
let store = getStorageItem('store');
const setupStore = (products) => {
  store = products.map((product) => {
    const {
      id,
      caracteristicas: { nombre, descripcion, categoria, colores, precio, imagen: img },
    } = product;
    const imagen = img[0].formato.grande.url;
    return { id, nombre, descripcion, categoria, colores, precio, imagen };
  }); 
  setStorageItem('store', store);
};

const findProduct = (id) => {
  let product = store.find((product) => product.id === id);
  return product;
};

export { store, setupStore, findProduct };
