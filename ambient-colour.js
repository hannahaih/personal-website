(() => {
  'use strict';
  const root = document.documentElement;
  const effects = new Set(['atem', 'horizont', 'randlicht']);
  root.dataset.ambientStatic = String(typeof CSS === 'undefined' || typeof CSS.registerProperty !== 'function');
  let zones = [];
  let current = null;
  let frame = 0;

  function active() { return effects.has(root.dataset.effect); }
  function choose(element) {
    if (current === element) return;
    current?.classList.remove('ambient-current');
    current = element;
    current?.classList.add('ambient-current');
  }
  function update() {
    frame = 0;
    if (!active()) {choose(null); return;}
    const top = document.querySelector('.site-header').getBoundingClientRect().bottom + 20;
    const panel = document.querySelector('.colour-preview');
    const bottom = Math.min(innerHeight - 24, panel ? panel.getBoundingClientRect().top - 24 : innerHeight - 24);
    const readingLine = top + Math.max(0, bottom - top) * .44;
    const visible = [];
    zones.forEach(element => {
      if (!element.getClientRects().length) return;
      const rect = element.getBoundingClientRect();
      const visibleHeight = Math.min(rect.bottom, bottom) - Math.max(rect.top, top);
      if (visibleHeight < Math.min(40, rect.height * .2)) return;
      element.classList.add('ambient-seen');
      const centre = (Math.max(rect.top, top) + Math.min(rect.bottom, bottom)) / 2;
      visible.push({element, distance: Math.abs(centre - readingLine)});
    });
    visible.sort((a, b) => a.distance - b.distance);
    const candidate = visible[0];
    const previous = visible.find(item => item.element === current);
    // A small scroll must not make neighbouring rows trade focus repeatedly.
    if (candidate && previous && previous.distance - candidate.distance < 36) return;
    choose(candidate?.element || null);
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  function refresh() {
    zones = [...document.querySelectorAll('.strength-row, .skill-group, [data-marker-scope]')]
      .filter(element => element.matches('.strength-row, .skill-group') || !element.closest('.strength-row, .skill-group'));
    zones.forEach(element => element.classList.add('ambient-colour-zone'));
    if (current && (!current.isConnected || !current.getClientRects().length)) choose(null);
    schedule();
  }
  function reset() {
    choose(null);
    zones.forEach(element => element.classList.remove('ambient-seen'));
    refresh();
  }
  function selectTarget(event) {
    if (!active() || event.target.closest('.site-header, .colour-preview, .site-footer')) return;
    const zone = event.target.closest('.strength-row, .skill-group') || event.target.closest('[data-marker-scope]');
    if (!zone) return;
    zone.classList.add('ambient-seen');
    choose(zone);
  }
  document.addEventListener('click', selectTarget);
  document.addEventListener('focusin', event => {
    if (!active()) return;
    const zone = zones.find(element => element.contains(event.target) || event.target.contains(element));
    if (zone) {zone.classList.add('ambient-seen'); choose(zone);}
  });
  window.addEventListener('scroll', schedule, {passive: true});
  window.addEventListener('resize', schedule, {passive: true});
  window.addEventListener('load', refresh);
  window.addEventListener('hashchange', refresh);
  window.addEventListener('hr-colour-preview-change', reset);
  window.addEventListener('hr-colour-preview-layout', schedule);
  document.querySelectorAll('details').forEach(element => element.addEventListener('toggle', refresh));
  new MutationObserver(refresh).observe(document.getElementById('case-body'), {childList: true});
  new MutationObserver(schedule).observe(root, {attributes: true, attributeFilter: ['data-colour']});
  document.addEventListener('visibilitychange', () => {
    root.dataset.ambientSuspended = String(document.hidden);
    if (!document.hidden) schedule();
  });
  root.dataset.ambientSuspended = String(document.hidden);
  refresh();
})();
