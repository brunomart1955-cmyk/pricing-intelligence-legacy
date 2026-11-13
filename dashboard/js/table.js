import { formatCurrency } from './utils.js';
import { calculateDifference, buildCompetitivenessLabel } from './filters.js';

export function renderTable(results, userPrice) {
  const resultTableBody = document.getElementById('resultTableBody');
  resultTableBody.innerHTML = '';

  results.forEach((product) => {
    const row = document.createElement('tr');
    const diff = calculateDifference(userPrice, product.price);
    const competitiveness = buildCompetitivenessLabel(diff.diffPercent);

    row.innerHTML = `
      <td><img src="${product.image}" alt="${product.name}" /></td>
      <td>${product.name}</td>
      <td>${product.marketplace}</td>
      <td>${product.store}</td>
      <td>${formatCurrency(product.price)}</td>
      <td>${product.oldPrice ? formatCurrency(product.oldPrice) : '-'}</td>
      <td>${product.promo}</td>
      <td>${product.shipping}</td>
      <td>${product.delivery}</td>
      <td><span class="status-badge status-badge--${competitiveness.style}">${competitiveness.label}</span></td>
      <td>${formatCurrency(Math.abs(diff.diff))}</td>
      <td>${Math.abs(diff.diffPercent).toFixed(2)}%</td>
      <td><a href="${product.url}" target="_blank" rel="noreferrer" class="button button--ghost button--small">Abrir</a></td>
    `;

    resultTableBody.appendChild(row);
  });
}
