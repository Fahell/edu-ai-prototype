/**
 * State Management — Centralized, observable, auto-persisting state
 * @namespace EduAI.state
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};

  /** @type {Map<string, Set<Function>>} */
  const listeners = new Map();

  /** @type {Object} Internal state store */
  let _state = {};

  /** @type {boolean} Whether state has been initialized */
  let _initialized = false;

  const STATE_KEY = 'app_state';
  const DEFAULT_STATE_URL = 'data/state-default.json';

  // ── Helpers ──────────────────────────────────────────────────────────

  /**
   * Resolve a dot-path string to a value inside an object.
   * @param {Object} obj
   * @param {string} path - e.g. "user.xp"
   * @returns {*} The value at path, or undefined
   */
  function getByPath(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current != null ? current[key] : undefined;
    }, obj);
  }

  /**
   * Set a value at a dot-path inside an object (mutates in place).
   * @param {Object} obj
   * @param {string} path
   * @param {*} value
   */
  function setByPath(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((current, key) => {
      if (current[key] == null || typeof current[key] !== 'object') {
        current[key] = {};
      }
      return current[key];
    }, obj);
    target[lastKey] = value;
  }

  /**
   * Deep merge source into target (mutates target).
   * New keys from source are added; existing keys are recursively merged.
   * @param {Object} target
   * @param {Object} source
   * @returns {Object}
   */
  function deepMerge(target, source) {
    for (const key of Object.keys(source)) {
      if (
        source[key] &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key]) &&
        target[key] &&
        typeof target[key] === 'object' &&
        !Array.isArray(target[key])
      ) {
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  }

  /**
   * Deep clone an object (JSON-safe).
   * @param {Object} obj
   * @returns {Object}
   */
  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // ── Listener Resolution ──────────────────────────────────────────────

  /**
   * Notify all listeners whose path matches the changed path.
   * Notifies exact matches AND parent paths.
   * e.g. setting "user.xp" notifies listeners for "user.xp" and "user"
   * @param {string} changedPath
   * @param {*} newValue
   */
  function notifyListeners(changedPath, newValue) {
    const changedParts = changedPath.split('.');

    for (const [listenPath, callbacks] of listeners) {
      const listenParts = listenPath.split('.');

      // Check if the listen path is a prefix of changed path, or vice versa
      const isPrefix =
        listenParts.length <= changedParts.length &&
        listenParts.every((p, i) => p === changedParts[i]);

      const isExactOrChild = changedParts.length <= listenParts.length &&
        changedParts.every((p, i) => p === listenParts[i]);

      if (isPrefix || isExactOrChild) {
        const value = getByPath(_state, listenPath);
        callbacks.forEach((cb) => {
          try {
            cb(value, listenPath);
          } catch (err) {
            console.error(`[State] Listener error for "${listenPath}":`, err);
          }
        });
      }
    }
  }

  // ── Persist ──────────────────────────────────────────────────────────

  function persist() {
    if (window.EduAI.Services && window.EduAI.Services.Storage) {
      window.EduAI.Services.Storage.save(STATE_KEY, _state);
    }
  }

  // ── Public API ───────────────────────────────────────────────────────

  const state = {
    /**
     * Initialize state from localStorage or default JSON file.
     * Must be called once at app startup.
     * @returns {Promise<void>}
     */
    async init() {
      if (_initialized) return;

      const Storage = window.EduAI.Services && window.EduAI.Services.Storage;

      // Try loading from localStorage first
      let saved = Storage ? Storage.load(STATE_KEY, null) : null;

      // Load default state from JSON file
      let defaults = null;
      try {
        const response = await fetch(DEFAULT_STATE_URL);
        if (response.ok) {
          defaults = await response.json();
        }
      } catch (err) {
        console.warn('[State] Could not load default state JSON:', err);
      }

      if (saved && defaults) {
        // Merge: defaults provide structure, saved provides user data
        _state = deepMerge(deepClone(defaults), saved);
      } else if (saved) {
        _state = saved;
      } else if (defaults) {
        _state = deepClone(defaults);
      } else {
        _state = { user: {}, subjects: {}, settings: { theme: 'light' } };
      }

      _initialized = true;

      // Persist the merged state so new fields from defaults are saved
      persist();

      console.log('[State] Initialized');
    },

    /**
     * Get a value at a dot-path.
     * @param {string} path - e.g. "user.xp" or "subjects.mathematics.name"
     * @returns {*} The value (cloned for objects/arrays)
     */
    get(path) {
      const value = getByPath(_state, path);
      // Return clones for objects/arrays to prevent accidental mutation
      if (value && typeof value === 'object') {
        return deepClone(value);
      }
      return value;
    },

    /**
     * Get a direct reference (no clone). Use with caution.
     * @param {string} path
     * @returns {*}
     */
    getRef(path) {
      return getByPath(_state, path);
    },

    /**
     * Set a value at a dot-path and notify listeners.
     * @param {string} path - e.g. "user.xp"
     * @param {*} value - New value
     */
    set(path, value) {
      const oldValue = getByPath(_state, path);
      setByPath(_state, path, value);
      persist();
      notifyListeners(path, value);
    },

    /**
     * Update multiple paths at once (batch set).
     * Notifies listeners once per path after all sets.
     * @param {Object} updates - { "user.xp": 150, "user.coins": 70 }
     */
    batchSet(updates) {
      const paths = Object.keys(updates);
      paths.forEach((path) => {
        setByPath(_state, path, updates[path]);
      });
      persist();
      paths.forEach((path) => {
        notifyListeners(path, getByPath(_state, path));
      });
    },

    /**
     * Subscribe to changes at a dot-path.
     * @param {string} path - e.g. "user.xp" or "user"
     * @param {Function} callback - Called with (newValue, path) on change
     */
    on(path, callback) {
      if (!listeners.has(path)) {
        listeners.set(path, new Set());
      }
      listeners.get(path).add(callback);
    },

    /**
     * Unsubscribe a listener.
     * @param {string} path
     * @param {Function} callback
     */
    off(path, callback) {
      const set = listeners.get(path);
      if (set) {
        set.delete(callback);
        if (set.size === 0) {
          listeners.delete(path);
        }
      }
    },

    /**
     * Get the entire state (cloned).
     * @returns {Object}
     */
    getAll() {
      return deepClone(_state);
    },

    /**
     * Reset state to defaults (re-fetch from JSON file).
     * @returns {Promise<void>}
     */
    async reset() {
      if (Storage) {
        Storage.remove(STATE_KEY);
      }

      try {
        const response = await fetch(DEFAULT_STATE_URL);
        if (response.ok) {
          _state = await response.json();
        }
      } catch (err) {
        console.warn('[State] Could not reset to defaults:', err);
      }

      persist();

      // Notify all registered listeners
      for (const [path] of listeners) {
        notifyListeners(path, getByPath(_state, path));
      }

      console.log('[State] Reset to defaults');
    },

    /**
     * Check if state has been initialized.
     * @returns {boolean}
     */
    isInitialized() {
      return _initialized;
    },
  };

  window.EduAI.state = state;
})();
