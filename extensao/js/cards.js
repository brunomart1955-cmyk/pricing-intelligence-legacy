import { formatCurrency } from './utils.js';
import { calculateDifference, buildCompetitivenessLabel } from './filters.js';
import { calculateMarketAverage } from './shopping.js';

function createBadge(competitiveness) {
  const badge = document.createElement('span');
  badge.className = `price-tag price-tag--${competitiveness.style}`;
  badge.textContent = competitiveness.label;
  return badge;
}

export function renderCards(results, userPrice) {
  const productCards = document.getElementById('productCards');
  productCards.innerHTML = '';

  const marketAverage = calculateMarketAverage(results);
  const summary = document.createElement('div');
  summary.className = 'cards-summary';
  summary.innerHTML = `
    <div class="cards-summary__main">
      <span class="cards-summary__eyebrow">Pesquisa Google Shopping</span>
      <strong>${results.length} itens retornados</strong>
    </div>
    <div class="cards-summary__stats">
      <div class="cards-summary__stat">
        <span>Média do mercado</span>
        <strong>${formatCurrency(marketAverage)}</strong>
      </div>
      <div class="cards-summary__stat">
        <span>Seu preço</span>
        <strong>${formatCurrency(userPrice || 0)}</strong>
      </div>
      <div class="cards-summary__stat">
        <span>Comparação</span>
        <strong>${userPrice ? (userPrice < marketAverage ? 'Você está abaixo da média' : 'Você está acima da média') : 'Informe seu preço'}</strong>
      </div>
    </div>
  `;
  productCards.appendChild(summary);

  const topProducts = results.slice(0, 20);
  topProducts.forEach((product) => {
    const card = document.getElementById('cardTemplate').content.cloneNode(true);
    const image = card.querySelector('img');
    const badgeLabel = card.querySelector('.badge');
    const marketplace = card.querySelector('.product-card__marketplace');
    const title = card.querySelector('.product-card__title');
    const store = card.querySelector('.store-name');
    const currentPrice = card.querySelector('.current-price');
    const oldPrice = card.querySelector('.old-price');
    const tags = card.querySelector('.price-tags');
    const rating = card.querySelector('.rating');
    const reviewsCount = card.querySelector('.reviews-count');
    const shipping = card.querySelector('.shipping');
    const comparisonInfo = card.querySelector('.comparison-info');
    const marketAverageLine = card.querySelector('.market-average');
    const actionLink = card.querySelector('a');

    image.src = product.image;
    image.alt = product.name;
    badgeLabel.textContent = product.marketplace;
    marketplace.textContent = product.marketplace;
    title.textContent = product.name;
    store.textContent = product.store;
    currentPrice.textContent = formatCurrency(product.price);
    oldPrice.textContent = product.oldPrice ? formatCurrency(product.oldPrice) : '';

    const finance = calculateDifference(userPrice, product.price);
    const competitiveness = buildCompetitivenessLabel(finance.diffPercent);
    tags.appendChild(createBadge(competitiveness));

    const promoTag = document.createElement('span');
    promoTag.className = 'price-tag price-tag--promo';
    promoTag.textContent = product.promo;
    tags.appendChild(promoTag);

    if (product.shipping.toLowerCase().includes('grátis')) {
      const shippingTag = document.createElement('span');
      shippingTag.className = 'price-tag price-tag--free';
      shippingTag.textContent = 'Frete Grátis';
      tags.appendChild(shippingTag);
    }

    rating.textContent = `⭐ ${product.rating.toFixed(1)}`;
    reviewsCount.textContent = `${product.reviews.toLocaleString('pt-BR')} avaliações`;
    shipping.textContent = `${product.delivery} • ${product.shipping}`;
    comparisonInfo.textContent = userPrice
      ? product.price < userPrice
        ? `Você ganha ${formatCurrency(userPrice - product.price)} neste item`
        : `Você perde ${formatCurrency(product.price - userPrice)} neste item`
      : 'Informe seu preço para comparar';
    marketAverageLine.textContent = `Média do mercado: ${formatCurrency(marketAverage)}`;
    actionLink.href = product.url;
    actionLink.textContent = 'Abrir no Shopping';

    productCards.appendChild(card);
  });
}
