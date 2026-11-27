/* =====================================================================
   Botón sol/luna: cambia entre modo claro y oscuro y se acuerda.
   Por defecto la web sigue el modo del celular (prefers-color-scheme). Al tocar el botón se pasa al otro modo, se
   guarda en este navegador (localStorage "tema": "light" o "dark") y el script cortito del <head> lo pone antes de
   dibujar la próxima página. Si el navegador no deja guardar (ventana privada), igual cambia durante la visita.
   ===================================================================== */
(function () {
  var raiz = document.documentElement;
  var celularOscuro = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  // El modo que se ve ahora: el elegido, o el del celular
  function oscuroAhora() {
    var elegido = raiz.getAttribute('data-theme');
    if (elegido === 'dark' || elegido === 'light') return elegido === 'dark';
    return !!(celularOscuro && celularOscuro.matches);
  }

  function actualizar() {
    var oscuro = oscuroAhora();
    var botones = document.querySelectorAll('[data-tema]');
    for (var i = 0; i < botones.length; i++) {
      botones[i].setAttribute('aria-label', oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    }
    // La barra del navegador del celular, del mismo color que la página
    var color = document.querySelector('meta[name="theme-color"]');
    if (color) color.setAttribute('content', oscuro ? '#0A0A0A' : '#F6F7F6');
  }

  function cambiar() {
    var nuevo = oscuroAhora() ? 'light' : 'dark';
    raiz.setAttribute('data-theme', nuevo);
    try { localStorage.setItem('tema', nuevo); } catch (e) { /* sin guardar: vale para esta visita */ }
    actualizar();
  }

  var botones = document.querySelectorAll('[data-tema]');
  for (var i = 0; i < botones.length; i++) botones[i].addEventListener('click', cambiar);
  // Si no se eligió nada y el celular cambia de modo (por ejemplo, de noche), el botón dice lo correcto
  if (celularOscuro && celularOscuro.addEventListener) celularOscuro.addEventListener('change', actualizar);
  actualizar();
})();
