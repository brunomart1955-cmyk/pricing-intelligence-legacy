/**
 * Search Engine Module
 * =====================
 * Responsável por toda a lógica de busca, filtro e renderização de produtos.
 * Preparado para futura integração com APIs reais (Playwright, Puppeteer, Google Shopping API).
 * 
 * ES6 Modules - Separação de responsabilidades
 */

import { formatCurrency } from './utils.js';
import { showToast, setLoading } from './dashboard.js';

/**
 * Cache para armazenar produtos e evitar requisições desnecessárias
 */
const searchEngineCache = {
  products: null,
  lastSearch: null
};

/**
 * Carregar produtos do JSON mock
 * Futuramente, esta função será substituída por uma chamada à API real
 * 
 * @returns {Promise<Array>} Lista de produtos
 */
async function loadProducts() {
  try {
    // Se já temos os produtos em cache, retornar do cache
    if (searchEngineCache.products) {
      return searchEngineCache.products;
    }

    // Tentar diferentes caminhos
    const possiblePaths = [
      './data/products.json',
      '../data/products.json',
      '/data/products.json'
    ];

    let products = null;

    for (const path of possiblePaths) {
      try {
        const response = await fetch(path);
        if (response.ok) {
          products = await response.json();
          break;
        }
      } catch (err) {
        // Continuar para o próximo caminho
      }
    }

    // Se nenhum arquivo foi encontrado, usar dados mock inline
    if (!products || products.length === 0) {
      console.warn('Arquivo products.json não encontrado, usando dados mock inline');
      products = getMockProducts();
    }

    searchEngineCache.products = products;
    return products;
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    showToast('Usando dados de demonstração...');
    return getMockProducts();
  }
}

/**
 * Dados mock inline como fallback
 * @returns {Array} Lista de produtos mock
 */
