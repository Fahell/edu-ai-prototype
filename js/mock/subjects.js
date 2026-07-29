/**
 * Mock Data — Subject definitions with modules and knowledge graph edges
 * @namespace EduAI.Mock.Subjects
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Mock = window.EduAI.Mock || {};

  /**
   * Subject catalog. Each subject has metadata and an ordered list of modules.
   * Module IDs are unique within a subject (0-indexed).
   */
  const subjects = {
    mathematics: {
      id: 'mathematics',
      name: 'Mathematics',
      icon: '📐',
      description: 'From basic operations to algebra and geometry',
      difficulty: 'beginner',
      estimatedHours: 12,
      modules: [
        { id: 0, name: 'Basic Operations', description: 'Addition, subtraction, multiplication, division' },
        { id: 1, name: 'Fractions and Decimals', description: 'Understanding parts of a whole' },
        { id: 2, name: 'First-Degree Equations', description: 'Solving for x in linear equations' },
        { id: 3, name: 'Quadratic Equations', description: 'The quadratic formula and factoring' },
        { id: 4, name: 'Basic Geometry', description: 'Angles, triangles, area, and perimeter' },
        { id: 5, name: 'Statistics and Probability', description: 'Mean, median, mode, and chance' },
      ],
    },

    portuguese: {
      id: 'portuguese',
      name: 'Portuguese',
      icon: '📝',
      description: 'Grammar, text interpretation, and writing',
      difficulty: 'beginner',
      estimatedHours: 10,
      modules: [
        { id: 0, name: 'Fundamentals of Grammar', description: 'Sentences, nouns, and agreement' },
        { id: 1, name: 'Nouns and Articles', description: 'Types of nouns and article usage' },
        { id: 2, name: 'Verbs and Conjugations', description: 'Tenses, moods, and conjugation patterns' },
        { id: 3, name: 'Text Interpretation', description: 'Reading comprehension strategies' },
        { id: 4, name: 'Argumentative Writing', description: 'Building a thesis and supporting it' },
      ],
    },

    'logical-reasoning': {
      id: 'logical-reasoning',
      name: 'Logical Reasoning',
      icon: '🧩',
      description: 'Patterns, sequences, and logical deductions',
      difficulty: 'intermediate',
      estimatedHours: 8,
      modules: [
        { id: 0, name: 'Logical Sequences', description: 'Number and pattern sequences' },
        { id: 1, name: 'Analogies', description: 'Identifying relationships between concepts' },
        { id: 2, name: 'Syllogisms', description: 'Deductive reasoning from premises' },
        { id: 3, name: 'Truth Tables', description: 'Evaluating logical propositions' },
        { id: 4, name: 'Spatial Reasoning', description: 'Mental rotation and spatial visualization' },
      ],
    },

    history: {
      id: 'history',
      name: 'History',
      icon: '🏛️',
      description: 'World and local history through the ages',
      difficulty: 'beginner',
      estimatedHours: 10,
      modules: [
        { id: 0, name: 'Ancient Civilizations', description: 'Mesopotamia, Egypt, Greece, and Rome' },
        { id: 1, name: 'Middle Ages', description: 'Feudalism, the Church, and the Crusades' },
        { id: 2, name: 'Renaissance and Exploration', description: 'Art, science, and the Age of Discovery' },
        { id: 3, name: 'Industrial Revolution', description: 'Machines, factories, and social change' },
        { id: 4, name: 'Contemporary World', description: 'Wars, cold war, and globalization' },
      ],
    },

    science: {
      id: 'science',
      name: 'Science',
      icon: '🔬',
      description: 'Physics, chemistry, and biology fundamentals',
      difficulty: 'beginner',
      estimatedHours: 10,
      modules: [
        { id: 0, name: 'Scientific Method', description: 'Hypothesis, experimentation, and conclusions' },
        { id: 1, name: 'Basic Physics', description: 'Forces, motion, and energy' },
        { id: 2, name: 'Basic Chemistry', description: 'Atoms, elements, and chemical reactions' },
        { id: 3, name: 'Biology Fundamentals', description: 'Cells, organisms, and ecosystems' },
      ],
    },

    english: {
      id: 'english',
      name: 'English',
      icon: '🇬🇧',
      description: 'Vocabulary, grammar, and reading comprehension',
      difficulty: 'beginner',
      estimatedHours: 8,
      modules: [
        { id: 0, name: 'Basic Vocabulary', description: 'Common words and everyday phrases' },
        { id: 1, name: 'Present Tenses', description: 'Simple present and present continuous' },
        { id: 2, name: 'Past Tenses', description: 'Simple past and present perfect' },
        { id: 3, name: 'Reading Comprehension', description: 'Understanding short texts and passages' },
      ],
    },

    programming: {
      id: 'programming',
      name: 'Programming',
      icon: '💻',
      description: 'Logic, variables, functions, and algorithms',
      difficulty: 'intermediate',
      estimatedHours: 12,
      modules: [
        { id: 0, name: 'Computational Thinking', description: 'Decomposition, patterns, and abstraction' },
        { id: 1, name: 'Variables and Data Types', description: 'Storing and using information' },
        { id: 2, name: 'Conditionals and Loops', description: 'Making decisions and repeating actions' },
        { id: 3, name: 'Functions', description: 'Reusable blocks of code' },
        { id: 4, name: 'Basic Algorithms', description: 'Sorting, searching, and problem solving' },
      ],
    },

    law: {
      id: 'law',
      name: 'Law',
      icon: '⚖️',
      description: 'Constitutional law, civil rights, and legal basics',
      difficulty: 'advanced',
      estimatedHours: 14,
      modules: [
        { id: 0, name: 'Introduction to Law', description: 'What is law and why it matters' },
        { id: 1, name: 'Constitutional Principles', description: 'Fundamental principles of the constitution' },
        { id: 2, name: 'Fundamental Rights', description: 'Individual and collective guarantees' },
        { id: 3, name: 'Civil Law Basics', description: 'Contracts, obligations, and property' },
      ],
    },
  };

  /**
   * Knowledge graph edges — prerequisite relationships between modules.
   * Format: { from: "subjectId:moduleId", to: "subjectId:moduleId" }
   * Meaning: "from" is a prerequisite for "to".
   */
  const knowledgeEdges = [
    // Mathematics internal dependencies
    { from: 'mathematics:0', to: 'mathematics:1' },
    { from: 'mathematics:0', to: 'mathematics:2' },
    { from: 'mathematics:1', to: 'mathematics:2' },
    { from: 'mathematics:2', to: 'mathematics:3' },
    { from: 'mathematics:0', to: 'mathematics:4' },
    { from: 'mathematics:0', to: 'mathematics:5' },

    // Portuguese internal
    { from: 'portuguese:0', to: 'portuguese:1' },
    { from: 'portuguese:0', to: 'portuguese:2' },
    { from: 'portuguese:1', to: 'portuguese:3' },
    { from: 'portuguese:2', to: 'portuguese:4' },

    // Logical Reasoning internal
    { from: 'logical-reasoning:0', to: 'logical-reasoning:1' },
    { from: 'logical-reasoning:1', to: 'logical-reasoning:2' },
    { from: 'logical-reasoning:2', to: 'logical-reasoning:3' },

    // Programming internal
    { from: 'programming:0', to: 'programming:1' },
    { from: 'programming:1', to: 'programming:2' },
    { from: 'programming:2', to: 'programming:3' },
    { from: 'programming:3', to: 'programming:4' },

    // Cross-subject dependencies
    { from: 'mathematics:0', to: 'programming:1' },
    { from: 'logical-reasoning:0', to: 'programming:0' },
    { from: 'mathematics:0', to: 'science:1' },

    // Science internal
    { from: 'science:0', to: 'science:1' },
    { from: 'science:0', to: 'science:2' },
    { from: 'science:0', to: 'science:3' },

    // History — sequential
    { from: 'history:0', to: 'history:1' },
    { from: 'history:1', to: 'history:2' },
    { from: 'history:2', to: 'history:3' },
    { from: 'history:3', to: 'history:4' },

    // English internal
    { from: 'english:0', to: 'english:1' },
    { from: 'english:1', to: 'english:2' },
    { from: 'english:0', to: 'english:3' },

    // Law internal
    { from: 'law:0', to: 'law:1' },
    { from: 'law:1', to: 'law:2' },
    { from: 'law:0', to: 'law:3' },
  ];

  /**
   * Custom subject suggestion cards shown in the catalog.
   */
  const customSuggestions = [
    { id: 'enem-2025', name: 'ENEM 2025', icon: '🎯', description: 'Prepare for the Brazilian national exam' },
    { id: 'concurso-inss', name: 'INSS Exam Prep', icon: '📋', description: 'Study plan for the INSS public tender' },
    { id: 'investimentos', name: 'Investing Basics', icon: '📈', description: 'Stocks, bonds, and financial literacy' },
    { id: 'ia-generativa', name: 'Generative AI', icon: '🤖', description: 'How LLMs, diffusion models, and RAG work' },
    { id: 'marketing-digital', name: 'Digital Marketing', icon: '📱', description: 'SEO, social media, and ad campaigns' },
    { id: 'produtividade', name: 'Productivity', icon: '⚡', description: 'Time management and focus techniques' },
    { id: 'design-thinking', name: 'Design Thinking', icon: '🎨', description: 'Human-centered problem solving' },
    { id: 'financas-pessoais', name: 'Personal Finance', icon: '💰', description: 'Budgeting, saving, and debt management' },
  ];

  window.EduAI.Mock.Subjects = subjects;
  window.EduAI.Mock.KnowledgeEdges = knowledgeEdges;
  window.EduAI.Mock.CustomSuggestions = customSuggestions;
})();
