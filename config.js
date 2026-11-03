/* =====================================================================
   CONFIGURACIÓN DE LA WEB DE OMNIUY
   ---------------------------------------------------------------------
   Este es el ÚNICO archivo que necesitás tocar para cambiar textos,
   versión, fecha, links, colores o contacto.

   Reglas para no romper nada:
   • Cambiá solo lo que está ENTRE COMILLAS "así".
   • No borres las comas del final de cada línea.
   • Si un texto lleva comillas adentro, usá estas: « »
   ===================================================================== */

window.OMNIUY = {

  /* ---------- VERSIÓN DE LA APP ---------- */
  version: {
    numero: "0.5.0",              // Número de versión
    etiqueta: "Pre-alfa",         // Aparece antes del número: «Pre-alfa 0.3.0»
    fecha: "2026-11-03",          // Fecha de la versión (AAAA-MM-DD, o escribila como quieras)
    // Si está en true, la web lee sola la versión y la fecha del último
    // Release de GitHub. Si falla, usa los datos de arriba.
    leerDeGitHub: true,
  },

  /* ---------- DESCARGA ---------- */
  repo: "dancorbo/Omniuy",        // Repositorio de GitHub (usuario/nombre)
  descarga: {
    // ¿Se puede descargar? true = sí · false = botones bloqueados con un aviso
    habilitada: false,
    avisoPausa: "Las descargas están pausadas por un momento. ¡Volvé pronto!",
    // Siempre apunta al APK del ÚLTIMO Release. No hace falta cambiarlo.
    enlaceApk: "https://github.com/dancorbo/Omniuy/releases/latest/download/omniuy.apk",
    archivo: "omniuy.apk",        // Nombre EXACTO del APK que subís a cada Release
    requisitos: "",               // Ej.: "Android 8.0 o superior" (vacío = no se muestra)
  },

  /* ---------- GOOGLE PLAY ---------- */
  googlePlay: {
    disponible: false,            // Cambialo a true cuando la app esté publicada
    enlace: "",                   // Link de la ficha en Play Store (cuando exista)
    aviso: "¡Estamos en eso! Muy pronto vas a poder bajarla desde Google Play.",
  },

  /* ---------- MARCA ---------- */
  logo: "img/logo.svg",           // Ruta del logo (cuadrado)
  colores: {
    principal: "#0A0A0A",         // Fondo oscuro de la portada y el pie
    acento: "#75CE8C",            // Verde Omniuy: botones y destacados
    sobreAcento: "#0A0A0A",       // Color del texto encima del verde
  },

  /* ---------- CONTACTO ---------- */
  contacto: {
    // Correos que aparecen en el pie. «para» es el texto que va arriba de cada uno.
    emails: [
      { para: "Consultas generales", email: "contacto@omniuy.app" },
      { para: "Ayuda y errores de la app", email: "soporte@omniuy.app" },
      { para: "Propuestas, prensa y alianzas", email: "propuestas@omniuy.app" },
    ],
  },

  /* ---------- CAPTURAS ----------
     Subí tus imágenes a la carpeta img/capturas/ con estos nombres.
     Mientras no existan, se muestra un recuadro de reemplazo.        */
  capturaPortada: "img/capturas/portada.webp?v=2",  // La que va dentro del celular de arriba
  capturas: [
    { archivo: "img/capturas/captura-1.webp?v=2", titulo: "Elegí cómo ir" },
    { archivo: "img/capturas/captura-2.webp?v=2", titulo: "Ómnibus en vivo" },
    { archivo: "img/capturas/captura-3.webp?v=2", titulo: "Planificá tu viaje" },
    { archivo: "img/capturas/captura-4.webp?v=2", titulo: "Todo el recorrido" },
    { archivo: "img/capturas/captura-5.webp?v=2", titulo: "Todas las líneas" },
  ],

  /* ---------- TEXTOS DE LA PÁGINA ---------- */
  textos: {

    hero: {
      titulo: "Tu ómnibus en Montevideo,",
      tituloDestacado: "en vivo.",
      subtitulo: "Mirá dónde viene, bajate en la parada justa y llegá a la hora que te dijimos. Omniuy te acompaña todo el viaje, de puerta a puerta.",
      boton: "Descargar APK",
      nota: "Gratis · Sin anuncios · Solo Android",
      enlaceAyuda: "¿Cómo se instala?",
      // Notificación de ejemplo que flota junto al celular
      notificacionTitulo: "103 · llega en 14 min",
      notificacionTexto: "faltan 8 paradas · llegás ≈ 15:01",
    },

    funciones: {
      antetitulo: "Funciones",
      titulo: "Todo lo que necesitás para moverte en ómnibus",
      intro: "Con los datos abiertos del STM, en tiempo real.",
      items: [
        { icono: "ruta", titulo: "Cómo llegar", texto: "Elegí a dónde vas y te muestra las mejores opciones: caminata, ómnibus, trasbordos y a qué hora llegás." },
        { icono: "vivo", titulo: "Ómnibus en vivo", texto: "Mirá en el mapa dónde viene tu ómnibus y en cuántos minutos llega a tu parada. También todos los de una línea, de punta a punta." },
        { icono: "campana", titulo: "Te avisa cuándo bajarte", texto: "Una parada antes de la tuya suena un timbre (también en tus auriculares) y vibra: «¡Bajate en la próxima!». Viajá tranquilo, mirando por la ventana." },
        { icono: "ventana", titulo: "Siempre a la vista", texto: "Seguí el viaje desde la notificación, con una barra que muestra por dónde vas, aunque estés usando otra app o con el celular bloqueado." },
        { icono: "caminar", titulo: "Caminata incluida", texto: "Calcula lo que caminás hasta la parada y desde la bajada, por la calle, y te dice la hora a la que llegás." },
        { icono: "paradas", titulo: "Todas las paradas", texto: "Mirá todas las paradas de tu viaje y sabé siempre por dónde vas. Si te querés bajar antes, tocás la parada y listo." },
        { icono: "bus", titulo: "Montevideo y alrededores", texto: "Las líneas urbanas y también las metropolitanas: Ciudad de la Costa, Costa de Oro, Pando, Las Piedras y más." },
        { icono: "sinred", titulo: "Funciona sin internet", texto: "El mapa, las paradas, los horarios y cómo llegar funcionan aunque te quedes sin datos." },
        { icono: "estrella", titulo: "Tus lugares", texto: "Casa, trabajo y tus paradas favoritas a un toque, y lugares buscados por su nombre: «Antel Arena», «Tres Cruces»…" },
      ],
    },

    viaje: {
      antetitulo: "Cómo funciona",
      titulo: "Un viaje con Omniuy",
      intro: "Desde que salís de tu casa hasta que llegás.",
      items: [
        { icono: "caminar", titulo: "Salís caminando", texto: "Sabés cuánto tardás hasta la parada, así no esperás de más." },
        { icono: "vivo", titulo: "Seguís el ómnibus en vivo", texto: "Lo ves acercarse en el mapa. Nada de adivinar." },
        { icono: "ventana", titulo: "Te subís y te olvidás", texto: "El viaje queda en la notificación, aunque bloquees el celular." },
        { icono: "campana", titulo: "Suena el timbre una parada antes", texto: "Timbre y vibración: «¡Bajate en la próxima!». Tiempo de sobra para acercarte a la puerta." },
        { icono: "vibrar", titulo: "Vibra al llegar", texto: "Llegaste a tu parada. Bajate y seguí caminando." },
        { icono: "llegada", titulo: "Llegás a la hora prevista", texto: "Con la caminata final incluida en el cálculo." },
      ],
    },

    capturas: {
      antetitulo: "Capturas",
      titulo: "Así se ve Omniuy",
      intro: "Deslizá para ver más.",
      introEscritorio: "Usá las flechas para ver más.",   // En computadoras
    },

    instalar: {
      antetitulo: "Instalación",
      titulo: "Cómo instalar el APK",
      intro: "Lleva un minuto. Como la app todavía no está en Google Play, se instala con un archivo.",
      pasos: [
        { titulo: "Tocá «Descargar APK»", texto: "Se descarga el archivo omniuy.apk. Si el navegador te pregunta, elegí «Descargar de todos modos»." },
        { titulo: "Abrí el archivo", texto: "Tocá la notificación de descarga, o buscalo en la app Archivos › Descargas." },
        { titulo: "Permití la instalación", texto: "Si Android te avisa, tocá «Configuración» y activá «Permitir de esta fuente». Después volvé atrás." },
        { titulo: "Instalá y listo", texto: "Tocá «Instalar». Si Play Protect muestra un aviso, elegí «Instalar de todos modos»." },
      ],
      aviso: "Los avisos de Android son normales: aparecen con cualquier app que no viene de Google Play. Descargá Omniuy solo desde esta página.",
    },

    premium: {
      antetitulo: "Próximamente",
      titulo: "Omniuy Premium",
      intro: "Una suscripción opcional para quienes viajan todos los días. Lo básico (mapa, horarios, tiempo real, cómo llegar y el aviso para bajarte) es gratis, siempre.",
      items: [
        { icono: "saldo", titulo: "Tu tarjeta STM", texto: "El saldo y los últimos movimientos de tus tarjetas, sin entrar cada vez a STM en línea." },
        { icono: "tarjeta", titulo: "Tu boleto y cuál pedir", texto: "El precio de todos tus viajes según tu boleto (común, jubilado, estudiante…) y qué boleto te conviene pedir." },
        { icono: "widget", titulo: "Widgets", texto: "Los próximos ómnibus de tus paradas y el saldo STM en la pantalla de inicio." },
        { icono: "campana", titulo: "Viajes a futuro", texto: "«Salir a las» o «Llegar antes de», con aviso para salir a tiempo." },
        { icono: "repetir", titulo: "Viajes frecuentes", texto: "Tus viajes de todos los días, con hasta 3 trayectos y un aviso antes de salir (y pausa en los feriados)." },
        { icono: "paradas", titulo: "Parada intermedia", texto: "Pasá por un lugar en el camino y quedate el tiempo que quieras." },
        { icono: "llegada", titulo: "Favoritos sin límite", texto: "Todos los lugares y paradas que quieras (gratis: 2 lugares y 2 paradas)." },
      ],
      // Tarifas (pesos uruguayos). Se muestran abajo de los beneficios.
      precios: [
        { nombre: "Mensual", precio: "$50", cada: "por mes" },
        { nombre: "Anual", precio: "$300", cada: "por año", etiqueta: "Ahorrás 50 %" },
      ],
      notaPrecios: "Va a estar disponible cuando Omniuy esté en Google Play. Podés cancelar cuando quieras.",
    },

    novedades: {
      antetitulo: "Lo nuevo",
      titulo: "Novedades de la versión 0.5.0",
      intro: "Lo que sumamos en la última versión.",
      items: [
        { icono: "tarjeta", titulo: "Tarifas al día", texto: "Boleto céntrico y zonal en cualquier línea (con los mapas oficiales de la Intendencia), paradas de intercambio con hasta 3 ómnibus en una hora, Terminal Colón y pago en efectivo. Premium." },
        { icono: "saldo", titulo: "Más tipos de boleto", texto: "Jubilado en efectivo, prepago nominado y TUS, con lo que te devuelven a fin de mes. Premium." },
        { icono: "ruta", titulo: "Combinación metropolitana", texto: "Si tu viaje combina un ómnibus urbano con una línea metropolitana, ves que sale desde $80. Gratis." },
        { icono: "repetir", titulo: "Viajes frecuentes", texto: "Guardá tus viajes de todos los días, con hasta 3 trayectos y un aviso antes de salir. Premium." },
        { icono: "vivo", titulo: "Tiempo real más firme", texto: "Ahora llega a través del servidor de Omniuy: más estable para todos y sin claves dentro de la app." },
        { icono: "vibrar", titulo: "Aviso para bajarte más prolijo", texto: "Si el GPS se pierde al final del viaje, el timbre ya no suena cuando ya te bajaste." },
      ],
    },

    faq: {
      antetitulo: "Preguntas frecuentes",
      titulo: "¿Dudas?",
      preguntas: [
        { pregunta: "¿Omniuy es gratis?", respuesta: "Sí, descargarla y usarla es gratis. Más adelante vamos a sumar Omniuy Premium, una suscripción opcional ($50 por mes o $300 por año) con el saldo de tu tarjeta STM, el precio de todos tus viajes según tu boleto, widgets y más. Lo básico sigue siendo gratis, siempre." },
        { pregunta: "¿Tiene anuncios?", respuesta: "No, y no va a tener. Omniuy no muestra anuncios en ninguna versión, ni en la gratis ni en Premium." },
        { pregunta: "¿Qué hacen con mis datos?", respuesta: "Nada: Omniuy no tiene cuentas, anuncios ni rastreo, y no guarda tus datos en servidores propios. Tus favoritos, viajes y el saldo de tu tarjeta STM quedan en tu celular (y en la copia de seguridad de tu cuenta de Google, si la tenés activada), y tu ubicación no se envía a Omniuy. Todo el detalle está en la Política de privacidad, al pie de esta página." },
        { pregunta: "¿Cómo la consigo?", respuesta: "Muy pronto en Google Play. Mientras tanto la estamos probando con un grupo chico: si querés sumarte a la prueba, escribinos a soporte@omniuy.app." },
        { pregunta: "¿Funciona fuera de Montevideo?", respuesta: "En el área metropolitana, sí: además de las líneas urbanas de Montevideo, tiene las líneas metropolitanas a Canelones y San José, con sus horarios (estas todavía sin tiempo real). Fuera de esa zona, por ahora no." },
        { pregunta: "¿Cuándo sale en Google Play?", respuesta: "Estamos en el proceso de publicarla: primero una prueba con un grupo chico y después para todos. Cuando esté, el botón de Google Play de esta página te lleva directo." },
        { pregunta: "¿Hay versión para iPhone?", respuesta: "Por ahora no: Omniuy es solo para Android." },
        { pregunta: "Encontré un error o tengo una idea, ¿a quién le aviso?", respuesta: "¡Nos encanta! Escribinos a soporte@omniuy.app. Al ser una pre-alfa, cada comentario ayuda muchísimo." },
      ],
    },

    pie: {
      frase: "Hecho en Montevideo, para moverse por Montevideo.",
      // Créditos: se muestran separados por « · ». El «enlace» es opcional.
      creditos: [
        { texto: "Desarrollado por Daniel Corbo" },
        { texto: "Hecho con Claude Code", enlace: "https://claude.com/claude-code" },
        { texto: "Datos abiertos del STM / Intendencia de Montevideo", enlace: "https://ckan.montevideo.gub.uy/" },
        { texto: "Horarios metropolitanos: Ministerio de Transporte y Obras Públicas (datos abiertos)", enlace: "https://catalogodatos.gub.uy/" },
        { texto: "MapLibre", enlace: "https://maplibre.org/" },
        { texto: "OpenFreeMap © OpenMapTiles", enlace: "https://openfreemap.org/" },
        { texto: "Calles, lugares y mapas: © colaboradores de OpenStreetMap (ODbL)", enlace: "https://www.openstreetmap.org/copyright" },
        { texto: "Letra Plus Jakarta Sans (OFL)" },
      ],
      aviso: "Omniuy es un proyecto independiente. No está afiliado a la Intendencia de Montevideo ni al STM.",
    },
  },
};
