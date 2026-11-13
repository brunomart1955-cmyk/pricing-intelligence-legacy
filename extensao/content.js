(async () => {
  const { CONFIG } = await import(chrome.runtime.getURL("config.js"));
  const { GoogleParser } = await import(chrome.runtime.getURL("googleParser.js"));
  const { Utils } = await import(chrome.runtime.getURL("utils.js"));

  let cardsFound = [];
  for (const selector of CONFIG.SELECTORS.productCard) {
    const nodes = document.querySelectorAll(selector);
    if (nodes.length > 0) {
      cardsFound = Array.from(nodes).slice(0, CONFIG.MAX_PRODUCTS);
      Utils.log(`Google carregado. Encontrados ${nodes.length} cards.`);
      break;
    }
  }

  if (cardsFound.length === 0) {
    Utils.log("Nenhum card de produto localizado.", "warn");
    chrome.runtime.sendMessage({ action: "extraction_done" });
    return;
  }

  cardsFound.forEach((card, index) => {
    const product = GoogleParser.parseCard(card, index + 1);
    if (product) {
      Utils.log(`Card encontrado: "${product.title}"`);
      chrome.runtime.sendMessage({ action: "stream_product", product });
      Utils.log(`Card enviado [${index + 1}/20]`);
    }
  });

  chrome.runtime.sendMessage({ action: "extraction_done" });
})();