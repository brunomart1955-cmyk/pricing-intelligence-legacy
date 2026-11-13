import assert from 'node:assert/strict';
import { buildShoppingResults, calculateMarketAverage } from '../js/shopping.js';

const results = buildShoppingResults('notebook', 'all', 2500);
assert.equal(results.length, 20, 'deve retornar 20 itens');
assert.ok(results.every((item) => item.rating > 0), 'cada item deve ter avaliação');
const average = calculateMarketAverage(results);
assert.ok(average > 0, 'a média do mercado deve ser calculada');
console.log('shopping test ok', { count: results.length, average });
