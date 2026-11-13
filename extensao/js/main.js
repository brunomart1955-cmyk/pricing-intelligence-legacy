/**
 * Main Application File
 * Redireciona para Google Shopping com termo de pesquisa
 */

import { formatPriceInput } from './filters.js';
import { showToast } from './dashboard.js';

// === DOM Elements ===
const marketplaceSelect = document.getElementById('marketplaceSelect');
const productSearch = document.getElementById('productSearch');
const myPriceInput = document.getElementById('myPriceInput');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const searchBtn = document.getElementById('searchBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const tableSearch = document.getElementById('tableSearch');

// === State ===
let currentResults = {
  cardsProducts: [],
  tableProducts: [],
  allProducts: [],
  stats: null
};

/**
 * Executar pesquisa - Redireciona para Google Shopping
 */
function performSearch() {
  const product = productSearch.value.trim();

  // Validar entrada
  if (!product) {
    showToast('Por favor, informe um produto para pesquisar');
    return;
  }

  // Construir URL do Google Shopping
  const searchUrl = `https://shopping.google.com/search?q=${encodeURIComponent(product)}`;

  // Redirecionar para Google Shopping
  window.location.href = searchUrl;
}

/**
 * Resetar filtros
 */
function resetFilters() {
  marketplaceSelect.value = 'all';
  productSearch.value = '';
  myPriceInput.value = '';
  tableSearch.value = '';

  currentResults = {
    cardsProducts: [],
    tableProducts: [],
    allProducts: [],
    stats: null
  };

  showToast('Campos limpos');
}

/**
 * Inicializar aplicação
 */
function initialize() {
  // Listeners de evento
  searchBtn.addEventListener('click', performSearch);
  submitBtn.addEventListener('click', performSearch);
  resetBtn.addEventListener('click', resetFilters);
  clearAllBtn.addEventListener('click', resetFilters);

  // Mensagem inicial
  showToast('Pronto! Digite um produto e clique em pesquisar para ir ao Google Shopping');
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