function getMockProducts() {
  return [
    {
      id: 1,
      titulo: 'Martelete Makita HR2670 800W Profissional',
      imagem: 'https://images.unsplash.com/photo-1555617117-08c6e24d9740?auto=format&fit=crop&w=600&q=80',
      preco: 849.90,
      precoAntigo: 999.90,
      promocao: '15% OFF',
      marketplace: 'Mercado Livre',
      loja: 'Ferramentas Já',
      frete: 'Grátis',
      freteGratis: true,
      parcelamento: '12x sem juros',
      avaliacao: 4.8,
      quantidadeAvaliacoes: 152,
      link: 'https://www.mercadolivre.com.br/martelete-makita'
    },
    {
      id: 2,
      titulo: 'Martelete Makita HR2670 800W',
      imagem: 'https://images.unsplash.com/photo-1555617117-08c6e24d9740?auto=format&fit=crop&w=600&q=80',
      preco: 879.50,
      precoAntigo: 999.90,
      promocao: '12% OFF',
      marketplace: 'Amazon',
      loja: 'Amazon Brasil',
      frete: 'R$ 0,00',
      freteGratis: true,
      parcelamento: '10x sem juros',
      avaliacao: 4.7,
      quantidadeAvaliacoes: 284,
      link: 'https://www.amazon.com.br/martelete-makita'
    },
    {
      id: 3,
      titulo: 'Martelete Makita HR2670 com Acessórios',
      imagem: 'https://images.unsplash.com/photo-1555617117-08c6e24d9740?auto=format&fit=crop&w=600&q=80',
      preco: 899.99,
      precoAntigo: 1099.99,
      promocao: '18% OFF',
      marketplace: 'Shopee',
      loja: 'Shopee Top',
      frete: 'Grátis',
      freteGratis: true,
      parcelamento: '12x sem juros',
      avaliacao: 4.5,
      quantidadeAvaliacoes: 198,
      link: 'https://shopee.com.br/martelete-makita'
    },
    {
      id: 4,
      titulo: 'Martelete Makita HR2670 800W Promocional',
      imagem: 'https://images.unsplash.com/photo-1555617117-08c6e24d9740?auto=format&fit=crop&w=600&q=80',
      preco: 825.00,
      precoAntigo: 999.90,
      promocao: '17% OFF',
      marketplace: 'Magazine Luiza',
      loja: 'Magalu Oficial',
      frete: 'Grátis',
      freteGratis: true,
      parcelamento: '12x sem juros',
      avaliacao: 4.6,
      quantidadeAvaliacoes: 267,
      link: 'https://www.magazineluiza.com.br/martelete-makita'
    },
    {
      id: 5,
      titulo: 'Martelete Makita HR2670 Melhorado',
      imagem: 'https://images.unsplash.com/photo-1555617117-08c6e24d9740?auto=format&fit=crop&w=600&q=80',
      preco: 910.00,
      precoAntigo: 1099.99,
      promocao: '17% OFF',
      marketplace: 'Mercado Livre',
      loja: 'Eletro Forte',
      frete: 'R$ 15,90',
      freteGratis: false,
      parcelamento: '10x sem juros',
      avaliacao: 4.4,
      quantidadeAvaliacoes: 143,
      link: 'https://www.mercadolivre.com.br/martelete-makita-2'
    },
    {
      id: 6,
      titulo: 'Martelete Makita HR2670 Premium',
      imagem: 'https://images.unsplash.com/photo-1555617117-08c6e24d9740?auto=format&fit=crop&w=600&q=80',
      preco: 945.00,
      precoAntigo: 1199.90,
      promocao: '21% OFF',
      marketplace: 'Amazon',
      loja: 'Ferramentas Online',
      frete: 'R$ 0,00',
      freteGratis: true,
      parcelamento: '12x sem juros',
      avaliacao: 4.9,
      quantidadeAvaliacoes: 421,
      link: 'https://www.amazon.com.br/martelete-premium'
    },
    {
      id: 7,
      titulo: 'Martelete Makita HR2670 Econômico',
      imagem: 'https://images.unsplash.com/photo-1555617117-08c6e24d9740?auto=format&fit=crop&w=600&q=80',
      preco: 799.90,
      precoAntigo: 999.90,
      promocao: '20% OFF',
      marketplace: 'Shopee',
      loja: 'Shopee Mall',
      frete: 'Grátis',
      freteGratis: true,
      parcelamento: '12x sem juros',
      avaliacao: 4.3,
      quantidadeAvaliacoes: 176,
      link: 'https://shopee.com.br/martelete-economico'
    },
    {
      id: 8,
      titulo: 'Martelete Makita HR2670 com Maleta',
      imagem: 'https://images.unsplash.com/photo-1555617117-08c6e24d9740?auto=format&fit=crop&w=600&q=80',
      preco: 920.00,
      precoAntigo: 1099.99,
      promocao: '16% OFF',
      marketplace: 'Magazine Luiza',
      loja: 'Magalu',
      frete: 'R$ 19,90',
      freteGratis: false,
      parcelamento: '10x sem juros',
      avaliacao: 4.7,
      quantidadeAvaliacoes: 234,
      link: 'https://www.magazineluiza.com.br/martelete-maleta'
    },
    {
      id: 9,
      titulo: 'Martelete Makita HR2670 Plus',
      imagem: 'https://images.unsplash.com/photo-1555617117-08c6e24d9740?auto=format&fit=crop&w=600&q=80',
      preco: 889.50,
      precoAntigo: 999.90,
      promocao: '11% OFF',
      marketplace: 'Mercado Livre',
      loja: 'Eletro Premium',
      frete: 'Grátis',
      freteGratis: true,
      parcelamento: '12x sem juros',
      avaliacao: 4.6,
      quantidadeAvaliacoes: 289,
      link: 'https://www.mercadolivre.com.br/martelete-plus'
    },
    {
      id: 10,
      titulo: 'Martelete Makita HR2670 Especial',
      imagem: 'https://images.unsplash.com/photo-1555617117-08c6e24d9740?auto=format&fit=crop&w=600&q=80',
      preco: 935.00,
      precoAntigo: 1099.99,
      promocao: '15% OFF',
      marketplace: 'Amazon',
      loja: 'Seller Premium',
      frete: 'R$ 0,00',
      freteGratis: true,
      parcelamento: '10x sem juros',
      avaliacao: 4.8,
      quantidadeAvaliacoes: 356,
      link: 'https://www.amazon.com.br/martelete-especial'
    },
    {
      id: 11,
      titulo: 'Martelete Makita HR2670 Standard',
      imagem: 'https://images.unsplash.com/photo-1555617117-08c6e24d9740?auto=format&fit=crop&w=600&q=80',
      preco: 850.00,
      precoAntigo: 999.90,
      promocao: '15% OFF',
      marketplace: 'Shopee',
      loja: 'Shopee Express',
      frete: 'Grátis',
      freteGratis: true,
      parcelamento: '12x sem juros',
      avaliacao: 4.4,
      quantidadeAvaliacoes: 198,
      link: 'https://shopee.com.br/martelete-standard'
    },
    {
      id: 12,
      titulo: 'Martelete Makita HR2670 Deluxe',
      imagem: 'https://images.unsplash.com/photo-1555617117-08c6e24d9740?auto=format&fit=crop&w=600&q=80',
      preco: 960.00,
      precoAntigo: 1199.99,
      promocao: '20% OFF',
      marketplace: 'Magazine Luiza',
      loja: 'Eletro Giga',
      frete: 'Grátis',
      freteGratis: true,
      parcelamento: '12x sem juros',
      avaliacao: 4.9,
      quantidadeAvaliacoes: 412,
      link: 'https://www.magazineluiza.com.br/martelete-deluxe'
    },
    {
      id: 13,
      titulo: 'Martelete Makita HR2670 Pro',
      imagem: 'https://images.unsplash.com/photo-1555617117-08c6e24d9740?auto=format&fit=crop&w=600&q=80',
      preco: 875.00,
      precoAntigo: 999.90,
      promocao: '12% OFF',
      marketplace: 'Mercado Livre',
      loja: 'Ferramenta Certa',
      frete: 'R$ 12,50',
      freteGratis: false,
      parcelamento: '10x sem juros',
      avaliacao: 4.5,
      quantidadeAvaliacoes: 267,
      link: 'https://www.mercadolivre.com.br/martelete-pro'
    },
    {
      id: 14,
      titulo: 'Martelete Makita HR2670 Ultra',
      imagem: 'https://images.unsplash.com/photo-1555617117-08c6e24d9740?auto=format&fit=crop&w=600&q=80',
      preco: 990.00,
      precoAntigo: 1199.99,
      promocao: '17% OFF',
      marketplace: 'Amazon',
      loja: 'Eletro Master',
      frete: 'R$ 0,00',
      freteGratis: true,
      parcelamento: '12x sem juros',
      avaliacao: 4.8,
      quantidadeAvaliacoes: 389,
      link: 'https://www.amazon.com.br/martelete-ultra'
    },
    {
      id: 15,
      titulo: 'Martelete Makita HR2670 Expert',
      imagem: 'https://images.unsplash.com/photo-1555617117-08c6e24d9740?auto=format&fit=crop&w=600&q=80',
      preco: 905.00,
      precoAntigo: 1099.99,
      promocao: '18% OFF',
      marketplace: 'Shopee',
      loja: 'Shopee Master',
      frete: 'Grátis',
      freteGratis: true,
      parcelamento: '12x sem juros',
      avaliacao: 4.6,
      quantidadeAvaliacoes: 243,
      link: 'https://shopee.com.br/martelete-expert'
    },
    {
      id: 16,
      titulo: 'Martelete Makita HR2670 Elite',
      imagem: 'https://images.unsplash.com/photo-1555617117-08c6e24d9740?auto=format&fit=crop&w=600&q=80',
      preco: 970.00,
      precoAntigo: 1199.99,
      promocao: '19% OFF',
      marketplace: 'Magazine Luiza',
      loja: 'Loja Virtual',
      frete: 'R$ 25,00',
      freteGratis: false,
      parcelamento: '10x sem juros',
      avaliacao: 4.7,
      quantidadeAvaliacoes: 298,
      link: 'https://www.magazineluiza.com.br/martelete-elite'
    },
    {
      id: 17,
      titulo: 'Martelete Makita HR2670 Classic',
      imagem: 'https://images.unsplash.com/photo-1555617117-08c6e24d9740?auto=format&fit=crop&w=600&q=80',
      preco: 820.00,
      precoAntigo: 999.90,
      promocao: '18% OFF',
      marketplace: 'Mercado Livre',
      loja: 'Comércio Geral',
      frete: 'Grátis',
      freteGratis: true,
      parcelamento: '12x sem juros',
      avaliacao: 4.3,
      quantidadeAvaliacoes: 156,
      link: 'https://www.mercadolivre.com.br/martelete-classic'
    },
    {
      id: 18,
      titulo: 'Martelete Makita HR2670 Mega',
      imagem: 'https://images.unsplash.com/photo-1555617117-08c6e24d9740?auto=format&fit=crop&w=600&q=80',
      preco: 950.00,
      precoAntigo: 1199.99,
      promocao: '21% OFF',
      marketplace: 'Amazon',
      loja: 'Power Tools',
      frete: 'R$ 0,00',
      freteGratis: true,
      parcelamento: '12x sem juros',
      avaliacao: 4.9,
      quantidadeAvaliacoes: 445,
      link: 'https://www.amazon.com.br/martelete-mega'
    },
    {
      id: 19,
      titulo: 'Martelete Makita HR2670 Master',
      imagem: 'https://images.unsplash.com/photo-1555617117-08c6e24d9740?auto=format&fit=crop&w=600&q=80',
      preco: 880.00,
      precoAntigo: 999.90,
      promocao: '12% OFF',
      marketplace: 'Shopee',
      loja: 'Loja Master',
      frete: 'R$ 8,90',
      freteGratis: false,
      parcelamento: '10x sem juros',
      avaliacao: 4.5,
      quantidadeAvaliacoes: 234,
      link: 'https://shopee.com.br/martelete-master'
    },
    {
      id: 20,
      titulo: 'Martelete Makita HR2670 Supreme',
      imagem: 'https://images.unsplash.com/photo-1555617117-08c6e24d9740?auto=format&fit=crop&w=600&q=80',
      preco: 975.00,
      precoAntigo: 1199.99,
      promocao: '19% OFF',
      marketplace: 'Magazine Luiza',
      loja: 'Mega Store',
      frete: 'Grátis',
      freteGratis: true,
      parcelamento: '12x sem juros',
      avaliacao: 4.8,
      quantidadeAvaliacoes: 367,
      link: 'https://www.magazineluiza.com.br/martelete-supreme'
    }
  ];
}

