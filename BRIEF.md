# Brief — maqueta para San Telmo Servicios

Cada dato lleva su etiqueta: **HECHO** (comprobado), **REUNIÓN** (lo dijo el cliente),
**PROPUESTA** (idea de Máximo, sin confirmar) o **POR CONFIRMAR** (falta el dato).

## 1. Objetivo

Que Francisco (responsable de la cooperativa) y la gerente vean en un móvil, en menos
de 5 minutos, el recorrido completo de una reserva y digan que sí a la fase 1.

El recorrido que tiene que funcionar en la demo:

1. Francisco escanea con su móvil un QR impreso en una pegatina.
2. Se abre la página: llamar a la central, información, tarifas, preguntas frecuentes.
3. Máximo rellena una reserva de ejemplo y pulsa «Enviar».
4. Se abre WhatsApp con la reserva ya escrita y ordenada.
5. Se enseña la sección «Así le llega a la central».

## 2. Qué pidió el cliente (reunión del 6/11/2026)

- **REUNIÓN** Quieren que el cliente pueda informarse y reservar sin llamar, con la web
  y el WhatsApp enlazados entre sí.
- **REUNIÓN** Idea de Francisco: un QR en cada taxi que lleve a toda la información.
- **REUNIÓN** Un compañero taxista tiene respuestas automáticas en su WhatsApp personal.
  Quieren algo así para toda la central.
- **REUNIÓN** Su mayor duda: «¿Dónde llegaría? ¿Quién lo vería? ¿Quién lo va a tramitar?».
  La maqueta tiene que contestar esto de forma visible.
- **REUNIÓN** Cómo trabajan hoy: las reservas entran por teléfono y por WhatsApp. Una
  operadora las pasa a mano al programa de gestión de taxis, que busca el taxi por GPS.
  Mientras contesta consultas no atiende el teléfono.
- **REUNIÓN** Su programa de taxis ya tiene una app para que el cliente pida taxi.
  Hay que enlazarla, no duplicarla. Nombre y enlace: **POR CONFIRMAR**.
- **REUNIÓN** No se toca la línea de teléfono ni la forma de trabajar de la central.

## 3. Estructura de la página (una sola página, móvil)

1. **Cabecera**: nombre, selector de idioma (ES · EN · DE).
2. **Pedir taxi ahora**: botón grande «Llamar a la central · 24 h» y, debajo,
   «Pedir con la app» (enlace **POR CONFIRMAR**).
3. **Reservar para otro día**: formulario (apartado 4).
4. **Servicios de taxi**: lista corta (apartado 6).
5. **Tarifas al aeropuerto**: las dos tarifas «desde» con el aviso del taxímetro.
6. **Rutas turísticas**: 3 o 4 tarjetas con botón «Pedir precio por WhatsApp» y la ruta
   ya elegida en el mensaje. Rutas y duraciones: **PROPUESTA** (apartado 7).
7. **Preguntas frecuentes** (apartado 8).
8. **Así le llega a la central**: imagen o recuadro con el mensaje de WhatsApp tal como
   lo ve la operadora, y una línea: «Lo recibe la central en su WhatsApp, ya ordenado.
   La operadora lo pasa a su programa como hace hoy, sin tener que preguntar nada».
9. **Taller y gasolineras**: bloque pequeño con horarios, teléfonos y cita del taller
   por WhatsApp.
10. **Pie**: dirección, mapa, aviso de maqueta.

Barra fija abajo en móvil: Llamar · WhatsApp · Reservar.

## 4. Formulario de reserva

Campos:

- Tipo de servicio: traslado Aeropuerto Norte, traslado Aeropuerto Sur, puerto,
  ruta turística, boda o evento, otro.
- Recogida (texto) y destino (texto).
- Día y hora.
- Personas y maletas.
- Número de vuelo (solo si el servicio es de aeropuerto).
- Extras: silla de niño, vehículo adaptado, vehículo grande (hasta 8 plazas).
- Nombre y teléfono.
- Comentarios (opcional).

Al enviar se abre `https://wa.me/<número>?text=<mensaje>`. No se guarda nada.

El mensaje va **siempre en español**, aunque el cliente use la página en otro idioma,
porque lo lee la operadora. Formato:

```
*RESERVA DE TAXI* (web)
Idioma del cliente: Alemán
Servicio: Traslado Aeropuerto Sur
Día: 14/12/2026
Hora: 06:30
Recogida: Hotel (nombre), Puerto de la Cruz
Destino: Aeropuerto Tenerife Sur
Personas: 3 · Maletas: 4
Vuelo: XX 1234
Extras: silla de niño
Nombre: Nombre Apellido
Teléfono: +49 000 000000
Comentarios: —
```

El orden de las líneas se ajustará al de la pantalla de su programa de taxis:
**POR CONFIRMAR** tras la reunión.

Mensaje de la cita del taller (bloque 9): matrícula, qué necesita y día que le viene bien.

## 5. Teléfonos y direcciones

Comprobados en santelmoservicios.es el 9/11/2026:

