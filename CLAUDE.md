# San Telmo Servicios — maqueta de demostración

Maqueta de una página para móvil y web. Máximo (desarrollador, trabaja solo) la enseña el
miércoles 11/11/2026 a San Telmo Servicios — central de taxis, taller y gasolinera en
Puerto de la Cruz, Tenerife — para que contraten el trabajo. No es la web definitiva:
es una demostración que tiene que funcionar en un iPhone delante del cliente.

## Antes de tocar nada

- Lee `BRIEF.md` entero. Es la única fuente de datos del cliente.
- Si en el repo ya hay una maqueta anterior, léela y parte de ella en vez de empezar de cero.
- Si un dato no está en `BRIEF.md`, no lo inventes. Pon un marcador visible
  «POR CONFIRMAR» y avísame al terminar.

## Reglas técnicas

- HTML, CSS y JavaScript sin dependencias externas ni paso de compilación. Tiene que
  funcionar abriendo `index.html` y también publicada en GitHub Pages.
- Pensada primero para móvil. Compruébala a 375 px de ancho.
- Teléfonos, número de WhatsApp, enlace de la app y URL pública: en un único bloque de
  configuración al principio del JavaScript.
- Todos los textos de los tres idiomas (es, en, de) en un único objeto, para cambiar
  un dato en un solo sitio.
- El parámetro `?wa=34XXXXXXXXX` en la URL sustituye el número de WhatsApp de destino
  (se usa en la demo).
- Incluye `<meta name="robots" content="noindex">` y un pie con el texto
  «Maqueta de propuesta. No es la web oficial de San Telmo Servicios».
- No enlaces imágenes del servidor de QDQ ni de terceros. Usa bloques de color o
  marcadores «FOTO: flota» hasta tener fotos del cliente.
- Sin cookies, sin analítica, sin guardar datos: el formulario solo abre WhatsApp.

## Reglas de texto

- Español de Canarias: «ustedes», nunca «vosotros».
- Sin jerga. El cliente no es técnico y sus clientes son vecinos y turistas.
- Precios siempre con «desde» y con el aviso del taxímetro. Nunca precios cerrados.
- Nada que critique la web actual ni a su proveedor.

## Qué no construir

Chatbot, pago online, asignación automática de taxis, panel de administración,
registro de usuarios, rediseño completo de taller y gasolinera.

## Cómo comprobar el trabajo

1. Abrir `index.html` a 375 px: se ve el botón de llamar sin hacer scroll.
2. Cambiar de idioma: cambian todos los textos, incluido el formulario.
3. Rellenar una reserva y enviar: se abre WhatsApp con el mensaje en el formato de
   `BRIEF.md`, siempre en español.
4. Repetir con `?wa=` y comprobar que cambia el número de destino.
5. Abrir `qr.html` e imprimir en vista previa: cabe en una pegatina de 8 × 8 cm.
