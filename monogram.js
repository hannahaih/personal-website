(() => {
  'use strict';
  const variants = {schrift:'script',netz:'network',fluss:'flow'};
  const requested = new URL(location.href).searchParams.get('zeichen');
  const variant = Object.prototype.hasOwnProperty.call(variants,requested) ? variants[requested] : variants.fluss;
  document.querySelector('link[rel="icon"]')?.setAttribute('href',`assets/monogram-${variant}-icon.svg?v=2`);
  document.querySelectorAll('[data-monogram]').forEach(image=>image.setAttribute('src',`assets/monogram-${variant}-brand.svg?v=2`));
})();
