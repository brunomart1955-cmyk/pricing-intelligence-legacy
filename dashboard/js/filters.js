export function formatPriceInput(value) {
  return parseFloat(value.replace(',', '.')) || 0;
}

export function applyFilters(products, { marketplace, query }) {
  return products.filter((product) => {
    const matchMarketplace = marketplace === 'all' || product.marketplace === marketplace;
    const matchQuery = !query || product.name.toLowerCase().includes(query.toLowerCase());
    return matchMarketplace && matchQuery;
  });
}

export function calculateDifference(userPrice, competitorPrice) {
  const diff = competitorPrice - userPrice;
  const diffPercent = userPrice ? (diff / userPrice) * 100 : 0;
  return { diff, diffPercent };
}

export function buildCompetitivenessLabel(diffPercent) {
  if (diffPercent <= -12) return { label: 'Muito Competitivo', style: 'very-good' };
  if (diffPercent <= -5) return { label: 'Competitivo', style: 'good' };
  if (Math.abs(diffPercent) < 5) return { label: 'Preço Médio', style: 'info' };
  if (diffPercent <= 12) return { label: 'Acima do Mercado', style: 'medium' };
  return { label: 'Muito Caro', style: 'bad' };
}

export function calculateStats(results, userPrice) {
  const prices = results.map((item) => item.price).sort((a, b) => a - b);
  const count = prices.length;
  const min = count ? prices[0] : 0;
  const max = count ? prices[count - 1] : 0;
  const avg = count ? prices.reduce((sum, price) => sum + price, 0) / count : 0;
  const median = count
    ? count % 2 === 0
      ? (prices[count / 2 - 1] + prices[count / 2]) / 2
      : prices[Math.floor(count / 2)]
    : 0;
  const diffAvg = userPrice ? avg - userPrice : 0;
  return { min, max, avg, median, count, diffAvg };
}

export function getPositionLabel(userPrice, results) {
  if (!userPrice || !results.length) return '—';
  const sorted = [...results].sort((a, b) => a.price - b.price);
  const position = sorted.findIndex((item) => item.price >= userPrice) + 1;
  return position ? `${position}/${results.length}` : `${results.length}/${results.length}`;
}
