export const Storage = {
  saveResults: async (key, data) => {
    return chrome.storage.local.set({ [key]: data });
  }
};