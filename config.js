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
    numero: "0.3.0",              // Número de versión
    etiqueta: "Pre-alfa",         // Aparece antes del número: «Pre-alfa 0.3.0»
    fecha: "2026-10-30",          // Fecha de la versión (AAAA-MM-DD, o escribila como quieras)
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
    aviso: "¡Estamos en eso! Por ahora podés descargar el APK desde esta página.",
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
    email: "dancorbo225@gmail.com",
  },

  /* ---------- CAPTURAS ----------
     Subí tus imágenes a la carpeta img/capturas/ con estos nombres.
     Mientras no existan, se muestra un recuadro de reemplazo.        */
  capturaPortada: "img/capturas/portada.webp",  // La que va dentro del celular de arriba
  capturas: [
    { archivo: "img/capturas/captura-1.webp", titulo: "Elegí cómo ir" },
    { archivo: "img/capturas/captura-2.webp", titulo: "Ómnibus en vivo" },
    { archivo: "img/capturas/captura-3.webp", titulo: "Planificá tu viaje" },
    { archivo: "img/capturas/captura-4.webp", titulo: "Todo el recorrido" },
    { archivo: "img/capturas/captura-5.webp", titulo: "Todas las líneas" },
  ],

  /* ---------- TEXTOS DE LA PÁGINA ---------- */
  textos: {

    hero: {
      titulo: "Tu ómnibus en Montevideo,",
      tituloDestacado: "en vivo.",
      subtitulo: "Mirá dónde viene, bajate en la parada justa y llegá a la hora que te dijimos. Omniuy te acompaña todo el viaje, de puerta a puerta.",
      boton: "Descargar APK",
      nota: "Gratis · Solo Android",
      enlaceAyuda: "¿Cómo se instala?",
      // Notificación de ejemplo que flota junto al celular
      notificacionTitulo: "103 · llega en 20 min",
      notificacionTexto: "faltan 39 paradas · llegás ≈ 4:58",
    },

    funciones: {
      antetitulo: "Funciones",
      titulo: "Todo lo que necesitás para moverte en ómnibus",
      intro: "Con los datos abiertos del STM, en tiempo real.",
      items: [
        { icono: "vivo", titulo: "Ómnibus en vivo", texto: "Mirá dónde viene tu ómnibus en tiempo real, sobre su recorrido o en modo libre por todo el mapa." },
        { icono: "campana", titulo: "Te avisa cuándo bajarte", texto: "Vibra cuando faltan dos paradas y suena un timbre al llegar a la tuya. Viajá tranquilo, mirando por la ventana." },
        { icono: "ventana", titulo: "Siempre a la vista", texto: "Seguí el viaje desde la barra de notificaciones o en una ventana flotante, aunque estés usando otra app." },
        { icono: "caminar", titulo: "Caminata incluida", texto: "Calcula lo que caminás hasta la parada y desde la bajada, y te dice la hora exacta en la que llegás." },
        { icono: "paradas", titulo: "Paradas intermedias", texto: "Mirá todas las paradas de tu viaje y sabé siempre por dónde vas." },
        { icono: "tarjeta", titulo: "Tarjeta de viaje", texto: "Tu viaje resumido en una tarjeta: línea, paradas, tiempos y hora de llegada." },
      ],
    },

    viaje: {
      antetitulo: "Cómo funciona",
      titulo: "Un viaje con Omniuy",
      intro: "Desde que salís de tu casa hasta que llegás.",
      items: [
        { icono: "caminar", titulo: "Salís caminando", texto: "Sabés cuánto tardás hasta la parada, así no esperás de más." },
        { icono: "vivo", titulo: "Seguís el ómnibus en vivo", texto: "Lo ves acercarse en el mapa. Nada de adivinar." },
        { icono: "ventana", titulo: "Te subís y te olvidás", texto: "El viaje queda en la barra de notificaciones o en la ventana flotante." },
        { icono: "vibrar", titulo: "Vibra a dos paradas", texto: "Tiempo de sobra para guardar el celular y acercarte a la puerta." },
        { icono: "campana", titulo: "Suena el timbre", texto: "Llegaste a tu parada. Tocá timbre y bajate." },
        { icono: "llegada", titulo: "Llegás a la hora prevista", texto: "Con la caminata final incluida en el cálculo." },
      ],
    },

    capturas: {
      antetitulo: "Capturas",
      titulo: "Así se ve Omniuy",
      intro: "Deslizá para ver más.",
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
      intro: "Una suscripción opcional para quienes quieran más.",
      items: [
        { icono: "widget", titulo: "Widgets", texto: "Tus paradas y ómnibus en la pantalla de inicio, sin abrir la app." },
        { icono: "saldo", titulo: "Saldo de tu tarjeta STM", texto: "Vinculá tu tarjeta y mirá el saldo cuando quieras." },
        { icono: "sinAnuncios", titulo: "Sin anuncios", texto: "Una experiencia limpia, sin interrupciones." },
      ],
    },

    faq: {
      antetitulo: "Preguntas frecuentes",
      titulo: "¿Dudas?",
      preguntas: [
        { pregunta: "¿Omniuy es gratis?", respuesta: "Sí, descargarla y usarla es gratis. Más adelante vamos a sumar Omniuy Premium, una suscripción opcional sin anuncios, con widgets y el saldo de tu tarjeta STM." },
        { pregunta: "¿Es seguro instalar el APK?", respuesta: "Sí. El archivo se descarga directo desde la página oficial del proyecto en GitHub. Android muestra un aviso porque la app todavía no está en Google Play: es normal con cualquier app que se instala por fuera de la tienda. Descargala siempre desde esta página." },
        { pregunta: "¿Funciona fuera de Montevideo?", respuesta: "Por ahora no. Omniuy usa los datos abiertos del STM, el Sistema de Transporte Metropolitano de Montevideo, así que funciona con sus líneas y paradas." },
        { pregunta: "¿Cuándo sale en Google Play?", respuesta: "La app está en pre-alfa y la estamos probando con un grupo chico. Cuando esté estable la vamos a publicar en Google Play. Mientras tanto, podés usar el APK de esta página." },
        { pregunta: "¿Hay versión para iPhone?", respuesta: "Por ahora no: Omniuy es solo para Android." },
        { pregunta: "Encontré un error o tengo una idea, ¿a quién le aviso?", respuesta: "¡Nos encanta! Escribinos al correo que está al pie de la página. Al ser una pre-alfa, cada comentario ayuda muchísimo." },
      ],
    },

    pie: {
      frase: "Hecho en Montevideo, para moverse por Montevideo.",
      // Créditos: se muestran separados por « · ». El «enlace» es opcional.
      creditos: [
        { texto: "Desarrollado por Daniel Corbo" },
        { texto: "Hecho con Claude Code", enlace: "https://claude.com/claude-code" },
        { texto: "Datos abiertos del STM / Intendencia de Montevideo", enlace: "https://ckan.montevideo.gub.uy/" },
        { texto: "Mapas de las capturas: MapLibre · OpenFreeMap © OpenMapTiles · Datos de OpenStreetMap", enlace: "https://www.openstreetmap.org/copyright" },
        { texto: "Letra Plus Jakarta Sans (OFL)" },
      ],
      aviso: "Omniuy es un proyecto independiente. No está afiliado a la Intendencia de Montevideo ni al STM.",
    },
  },
};
