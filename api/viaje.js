/**
 * Página de un VIAJE COMPARTIDO desde la app: https://www.omniuy.app/viaje?o=…&on=…&d=…&dn=…[&l=316,494][&h=s|l&f=…]
 * (vercel.json la manda acá; el formato del enlace lo arma la app en Compartir.kt).
 *
 * - Con Omniuy instalada, Android abre directamente la app (App Links) y esta página ni se ve.
 * - Sin la app (o en una computadora): el resumen del viaje y un botón que abre la app si está o, si no, Google Play.
 * - La arma el servidor (no el navegador) porque WhatsApp lee de acá la tarjeta de la vista previa (título y texto con
 *   los nombres del viaje) y no ejecuta programas de la página.
 *
 * Mientras la app no esté publicada en Google Play: EN_GOOGLE_PLAY = false ("Muy pronto en Google Play").
 */

const EN_GOOGLE_PLAY = false;
const PAQUETE = 'app.omniuy';
const GOOGLE_PLAY = 'https://play.google.com/store/apps/details?id=' + PAQUETE;
const SITIO = 'https://www.omniuy.app';

// Lo que viene en el enlace se muestra como texto (nunca como HTML) y con un largo máximo
function escapar(texto) {
  return String(texto)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function nombre(valor, siFalta) {
  const t = (typeof valor === 'string' ? valor : '').trim().slice(0, 120);
  return t || siFalta;
}
// Solo en la tarjeta de la página (va suelto, no en medio de una frase): "Cerca de …"
const conMayuscula = (t) => t.charAt(0).toUpperCase() + t.slice(1);
const COORDENADAS = /^-?\d{1,3}(\.\d+)?,-?\d{1,3}(\.\d+)?$/;
const LINEAS = /^[A-Za-z0-9]{1,6}(,[A-Za-z0-9]{1,6}){0,5}$/;
const FECHA = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})$/;

// "3/11 a las 8:30"
function textoFecha(f) {
  const m = FECHA.exec(f || '');
  if (!m) return null;
  return Number(m[3]) + '/' + Number(m[2]) + ' a las ' + Number(m[4]) + ':' + m[5];
}

