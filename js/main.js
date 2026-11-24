(() => {
  'use strict';

  // ============================================================
  //  在这里修改你们的信息：名字、在一起的日期、文字、照片等
  // ============================================================
  const CONFIG = {
    nameA: '小鹿',
    nameB: '小兔',
    startDate: '2023-05-20T00:00:00',          // 在一起的时间
    anniversary: { month: 5, day: 20 },        // 纪念日（月/日）

    // 首页打字机轮播句子
    taglines: [
      '遇见你之后，每一天都值得被记录。',
      '你是我平淡生活里，最亮的那颗星。',
      '世界很大，但我只想和你回家。',
      '往后余生，请多指教。',
    ],

    // 情书内容（\n 表示换行）
    letter: `见字如面。

其实想说的话很多，真落笔的时候，又不知道从哪一句开始。

我记得第一次见你时的紧张，记得你笑起来眼睛弯弯的样子，记得我们一起走过的每一条街、看过的每一场电影、吃过的每一家小店。

这些琐碎的小事，拼在一起，就是我全部的幸福。

谢谢你出现在我的生命里，让“以后”这两个字，变得那么让人期待。

我会一直牵着你的手，慢慢走，不着急。`,

    // 相册：把照片放进 images 文件夹后，加上 src: 'images/xxx.jpg' 即可替换占位图
    photos: [
      { caption: '第一次一起看的海', emoji: '🌊', gradient: 'linear-gradient(135deg,#89f7fe,#66a6ff)' },
      { caption: '你笑起来真好看', emoji: '😄', gradient: 'linear-gradient(135deg,#fad0c4,#ffd1ff)' },
      { caption: '我们的第一张合照', emoji: '🥂', gradient: 'linear-gradient(135deg,#ff9a9e,#fecfef)' },
      { caption: '一起吃过的深夜火锅', emoji: '🍲', gradient: 'linear-gradient(135deg,#f6d365,#fda085)' },
      { caption: '雨天的伞下', emoji: '☔', gradient: 'linear-gradient(135deg,#a1c4fd,#c2e9fb)' },
      { caption: '新年一起放的烟花', emoji: '🎆', gradient: 'linear-gradient(135deg,#fbc2eb,#a6c1ee)' },
    ],

    // 爱你的理由（正面 emoji + 标题，背面文字）
    reasons: [
      { emoji: '😊', title: '你的笑', text: '你一笑，我一天的疲惫就都没了。' },
      { emoji: '👂', title: '你的耐心', text: '我再啰嗦，你也会认真听完每一句。' },
      { emoji: '🤗', title: '你的拥抱', text: '难过的时候，你的怀抱比什么都管用。' },
      { emoji: '😤', title: '你的小脾气', text: '连生气都那么可爱，真是拿你没办法。' },
      { emoji: '🍳', title: '你的厨艺', text: '你做的饭，是外面任何餐厅都比不上的味道。' },
      { emoji: '📚', title: '你的认真', text: '你专注做事的样子，真的很好看。' },
      { emoji: '🏠', title: '你的陪伴', text: '有你在的地方，就是我想要的家。' },
      { emoji: '💖', title: '你的全部', text: '说不上来为什么，就是很爱你。' },
    ],

    // 心动签
    fortunes: [
      '今日宜牵手，忌冷战 💕',
      '今天适合一起看一场电影 🎬',
      '宜吃甜品，忌减肥 🍰',
      '出门会遇到小确幸 🍀',
      '宜拥抱，宜说晚安 🌙',
      '宜一起散步，看晚霞 🌇',
    ],

    // 默契测试（answer 是正确选项的下标，从 0 开始）
    quiz: [
      { q: '我们第一次见面是在哪里？', options: ['咖啡店', '图书馆', '朋友的聚会', '地铁站'], answer: 0 },
      { q: 'TA 最喜欢的解压方式是？', options: ['睡大觉', '吃好吃的', '购物', '打游戏'], answer: 1 },
      { q: '我们吵架后一般谁先低头？', options: ['我', 'TA', '谁也不理谁', '同时道歉'], answer: 3 },
      { q: 'TA 最想和我一起去的地方是？', options: ['海边', '雪山', '沙漠', '游乐园'], answer: 0 },
      { q: '我们在一起后养成的小习惯是？', options: ['每天说晚安', '一起买菜', '周末睡懒觉', '互相投喂'], answer: 0 },
    ],

    // 点爱心按钮时轮播的话
    heartMessages: [
      '嘿嘿，收到你的爱啦 ❤',
      '再来一下嘛～',
      '爱意 +1，开心 +100',
      '你也太爱我了吧',
      '这个爱心，我记下了',
      '再多来点，我全部都要！',
      '今天也是被你甜到的一天',
      '每一次心动，都依然是你',
    ],

    // 背景音乐地址：audio/xxx.mp3、audio/xxx.flac 或在线直链；留空则播放内置轻音乐
    bgmSrc: 'audio/shenfen.flac',
  };

  // ============================================================
  //  以下为实现代码，一般不需要修改
  // ============================================================
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;

  /* ---------- 定制内容：读取本地保存 ---------- */
  const SETTINGS_KEY = 'ourLoveSettings_v1';
  const pendingPhotos = {};

  function readSettings() {
    try {
      return JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null');
    } catch (e) {
      return null;
    }
  }

  function editEls(key) {
    return $$(`[data-edit="${key}"]`);
  }

  function setEditText(key, value) {
    editEls(key).forEach(el => (el.textContent = value));
  }

  const savedSettings = readSettings();
  if (savedSettings) {
    if (savedSettings.nameA) CONFIG.nameA = savedSettings.nameA;
    if (savedSettings.nameB) CONFIG.nameB = savedSettings.nameB;
    if (savedSettings.startDate) CONFIG.startDate = savedSettings.startDate;
    if (savedSettings.annivMonth) CONFIG.anniversary.month = Number(savedSettings.annivMonth);
    if (savedSettings.annivDay) CONFIG.anniversary.day = Number(savedSettings.annivDay);
    if (Array.isArray(savedSettings.taglines) && savedSettings.taglines.length) CONFIG.taglines = savedSettings.taglines;
    if (savedSettings.letter) CONFIG.letter = savedSettings.letter;
    if (typeof savedSettings.bgmSrc === 'string') {
      // 兼容旧设置里记录的 mp3 路径，改用现在的 flac 文件
      CONFIG.bgmSrc = savedSettings.bgmSrc === 'audio/shenfen.mp3'
        ? 'audio/shenfen.flac'
        : savedSettings.bgmSrc;
    }
    if (savedSettings.texts) {
      Object.keys(savedSettings.texts).forEach(key => setEditText(key, savedSettings.texts[key]));
    }
    if (Array.isArray(savedSettings.photos)) {
      savedSettings.photos.forEach((photo, i) => {
        const target = CONFIG.photos[i];
        if (!target || !photo) return;
        if (photo.caption) target.caption = photo.caption;
        if (photo.emoji) target.emoji = photo.emoji;
        if (photo.src) target.src = photo.src;
        else delete target.src;
      });
    }
    if (Array.isArray(savedSettings.reasons)) {
      savedSettings.reasons.forEach((reason, i) => {
        const target = CONFIG.reasons[i];
        if (!target || !reason) return;
        if (reason.emoji) target.emoji = reason.emoji;
        if (reason.title) target.title = reason.title;
        if (reason.text) target.text = reason.text;
      });
    }
    if (Array.isArray(savedSettings.quiz)) {
      savedSettings.quiz.forEach((item, i) => {
        const target = CONFIG.quiz[i];
        if (!target || !item) return;
        if (item.q) target.q = item.q;
        if (Array.isArray(item.options) && item.options.length === 4) target.options = item.options;
        if (Number.isInteger(item.answer)) target.answer = item.answer;
      });
    }
  }

  let start = new Date(CONFIG.startDate);
  const COLORS = ['#ff6b9d', '#ffa8c5', '#ff4d7d', '#ffd36e', '#c084fc', '#fb7185'];

  function fillText() {
    $$('[data-name-a]').forEach(el => (el.textContent = CONFIG.nameA));
    $$('[data-name-b]').forEach(el => (el.textContent = CONFIG.nameB));
    const ds = `${start.getFullYear()} 年 ${start.getMonth() + 1} 月 ${start.getDate()} 日`;
    $$('[data-start-date]').forEach(el => (el.textContent = ds));
    const now = new Date();
    $$('[data-today]').forEach(el => (el.textContent = `${now.getFullYear()} 年 ${now.getMonth() + 1} 月 ${now.getDate()} 日`));
    document.title = `${CONFIG.nameA} & ${CONFIG.nameB} · 我们的小宇宙`;
  }

  /* ---------- 恋爱计时器 ---------- */
  function initCounter() {
    const els = {};
    ['days', 'hours', 'minutes', 'seconds'].forEach(k => (els[k] = $(`[data-unit="${k}"]`)));
    const last = {};
    const footerDays = $('#footer-days');

    function update() {
      let diff = Math.max(0, Date.now() - start.getTime());
      const d = Math.floor(diff / 86400000); diff -= d * 86400000;
      const h = Math.floor(diff / 3600000); diff -= h * 3600000;
      const m = Math.floor(diff / 60000); diff -= m * 60000;
      const s = Math.floor(diff / 1000);
      const vals = { days: d, hours: h, minutes: m, seconds: s };
      for (const k in vals) {
        const v = String(vals[k]).padStart(2, '0');
        if (last[k] !== v) {
          els[k].textContent = v;
          if (last[k] !== undefined && !reduceMotion) {
            els[k].classList.remove('tick');
            void els[k].offsetWidth;
            els[k].classList.add('tick');
          }
          last[k] = v;
        }
      }
      if (footerDays) footerDays.textContent = d;
    }
    update();
    setInterval(update, 1000);

    updateNextAnniv();
  }

  /* ---------- 下一个纪念日 ---------- */
  function updateNextAnniv() {
    const el = $('#next-anniv');
    if (!el) return;
    const now = new Date();
    const month = CONFIG.anniversary.month;
    const day = CONFIG.anniversary.day;
    let next = new Date(now.getFullYear(), month - 1, day);
    if (next <= now) next = new Date(now.getFullYear() + 1, month - 1, day);
    const daysTo = Math.ceil((next - now) / 86400000);
    el.innerHTML =
      daysTo <= 1
        ? `明天就是我们的纪念日啦（${month} 月 ${day} 日）🥳`
        : `距离我们的下一个纪念日（${month} 月 ${day} 日）还有 <b>${daysTo}</b> 天`;
  }

  /* ---------- 打字机 ---------- */
  function initTypewriter() {
    const el = $('#typewriter');
    if (!el) return;
    if (reduceMotion) { el.textContent = CONFIG.taglines[0] || ''; return; }
    let i = 0, pos = 0, deleting = false;
    (function tick() {
      const list = CONFIG.taglines;
      if (!list.length) return;
      if (i >= list.length) i = 0;
      const text = list[i];
      if (!deleting) {
        pos++;
        el.textContent = text.slice(0, pos);
        if (pos === text.length) { deleting = true; return setTimeout(tick, 2200); }
        return setTimeout(tick, 110);
      }
      pos--;
      el.textContent = text.slice(0, pos);
      if (pos === 0) { deleting = false; i = (i + 1) % list.length; return setTimeout(tick, 400); }
      setTimeout(tick, 40);
    })();
  }

  /* ---------- 背景：星星 + 飘心 + 点击爆心 ---------- */
  let burstHearts = () => {};
  function initCanvas() {
    const canvas = $('#bg-canvas');
    const ctx = canvas.getContext('2d');
    let W, H, stars = [], hearts = [], bursts = [], running = true, rafId = null;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: Math.floor((W * H) / 9000) }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.4 + 0.3, p: Math.random() * Math.PI * 2, s: 0.5 + Math.random(),
      }));
    }
    function makeHeart(fromBottom) {
      return {
        x: Math.random() * W, y: fromBottom ? H + 40 : Math.random() * H,
        size: 8 + Math.random() * 22, vy: 0.3 + Math.random() * 0.8,
        sway: 10 + Math.random() * 25, phase: Math.random() * Math.PI * 2,
        speed: 0.005 + Math.random() * 0.01, alpha: 0.15 + Math.random() * 0.35,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
    }
    function drawHeart(x, y, size, color, alpha) {
      const s = size / 100;
      ctx.save();
      ctx.translate(x - 50 * s, y - 47 * s);
      ctx.scale(s, s);
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(50, 30);
      ctx.bezierCurveTo(50, 27, 47, 15, 35, 15);
      ctx.bezierCurveTo(15, 15, 15, 37, 15, 37);
      ctx.bezierCurveTo(15, 50, 27, 62, 50, 80);
      ctx.bezierCurveTo(73, 62, 85, 50, 85, 37);
      ctx.bezierCurveTo(85, 37, 85, 15, 65, 15);
      ctx.bezierCurveTo(53, 15, 50, 27, 50, 30);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
    }
    function burst(x, y, count = 14, power = 1, sizeBase = 6, sizeRange = 12) {
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = (2 + Math.random() * 4) * power;
        bursts.push({
          x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 2 * power,
          life: 0.9 + Math.random() * 0.6, size: sizeBase + Math.random() * sizeRange,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }
      if (bursts.length > 400) bursts.splice(0, bursts.length - 400);
    }
    burstHearts = burst;

    function loop() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      const t = performance.now();
      ctx.fillStyle = '#fff';
      for (const s of stars) {
        ctx.globalAlpha = 0.3 + 0.5 * Math.abs(Math.sin((t / 1000) * s.s + s.p));
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      }
      for (let i = 0; i < hearts.length; i++) {
        const h = hearts[i];
        h.phase += h.speed * 16;
        h.y -= h.vy;
        if (h.y < -60) { hearts[i] = makeHeart(true); continue; }
        drawHeart(h.x + Math.sin(h.phase) * h.sway, h.y, h.size, h.color, h.alpha);
      }
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i];
        b.life -= 1 / 60; b.vy += 0.03; b.x += b.vx; b.y += b.vy;
        if (b.life <= 0) { bursts.splice(i, 1); continue; }
        drawHeart(b.x, b.y, b.size, b.color, Math.min(1, b.life * 2));
      }
      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(loop);
    }

    resize();
    hearts = Array.from({ length: 26 }, () => makeHeart(false));
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', () => {
      running = !document.hidden;
      if (running) { cancelAnimationFrame(rafId); loop(); }
    });

    document.addEventListener('click', e => burst(e.clientX, e.clientY));
    if (!isTouch && !reduceMotion) {
      let lx = -999, ly = -999;
      window.addEventListener('mousemove', e => {
        if (Math.hypot(e.clientX - lx, e.clientY - ly) > 28) {
          lx = e.clientX; ly = e.clientY;
          burst(lx, ly, 1, 0.25, 4, 6);
        }
      });
    }
    loop();
  }

  /* ---------- 鼠标光晕 ---------- */
  function initCursor() {
    if (isTouch || reduceMotion) return;
    const glow = $('#cursor-glow');
    let tx = -999, ty = -999, x = -999, y = -999;
    window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
    (function anim() {
      x += (tx - x) * 0.12; y += (ty - y) * 0.12;
      glow.style.transform = `translate(${x}px, ${y}px)`;
      requestAnimationFrame(anim);
    })();
  }

  /* ---------- 滚动渐入 ---------- */
  function initReveal() {
    const els = $$('.reveal');
    if (!('IntersectionObserver' in window) || reduceMotion) {
      els.forEach(el => el.classList.add('visible'));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
  }

  /* ---------- 导航 ---------- */
  function initNav() {
    const nav = $('#nav');
    if (!nav) return;
    const links = $$('.nav-links a');
    const sections = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
    const hero = $('#star-sky');
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        if (en.target === hero) {
          links.forEach(l => l.classList.remove('active'));
          return;
        }
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id));
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => io.observe(s));
    if (hero) io.observe(hero);
  }

  /* ---------- 情书打字 ---------- */
  let letterEditing = false;

  function initLetter() {
    const el = $('#letter-text');
    if (!el) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      el.textContent = CONFIG.letter; el.classList.add('done'); return;
    }
    let started = false;
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting && !started) { started = true; io.disconnect(); type(); }
      });
    }, { threshold: 0.3 });
    io.observe(el);
    function type() {
      let i = 0;
      (function step() {
        if (letterEditing) return;
        i += 1 + Math.floor(Math.random() * 2);
        el.textContent = CONFIG.letter.slice(0, i);
        if (i < CONFIG.letter.length) setTimeout(step, 28); else el.classList.add('done');
      })();
    }
  }

  function updateLetterNow(text) {
    const el = $('#letter-text');
    if (!el) return;
    letterEditing = true;
    el.textContent = text;
    el.classList.add('done');
  }

  /* ---------- 时光轴进度 ---------- */
  function buildTimeline() {
    const wrap = $('#timeline-list');
    const line = $('#timeline-progress');
    if (!wrap || !line) return;
    const onScroll = () => {
      const r = wrap.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.7 - r.top) / r.height));
      line.style.height = p * 100 + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 相册：滚动入场后拼成立体方块 ---------- */
  function buildGallery() {
    const cube = $('#photoCubeBody');
    if (!cube) return;
    cube.innerHTML = '';
    CONFIG.photos.forEach((p, i) => {
      const face = document.createElement('div');
      face.className = 'pc-face';

      const photo = document.createElement('div');
      photo.className = 'pc-photo';
      photo.style.setProperty('--d', `${i * 0.09}s`);
      if (p.src) {
        photo.style.backgroundImage = `url("${p.src}")`;
      } else {
        photo.style.backgroundImage = p.gradient || 'linear-gradient(135deg,#ff9a9e,#fad0c4)';
        const emoji = document.createElement('span');
        emoji.className = 'pc-emoji';
        emoji.textContent = p.emoji;
        photo.appendChild(emoji);
      }
      const caption = document.createElement('span');
      caption.className = 'pc-caption';
      caption.textContent = p.caption;
      photo.appendChild(caption);

      face.appendChild(photo);
      cube.appendChild(face);
    });
  }

  function initPhotoCube() {
    const stage = $('#photoCube');
    const spin = $('#photoCubeSpin');
    const cube = $('#photoCubeBody');
    if (!stage || !spin || !cube) return;

    const faces = () => Array.from(cube.querySelectorAll('.pc-face'));
    let phase = 'idle';
    let spinY = 0;
    let dragX = 0;
    let dragY = 0;
    let scale = 1;
    let flatScale = 1;
    let shiftY = 0;
    let shiftTarget = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    // 计算让当前照片整体在两个区块标题之间垂直居中的位移
    const measureShift = (baseShift = 0) => {
      const section = stage.closest('.section');
      if (!section) return baseShift;
      const title = section.querySelector('.section-title');
      const nextSection = section.nextElementSibling;
      const nextTitle = nextSection ? nextSection.querySelector('.section-title') : null;
      if (!title || !nextTitle) return baseShift;
      const list = faces();
      let top = Infinity;
      let bottom = -Infinity;
      (list.length ? list : [cube]).forEach(el => {
        const r = el.getBoundingClientRect();
        top = Math.min(top, r.top);
        bottom = Math.max(bottom, r.bottom);
      });
      const above = top - title.getBoundingClientRect().bottom;
      const below = nextTitle.getBoundingClientRect().top - bottom;
      // 当前画面已经带了 baseShift 的位移，目标值要在它基础上修正
      return Math.max(-160, Math.min(220, baseShift + (below - above) / 2));
    };

    // 先摊成 3 列 × 2 行，整体按容器宽度自动缩放
    const layoutFlat = () => {
      const list = faces();
      if (!list.length) return;
      const size = cube.offsetWidth || 200;
      const gap = Math.round(size * 0.08);
      const gridW = size * 3 + gap * 2;
      const gridH = size * 2 + gap;
      flatScale = Math.min(1, (stage.clientWidth - 20) / gridW, (stage.clientHeight - 12) / gridH);
      scale = flatScale;
      spinY = 0;
      dragX = 0;
      dragY = 0;
      list.forEach((face, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = -(gridW - size) / 2 + col * (size + gap);
        const y = -(gridH - size) / 2 + row * (size + gap);
        face.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        face.style.setProperty('--fd', (i * 0.07).toFixed(2) + 's');
      });
      // 平铺阶段也按两个标题之间居中
      spin.style.transform = `translateY(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(${flatScale})`;
      shiftTarget = measureShift();
      shiftY = shiftTarget;
    };

    // 3 秒后收起成立方体
    const assemble = () => {
      if (phase !== 'flat') return;
      phase = 'assembling';
      cube.classList.add('assemble');
      faces().forEach(face => { face.style.transform = ''; });
      setTimeout(() => {
        if (phase !== 'assembling') return;
        cube.classList.remove('assemble');
        stage.classList.add('assembled');
        phase = 'cube';
        shiftTarget = measureShift(shiftY);
      }, 1500);
    };

    const enter = () => {
      // 先无动画摆成 2 行 3 列，再淡入，确保第一眼看到的是网格而不是方块
      cube.classList.add('prep');
      layoutFlat();
      phase = 'flat';
      requestAnimationFrame(() => {
        stage.classList.add('show');
        requestAnimationFrame(() => cube.classList.remove('prep'));
      });
      if (reduceMotion) {
        assemble();
        return;
      }
      setTimeout(assemble, 3000);
    };

    // 解锁后再开始观察，避免刷新在相册位置时解锁前就把方块拼好
    const startObserve = () => {
      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(entries => {
          entries.forEach(en => {
            if (!en.isIntersecting || phase !== 'idle') return;
            enter();
            io.disconnect();
          });
        }, { threshold: 0.1, rootMargin: '-25% 0px -25% 0px' });
        io.observe(stage);
      } else {
        enter();
      }
    };

    const mainEl = $('#mainContent');
    if (mainEl && !mainEl.classList.contains('revealed')) {
      const mo = new MutationObserver(() => {
        if (!mainEl.classList.contains('revealed')) return;
        mo.disconnect();
        startObserve();
      });
      mo.observe(mainEl, { attributes: true, attributeFilter: ['class'] });
    } else {
      startObserve();
    }

    (function loop() {
      if (phase === 'cube' && !dragging) spinY += 0.22;
      if (phase === 'assembling' || phase === 'cube') {
        scale += (1 - scale) * 0.06;
        if (Math.abs(1 - scale) < 0.002) scale = 1;
      }
      shiftY += (shiftTarget - shiftY) * 0.06;
      if (Math.abs(shiftTarget - shiftY) < 0.2) shiftY = shiftTarget;
      // 三轴旋转：X/Y 同速翻转，Z 轴左右摆动（对应参考代码的 move 动画）
      const ry = spinY + dragY;
      const rx = spinY + dragX;
      const rz = 45 * Math.sin((ry * Math.PI) / 180);
      spin.style.transform = `translateY(${shiftY.toFixed(2)}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${scale})`;
      requestAnimationFrame(loop);
    })();

    const stopDrag = () => {
      dragging = false;
      stage.classList.remove('dragging');
    };

    stage.addEventListener('pointerdown', e => {
      if (phase !== 'cube') return;
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      stage.classList.add('dragging');
      if (stage.setPointerCapture) stage.setPointerCapture(e.pointerId);
    });
    stage.addEventListener('pointermove', e => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      dragY += dx * 0.45;
      dragX = Math.max(-80, Math.min(80, dragX - dy * 0.35));
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(type => {
      stage.addEventListener(type, stopDrag);
    });

    window.addEventListener('resize', () => {
      if (phase === 'flat') layoutFlat();
      if (phase === 'cube') shiftTarget = measureShift(shiftY);
    });
  }

  /* ---------- 爱你的理由 翻牌 ---------- */
  function buildReasons() {
    const grid = $('#reasons-grid');
    grid.innerHTML = '';
    CONFIG.reasons.forEach((r, i) => {
      const el = document.createElement('div');
      el.className = 'flip reveal';
      el.style.setProperty('--delay', `${(i % 4) * 0.08}s`);
      el.innerHTML = `
        <div class="flip-inner">
          <div class="flip-face flip-front"><span class="emoji" style="animation-delay:${-i * 0.5}s">${r.emoji}</span><h4>${r.title}</h4></div>
          <div class="flip-face flip-back">${r.text}</div>
        </div>`;
      el.addEventListener('click', () => el.classList.toggle('flipped'));
      grid.appendChild(el);
    });
  }

  /* ---------- 爱的发电站 ---------- */
  function initHeartButton() {
    const btn = $('#heart-btn'), panel = $('#heart-panel');
    const countEl = $('#heart-count'), msgEl = $('#heart-msg');
    const symbols = ['💗', '💖', '💕', '❤️', '💘', '💝'];
    let count = 0;
    btn.addEventListener('click', () => {
      count++;
      countEl.textContent = count;
      if (!reduceMotion) { countEl.classList.remove('tick'); void countEl.offsetWidth; countEl.classList.add('tick'); }
      msgEl.textContent = CONFIG.heartMessages[(count - 1) % CONFIG.heartMessages.length];
      if (reduceMotion) return;
      const r = btn.getBoundingClientRect();
      const pr = panel.getBoundingClientRect();
      const cx = r.left + r.width / 2 - pr.left;
      const cy = r.top + r.height / 2 - pr.top;
      for (let i = 0; i < 10; i++) {
        const s = document.createElement('span');
        s.className = 'float-heart';
        s.textContent = symbols[i % symbols.length];
        s.style.left = cx - 11 + (Math.random() * 60 - 30) + 'px';
        s.style.top = cy - 11 + 'px';
        s.style.setProperty('--dx', Math.random() * 160 - 80 + 'px');
        s.style.setProperty('--dr', Math.random() * 60 - 30 + 'deg');
        s.style.animationDelay = Math.random() * 0.2 + 's';
        s.addEventListener('animationend', () => s.remove());
        panel.appendChild(s);
      }
    });
  }

  /* ---------- 心动签 ---------- */
  function buildFortunes() {
    const wrap = $('#fortune-cards');
    function render() {
      wrap.innerHTML = '';
      CONFIG.fortunes.forEach(f => {
        const c = document.createElement('div');
        c.className = 'fortune';
        c.innerHTML = `<div class="fortune-inner"><div class="fortune-face fortune-front">?</div><div class="fortune-face fortune-back">${f}</div></div>`;
        c.addEventListener('click', () => c.classList.add('flipped'));
        wrap.appendChild(c);
      });
    }
    render();
    $('#fortune-reset').addEventListener('click', render);
  }

  /* ---------- 默契测试 ---------- */
  let quizRun = 0;
  function initQuiz() {
    const body = $('#quiz-body');
    const run = ++quizRun;
    const alive = () => run === quizRun;
    body.innerHTML = '';
    let idx = 0, score = 0, locked = false;
    function render() {
      if (!alive()) return;
      const q = CONFIG.quiz[idx];
      body.innerHTML = `
        <div class="quiz-progress">${CONFIG.quiz.map((_, i) => `<i class="${i < idx ? 'done' : ''}"></i>`).join('')}</div>
        <p class="quiz-q">${idx + 1}. ${q.q}</p>
        <div class="quiz-opts">${q.options.map((o, i) => `<button class="quiz-opt" data-i="${i}">${o}</button>`).join('')}</div>`;
      $$('.quiz-opt', body).forEach(b => b.addEventListener('click', () => answer(+b.dataset.i)));
    }
    function answer(i) {
      if (locked) return;
      locked = true;
      const q = CONFIG.quiz[idx];
      const opts = $$('.quiz-opt', body);
      opts[q.answer].classList.add('correct');
      if (i !== q.answer) opts[i].classList.add('wrong'); else score++;
      opts.forEach(o => (o.style.pointerEvents = 'none'));
      setTimeout(() => {
        if (!alive()) return;
        locked = false; idx++;
        idx < CONFIG.quiz.length ? render() : finish();
      }, 1100);
    }
    function finish() {
      if (!alive()) return;
      const ratio = score / CONFIG.quiz.length;
      const msg = ratio === 1 ? '心有灵犀！你们简直是一个人吧 💕'
        : ratio >= 0.6 ? '很有默契哦，再多了解一点点就满分啦 💗'
        : '没关系，来日方长，慢慢了解～ ❤';
      body.innerHTML = `
        <div class="quiz-result">
          <div class="score">${score} / ${CONFIG.quiz.length}</div>
          <p>${msg}</p>
          <button class="primary-btn" id="quiz-restart">再来一次</button>
        </div>`;
      $('#quiz-restart').addEventListener('click', () => { idx = 0; score = 0; render(); });
      burstHearts(window.innerWidth / 2, window.innerHeight / 2, 30, 1.4);
    }
    render();
  }

  /* ---------- 定制面板 ---------- */
  function initSettings() {
    const drawer = $('#customDrawer');
    const backdrop = $('#customBackdrop');
    const panelBody = $('#customBody');
    const toggle = $('#customToggle');
    if (!drawer || !panelBody || !toggle) return;

    const open = () => {
      panelBody.innerHTML = '';
      buildSettingsForm(panelBody);
      drawer.classList.add('open');
      backdrop.classList.add('show');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      drawer.classList.remove('open');
      backdrop.classList.remove('show');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      Object.keys(pendingPhotos).forEach(key => delete pendingPhotos[key]);
    };

    toggle.addEventListener('click', open);
    $('#customClose').addEventListener('click', close);
    backdrop.addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

    $('#customSave').addEventListener('click', () => {
      const data = collectSettings(panelBody);
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
      } catch (e) {
        window.alert('保存失败：图片可能太大，换一张小一点的照片，或先移除部分图片。');
        return;
      }
      fillText();
      updateNextAnniv();
      buildGallery();
      buildReasons();
      initQuiz();
      $$('#reasons-grid .reveal').forEach(el => el.classList.add('visible'));
      close();
    });

    $('#customReset').addEventListener('click', () => {
      if (!window.confirm('恢复默认会清除所有自定义内容，确定吗？')) return;
      try { localStorage.removeItem(SETTINGS_KEY); } catch (e) { /* 忽略 */ }
      location.reload();
    });
  }

  function buildSettingsForm(container) {
    const addGroup = (title, parent, collapsed) => {
      const group = document.createElement('details');
      group.className = 'custom-group';
      if (!collapsed) group.open = true;
      const summary = document.createElement('summary');
      summary.textContent = title;
      group.appendChild(summary);
      (parent || container).appendChild(group);
      return group;
    };

    const addField = (group, key, label, type, value, extra = {}) => {
      const wrap = document.createElement('label');
      wrap.className = 'custom-field';
      const caption = document.createElement('span');
      caption.textContent = label;
      wrap.appendChild(caption);

      let input;
      if (type === 'textarea') {
        input = document.createElement('textarea');
        input.rows = 3;
      } else if (type === 'select') {
        input = document.createElement('select');
        (extra.options || []).forEach((optLabel, idx) => {
          const opt = document.createElement('option');
          opt.value = String(idx);
          opt.textContent = optLabel;
          input.appendChild(opt);
        });
      } else {
        input = document.createElement('input');
        input.type = type;
      }

      if (extra.min) input.min = extra.min;
      if (extra.max) input.max = extra.max;
      input.dataset.key = key;
      input.value = value == null ? '' : String(value);
      wrap.appendChild(input);
      group.appendChild(wrap);
      return input;
    };

    const textOf = key => {
      const el = editEls(key)[0];
      return el ? el.textContent : '';
    };

    const addPhotoUpload = (group, index) => {
      const wrap = document.createElement('div');
      wrap.className = 'custom-field custom-upload';

      const caption = document.createElement('span');
      caption.textContent = '照片（上传后替代 emoji 占位）';
      wrap.appendChild(caption);

      const row = document.createElement('div');
      row.className = 'custom-upload-row';

      const preview = document.createElement('div');
      preview.className = 'custom-upload-preview';
      row.appendChild(preview);

      const actions = document.createElement('div');
      actions.className = 'custom-upload-actions';

      const pick = document.createElement('label');
      pick.className = 'custom-upload-btn';
      pick.textContent = '选择图片';
      const file = document.createElement('input');
      file.type = 'file';
      file.accept = 'image/*';
      pick.appendChild(file);
      actions.appendChild(pick);

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'custom-upload-btn ghost';
      remove.textContent = '移除图片';
      actions.appendChild(remove);

      const hint = document.createElement('p');
      hint.className = 'custom-upload-hint';
      hint.textContent = '支持 JPG / PNG，保存时自动压缩';
      actions.appendChild(hint);

      row.appendChild(actions);
      wrap.appendChild(row);
      group.appendChild(wrap);

      const currentSrc = () => {
        if (index in pendingPhotos) return pendingPhotos[index];
        return CONFIG.photos[index].src || '';
      };

      const renderPreview = () => {
        const src = currentSrc();
        preview.innerHTML = '';
        if (src) {
          const img = document.createElement('img');
          img.src = src;
          img.alt = '照片预览';
          preview.appendChild(img);
          remove.disabled = false;
        } else {
          const span = document.createElement('span');
          span.textContent = CONFIG.photos[index].emoji || '📷';
          preview.appendChild(span);
          remove.disabled = true;
        }
      };
      renderPreview();

      file.addEventListener('change', () => {
        const f = file.files && file.files[0];
        if (!f) return;
        hint.textContent = '正在压缩...';
        shrinkImage(f).then(dataUrl => {
          pendingPhotos[index] = dataUrl;
          renderPreview();
          hint.textContent = `已选择：${f.name}`;
        }).catch(() => {
          hint.textContent = '读取失败，请换一张图片';
        });
      });

      remove.addEventListener('click', () => {
        pendingPhotos[index] = '';
        renderPreview();
        hint.textContent = '保存后恢复 emoji 占位';
      });
    };

    const base = addGroup('基本信息');
    addField(base, 'nameA', '我的昵称（首页 / 信末 / 页脚）', 'text', CONFIG.nameA);
    addField(base, 'nameB', 'TA 的昵称', 'text', CONFIG.nameB);
    addField(base, 'startDate', '在一起的开始时间', 'datetime-local', String(CONFIG.startDate).slice(0, 16));
    addField(base, 'annivMonth', '纪念日 · 月', 'number', CONFIG.anniversary.month, { min: 1, max: 12 });
    addField(base, 'annivDay', '纪念日 · 日', 'number', CONFIG.anniversary.day, { min: 1, max: 31 });

    const texts = addGroup('文字内容');
    addField(texts, 'taglines', '首页轮播句子（每行一句）', 'textarea', CONFIG.taglines.join('\n'));
    addField(texts, 'letter', '情书正文', 'textarea', CONFIG.letter);

    const page = addGroup('页面标题与说明', null, true);
    addField(page, 'letterTitle', '「写给你的一封信」标题', 'text', textOf('letterTitle'));
    addField(page, 'letterSub', '情书区副标题', 'text', textOf('letterSub'));
    addField(page, 'letterSalutation', '称呼前缀（如“亲爱的”）', 'text', textOf('letterSalutation'));
    addField(page, 'letterSign', '落款前缀（如“爱你的”）', 'text', textOf('letterSign'));
    addField(page, 'galleryTitle', '「我们的瞬间」标题', 'text', textOf('galleryTitle'));
    addField(page, 'gallerySub', '相册区副标题', 'text', textOf('gallerySub'));
    addField(page, 'reasonsTitle', '爱你的理由 · 标题', 'text', textOf('reasonsTitle'));
    addField(page, 'reasonsSub', '爱你的理由 · 副标题', 'text', textOf('reasonsSub'));
    addField(page, 'quizTitle', '「默契大考验」标题', 'text', textOf('quizTitle'));
    addField(page, 'quizSub', '默契大考验 · 小标题', 'text', textOf('quizSub'));

    const cards = addGroup('故事轨迹 · 卡片', null, true);
    for (let i = 0; i < 20; i++) {
      const titleEl = editEls(`card${i}.title`)[0];
      if (!titleEl) continue;
      const dateEl = editEls(`card${i}.date`)[0];
      const emojiEl = editEls(`card${i}.emoji`)[0];
      const textEl = editEls(`card${i}.text`)[0];
      const secretEl = editEls(`card${i}.secret`)[0];
      const group = addGroup(`卡片 ${i + 1} · ${titleEl.textContent || '未命名'}`, cards, true);
      addField(group, `card${i}.date`, '日期 / 标签', 'text', dateEl ? dateEl.textContent : '');
      addField(group, `card${i}.emoji`, '图标（emoji）', 'text', emojiEl ? emojiEl.textContent : '');
      addField(group, `card${i}.title`, '标题', 'text', titleEl.textContent);
      addField(group, `card${i}.text`, '正文 / 隐藏文案', 'textarea', textEl ? textEl.textContent : '');
      if (secretEl) {
        addField(group, `card${i}.secret`, '翻转背面文案', 'textarea', secretEl.textContent);
      }
    }

    const photos = addGroup('相册 · 照片说明', null, true);
    CONFIG.photos.forEach((p, i) => {
      const group = addGroup(`照片 ${i + 1} · ${p.caption}`, photos, true);
      addPhotoUpload(group, i);
      addField(group, `photo${i}.caption`, '说明文字', 'text', p.caption);
      addField(group, `photo${i}.emoji`, '图标（emoji，未上传图片时显示）', 'text', p.emoji);
    });

    const reasons = addGroup('爱你的理由 · 卡片', null, true);
    CONFIG.reasons.forEach((r, i) => {
      const group = addGroup(`理由 ${i + 1} · ${r.title}`, reasons, true);
      addField(group, `reason${i}.emoji`, '图标（emoji）', 'text', r.emoji);
      addField(group, `reason${i}.title`, '正面标题', 'text', r.title);
      addField(group, `reason${i}.text`, '背面文案', 'textarea', r.text);
    });

    const quiz = addGroup('默契大考验 · 题目', null, true);
    CONFIG.quiz.forEach((q, i) => {
      const group = addGroup(`第 ${i + 1} 题 · ${q.q}`, quiz, true);
      addField(group, `quiz${i}.q`, '题目', 'text', q.q);
      q.options.forEach((o, n) => addField(group, `quiz${i}.o${n}`, `选项 ${n + 1}`, 'text', o));
      addField(group, `quiz${i}.answer`, '正确答案', 'select', q.answer, {
        options: ['选项 1', '选项 2', '选项 3', '选项 4'],
      });
    });

    const footer = addGroup('页脚', null, true);
    addField(footer, 'footerQuote', '页脚一句话', 'text', textOf('footerQuote'));
    addField(footer, 'footerCopy', '版权行', 'text', textOf('footerCopy'));

    const music = addGroup('背景音乐', null, true);
    addField(music, 'bgmSrc', '音频地址（audio/xxx.mp3、.flac 或直链，留空用内置轻音乐）', 'text', CONFIG.bgmSrc || '');
  }

  function collectSettings(container) {
    const data = { texts: {} };
    const CONFIG_KEYS = ['nameA', 'nameB', 'startDate', 'annivMonth', 'annivDay', 'taglines', 'letter', 'bgmSrc'];
    const val = key => {
      const el = container.querySelector(`[data-key="${key}"]`);
      return el ? el.value.trim() : null;
    };

    $$('[data-key]', container).forEach(input => {
      const key = input.dataset.key;
      if (/^(photo|reason|quiz)\d+\./.test(key)) return;
      const value = input.value.trim();
      if (CONFIG_KEYS.indexOf(key) > -1) {
        data[key] = value;
        return;
      }
      const current = editEls(key)[0];
      if (!current || current.textContent !== value) {
        setEditText(key, value);
        data.texts[key] = value;
      }
    });

    if (data.nameA) CONFIG.nameA = data.nameA;
    if (data.nameB) CONFIG.nameB = data.nameB;
    if (data.startDate) {
      CONFIG.startDate = data.startDate;
      start = new Date(data.startDate);
    }
    const month = Number(data.annivMonth);
    const day = Number(data.annivDay);
    if (month >= 1 && month <= 12) CONFIG.anniversary.month = month;
    if (day >= 1 && day <= 31) CONFIG.anniversary.day = day;

    const lines = (data.taglines || '').split('\n').map(s => s.trim()).filter(Boolean);
    if (lines.length) CONFIG.taglines = lines;

    if (data.letter && data.letter !== CONFIG.letter) {
      CONFIG.letter = data.letter;
      updateLetterNow(data.letter);
    }

    if (data.bgmSrc !== undefined && data.bgmSrc !== CONFIG.bgmSrc) {
      CONFIG.bgmSrc = data.bgmSrc;
      if (typeof window.setBgmSrc === 'function') {
        window.setBgmSrc(data.bgmSrc);
        if (data.bgmSrc) window.startBgm();
      }
    }

    data.photos = CONFIG.photos.map((p, i) => ({
      caption: val(`photo${i}.caption`) || p.caption,
      emoji: val(`photo${i}.emoji`) || p.emoji,
      src: (i in pendingPhotos) ? pendingPhotos[i] : (p.src || ''),
    }));
    data.reasons = CONFIG.reasons.map((r, i) => ({
      emoji: val(`reason${i}.emoji`) || r.emoji,
      title: val(`reason${i}.title`) || r.title,
      text: val(`reason${i}.text`) || r.text,
    }));
    data.quiz = CONFIG.quiz.map((q, i) => ({
      q: val(`quiz${i}.q`) || q.q,
      options: q.options.map((o, n) => val(`quiz${i}.o${n}`) || o),
      answer: Math.min(3, Math.max(0, Number(val(`quiz${i}.answer`)) || 0)),
    }));

    CONFIG.photos = CONFIG.photos.map((p, i) => {
      const next = Object.assign({}, p, data.photos[i]);
      if (!data.photos[i].src) delete next.src;
      return next;
    });
    CONFIG.reasons = CONFIG.reasons.map((r, i) => Object.assign({}, r, data.reasons[i]));
    CONFIG.quiz = data.quiz;

    return data;
  }

  function shrinkImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('读取失败'));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error('解码失败'));
        img.onload = () => {
          const MAX = 1000;
          const scale = Math.min(1, MAX / Math.max(img.width, img.height));
          const w = Math.max(1, Math.round(img.width * scale));
          const h = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#fff8f2';
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.78));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  /* ---------- 回到顶部 ---------- */
  function initToTop() {
    const btn = $('#toTop');
    if (!btn) return;
    const onScroll = () => btn.classList.toggle('show', window.scrollY > 320);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- 背景音乐 ---------- */
  let bgmEl = null;
  let bgmBroken = false;
  let fallbackAudio = null;

  function musicPlaying() {
    return !!fallbackAudio || !!(bgmEl && !bgmEl.paused);
  }

  function setMusicUI() {
    const btn = $('#musicToggle');
    if (!btn) return;
    const playing = musicPlaying();
    btn.classList.toggle('active', playing);
    if (fallbackAudio) btn.title = '内置轻音乐（未找到《身份》音频）';
    else btn.title = playing ? '暂停背景音乐《身份》— 艾岩' : '播放背景音乐《身份》— 艾岩';
    if (playing) startBpm();
    else stopBpm();
  }

  /* 心率占位：播放时小幅跳动并与 ECG 速度联动，暂停时定格 */
  let bpmTimer = null;
  let bpmValue = 78;

  function startBpm() {
    const el = $('#bpmDisplay');
    if (!el) return;
    const wrap = document.querySelector('.nav-bpm');
    const ecg = document.querySelector('.ecg-line');
    if (wrap) wrap.classList.remove('is-paused');
    if (ecg) ecg.style.animationPlayState = 'running';
    if (bpmTimer) return;
    const tick = () => {
      bpmValue = Math.min(92, Math.max(68, bpmValue + Math.round((Math.random() - 0.5) * 6)));
      el.textContent = `${bpmValue} BPM`;
      setEcgRate(bpmValue);
    };
    tick();
    bpmTimer = setInterval(tick, 1500);
  }

  /* 用 playbackRate 微调线条速度，避免改 animation-duration 导致动画重头跳 */
  function setEcgRate(bpm) {
    const line = document.querySelector('.ecg-line');
    if (!line || typeof line.getAnimations !== 'function') return;
    const rate = Math.min(1.5, Math.max(0.85, 114 / bpm));
    line.getAnimations().forEach(anim => { anim.playbackRate = rate; });
  }

  function stopBpm() {
    if (bpmTimer) {
      clearInterval(bpmTimer);
      bpmTimer = null;
    }
    const wrap = document.querySelector('.nav-bpm');
    const ecg = document.querySelector('.ecg-line');
    if (wrap) wrap.classList.add('is-paused');
    if (ecg) ecg.style.animationPlayState = 'paused';
  }

  function startBgm() {
    if (!bgmEl) return;
    if (CONFIG.bgmSrc && !bgmBroken) {
      bgmEl.volume = 0.6;
      bgmEl.play().then(() => {
        stopFallback();
        setMusicUI();
      }).catch(() => {
        startFallback();
      });
    } else {
      startFallback();
    }
  }

  function pauseBgm() {
    if (bgmEl && !bgmEl.paused) bgmEl.pause();
    stopFallback();
    setMusicUI();
  }

  function stopBgm() {
    pauseBgm();
    if (bgmEl) bgmEl.currentTime = 0;
  }

  const FALLBACK_NOTES = [329.63, 392, 440, 523.25, 493.88, 440, 392, 293.66];

  function startFallback() {
    if (fallbackAudio) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    if (ctx.state === 'suspended') ctx.resume();
    const master = ctx.createGain();
    master.gain.value = 0.06;
    master.connect(ctx.destination);
    let step = 0;
    const note = () => {
      if (!fallbackAudio) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime;
      osc.type = 'sine';
      osc.frequency.value = FALLBACK_NOTES[step % FALLBACK_NOTES.length];
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(1, t + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t);
      osc.stop(t + 1.9);
      step++;
      fallbackAudio.timer = setTimeout(note, 700);
    };
    fallbackAudio = { ctx, timer: null };
    note();
    setMusicUI();
  }

  function stopFallback() {
    if (!fallbackAudio) return;
    clearTimeout(fallbackAudio.timer);
    try { fallbackAudio.ctx.close(); } catch (e) { /* 忽略 */ }
    fallbackAudio = null;
    setMusicUI();
  }

  function initBgm() {
    bgmEl = $('#bgm');
    const btn = $('#musicToggle');
    if (!bgmEl || !btn) return;
    if (CONFIG.bgmSrc) bgmEl.src = CONFIG.bgmSrc;
    else bgmEl.removeAttribute('src');
    bgmEl.volume = 0.6;
    bgmEl.addEventListener('error', () => {
      bgmBroken = true;
      setMusicUI();
    });
    bgmEl.addEventListener('play', setMusicUI);
    bgmEl.addEventListener('pause', () => { if (!fallbackAudio) setMusicUI(); });
    btn.addEventListener('click', () => {
      if (musicPlaying()) pauseBgm();
      else startBgm();
    });
    window.startBgm = startBgm;
    window.stopBgm = stopBgm;
    window.setBgmSrc = src => {
      bgmBroken = false;
      stopBgm();
      if (src) {
        CONFIG.bgmSrc = src;
        bgmEl.src = src;
      } else {
        CONFIG.bgmSrc = '';
        bgmEl.removeAttribute('src');
      }
      bgmEl.load();
    };
    setMusicUI();
  }

  /* ---------- 启动 ---------- */
  fillText();
  initCounter();
  initTypewriter();
  initCanvas();
  initCursor();
  buildTimeline();
  buildGallery();
  initPhotoCube();
  buildReasons();
  buildFortunes();
  initHeartButton();
  initQuiz();
  initLetter();
  initNav();
  initReveal();
  initBgm();
  initToTop();
  initSettings();
})();

