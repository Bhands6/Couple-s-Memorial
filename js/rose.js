/* ============================================================
   送你一朵玫瑰花 —— canvas 3D 点阵玫瑰
   · 移植自经典 calc() 点阵玫瑰算法，只保留玫瑰本体
   · 移除原版的粒子背景 / 进度条 / 控制按钮 / 英文标题
   · 性能处理：点数按设备降级、30fps 限帧、进入视口才初始化与渲染
   ============================================================ */
(() => {
  'use strict';

  const canvas = document.getElementById('roseCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d'); // 保留 alpha：透明处透出 CSS 深色画框
  if (!ctx) return;

  const loading = document.getElementById('roseLoading');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const W = canvas.width;   // 640
  const H = canvas.height;  // 480
  const rosesize = 500;
  const h = -250;

  // 原版 50 万点在手机上会卡死，按设备能力分级
  const lowPower = window.innerWidth < 720 ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
    (navigator.deviceMemory && navigator.deviceMemory <= 4);
  const numPoints = lowPower ? 70000 : 180000;

  let rotationAngle = 0;
  const bloomFactor = 1.0;
  let autoRotate = !reduceMotion;
  let dragging = false;
  let lastX = 0;
  let resumeTimer = null;

  // ---- 玫瑰形状的数学（原样保留） ----
  function calc(a, b, c, angle = 0, bloom = 1.0) {
    let j, n, o, w, z;
    const rotatedA = ((a + angle * 0.1) % 1 + 1) % 1;

    if (c > 60) {
      const k = 13 + 5 / (0.2 + Math.pow(b * 4, 4));
      return {
        x: Math.sin(rotatedA * 7) * k - Math.sin(b) * 50,
        y: b * rosesize * bloom + 50,
        z: 625 + Math.cos(rotatedA * 7) * k + b * 400,
        r: rotatedA - b / 2,
        g: rotatedA,
      };
    }

    const A = rotatedA * 2 - 1;
    const B = b * 2 - 1;

    if (A * A + B * B < 1) {
      if (c > 37) {
        j = ~~c & 1;
        n = j ? 6 : 4;
        o = 0.5 / (rotatedA + 0.01) + Math.cos(b * 125) * 3 - rotatedA * 300;
        w = b * h;
        return {
          x: o * Math.cos(n) + w * Math.sin(n) + j * 610 - 390,
          y: o * Math.sin(n) - w * Math.cos(n) + 550 - j * 350,
          z: 1180 + Math.cos(B + A) * 99 - j * 300,
          r: 0.4 - rotatedA * 0.1 + Math.pow(1 - B * B, -h * 6) * 0.15 - rotatedA * b * 0.4 +
             Math.cos(rotatedA + b) / 5 +
             Math.pow(Math.cos((o * (rotatedA + 1) + (B > 0 ? w : -w)) / 25), 30) * 0.1 * (1 - B * B),
          g: o / 1000 + 0.7 - o * w * 0.000003,
        };
      }
      if (c > 32) {
        c = c * 1.16 - 0.15;
        o = rotatedA * 45 - 20;
        w = b * b * h;
        z = o * Math.sin(c) + w * Math.cos(c) + 620;
        return {
          x: o * Math.cos(c) - w * Math.sin(c),
          y: 28 + Math.cos(B * 0.5) * 99 - b * b * b * 60 - z / 2 - h,
          z,
          r: (b * b * 0.3 + Math.pow(1 - A * A, 7) * 0.15 + 0.3) * b,
          g: b * 0.7,
        };
      }
      o = A * (2 - b) * (80 - c * 2);
      w = 99 - Math.cos(A) * 120 - Math.cos(b) * (-h - c * 4.9) +
          Math.cos(Math.pow(1 - b, 7)) * 50 + c * 2;
      z = o * Math.sin(c) + w * Math.cos(c) + 700;
      return {
        x: o * Math.cos(c) - w * Math.sin(c),
        y: B * 99 - Math.cos(Math.pow(b, 7)) * 50 - c / 3 - z / 1.35 + 450,
        z,
        r: (1 - b / 1.2) * 0.9 + rotatedA * 0.1,
        g: Math.pow(1 - b, 20) / 4 + 0.05,
      };
    }
    return null;
  }

  // ---- 懒初始化：首次进入视口才生成点，避免拖慢首屏 ----
  let points = null;
  let imageData = null;
  let data = null;
  let zBuffer = null;

  function ensurePoints() {
    if (points) return;
    points = [];
    for (let i = 0; i < numPoints; i++) {
      const a = Math.random();
      const b = Math.random();
      const c = Math.floor(Math.random() * 46) / 0.74;
      const dot = calc(a, b, c);
      if (dot) {
        const dist = Math.sqrt(dot.x * dot.x + dot.y * dot.y + dot.z * dot.z);
        points.push({ a, b, c, dist });
      }
    }
    points.sort((p1, p2) => p1.dist - p2.dist);
    imageData = ctx.createImageData(W, H);
    data = imageData.data;
    zBuffer = new Float32Array(W * H);
  }

  let appearance = reduceMotion ? 1 : 0;
  let appearStart = 0;
  let lastFrame = 0;
  const FRAME_MS = 1000 / 30; // 点阵渲染很重，30fps 足够且省电
  let rafId = null;
  let visible = false;

  function render() {
    ensurePoints();
    data.fill(0);
    zBuffer.fill(Infinity);
    const shown = Math.floor(points.length * Math.min(appearance, 1));
    for (let i = 0; i < shown; i++) {
      const p = points[i];
      const dot = calc(p.a, p.b, p.c, rotationAngle, bloomFactor);
      if (!dot) continue;
      const z = dot.z;
      if (z <= 0) continue;
      const scale = rosesize / z;
      const px = Math.round(dot.x * scale + W / 2);
      const py = Math.round(dot.y * scale + H / 2);
      if (px < 0 || px >= W || py < 0 || py >= H) continue;
      const idx = py * W + px;
      if (z >= zBuffer[idx]) continue;
      zBuffer[idx] = z;

      const r = ~(dot.r * h) & 0xFF;
      const g = ~(dot.g * h) & 0xFF;
      const b = ~(dot.r * dot.r * -80) & 0xFF;
      let alpha = 255;
      if (appearance < 1) {
        const t = (appearance - (i / points.length) * 0.5) * 2;
        alpha = Math.floor(255 * (t < 0 ? 0 : t > 1 ? 1 : t));
      }
      const pi = idx * 4;
      data[pi] = r;
      data[pi + 1] = g;
      data[pi + 2] = b;
      data[pi + 3] = alpha;
    }
    ctx.putImageData(imageData, 0, 0);
    if (loading) loading.hidden = true;
  }

  function frame(ts) {
    rafId = requestAnimationFrame(frame);
    if (ts - lastFrame < FRAME_MS) return;
    lastFrame = ts;
    if (appearance < 1) {
      const prog = Math.min((ts - appearStart) / 1400, 1);
      appearance = 1 - Math.pow(1 - prog, 3);
    }
    if (autoRotate && appearance >= 1) rotationAngle += 0.03;
    render();
  }

  function play() {
    if (rafId !== null || !visible || document.hidden) return;
    if (!appearStart) appearStart = performance.now();
    rafId = requestAnimationFrame(frame);
  }
  function pause() {
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
  }

  // 进入视口才渲染，离开即暂停（省电、不拖慢首屏）
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        visible = en.isIntersecting;
        if (visible) {
          if (reduceMotion) render();
          else play();
        } else {
          pause();
        }
      });
    }, { threshold: 0.05 });
    io.observe(canvas);
  } else {
    visible = true;
    if (reduceMotion) render();
    else play();
  }

  // 拖动旋转（触摸 / 鼠标统一用 Pointer Events）
  canvas.addEventListener('pointerdown', e => {
    dragging = true;
    lastX = e.clientX;
    if (resumeTimer) { clearTimeout(resumeTimer); resumeTimer = null; }
    autoRotate = false;
    if (canvas.setPointerCapture) {
      try { canvas.setPointerCapture(e.pointerId); } catch (_) { /* 忽略 */ }
    }
  });
  canvas.addEventListener('pointermove', e => {
    if (!dragging) return;
    rotationAngle += (e.clientX - lastX) * 0.01;
    lastX = e.clientX;
    if (reduceMotion) render(); // 静态模式下手动重绘
  });
  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    if (!reduceMotion) resumeTimer = setTimeout(() => { autoRotate = true; }, 2500);
  };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);
  canvas.addEventListener('lostpointercapture', endDrag);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pause();
    else if (visible) { if (reduceMotion) render(); else play(); }
  });
})();
