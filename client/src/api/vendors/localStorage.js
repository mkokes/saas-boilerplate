const { localStorage } = window;

/* eslint-disable no-console */
export const LocalStorageApi = {
  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (_) {
      console.error(`Error writing to localStorage`, key, value);
    }
  },
  getItem(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (_) {
      console.error(`Error getting from localStorage`, key);

      return undefined;
    }
  },
  clear() {
    try {
      localStorage.clear();
    } catch (_) {
      console.error('Error clearing localStorage');
    }
  },
};
