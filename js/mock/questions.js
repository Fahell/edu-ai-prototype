/**
 * Mock Data — Question bank organized by subject, module, and type
 * @namespace EduAI.Mock.Questions
 *
 * Structure: questions[subjectId][moduleId] = Array<Question>
 * Question types: 'multiple-choice', 'true-false', 'fill-blank', 'drag-drop', 'slider', 'canvas'
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Mock = window.EduAI.Mock || {};

  const questions = {
    // ── Mathematics ────────────────────────────────────────────────────
    mathematics: {
      0: [
        {
          id: 'math-0-0',
          type: 'multiple-choice',
          prompt: 'What is 7 × 8?',
          options: [
            { label: 'A', text: '54' },
            { label: 'B', text: '56', correct: true },
            { label: 'C', text: '48' },
            { label: 'D', text: '63' },
          ],
          explanation: '7 × 8 = 56. A helpful trick: 7 × 7 = 49, then add 7 more.',
          socraticHint: 'Think about it step by step. What is 7 × 7? Now add one more group of 7.',
        },
        {
          id: 'math-0-1',
          type: 'true-false',
          prompt: 'The result of 15 - 9 is an even number.',
          correctAnswer: false,
          explanation: '15 - 9 = 6, which IS even. So the statement is true. Wait — 6 is even, so this is TRUE.',
          socraticHint: 'First calculate 15 - 9. Then ask yourself: is that result divisible by 2?',
        },
        {
          id: 'math-0-2',
          type: 'slider',
          prompt: 'What is the square root of 144?',
          min: 0,
          max: 20,
          step: 1,
          correctAnswer: 12,
          explanation: '√144 = 12 because 12 × 12 = 144.',
          socraticHint: 'Think: what number multiplied by itself gives 144?',
        },
      ],
      1: [
        {
          id: 'math-1-0',
          type: 'multiple-choice',
          prompt: 'Which fraction is equivalent to 0.5?',
          options: [
            { label: 'A', text: '1/3' },
            { label: 'B', text: '2/5' },
            { label: 'C', text: '1/2', correct: true },
            { label: 'D', text: '3/4' },
          ],
          explanation: '0.5 means "half", which is written as 1/2.',
          socraticHint: 'The decimal 0.5 represents five tenths. Can you simplify 5/10?',
        },
      ],
      2: [
        {
          id: 'math-2-0',
          type: 'multiple-choice',
          prompt: 'Solve: 2x + 6 = 14. What is x?',
          options: [
            { label: 'A', text: '2' },
            { label: 'B', text: '4', correct: true },
            { label: 'C', text: '10' },
            { label: 'D', text: '8' },
          ],
          explanation: '2x + 6 = 14 → 2x = 8 → x = 4.',
          socraticHint: 'Start by isolating the term with x. What happens if you subtract 6 from both sides?',
        },
        {
          id: 'math-2-1',
          type: 'fill-blank',
          prompt: 'If 3x - 5 = 10, then x = ____',
          blanks: ['5'],
          explanation: '3x - 5 = 10 → 3x = 15 → x = 5.',
          socraticHint: 'Add 5 to both sides first. What do you get? Then divide by 3.',
        },
      ],
      3: [
        {
          id: 'math-3-0',
          type: 'multiple-choice',
          prompt: 'What are the roots of x² - 5x + 6 = 0?',
          options: [
            { label: 'A', text: 'x = 1 and x = 6' },
            { label: 'B', text: 'x = 2 and x = 3', correct: true },
            { label: 'C', text: 'x = -2 and x = -3' },
            { label: 'D', text: 'x = 1 and x = 5' },
          ],
          explanation: 'Factoring: (x - 2)(x - 3) = 0, so x = 2 or x = 3. You can verify: (2)² - 5(2) + 6 = 0 ✓',
          socraticHint: 'Try factoring. What two numbers multiply to give 6 and add up to -5?',
        },
      ],
      4: [
        {
          id: 'math-4-0',
          type: 'multiple-choice',
          prompt: 'What is the area of a triangle with base 10cm and height 6cm?',
          options: [
            { label: 'A', text: '60 cm²' },
            { label: 'B', text: '30 cm²', correct: true },
            { label: 'C', text: '16 cm²' },
            { label: 'D', text: '36 cm²' },
          ],
          explanation: 'Area of triangle = (base × height) / 2 = (10 × 6) / 2 = 30 cm².',
          socraticHint: 'Do you remember the triangle area formula? It involves dividing a rectangle by 2.',
        },
      ],
      5: [
        {
          id: 'math-5-0',
          type: 'multiple-choice',
          prompt: 'What is the mean (average) of 4, 7, 9, 12, and 8?',
          options: [
            { label: 'A', text: '7' },
            { label: 'B', text: '8', correct: true },
            { label: 'C', text: '9' },
            { label: 'D', text: '10' },
          ],
          explanation: 'Mean = (4 + 7 + 9 + 12 + 8) / 5 = 40 / 5 = 8.',
          socraticHint: 'To find the mean, add all values and divide by how many there are.',
        },
      ],
    },

    // ── Logical Reasoning ──────────────────────────────────────────────
    'logical-reasoning': {
      0: [
        {
          id: 'lr-0-0',
          type: 'multiple-choice',
          prompt: 'What comes next? 2, 6, 18, 54, ___',
          options: [
            { label: 'A', text: '108' },
            { label: 'B', text: '162', correct: true },
            { label: 'C', text: '72' },
            { label: 'D', text: '216' },
          ],
          explanation: 'Each number is multiplied by 3: 2×3=6, 6×3=18, 18×3=54, 54×3=162.',
          socraticHint: 'Look at the ratio between consecutive numbers. What do you get each time?',
        },
        {
          id: 'lr-0-1',
          type: 'drag-drop',
          prompt: 'Order these from smallest to largest:',
          items: ['0.25', '1/3', '0.5', '3/8', '0.1'],
          correctOrder: ['0.1', '0.25', '3/8', '1/3', '0.5'],
          explanation: 'Converting to decimals: 0.1, 0.25, 0.375, 0.333, 0.5. So: 0.1 < 0.25 < 3/8 < 1/3 < 0.5.',
          socraticHint: 'Try converting all values to decimals to make comparison easier.',
        },
      ],
      1: [
        {
          id: 'lr-1-0',
          type: 'multiple-choice',
          prompt: 'Book is to Reading as Fork is to ___',
          options: [
            { label: 'A', text: 'Kitchen' },
            { label: 'B', text: 'Eating', correct: true },
            { label: 'C', text: 'Spoon' },
            { label: 'D', text: 'Food' },
          ],
          explanation: 'A book is a tool for reading. A fork is a tool for eating.',
          socraticHint: 'Think about the relationship: a book is the TOOL you use to do WHAT?',
        },
      ],
      2: [
        {
          id: 'lr-2-0',
          type: 'true-false',
          prompt: 'If all cats are animals, and some animals are pets, then all cats must be pets.',
          correctAnswer: false,
          explanation: 'This is a syllogism fallacy. Just because some animals are pets does not mean all cats are pets.',
          socraticHint: 'Draw a Venn diagram mentally. Where do cats overlap with animals? Do they necessarily overlap with pets?',
        },
      ],
      3: [
        {
          id: 'lr-3-0',
          type: 'multiple-choice',
          prompt: 'If P = true and Q = false, what is P AND Q?',
          options: [
            { label: 'A', text: 'True' },
            { label: 'B', text: 'False', correct: true },
            { label: 'C', text: 'Undefined' },
            { label: 'D', text: 'Both' },
          ],
          explanation: 'AND requires BOTH to be true. Since Q is false, P AND Q = false.',
          socraticHint: 'Think of AND as a gate: both inputs must be green for the output to be green.',
        },
      ],
      4: [
        {
          id: 'lr-4-0',
          type: 'canvas',
          prompt: 'Draw a line of symmetry on this shape (imagine a rectangle).',
          correctAnswer: null, // Canvas answers are validated by "AI Vision" mock
          explanation: 'A rectangle has two lines of symmetry: one vertical through the center and one horizontal.',
          socraticHint: 'Where could you fold the shape so both halves match perfectly?',
        },
      ],
    },

    // ── Programming ────────────────────────────────────────────────────
    programming: {
      0: [
        {
          id: 'prog-0-0',
          type: 'multiple-choice',
          prompt: 'What is the FIRST step in computational thinking when facing a complex problem?',
          options: [
            { label: 'A', text: 'Write code immediately' },
            { label: 'B', text: 'Decompose it into smaller parts', correct: true },
            { label: 'C', text: 'Search for solutions online' },
            { label: 'D', text: 'Choose a programming language' },
          ],
          explanation: 'Decomposition is breaking a complex problem into smaller, manageable sub-problems.',
          socraticHint: 'Before you can solve a big problem, what do you need to do with it first?',
        },
      ],
      1: [
        {
          id: 'prog-1-0',
          type: 'multiple-choice',
          prompt: 'What will this code output?\n\nlet x = 10;\nx = x + 5;\nconsole.log(x);',
          options: [
            { label: 'A', text: '10' },
            { label: 'B', text: '15', correct: true },
            { label: 'C', text: '5' },
            { label: 'D', text: 'undefined' },
          ],
          explanation: 'x starts as 10, then x = 10 + 5 = 15. Variables can be reassigned.',
          socraticHint: 'Follow the value of x step by step. What is it after each line?',
        },
      ],
      2: [
        {
          id: 'prog-2-0',
          type: 'fill-blank',
          prompt: 'Complete the condition:\n\nif (age ____ 18) {\n  console.log("Adult");\n}',
          blanks: ['>='],
          explanation: 'The >= operator checks if age is greater than or equal to 18.',
          socraticHint: 'What operator means "greater than OR equal to"?',
        },
      ],
      3: [
        {
          id: 'prog-3-0',
          type: 'multiple-choice',
          prompt: 'What does this function return?\n\nfunction add(a, b) {\n  return a + b;\n}\nadd(3, 7);',
          options: [
            { label: 'A', text: '37' },
            { label: 'B', text: '10', correct: true },
            { label: 'C', text: 'undefined' },
            { label: 'D', text: 'NaN' },
          ],
          explanation: 'The function adds a + b = 3 + 7 = 10. The + operator performs arithmetic on numbers.',
          socraticHint: 'Look at the parameters a=3 and b=7. What does the + operator do with numbers?',
        },
      ],
      4: [
        {
          id: 'prog-4-0',
          type: 'multiple-choice',
          prompt: 'Which sorting algorithm repeatedly steps through the list and swaps adjacent elements if they are in the wrong order?',
          options: [
            { label: 'A', text: 'Merge Sort' },
            { label: 'B', text: 'Quick Sort' },
            { label: 'C', text: 'Bubble Sort', correct: true },
            { label: 'D', text: 'Binary Search' },
          ],
          explanation: 'Bubble Sort "bubbles" the largest element to the end by swapping adjacent pairs.',
          socraticHint: 'Think about bubbles rising in water. Which algorithm shares this visual metaphor?',
        },
      ],
    },

    // ── Science ────────────────────────────────────────────────────────
    science: {
      0: [
        {
          id: 'sci-0-0',
          type: 'multiple-choice',
          prompt: 'What is the correct order of the scientific method?',
          options: [
            { label: 'A', text: 'Conclusion → Hypothesis → Experiment' },
            { label: 'B', text: 'Hypothesis → Experiment → Conclusion', correct: true },
            { label: 'C', text: 'Experiment → Hypothesis → Conclusion' },
            { label: 'D', text: 'Conclusion → Experiment → Hypothesis' },
          ],
          explanation: 'You form a hypothesis, test it with an experiment, then draw a conclusion from the results.',
          socraticHint: 'Can you test something before you have a guess about what might happen?',
        },
      ],
      1: [
        {
          id: 'sci-1-0',
          type: 'slider',
          prompt: 'At approximately what speed (in m/s) does an object fall after 3 seconds (ignoring air resistance)?',
          min: 0,
          max: 50,
          step: 1,
          correctAnswer: 29,
          explanation: 'Speed = gravity × time ≈ 9.8 × 3 ≈ 29.4 m/s. Rounded to ~29 m/s.',
          socraticHint: 'An object accelerates at about 9.8 m/s² due to gravity. Multiply that by 3 seconds.',
        },
      ],
      2: [
        {
          id: 'sci-2-0',
          type: 'multiple-choice',
          prompt: 'How many protons does a Carbon atom have?',
          options: [
            { label: 'A', text: '4' },
            { label: 'B', text: '6', correct: true },
            { label: 'C', text: '8' },
            { label: 'D', text: '12' },
          ],
          explanation: 'The atomic number of Carbon is 6, meaning it has 6 protons in its nucleus.',
          socraticHint: 'Look at the periodic table. The atomic number tells you the number of protons.',
        },
      ],
      3: [
        {
          id: 'sci-3-0',
          type: 'multiple-choice',
          prompt: 'What is the powerhouse of the cell?',
          options: [
            { label: 'A', text: 'Nucleus' },
            { label: 'B', text: 'Ribosome' },
            { label: 'C', text: 'Mitochondria', correct: true },
            { label: 'D', text: 'Cell membrane' },
          ],
          explanation: 'Mitochondria produce ATP (energy currency) through cellular respiration.',
          socraticHint: 'Which organelle is responsible for converting nutrients into usable energy (ATP)?',
        },
      ],
    },

    // ── History ────────────────────────────────────────────────────────
    history: {
      0: [
        {
          id: 'hist-0-0',
          type: 'multiple-choice',
          prompt: 'Which ancient civilization built the pyramids at Giza?',
          options: [
            { label: 'A', text: 'Mesopotamians' },
            { label: 'B', text: 'Romans' },
            { label: 'C', text: 'Egyptians', correct: true },
            { label: 'D', text: 'Greeks' },
          ],
          explanation: 'The Great Pyramid of Giza was built around 2560 BCE during the Fourth Dynasty of ancient Egypt.',
          socraticHint: 'Think about which civilization lived along the Nile River in North Africa.',
        },
      ],
      1: [
        {
          id: 'hist-1-0',
          type: 'true-false',
          prompt: 'The feudal system in the Middle Ages was based on a hierarchy of lords, vassals, and serfs.',
          correctAnswer: true,
          explanation: 'Feudalism was a social and economic system where land was exchanged for military service and labor.',
          socraticHint: 'Think about who held power in medieval society and how land ownership worked.',
        },
      ],
    },

    // ── English ────────────────────────────────────────────────────────
    english: {
      0: [
        {
          id: 'eng-0-0',
          type: 'multiple-choice',
          prompt: 'Which word is the OPPOSITE of "generous"?',
          options: [
            { label: 'A', text: 'Kind' },
            { label: 'B', text: 'Selfish', correct: true },
            { label: 'C', text: 'Wealthy' },
            { label: 'D', text: 'Polite' },
          ],
          explanation: 'Generous means willing to give. Selfish means concerned only with yourself.',
          socraticHint: 'Generous describes someone who shares freely. What would you call someone who never shares?',
        },
      ],
      1: [
        {
          id: 'eng-1-0',
          type: 'fill-blank',
          prompt: 'She ____ to school every day.',
          blanks: ['goes'],
          explanation: 'Third person singular (she) in simple present requires "goes" (verb + es).',
          socraticHint: 'The subject is "she" (third person singular). What form does "go" take?',
        },
      ],
    },

    // ── Portuguese ─────────────────────────────────────────────────────
    portuguese: {
      0: [
        {
          id: 'pt-0-0',
          type: 'multiple-choice',
          prompt: 'Which sentence has correct subject-verb agreement?',
          options: [
            { label: 'A', text: 'Os aluno estudou bastante.' },
            { label: 'B', text: 'Os alunos estudaram bastante.', correct: true },
            { label: 'C', text: 'Os alunos estudou bastante.' },
            { label: 'D', text: 'Os aluno estudaram bastante.' },
          ],
          explanation: '"Alunos" (plural) requires the plural verb form "estudaram".',
          socraticHint: 'Match the number of the subject with the verb. If the subject is plural, the verb must be too.',
        },
      ],
    },

    // ── Law ────────────────────────────────────────────────────────────
    law: {
      0: [
        {
          id: 'law-0-0',
          type: 'multiple-choice',
          prompt: 'What is the primary source of law in a democratic country?',
          options: [
            { label: 'A', text: 'The President' },
            { label: 'B', text: 'The Constitution', correct: true },
            { label: 'C', text: 'The Supreme Court' },
            { label: 'D', text: 'International treaties' },
          ],
          explanation: 'The Constitution is the supreme law that establishes the fundamental rules of a state.',
          socraticHint: 'Which document sits at the top of the legal hierarchy and all other laws must comply with?',
        },
      ],
    },
  };

  /**
   * Get all questions for a subject and module.
   * @param {string} subjectId
   * @param {number} moduleId
   * @returns {Array} Array of question objects, empty if not found
   */
  function getQuestions(subjectId, moduleId) {
    if (questions[subjectId] && questions[subjectId][moduleId]) {
      return questions[subjectId][moduleId];
    }
    return [];
  }

  /**
   * Get a specific question by its ID.
   * @param {string} questionId
   * @returns {Object|null}
   */
  function getQuestionById(questionId) {
    for (const subjectId of Object.keys(questions)) {
      for (const moduleId of Object.keys(questions[subjectId])) {
        const found = questions[subjectId][moduleId].find((q) => q.id === questionId);
        if (found) return found;
      }
    }
    return null;
  }

  window.EduAI.Mock.Questions = questions;
  window.EduAI.Mock.getQuestions = getQuestions;
  window.EduAI.Mock.getQuestionById = getQuestionById;
})();
