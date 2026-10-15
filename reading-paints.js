/* Original, self-contained SVG underlays shared by the portfolio and local study. */
(() => {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const effects = ['verlauf', 'klecks', 'schichten', 'pigment', 'farbsaum'];
  let serial = 0;

  function node(name, attributes, parent) {
    const element = document.createElementNS(NS, name);
    Object.entries(attributes || {}).forEach(([key, value]) => {
      element.setAttribute(key, String(value));
    });
    if (parent) parent.append(element);
    return element;
  }

  function paint(parent, d, fill = 'var(--calm-paper)', opacity = 1, extra = {}) {
    return node('path', {
      d,
      opacity,
      style: `fill:${fill};stroke:none;stroke-dasharray:none;stroke-dashoffset:0;transition:none;vector-effect:none`,
      ...extra
    }, parent);
  }

  function line(parent, d, colour, width, opacity = 1) {
    return node('path', {
      d,
      opacity,
      style: `fill:none;stroke:${colour};stroke-width:${width};stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-dashoffset:0;transition:none;vector-effect:none`
    }, parent);
  }

  function gradient(defs, id, stops, angle = 'horizontal') {
    const grad = node('linearGradient', {
      id,
      x1: '0%', y1: '0%',
      x2: angle === 'vertical' ? '0%' : '100%',
      y2: angle === 'vertical' ? '100%' : '20%'
    }, defs);
    stops.forEach(([offset, colour, opacity = 1]) => {
      node('stop', { offset, 'stop-opacity': opacity, style: `stop-color:${colour}` }, grad);
    });
    return `url(#${id})`;
  }

  /* Coloured sediment, not a white veil: two spatial scales create large
     uneven pools and small grains. Both are clipped to the painted footprint. */
  function texture(defs, id, seed, displacement = 1.4, density = .3, grain = .2) {
    const filter = node('filter', {
      id, x: '-4%', y: '-10%', width: '108%', height: '120%',
      'color-interpolation-filters': 'sRGB'
    }, defs);
    node('feTurbulence', {
      type: 'fractalNoise', baseFrequency: '.075 .30', numOctaves: 3,
      seed, stitchTiles: 'stitch', result: 'edge-noise'
    }, filter);
    node('feDisplacementMap', {
      in: 'SourceGraphic', in2: 'edge-noise', scale: displacement,
      xChannelSelector: 'R', yChannelSelector: 'G', result: 'paint-edge'
    }, filter);
    node('feTurbulence', {
      type: 'fractalNoise', baseFrequency: '.075 .19', numOctaves: 3,
      seed: seed + 7, stitchTiles: 'stitch', result: 'pool-noise'
    }, filter);
    node('feColorMatrix', {
      in: 'pool-noise', type: 'matrix',
      values: '0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  2.7 0 0 0 -0.85',
      result: 'pool-mask'
    }, filter);
    node('feFlood', {
      style: 'flood-color:var(--paint-pigment, var(--calm-accent))',
      'flood-opacity': density, result: 'pool-colour'
    }, filter);
    node('feComposite', { in: 'pool-colour', in2: 'pool-mask', operator: 'in', result: 'pigment-pools' }, filter);
    node('feComposite', { in: 'pigment-pools', in2: 'paint-edge', operator: 'in', result: 'bounded-pools' }, filter);
    node('feTurbulence', {
      type: 'fractalNoise', baseFrequency: '.62 .83', numOctaves: 2,
      seed: seed + 19, stitchTiles: 'stitch', result: 'grain-noise'
    }, filter);
    node('feColorMatrix', {
      in: 'grain-noise', type: 'matrix',
      values: '0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  4 0 0 0 -1.7',
      result: 'grain-mask'
    }, filter);
    node('feFlood', {
      style: 'flood-color:var(--paint-pigment, var(--calm-accent))',
      'flood-opacity': grain, result: 'grain-colour'
    }, filter);
    node('feComposite', { in: 'grain-colour', in2: 'grain-mask', operator: 'in', result: 'pigment-grain' }, filter);
    node('feComposite', { in: 'pigment-grain', in2: 'paint-edge', operator: 'in', result: 'bounded-grain' }, filter);
    const merge = node('feMerge', {}, filter);
    ['paint-edge', 'bounded-pools', 'bounded-grain'].forEach(input => node('feMergeNode', { in: input }, merge));
    return `url(#${id})`;
  }

  function clippedGroup(svg, defs, id, silhouette, filter) {
    const clip = node('clipPath', { id }, defs);
    paint(clip, silhouette, '#fff');
    return node('g', { 'clip-path': `url(#${id})`, filter }, svg);
  }

  /* These cutouts live in the edge bands, away from the letters. The resulting
     long, narrow grooves distinguish a dry brush from a watercolour wash. */
  function dryMask(defs, id, variant = 0) {
    const mask = node('mask', { id, maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: 120, height: 32 }, defs);
    node('rect', { x: 0, y: 0, width: 120, height: 32, fill: '#fff' }, mask);
    const strokes = variant ? [
      ['M2 6.1 L28 5.2 M5 7.7 L19 7.3 M90 6.8 L120 8.1', .8],
      ['M2 22.7 L24 24.5 M7 26.8 L41 27.8 M88 26 L120 24.3', .8],
      ['M100 4.9 L118 5.5 M103 21.8 L120 22.6 M2 29.5 L18 28.8', .55]
    ] : [
      ['M0 7.4 L26 6 M4 9.2 L19 8 M87 6 L120 7.5', .85],
      ['M0 23 L25 25 M5 26.6 L36 25.5 M90 26.9 L120 24.8', .85],
      ['M0 11 L12 10.4 M106 9.4 L120 10 M104 23.1 L120 21.8', .65]
    ];
    strokes.forEach(([d, width]) => line(mask, d, '#000', width));
    return `url(#${id})`;
  }

  /* A word keeps its own stroke when the comparison is changed or a case
     study is reopened. The serial number is only for unique SVG definitions. */
  function strokeSeed(key) {
    let hash = 2166136261;
    for (const character of String(key ?? 'verlauf')) {
      hash = Math.imul(hash ^ character.codePointAt(0), 16777619);
    }
    hash ^= hash >>> 16;
    hash = Math.imul(hash, 0x7feb352d);
    hash ^= hash >>> 15;
    return hash >>> 0;
  }

  function strokeRandom(seed) {
    let value = seed || 1;
    return () => {
      value ^= value << 13;
      value ^= value >>> 17;
      value ^= value << 5;
      return (value >>> 0) / 4294967296;
    };
  }

  /* Curated profiles keep the whole word painted while making the hand
     movement recognisably different: rising, falling, bowed or broad/flat.
     The centre remains light; the darker bristles live outside the letters. */
  const strokeFamilies = [
    { top: [5, 3, 5, 3, 5, 4, 6], bottom: [27, 29, 26, 29, 27, 28, 25], left: [2, 6, 1, 5], right: [119, 114, 118, 112], direction: [0, 5, 100, 25] },
    { top: [7, 5, 2, 1, 3, 5, 7], bottom: [28, 27, 25, 26, 27, 29, 27], left: [3, 1, 6, 2], right: [116, 119, 113, 118], direction: [100, 15, 0, 85] },
    { top: [7, 6, 5, 4, 3, 2, 3], bottom: [30, 28, 28, 27, 26, 25, 24], left: [1, 5, 2, 6], right: [117, 112, 119, 115], direction: [0, 85, 100, 0] },
    { top: [3, 2, 3, 4, 5, 6, 7], bottom: [25, 26, 27, 29, 28, 30, 28], left: [6, 2, 5, 1], right: [118, 115, 119, 111], direction: [100, 100, 0, 0] },
    { top: [5, 2, 6, 3, 1, 6, 4], bottom: [29, 26, 30, 27, 29, 25, 28], left: [2, 1, 5, 3], right: [119, 112, 116, 119], direction: [5, 0, 95, 100] },
    { top: [4, 4, 3, 5, 4, 3, 4], bottom: [28, 28, 27, 29, 28, 27, 28], left: [1, 2, 1, 4], right: [116, 118, 117, 115], direction: [100, 0, 0, 35] },
    { top: [2, 3, 5, 6, 4, 2, 3], bottom: [30, 29, 27, 26, 28, 30, 29], left: [5, 1, 3, 1], right: [119, 116, 112, 118], direction: [0, 35, 100, 100] },
    { top: [6, 4, 1, 4, 2, 5, 6], bottom: [26, 29, 28, 30, 27, 28, 26], left: [3, 6, 1, 2], right: [117, 113, 119, 114], direction: [85, 100, 15, 0] }
  ];

  function variedDryMask(defs, id, random) {
    const mask = node('mask', { id, maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: 120, height: 32 }, defs);
    node('rect', { x: 0, y: 0, width: 120, height: 32, fill: '#fff' }, mask);
    const count = 2 + Math.floor(random() * 3);
    for (let index = 0; index < count; index += 1) {
      const upper = index % 2 === 0;
      const right = random() > .5;
      const edge = right ? 120 : 0;
      const end = right ? 82 + random() * 18 : 19 + random() * 25;
      const y = upper ? 5 + random() * 3 : 25 + random() * 3;
      const shift = (random() - .5) * 2.5;
      line(mask, `M${edge} ${y.toFixed(2)} Q${((edge + end) / 2).toFixed(2)} ${(y + shift).toFixed(2)} ${end.toFixed(2)} ${(y + shift * .5).toFixed(2)}`, '#000', .65 + random() * .7);
    }
    return `url(#${id})`;
  }

  function create(effect, stableKey) {
    if (!effects.includes(effect)) return null;
    const prefix = `hr-reading-paint-${++serial}`;
    const svg = node('svg', {
      class: `calm-drawing calm-paint calm-paint-${effect}`,
      'data-paint-effect': effect,
      viewBox: '0 0 120 32', preserveAspectRatio: 'none',
      'aria-hidden': 'true', focusable: 'false'
    });
    const defs = node('defs', {}, svg);
    const pale = 'var(--calm-paper)';
    const pigment = 'var(--paint-pigment, var(--calm-accent))';
    const companion = 'var(--paint-companion, var(--calm-paper))';
    const textureId = `${prefix}-texture`;

    if (effect === 'verlauf') {
      const seed = strokeSeed(stableKey);
      const variant = seed % strokeFamilies.length;
      const family = strokeFamilies[variant];
      const random = strokeRandom(seed);
      svg.setAttribute('data-paint-variant', variant + 1);
      svg.setAttribute('data-paint-seed', seed);
      const xs = [4, 20, 38, 57, 77, 97, 114];
      const top = family.top.map(value => +(value + (random() - .5) * 1.1).toFixed(2));
      const bottom = family.bottom.map(value => +(value + (random() - .5) * 1.1).toFixed(2));
      const points = (ys, reverse = false) => {
        const values = xs.map((x, index) => `${x} ${ys[index]}`);
        return (reverse ? values.reverse() : values).join(' L');
      };
      const [r1, r2, r3, r4] = family.right;
      const [l1, l2, l3, l4] = family.left;
      const silhouette = `M${points(top)} L${r1} 9 L${r2} 12 L${r3} 15 L${r4} 19 L118 22 L${points(bottom, true)} L${l4} 24 L${l3} 20 L${l2} 16 L${l1} 12 L6 9 Z`;
      const topBand = `M${points(top)} L118 9 L${points(top.map(value => +(value + 4.2).toFixed(2)), true)} Z`;
      const bottomBand = `M${points(bottom.map(value => +(value - 4.1).toFixed(2)))} L117 25 L${points(bottom, true)} Z`;
      const leftStop = Math.round(23 + random() * 23);
      const rightStop = Math.round(61 + random() * 19);
      const wash = gradient(defs, `${prefix}-sweep`, [
        ['0%', variant % 2 ? pale : companion],
        [`${leftStop}%`, variant % 2 ? companion : pale],
        [`${rightStop}%`, variant % 2 ? pale : companion],
        ['100%', variant % 2 ? companion : pale]
      ]);
      const sweep = defs.querySelector('linearGradient');
      ['x1', 'y1', 'x2', 'y2'].forEach((name, index) => {
        sweep.setAttribute(name, `${family.direction[index]}%`);
      });
      const surface = node('g', {
        filter: texture(defs, textureId, 11 + seed % 89, .65 + random() * .55, .18 + random() * .07, .12 + random() * .07),
        mask: variedDryMask(defs, `${prefix}-dry`, random)
      }, svg);
      paint(surface, silhouette, wash);
      paint(surface, topBand, pigment, .21 + random() * .11);
      paint(surface, bottomBand, pigment, .20 + random() * .12);
      const ribbonY = 7.5 + random() * 2.3;
      const ribbonTilt = (random() - .5) * 3;
      paint(surface, `M12 ${ribbonY.toFixed(2)} Q39 ${(ribbonY + ribbonTilt).toFixed(2)} 63 ${(ribbonY + 1).toFixed(2)} T111 ${(ribbonY - ribbonTilt).toFixed(2)} L115 ${(ribbonY + 4).toFixed(2)} Q86 ${(ribbonY + 6).toFixed(2)} 62 ${(ribbonY + 3).toFixed(2)} T13 ${(ribbonY + 5).toFixed(2)} Z`, companion, .72 + random() * .12);
      paint(surface, 'M9 12 C30 10 43 14 61 12 S91 10 112 12 L111 23 C92 25 79 22 62 24 S29 23 10 24 Z', pale, .64);
      const strandCount = 3 + Math.floor(random() * 3);
      for (let index = 0; index < strandCount; index += 1) {
        const upper = index % 2 === 0;
        const right = random() > .5;
        const start = right ? 88 + random() * 13 : 1 + random() * 6;
        const end = right ? 114 + random() * 5 : 19 + random() * 23;
        const y = upper ? 4.5 + random() * 3 : 25 + random() * 3;
        const change = (random() - .5) * 2.5;
        line(surface, `M${start.toFixed(2)} ${y.toFixed(2)} Q${((start + end) / 2).toFixed(2)} ${(y + change).toFixed(2)} ${end.toFixed(2)} ${(y + change * .4).toFixed(2)}`, index === 0 ? pigment : '#fff', .55 + random() * .5, index === 0 ? .38 : .65);
      }
    }

    if (effect === 'klecks') {
      /* A blocky wet patch, not a rounded swipe: wavy top and bottom edges,
         broad blooms, and concentrated pigment at the uneven corners. */
      const silhouette = 'M5 5 C13 3 20 6 29 4 C42 2 52 5 65 3 C78 2 88 5 97 4 L110 3 L115 6 L113 10 L118 13 L116 18 L118 23 L112 28 C100 26 94 30 82 28 C71 31 62 26 51 29 C41 26 34 30 22 28 L9 30 L5 26 L3 20 L5 17 L2 12 L4 8 Z';
      const wash = gradient(defs, `${prefix}-patch`, [
        ['0%', companion], ['42%', pale], ['100%', companion]
      ], 'vertical');
      const surface = clippedGroup(svg, defs, `${prefix}-clip`, silhouette,
        texture(defs, textureId, 31, 1.9, .34, .27));
      paint(surface, silhouette, wash);
      paint(surface, 'M0 3 C16 9 23 2 40 6 C58 2 68 9 85 5 C102 8 110 2 120 5 L120 10 C104 8 92 13 75 10 C61 13 42 8 27 11 C15 7 9 13 0 10 Z', pigment, .25);
      paint(surface, 'M0 24 C15 18 25 28 41 22 C56 27 65 21 80 25 C99 20 108 25 120 20 L120 33 L0 33 Z', pigment, .27);
      paint(surface, 'M1 6 C17 3 25 10 25 18 C22 25 12 30 2 24 Z M102 6 C114 3 119 11 119 20 C111 28 100 25 100 19 C105 15 106 11 102 6 Z', pigment, .23);
      paint(surface, 'M10 10 C15 6 20 9 17 14 C11 18 13 22 21 25 C9 29 6 20 10 10 Z M92 5 C103 4 108 8 106 11 C99 9 94 13 88 11 Z', companion, .83);
      paint(surface, 'M25 11 C37 8 44 14 59 11 C77 8 88 13 103 12 L108 22 C87 25 78 21 63 25 C48 21 39 25 23 21 Z', '#fff', .19);
      line(surface, 'M5 27 C24 25 30 29 48 27 M73 29 C87 26 99 29 112 27', pigment, .7, .30);
    }

    if (effect === 'schichten') {
      /* Three identifiable passes: the exposed upper and lower ledges are
         intentionally wider than the middle pass and carry dry paint lines. */
      const surface = node('g', {
        filter: texture(defs, textureId, 43, .75, .17, .13),
        mask: dryMask(defs, `${prefix}-dry`, 1)
      }, svg);
      paint(surface, 'M10 3 L33 2 L59 4 L84 2 L106 4 L113 7 L110 12 L116 14 L102 17 L77 15 L50 17 L25 16 L9 14 Z', companion);
      paint(surface, 'M11 3 L36 2 L63 4 L86 2 L110 5 L113 8 L88 7 L64 9 L35 7 L10 9 Z', pigment, .27);
      paint(surface, 'M2 10 L21 8 L47 10 L72 7 L95 10 L113 8 L119 12 L115 20 L109 23 L79 21 L59 24 L34 22 L10 24 L2 21 Z', pale);
      paint(surface, 'M3 10 L24 8 L50 11 L73 8 L95 11 L115 9 L119 12 L113 14 L92 13 L72 11 L47 14 L23 11 L3 13 Z', pigment, .19);
      paint(surface, 'M15 20 L38 18 L57 21 L81 18 L100 20 L115 18 L112 25 L118 28 L105 30 L81 27 L58 31 L35 28 L15 30 Z', companion);
      paint(surface, 'M15 25 L36 23 L59 26 L81 23 L107 25 L118 28 L105 30 L81 27 L58 31 L35 28 L15 30 Z', pigment, .27);
      paint(surface, 'M9 14 L33 12 L55 15 L78 12 L100 14 L113 13 L112 20 L86 21 L62 19 L39 22 L11 21 Z', '#fff', .14);
      line(surface, 'M14 7 L33 6 M83 5 L110 6 M15 27 L35 26 M81 27 L109 28', '#fff', .85, .79);
      line(surface, 'M3 11 L21 10 M94 11 L118 12 M21 30 L46 28 M95 29 L116 28', pigment, .65, .43);
    }

    if (effect === 'pigment') {
      /* A rounded, tapered hand swipe with denser sediment. A broad light
         middle keeps the texture pronounced without darkening the lettering. */
      const silhouette = 'M2 16 C4 9 10 5 22 4 L42 3 L61 5 L80 3 C96 4 103 6 112 10 L118 14 L115 20 L119 23 L106 28 L87 30 L66 28 L46 31 L26 29 C13 28 6 25 3 21 Z';
      const wash = gradient(defs, `${prefix}-swipe`, [
        ['0%', companion], ['30%', pale], ['68%', pale], ['100%', companion]
      ]);
      const surface = clippedGroup(svg, defs, `${prefix}-clip`, silhouette,
        texture(defs, textureId, 57, 1.65, .36, .38));
      paint(surface, silhouette, wash);
      paint(surface, 'M1 7 C15 2 25 8 27 16 C25 23 15 27 3 23 Z', pigment, .30);
      paint(surface, 'M89 3 C104 4 116 12 121 18 L119 29 C106 30 94 27 94 21 C100 17 101 11 89 3 Z', pigment, .26);
      paint(surface, 'M17 27 C33 21 44 29 61 25 C77 29 89 22 108 26 L114 33 L17 33 Z', pigment, .24);
      paint(surface, 'M31 7 C39 3 49 10 59 6 C70 3 80 9 89 6 L95 11 C86 16 79 10 67 15 C52 11 40 16 29 11 Z', companion, .78);
      paint(surface, 'M23 12 C37 9 49 15 65 11 C82 9 91 14 101 12 L105 22 C89 25 82 21 69 25 C48 21 37 27 23 22 Z', '#fff', .21);
      line(surface, 'M11 25 C29 29 42 26 59 28 M85 28 C99 27 104 26 112 23', pigment, .9, .36);
    }

    if (effect === 'farbsaum') {
      /* Two broad angled water washes. The edge is deliberately saturated:
         overlapping rims surround a pale, completely painted reading centre. */
      const upper = 'M8 5 L25 3 L45 4 L64 2 L88 4 L109 3 L116 7 L111 11 L117 14 L112 19 L90 21 L70 18 L46 23 L23 21 L5 24 L2 19 L6 13 L3 9 Z';
      const lower = 'M4 12 L22 9 L44 11 L67 8 L85 10 L107 8 L117 12 L113 18 L118 22 L109 27 L86 29 L64 27 L47 31 L27 29 L12 31 L5 27 L2 21 Z';
      const surface = node('g', { filter: texture(defs, textureId, 71, 1.95, .27, .21) }, svg);
      paint(surface, upper, companion);
      paint(surface, lower, pale);
      paint(surface, 'M8 5 L25 3 L45 4 L64 2 L88 4 L109 3 L116 7 L111 10 L89 9 L65 7 L47 9 L26 7 L7 11 L3 9 Z', pigment, .39);
      paint(surface, 'M4 12 L22 9 L44 11 L67 8 L85 10 L107 8 L117 12 L111 16 L85 15 L66 12 L43 16 L23 13 L4 18 Z', pigment, .26);
      paint(surface, 'M5 23 L23 24 L43 22 L64 24 L85 22 L111 22 L109 27 L86 29 L64 27 L47 31 L27 29 L12 31 L5 27 Z', pigment, .38);
      paint(surface, 'M4 11 L8 12 L6 20 L11 25 L17 27 L12 31 L5 27 L2 21 Z M109 10 L117 12 L113 18 L118 22 L109 27 L106 24 L112 19 L108 15 Z', pigment, .31);
      paint(surface, 'M12 14 C34 11 44 16 61 12 C77 10 91 15 107 13 L109 22 C94 25 79 21 62 25 C45 21 29 26 12 23 Z', '#fff', .22);
      line(surface, 'M9 5 L25 3.8 L45 5 L64 3 M86 29 L108 26', pigment, .7, .45);
      line(surface, 'M18 9 L43 10 M79 26 L105 25', '#fff', .7, .54);
    }

    return svg;
  }

  window.HR_READING_PAINTS = Object.freeze({ effects: Object.freeze(effects), create });
})();