/**
 * Filtrar produtos por marketplace
 * 
 * @param {Array} products - Lista de produtos
 * @param {string} marketplace - Marketplace selecionado ('todos' ou nome específico)
 * @returns {Array} Produtos filtrados
 */
export function filterMarketplace(products, marketplace) {
  if (!products || !Array.isArray(products)) return [];
  if (marketplace === 'todos' || marketplace === 'all') return products;

  return products.filter(
    (product) => product.marketplace.toLowerCase() === marketplace.toLowerCase()
  );
}

/**
 * Ordenar produtos pelo menor preço
 * 
 * @param {Array} products - Lista de produtos
 * @returns {Array} Produtos ordenados
 */
export function sortByPrice(products) {
  if (!products || !Array.isArray(products)) return [];
  return [...products].sort((a, b) => a.preco - b.preco);
}

/**
 * Calcular competitividade do preço
 * Compara o preço do usuário com o preço do concorrente
 * 
 * @param {number} userPrice - Preço informado pelo usuário
 * @param {number} productPrice - Preço do produto concorrente
 * @returns {Object} Objeto com competitividade, diferença em R$ e %
 */
export function calculateCompetitiveness(userPrice, productPrice) {
  if (!userPrice || userPrice <= 0) {
    return {
      label: '—',
      style: 'info',
      diffValue: 0,
      diffPercent: 0,
      advantage: null
    };
  }

  const diffValue = productPrice - userPrice;
  const diffPercent = (diffValue / userPrice) * 100;

  // Determinar label e estilo baseado na diferença percentual
  let label, style, advantage;

  if (diffPercent <= -12) {
    label = 'Muito Competitivo';
    style = 'very-good';
    advantage = 'ganha';
  } else if (diffPercent <= -5) {
    label = 'Competitivo';
    style = 'good';
    advantage = 'ganha';
  } else if (Math.abs(diffPercent) < 5) {
    label = 'Preço Médio';
    style = 'info';
    advantage = 'similar';
  } else if (diffPercent <= 12) {
    label = 'Acima do Mercado';
    style = 'medium';
    advantage = 'perde';
  } else {
    label = 'Muito Caro';
    style = 'bad';
    advantage = 'perde';
  }

  return {
    label,
    style,
    diffValue: Math.abs(diffValue),
    diffPercent: Math.abs(diffPercent),
    advantage
  };
}