| Qué | Dato | Etiqueta |
|---|---|---|
| Central de taxis, 24 horas | 922 38 58 18 | HECHO |
| Teléfono general (botón «Teléfono» de la web) | 922 384 854 | HECHO |
| Taller, cita previa (y destino del WhatsApp de la web actual) | 662 37 35 16 | HECHO |
| E.S. BP El Trompo (La Orotava) | 607 21 30 24 | HECHO |
| WhatsApp de la central para reservas | — | POR CONFIRMAR |
| Enlace de la app del programa de taxis | — | POR CONFIRMAR |

- Dirección principal: Calle Tafuriaste, 1, 38400 Puerto de la Cruz, Santa Cruz de
  Tenerife. Coordenadas: 28.398254, -16.545488. **HECHO**
- Taller mecánico Las Arenas: misma dirección. **HECHO**
- E.S. BP El Trompo: TF-333, ramal TF-5, Pol. Ind. San Jerónimo, 38312 La Orotava. **HECHO**
- La web menciona también la estación BP Las Arenas. **HECHO**

Hasta confirmar el WhatsApp de la central, deja el número como constante vacía con un
aviso en consola, y usa `?wa=` en la demo.

## 6. Datos del negocio

**Horarios (HECHO)**

- Taxi: 24 horas.
- Estaciones de servicio: lunes a viernes 6:00–23:00; sábados 7:00–23:00; domingos y
  festivos 7:00–22:00.
- Taller y repuestos: lunes a viernes 8:00–16:00.

**Servicios de taxi (HECHO)**

- Traslados a puertos y aeropuertos.
- Bodas, congresos y traslados escolares.
- Rutas turísticas con conductor.
- Reservas para cualquier servicio.

**Flota (HECHO)**

- Vehículos de 4 a 8 plazas.
- Vehículos adaptados para personas con movilidad reducida.
- Aire acondicionado.
- Sistemas de retención infantil.
- Pago con tarjeta.
- Conductores uniformados.

**Tarifas (HECHO)**

- Puerto de la Cruz – Aeropuerto Norte: desde 30 €.
- Puerto de la Cruz – Aeropuerto Sur: desde 100 €.
- Aviso obligatorio: precios aproximados por vehículo, regulados por taxímetro.

**Taller (HECHO)**: mecánica general, electricidad y electrónica, todas las marcas.
Para taxis: taxímetros e impresoras, gestión de flota, luminosos y actualización de tarifas.

**Gasolinera (HECHO)**: carburante, lavado, productos para el coche, bebidas y aperitivos.

## 7. Rutas turísticas

- **HECHO** La web actual no publica rutas concretas ni precios: dice que el cliente
  puede definir el trayecto o pedir asesoramiento, con conductor exclusivo.
- **PROPUESTA** Tarjetas de ejemplo: Teide, Anaga, Garachico y Masca. Sin precio.
  Duración: **POR CONFIRMAR**. Marca las tarjetas como ejemplo hasta que el cliente
  las apruebe.

## 8. Preguntas frecuentes (borrador)

Contesta solo con datos del apartado 6. Las que no tengan dato llevan «POR CONFIRMAR».

- ¿Cuánto cuesta ir al aeropuerto? → tarifas «desde» + aviso del taxímetro.
- ¿Puedo pagar con tarjeta? → sí.
- ¿Tienen coches grandes, adaptados o con silla de niño? → sí; se pide en la reserva.
- ¿Funcionan de noche? → sí, 24 horas; para un taxi ahora, llamar a la central.
- ¿Cómo reservo para otro día? → con el formulario; llega a la central por WhatsApp.
- ¿Hacen excursiones por la isla? → sí; el precio se pide por WhatsApp.
- ¿Cuánto tardan en confirmar una reserva? → POR CONFIRMAR.
- ¿Con cuánta antelación hay que reservar? → POR CONFIRMAR.

## 9. Pegatina con QR (`qr.html`)

- Página aparte, lista para imprimir en 8 × 8 cm.
- QR que apunta a la URL pública de la maqueta (constante de configuración).
- Texto: «Información y reservas» en español, inglés y alemán, y el nombre
  «Taxi San Telmo».
- El QR tiene que generarse sin depender de internet.

## 10. Idiomas

- **PROPUESTA** Español, inglés y alemán. El cliente no ha confirmado en qué idiomas
  le escriben: es una pregunta para la reunión.
- Las traducciones son un borrador que hay que revisar antes de publicar.

## 11. Qué no hacer

- No inventar teléfonos, precios, rutas, horarios ni nombres.
- No prometer en los textos confirmación inmediata ni precio cerrado.
- No mostrar chatbot, pago online ni asignación automática: quedan para fases posteriores.
- No usar fotos de la web actual ni de bancos de imágenes con marcas de otros.
- No decir que la web actual está mal.

## 12. Fuentes

- https://www.santelmoservicios.es/es/
- https://www.santelmoservicios.es/es/contacto/
- https://www.santelmoservicios.es/es/servicio/taxi/
- https://www.santelmoservicios.es/es/rutas-turisticas-tenerife.html
- Reunión del 6/11/2026 y ficha «San Telmo Servicios» en Notion («Encargos y cobros»).
