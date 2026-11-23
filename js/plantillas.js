/* =====================================================================
   TEARRIMO · PLANTILLAS DE LAS LISTAS
   Cómo se dibuja cada tarjeta, paso, beneficio, pregunta, etc. con los datos de config.js.
   Las usan DOS lugares, así nunca quedan distintas:
   • js/main.js, en el navegador.
   • herramientas/armar-html.mjs, que escribe esas mismas listas adentro de index.html para que Google (y quien
     entre sin JavaScript) lea el texto de entrada. Después de cambiar config.js, correr:
       node herramientas/armar-html.mjs
   ===================================================================== */
(function (raiz) {
  'use strict';

  /* ---------- Íconos (trazos de 24×24) ---------- */
  var ICONOS = {
    descargar: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
    play: '<path d="M6 3.5v17l14-8.5z"/>',
    vivo: '<circle cx="12" cy="12" r="2"/><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M4.9 4.9a10 10 0 0 0 0 14.2M19.1 4.9a10 10 0 0 1 0 14.2"/>',
    bus: '<rect x="4" y="3" width="16" height="15" rx="3"/><path d="M4 11h16M8 18v2M16 18v2"/><circle cx="8" cy="14.5" r=".8"/><circle cx="16" cy="14.5" r=".8"/>',
    campana: '<path d="M6 16v-5a6 6 0 1 1 12 0v5l2 2H4z"/><path d="M10 21a2 2 0 0 0 4 0"/>',
    repetir: '<path d="M19.5 10A7.5 7.5 0 0 0 5.6 7.5"/><path d="M5 4v3.8h3.8"/><path d="M4.5 14a7.5 7.5 0 0 0 13.9 2.5"/><path d="M19 20v-3.8h-3.8"/>',
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
    izquierda: '<path d="M15 18l-6-6 6-6"/>',
    derecha: '<path d="M9 18l6-6-6-6"/>',
    ruta: '<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5"/>',
    sinred: '<path d="M2 8.5a15 15 0 0 1 6.2-3.4M12.9 4.6A15 15 0 0 1 22 8.5M5 12a10 10 0 0 1 4.2-2.3M19 12a10 10 0 0 0-2.5-1.6M8.5 15.5a5 5 0 0 1 5.6-.8"/><circle cx="12" cy="19" r=".8"/><path d="M3 3l18 18"/>',
    buscar: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.4-4.4"/>',
    recarga: '<path d="M13 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4M3 9.5h18M18.5 14v7M15 17.5h7"/>',
    flecha: '<path d="M4 12h15M13 6l6 6-6 6"/>',
    calendario: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 9.5h16M8.5 3v3.5M15.5 3v3.5M9 14.5l2 2 4-4"/>',
    estrella: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
    pin: '<path d="M12 21c-3.5-4-6.5-7.5-6.5-11a6.5 6.5 0 0 1 13 0c0 3.5-3 7-6.5 11z"/><path d="M9.3 7.6h5.4M12 7.6v5.6"/>',
    imagen: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/>',
    compartir: '<circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="M8.6 10.7l6.8-3.9M8.6 13.3l6.8 3.9"/>'
  };

  function icono(nombre) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (ICONOS[nombre] || ICONOS.bus) + '</svg>';
  }

  function esc(texto) {
    return String(texto == null ? '' : texto).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Texto escapado con las direcciones web (https://…) y los correos convertidos en enlaces (para las respuestas de las
  // preguntas frecuentes). Se escapa ANTES: no se puede meter HTML
  function conEnlaces(texto) {
    return esc(texto)
      .replace(/https:\/\/[^\s<]+[^\s<.,;:!?)]/g, function (url) {
        return '<a href="' + url + '" target="_blank" rel="noopener">' + url.replace(/^https:\/\//, '') + '</a>';
      })
      .replace(/[\w.+-]+@[\w-]+\.[\w.]+[\w]/g, function (correo) {
        return '<a href="mailto:' + correo + '">' + correo + '</a>';
      })
      // Un salto de línea en el texto (\n) es un renglón nuevo
      .replace(/\n/g, '<br>');
  }

  function tarjeta(f, i) {
    return '<article class="tarjeta revelar" style="--retardo:' + (i % 3) * 90 + 'ms">' +
      '<div class="icono">' + icono(f.icono) + '</div>' +
      '<h3>' + esc(f.titulo) + '</h3><p>' + esc(f.texto) + '</p></article>';
  }

  /* Cada lista: el id de su contenedor en index.html, de dónde salen los datos y cómo se dibuja cada uno */
  var LISTAS = [
    { id: 'lista-funciones', datos: function (C) { return C.textos.funciones && C.textos.funciones.items; }, plantilla: tarjeta },
    {
      id: 'lista-viaje', datos: function (C) { return C.textos.viaje && C.textos.viaje.items; },
      plantilla: function (p) {
        return '<li class="paso revelar">' +
          '<div class="paso__icono">' + icono(p.icono) + '</div>' +
          '<div><h3>' + esc(p.titulo) + '</h3><p>' + esc(p.texto) + '</p></div></li>';
      }
    },
    {
      id: 'lista-capturas', datos: function (C) { return C.capturas; },
      plantilla: function (c, i) {
        return '<figure class="captura revelar" style="--retardo:' + Math.min(i, 3) * 90 + 'ms">' +
          '<div class="captura__marco">' +
          '<div class="captura__vacia"><span class="icono">' + icono('imagen') + '</span>Captura en camino</div>' +
          '<img src="' + esc(c.archivo) + '" alt="' + esc(c.titulo) + '" loading="lazy" decoding="async">' +
          '</div><figcaption>' + esc(c.titulo) + '</figcaption></figure>';
      }
    },
    {
      id: 'lista-pasos', datos: function (C) { return C.textos.instalar && C.textos.instalar.pasos; },
      plantilla: function (p, i) {
        return '<li class="tarjeta paso-instalar revelar" style="--retardo:' + (i % 4) * 90 + 'ms">' +
          '<h3>' + esc(p.titulo) + '</h3><p>' + esc(p.texto) + '</p></li>';
      }
    },
    {
      id: 'lista-premium', datos: function (C) { return C.textos.premium && C.textos.premium.items; },
      plantilla: function (b) {
        return '<div class="beneficio"><div class="icono">' + icono(b.icono) + '</div>' +
          '<div><h3>' + esc(b.titulo) + '</h3><p>' + esc(b.texto) + '</p></div></div>';
      }
    },
    {
      id: 'lista-precios', datos: function (C) { return C.textos.premium && C.textos.premium.precios; },
      plantilla: function (p) {
        return '<div class="precio">' +
          (p.etiqueta ? '<span class="precio__etiqueta">' + esc(p.etiqueta) + '</span>' : '') +
          '<span class="precio__nombre">' + esc(p.nombre) + '</span>' +
          '<strong class="precio__valor">' + esc(p.precio) + '</strong>' +
          '<span class="precio__cada">' + esc(p.cada) + '</span></div>';
      }
    },
    { id: 'lista-se-viene', datos: function (C) { return C.textos.seViene && C.textos.seViene.items; }, plantilla: tarjeta },
    { id: 'lista-novedades', datos: function (C) { return C.textos.novedades && C.textos.novedades.items; }, plantilla: tarjeta },
    {
      id: 'lista-faq', datos: function (C) { return C.textos.faq && C.textos.faq.preguntas; },
      plantilla: function (p) {
        return '<details class="revelar"><summary>' + esc(p.pregunta) +
          '<span class="faq__mas" aria-hidden="true"></span></summary>' +
          '<div class="faq__respuesta"><p>' + conEnlaces(p.respuesta) + '</p></div></details>';
      }
    }
  ];

  /* El HTML de una lista entera (vacío si no hay datos) */
  function htmlDeLista(lista, C) {
    var items = lista.datos(C);
    return Array.isArray(items) ? items.map(lista.plantilla).join('') : '';
  }

  /* Los correos del pie */
  function htmlDeEmails(C) {
    var emails = (C.contacto && C.contacto.emails) || [];
    return emails.map(function (e) {
      return '<li><span class="pie__para">' + esc(e.para) + '</span>' +
        '<a class="pie__email" href="mailto:' + esc(e.email) + '">' +
        icono('correo') + '<span>' + esc(e.email) + '</span></a></li>';
    }).join('');
  }

  /* Los créditos del pie, separados por « · » */
  function htmlDeCreditos(C) {
    var creditos = C.textos.pie && C.textos.pie.creditos;
    if (!Array.isArray(creditos)) return '';
    return creditos.map(function (c) {
      return c.enlace
        ? '<a href="' + esc(c.enlace) + '" target="_blank" rel="noopener">' + esc(c.texto) + '</a>'
        : esc(c.texto);
    }).join(' · ');
  }

  raiz.TEARRIMO_PLANTILLAS = {
    icono: icono,
    esc: esc,
    LISTAS: LISTAS,
    htmlDeLista: htmlDeLista,
    htmlDeEmails: htmlDeEmails,
    htmlDeCreditos: htmlDeCreditos
  };
})(typeof window !== 'undefined' ? window : globalThis);
