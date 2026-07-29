/**
 * Knowledge Graph — Interactive SVG node graph showing subject dependencies
 * @namespace EduAI.Components.KnowledgeGraph
 */
(function () {
  'use strict';

  window.EduAI = window.EduAI || {};
  window.EduAI.Components = window.EduAI.Components || {};

  const KnowledgeGraph = {
    /**
     * Render an interactive knowledge graph.
     * @param {Object} [options]
     * @param {string} [options.subjectId] - Filter to a single subject
     * @returns {string} SVG HTML
     */
    render(options) {
      const edges = EduAI.Mock.KnowledgeEdges || [];
      const subjects = EduAI.Mock.Subjects || {};
      const subjectState = EduAI.state.get('subjects') || {};

      // Collect unique nodes from edges
      const nodeSet = new Set();
      const filteredEdges = options?.subjectId
        ? edges.filter((e) => e.from.startsWith(options.subjectId + ':') || e.to.startsWith(options.subjectId + ':'))
        : edges;

      filteredEdges.forEach((e) => { nodeSet.add(e.from); nodeSet.add(e.to); });

      const nodes = Array.from(nodeSet).map((key) => {
        const [subId, modId] = key.split(':');
        const subject = subjects[subId];
        const mod = subject?.modules?.find((m) => m.id === parseInt(modId));
        const state = subjectState[subId]?.modules?.find((m) => m.id === parseInt(modId));
        return {
          key,
          subjectId: subId,
          moduleId: parseInt(modId),
          label: mod?.name || key,
          icon: subject?.icon || '📖',
          completed: state?.completed || false,
        };
      });

      if (nodes.length === 0) {
        return '<div class="empty-state"><div class="empty-state__icon">🕸️</div><div class="empty-state__text">Start studying to build your knowledge graph!</div></div>';
      }

      // Simple circular layout
      const width = 500;
      const height = 400;
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.35;

      const positioned = nodes.map((node, i) => {
        const angle = (i / nodes.length) * 2 * Math.PI - Math.PI / 2;
        return { ...node, x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
      });

      // Build lookup
      const posMap = {};
      positioned.forEach((n) => { posMap[n.key] = n; });

      // Edges as lines
      const edgesHTML = filteredEdges.map((e) => {
        const from = posMap[e.from];
        const to = posMap[e.to];
        if (!from || !to) return '';
        return `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" class="knowledge-graph__edge" stroke="var(--color-border)" stroke-width="1.5" marker-end="url(#arrow)"/>`;
      }).join('');

      // Nodes as circles + labels
      const nodesHTML = positioned.map((n) => {
        const fillClass = n.completed ? 'knowledge-graph__node--completed' : '';
        return `
          <g class="knowledge-graph__node ${fillClass}" data-key="${n.key}">
            <circle cx="${n.x}" cy="${n.y}" r="20" fill="${n.completed ? 'var(--color-success)' : 'var(--color-surface)'}" stroke="var(--color-border)" stroke-width="2"/>
            <text x="${n.x}" y="${n.y}" text-anchor="middle" dominant-baseline="central" font-size="14">${n.icon}</text>
            <text x="${n.x}" y="${n.y + 32}" text-anchor="middle" font-size="9" fill="var(--color-text-secondary)">${n.label}</text>
          </g>
        `;
      }).join('');

      return `
        <div class="knowledge-graph-container">
          <svg viewBox="0 0 ${width} ${height}" class="knowledge-graph" role="img" aria-label="Knowledge graph">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="25" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-border)"/>
              </marker>
            </defs>
            ${edgesHTML}
            ${nodesHTML}
          </svg>
        </div>
      `;
    },
  };

  window.EduAI.Components.KnowledgeGraph = KnowledgeGraph;
})();
