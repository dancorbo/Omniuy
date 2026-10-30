/**
 * Servidor intermedio de Omniuy para el tiempo real de la Intendencia de Montevideo.
 *
 * La app Android ya no lleva las claves de la API: le pregunta a este servidor, que las guarda en
 * las variables de entorno de Vercel (STM_CLIENT_ID y STM_CLIENT_SECRET, nunca en el código).
 *
 * Solo acepta las dos consultas que usa la app:
 *   /api/buses?lines=100          (o varias separadas por coma: lines=103,155)
 *   /api/buses?busstopId=1234
 * y devuelve solo lo que la app necesita de cada ómnibus. Cada respuesta se guarda 10 s en la red
 * de Vercel: si mucha gente mira la misma línea a la vez, a la Intendencia le llega una sola consulta.
 */

const URL_TOKEN = 'https://mvdapi-auth.montevideo.gub.uy/token';
const URL_API = 'https://api.montevideo.gub.uy/api/transportepublico';
const TIEMPO_ESPERA_MS = 8000;

// Líneas: letras y números (100, L9, D8, CE1...), hasta 10 separadas por coma. Paradas: un número
const LINEAS_VALIDAS = /^[A-Za-z0-9]{1,6}(,[A-Za-z0-9]{1,6}){0,9}$/;
const PARADA_VALIDA = /^\d{1,7}$/;

// El permiso de la Intendencia dura unos minutos: se reusa mientras el servidor sigue despierto
let token = null;
let venceToken = 0;

async function obtenerToken() {
  if (token && Date.now() < venceToken) return token;
  const respuesta = await fetch(URL_TOKEN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.STM_CLIENT_ID || '',
      client_secret: process.env.STM_CLIENT_SECRET || '',
    }),
    signal: AbortSignal.timeout(TIEMPO_ESPERA_MS),
  });
  if (!respuesta.ok) throw new Error('token HTTP ' + respuesta.status);
  const datos = await respuesta.json();
  token = datos.access_token;
  // Lo damos por vencido 30 s antes, por las dudas
  venceToken = Date.now() + ((datos.expires_in || 300) - 30) * 1000;
  return token;
}

async function pedir(ruta, reintento = true) {
  const respuesta = await fetch(URL_API + ruta, {
    headers: { Authorization: 'Bearer ' + (await obtenerToken()) },
    signal: AbortSignal.timeout(TIEMPO_ESPERA_MS),
  });
  // Si el permiso venció en el medio, se pide otro y se reintenta una vez
  if ((respuesta.status === 401 || respuesta.status === 403) && reintento) {
    token = null;
    return pedir(ruta, false);
  }
  if (!respuesta.ok) throw new Error('API HTTP ' + respuesta.status);
  return respuesta.json();
}

// Solo lo que usa la app (TiempoReal.leerBus): número, línea, recorrido, posición y hora
function resumir(bus) {
  return {
    busId: bus.busId,
    line: bus.line,
    lineVariantId: bus.lineVariantId,
    location: bus.location && { coordinates: bus.location.coordinates },
    timestamp: bus.timestamp,
  };
}

module.exports = async function (req, res) {
  const { lines, busstopId } = req.query || {};
  let ruta = null;
  if (typeof lines === 'string' && LINEAS_VALIDAS.test(lines) && busstopId === undefined) {
    ruta = '/buses?lines=' + encodeURIComponent(lines);
  } else if (typeof busstopId === 'string' && PARADA_VALIDA.test(busstopId) && lines === undefined) {
    ruta = '/buses?busstopId=' + busstopId;
  }
  if (req.method !== 'GET' || ruta === null) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(400).json({ error: 'Consulta no válida: usá ?lines=100 o ?busstopId=1234' });
  }
  if (!process.env.STM_CLIENT_ID || !process.env.STM_CLIENT_SECRET) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(503).json({ error: 'Faltan las claves en Vercel' });
  }
  try {
    const buses = await pedir(ruta);
    // 10 s guardado en la red de Vercel (y hasta 5 s más mientras se actualiza)
    res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=5');
    return res.status(200).json(Array.isArray(buses) ? buses.map(resumir) : []);
  } catch (e) {
    res.setHeader('Cache-Control', 'no-store');
    // El detalle dice en qué paso falló (sin datos secretos): "token HTTP 401", "TimeoutError"...
    return res.status(502).json({ error: 'La Intendencia no respondió', detalle: (e && (e.name + ': ' + e.message)) || '' });
  }
};
