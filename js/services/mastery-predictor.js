/**
 * Mastery Predictor Service — Estimates mastery level per subject/module
 * @namespace EduAI.Services.MasteryPredictor
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Services = window.EduAI.Services || {};

  const MasteryPredictor = {
    /**
     * Predict mastery percentage for a module based on performance data.
     * @param {string} subjectId
     * @param {number} moduleId
     * @returns {number} Mastery percentage (0-100)
     */
    predictModuleMastery(subjectId, moduleId) {
      const subjectState = EduAI.state.get('subjects.' + subjectId);
      if (!subjectState || !subjectState.modules) return 0;

      const mod = subjectState.modules.find((m) => m.id === moduleId);
      if (!mod) return 0;

      if (mod.completed) return 100;

      const total = mod.questionsAnswered || 0;
      const correct = mod.correctAnswers || 0;
      if (total === 0) return 0;

      return Math.round((correct / total) * 100);
    },

    /**
     * Get mastery breakdown for an entire subject.
     * @param {string} subjectId
     * @returns {{ overall: number, modules: Array<{ id: number, mastery: number }> }}
     */
    predictSubjectMastery(subjectId) {
      const subjects = EduAI.Mock.Subjects;
      const subject = subjects[subjectId];
      if (!subject) return { overall: 0, modules: [] };

      const modules = subject.modules || [];
      const moduleMasteries = modules.map((m) => ({
        id: m.id,
        name: m.name,
        mastery: MasteryPredictor.predictModuleMastery(subjectId, m.id),
      }));

      const overall = moduleMasteries.length > 0
        ? Math.round(moduleMasteries.reduce((sum, m) => sum + m.mastery, 0) / moduleMasteries.length)
        : 0;

      return { overall, modules: moduleMasteries };
    },

    /**
     * Get radar chart data for all subjects the user has started.
     * @returns {Array<{ subject: string, icon: string, mastery: number }>}
     */
    getRadarData() {
      const subjects = EduAI.Mock.Subjects;
      const subjectState = EduAI.state.get('subjects') || {};

      return Object.keys(subjectState)
        .filter((id) => subjects[id])
        .map((id) => ({
          subject: subjects[id].name,
          icon: subjects[id].icon,
          mastery: MasteryPredictor.predictSubjectMastery(id).overall,
        }));
    },
  };

  window.EduAI.Services.MasteryPredictor = MasteryPredictor;
})();
