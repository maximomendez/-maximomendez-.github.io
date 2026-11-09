/* ==========================================================================
   CONFIGURACIÓN — único sitio donde cambiar teléfonos, WhatsApp, app y URL.
   ========================================================================== */
window.SANTELMO_CONFIG = {

  /* Teléfonos (HECHO: comprobados en santelmoservicios.es el 9/11/2026).
     "display" es lo que ve el cliente; "tel" es lo que marca el móvil. */
  phones: {
    central: { display: "922 38 58 18",  tel: "+34922385818" },  // Central de taxis, 24 h
    general: { display: "922 384 854",   tel: "+34922384854" },  // Teléfono general
    taller:  { display: "662 37 35 16",  tel: "+34662373516" },  // Taller, cita previa
    trompo:  { display: "607 21 30 24",  tel: "+34607213024" }   // E.S. BP El Trompo
  },

  /* WhatsApp: solo dígitos, con prefijo de país y sin «+» (ej. "34600111222").
     Con ?wa=34XXXXXXXXX en la dirección se sustituye el número de destino
     (central y taller) para la demo. */
  whatsapp: {
    central: "",              // POR CONFIRMAR: WhatsApp de la central para reservas
    taller:  "34662373516"    // HECHO: destino del WhatsApp de la web actual
  },

  /* App del programa de taxis (se enlaza, no se duplica). */
  app: {
    name: "",                 // POR CONFIRMAR
    url:  ""                  // POR CONFIRMAR
  },

  /* URL pública de la maqueta (GitHub Pages). La usa qr.html para el QR. */
  publicUrl: "",              // POR CONFIRMAR, ej. "https://usuario.github.io/santelmo/"

  /* Ubicación y direcciones (HECHO). */
  location: {
    lat: 28.398254,
    lng: -16.545488,
    address: "Calle Tafuriaste, 1, 38400 Puerto de la Cruz, Santa Cruz de Tenerife",
    trompoAddress: "TF-333, ramal TF-5, Pol. Ind. San Jerónimo, 38312 La Orotava"
  }
};
