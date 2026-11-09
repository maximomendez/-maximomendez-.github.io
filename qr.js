/* Generador de códigos QR propio, sin dependencias y sin internet.
 * Modo byte (UTF-8), corrección de errores nivel M, versiones 1 a 10
 * (hasta 213 bytes: de sobra para una dirección web).
 * Uso:  QR.svg("https://ejemplo.com", { border: 4 })  ->  texto SVG
 */
(function (root) {
  "use strict";

  // Nivel M, versiones 1..10
  var ECC_PER_BLOCK = [10, 16, 26, 18, 24, 16, 18, 22, 22, 26];
  var NUM_BLOCKS = [1, 1, 1, 2, 2, 4, 4, 4, 5, 5];
  var MAX_VERSION = 10;

  /* ---------- Reed-Solomon sobre GF(256), polinomio 0x11D ---------- */
  function gfMul(x, y) {
    var z = 0;
    for (var i = 7; i >= 0; i--) {
      z = (z << 1) ^ ((z >>> 7) * 0x11d);
      z ^= ((y >>> i) & 1) * x;
    }
    return z;
  }

  function rsDivisor(degree) {
    var result = [];
    for (var i = 0; i < degree - 1; i++) result.push(0);
    result.push(1);
    var root = 1;
    for (var d = 0; d < degree; d++) {
      for (var j = 0; j < result.length; j++) {
        result[j] = gfMul(result[j], root);
        if (j + 1 < result.length) result[j] ^= result[j + 1];
      }
      root = gfMul(root, 0x02);
    }
    return result;
  }

  function rsRemainder(data, divisor) {
    var result = divisor.map(function () { return 0; });
    data.forEach(function (b) {
      var factor = b ^ result.shift();
      result.push(0);
      divisor.forEach(function (coef, i) { result[i] ^= gfMul(coef, factor); });
    });
    return result;
  }

  /* ---------- Capacidad ---------- */
  function rawModules(ver) {
    var r = (16 * ver + 128) * ver + 64;
    if (ver >= 2) {
      var n = Math.floor(ver / 7) + 2;
      r -= (25 * n - 10) * n - 55;
      if (ver >= 7) r -= 36;
    }
    return r;
  }

  function dataCodewords(ver) {
    return Math.floor(rawModules(ver) / 8) - ECC_PER_BLOCK[ver - 1] * NUM_BLOCKS[ver - 1];
  }

  function utf8Bytes(text) {
    var s = unescape(encodeURIComponent(text));
    var out = [];
    for (var i = 0; i < s.length; i++) out.push(s.charCodeAt(i));
    return out;
  }

  function bit(x, i) { return ((x >>> i) & 1) !== 0; }

  /* ---------- Datos -> palabras de código ---------- */
  function encodeData(bytes, ver) {
    var bits = [];
    function push(val, len) { for (var i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1); }
    push(0x4, 4); // modo byte
    push(bytes.length, ver < 10 ? 8 : 16);
    bytes.forEach(function (b) { push(b, 8); });
    var capBits = dataCodewords(ver) * 8;
    push(0, Math.min(4, capBits - bits.length)); // terminador
    while (bits.length % 8) bits.push(0);
    for (var pad = 0xec; bits.length < capBits; pad ^= 0xec ^ 0x11) push(pad, 8);
    var words = [];
    for (var i = 0; i < bits.length; i += 8) {
      var v = 0;
      for (var j = 0; j < 8; j++) v = (v << 1) | bits[i + j];
      words.push(v);
    }
    return words;
  }

  function addEccAndInterleave(data, ver) {
    var numBlocks = NUM_BLOCKS[ver - 1];
    var eccLen = ECC_PER_BLOCK[ver - 1];
    var rawCw = Math.floor(rawModules(ver) / 8);
    var numShort = numBlocks - (rawCw % numBlocks);
    var shortLen = Math.floor(rawCw / numBlocks);
    var divisor = rsDivisor(eccLen);
    var blocks = [];
    for (var i = 0, k = 0; i < numBlocks; i++) {
      var len = shortLen - eccLen + (i < numShort ? 0 : 1);
      var dat = data.slice(k, k + len);
      k += len;
      var ecc = rsRemainder(dat, divisor);
      if (i < numShort) dat.push(0); // hueco para alinear
      blocks.push(dat.concat(ecc));
    }
    var result = [];
    for (var col = 0; col < blocks[0].length; col++) {
      for (var b = 0; b < blocks.length; b++) {
        if (col !== shortLen - eccLen || b >= numShort) result.push(blocks[b][col]);
      }
    }
    return result;
  }

  /* ---------- Matriz ---------- */
  function Matrix(ver) {
    this.ver = ver;
    this.size = ver * 4 + 17;
    this.mod = [];
    this.fn = [];
    for (var y = 0; y < this.size; y++) {
      var r = [], f = [];
      for (var x = 0; x < this.size; x++) { r.push(false); f.push(false); }
      this.mod.push(r);
      this.fn.push(f);
    }
  }

  Matrix.prototype.setFn = function (x, y, dark) {
    this.mod[y][x] = dark;
    this.fn[y][x] = true;
  };

  Matrix.prototype.drawFunctionPatterns = function () {
    var size = this.size, i;
    for (i = 0; i < size; i++) {
      this.setFn(6, i, i % 2 === 0);
      this.setFn(i, 6, i % 2 === 0);
    }
    this.drawFinder(3, 3);
    this.drawFinder(size - 4, 3);
    this.drawFinder(3, size - 4);
    var pos = this.alignPositions(), n = pos.length;
    for (i = 0; i < n; i++) {
      for (var j = 0; j < n; j++) {
        if ((i === 0 && j === 0) || (i === 0 && j === n - 1) || (i === n - 1 && j === 0)) continue;
        this.drawAlign(pos[i], pos[j]);
      }
    }
    this.drawFormat(0);
    this.drawVersion();
  };

  Matrix.prototype.alignPositions = function () {
    var ver = this.ver;
    if (ver === 1) return [];
    var n = Math.floor(ver / 7) + 2;
    var step = Math.ceil((ver * 4 + 4) / (n * 2 - 2)) * 2;
    var res = [6];
    for (var p = this.size - 7; res.length < n; p -= step) res.splice(1, 0, p);
    return res;
  };

  Matrix.prototype.drawFinder = function (cx, cy) {
    for (var dy = -4; dy <= 4; dy++) {
      for (var dx = -4; dx <= 4; dx++) {
        var dist = Math.max(Math.abs(dx), Math.abs(dy));
        var x = cx + dx, y = cy + dy;
        if (x >= 0 && x < this.size && y >= 0 && y < this.size) {
          this.setFn(x, y, dist !== 2 && dist !== 4);
        }
      }
    }
  };

  Matrix.prototype.drawAlign = function (cx, cy) {
    for (var dy = -2; dy <= 2; dy++) {
      for (var dx = -2; dx <= 2; dx++) {
        this.setFn(cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
      }
    }
  };

  Matrix.prototype.drawFormat = function (mask) {
    var data = (0 << 3) | mask; // nivel M = 00
    var rem = data, i;
    for (i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    var bits = ((data << 10) | rem) ^ 0x5412;
    var size = this.size;
    for (i = 0; i <= 5; i++) this.setFn(8, i, bit(bits, i));
    this.setFn(8, 7, bit(bits, 6));
    this.setFn(8, 8, bit(bits, 7));
    this.setFn(7, 8, bit(bits, 8));
    for (i = 9; i < 15; i++) this.setFn(14 - i, 8, bit(bits, i));
    for (i = 0; i < 8; i++) this.setFn(size - 1 - i, 8, bit(bits, i));
    for (i = 8; i < 15; i++) this.setFn(8, size - 15 + i, bit(bits, i));
    this.setFn(8, size - 8, true);
  };

  Matrix.prototype.drawVersion = function () {
    if (this.ver < 7) return;
    var rem = this.ver;
    for (var i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    var bits = (this.ver << 12) | rem;
    for (i = 0; i < 18; i++) {
      var a = this.size - 11 + (i % 3), b = Math.floor(i / 3);
      this.setFn(a, b, bit(bits, i));
      this.setFn(b, a, bit(bits, i));
    }
  };

  Matrix.prototype.drawCodewords = function (data) {
    var size = this.size, i = 0;
    for (var right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (var vert = 0; vert < size; vert++) {
        for (var j = 0; j < 2; j++) {
          var x = right - j;
          var upward = ((right + 1) & 2) === 0;
          var y = upward ? size - 1 - vert : vert;
          if (!this.fn[y][x] && i < data.length * 8) {
            this.mod[y][x] = bit(data[i >>> 3], 7 - (i & 7));
            i++;
          }
        }
      }
    }
  };

  var MASKS = [
    function (x, y) { return (x + y) % 2 === 0; },
    function (x, y) { return y % 2 === 0; },
    function (x, y) { return x % 3 === 0; },
    function (x, y) { return (x + y) % 3 === 0; },
    function (x, y) { return (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0; },
    function (x, y) { return ((x * y) % 2) + ((x * y) % 3) === 0; },
    function (x, y) { return (((x * y) % 2) + ((x * y) % 3)) % 2 === 0; },
    function (x, y) { return (((x + y) % 2) + ((x * y) % 3)) % 2 === 0; }
  ];

  Matrix.prototype.applyMask = function (mask) {
    for (var y = 0; y < this.size; y++) {
      for (var x = 0; x < this.size; x++) {
        if (!this.fn[y][x] && MASKS[mask](x, y)) this.mod[y][x] = !this.mod[y][x];
      }
    }
  };

  Matrix.prototype.penalty = function () {
    var size = this.size, m = this.mod, score = 0, x, y, run, i;
    // Reglas 1 y 3 en filas y columnas
    var PAT_A = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0];
    var PAT_B = [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1];
    for (var dir = 0; dir < 2; dir++) {
      for (y = 0; y < size; y++) {
        var line = [];
        for (x = 0; x < size; x++) line.push((dir === 0 ? m[y][x] : m[x][y]) ? 1 : 0);
        run = 1;
        for (x = 1; x <= size; x++) {
          if (x < size && line[x] === line[x - 1]) run++;
          else { if (run >= 5) score += 3 + (run - 5); run = 1; }
        }
        for (x = 0; x + 11 <= size; x++) {
          var a = true, b = true;
          for (i = 0; i < 11; i++) {
            if (line[x + i] !== PAT_A[i]) a = false;
            if (line[x + i] !== PAT_B[i]) b = false;
          }
          if (a) score += 40;
          if (b) score += 40;
        }
      }
    }
    // Regla 2: bloques 2x2
    var dark = 0;
    for (y = 0; y < size; y++) {
      for (x = 0; x < size; x++) {
        if (m[y][x]) dark++;
        if (x < size - 1 && y < size - 1 &&
            m[y][x] === m[y][x + 1] && m[y][x] === m[y + 1][x] && m[y][x] === m[y + 1][x + 1]) score += 3;
      }
    }
    // Regla 4: proporción de oscuros
    var total = size * size;
    score += (Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1) * 10;
    return score;
  };

  /* ---------- API ---------- */
  function encode(text) {
    var bytes = utf8Bytes(String(text));
    var ver = 1;
    for (; ver <= MAX_VERSION; ver++) {
      var lenBits = ver < 10 ? 8 : 16;
      if (4 + lenBits + bytes.length * 8 <= dataCodewords(ver) * 8) break;
    }
    if (ver > MAX_VERSION) throw new Error("Texto demasiado largo para el QR");

    var codewords = addEccAndInterleave(encodeData(bytes, ver), ver);
    var best = null, bestScore = Infinity;
    for (var mask = 0; mask < 8; mask++) {
      var mx = new Matrix(ver);
      mx.drawFunctionPatterns();
      mx.drawCodewords(codewords);
      mx.applyMask(mask);
      mx.drawFormat(mask);
      var s = mx.penalty();
      if (s < bestScore) { bestScore = s; best = mx; }
    }
    return { size: best.size, modules: best.mod, version: ver };
  }

  function svg(text, opts) {
    opts = opts || {};
    var border = opts.border == null ? 4 : opts.border;
    var qr = encode(text);
    var dim = qr.size + border * 2;
    var d = [];
    for (var y = 0; y < qr.size; y++) {
      for (var x = 0; x < qr.size; x++) {
        if (qr.modules[y][x]) d.push("M" + (x + border) + "," + (y + border) + "h1v1h-1z");
      }
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + dim + " " + dim +
      '" shape-rendering="crispEdges" role="img" aria-label="Código QR">' +
      '<rect width="100%" height="100%" fill="#fff"/>' +
      '<path d="' + d.join("") + '" fill="#000"/></svg>';
  }

  root.QR = { encode: encode, svg: svg };
  if (typeof module !== "undefined" && module.exports) module.exports = root.QR;
})(typeof window !== "undefined" ? window : this);
