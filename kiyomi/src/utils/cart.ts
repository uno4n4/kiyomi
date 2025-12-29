// src/utils/cart.ts

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const CART_KEY = "kiyomi_cart";

// Récupérer le panier depuis le localStorage
export function getCart(): CartItem[] {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

// Sauvegarder le panier
function saveCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Ajouter un produit au panier
export function addToCart(product: CartItem) {
  const cart = getCart();
  const existingProduct = cart.find(item => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  saveCart(cart);
}

// Mettre à jour la quantité d’un produit
export function updateQuantity(productId: number, quantity: number) {
  const cart = getCart();
  const product = cart.find(item => item.id === productId);

  if (!product) return;

  if (quantity <= 0) {
    removeFromCart(productId);
  } else {
    product.quantity = quantity;
    saveCart(cart);
  }
}

// Supprimer un produit du panier
export function removeFromCart(productId: number) {
  const cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
}

// Calculer le total du panier
export function getTotal(): number {
  return getCart().reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
}
