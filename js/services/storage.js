/**
 * Storage Service — localStorage wrapper with JSON serialization
 * @namespace EduAI.Services.Storage
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Services = window.EduAI.Services || {};

  const PREFIX = 'eduai_';

  const Storage = {
    /**
     * Save data to localStorage under a prefixed key.
     * @param {string} key - Storage key (without prefix)
     * @param {*} data - Data to serialize and store
     */
    save(key, data) {
      try {
        const serialized = JSON.stringify(data);
        localStorage.setItem(PREFIX + key, serialized);
      } catch (err) {
        console.warn(`[Storage] Failed to save "${key}":`, err);
      }
    },

    /**
     * Load data from localStorage. Returns defaultData if key is missing or corrupt.
     * @param {string} key - Storage key (without prefix)
     * @param {*} defaultData - Fallback value
     * @returns {*} Parsed data or defaultData
     */
    load(key, defaultData) {
      try {
        const raw = localStorage.getItem(PREFIX + key);
        if (raw === null) return defaultData;
        return JSON.parse(raw);
      } catch (err) {
        console.warn(`[Storage] Failed to load "${key}", returning default:`, err);
        return defaultData;
      }
    },

    /**
     * Remove a key from localStorage.
     * @param {string} key - Storage key (without prefix)
     */
    remove(key) {
      try {
        localStorage.removeItem(PREFIX + key);
      } catch (err) {
        console.warn(`[Storage] Failed to remove "${key}":`, err);
      }
    },

    /**
     * Clear all EduAI-prefixed keys from localStorage.
     */
    clear() {
      try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(PREFIX)) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
      } catch (err) {
        console.warn('[Storage] Failed to clear:', err);
      }
    },

    /**
     * Check if a key exists in localStorage.
     * @param {string} key - Storage key (without prefix)
     * @returns {boolean}
     */
    has(key) {
      return localStorage.getItem(PREFIX + key) !== null;
    },
  };

  window.EduAI.Services.Storage = Storage;
})();
