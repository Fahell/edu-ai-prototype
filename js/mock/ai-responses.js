/**
 * Mock Data — AI response templates organized by persona and context
 * @namespace EduAI.Mock.AIResponses
 *
 * Placeholders: {name}, {subject}, {module}, {persona}
 * Personas: sage (Prof. Sage), spark (Coach Spark), quiz (Quiz Master)
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Mock = window.EduAI.Mock || {};

  const AIResponses = {
    // ── Greeting ────────────────────────────────────────────────────
    greeting: {
      sage: [
        'Welcome back, {name}! Ready to dive into {subject}? Let me guide you through {module}.',
        'Hello, {name}! Today we explore {module} in {subject}. I have prepared some interesting concepts for you.',
        'Greetings, {name}! Let us begin our journey through {module}. I will be your guide.',
      ],
      spark: [
        'Hey {name}! 🔥 Let\'s crush {module} today! You\'ve got this!',
        'What\'s up, {name}! Ready to level up your {subject} skills? Let\'s gooo! ⚡',
        'Yo {name}! Today\'s topic is {module} — and I already know you\'re going to nail it! 💪',
      ],
      quiz: [
        '{name}, I\'m Quiz Master 🎯. Time to put your {subject} knowledge to the test with {module}.',
        'Welcome to the challenge, {name}. Today\'s assessment: {module}. Let\'s see what you know.',
        'Ready for {module}, {name}? I\'ll be evaluating your progress. No pressure — just do your best.',
      ],
    },

    // ── Explanation ─────────────────────────────────────────────────
    explanation: {
      sage: [
        'Let me explain this concept step by step. In {module}, the key idea is understanding the fundamental principles before moving to applications.',
        'This is an important topic in {subject}. The core concept here builds on what you learned earlier. Let me break it down for you.',
        'Think of it this way: {module} is like building blocks. Each concept supports the next one. Let me show you the foundation.',
      ],
      spark: [
        'Okay so here\'s the cool part about {module} — once you get this, everything else in {subject} starts to click! 🧠',
        'I love this topic! Let me show you why {module} is actually super interesting and useful in real life.',
        'Don\'t worry if it seems tricky at first. {module} is one of those things that feels impossible until suddenly it doesn\'t! Let me help.',
      ],
      quiz: [
        'Here\'s what you need to know about {module}. Pay attention — this will appear in the questions ahead.',
        '{module} is a key topic in {subject}. Let me present the essential concepts you need to master.',
        'For {module}, focus on these core ideas. They form the basis for everything we\'ll assess.',
      ],
    },

    // ── Feedback: Correct ───────────────────────────────────────────
    correct: {
      sage: [
        'Excellent work, {name}! Your understanding of this concept is solid. The reasoning you applied was precise.',
        'Precisely correct! You\'ve demonstrated a clear grasp of the underlying principles. Well done.',
        'That is the correct answer. Your analytical approach shows genuine comprehension of the material.',
      ],
      spark: [
        'YES! 🎉 You nailed it, {name}! That\'s the kind of brilliance I\'m talking about!',
        'Boom! Correct! 💥 You\'re on fire today! Keep this energy going!',
        'That\'s RIGHT! ⚡ See? I told you you\'d get it! You\'re smarter than you think!',
      ],
      quiz: [
        'Correct. Your answer demonstrates mastery of this concept.',
        'That\'s right. You\'ve passed this assessment point. Moving on.',
        'Correct answer recorded. ✅ Strong performance on this question.',
      ],
    },

    // ── Feedback: Incorrect (Socratic) ──────────────────────────────
    incorrect: {
      sage: [
        'Not quite, but let\'s think about this together. {hint}',
        'Interesting approach, but there\'s another way to look at it. {hint}',
        'That\'s not the answer I\'m looking for — but don\'t worry. {hint}',
      ],
      spark: [
        'Hmm, not quite! But hey, mistakes are how we learn! 🤔 {hint}',
        'Close, but not quite there yet! Let me give you a nudge: {hint}',
        'Whoops! But you know what? Every expert was once a beginner. {hint}',
      ],
      quiz: [
        'Incorrect. Let me guide you: {hint}',
        'That\'s not right. Review the concept: {hint}',
        'Wrong answer. But consider this: {hint}',
      ],
    },

    // ── Module Complete ─────────────────────────────────────────────
    moduleComplete: {
      sage: [
        'Splendid, {name}! You\'ve completed {module}. Your dedication to learning is commendable. The next module awaits when you\'re ready.',
        'Wonderful progress! {module} is now behind you. The knowledge you\'ve gained here will serve as a foundation for what comes next.',
      ],
      spark: [
        'AMAZING, {name}! 🎉🎊 You just crushed {module}! That deserves a celebration! You earned {xp} XP and {coins} coins! 🪙',
        'Module complete! 🏆 {name}, you\'re making incredible progress in {subject}! Keep going, you\'re unstoppable!',
      ],
      quiz: [
        'Assessment complete. You\'ve passed {module} with a solid understanding. Results have been recorded.',
        '{module} finished. Your performance shows readiness for the next assessment.',
      ],
    },

    // ── Streak Encouragement ────────────────────────────────────────
    streakActive: {
      spark: [
        '🔥 {streak} days in a row! You\'re building an incredible habit, {name}!',
        '{streak}-day streak! Don\'t break the chain! 🔥',
        'Consistency is key, and you\'re proving it! {streak} days straight! 💪',
      ],
    },

    // ── Streak Broken ───────────────────────────────────────────────
    streakBroken: {
      spark: [
        'Hey {name}, looks like we missed a day. No worries — every champion has setbacks. Let\'s start a new streak today! 💪',
        'Welcome back, {name}! Ready to build a new streak? I believe in you! 🔥',
      ],
    },

    // ── Frustration Detected ────────────────────────────────────────
    frustrated: {
      spark: [
        'Hey {name}, I can see this is tough. But you know what? Struggling means you\'re learning! Let\'s take it slower. 🤗',
        'Don\'t get discouraged! Everyone hits rough patches. Want me to explain it differently? We\'ve got this together! 💛',
        'Take a deep breath, {name}. Sometimes a fresh perspective is all you need. Want to try a different approach?',
      ],
      sage: [
        'I notice you\'re finding this challenging. Let me try a different explanation that might resonate better.',
        'Difficulty is a natural part of learning. Let me slow down and approach this from a different angle.',
      ],
    },

    // ── Speed Learner ───────────────────────────────────────────────
    speedLearner: {
      quiz: [
        'You\'re answering very quickly, {name}. Are these too easy? Let me suggest the next module.',
        'Impressive speed. You seem to have mastered this material. Ready for a greater challenge?',
      ],
      spark: [
        'Whoa, you\'re blazing through these! 🔥 Either you\'re a genius or this is too easy. Want to level up?',
      ],
    },

    // ── Slash Command Responses ─────────────────────────────────────
    slashCommands: {
      explain: {
        sage: [
          'Of course! Let me re-explain this concept in simpler terms. {concept}',
          'Great question! Here\'s another way to think about it: {concept}',
        ],
      },
      example: {
        sage: [
          'Here\'s a real-world example: {concept}',
          'Think of it like this in everyday life: {concept}',
        ],
      },
      hint: {
        quiz: [
          'Here\'s a hint without giving it away: {hint}',
          'Think carefully about this: {hint}',
        ],
      },
      pula: {
        spark: [
          'No problem, {name}! Let\'s move on to the next topic. You can always come back later! ➡️',
          'Skipping ahead! Sometimes a change of pace helps. Let\'s go! 🚀',
        ],
      },
      review: {
        sage: [
          'Great idea to review! Let me summarize the key points of {concept}. Repetition is the mother of learning.',
          'Let\'s go over {concept} again. Here are the most important takeaways:',
        ],
      },
      quiz: {
        quiz: [
          'Challenge accepted! Here\'s a question to test your understanding of {concept}.',
          'Pop quiz time! Let\'s see how well you know {concept}. 🎯',
        ],
      },
      persona: {
        spark: [
          'Sure thing! I\'m switching gears now. How can I help you, {name}? ⚡',
          'Switching persona! What would you like to focus on?',
        ],
      },
    },

    // ── Warm-Up Puzzle ──────────────────────────────────────────────
    warmup: {
      spark: [
        'Let\'s warm up that brain! 🧩 Solve this before we start:',
        'Time for a quick mental stretch! 🧠 Try this:',
        'Ready for a warm-up puzzle? This will get your gears turning! ⚙️',
      ],
    },

    // ── Generic Fallback ────────────────────────────────────────────
    fallback: {
      sage: ['Let me think about that for a moment...'],
      spark: ['Hang tight, let me work on that! ⚡'],
      quiz: ['Processing your request...'],
    },
  };

  window.EduAI.Mock.AIResponses = AIResponses;
})();
