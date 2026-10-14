(() => {
  'use strict';

  const variants = {
    testen: 'marker',
    marker: 'marker',
    maus: 'maus',
    leise: 'leise',
    neu: 'wolken',
    wolken: 'wolken',
    tinte: 'tinte',
    fokus: 'fokus',
    runde3: 'atem',
    atem: 'atem',
    horizont: 'horizont',
    randlicht: 'randlicht'
  };
  const labels = {
    marker: 'Textmarker',
    maus: 'Mausfarben',
    leise: 'Leise Akzente',
    wolken: 'Farbwolken',
    tinte: 'Farbtinte',
    fokus: 'Lesefokus',
    atem: 'Atemwolken',
    horizont: 'Lesehorizont',
    randlicht: 'Randlicht'
  };
  const descriptions = {
    wolken: 'Beim Scrollen sichtbar. Alle Farbwolken folgen sanft der Maus — in jede Richtung, auch ohne direkten Hover.',
    tinte: 'Die Schlüsselpassagen sind dauerhaft in farbiger Tinte gesetzt. Ohne Bewegung.',
    fokus: 'Lesefläche und Schlüsselpassagen tragen dieselbe Farbe. Beim Wechsel klingt der vorige Fokus sanft aus.',
    atem: 'Klare Schrift auf ruhigem Grund. Farblicht atmet außen herum — sichtbar auch beim Scrollen.',
    horizont: 'Eine matte Lesefläche folgt dem Scrollen. Nur ihr äußerer Lichtsaum atmet sanft.',
    randlicht: 'Kräftige Farbsäume unter den Schlüsselpassagen. Eine ruhige Lesespur folgt dem Scrollen.'
  };
  const url = new URL(window.location.href);
  const requested = url.searchParams.get('farbspiel');
  if (!Object.prototype.hasOwnProperty.call(variants, requested)) return;

  const root = document.documentElement;
  root.dataset.colourPreview = 'on';
  root.dataset.effect = variants[requested];

  const ambientEffects = new Set(['atem', 'horizont', 'randlicht']);
  const isNew = ambientEffects.has(variants[requested]) || ['wolken', 'tinte', 'fokus'].includes(variants[requested]);
  const options = isNew ? ['wolken', 'fokus'] : ['marker', 'maus', 'leise'];
  const additional = ['atem', 'horizont', 'randlicht'];
  if (isNew) {
    root.dataset.ambientMotion = 'running';
    root.dataset.colourOptionsExpanded = 'true';
  }
  const choiceButton = effect => `<button type="button" data-effect-choice="${effect}">${labels[effect]}</button>`;
  const panel = document.createElement('aside');
  panel.className = 'colour-preview' + (isNew ? ' colour-preview-new colour-preview-chooser' : '');
  panel.setAttribute('aria-label', 'Farbspiel ausprobieren');
  panel.setAttribute('data-ink-guard', '');
  panel.innerHTML = `<strong class="colour-preview-label" id="colour-preview-label">${isNew ? 'Farbspiel vergleichen' : 'Farbspiel ausprobieren'}</strong>
    <div class="colour-preview-options" role="group" aria-labelledby="colour-preview-label">
      ${options.map(choiceButton).join('')}
    </div>
    ${isNew ? `<details class="colour-preview-more" open>
      <summary>Weitere Varianten (3)</summary>
      <div class="colour-preview-options colour-preview-additional" role="group" aria-label="Weitere Farbspiel-Varianten">${additional.map(choiceButton).join('')}</div>
    </details>
    <button type="button" class="colour-preview-reset" aria-label="Farbflächen zurücksetzen" title="Farbflächen zurücksetzen"><span aria-hidden="true">↺</span></button>
    <button type="button" class="colour-preview-pause" aria-label="Bewegung pausieren" title="Bewegung pausieren" aria-pressed="false" hidden><span aria-hidden="true">Ⅱ</span></button>` : ''}
    <button type="button" class="colour-preview-close" aria-label="Vorschau schließen" title="Vorschau schließen"><span aria-hidden="true">×</span></button>
    ${isNew ? '<p class="colour-preview-description"></p>' : ''}
    <span class="colour-preview-status" aria-live="polite"></span>`;
  document.body.appendChild(panel);

  const choices = [...panel.querySelectorAll('[data-effect-choice]')];
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function syncInstructions() {
    if (!isNew) return;
    const effect = root.dataset.effect;
    const ambient = ambientEffects.has(effect);
    panel.querySelector('.colour-preview-reset').hidden = ambient;
    panel.querySelector('.colour-preview-pause').hidden = !ambient;
    if (ambient) {
      panel.querySelector('.colour-preview-description').textContent = descriptions[effect];
      const button = panel.querySelector('.colour-preview-pause');
      const staticMotion = !fine.matches || reduced.matches || typeof CSS === 'undefined' || typeof CSS.registerProperty !== 'function';
      const paused = root.dataset.ambientMotion === 'paused';
      const label = staticMotion ? 'Bewegung ist deaktiviert' : paused ? 'Bewegung fortsetzen' : 'Bewegung pausieren';
      button.disabled = staticMotion;
      button.setAttribute('aria-label', label);
      button.title = label;
      button.setAttribute('aria-pressed', String(paused || staticMotion));
      button.querySelector('span').textContent = paused || staticMotion ? '▷' : 'Ⅱ';
      return;
    }
    const staticClouds = effect === 'wolken' && (!fine.matches || reduced.matches);
    panel.querySelector('.colour-preview-description').textContent = staticClouds
      ? 'Die Farbwolken sind ohne Mausbewegung dauerhaft sichtbar.' : descriptions[effect];
    panel.querySelector('.colour-preview-reset').disabled = effect === 'tinte' || staticClouds;
  }
  function select(effect, announce = false) {
    root.dataset.effect = effect;
    choices.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.effectChoice === effect)));
    syncInstructions();
    if (announce) {
      const next = new URL(window.location.href);
      next.searchParams.set('farbspiel', effect);
      window.history.replaceState(window.history.state, '', next);
      panel.querySelector('.colour-preview-status').textContent = labels[effect] + ' ausgewählt.';
    }
    window.dispatchEvent(new CustomEvent('hr-colour-preview-change', { detail: { effect } }));
  }
  choices.forEach(button => button.addEventListener('click', () => select(button.dataset.effectChoice, true)));
  panel.querySelector('.colour-preview-more')?.addEventListener('toggle', () => {
    root.dataset.colourOptionsExpanded = String(panel.querySelector('.colour-preview-more').open);
    window.dispatchEvent(new Event('hr-colour-preview-layout'));
  });
  fine.addEventListener('change', syncInstructions);
  reduced.addEventListener('change', syncInstructions);
  panel.querySelector('.colour-preview-reset')?.addEventListener('click', () => {
    window.dispatchEvent(new Event('hr-reading-colour-reset'));
    panel.querySelector('.colour-preview-status').textContent = 'Farbflächen zurückgesetzt.';
  });
  panel.querySelector('.colour-preview-pause')?.addEventListener('click', () => {
    root.dataset.ambientMotion = root.dataset.ambientMotion === 'paused' ? 'running' : 'paused';
    syncInstructions();
    panel.querySelector('.colour-preview-status').textContent = root.dataset.ambientMotion === 'paused'
      ? 'Bewegung pausiert. Hervorhebungen bleiben sichtbar.' : 'Bewegung fortgesetzt.';
  });
  panel.querySelector('.colour-preview-close').addEventListener('click', () => {
    const next = new URL(window.location.href);
    next.searchParams.delete('farbspiel');
    window.location.assign(next.href);
  });
  select(variants[requested]);
})();