/* ============================================================
   星空页交互（合并进来的原星空页）
   ============================================================ */
(() => {
  'use strict';

  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

  /* ---------- 1. 长按 3 秒解锁 ---------- */
  const overlay = $('#unlockOverlay');
  const holdBtn = $('#unlockBtn');
  const ring = $('#progressCircle');
  const btnText = $('#btnText');
  const mainEl = $('#mainContent');

  if (overlay && holdBtn && ring && btnText) {
    const TOTAL = 3000;
    const STEP = 50;
    const LEN = 276.46;
    let holdTimer = null;
    let progress = 0;

    document.body.classList.add('locked');

    const finish = () => {
      overlay.classList.add('is-hidden');
      document.body.classList.remove('locked');
      if (mainEl) mainEl.classList.add('revealed');
      if (typeof window.confetti === 'function') {
        window.confetti({
          particleCount: 120,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#FF758C', '#FF7EB3', '#ECC5C0'],
        });
      }
      setTimeout(() => { overlay.style.display = 'none'; }, 1000);
    };

    const cancel = () => {
      if (holdTimer) { clearInterval(holdTimer); holdTimer = null; }
      if (progress < TOTAL) {
        progress = 0;
        ring.style.strokeDashoffset = LEN;
        btnText.textContent = '按住解锁';
        if (typeof window.stopBgm === 'function') window.stopBgm();
      }
    };

    const start = e => {
      if (e && e.cancelable) e.preventDefault();
      if (holdTimer || progress >= TOTAL) return;
      progress = 0;
      btnText.textContent = '融合中...';
      if (typeof window.startBgm === 'function') window.startBgm();
      holdTimer = setInterval(() => {
        progress += STEP;
        ring.style.strokeDashoffset = Math.max(0, LEN - (progress / TOTAL) * LEN);
        if (progress >= TOTAL) {
          clearInterval(holdTimer);
          holdTimer = null;
          finish();
        }
      }, STEP);
    };

    holdBtn.addEventListener('pointerdown', start);
    window.addEventListener('pointerup', cancel);
    holdBtn.addEventListener('pointerleave', cancel);
    holdBtn.addEventListener('pointercancel', cancel);
    holdBtn.addEventListener('contextmenu', e => e.preventDefault());
    holdBtn.addEventListener('keydown', e => {
      if (e.key === ' ' || e.key === 'Enter') start(e);
    });
    window.addEventListener('keyup', e => {
      if (e.key === ' ' || e.key === 'Enter') cancel();
    });
  }

  /* ---------- 2. 星空背景 + 流星 ---------- */
  const skyCanvas = $('#sky-stars');
  if (skyCanvas) {
    const ctx = skyCanvas.getContext('2d');
    const world = skyCanvas.parentElement;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let stars = [];
    const meteors = [];

    const resize = () => {
      W = world.clientWidth;
      H = world.clientHeight;
      if (!W || !H) return;
      skyCanvas.width = W * dpr;
      skyCanvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(40, Math.floor((W * H) / 12000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.3 + 0.3,
        p: Math.random() * Math.PI * 2,
        s: 0.4 + Math.random(),
      }));
    };

    resize();
    if ('ResizeObserver' in window) {
      new ResizeObserver(resize).observe(world);
    } else {
      window.addEventListener('resize', resize);
    }

    (function loop(t) {
      if (W && H) {
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#ffe9f2';
        for (const st of stars) {
          ctx.globalAlpha = 0.2 + 0.6 * Math.abs(Math.sin((t / 1400) * st.s + st.p));
          ctx.beginPath();
          ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
          ctx.fill();
        }

        if (meteors.length < 3 && Math.random() < 0.02) {
          meteors.push({
            x: Math.random() * W * 0.75,
            y: Math.random() * H * 0.45,
            len: 70 + Math.random() * 90,
            sp: 4 + Math.random() * 4,
            a: 1,
          });
        }

        for (let i = meteors.length - 1; i >= 0; i--) {
          const m = meteors[i];
          const ex = m.x + m.len * 0.707;
          const ey = m.y + m.len * 0.707;
          const grad = ctx.createLinearGradient(m.x, m.y, ex, ey);
          grad.addColorStop(0, 'rgba(255, 182, 193, ' + m.a + ')');
          grad.addColorStop(1, 'rgba(255, 182, 193, 0)');
          ctx.globalAlpha = 1;
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(ex, ey);
          ctx.stroke();
          m.x += m.sp * 0.707;
          m.y += m.sp * 0.707;
          m.a -= 0.008;
          if (m.a <= 0 || m.x > W + 160 || m.y > H + 160) meteors.splice(i, 1);
        }
        ctx.globalAlpha = 1;
      }
      requestAnimationFrame(loop);
    })(performance.now());
  }

  /* ---------- 3. 翻转卡片 ---------- */
  $$('.sky-flip').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
  });

  /* ---------- 4. 刮刮乐 ---------- */
  const scratch = $('#scratchCanvas');
  if (scratch) {
    const sctx = scratch.getContext('2d');
    let drawing = false;

    const paint = () => {
      const w = scratch.offsetWidth;
      const h = scratch.offsetHeight;
      if (!w || !h) return;
      scratch.width = w;
      scratch.height = h;
      const grad = sctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#2a2d37');
      grad.addColorStop(1, '#3b2940');
      sctx.globalCompositeOperation = 'source-over';
      sctx.fillStyle = grad;
      sctx.fillRect(0, 0, w, h);
      sctx.font = '12px "PingFang SC", "Microsoft YaHei", sans-serif';
      sctx.fillStyle = '#a9b3c4';
      sctx.textAlign = 'center';
      sctx.textBaseline = 'middle';
      sctx.fillText('✨ 刮开涂层 查看隐藏心里话 ✨', w / 2, h / 2);
    };

    paint();
    let lastW = scratch.offsetWidth;
    window.addEventListener('resize', () => {
      if (Math.abs(scratch.offsetWidth - lastW) < 4) return;
      lastW = scratch.offsetWidth;
      paint();
    });

    const rub = e => {
      const rect = scratch.getBoundingClientRect();
      sctx.globalCompositeOperation = 'destination-out';
      sctx.beginPath();
      sctx.arc(e.clientX - rect.left, e.clientY - rect.top, 16, 0, Math.PI * 2);
      sctx.fill();
    };

    scratch.addEventListener('pointerdown', e => {
      drawing = true;
      rub(e);
      if (scratch.setPointerCapture) scratch.setPointerCapture(e.pointerId);
    });
    scratch.addEventListener('pointermove', e => {
      if (drawing) rub(e);
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(type => {
      scratch.addEventListener(type, () => { drawing = false; });
    });
  }

  /* ---------- 5. 爱意礼花 ---------- */
  const confettiBtn = $('#confettiBtn');
  if (confettiBtn) {
    confettiBtn.addEventListener('click', () => {
      if (typeof window.confetti !== 'function') return;
      window.confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#FF758C', '#ECC5C0', '#8A2387', '#FFFFFF'],
      });
    });
  }

  /* ---------- 6. 情话胶囊 ---------- */
  const QUOTES = [
    '四季更迭，唯有对你的喜欢经久不衰。',
    '世界上有千千万万种落日，而你是我唯一的晚霞。',
    '遇你之前，我随遇而安；遇你之后，我此生定居。',
    '我想和你一起，走过岁月的长河，看尽繁华落尽后的平淡。',
    '你是我在深夜漫漫星河里，捕捉到的最亮那一颗。',
    '爱不是彼此凝视，而是两个人看向同一个方向。',
    '只要你在身边，连空气都带有一丝玫瑰的清香。',
  ];
  const capsuleModal = $('#capsuleModal');
  const capsuleText = $('#capsuleText');

  if (capsuleModal && capsuleText) {
    const closeCapsule = () => {
      capsuleModal.classList.remove('is-open');
      capsuleModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    const capsuleBtn = $('#capsuleBtn');
    if (capsuleBtn) {
      capsuleBtn.addEventListener('click', () => {
        capsuleText.textContent = QUOTES[Math.floor(Math.random() * QUOTES.length)];
        capsuleModal.classList.add('is-open');
        capsuleModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    }
    const closeBtn = $('#closeCapsule');
    if (closeBtn) closeBtn.addEventListener('click', closeCapsule);
    capsuleModal.addEventListener('click', e => {
      if (e.target === capsuleModal) closeCapsule();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeCapsule();
    });
  }

  /* ---------- 8. 页脚年份 ---------- */
  const yearEl = $('#currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
