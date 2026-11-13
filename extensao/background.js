import { CONFIG } from "./config.js";
import { Utils } from "./utils.js";
import { Communication } from "./communication.js";

let searchStartTime = 0;

Communication.listenDashboardRequests(async (query, originalTabId) => {
  searchStartTime = performance.now();
  const searchUrl = `${CONFIG.BASE_URL}${encodeURIComponent(query)}`;

  try {
    const temporaryTab = await chrome.tabs.create({
      url: searchUrl,
      active: false
    });

    const streamListener = (message, sender) => {
      if (sender.tab?.id !== temporaryTab.id) return;

      if (message.action === "stream_product") {
        Communication.streamToDashboard(originalTabId, message.product);
      }

      if (message.action === "extraction_done") {
        const totalTime = ((performance.now() - searchStartTime) / 1000).toFixed(2);
        Utils.log(`Pesquisa finalizada. Tempo total: ${totalTime}s`);
        
        chrome.runtime.onMessage.removeListener(streamListener);
        chrome.tabs.remove(temporaryTab.id).catch(() => {});
      }
    };

    chrome.runtime.onMessage.addListener(streamListener);

    chrome.tabs.onUpdated.addListener(function statusListener(tabId, changeInfo) {
      if (tabId === temporaryTab.id && changeInfo.status === "complete") {
        chrome.tabs.onUpdated.removeListener(statusListener);

        chrome.scripting.executeScript({
          target: { tabId: temporaryTab.id },
          files: ["content.js"]
        });
      }
    });

  } catch (error) {
    Utils.log("Erro no fluxo do Background Script", "error", error);
  }
});