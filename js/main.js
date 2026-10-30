/* =====================================================================
   OMNIUY · LÓGICA DE LA PÁGINA
   Arma las secciones con los datos de config.js y maneja las animaciones.
   No hace falta tocar este archivo para cambiar textos: usá config.js.
   ===================================================================== */
(function () {
  'use strict';

  var C = window.OMNIUY;
  var reducirMovimiento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Íconos (trazos de 24×24) ---------- */
  var ICONOS = {
    descargar: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
    play: '<path d="M6 3.5v17l14-8.5z"/>',
    vivo: '<circle cx="12" cy="12" r="2"/><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M4.9 4.9a10 10 0 0 0 0 14.2M19.1 4.9a10 10 0 0 1 0 14.2"/>',
    bus: '<rect x="4" y="3" width="16" height="15" rx="3"/><path d="M4 11h16M8 18v2M16 18v2"/><circle cx="8" cy="14.5" r=".8"/><circle cx="16" cy="14.5" r=".8"/>',
    campana: '<path d="M6 16v-5a6 6 0 1 1 12 0v5l2 2H4z"/><path d="M10 21a2 2 0 0 0 4 0"/>',
    ventana: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9h18"/><rect x="11" y="12" width="7" height="5" rx="1.5"/>',
    caminar: '<circle cx="13" cy="4" r="2"/><path d="M9 21l2.5-6.5L14 17v4M11.5 14.5L12.5 9l4 3.5 3 .5M12.5 9L8.5 11l-1 4"/>',
    paradas: '<path d="M6 5v14"/><circle cx="6" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="6" cy="19" r="2"/><path d="M11 5h9M11 12h9M11 19h6"/>',
    tarjeta: '<rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20M6 15h4"/>',
    vibrar: '<rect x="8" y="3" width="8" height="18" rx="2"/><path d="M4.5 8v8M19.5 8v8M1.5 10.5v3M22.5 10.5v3"/>',
    llegada: '<path d="M5 21V4M5 4h12l-2.5 4L17 12H5"/>',
    widget: '<rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/>',
    saldo: '<path d="M4 7V6a2 2 0 0 1 2-2h11v3"/><rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M21 11h-4a2 2 0 0 0 0 4h4"/>',
    sinAnuncios: '<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>',
    escudo: '<path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    correo: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 6.5L12 13l8.5-6.5"/>',
    imagen: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/>'
  };

  function icono(nombre) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (ICONOS[nombre] || ICONOS.bus) + '</svg>';
  }

  function $(sel, raiz) { return (raiz || document).querySelector(sel); }
  function $$(sel, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(sel)); }

  function esc(texto) {
    return String(texto == null ? '' : texto).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function leer(objeto, ruta) {
    return ruta.split('.').reduce(function (o, k) { return o == null ? undefined : o[k]; }, objeto);
  }

  function pintarLista(id, items, plantilla) {
    var contenedor = document.getElementById(id);
    if (!contenedor || !Array.isArray(items)) return;
    contenedor.insertAdjacentHTML('beforeend', items.map(plantilla).join(''));
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
    $$('[data-apk]').forEach(function (a) {
      if (descargaActiva) {
        if (descarga.enlaceApk) a.href = descarga.enlaceApk;
        return;
      }
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

    var requisitos = C.descarga && C.descarga.requisitos;
    if (requisitos) $$('[data-requisitos]').forEach(function (el) { el.textContent = ' · ' + requisitos; });

    // Versión
    if (C.version) pintarVersion(C.version.numero, C.version.fecha);
    if (descargaActiva) {
      leerReleaseDeGitHub();
    } else {
      $$('[data-version-linea]').forEach(function (el) { el.textContent = 'Descargas pausadas'; });
    }

    // Google Play
    var play = C.googlePlay || {};
    $$('[data-play]').forEach(function (boton) {
      if (play.disponible && play.enlace) {
        boton.href = play.enlace;
        boton.removeAttribute('aria-disabled');
        boton.removeAttribute('role');
        boton.classList.add('disponible');
        $('small', boton).textContent = 'Disponible en';
      } else {
        boton.addEventListener('click', function (e) {
          e.preventDefault();
          mostrarToast(play.aviso || 'Próximamente en Google Play.');
        });
      }
    });

    // Contacto
    var emails = (C.contacto && C.contacto.emails) || [];
    $$('[data-emails]').forEach(function (lista) {
      lista.innerHTML = emails.map(function (e) {
        return '<li><span class="pie__para">' + esc(e.para) + '</span>' +
          '<a class="pie__email" href="mailto:' + esc(e.email) + '">' +
          icono('correo') + '<span>' + esc(e.email) + '</span></a></li>';
      }).join('');
    });

    // Créditos del pie
    var creditos = T.pie && T.pie.creditos;
    if (Array.isArray(creditos)) {
      $$('[data-creditos]').forEach(function (el) {
        el.innerHTML = creditos.map(function (c) {
          return c.enlace
            ? '<a href="' + esc(c.enlace) + '" target="_blank" rel="noopener">' + esc(c.texto) + '</a>'
            : esc(c.texto);
        }).join(' · ');
      });
    }

    // Funciones
    pintarLista('lista-funciones', T.funciones && T.funciones.items, function (f, i) {
      return '<article class="tarjeta revelar" style="--retardo:' + (i % 3) * 90 + 'ms">' +
        '<div class="icono">' + icono(f.icono) + '</div>' +
        '<h3>' + esc(f.titulo) + '</h3><p>' + esc(f.texto) + '</p></article>';
    });

    // Un viaje con Omniuy
    pintarLista('lista-viaje', T.viaje && T.viaje.items, function (p) {
      return '<li class="paso revelar">' +
        '<div class="paso__icono">' + icono(p.icono) + '</div>' +
        '<div><h3>' + esc(p.titulo) + '</h3><p>' + esc(p.texto) + '</p></div></li>';
    });

    // Capturas
    pintarLista('lista-capturas', C.capturas, function (c, i) {
      return '<figure class="captura revelar" style="--retardo:' + Math.min(i, 3) * 90 + 'ms">' +
        '<div class="captura__marco">' +
        '<div class="captura__vacia"><span class="icono">' + icono('imagen') + '</span>Captura en camino</div>' +
        '<img src="' + esc(c.archivo) + '" alt="' + esc(c.titulo) + '" loading="lazy" decoding="async">' +
        '</div><figcaption>' + esc(c.titulo) + '</figcaption></figure>';
    });
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

    // Pasos de instalación
    pintarLista('lista-pasos', T.instalar && T.instalar.pasos, function (p, i) {
      return '<li class="tarjeta paso-instalar revelar" style="--retardo:' + (i % 4) * 90 + 'ms">' +
        '<h3>' + esc(p.titulo) + '</h3><p>' + esc(p.texto) + '</p></li>';
    });

    // Premium
    pintarLista('lista-premium', T.premium && T.premium.items, function (b) {
      return '<div class="beneficio"><div class="icono">' + icono(b.icono) + '</div>' +
        '<div><h3>' + esc(b.titulo) + '</h3><p>' + esc(b.texto) + '</p></div></div>';
    });

    // Preguntas frecuentes
    pintarLista('lista-faq', T.faq && T.faq.preguntas, function (p) {
      return '<details class="revelar"><summary>' + esc(p.pregunta) +
        '<span class="faq__mas" aria-hidden="true"></span></summary>' +
        '<div class="faq__respuesta"><p>' + esc(p.respuesta) + '</p></div></details>';
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
      console.error('Omniuy: error al armar la página', e);
    }
  } else {
    var aviso = document.createElement('div');
    aviso.className = 'error-config';
    aviso.textContent = 'Hay un error en config.js (revisá comillas y comas).';
    document.body.appendChild(aviso);
  }
  animarAlAparecer();
  seguirScroll();

  // Detiene el ómnibus del mapa si el celular pide reducir movimiento
  var mapa = $('[data-mapa]');
  if (mapa && reducirMovimiento && mapa.pauseAnimations) mapa.pauseAnimations();

  $$('[data-anio]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