/**
 * Função principal de busca
 * Carrega produtos, filtra por marketplace, ordena por preço e retorna os 20 primeiros
 * 
 * @param {Object} params - Parâmetros da busca
 * @param {string} params.marketplace - Marketplace selecionado
 * @param {string} params.product - Termo de busca do produto
 * @param {number} params.userPrice - Preço do usuário
 * @returns {Promise<Object>} Objeto com resultados da busca
 */
export async function searchProducts({ marketplace = 'all', product = '', userPrice = 0 }) {
  try {
    // Simular delay de pesquisa
    setLoading(true);
    showToast('Pesquisando produtos...');

    // Aguardar 800ms para simular requisição
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Carregar produtos
    let products = await loadProducts();

    if (!products || products.length === 0) {
      throw new Error('Nenhum produto encontrado');
    }

    // Filtrar por termo de busca (se informado)
    if (product && product.trim()) {
      const searchTerm = product.toLowerCase();
      products = products.filter(
        (p) =>
          p.titulo.toLowerCase().includes(searchTerm) ||
          p.loja.toLowerCase().includes(searchTerm)
      );
    }

    // Filtrar por marketplace
    products = filterMarketplace(products, marketplace);

    // Ordenar por preço (menor para maior)
    products = sortByPrice(products);

    // Selecionar apenas os 20 primeiros
    const topProducts = products.slice(0, 20);

    // Separar em cards (primeiros 10) e tabela (últimos 10)
    const cardsProducts = topProducts.slice(0, 10);
    const tableProducts = topProducts.slice(10, 20);

    // Calcular estatísticas
    const stats = calculateStats(topProducts, userPrice);

    setLoading(false);
    showToast(`${topProducts.length} produtos encontrados`);

    return {
      success: true,
      cardsProducts,
      tableProducts,
      allProducts: topProducts,
      stats,
      totalResults: topProducts.length
    };
  } catch (error) {
    console.error('Erro na busca:', error);
    setLoading(false);
    showToast('Erro ao pesquisar produtos');

    return {
      success: false,
      cardsProducts: [],
      tableProducts: [],
      allProducts: [],
      stats: null,
      totalResults: 0
    };
  }
}

