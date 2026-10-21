(() => {
  'use strict';
  const variants = {schrift:'script',netz:'network',fluss:'flow'};
  const requested = new URL(location.href).searchParams.get('zeichen');
  const variant = Object.prototype.hasOwnProperty.call(variants,requested) ? variants[requested] : variants.fluss;
  const suffix = document.documentElement.lang === 'en' ? '-en' : '';
  const base = new URL('.', document.currentScript.src);
  document.querySelector('link[rel="icon"]')?.setAttribute('href',new URL(`assets/monogram-${variant}-icon${suffix}.svg?v=5`,base).href);
  document.querySelectorAll('[data-monogram]').forEach(image=>image.setAttribute('src',new URL(`assets/monogram-${variant}-brand${suffix}.svg?v=5`,base).href));
})();
