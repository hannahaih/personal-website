(() => {
  'use strict';
  // Language is chosen explicitly through links, without browser storage.
  const links = [...document.querySelectorAll('[data-language-switch]')];
  const destinations = links.map(link => new URL(link.getAttribute('href'), location.href));
  function update() {
    links.forEach((link, index) => {
      const destination = new URL(destinations[index]);
      destination.hash = location.hash;
      link.href = destination.href;
    });
  }
  window.addEventListener('hashchange', update);
  update();
})();
