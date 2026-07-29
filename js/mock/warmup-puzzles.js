/**
 * Mock Data — Warm-up puzzle templates shown before each lesson
 * @namespace EduAI.Mock.WarmupPuzzles
 *
 * Puzzle types: 'sequence', 'pattern', 'rotation', 'logic', 'math', 'riddle'
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Mock = window.EduAI.Mock || {};

  const warmupPuzzles = [
    // ── Sequence Puzzles ────────────────────────────────────────────
    {
      id: 'seq-01',
      type: 'sequence',
      prompt: 'What comes next in the sequence?',
      data: [2, 6, 18, 54, '?'],
      answer: 162,
      hint: 'Each number is multiplied by 3.',
      difficulty: 'easy',
    },
    {
      id: 'seq-02',
      type: 'sequence',
      prompt: 'What comes next?',
      data: [1, 1, 2, 3, 5, 8, '?'],
      answer: 13,
      hint: 'Each number is the sum of the two before it (Fibonacci).',
      difficulty: 'easy',
    },
    {
      id: 'seq-03',
      type: 'sequence',
      prompt: 'Complete the pattern:',
      data: [1, 4, 9, 16, 25, '?'],
      answer: 36,
      hint: 'These are perfect squares: 1², 2², 3², 4², 5², ...',
      difficulty: 'easy',
    },
    {
      id: 'seq-04',
      type: 'sequence',
      prompt: 'What comes next?',
      data: [3, 5, 9, 17, 33, '?'],
      answer: 65,
      hint: 'The difference between terms doubles each time.',
      difficulty: 'medium',
    },

    // ── Pattern Puzzles ─────────────────────────────────────────────
    {
      id: 'pat-01',
      type: 'pattern',
      prompt: 'What color comes next?',
      data: '🔴🔵🔴🔵🔴?',
      answer: '🔵',
      hint: 'The colors alternate: red, blue, red, blue...',
      difficulty: 'easy',
    },
    {
      id: 'pat-02',
      type: 'pattern',
      prompt: 'Complete the pattern:',
      data: '🌙⭐🌙⭐⭐🌙⭐⭐⭐?',
      answer: '🌙',
      hint: 'Count the moons: they appear after increasing groups of stars.',
      difficulty: 'medium',
    },
    {
      id: 'pat-03',
      type: 'pattern',
      prompt: 'What comes next?',
      data: '🟢🟢🔴🟢🟢🔴🟢?',
      answer: '🟢',
      hint: 'Two greens, one red, repeat. Where are you in the cycle?',
      difficulty: 'easy',
    },
    {
      id: 'pat-04',
      type: 'pattern',
      prompt: 'Find the pattern:',
      data: 'A C E G ?',
      answer: 'I',
      hint: 'Skip one letter each time in the alphabet.',
      difficulty: 'easy',
    },

    // ── Logic Puzzles ───────────────────────────────────────────────
    {
      id: 'log-01',
      type: 'logic',
      prompt: 'If all Bloops are Razzles, and all Razzles are Lazzles, are all Bloops definitely Lazzles?',
      data: null,
      answer: true,
      hint: 'Think transitively: if A ⊂ B and B ⊂ C, then A ⊂ C.',
      difficulty: 'medium',
    },
    {
      id: 'log-02',
      type: 'logic',
      prompt: 'A bat and a ball cost $1.10 together. The bat costs $1.00 more than the ball. How much does the ball cost?',
      data: null,
      answer: 0.05,
      hint: 'If the ball costs x, the bat costs x + 1.00. Together: x + (x + 1.00) = 1.10.',
      difficulty: 'medium',
    },
    {
      id: 'log-03',
      type: 'logic',
      prompt: 'True or False: If it is raining, then the ground is wet. The ground is wet. Therefore, it is raining.',
      data: null,
      answer: false,
      hint: 'This is the "affirming the consequent" fallacy. Could the ground be wet for another reason?',
      difficulty: 'hard',
    },

    // ── Math Puzzles ────────────────────────────────────────────────
    {
      id: 'math-01',
      type: 'math',
      prompt: 'What is half of one-quarter of 200?',
      data: null,
      answer: 25,
      hint: 'First find one-quarter of 200, then take half of that.',
      difficulty: 'easy',
    },
    {
      id: 'math-02',
      type: 'math',
      prompt: 'How many triangles are in this number? Think: 7 + 8 = ?',
      data: null,
      answer: 15,
      hint: 'Simple addition. 7 + 8 = ?',
      difficulty: 'easy',
    },
    {
      id: 'math-03',
      type: 'math',
      prompt: 'A number doubled, then increased by 10, gives 30. What is the number?',
      data: null,
      answer: 10,
      hint: 'Work backwards: 30 - 10 = 20, then 20 / 2 = ?',
      difficulty: 'easy',
    },

    // ── Riddle Puzzles ──────────────────────────────────────────────
    {
      id: 'rid-01',
      type: 'riddle',
      prompt: 'I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?',
      data: null,
      answer: 'map',
      hint: 'You use me to find your way, but I am not a GPS.',
      difficulty: 'medium',
    },
    {
      id: 'rid-02',
      type: 'riddle',
      prompt: 'What has keys but no locks, space but no room, and you can enter but can\'t go inside?',
      data: null,
      answer: 'keyboard',
      hint: 'You\'re probably using one right now to type.',
      difficulty: 'easy',
    },
  ];

  /**
   * Get a random warm-up puzzle.
   * @param {string} [difficulty] - Filter by difficulty: 'easy', 'medium', 'hard'
   * @returns {Object} A puzzle object
   */
  function getRandomPuzzle(difficulty) {
    let pool = warmupPuzzles;
    if (difficulty) {
      pool = pool.filter((p) => p.difficulty === difficulty);
    }
    if (pool.length === 0) pool = warmupPuzzles;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  /**
   * Get a puzzle by its ID.
   * @param {string} puzzleId
   * @returns {Object|null}
   */
  function getPuzzleById(puzzleId) {
    return warmupPuzzles.find((p) => p.id === puzzleId) || null;
  }

  /**
   * Get all puzzles, optionally filtered by type.
   * @param {string} [type] - Filter by type
   * @returns {Array}
   */
  function getPuzzles(type) {
    if (type) return warmupPuzzles.filter((p) => p.type === type);
    return [...warmupPuzzles];
  }

  window.EduAI.Mock.WarmupPuzzles = warmupPuzzles;
  window.EduAI.Mock.getRandomPuzzle = getRandomPuzzle;
  window.EduAI.Mock.getPuzzleById = getPuzzleById;
  window.EduAI.Mock.getPuzzles = getPuzzles;
})();
