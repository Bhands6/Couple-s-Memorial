/* ============================================================
   送你一朵玫瑰花 · 2D 点阵渲染
   嵌入自独立页面，保留原参数化玫瑰算法；
   增加：进入视口才初始化、30fps 限帧、离屏/切后台暂停、
        prefers-reduced-motion 静态单帧降级。
   ============================================================ */
(function () {
  'use strict';

  var canvas = document.getElementById('roseCanvas');
  if (!canvas) return;

  var OW = 720, OH = 540;
  var rosesize = 500;
  var h = -250;

  /* ---------- 参数化玫瑰 ---------- */
  function calc(a, b, c, angle, bloom) {
    var j, n, o, w, z;
    var rotatedA = ((a + angle * 0.1) % 1 + 1) % 1;

    if (c > 60) { /* 花茎 */
      return {
        x: Math.sin(rotatedA * 7) * (13 + 5 / (0.2 + Math.pow(b * 4, 4))) - Math.sin(b) * 50,
        y: b * rosesize * bloom + 50,
        z: 625 + Math.cos(rotatedA * 7) * (13 + 5 / (0.2 + Math.pow(b * 4, 4))) + b * 400,
        r: rotatedA * 1 - b / 2,
        g: rotatedA
      };
    }

    var A = rotatedA * 2 - 1;
    var B = b * 2 - 1;

    if (A * A + B * B < 1) {
      if (c > 37) { /* 叶片 */
        j = (~~c & 1);
        n = j ? 6 : 4;
        o = 0.5 / (rotatedA + 0.01) + Math.cos(b * 125) * 3 - rotatedA * 300;
        w = b * h;
        return {
          x: o * Math.cos(n) + w * Math.sin(n) + j * 610 - 390,
          y: o * Math.sin(n) - w * Math.cos(n) + 550 - j * 350,
          z: 1180 + Math.cos(B + A) * 99 - j * 300,
          r: 0.4 - rotatedA * 0.1 + Math.pow(1 - B * B, -h * 6) * 0.15 - rotatedA * b * 0.4 +
             Math.cos(rotatedA + b) / 5 + Math.pow(Math.cos((o * (rotatedA + 1) + (B > 0 ? w : -w)) / 25), 30) * 0.1 * (1 - B * B),
          g: o / 1000 + 0.7 - o * w * 0.000003
        };
      }

      if (c > 32) { /* 花萼 */
        c = c * 1.16 - 0.15;
        o = rotatedA * 45 - 20;
        w = b * b * h;
        z = o * Math.sin(c) + w * Math.cos(c) + 620;
        return {
          x: o * Math.cos(c) - w * Math.sin(c),
          y: 28 + Math.cos(B * 0.5) * 99 - b * b * b * 60 - z / 2 - h,
          z: z,
          r: (b * b * 0.3 + Math.pow(1 - A * A, 7) * 0.15 + 0.3) * b,
          g: b * 0.7
        };
      }

      /* 花瓣 */
      o = A * (2 - b) * (80 - c * 2);
      w = 99 - Math.cos(A) * 120 - Math.cos(b) * (-h - c * 4.9) + Math.cos(Math.pow(1 - b, 7)) * 50 + c * 2;
      z = o * Math.sin(c) + w * Math.cos(c) + 700;
      return {
        x: o * Math.cos(c) - w * Math.sin(c),
        y: B * 99 - Math.cos(Math.pow(b, 7)) * 50 - c / 3 - z / 1.35 + 450,
        z: z,
        r: (1 - b / 1.2) * 0.9 + rotatedA * 0.1,
        g: Math.pow(1 - b, 20) / 4 + 0.05
      };
    }
    return null;
  }

  /* ---------- 点云 ---------- */
  var points = [];
  var ATTEMPTS = window.innerWidth < 700 ? 90000 : 165000;

  function generatePoints() {
    points.length = 0;
    for (var i = 0; i < ATTEMPTS; i++) {
      var a = Math.random();
      var b = Math.random();
      var c = (Math.floor(Math.random() * 46)) / 0.74;
      var dot = calc(a, b, c, 0, 1);
      if (dot) {
        var d = Math.sqrt(dot.x * dot.x + dot.y * dot.y + dot.z * dot.z);
        points.push({ a: a, b: b, c: c, distance: d });
      }
    }
    points.sort(function (p1, p2) { return p1.distance - p2.distance; });
  }

  /* ---------- 画布 / 离屏缓冲 ---------- */
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var off = document.createElement('canvas');
  off.width = OW; off.height = OH;
  var offCtx = off.getContext('2d');
  var imgData = offCtx.createImageData(OW, OH);
  var buf = imgData.data;
  var zBuffer = new Float32Array(OW * OH);

  var dispW = 0, dispH = 0, dpr = 1;
  var fitX = 0, fitY = 0, fitW = 0, fitH = 0;

  function resize() {
    var rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    dispW = canvas.width;
    dispH = canvas.height;

    var availW = dispW * 0.92, availH = dispH * 0.92;
    if (availW / availH > OW / OH) {
      fitH = availH; fitW = fitH * (OW / OH);
    } else {
      fitW = availW; fitH = fitW * (OH / OW);
    }
    fitX = (dispW - fitW) / 2;
    fitY = (dispH - fitH) / 2;
  }

  /* ---------- 渲染 ---------- */
  var rotationAngle = 0;
  var bloomFactor = 1.0;
  var rotationSpeed = 0.013;
  var appearanceProgress = 0;
  var appearanceStartTime = 0;
  var appearanceDuration = 1100;
  var isAppearanceComplete = false;

  function renderRose() {
    buf.fill(0);
    zBuffer.fill(Infinity);

    var visible = Math.floor(points.length * Math.min(appearanceProgress, 1));

    for (var i = 0; i < visible; i++) {
      var pt = points[i];
      var dot = calc(pt.a, pt.b, pt.c, rotationAngle, bloomFactor);
      if (!dot) continue;
      if (dot.z <= 0) continue;

      var scale = rosesize / dot.z;
      var px = (dot.x * scale + OW / 2) | 0;
      var py = (dot.y * scale + OH / 2) | 0;
      if (px < 0 || px >= OW || py < 0 || py >= OH) continue;

      var idx = py * OW + px;
      if (dot.z >= zBuffer[idx]) continue;
      zBuffer[idx] = dot.z;

      var r = ~(dot.r * h) & 255;
      var g = ~(dot.g * h) & 255;
      var b = ~(dot.r * dot.r * -80) & 255;

      r = r + ((255 - r) >> 3);
      g = g + ((255 - g) >> 5);
      b = b + ((255 - b) >> 3);

      var alpha = 255;
      if (!isAppearanceComplete) {
        var pointAppearance = Math.min(Math.max((appearanceProgress - (i / points.length) * 0.5) * 2, 0), 1);
        alpha = (255 * pointAppearance) | 0;
      }

      var pi = idx * 4;
      buf[pi] = r;
      buf[pi + 1] = g;
      buf[pi + 2] = b;
      buf[pi + 3] = alpha;
    }
    offCtx.putImageData(imgData, 0, 0);
  }

  function composite() {
    ctx.clearRect(0, 0, dispW, dispH);
    ctx.drawImage(off, fitX, fitY, fitW, fitH);
  }

  /* ---------- 调度：懒加载 / 限帧 / 离屏暂停 ---------- */
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var started = false;
  var visible = false;
  var hidden = document.hidden;
  var raf = 0;
  var lastFrame = 0;

  function tick(ts) {
    raf = window.requestAnimationFrame(tick);
    if (!visible || hidden) { lastFrame = ts; return; }
    if (ts - lastFrame < 1000 / 30) return;   /* 30fps 上限 */
    lastFrame = ts;

    var elapsed = Date.now() - appearanceStartTime;
    if (elapsed < appearanceDuration) {
      var p = elapsed / appearanceDuration;
      appearanceProgress = 1 - Math.pow(1 - p, 3);
    } else {
      appearanceProgress = 1;
      isAppearanceComplete = true;
    }

    var spinRamp = Math.min(elapsed / (appearanceDuration * 1.2), 1);
    rotationAngle += rotationSpeed * (1 - Math.pow(1 - spinRamp, 3));

    renderRose();
    composite();
  }

  function start() {
    if (started) return;
    started = true;
    generatePoints();
    resize();
    appearanceStartTime = Date.now();

    if (reduceMotion) {
      appearanceProgress = 1;
      isAppearanceComplete = true;
      renderRose();
      composite();
      return; /* 静态单帧，不启动动画循环 */
    }
    raf = window.requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        visible = e.isIntersecting;
        if (visible) start();
      });
    }, { rootMargin: '120px' });
    io.observe(canvas);
  } else {
    visible = true;
    start();
  }

  window.addEventListener('resize', function () {
    if (!started) return;
    resize();
    if (reduceMotion) { renderRose(); composite(); }
  });

  document.addEventListener('visibilitychange', function () {
    hidden = document.hidden;
    if (!hidden) lastFrame = 0;
  });
})();
