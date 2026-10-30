# Omniuy · Página web

Landing de **Omniuy**, la app Android de ómnibus en vivo para Montevideo.
Sitio estático (HTML, CSS y JS) publicado en Vercel: https://omniuy.app

Cada cambio que llega a `main` se publica solo.

## Qué archivo tocar

| Quiero cambiar…                        | Archivo                                   |
|----------------------------------------|-------------------------------------------|
| Textos, versión, fecha, colores, email | `config.js`                               |
| Logo                                   | `img/logo.svg` y `img/favicon.svg`        |
| Capturas de pantalla                   | `img/capturas/` (ver nombres abajo)       |
| Vista previa al compartir en WhatsApp  | `img/og-imagen.png` (1200×630) y las etiquetas `og:` de `index.html` |

### Nombres de las capturas

Subilas a `img/capturas/` con estos nombres (o cambiá los nombres en `config.js`):

- `portada.webp`: la que aparece dentro del celular, arriba de todo
- `captura-1.webp` a `captura-5.webp`: el carrusel

Pueden ser .png o .jpg también: solo cambiá el nombre en `config.js`.
Cuidá que no aparezcan datos personales (tu ubicación, Casa, Trabajo).

Mientras no existan, la web muestra un recuadro de reemplazo.

## El APK

El botón «Descargar APK» siempre apunta a:

```
https://github.com/dancorbo/Omniuy/releases/latest/download/omniuy.apk
```

Para que funcione:

1. El archivo del Release se tiene que llamar **exactamente** `omniuy.apk`.
2. El Release **no** tiene que estar marcado como *pre-release* (GitHub los ignora al buscar «el último»).
3. El repositorio tiene que ser **público**.

La versión, la fecha y el peso que se ven en la web se leen solos del último Release.
Si no se puede leer, se usan los datos de `config.js`.

## Estructura

```
index.html        Página
config.js         Textos y datos
css/estilos.css   Diseño
js/main.js        Armado de secciones y animaciones
img/              Logo, favicon, imagen para compartir y capturas
.nojekyll         Solo se usa si algún día se publica en GitHub Pages
```

## Servidor intermedio (tiempo real)

`api/buses.js` es una función de Vercel: la app le pregunta a `https://omniuy.app/api/buses?lines=100`
(o `?busstopId=1234`) y ella le pregunta a la Intendencia con las claves, que están SOLO en Vercel
(Settings › Environment Variables: `STM_CLIENT_ID` y `STM_CLIENT_SECRET`). Así el APK no lleva claves.
Cada respuesta se guarda 10 s, así muchas personas mirando la misma línea son una sola consulta.
