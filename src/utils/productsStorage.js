import { TOP_PRODUCTS } from '../data/coursesData';

const PRODUCTS_STORAGE_KEY = 'faberlic_products_v1';

export function getStoredProducts() {
  try {
    const data = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading stored products:', e);
  }
  return TOP_PRODUCTS;
}

export function saveStoredProducts(products) {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new Event('products_updated'));
    return true;
  } catch (e) {
    console.error('Error saving stored products:', e);
    return false;
  }
}

export function resetStoredProducts() {
  try {
    localStorage.removeItem(PRODUCTS_STORAGE_KEY);
    window.dispatchEvent(new Event('products_updated'));
    return TOP_PRODUCTS;
  } catch (e) {
    console.error('Error resetting stored products:', e);
    return TOP_PRODUCTS;
  }
}
