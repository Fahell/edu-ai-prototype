/**
 * Mock Data — NPC definitions for ranking, ghost racing, and live ticker
 * @namespace EduAI.Mock.NPCs
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Mock = window.EduAI.Mock || {};

  /**
   * NPC roster. Each NPC has a name, avatar emoji, XP, level, and ghost race config.
   * Ghost speed is a float 0-1 representing how fast the NPC answers during quizzes
   * (1 = instant, 0.1 = very slow).
   */
  const npcs = [
    { id: 'npc-ana', name: 'Ana Silva', avatar: '👩‍🎓', xp: 2340, level: 15, ghostSpeed: 0.82, weeklyXP: 420 },
    { id: 'npc-pedro', name: 'Pedro Santos', avatar: '👨‍💻', xp: 1890, level: 13, ghostSpeed: 0.65, weeklyXP: 350 },
    { id: 'npc-maria', name: 'Maria Oliveira', avatar: '👩‍🔬', xp: 1650, level: 12, ghostSpeed: 0.72, weeklyXP: 310 },
    { id: 'npc-lucas', name: 'Lucas Costa', avatar: '🧑‍🎓', xp: 1420, level: 11, ghostSpeed: 0.58, weeklyXP: 280 },
    { id: 'npc-julia', name: 'Julia Ferreira', avatar: '👩‍💻', xp: 1200, level: 10, ghostSpeed: 0.9, weeklyXP: 260 },
    { id: 'npc-rafael', name: 'Rafael Lima', avatar: '👨‍🎨', xp: 980, level: 9, ghostSpeed: 0.5, weeklyXP: 210 },
    { id: 'npc-camila', name: 'Camila Souza', avatar: '👩‍⚕️', xp: 870, level: 8, ghostSpeed: 0.6, weeklyXP: 190 },
    { id: 'npc-marcos', name: 'Marcos Pereira', avatar: '👨‍🏫', xp: 750, level: 7, ghostSpeed: 0.45, weeklyXP: 150 },
    { id: 'npc-beatriz', name: 'Beatriz Almeida', avatar: '👩‍🎤', xp: 620, level: 6, ghostSpeed: 0.7, weeklyXP: 120 },
    { id: 'npc-felipe', name: 'Felipe Rocha', avatar: '🧑‍🚀', xp: 480, level: 5, ghostSpeed: 0.55, weeklyXP: 90 },
  ];

  /**
   * NPC names used in the live ticker for random event generation.
   */
  const tickerNames = [
    'Ana S.', 'Pedro S.', 'Maria O.', 'Lucas C.', 'Julia F.',
    'Rafael L.', 'Camila S.', 'Marcos P.', 'Beatriz A.', 'Felipe R.',
    'Gabriel M.', 'Isabela T.', 'Thiago R.', 'Larissa C.', 'Bruno H.',
  ];

  /**
   * Badge names used in ticker events.
   */
  const tickerBadges = [
    'Primeiro Passo', 'Em Chamas', 'Perfeccionista', 'Speed Learner',
    'Ghost Buster', 'Puzzle Master', 'Memory Keeper', 'AI Whisperer',
  ];

  /**
   * Subject names used in ticker events.
   */
  const tickerSubjects = [
    'Matemática', 'Português', 'Raciocínio Lógico', 'História',
    'Ciências', 'Inglês', 'Programação', 'Direito',
  ];

  /**
   * Live ticker event templates.
   * {name}, {badge}, {subject}, {days}, {count} are placeholders.
   */
  const tickerTemplates = [
    '{name} unlocked the {badge} badge! 🏆',
    '{name} completed {subject}! 📐',
    '{name} is on a {days}-day streak! 🔥',
    '📚 {count} people studying {subject} right now',
    '{name} just leveled up! ⬆️',
    '{name} finished a module in {subject} ✅',
    'New high score: {name} aced 10 questions in a row! 💯',
    '{name} earned 50 coins from a streak bonus! 🪙',
  ];

  /**
   * Generate a random ticker event string.
   * @returns {string} A formatted ticker event
   */
  function generateTickerEvent() {
    const template = tickerTemplates[Math.floor(Math.random() * tickerTemplates.length)];
    return template
      .replace('{name}', tickerNames[Math.floor(Math.random() * tickerNames.length)])
      .replace('{badge}', tickerBadges[Math.floor(Math.random() * tickerBadges.length)])
      .replace('{subject}', tickerSubjects[Math.floor(Math.random() * tickerSubjects.length)])
      .replace('{days}', String(Math.floor(Math.random() * 28) + 3))
      .replace('{count}', String(Math.floor(Math.random() * 60) + 15));
  }

  /**
   * Get NPCs sorted by weekly XP (for leaderboard).
   * @returns {Array} Sorted NPC array
   */
  function getWeeklyLeaderboard() {
    return [...npcs].sort((a, b) => b.weeklyXP - a.weeklyXP);
  }

  /**
   * Get a random NPC for ghost racing.
   * @param {number} [difficulty=0.5] - Desired difficulty 0-1 (higher = faster NPC)
   * @returns {Object} NPC object
   */
  function getGhostRacer(difficulty) {
    if (difficulty == null) difficulty = 0.5;
    // Find the NPC whose ghostSpeed is closest to the target difficulty
    let best = npcs[0];
    let bestDiff = Math.abs(best.ghostSpeed - difficulty);
    for (const npc of npcs) {
      const diff = Math.abs(npc.ghostSpeed - difficulty);
      if (diff < bestDiff) {
        best = npc;
        bestDiff = diff;
      }
    }
    return { ...best };
  }

  window.EduAI.Mock.NPCs = npcs;
  window.EduAI.Mock.TickerNames = tickerNames;
  window.EduAI.Mock.generateTickerEvent = generateTickerEvent;
  window.EduAI.Mock.getWeeklyLeaderboard = getWeeklyLeaderboard;
  window.EduAI.Mock.getGhostRacer = getGhostRacer;
})();
