// js/main.js

// Estado global para controlar as estatísticas em tempo real
let stats = {
  prices: [],
  count: 0
};

document.addEventListener('DOMContentLoaded', () => {
  // Conecta os botões de pesquisa da sua interface
  const submitBtn = document.getElementById('submitBtn');
  const searchBtn = document.getElementById('searchBtn');
  const productSearch = document.getElementById('productSearch');
  
  const initiateSearch = () => {
    const query = productSearch.value.trim();
    
    if (!query) {
      alert("Por favor, digite um produto para pesquisar.");
      return;
    }

    resetDashboard();
    console.log(`Solicitando busca por: ${query}`);

    // Envia o comando para o Background Script da extensão
    chrome.runtime.sendMessage({ action: "search", query: query }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Erro ao comunicar com a extensão:", chrome.runtime.lastError);
        return;
      }
      console.log("Extensão iniciou o processamento:", response);
    });
  };

  submitBtn.addEventListener('click', initiateSearch);
  searchBtn.addEventListener('click', initiateSearch);

  // Escuta os produtos chegando em tempo real (Stream)
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "render_product") {
      const produto = message.product;
      
      renderProductCard(produto);
      renderTableRow(produto);
      updateStats(produto);
    }
  });
});

// Limpa a tela para uma nova busca
function resetDashboard() {
  document.getElementById('productCards').innerHTML = '';
  document.getElementById('resultTableBody').innerHTML = '';
  stats = { prices: [], count: 0 };
  updateStatsDisplay();
}

// Renderiza o Card baseado no <template> do seu HTML
function renderProductCard(product) {
  const template = document.getElementById('cardTemplate');
  const clone = template.content.cloneNode(true);
  const card = clone.querySelector('.product-card');

  // Preenche os dados
  clone.querySelector('img').src = product.image || 'https://via.placeholder.com/150';
  clone.querySelector('.product-card__marketplace').textContent = product.marketplace;
  clone.querySelector('.product-card__title').textContent = product.title;
  clone.querySelector('.store-name').textContent = product.store;
  
  // Preços
  clone.querySelector('.current-price').textContent = product.price ? `R$ ${product.price}` : 'Sob consulta';
  if (product.oldPrice) {
    clone.querySelector('.old-price').textContent = `R$ ${product.oldPrice}`;
  }

  // Metadados (Avaliações e Frete)
  if (product.rating) {
    clone.querySelector('.rating').textContent = `⭐ ${product.rating}`;
  }
  if (product.reviews) {
    clone.querySelector('.reviews-count').textContent = `(${product.reviews})`;
  }
  clone.querySelector('.shipping').textContent = `🚚 ${product.delivery || 'Padrão'}`;

  // Botão de link
  const linkBtn = clone.querySelector('a.button');
  linkBtn.href = product.url;

  // Injeta na grade
  document.getElementById('productCards').appendChild(card);
}

// Renderiza a linha na Tabela
function renderTableRow(product) {
  const tbody = document.getElementById('resultTableBody');
  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td><img src="${product.image}" width="40" height="40" style="border-radius:4px; object-fit:cover;" /></td>
    <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${product.title}">${product.title}</td>
    <td>${product.marketplace}</td>
    <td>${product.store}</td>
    <td><strong>R$ ${product.price || '0,00'}</strong></td>
    <td>${product.oldPrice ? `R$ ${product.oldPrice}` : '-'}</td>
    <td>-</td>
    <td>${product.shipping}</td>
    <td>${product.delivery}</td>
    <td>-</td>
    <td>-</td>
    <td>-</td>
    <td><a href="${product.url}" target="_blank" class="button button--ghost button--small">Ver</a></td>
  `;

  tbody.appendChild(tr);
}

// Atualiza os indicadores do topo dinamicamente
function updateStats(product) {
  if (!product.price) return;
  
  // Converte string "1.299,90" para float 1299.90
  const priceValue = parseFloat(product.price.replace(/\./g, '').replace(',', '.'));
  
  if (!isNaN(priceValue)) {
    stats.prices.push(priceValue);
    stats.count++;
    updateStatsDisplay();
  }
}

// Calcula e desenha as estatísticas
function updateStatsDisplay() {
  if (stats.count === 0) return;

  const min = Math.min(...stats.prices);
  const max = Math.max(...stats.prices);
  const avg = stats.prices.reduce((a, b) => a + b, 0) / stats.count;

  const formatCurrency = (val) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  document.getElementById('statMinPrice').textContent = formatCurrency(min);
  document.getElementById('statMaxPrice').textContent = formatCurrency(max);
  document.getElementById('statAvgPrice').textContent = formatCurrency(avg);
  document.getElementById('statCount').textContent = stats.count;
}