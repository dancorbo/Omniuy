// Escribe adentro de index.html los textos y las listas de config.js, para que Google (y quien entre sin JavaScript)
// lea la página completa de entrada. En el navegador, js/main.js usa las MISMAS plantillas (js/plantillas.js).
//
// Correrlo después de cambiar config.js (desde la carpeta de la web):
//   node herramientas/armar-html.mjs              → actualiza index.html
//   node herramientas/armar-html.mjs --comprobar  → solo avisa si index.html quedó viejo (sale con error)
//
// Qué toca en index.html (y nada más):
//   • el texto de cada elemento con data-t="…" (los de config.js › textos);
//   • lo que está entre <!--auto--> y <!--/auto--> adentro de cada lista (id="lista-…"), de los correos y los créditos;
//   • data-version, data-version-linea, la sección «Se viene» y la ficha para Google (datos estructurados).

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const carpeta = join(dirname(fileURLToPath(import.meta.url)), '..');
const leer = (archivo) => readFileSync(join(carpeta, archivo), 'utf8');

// config.js y plantillas.js son para el navegador (window.…): se corren en un "window" de mentira
const ventana = {};
ventana.window = ventana;
vm.createContext(ventana);
vm.runInContext(leer('config.js'), ventana, { filename: 'config.js' });
vm.runInContext(leer('js/plantillas.js'), ventana, { filename: 'js/plantillas.js' });
const C = ventana.OMNIUY;
const P = ventana.TEARRIMO_PLANTILLAS;
if (!C || !P) throw new Error('No se pudo leer config.js o js/plantillas.js');

const T = C.textos || {};
const original = leer('index.html');
let html = original;
const problemas = [];

function valorEn(objeto, ruta) {
  return ruta.split('.').reduce((o, k) => (o == null ? undefined : o[k]), objeto);
}

// Reemplaza lo que hay entre <!--auto--> y <!--/auto--> justo después de la etiqueta que cumple [inicio]
function ponerEntreMarcas(inicio, contenido, nombre) {
  const patron = new RegExp('(' + inicio + '[^>]*>[\\s\\S]*?<!--auto-->)[\\s\\S]*?(<!--/auto-->)');
  if (!patron.test(html)) { problemas.push('no encontré las marcas <!--auto--> de ' + nombre); return; }
  html = html.replace(patron, (_, a, b) => a + contenido + b);
}

// Pone o saca el atributo hidden de la etiqueta que cumple [inicio] (ej. '<section[^>]*id="se-viene"')
function esconder(inicio, escondido, nombre) {
  const patron = new RegExp('(' + inicio + '[^>]*?)(\\s+hidden)?(\\s*>)');
  if (!patron.test(html)) { problemas.push('no encontré ' + nombre); return; }
  html = html.replace(patron, (_, a, __, b) => a + (escondido ? ' hidden' : '') + b);
}

// 1. Textos sueltos: <x data-t="hero.titulo">…</x> (solo los que tienen texto adentro, sin otras etiquetas)
html = html.replace(/(<([a-z0-9]+)\b[^>]*\bdata-t="([^"]+)"[^>]*>)([^<]*)(<\/\2>)/g, (todo, abre, _, ruta, viejo, cierra) => {
  const valor = valorEn(T, ruta);
  return valor != null && valor !== '' ? abre + P.esc(valor) + cierra : todo;
});

// 2. Versión: «Pre-alfa 0.6.2» y, debajo de los botones, «Gratis en Google Play» (como lo pone js/main.js)
const v = C.version || {};
const textoVersion = (v.etiqueta ? v.etiqueta + ' ' : '') + v.numero;
html = html.replace(/(<[a-z]+\b[^>]*\bdata-version(?![\w-])[^>]*>)[^<]*/g, (_, abre) => abre + P.esc(textoVersion));
const descargaActiva = !C.descarga || C.descarga.habilitada !== false;
const enPlay = C.googlePlay && C.googlePlay.disponible && C.googlePlay.enlace;
if (!descargaActiva) {
  const linea = enPlay ? 'Gratis en Google Play' : 'Descargas pausadas';
  html = html.replace(/(<[a-z]+\b[^>]*\bdata-version-linea\b[^>]*>)[^<]*/g, (_, abre) => abre + linea);
}

// 3. Listas, correos y créditos
for (const lista of P.LISTAS) ponerEntreMarcas('id="' + lista.id + '"', P.htmlDeLista(lista, C), lista.id);
ponerEntreMarcas('data-emails', P.htmlDeEmails(C), 'los correos');
ponerEntreMarcas('data-creditos', P.htmlDeCreditos(C), 'los créditos');

// 4. «Se viene»: sin novedades próximas, la sección y el aviso de arriba no se ven
const seViene = T.seViene || {};
esconder('<section\\b[^>]*\\bid="se-viene"', !(Array.isArray(seViene.items) && seViene.items.length), 'la sección «Se viene»');
esconder('<a\\b[^>]*\\bdata-aviso-se-viene', !seViene.aviso, 'el aviso de «Se viene»');

// 5. Ficha para Google (datos estructurados): qué es TeArrimo, que es una app Android gratis y dónde se baja
const sitio = 'https://www.tearrimo.app/';
const ficha = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'TeArrimo',
    url: sitio,
    inLanguage: 'es-UY',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: 'TeArrimo',
    alternateName: 'TeArrimo: ómnibus Montevideo',
    description: 'App Android para viajar en ómnibus en Montevideo y el área metropolitana: ómnibus en vivo, ' +
      'cómo llegar, alerta para bajarte en tu parada y hora estimada de llegada. Gratis y sin anuncios.',
    url: sitio,
    image: sitio + 'img/icono-192.png',
    operatingSystem: 'Android',
    applicationCategory: 'TravelApplication',
    inLanguage: 'es',
    softwareVersion: v.numero,
    ...(enPlay ? { installUrl: C.googlePlay.enlace, downloadUrl: C.googlePlay.enlace } : {}),
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    areaServed: { '@type': 'City', name: 'Montevideo' },
    publisher: { '@type': 'Organization', name: 'TeArrimo', url: sitio, logo: sitio + 'img/icono-192.png' },
  },
];
// "<" escapado: un texto de config.js con «</script>» no puede cortar el bloque
const json = JSON.stringify(ficha, null, 2).replace(/</g, '\\u003c');
const bloque = '<script type="application/ld+json">\n' + json + '\n  </script>';
if (!/<!--auto:ficha-->[\s\S]*?<!--\/auto:ficha-->/.test(html)) problemas.push('no encontré las marcas <!--auto:ficha--> del <head>');
html = html.replace(/(<!--auto:ficha-->)[\s\S]*?(<!--\/auto:ficha-->)/, (_, a, b) => a + '\n  ' + bloque + '\n  ' + b);

if (problemas.length) {
  console.error('index.html: ' + problemas.join('; '));
  process.exit(1);
}

const comprobar = process.argv.includes('--comprobar');
if (html === original) {
  console.log('index.html ya estaba al día con config.js.');
} else if (comprobar) {
  console.error('index.html quedó VIEJO: corré «node herramientas/armar-html.mjs».');
  process.exit(1);
} else {
  writeFileSync(join(carpeta, 'index.html'), html);
  console.log('index.html actualizado con config.js.');
}
