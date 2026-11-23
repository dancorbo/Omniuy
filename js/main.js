/* =====================================================================
   OMNIUY · LÓGICA DE LA PÁGINA
   Arma las secciones con los datos de config.js y maneja las animaciones.
   No hace falta tocar este archivo para cambiar textos: usá config.js.
   ===================================================================== */
(function () {
  'use strict';

  var C = window.OMNIUY;
  var reducirMovimiento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Íconos y plantillas de las listas: en js/plantillas.js (las usa también herramientas/armar-html.mjs)
  var P = window.TEARRIMO_PLANTILLAS;
  var icono = P.icono;
  var esc = P.esc;

  function $(sel, raiz) { return (raiz || document).querySelector(sel); }
  function $$(sel, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(sel)); }

  function leer(objeto, ruta) {
    return ruta.split('.').reduce(function (o, k) { return o == null ? undefined : o[k]; }, objeto);
  }

  // Las listas ya vienen escritas en index.html (herramientas/armar-html.mjs, para Google). Si alguna está vacía
  // (porque no se corrió el script después de agregarla), se dibuja acá con la misma plantilla
  function pintarListas() {
    P.LISTAS.forEach(function (lista) {
      var contenedor = document.getElementById(lista.id);
      if (!contenedor || contenedor.querySelector('.revelar, .beneficio, .precio')) return;
      contenedor.insertAdjacentHTML('beforeend', P.htmlDeLista(lista, C));
    });
  }

  /* ---------- Fechas y versión ---------- */
  function fechaLarga(valor) {
    if (!valor) return '';
    var fecha = /^\d{4}-\d{2}-\d{2}$/.test(valor) ? new Date(valor + 'T12:00:00') : new Date(valor);
    if (isNaN(fecha)) return valor; // Si la escribiste a mano, se muestra tal cual
    try {
      return fecha.toLocaleDateString('es-UY', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
      return valor;
    }
  }

  function pintarVersion(numero, fecha, bytes) {
    var etiqueta = (C.version && C.version.etiqueta) || '';
    $$('[data-version]').forEach(function (el) {
      el.textContent = (etiqueta ? etiqueta + ' ' : '') + numero;
    });
    var partes = ['v' + numero, fechaLarga(fecha)];
    if (bytes) partes.push((bytes / 1048576).toFixed(1).replace('.', ',') + ' MB');
    $$('[data-version-linea]').forEach(function (el) {
      el.textContent = partes.filter(Boolean).join(' · ');
    });
  }

  /* Lee la versión del último Release de GitHub (si falla, quedan los datos de config.js) */
  function leerReleaseDeGitHub() {
    if (!C.version || !C.version.leerDeGitHub || !C.repo || !window.fetch) return;
    fetch('https://api.github.com/repos/' + C.repo + '/releases/latest', {
      headers: { Accept: 'application/vnd.github+json' }
    })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (release) {
        if (!release || !release.tag_name) return;
        var archivo = (C.descarga && C.descarga.archivo) || 'omniuy.apk';
        var apk = (release.assets || []).filter(function (a) { return a.name === archivo; })[0];
        if (!apk) return; // El Release no tiene el APK: no mostramos datos engañosos
        pintarVersion(release.tag_name.replace(/^v/i, ''), release.published_at, apk.size);
      })
      .catch(function () { /* sin conexión o límite de GitHub: no pasa nada */ });
  }

  /* ---------- Aviso emergente ---------- */
  var temporizadorToast;
  function mostrarToast(mensaje) {
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = mensaje;
    toast.hidden = false;
    void toast.offsetWidth; // fuerza el reflujo para que se vea la transición
    toast.classList.add('visible');
    clearTimeout(temporizadorToast);
    temporizadorToast = setTimeout(function () {
      toast.classList.remove('visible');
      setTimeout(function () { toast.hidden = true; }, 300);
    }, 3500);
  }

  /* ---------- Armado de la página con config.js ---------- */
  function armarPagina() {
    var T = C.textos || {};

    // Textos sueltos
    $$('[data-t]').forEach(function (el) {
      var valor = leer(T, el.getAttribute('data-t'));
      if (valor != null && valor !== '') el.textContent = valor;
    });

    // Logo
    if (C.logo) $$('[data-logo]').forEach(function (img) { img.src = C.logo; });

    // Botones de descarga (o bloqueados, si las descargas están pausadas)
    var descarga = C.descarga || {};
    var descargaActiva = descarga.habilitada !== false;
    var avisoPausa = descarga.avisoPausa || 'Las descargas están pausadas por un momento.';
    var enlacePlay = C.googlePlay && C.googlePlay.disponible && C.googlePlay.enlace;
    $$('[data-apk]').forEach(function (a) {
      if (descargaActiva) {
        a.hidden = false; // En index.html vienen escondidos (hoy se baja de Google Play)
        if (descarga.enlaceApk) a.href = descarga.enlaceApk;
        return;
      }
      // El botón de la barra superior lleva a Google Play en lugar del APK
      if (enlacePlay && a.closest('.barra')) {
        a.hidden = false;
        a.href = enlacePlay;
        a.target = '_blank';
        a.rel = 'noopener';
        return;
      }
      // Descargas en pausa: sin botones de APK ni explicación de cómo instalarlo (queda Google Play)
      a.hidden = true;
      a.removeAttribute('href');
      a.setAttribute('role', 'button');
      a.setAttribute('tabindex', '0');
      a.setAttribute('aria-disabled', 'true');
      a.classList.add('btn--pausado');
      a.addEventListener('click', function (e) {
        e.preventDefault();
        mostrarToast(avisoPausa);
      });
      a.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); mostrarToast(avisoPausa); }
      });
    });

    // Lo que solo sirve con el APK (cómo instalarlo) viene escondido en index.html: se muestra solo si hay descarga
    $$('[data-solo-apk]').forEach(function (el) { el.hidden = !descargaActiva; });

    var requisitos = C.descarga && C.descarga.requisitos;
    if (requisitos) $$('[data-requisitos]').forEach(function (el) { el.textContent = ' · ' + requisitos; });

    // Versión
    if (C.version) pintarVersion(C.version.numero, C.version.fecha);
    if (descargaActiva) {
      leerReleaseDeGitHub();
    } else {
      // Sin el APK: si ya está en Google Play, eso; si no, que las descargas están en pausa
      var enPlay = C.googlePlay && C.googlePlay.disponible && C.googlePlay.enlace;
      $$('[data-version-linea]').forEach(function (el) { el.textContent = enPlay ? 'Gratis en Google Play' : 'Descargas pausadas'; });
    }

    // Google Play
    var play = C.googlePlay || {};
    var enTienda = play.disponible && play.enlace;
    $$('[data-play-badge]').forEach(function (badge) {
      badge.href = enTienda ? play.enlace : '#';
      badge.hidden = !enTienda;
    });
    $$('[data-play]').forEach(function (boton) {
      boton.hidden = !!enTienda; // En la tienda se usa el badge oficial (en index.html viene escondido)
      if (!enTienda) {
        boton.addEventListener('click', function (e) {
          e.preventDefault();
          mostrarToast(play.aviso || 'Próximamente en Google Play.');
        });
      }
    });

    // Contacto y créditos del pie
    $$('[data-emails]').forEach(function (lista) { lista.innerHTML = P.htmlDeEmails(C); });
    $$('[data-creditos]').forEach(function (el) { el.innerHTML = P.htmlDeCreditos(C); });

    // Funciones, un viaje, capturas, instalación, Premium, precios, se viene, novedades y preguntas
    pintarListas();

    // Capturas: se ven recién cuando cargó la imagen (si falla, queda el recuadro de reemplazo)
    $$('#lista-capturas img').forEach(function (img) {
      function listo() { img.classList.add('cargada'); }
      if (img.complete && img.naturalWidth) listo();
      img.addEventListener('load', listo);
      img.addEventListener('error', function () { img.remove(); });
    });

    // Captura dentro del celular de la portada
    var portada = $('[data-captura-portada]');
    if (portada && C.capturaPortada) {
      portada.addEventListener('load', function () {
        portada.hidden = false;
        var mapa = $('[data-mapa]');
        if (mapa) mapa.remove();
      });
      portada.src = C.capturaPortada;
    }

    // Se viene (la próxima versión): sin items, la sección no se muestra; sin aviso, no aparece arriba
    var seViene = T.seViene || {};
    if (!Array.isArray(seViene.items) || !seViene.items.length) {
      var seccionSeViene = document.getElementById('se-viene');
      if (seccionSeViene) seccionSeViene.hidden = true;
    }
    if (!seViene.aviso) $$('[data-aviso-se-viene]').forEach(function (el) { el.hidden = true; });
  }

  /* ---------- Flechas del carrusel (computadoras con mouse) ---------- */
  function carruselConFlechas() {
    var carrusel = document.getElementById('lista-capturas');
    var flechas = $('[data-flechas]');
    var conMouse = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!carrusel || !flechas || !conMouse) return;

    var intro = $('[data-capturas-intro]');
    var textoEscritorio = C && C.textos && C.textos.capturas && C.textos.capturas.introEscritorio;
    var botones = $$('[data-desplazar]', flechas);

    function paso() {
      var tarjeta = $('.captura', carrusel);
      var ancho = tarjeta ? tarjeta.getBoundingClientRect().width + 16 : 256;
      // Avanza de a varias capturas, sin pasarse de lo que se ve
      return Math.max(ancho, Math.floor(carrusel.clientWidth / ancho) * ancho);
    }

    function actualizar() {
      var maximo = carrusel.scrollWidth - carrusel.clientWidth;
      var hayMas = maximo > 4;
      flechas.hidden = !hayMas;
      if (intro && textoEscritorio) intro.textContent = hayMas ? textoEscritorio : '';
      botones.forEach(function (b) {
        b.disabled = Number(b.getAttribute('data-desplazar')) < 0
          ? carrusel.scrollLeft <= 4
          : carrusel.scrollLeft >= maximo - 4;
      });
    }

    botones.forEach(function (b) {
      b.addEventListener('click', function () {
        carrusel.scrollBy({
          left: Number(b.getAttribute('data-desplazar')) * paso(),
          behavior: reducirMovimiento ? 'auto' : 'smooth'
        });
      });
    });
    carrusel.addEventListener('scroll', function () { window.requestAnimationFrame(actualizar); }, { passive: true });
    window.addEventListener('resize', actualizar);
    actualizar();
  }

  /* ---------- Flechas de las tarjetas deslizables (como las del carrusel) ----------
     Cada grupo de flechas [data-flechas-de="id"] mueve la lista con ese id. Solo con mouse y si hay más para ver
     (con la ventana ancha las tarjetas están en grilla y no hay nada que deslizar: las flechas no aparecen). */
  function deslizablesConFlechas() {
    var conMouse = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!conMouse) return;
    $$('[data-flechas-de]').forEach(function (flechas) {
      var lista = document.getElementById(flechas.getAttribute('data-flechas-de'));
      if (!lista) return;
      var botones = $$('[data-desplazar]', flechas);

      function paso() {
        var tarjeta = lista.firstElementChild;
        var ancho = tarjeta ? tarjeta.getBoundingClientRect().width + 14 : 300;
        return Math.max(ancho, Math.floor(lista.clientWidth / ancho) * ancho);
      }

      function actualizar() {
        var maximo = lista.scrollWidth - lista.clientWidth;
        flechas.hidden = !(maximo > 4);
        botones.forEach(function (b) {
          b.disabled = Number(b.getAttribute('data-desplazar')) < 0
            ? lista.scrollLeft <= 4
            : lista.scrollLeft >= maximo - 4;
        });
      }

      botones.forEach(function (b) {
        b.addEventListener('click', function () {
          lista.scrollBy({
            left: Number(b.getAttribute('data-desplazar')) * paso(),
            behavior: reducirMovimiento ? 'auto' : 'smooth'
          });
        });
      });
      lista.addEventListener('scroll', function () { window.requestAnimationFrame(actualizar); }, { passive: true });
      window.addEventListener('resize', actualizar);
      actualizar();
    });
  }

  /* ---------- Íconos en el HTML ---------- */
  function pintarIconos() {
    $$('[data-icono]').forEach(function (el) {
      el.innerHTML = icono(el.getAttribute('data-icono'));
    });
  }

  /* ---------- Animaciones al hacer scroll ---------- */
  function animarAlAparecer() {
    var elementos = $$('.revelar');
    if (reducirMovimiento || !('IntersectionObserver' in window)) {
      elementos.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('visible');
          observador.unobserve(entrada.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    elementos.forEach(function (el) { observador.observe(el); });
  }

  /* Barra superior con fondo + línea de tiempo que se va llenando */
  function seguirScroll() {
    var barra = document.getElementById('barra');
    var linea = document.getElementById('lista-viaje');
    var progreso = linea && $('.linea__progreso', linea);
    var pasos = linea ? $$('.paso', linea) : [];
    var pendiente = false;

    function actualizar() {
      pendiente = false;
      if (barra) barra.classList.toggle('con-fondo', window.scrollY > 24);
      if (!linea || !progreso) return;
      var caja = linea.getBoundingClientRect();
      var guia = window.innerHeight * 0.6;
      var largo = Math.max(caja.height - 50, 0);
      var avance = Math.min(Math.max(guia - caja.top - 10, 0), largo);
      progreso.style.height = avance + 'px';
      pasos.forEach(function (paso) {
        paso.classList.toggle('activo', paso.getBoundingClientRect().top + 27 < guia);
      });
    }

    function alMover() {
      if (!pendiente) {
        pendiente = true;
        window.requestAnimationFrame(actualizar);
      }
    }
    window.addEventListener('scroll', alMover, { passive: true });
    window.addEventListener('resize', alMover);
    actualizar();
  }

  /* ---------- Arranque ---------- */
  pintarIconos();
  if (C) {
    try {
      armarPagina();
    } catch (e) {
      console.error('TeArrimo: error al armar la página', e);
    }
  } else {
    var aviso = document.createElement('div');
    aviso.className = 'error-config';
    aviso.textContent = 'Hay un error en config.js (revisá comillas y comas).';
    document.body.appendChild(aviso);
  }
  animarAlAparecer();
  seguirScroll();
  carruselConFlechas();
  deslizablesConFlechas();

  // Detiene el ómnibus del mapa si el celular pide reducir movimiento
  var mapa = $('[data-mapa]');
  if (mapa && reducirMovimiento && mapa.pauseAnimations) mapa.pauseAnimations();

  $$('[data-anio]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
