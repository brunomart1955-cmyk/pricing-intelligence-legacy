import { CONFIG } from "./config.js";
import { Utils } from "./utils.js";

export const GoogleParser = {
  extractField(card, selectorKey) {
    const selectors = CONFIG.SELECTORS[selectorKey];
    for (const selector of selectors) {
      const element = card.querySelector(selector);
      if (element) {
        if (selectorKey === "image") return element.src || element.getAttribute("data-src") || element.getAttribute("src");
        if (selectorKey === "link") return element.href;
        return element.textContent.trim();
      }
    }
    return null;
  },

  parseCard(card, position) {
    try {
      const title = this.extractField(card, "title");
      const priceRaw = this.extractField(card, "price");
      const url = this.extractField(card, "link");

      if (!title || !priceRaw || !url) return null;

      const ratingRaw = this.extractField(card, "rating");
      const reviewsRaw = this.extractField(card, "reviews");

      return {
        id: Utils.generateId(),
        title,
        price: Utils.cleanPrice(priceRaw),
        oldPrice: Utils.cleanPrice(this.extractField(card, "oldPrice")),
        currency: priceRaw.includes("R$") ? "BRL" : "USD",
        image: this.extractField(card, "image"),
        store: this.extractField(card, "store") || "Não identificada",
        marketplace: "Google Shopping",
        delivery: this.extractField(card, "shipping")?.includes("Chegará") ? "Rápida" : "Padrão",
        shipping: this.extractField(card, "shipping") || "Sem informações",
        rating: ratingRaw ? parseFloat(ratingRaw.replace(",", ".")) : null,
        reviews: Utils.extractNumbers(reviewsRaw),
        url,
        position,
        source: "google_shopping",
        timestamp: Date.now()
      };
    } catch (error) {
      Utils.log("Erro ao processar card individual", "error", error);
      return null;
    }
  }
};