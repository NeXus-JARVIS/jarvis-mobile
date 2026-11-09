# JARVIS Mobile

PWA demostrativa en español, preparada para GitHub Pages. Incluye una interfaz móvil, conversación con respuestas simuladas, mapa Canvas y notas ficticias. No conecta con servicios externos, modelos de IA, micrófono, calendario ni archivos personales.

## Estructura

- `index.html`: punto de entrada.
- `styles.css` y `app.js`: interfaz y comportamiento.
- `manifest.webmanifest`: metadatos de instalación.
- `sw.js`: caché offline.
- `icons/`: iconos de 192 y 512 px.
- `.nojekyll`: publica los archivos estáticos sin procesamiento de Jekyll.

Las rutas de recursos son relativas, por lo que funcionan tanto en la raíz del repositorio como bajo `/jarvis-mobile/` en GitHub Pages.

## GitHub Pages

Configura **Settings → Pages → Deploy from a branch**, elige `main` y la carpeta `/(root)`. La URL esperada es:

<https://nexus-jarvis.github.io/jarvis-mobile/>

Después de publicar, abre la URL con HTTPS. En iPhone, usa Safari → Compartir → Añadir a pantalla de inicio. La primera visita debe cargar los recursos para que la caché offline se complete.

## Uso local

Sirve esta carpeta desde un servidor HTTP local, por ejemplo `python -m http.server 8790`, y abre `http://localhost:8790`. El service worker requiere HTTPS o localhost.
