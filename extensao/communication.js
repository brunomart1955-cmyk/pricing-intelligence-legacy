import { Utils } from "./utils.js";

export const Communication = {
  listenDashboardRequests(onSearchCallback) {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === "search" && message.query) {
        Utils.log(`Pesquisa iniciada para: "${message.query}"`);
        onSearchCallback(message.query, sender.tab?.id);
        sendResponse({ success: true, status: "processing" });
      }
      return true;
    });
  },

  streamToDashboard(tabId, product) {
    if (!tabId) return;
    chrome.tabs.sendMessage(tabId, { action: "render_product", product }).catch(() => {});
  }
};