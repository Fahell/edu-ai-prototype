/**
 * Mock Data — Shop items organized by category
 * @namespace EduAI.Mock.ShopItems
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Mock = window.EduAI.Mock || {};

  const shopItems = {
    // ── Visual Themes ───────────────────────────────────────────────
    themes: [
      { id: 'theme-ocean', name: 'Ocean Breeze', description: 'Blue-toned chat theme', price: 80, preview: '#0EA5E9', icon: '🌊' },
      { id: 'theme-sunset', name: 'Sunset Glow', description: 'Warm orange and pink tones', price: 80, preview: '#F97316', icon: '🌅' },
      { id: 'theme-forest', name: 'Forest Green', description: 'Calm green theme', price: 80, preview: '#10B981', icon: '🌲' },
      { id: 'theme-neon', name: 'Neon Pulse', description: 'Cyberpunk neon accents', price: 150, preview: '#E879F9', icon: '💜' },
      { id: 'theme-midnight', name: 'Midnight Gold', description: 'Deep blue with gold accents', price: 200, preview: '#EAB308', icon: '🌙' },
    ],

    // ── Avatar Accessories ──────────────────────────────────────────
    avatarAccessories: [
      { id: 'avatar-glasses', name: 'Smart Glasses', description: 'Classic round glasses', price: 100, icon: '🤓', slot: 'face' },
      { id: 'avatar-sunglasses', name: 'Cool Shades', description: 'Stylish sunglasses', price: 120, icon: '😎', slot: 'face' },
      { id: 'avatar-grad-cap', name: 'Graduation Cap', description: 'Academic mortarboard', price: 200, icon: '🎓', slot: 'head' },
      { id: 'avatar-crown', name: 'Golden Crown', description: 'Royal headpiece', price: 500, icon: '👑', slot: 'head' },
      { id: 'avatar-headband', name: 'Study Headband', description: 'Focused learner headband', price: 80, icon: '🎯', slot: 'head' },
      { id: 'avatar-book', name: 'Ancient Tome', description: 'A glowing book accessory', price: 150, icon: '📖', slot: 'held' },
      { id: 'avatar-wand', name: 'Knowledge Wand', description: 'A magical learning wand', price: 250, icon: '🪄', slot: 'held' },
    ],

    // ── Mascot Accessories ──────────────────────────────────────────
    mascotAccessories: [
      { id: 'mascot-glasses', name: 'Brainy Glasses', description: 'Glasses for the mascot', price: 120, icon: '🤓', slot: 'face' },
      { id: 'mascot-hat', name: 'Thinking Cap', description: 'A tiny hat for focus', price: 150, icon: '🎩', slot: 'head' },
      { id: 'mascot-aura-calm', name: 'Calm Aura', description: 'A serene blue glow', price: 300, icon: '🔵', slot: 'aura' },
      { id: 'mascot-aura-fire', name: 'Fire Aura', description: 'Blazing orange glow', price: 400, icon: '🔥', slot: 'aura' },
      { id: 'mascot-aura-gold', name: 'Golden Aura', description: 'Radiant golden glow', price: 500, icon: '✨', slot: 'aura' },
      { id: 'mascot-scarf', name: 'Study Scarf', description: 'A cozy knitted scarf', price: 100, icon: '🧣', slot: 'neck' },
    ],

    // ── Titles ──────────────────────────────────────────────────────
    titles: [
      { id: 'title-learner', name: 'Eager Learner', description: 'For the curious mind', price: 50, text: 'Eager Learner' },
      { id: 'title-logic', name: 'Master of Logic', description: 'Logical reasoning expert', price: 200, text: 'Master of Logic 🧩' },
      { id: 'title-math', name: 'Math Wizard', description: 'Numbers bend to your will', price: 250, text: 'Math Wizard 🧮' },
      { id: 'title-streak', name: 'Unstoppable', description: 'For long streak holders', price: 300, text: 'Unstoppable 🔥' },
      { id: 'title-polyglot', name: 'Polymath', description: 'Master of multiple subjects', price: 400, text: 'Polymath 🌟' },
      { id: 'title-scholar', name: 'Grand Scholar', description: 'The highest academic honor', price: 500, text: 'Grand Scholar 👑' },
      { id: 'title-speed', name: 'Lightning Mind', description: 'For the fastest learners', price: 350, text: 'Lightning Mind ⚡' },
    ],
  };

  /**
   * Get all shop items as a flat array with category label.
   * @returns {Array}
   */
  function getAllItems() {
    const all = [];
    for (const [category, items] of Object.entries(shopItems)) {
      items.forEach((item) => all.push({ ...item, category }));
    }
    return all;
  }

  /**
   * Find a shop item by its ID across all categories.
   * @param {string} itemId
   * @returns {Object|null}
   */
  function getItemById(itemId) {
    for (const items of Object.values(shopItems)) {
      const found = items.find((item) => item.id === itemId);
      if (found) return found;
    }
    return null;
  }

  window.EduAI.Mock.ShopItems = shopItems;
  window.EduAI.Mock.getAllShopItems = getAllItems;
  window.EduAI.Mock.getShopItemById = getItemById;
})();
