/* 送你一朵玫瑰花 · Three.js 3D 花束模型
 * 模型：Grab3D Rose Bouquet（CC0 1.0，授权存证见 models/rose-bouquet-LICENSE.txt）
 * 加载失败 / WebGL 不可用时，自动回退到 js/rose.js 的 2D 点阵玫瑰。
 */
(function () {
  'use strict';

  const frame = document.querySelector('.rose-frame');
  const canvas2d = document.getElementById('roseCanvas');
  const loading = document.getElementById('roseLoading');
  if (!frame || !canvas2d) return;

  const MODEL_URL = 'models/rose-bouquet.glb';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FRAME_MS = 1000 / 30;

  // WebGL 能力检测：不支持就直接留在 2D 玫瑰，不折腾
  function hasWebGL() {
    try {
      const c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext &&
        (c.getContext('webgl2') || c.getContext('webgl')));
    } catch (_) { return false; }
  }
  if (!hasWebGL()) return;

  let THREE = null;
  let GLTFLoader = null;
  let renderer, scene, camera, model, rafId = null;
  let lastFrame = 0;
  let rotation = 0;
  let autoRotate = !reduceMotion;
  let dragging = false;
  let lastX = 0;
  let resumeTimer = null;
  let visible = false;
  let ready = false;
  const threeCanvas = document.createElement('canvas');
  threeCanvas.id = 'rose3dCanvas';
  threeCanvas.setAttribute('aria-label', '可拖动旋转的 3D 玫瑰花束');

  // 3D 初始化失败 → 恢复 2D 玫瑰原样
  function fallback(err) {
    if (err) console.warn('[rose3d] 3D 加载失败，回退 2D 玫瑰：', err);
    threeCanvas.remove();
    frame.classList.remove('rose-3d-active');
  }

  // 本地 Three.js（js/vendor/），无 CDN 依赖；动态 import 失败也能被 catch
  async function loadThree() {
    const THREE_MOD = await import('./vendor/three.module.js');
    const LOADER_MOD = await import('./vendor/loaders/GLTFLoader.js');
    THREE = THREE_MOD;
    GLTFLoader = LOADER_MOD.GLTFLoader;
  }

  function initScene() {
    renderer = new THREE.WebGLRenderer({ canvas: threeCanvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = false;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(38, 4 / 3, 0.01, 100);
    camera.position.set(0, 0.12, 1.35);
    camera.lookAt(0, 0, 0);

    // 柔和布光：环境光打底 + 主光 + 粉调补光，贴合奶油粉主题
    scene.add(new THREE.AmbientLight(0xffffff, 1.9));
    const key = new THREE.DirectionalLight(0xfff4ee, 2.6);
    key.position.set(1.2, 2.0, 2.2);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffc9dd, 1.2);
    fill.position.set(-1.6, 0.6, -1.2);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffffff, 0.9);
    rim.position.set(0, -1.0, -1.5);
    scene.add(rim);

    resize();
  }

  function resize() {
    if (!renderer || !camera) return;
    const w = frame.clientWidth - (window.innerWidth <= 560 ? 16 : 28);
    const h = frame.clientHeight - (window.innerWidth <= 560 ? 16 : 28);
    if (w <= 0 || h <= 0) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function draw() {
    if (!ready || !renderer) return;
    if (autoRotate) rotation += 0.0045;
    model.rotation.y = rotation;
    renderer.render(scene, camera);
  }

  function frameLoop(ts) {
    rafId = requestAnimationFrame(frameLoop);
    if (ts - lastFrame < FRAME_MS) return;
    lastFrame = ts;
    draw();
  }

  function play() {
    if (rafId !== null || !visible || document.hidden || reduceMotion) return;
    rafId = requestAnimationFrame(frameLoop);
  }
  function pause() {
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
  }

  // 加载 GLB，居中并整体缩放到画面合适大小
  function loadModel() {
    return new Promise((resolve, reject) => {
      new GLTFLoader().load(MODEL_URL, gltf => {
        try {
          model = gltf.scene;
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          model.position.sub(center);            // 几何中心归零，旋转不偏心
          const maxDim = Math.max(size.x, size.y, size.z) || 1;
          const group = new THREE.Group();
          group.add(model);
          const s = 0.72 / maxDim;                // 模型最长边缩放到 0.72 世界单位
          group.scale.setScalar(s);
          group.rotation.x = -0.42;               // 花束平躺，前倾向观众露出花面
          scene.add(group);
          model = group;
          ready = true;
          resolve();
        } catch (e) { reject(e); }
      }, undefined, reject);
    });
  }

  function bindInteractions() {
    threeCanvas.addEventListener('pointerdown', e => {
      dragging = true;
      lastX = e.clientX;
      if (resumeTimer) { clearTimeout(resumeTimer); resumeTimer = null; }
      autoRotate = false;
      if (threeCanvas.setPointerCapture) {
        try { threeCanvas.setPointerCapture(e.pointerId); } catch (_) {}
      }
    });
    threeCanvas.addEventListener('pointermove', e => {
      if (!dragging) return;
      rotation += (e.clientX - lastX) * 0.008;
      lastX = e.clientX;
      if (reduceMotion) draw();
    });
    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      if (!reduceMotion) resumeTimer = setTimeout(() => { autoRotate = true; }, 2500);
    };
    threeCanvas.addEventListener('pointerup', endDrag);
    threeCanvas.addEventListener('pointercancel', endDrag);
    threeCanvas.addEventListener('lostpointercapture', endDrag);

    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) pause();
      else if (visible) { if (reduceMotion) draw(); else play(); }
    });

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        if (visible) { if (reduceMotion) draw(); else play(); }
        else pause();
      }, { threshold: 0.05 });
      io.observe(frame);
    } else {
      visible = true;
      if (reduceMotion) draw(); else play();
    }
  }

  async function boot() {
    try {
      await loadThree();
      initScene();
      await loadModel();
    } catch (e) {
      fallback(e);
      return;
    }

    // 3D 就绪：隐藏 2D 画布，显示 3D 画布（保留 DOM 以便失败时恢复）
    frame.insertBefore(threeCanvas, canvas2d);
    frame.classList.add('rose-3d-active');
    if (loading) loading.hidden = true;
    bindInteractions();
    resize();
    if (reduceMotion) draw(); else if (visible) play();
  }

  // 首次滚到玫瑰区才加载 three.js（几百 KB），不拖慢首屏
  if ('IntersectionObserver' in window) {
    const bootObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        bootObserver.disconnect();
        boot();
      }
    }, { threshold: 0.05, rootMargin: '120px' });
    bootObserver.observe(frame);
  } else {
    boot();
  }
})();