/**
 * Calcular estatísticas dos produtos
 * 
 * @param {Array} products - Lista de produtos
 * @param {number} userPrice - Preço do usuário
 * @returns {Object} Estatísticas
 */
function calculateStats(products, userPrice) {
  if (!products || products.length === 0) {
    return {
      minPrice: 0,
      maxPrice: 0,
      avgPrice: 0,
      medianPrice: 0,
      totalProducts: 0
    };
  }

  const prices = products.map((p) => p.preco).sort((a, b) => a - b);
  const total = prices.length;
  const sum = prices.reduce((acc, price) => acc + price, 0);

  let median = 0;
  if (total % 2 === 0) {
    median = (prices[total / 2 - 1] + prices[total / 2]) / 2;
  } else {
    median = prices[Math.floor(total / 2)];
  }

  return {
    minPrice: prices[0],
    maxPrice: prices[total - 1],
    avgPrice: sum / total,
    medianPrice: median,
    totalProducts: total
  };
}

/**
 * Renderizar cards (primeiros 10 produtos)
 * 
 * @param {Array} products - Lista de produtos para renderizar em cards
 * @param {number} userPrice - Preço do usuário para comparação
 */
export function renderCards(products, userPrice) {
  const container = document.getElementById('productCards');

  if (!container) {
    console.error('Container de cards não encontrado');
    return;
  }

  container.innerHTML = '';

  if (!products || products.length === 0) {
    container.innerHTML =
      '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-secondary);">Nenhum produto encontrado</div>';
    return;
  }

  products.forEach((product) => {
    const competitiveness = calculateCompetitiveness(userPrice, product.preco);
    const discount = product.precoAntigo
      ? Math.round(((product.precoAntigo - product.preco) / product.precoAntigo) * 100)
      : 0;

    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-card__media">
        <img src="${product.imagem}" alt="${product.titulo}" loading="lazy" />
        <span class="badge badge--highlight">${product.marketplace}</span>
      </div>
      <div class="product-card__body">
        <div class="product-card__info">
          <p class="product-card__marketplace">${product.marketplace}</p>
          <h4 class="product-card__title">${product.titulo}</h4>
          <span class="store-name">${product.loja}</span>
        </div>
        <div class="product-card__pricing">
          <strong class="current-price">${formatCurrency(product.preco)}</strong>
          ${product.precoAntigo ? `<span class="old-price">${formatCurrency(product.precoAntigo)}</span>` : ''}
          <div class="price-tags">
            <span class="price-tag price-tag--${competitiveness.style}">${competitiveness.label}</span>
            ${product.promocao ? `<span class="price-tag price-tag--promo">${product.promocao}</span>` : ''}
            ${discount > 0 ? `<span class="price-tag price-tag--discount">${discount}% OFF</span>` : ''}
            ${product.freteGratis ? '<span class="price-tag price-tag--free">Frete Grátis</span>' : ''}
          </div>
        </div>
      </div>
      <div class="product-card__footer">
        <div class="product-card__meta">
          <span class="rating">⭐ ${product.avaliacao.toFixed(1)} (${product.quantidadeAvaliacoes})</span>
          <span class="shipping">${product.frete}</span>
          <span class="parcelamento">${product.parcelamento}</span>
        </div>
        <a href="${product.link}" target="_blank" rel="noreferrer" class="button button--ghost button--small">
          Abrir Produto
        </a>
      </div>
      <div class="product-card__summary">
        ${
          userPrice && userPrice > 0
            ? `<span class="comparison-${competitiveness.advantage}">
                Você ${competitiveness.advantage} ${formatCurrency(competitiveness.diffValue)}
              </span>`
            : '<span class="comparison-info">Informe seu preço para comparar</span>'
        }
      </div>
    `;

    container.appendChild(card);
  });
}

/**
 * Renderizar tabela (produtos 11-20)
 * 
 * @param {Array} products - Lista de produtos para renderizar em tabela
 * @param {number} userPrice - Preço do usuário para comparação
 */
export function renderTable(products, userPrice) {
  const tbody = document.getElementById('resultTableBody');

  if (!tbody) {
    console.error('Tabela não encontrada');
    return;
  }

  tbody.innerHTML = '';

  if (!products || products.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML =
      '<td colspan="11" style="text-align: center; padding: 2rem; color: var(--text-secondary);">Nenhum produto para exibir na tabela</td>';
    tbody.appendChild(row);
    return;
  }

  products.forEach((product) => {
    const competitiveness = calculateCompetitiveness(userPrice, product.preco);

    const row = document.createElement('tr');
    row.innerHTML = `
      <td><img src="${product.imagem}" alt="${product.titulo}" style="max-width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" /></td>
      <td><strong>${product.titulo}</strong></td>
      <td>${product.marketplace}</td>
      <td>${product.loja}</td>
      <td>${formatCurrency(product.preco)}</td>
      <td>${product.promocao || '—'}</td>
      <td>${product.freteGratis ? '🚚 Grátis' : product.frete}</td>
      <td><span class="status-badge status-badge--${competitiveness.style}">${competitiveness.label}</span></td>
      <td>${formatCurrency(competitiveness.diffValue)}</td>
      <td>${competitiveness.diffPercent.toFixed(2)}%</td>
      <td><a href="${product.link}" target="_blank" rel="noreferrer" class="button button--ghost button--small">Abrir</a></td>
    `;

    tbody.appendChild(row);
  });
}

/**
 * Obter lista de marketplaces disponíveis
 * Futuramente virá de uma configuração centralizada
 * 
 * @returns {Array} Lista de marketplaces
 */
export function getAvailableMarketplaces() {
  return ['Todos', 'Mercado Livre', 'Amazon', 'Shopee', 'Magazine Luiza'];
}

/**
 * Exportar funções principais
 */
export default {
  searchProducts,
  filterMarketplace,
  sortByPrice,
  calculateCompetitiveness,
  renderCards,
  renderTable,
  getAvailableMarketplaces
};
