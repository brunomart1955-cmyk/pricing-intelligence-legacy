export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
