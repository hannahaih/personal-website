(() => {
  'use strict';
  const root = document.documentElement;
  if (!root.hasAttribute('data-reading-lab') && !root.hasAttribute('data-reading-accents')) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const SVG = 'http://www.w3.org/2000/svg';
  let zones = [], frame = 0, pointerFrame = 0;
  let pointer = null, suspended = document.hidden;
  let effect = root.dataset.calmEffect || 'verlauf';
  const motionAllowed = () => !reduced.matches && root.dataset.calmMotion !== 'off' && !suspended;

  function drawing(className, viewBox, pathData) {
    const svg = document.createElementNS(SVG, 'svg');
    svg.setAttribute('class', 'calm-drawing ' + className);
    svg.setAttribute('viewBox', viewBox);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    const paths = typeof pathData === 'string' ? [pathData] : pathData;
    paths.forEach(data => {
      const path = document.createElementNS(SVG, 'path');
      path.setAttribute('d', data);
      path.setAttribute('pathLength', '100');
      svg.append(path);
    });
    return svg;
  }
  function visible(element) {
    if (!element.isConnected || !element.getClientRects().length) return false;
    const r = element.getBoundingClientRect();
    const top = document.querySelector('.site-header')?.getBoundingClientRect().bottom || 0;
    const bottom = innerHeight - 25;
    return r.width > 0 && Math.min(r.bottom, bottom) - Math.max(r.top, top) > Math.min(r.height * .25, 28);
  }
  function chapter(zone) {
    return zone.closest('.case-section, .case-heading, section[id]') || zone;
  }
  function scan() {
    frame = 0;
    if (suspended) return;
    const chapters = new Map();
    zones.forEach(zone => {
      const section = chapter(zone);
      if (!chapters.has(section)) chapters.set(section, []);
      chapters.get(section).push(zone);
    });
    chapters.forEach(members => {
      // Start the whole chapter in one frame when its first text enters view.
      // Hidden accordion content belongs to the same reveal, so opening it
      // later does not introduce another distracting animation.
      const started = members.some(zone => zone.classList.contains('calm-seen'));
      if (started || members.some(visible)) {
        members.forEach(zone => zone.classList.add('calm-seen'));
      }
    });
    if (effect === 'licht') schedulePointer();
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(scan); }
  function tone(element) {
    return window.HR_READING_SEMANTICS?.tone(element) || 'neutral';
  }
  function rank(mark) {
    const text = mark.textContent.trim();
    const career = mark.closest('[data-career]');
    if (career) {
      if (mark.closest('summary')) return 'plain';
      return 'primary';
    }
    if (mark.closest('[data-strength]')) return 'primary';
    // The application and personal contribution are the scan anchors;
    // outcome/status stays subordinate through typography alone.
    if (mark.closest('.project-link')) return mark.closest('.project-outcome') ? 'secondary' : 'primary';
    if (mark.closest('.hero-description')) return 'primary';
    if (mark.closest('.technical-group')) return 'primary';
    return 'primary';
  }
  function paintKey(mark) {
    const context = mark.closest('[data-strength]')?.dataset.strength ||
      mark.closest('[data-career]')?.dataset.career ||
      mark.closest('.project-link')?.getAttribute('href') ||
      mark.closest('#case-body')?.querySelector('h1')?.textContent.trim() ||
      mark.closest('section[id]')?.id || 'portfolio';
    const section = mark.closest('.case-section, .technical-group')?.querySelector('h2, h3')?.textContent.trim();
    const scope = mark.closest('[data-marker-scope]');
    const index = scope ? [...scope.querySelectorAll('.text-marker')].indexOf(mark) : 0;
    return [context, section, mark.textContent.trim(), String(index)].filter(value => value !== undefined && value !== '').join('|');
  }
  function ensurePaint(mark) {
    const paints = window.HR_READING_PAINTS;
    if (!paints?.effects.includes(effect)) return;
    const key = paintKey(mark);
    const previous = mark.querySelector('.calm-paint');
    if (previous?.dataset.paintEffect === effect && previous.dataset.paintKey === key) return;
    previous?.remove();
    const surface = paints.create(effect, key);
    surface.dataset.paintKey = key;
    mark.append(surface);
  }
  function refresh() {
    document.querySelectorAll('.text-marker').forEach(mark => {
      mark.dataset.calmRank = rank(mark);
      mark.dataset.calmTone = tone(mark);
    });
    zones = [...document.querySelectorAll('[data-marker-scope]')].filter(zone => zone.querySelector('.text-marker[data-calm-rank="primary"]'));
    zones.forEach(zone => {
      zone.classList.add('calm-zone');
      // Only the older margin accent needs a paragraph colour. Each selected
      // phrase has its own meaning and overrides this inherited fallback.
      zone.dataset.calmTone = zone.querySelector('.text-marker[data-calm-rank="primary"]').dataset.calmTone;
      zone.querySelectorAll('.text-marker[data-calm-rank="primary"]').forEach(mark => {
        ensurePaint(mark);
        if (mark.querySelector('.calm-oval')) return;
        mark.append(drawing('calm-oval', '0 0 100 40', 'M14 5 C35 1 77 2 92 6 C101 9 102 21 95 29 C88 38 62 38 40 37 C17 37 0 35 2 21 C3 12 7 7 14 5'));
        mark.append(drawing('calm-rule', '0 0 100 7', 'M2 4 C29 2 62 5 98 3'));
        mark.append(drawing('calm-felt', '0 0 100 10', [
          'M2 5.8 C12 4.4 18 5.5 29 4.9 S45 6 55 4.5 S76 5.2 85 4.5 L98 4',
          'M5 7 C24 6.7 43 7.5 60 6.4 S83 7 95 5.6'
        ]));
        mark.append(drawing('calm-brush', '0 0 100 24', [
          'M1 6 L4 4 L3 3 L18 3.8 L32 2 L48 3.5 L66 2.2 L83 3.6 L98 2.5 L97 5 L100 6 L98 9 L99 13 L96 15 L98 19 L86 19.5 L70 21 L52 19.5 L37 21.5 L18 20 L3 21 L4 18 L1 17 L2 14 L0 12 L2 9 Z',
          'M3 3.7 L20 3 L36 1.5 L52 2.5 L73 1.5 L97 2.8 L90 3.8 L72 3.5 L52 4.2 L31 3.6 Z',
          'M4 20.5 L22 21.5 L40 20.5 L59 21.8 L77 20.7 L96 20 L89 22 L61 23 L42 22 L20 23 Z',
          'M0 7.5 L12 6.5 M1 15 L9 15.5 M91 5 L100 4 M92 17 L100 18 M8 4.8 C31 5.7 50 4 89 5.8 M10 18.7 C29 17.8 46 20.7 83 19.6'
        ]));
        mark.append(drawing('calm-watercolour', '0 0 100 30', [
          'M2 8 C7 3 16 5 23 3 C35 1 42 4 51 3 C64 2 71 4 80 3 C89 2 96 4 98 8 C100 12 98 17 99 21 C96 26 87 25 79 27 C68 29 60 26 50 27 C40 26 30 29 20 26 C11 27 4 25 2 21 C0 17 2 13 2 8 Z',
          'M4 12 C16 6 24 10 35 8 C48 6 59 10 70 7 C84 5 93 8 97 11 C99 17 90 22 82 21 C69 23 54 20 43 23 C30 24 15 22 6 23 C2 20 3 16 4 12 Z',
          'M5 9 C13 4 23 6 29 4 C42 2 51 6 65 4 C78 2 88 5 97 7 L94 10 C78 8 61 10 44 8 C28 8 18 11 5 12 Z'
        ]));
      });
    });
    schedule();
  }
  function replay() {
    cancelAnimationFrame(frame);
    frame = 0;
    zones.forEach(zone => zone.classList.remove('calm-seen'));
    // Leave one render with the undecorated text before drawing the new style.
    requestAnimationFrame(() => requestAnimationFrame(schedule));
  }
  function updatePointer() {
    pointerFrame = 0;
    if (effect !== 'licht' || !motionAllowed() || !fine.matches || root.dataset.colour === 'off') return;
    zones.filter(visible).forEach(zone => zone.querySelectorAll('.text-marker').forEach(mark => {
      const r = mark.getBoundingClientRect();
      const x = pointer ? 3 * Math.tanh((pointer.x - r.left - r.width / 2) / 300) : 0;
      const y = pointer ? 3 * Math.tanh((pointer.y - r.top - r.height / 2) / 220) : 0;
      mark.style.setProperty('--light-x', x.toFixed(2) + 'px');
      mark.style.setProperty('--light-y', y.toFixed(2) + 'px');
    }));
  }
  function schedulePointer() { if (!pointerFrame) pointerFrame = requestAnimationFrame(updatePointer); }
  function stopPointer() {
    pointer = null;
    zones.forEach(zone => zone.querySelectorAll('.text-marker').forEach(mark => {
      mark.style.removeProperty('--light-x'); mark.style.removeProperty('--light-y');
    }));
  }
  window.addEventListener('hr-calm-variant-change', event => {
    effect = event.detail.effect;
    stopPointer();
    refresh();
    replay();
  });
  window.addEventListener('hr-calm-replay', replay);
  // Palette changes recolour the stable decoration without replaying it.
  window.addEventListener('hr-calm-palette-change', refresh);
  window.addEventListener('hr-calm-motion-change', () => { stopPointer(); schedule(); });
  document.addEventListener('pointermove', event => {
    if (effect !== 'licht' || !motionAllowed() || !fine.matches || event.pointerType !== 'mouse') return;
    if (event.target.closest('.reading-lab-controls, .site-header, .site-footer')) return;
    pointer = {x:event.clientX, y:event.clientY};
    schedulePointer();
  }, {passive:true});
  document.addEventListener('pointerleave', stopPointer, {passive:true});
  window.addEventListener('scroll', schedule, {passive:true});
  window.addEventListener('resize', schedule, {passive:true});
  window.addEventListener('hashchange', refresh);
  window.addEventListener('load', refresh);
  document.querySelectorAll('details').forEach(detail => detail.addEventListener('toggle', refresh));
  new MutationObserver(refresh).observe(document.getElementById('case-body'), {childList:true});
  new MutationObserver(schedule).observe(root, {attributes:true, attributeFilter:['data-colour']});
  reduced.addEventListener('change', () => {stopPointer(); schedule();});
  fine.addEventListener('change', stopPointer);
  document.addEventListener('visibilitychange', () => {
    suspended = document.hidden;
    if (!suspended) schedule();
  });
  refresh();
})();
