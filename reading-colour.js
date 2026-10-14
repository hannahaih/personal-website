(() => {
  'use strict';
  const root = document.documentElement;
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const effects = new Set(['wolken', 'tinte', 'fokus']);
  const unitSelector = '.strength-row, .skill-group';
  let zones = [], visible = [], marks = [];
  let focused = null, pointer = null, frame = 0;
  function active() { return effects.has(root.dataset.effect) && root.dataset.colour !== 'off'; }
  function targetZone(target) { return target.closest(unitSelector) || target.closest('[data-marker-scope]'); }
  function measure() {
    visible = zones.map(element => ({element, rect: element.getBoundingClientRect()}))
      .filter(({rect}) => rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight);
    marks = visible.flatMap(({element}) => [...element.querySelectorAll('.text-marker')]
      .map(element => ({element, rect: element.getBoundingClientRect()})))
      .filter(({rect}) => rect.bottom > 0 && rect.top < innerHeight);
  }
  function focus(element) {
    if (focused === element) return;
    focused?.classList.remove('reading-focus');
    focused = element;
    focused?.classList.add('reading-focus');
  }
  function paint() {
    frame = 0;
    if (!active() || root.dataset.effect === 'tinte') return;
    measure();
    if (root.dataset.effect === 'wolken') {
      visible.forEach(({element}) => element.classList.add('has-reading-colour'));
      if (!pointer || !fine.matches || reduced.matches) return;
      // Every visible phrase points toward the same mouse from its own position.
      marks.forEach(({element, rect}) => {
        const x = 50 + 43 * Math.tanh((pointer.x - (rect.left + rect.width / 2)) / 230);
        const y = 50 + 38 * Math.tanh((pointer.y - (rect.top + rect.height / 2)) / 170);
        element.style.setProperty('--wash-x', x.toFixed(2) + '%');
        element.style.setProperty('--wash-y', y.toFixed(2) + '%');
      });
      return;
    }
    const top = document.querySelector('.site-header').getBoundingClientRect().bottom + 20;
    const panel = document.querySelector('.colour-preview');
    const bottom = Math.min(innerHeight - 24, panel ? panel.getBoundingClientRect().top - 24 : innerHeight - 24);
    const usable = visible.filter(({rect}) => rect.bottom > top && rect.top < bottom);
    const mouseInReadingArea = pointer && pointer.y >= top && pointer.y <= bottom;
    if (mouseInReadingArea && pointer.zone?.getClientRects().length && usable.some(item => item.element === pointer.zone)) {
      focus(pointer.zone); return;
    }
    const line = mouseInReadingArea ? pointer.y : top + Math.max(0, bottom - top) * .44;
    const column = mouseInReadingArea ? pointer.x : innerWidth / 2;
    const ranked = usable.map(item => ({...item, distance:
      Math.max(item.rect.top - line, line - item.rect.bottom, 0) * 3
      + Math.max(item.rect.left - column, column - item.rect.right, 0)
    })).sort((a,b) => a.distance - b.distance);
    focus(ranked[0]?.element || null);
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(paint); }
  function refresh() {
    zones = [...document.querySelectorAll('.strength-row, .skill-group, [data-marker-scope]')]
      .filter(element => element.matches(unitSelector) || !element.closest(unitSelector));
    zones.forEach(element => element.classList.add('reading-colour-zone'));
    if (focused && (!focused.isConnected || !focused.getClientRects().length)) focus(null);
    schedule();
  }
  function syncInput() { root.dataset.readingStatic = String(!fine.matches || reduced.matches); schedule(); }
  function reset() {
    zones.forEach(element => element.classList.remove('has-reading-colour'));
    document.querySelectorAll('.text-marker').forEach(element => {
      element.style.removeProperty('--wash-x'); element.style.removeProperty('--wash-y');
    });
    focus(null);
  }
  document.addEventListener('pointermove', event => {
    if (!active() || !fine.matches || reduced.matches || event.pointerType !== 'mouse') return;
    pointer = {x:event.clientX, y:event.clientY,
      zone:event.target.closest('.site-header, .colour-preview, .site-footer, button') ? null : targetZone(event.target)};
    schedule();
  }, {passive:true});
  document.addEventListener('click', event => {
    if (!active() || event.target.closest('.colour-preview')) return;
    const element = targetZone(event.target);
    if (element && root.dataset.effect === 'fokus') focus(element);
    else if (element) schedule();
  });
  document.addEventListener('focusin', event => {
    if (!active() || event.target.closest('.colour-preview')) return;
    const element = zones.find(zone => zone.contains(event.target) || event.target.contains(zone));
    if (element && root.dataset.effect === 'fokus') focus(element);
  });
  window.addEventListener('hr-colour-preview-change', () => {reset(); pointer = null; refresh(); syncInput();});
  window.addEventListener('hr-reading-colour-reset', reset);
  window.addEventListener('hr-colour-preview-layout', schedule);
  window.addEventListener('scroll', () => {if (pointer) pointer.zone = null; schedule();}, {passive:true});
  window.addEventListener('resize', schedule, {passive:true});
  window.addEventListener('hashchange', () => {pointer = null; refresh();});
  window.addEventListener('load', refresh);
  document.querySelectorAll('details').forEach(element => element.addEventListener('toggle', schedule));
  new MutationObserver(refresh).observe(document.getElementById('case-body'), {childList:true});
  new MutationObserver(schedule).observe(root, {attributes:true, attributeFilter:['data-colour']});
  fine.addEventListener('change', syncInput); reduced.addEventListener('change', syncInput);
  refresh(); syncInput();
})();
