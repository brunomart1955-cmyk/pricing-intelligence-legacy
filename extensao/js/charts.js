import { formatCurrency } from './utils.js';

let chartInstances = [];

function clearCharts() {
  chartInstances.forEach((chart) => chart.destroy());
  chartInstances = [];
}

function buildCategoryData(results) {
  const categories = {};
  results.forEach((item) => {
    if (!categories[item.marketplace]) {
      categories[item.marketplace] = [];
    }
    categories[item.marketplace].push(item.price);
  });
  return categories;
}

export function initializeCharts(products) {
  clearCharts();

  const categoryData = buildCategoryData(products);
  const marketplaceNames = Object.keys(categoryData);
  const marketplaceAvgPrices = marketplaceNames.map((marketplace) => {
    const prices = categoryData[marketplace];
    return prices.reduce((sum, value) => sum + value, 0) / prices.length;
  });

  const barCtx = document.getElementById('barChart');
  const barChart = new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: marketplaceNames,
      datasets: [
        {
          label: 'Preço médio',
          data: marketplaceAvgPrices,
          backgroundColor: ['#49B7FF', '#7C92FF', '#F4C150', '#FF9E5B'],
          borderRadius: 14,
          borderSkipped: false,
        }
      ]
    },
    options: {
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ({ formattedValue }) => `Preço médio: ${formatCurrency(Number(formattedValue))}`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: (value) => formatCurrency(value) }
        }
      }
    }
  });
  chartInstances.push(barChart);

  const pieCtx = document.getElementById('pieChart');
  const pieChart = new Chart(pieCtx, {
    type: 'pie',
    data: {
      labels: marketplaceNames,
      datasets: [
        {
          data: marketplaceNames.map((marketplace) => categoryData[marketplace].length),
          backgroundColor: ['#49B7FF', '#7C92FF', '#F4C150', '#FF9E5B']
        }
      ]
    },
    options: {
      plugins: {
        legend: { position: 'bottom', labels: { color: '#c1cfdc' } },
      }
    }
  });
  chartInstances.push(pieChart);

  const lineCtx = document.getElementById('lineChart');
  const sortedProducts = [...products].sort((a, b) => a.price - b.price).slice(0, 10);
  const lineChart = new Chart(lineCtx, {
    type: 'line',
    data: {
      labels: sortedProducts.map((item) => item.name),
      datasets: [
        {
          label: 'Distribuição de preços',
          data: sortedProducts.map((item) => item.price),
          borderColor: '#49B7FF',
          backgroundColor: 'rgba(73, 183, 255, 0.18)',
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointBackgroundColor: '#49B7FF'
        }
      ]
    },
    options: {
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          ticks: { display: false }
        },
        y: {
          beginAtZero: true,
          ticks: { callback: (value) => formatCurrency(value) }
        }
      }
    }
  });
  chartInstances.push(lineChart);

  const radarCtx = document.getElementById('radarChart');
  const competitivenessScores = products.map((product) => {
    const diffPercent = ((product.price - product.price) / product.price) * 100;
    return Math.max(1, Math.min(5, 5 - diffPercent / 10));
  }).slice(0, 6);
  const radarLabels = products.slice(0, 6).map((item) => item.marketplace);
  const radarChart = new Chart(radarCtx, {
    type: 'radar',
    data: {
      labels: radarLabels,
      datasets: [
        {
          label: 'Competitividade',
          data: competitivenessScores,
          borderColor: '#7C92FF',
          backgroundColor: 'rgba(124, 146, 255, 0.16)',
          pointBackgroundColor: '#7C92FF'
        }
      ]
    },
    options: {
      scales: {
        r: {
          min: 0,
          max: 5,
          ticks: { stepSize: 1 }
        }
      }
    }
  });
  chartInstances.push(radarChart);
}
