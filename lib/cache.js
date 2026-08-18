// Centralized in-memory cache manager for database queries (TTL = 5 minutes)
// Helps to avoid expensive Atlas connections and speeds up page loads to milliseconds

// Use global binding to ensure persistence across Hot Module Reloads during development
if (!global._appCache) {
  global._appCache = {
    products: null,
    productsWithGallery: null,
    productsLastFetch: 0,
    
    categories: null,
    categoriesLastFetch: 0,
    
    coupons: null,
    couponsLastFetch: 0,
    
    hero: null,
    heroLastFetch: 0,

    orders: null,
    ordersLastFetch: 0,

    users: null,
    usersLastFetch: 0,
  };
}

const cache = global._appCache;
const TTL = 300000; // 5 minutes

export function getCachedCoupons() {
  const now = Date.now();
  if (now - cache.couponsLastFetch > TTL) return null;
  return cache.coupons;
}

export function setCachedCoupons(coupons) {
  cache.coupons = coupons;
  cache.couponsLastFetch = Date.now();
}

export function clearCouponsCache() {
  cache.coupons = null;
  cache.couponsLastFetch = 0;
}

export function getCachedProducts(excludeGallery) {
  const now = Date.now();
  if (now - cache.productsLastFetch > TTL) return null;
  return excludeGallery ? cache.products : cache.productsWithGallery;
}

export function setCachedProducts(products, excludeGallery) {
  if (excludeGallery) {
    cache.products = products;
  } else {
    cache.productsWithGallery = products;
  }
  cache.productsLastFetch = Date.now();
}

export function clearProductsCache() {
  cache.products = null;
  cache.productsWithGallery = null;
  cache.productsLastFetch = 0;
}

export function getCachedCategories() {
  const now = Date.now();
  if (now - cache.categoriesLastFetch > TTL) return null;
  return cache.categories;
}

export function setCachedCategories(categories) {
  cache.categories = categories;
  cache.categoriesLastFetch = Date.now();
}

export function clearCategoriesCache() {
  cache.categories = null;
  cache.categoriesLastFetch = 0;
}

export function getCachedHero() {
  const now = Date.now();
  if (now - cache.heroLastFetch > TTL) return null;
  return cache.hero;
}

export function setCachedHero(hero) {
  cache.hero = hero;
  cache.heroLastFetch = Date.now();
}

export function clearHeroCache() {
  cache.hero = null;
  cache.heroLastFetch = 0;
}

export function getCachedOrders() {
  const now = Date.now();
  if (now - cache.ordersLastFetch > TTL) return null;
  return cache.orders;
}

export function setCachedOrders(orders) {
  cache.orders = orders;
  cache.ordersLastFetch = Date.now();
}

export function clearOrdersCache() {
  cache.orders = null;
  cache.ordersLastFetch = 0;
}

export function getCachedUsers() {
  const now = Date.now();
  if (now - cache.usersLastFetch > TTL) return null;
  return cache.users;
}

export function setCachedUsers(users) {
  cache.users = users;
  cache.usersLastFetch = Date.now();
}

export function clearUsersCache() {
  cache.users = null;
  cache.usersLastFetch = 0;
}
