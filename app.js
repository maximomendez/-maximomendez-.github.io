/* San Telmo Servicios — maqueta. Lógica de la página.
 * Configuración: config.js · Textos: i18n.js · Sin dependencias, sin cookies,
 * sin guardar datos: el formulario solo abre WhatsApp. */
(function () {
  "use strict";

  var CFG = window.SANTELMO_CONFIG;
  var T = window.SANTELMO_I18N;
  var LANGS = ["es", "en", "de"];
  var AIRPORT = { airportN: true, airportS: true };
  var params = new URLSearchParams(window.location.search);

  var lang = LANGS.indexOf(params.get("lang")) >= 0 ? params.get("lang") : "es";

  /* ---------- Utilidades ---------- */
  function $(id) { return document.getElementById(id); }
  function all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function get(obj, path) {
    return path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, obj);
  }
  function t(path) { return get(T[lang], path); }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  /* ---------- WhatsApp: número de destino ---------- */
  // ?wa=34XXXXXXXXX sustituye el número de destino (central y taller).
  function waOverride() {
    var digits = (params.get("wa") || "").replace(/\D/g, "");
    return digits.length >= 8 && digits.length <= 15 ? digits : "";
  }
  function waNumber(kind) {
    return waOverride() || (CFG.whatsapp[kind] || "").replace(/\D/g, "");
  }
  function waUrl(number, text) {
    return "https://wa.me/" + number + (text ? "?text=" + encodeURIComponent(text) : "");
  }
  if (!waNumber("central")) {
    console.warn("[San Telmo] POR CONFIRMAR: falta el WhatsApp de la central (config.js). " +
      "Para la demo use ?wa=34XXXXXXXXX en la dirección.");
  }

  /* ---------- Avisos ---------- */
  var toastTimer;
  function toast(msg) {
    var box = $("toast");
    box.textContent = msg;
    box.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { box.hidden = true; }, 8000);
  }

  function setStatus(box, msg, link) {
    box.textContent = msg;
    if (link) {
      box.appendChild(document.createTextNode(" "));
      var a = el("a", null, t("openWaLink"));
      a.href = link;
      a.target = "_blank";
      a.rel = "noopener";
      box.appendChild(a);
    }
  }

  /* Abre WhatsApp con el texto ya escrito. Devuelve false si no hay número. */
  function openWhatsApp(number, text, statusBox) {
    if (!number) {
      if (statusBox) setStatus(statusBox, t("errNoWa"));
      toast(t("errNoWa"));
      return false;
    }
    var url = waUrl(number, text);
    var a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (statusBox) setStatus(statusBox, t("openingWa"), url);
    return true;
  }

  /* ---------- Mensajes de WhatsApp (siempre en español) ---------- */
  function clean(s) {
    return String(s == null ? "" : s).replace(/\s*[\r\n]+\s*/g, " ").replace(/\*/g, "").trim();
  }
  function fmtDate(v) {
    var p = String(v || "").split("-");
    return p.length === 3 ? p[2] + "/" + p[1] + "/" + p[0] : clean(v);
  }

  function buildBooking(d, langCode) {
    var W = T.wa, B = W.booking, E = W.empty;
    var extras = (d.extras || []).map(function (k) { return W.extras[k]; }).join(", ") || E;
    var lines = [
      "*" + B.title + "* " + B.source,
      B.lang + ": " + W.langNames[langCode],
      B.service + ": " + W.services[d.service],
      B.day + ": " + fmtDate(d.date),
      B.time + ": " + clean(d.time),
      B.pickup + ": " + clean(d.pickup),
      B.dropoff + ": " + clean(d.dropoff),
      B.people + ": " + clean(d.people) + " · " + B.bags + ": " + (clean(d.bags) || "0")
    ];
    if (AIRPORT[d.service]) lines.push(B.flight + ": " + (clean(d.flight) || E));
    lines.push(
      B.extras + ": " + extras,
      B.name + ": " + clean(d.name),
      B.phone + ": " + clean(d.phone),
      B.comments + ": " + (clean(d.comments) || E)
    );
    return lines.join("\n");
  }

  function buildRoute(key, langCode) {
    var R = T.wa.route;
    return [
      "*" + R.title + "* " + R.source,
      R.lang + ": " + T.wa.langNames[langCode],
      R.route + ": " + T.wa.routes[key],
      R.ask
    ].join("\n");
  }

  function buildAppointment(d, langCode) {
    var A = T.wa.appointment;
    return [
      "*" + A.title + "* " + A.source,
      A.lang + ": " + T.wa.langNames[langCode],
      A.plate + ": " + clean(d.plate),
      A.need + ": " + clean(d.need),
      A.day + ": " + clean(d.day)
    ].join("\n");
  }

  /* Pinta un mensaje de WhatsApp: *negrita* y saltos de línea, sin innerHTML. */
  function renderWa(box, text) {
    box.textContent = "";
    text.split("\n").forEach(function (line, i) {
      if (i) box.appendChild(document.createElement("br"));
      line.split(/(\*[^*]+\*)/).forEach(function (part) {
        if (!part) return;
        if (part.charAt(0) === "*" && part.charAt(part.length - 1) === "*" && part.length > 2) {
          box.appendChild(el("strong", null, part.slice(1, -1)));
        } else {
          box.appendChild(document.createTextNode(part));
        }
      });
    });
  }

  /* ---------- Textos dinámicos ---------- */
  function renderServiceSelect() {
    var sel = $("f-service"), current = sel.value;
    sel.textContent = "";
    var first = el("option", null, t("serviceChoose"));
    first.value = "";
    sel.appendChild(first);
    ["airportN", "airportS", "port", "tour", "event", "other"].forEach(function (k) {
      var o = el("option", null, t("services." + k));
      o.value = k;
      sel.appendChild(o);
    });
    sel.value = current;
  }

  function fillList(id, items) {
    var ul = $(id);
    ul.textContent = "";
    items.forEach(function (s) { ul.appendChild(el("li", null, s)); });
  }

  function renderRoutes() {
    var box = $("routes-list");
    box.textContent = "";
    ["teide", "anaga", "garachico", "masca"].forEach(function (key) {
      var card = el("article", "route");
      var photo = el("div", "foto", t("photoRoute") + ": " + t("routes." + key));
      photo.setAttribute("role", "img");
      card.appendChild(photo);
      card.appendChild(el("h3", null, t("routes." + key)));
      var meta = el("p", "small");
      meta.appendChild(el("span", "tag", t("routeExample")));
      meta.appendChild(document.createTextNode(" " + t("routeDuration")));
      card.appendChild(meta);
      var btn = el("button", "btn btn-wa", t("routeBtn"));
      btn.type = "button";
      btn.addEventListener("click", function () {
        openWhatsApp(waNumber("central"), buildRoute(key, lang), null);
      });
      card.appendChild(btn);
      box.appendChild(card);
    });
  }

  function renderFaq() {
    var box = $("faq-list");
    box.textContent = "";
    t("faq").forEach(function (item) {
      var d = el("details", "faq");
      d.appendChild(el("summary", null, item.q));
      var p = el("p");
      if (item.pending) p.appendChild(el("span", "tag tag-pending", t("pending")));
      else p.textContent = item.a;
      d.appendChild(p);
      box.appendChild(d);
    });
  }

  function renderCentral() {
    var dl = $("central-qa");
    dl.textContent = "";
    t("centralQ").forEach(function (item) {
      dl.appendChild(el("dt", null, item.q));
      dl.appendChild(el("dd", null, item.a));
    });
    renderWa($("wa-example"), buildBooking(T.wa.example, T.wa.example.lang));
  }

  function renderAppButton() {
    var a = $("btn-app"), tag = $("app-tag"), note = $("app-note");
    if (CFG.app.url) {
      a.href = CFG.app.url;
      a.target = "_blank";
      a.rel = "noopener";
      tag.hidden = true;
      note.hidden = true;
    } else {
      a.href = "#";
      a.removeAttribute("target");
      tag.textContent = t("pending");
      tag.hidden = false;
      note.textContent = t("appPending");
      note.hidden = false;
    }
  }

  function applyLang(code) {
    lang = code;
    document.documentElement.lang = code;
    document.title = t("htmlTitle");
    all("[data-i]").forEach(function (n) { n.textContent = t(n.getAttribute("data-i")); });
    all("[data-i-ph]").forEach(function (n) { n.placeholder = t(n.getAttribute("data-i-ph")); });
    all("[data-i-aria]").forEach(function (n) { n.setAttribute("aria-label", t(n.getAttribute("data-i-aria"))); });
    all(".langs button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-lang") === code ? "true" : "false");
    });
    renderServiceSelect();
    fillList("services-list", t("servicesList"));
    fillList("fleet-list", t("fleetList"));
    renderRoutes();
    renderFaq();
    renderCentral();
    renderAppButton();
    all(".invalid").forEach(function (n) { n.classList.remove("invalid"); });
    $("form-status").textContent = "";
    $("cita-status").textContent = "";
  }

  /* ---------- Datos fijos (desde config.js) ---------- */
  function setPhone(linkId, numId, phone) {
    $(linkId).href = "tel:" + phone.tel;
    if (numId) $(numId).textContent = phone.display;
  }

  function initFixed() {
    var P = CFG.phones;
    setPhone("btn-call", "call-num", P.central);
    setPhone("bar-call", null, P.central);
    setPhone("tel-workshop", "tel-workshop-num", P.taller);
    setPhone("tel-trompo", "tel-trompo-num", P.trompo);
    setPhone("tel-general", "tel-general-num", P.general);
    $("trompo-addr").textContent = CFG.location.trompoAddress;
    $("foot-address").textContent = CFG.location.address;
    $("foot-map").href = "https://www.google.com/maps?q=" + CFG.location.lat + "," + CFG.location.lng;

    var barWa = $("bar-wa"), num = waNumber("central");
    if (num) {
      barWa.href = waUrl(num);
      barWa.target = "_blank";
      barWa.rel = "noopener";
    } else {
      barWa.addEventListener("click", function (e) { e.preventDefault(); toast(t("errNoWa")); });
    }

    $("btn-app").addEventListener("click", function (e) {
      if (!CFG.app.url) { e.preventDefault(); toast(t("pending") + ": " + t("appPending")); }
    });
  }

  /* ---------- Formularios ---------- */
  function todayIso() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, "0"), day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  function validate(form) {
    var missing = [];
    all("[data-req]", form).forEach(function (f) {
      var hidden = f.closest("[hidden]");
      var v = f.value.trim(), bad = !v;
      if (!bad && f.id === "f-people") bad = !(parseInt(v, 10) >= 1);
      if (!bad && f.type === "tel") bad = v.replace(/\D/g, "").length < 6;
      if (!bad && f.type === "date") bad = v < todayIso();
      f.classList.toggle("invalid", !hidden && bad);
      f.setAttribute("aria-invalid", !hidden && bad ? "true" : "false");
      if (!hidden && bad) missing.push(f);
    });
    return missing;
  }

  function reportMissing(statusBox, missing) {
    var names = missing.map(function (f) { return t(f.getAttribute("data-req")); });
    setStatus(statusBox, t("errMissing") + " " + names.join(", "));
    missing[0].focus();
  }

  function initForms() {
    var form = $("form-reserva"), status = $("form-status");
    var date = $("f-date");
    date.min = todayIso();

    $("f-service").addEventListener("change", function () {
      $("flight-field").hidden = !AIRPORT[this.value];
    });

    all("input, select, textarea", document).forEach(function (f) {
      f.addEventListener("input", function () {
        f.classList.remove("invalid");
        f.setAttribute("aria-invalid", "false");
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var missing = validate(form);
      if (missing.length) { reportMissing(status, missing); return; }
      var d = {
        service: $("f-service").value,
        pickup: $("f-pickup").value,
        dropoff: $("f-dropoff").value,
        date: $("f-date").value,
        time: $("f-time").value,
        people: $("f-people").value,
        bags: $("f-bags").value,
        flight: $("f-flight").value,
        extras: all('input[name="extras"]:checked', form).map(function (c) { return c.value; }),
        name: $("f-name").value,
        phone: $("f-phone").value,
        comments: $("f-comments").value
      };
      openWhatsApp(waNumber("central"), buildBooking(d, lang), status);
    });

    var cita = $("form-cita"), cstatus = $("cita-status");
    cita.addEventListener("submit", function (e) {
      e.preventDefault();
      var missing = validate(cita);
      if (missing.length) { reportMissing(cstatus, missing); return; }
      var d = { plate: $("c-plate").value, need: $("c-need").value, day: $("c-day").value };
      openWhatsApp(waNumber("taller"), buildAppointment(d, lang), cstatus);
    });
  }

  /* ---------- Arranque ---------- */
  initFixed();
  initForms();
  applyLang(lang);

  all(".langs button").forEach(function (b) {
    b.addEventListener("click", function () { applyLang(b.getAttribute("data-lang")); });
  });
})();
