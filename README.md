# JARVIS Mobile

PWA demostrativa en español, preparada para GitHub Pages. Incluye dictado por micrófono, respuestas habladas, una interfaz móvil, conversación con respuestas simuladas, mapa Canvas y notas ficticias. No conecta con modelos de IA, calendario ni archivos personales.

El reconocimiento y la síntesis de voz utilizan las funciones disponibles en el navegador. El micrófono requiere permiso del usuario y, según el navegador, el audio puede procesarse mediante el servicio de reconocimiento de su plataforma y requerir conexión. La aplicación no almacena grabaciones.

## Estructura

- `index.html`: punto de entrada.
- `styles.css` y `app.js`: interfaz y comportamiento.
- `manifest.webmanifest`: metadatos de instalación.
- `sw.js`: caché offline y actualización de recursos.
- `icons/`: iconos de 192 y 512 px.
- `.nojekyll`: publica los archivos estáticos sin procesamiento de Jekyll.

Las rutas de recursos son relativas, por lo que funcionan tanto en la raíz del repositorio como bajo `/jarvis-mobile/` en GitHub Pages.

## GitHub Pages

Configura **Settings → Pages → Deploy from a branch**, elige `main` y la carpeta `/(root)`. La URL esperada es:

<https://nexus-jarvis.github.io/jarvis-mobile/>

Después de publicar, abre la URL con HTTPS. En iPhone, usa Safari → Compartir → Añadir a pantalla de inicio. La primera visita debe cargar los recursos para que la caché offline se complete.

## Voz

- Pulsa **MIC** y concede permiso para usar el micrófono.
- Habla en español; al terminar, JARVIS procesa la frase y responde en voz alta.
- El botón **Voz activa** permite silenciar o reactivar las respuestas habladas.
- En iPhone, usa Safari y verifica que Siri esté habilitado si el reconocimiento no inicia.
- Si el navegador no admite reconocimiento de voz, todavía puedes utilizar el dictado del teclado.

## Uso local

Sirve esta carpeta desde un servidor HTTP local, por ejemplo `python -m http.server 8790`, y abre `http://localhost:8790`. El service worker requiere HTTPS o localhost.
