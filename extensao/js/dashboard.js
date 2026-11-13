import { formatCurrency } from './utils.js';
import { calculateStats, buildCompetitivenessLabel, getPositionLabel } from './filters.js';

const statMinPrice = document.getElementById('statMinPrice');
const statMaxPrice = document.getElementById('statMaxPrice');
const statAvgPrice = document.getElementById('statAvgPrice');
const statMedianPrice = document.getElementById('statMedianPrice');
const statCount = document.getElementById('statCount');
const statPosition = document.getElementById('statPosition');
const statCompetitiveness = document.getElementById('statCompetitiveness');
const statDiffAvg = document.getElementById('statDiffAvg');
const tableContainer = document.getElementById('tableContainer');
const toastContainer = document.getElementById('toastContainer');

export function renderStats(results, userPrice) {
  const stats = calculateStats(results, userPrice);
  statMinPrice.textContent = formatCurrency(stats.min);
  statMaxPrice.textContent = formatCurrency(stats.max);
  statAvgPrice.textContent = formatCurrency(stats.avg);
  statMedianPrice.textContent = formatCurrency(stats.median);
  statCount.textContent = stats.count;
  statPosition.textContent = getPositionLabel(userPrice, results);
  statCompetitiveness.textContent = userPrice
    ? buildCompetitivenessLabel(((stats.avg - userPrice) / userPrice) * 100).label
    : '—';
  statDiffAvg.textContent = formatCurrency(Math.abs(stats.diffAvg));
}

export function setLoading(active) {
  if (active) {
    tableContainer.classList.add('skeleton-loading');
  } else {
    tableContainer.classList.remove('skeleton-loading');
  }
}

export function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<strong>${message}</strong>`;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}
