export const Utils = {
  generateId: () => `prod_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,

  cleanPrice: (priceStr) => {
    if (!priceStr) return null;
    return priceStr.replace(/[^\d.,]/g, "").trim();
  },

  extractNumbers: (str) => {
    if (!str) return 0;
    const matches = str.match(/\d+/g);
    return matches ? parseInt(matches.join(""), 10) : 0;
  },

  log: (message, type = "info", data = "") => {
    const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);
    const prefix = `[Pricing Intelligence][${timestamp}][${type.toUpperCase()}]`;
    console.log(`${prefix} ${message}`, data);
  }
};