module.exports = function (req, res) {
  const q = req.query || {};
  const valido = COORDENADAS.test(q.o || '') && COORDENADAS.test(q.d || '');
  const desde = nombre(q.on, 'el punto de partida');
  const hasta = nombre(q.dn, 'el destino');
  const lineas = LINEAS.test(q.l || '') ? q.l.split(',') : [];
  const fecha = textoFecha(q.f);
  const cuando = fecha && q.h === 's' ? 'Saliendo el ' + fecha : fecha && q.h === 'l' ? 'Llegando antes del ' + fecha : null;

  // El mismo enlace (para la tarjeta) y el que abre la app desde el navegador de Android: si no está instalada,
  // Chrome sigue a la "dirección de respaldo" (Google Play, o la página principal mientras no esté publicada)
  const consulta = new URLSearchParams(q).toString();
  const enlace = SITIO + '/viaje' + (consulta ? '?' + consulta : '');
  const respaldo = EN_GOOGLE_PLAY ? GOOGLE_PLAY : SITIO + '/';
  const abrirApp = 'intent://www.omniuy.app/viaje' + (consulta ? '?' + consulta : '') +
    '#Intent;scheme=https;package=' + PAQUETE + ';S.browser_fallback_url=' + encodeURIComponent(respaldo) + ';end';

  const titulo = valido ? 'Viaje desde ' + desde + ' hasta ' + hasta : 'Viaje en Omniuy';
  const descripcion = valido
    ? 'Este es el viaje recomendado. Abrilo en Omniuy para verlo en detalle.'
    : 'Este enlace de viaje no está completo. Conocé Omniuy, tu ómnibus en Montevideo en vivo.';

  const html = `<!doctype html>
<html lang="es-UY">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${escapar(titulo)} · Omniuy</title>
  <meta name="description" content="${escapar(descripcion)}">
  <meta name="robots" content="noindex">
  <meta name="theme-color" content="#0A0A0A">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_UY">
  <meta property="og:site_name" content="Omniuy">
  <meta property="og:title" content="${escapar(titulo)}">
  <meta property="og:description" content="${escapar(descripcion)}">
  <meta property="og:url" content="${escapar(enlace)}">
  <meta property="og:image" content="${SITIO}/img/og-imagen.png?v=2">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/favicon.ico?v=2" sizes="32x32">
  <link rel="icon" href="/img/favicon.svg?v=2" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/img/icono-180.png?v=2">
  <style>
    :root { --fondo:#F6F7F6; --tarjeta:#FFFFFF; --texto:#111312; --suave:#5A625D; --acento:#75CE8C; --borde:rgba(17,19,18,.10);
            --fuente:"Plus Jakarta Sans",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif; color-scheme:light; }
    @media (prefers-color-scheme: dark) {
      :root { --fondo:#0A0A0A; --tarjeta:#18181A; --texto:#EDEFEE; --suave:#A1A8A4; --borde:rgba(255,255,255,.09); color-scheme:dark; }
    }
    * { box-sizing:border-box; }
    body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px 16px;
           background:var(--fondo); color:var(--texto); font-family:var(--fuente); }
    main { width:100%; max-width:440px; background:var(--tarjeta); border:1.5px solid color-mix(in srgb, var(--acento) 70%, transparent);
           border-radius:22px; padding:26px 22px 22px; }
    .marca { display:flex; align-items:center; gap:10px; font-weight:800; font-size:20px; margin-bottom:22px; }
    .marca img { width:36px; height:36px; border-radius:10px; }
    h1 { font-size:15px; font-weight:600; color:var(--suave); margin:0 0 14px; }
    .tramo { display:flex; gap:12px; }
    .linea { display:flex; flex-direction:column; align-items:center; width:14px; }
    .punto { width:14px; height:14px; border-radius:50%; border:2px solid #fff; box-shadow:0 0 0 1px var(--borde); flex:none; }
    .verde { background:#4FD184; } .rojo { background:#C62828; }
    .rayitas { flex:1; width:2px; min-height:26px; margin:4px 0;
               background:repeating-linear-gradient(var(--suave) 0 5px, transparent 5px 9px); opacity:.7; }
    .lugar small { display:block; font-size:12px; color:var(--suave); }
    .lugar span { display:block; font-weight:700; font-size:17px; margin:1px 0 14px; }
    .extra { font-size:14px; color:var(--suave); margin:2px 0 0 26px; }
    .boton { display:block; text-align:center; text-decoration:none; margin-top:22px; padding:14px; border-radius:999px;
             background:var(--acento); color:#0A0A0A; font-weight:700; font-size:16px; }
    .nota { text-align:center; font-size:13px; color:var(--suave); margin:12px 0 0; }
    .nota a { color:inherit; }
  </style>
</head>
<body>
  <main>
    <div class="marca"><img src="/img/icono-192.png?v=2" alt="">Omniuy</div>
    ${valido ? `
    <h1>Este es el viaje recomendado</h1>
    <div class="tramo">
      <div class="linea"><div class="punto verde"></div><div class="rayitas"></div></div>
      <div class="lugar"><small>Desde</small><span>${escapar(conMayuscula(desde))}</span></div>
    </div>
    <div class="tramo">
      <div class="linea"><div class="punto rojo"></div></div>
      <div class="lugar"><small>Hasta</small><span>${escapar(conMayuscula(hasta))}</span></div>
    </div>
    ${lineas.length ? `<p class="extra">En ómnibus: ${escapar(lineas.join(' y '))}</p>` : ''}
    ${cuando ? `<p class="extra">${escapar(cuando)}</p>` : ''}
    <a class="boton" href="${escapar(abrirApp)}">Abrir en Omniuy</a>
    <p class="nota">${EN_GOOGLE_PLAY
      ? 'Si no tenés Omniuy, te lleva a Google Play para descargarla gratis.'
      : 'Omniuy va a estar muy pronto en Google Play. <a href="/">Conocela</a>'}</p>
    ` : `
    <h1>Este enlace de viaje no está completo.</h1>
    <a class="boton" href="/">Conocé Omniuy</a>`}
  </main>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // Depende solo del enlace: se puede guardar un día en la red de Vercel
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=3600');
  res.status(200).send(html);
};
