/* ══════════════════════════════════════════════════════════════
   Compliance Route 101 — course engine
   Map pathway · module player · gamified interactions
   Talks to the Java CourseServer (/api/*) when available and
   falls back to localStorage when opened as a static file.
   ══════════════════════════════════════════════════════════════ */
(() => {
  "use strict";
  const C = window.COURSE;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (name, cls = "") => `<svg class="ic ${cls}"><use href="#i-${name}"/></svg>`;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const KEY = "complianceRoute101.v1";

  /* ───────────────────────── state ───────────────────────── */
  const blank = () => ({ name: "", learnerId: "", points: 0, done: [], badges: [], awarded: {}, bestScore: null, reflection: "", completedAt: null });
  let S = load();
  function load() {
    try { return Object.assign(blank(), JSON.parse(localStorage.getItem(KEY)) || {}); } catch { return blank(); }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* storage unavailable */ }
    Api.sync();
  }

  /* ───────────────────────── server API ───────────────────────── */
  const Api = {
    online: false,
    async ping() {
      if (location.protocol === "file:") return;
      try { const r = await fetch("api/health", { cache: "no-store" }); this.online = r.ok && (await r.json()).status === "ok"; } catch { this.online = false; }
    },
    sync() {
      if (!this.online || !S.learnerId) return;
      const body = new URLSearchParams({
        learnerId: S.learnerId, name: S.name, points: S.points, modules: S.done.length,
        badges: S.badges.join(","), score: S.bestScore ?? "", completed: S.completedAt ? "true" : "false"
      });
      fetch("api/progress", { method: "POST", body }).catch(() => {});
    },
    async leaderboard() {
      if (!this.online) return null;
      try { const r = await fetch("api/leaderboard"); return r.ok ? r.json() : null; } catch { return null; }
    },
    async grade(answers) {
      if (!this.online) return null;
      try {
        const r = await fetch("api/assessment", { method: "POST", body: new URLSearchParams({ learnerId: S.learnerId, answers: answers.join(",") }) });
        return r.ok ? r.json() : null;
      } catch { return null; }
    }
  };

  /* ───────────────────────── gamification ───────────────────────── */
  const levelFor = p => C.levels.filter(l => p >= l.min).pop().title;
  function award(key, pts, el) {
    if (S.awarded[key] || pts <= 0) return 0;
    S.awarded[key] = pts; S.points += pts; save(); renderHud(true);
    floatPts(`+${pts}`, el);
    return pts;
  }
  function floatPts(text, el) {
    const r = (el || $("#hudPoints")).getBoundingClientRect();
    const f = document.createElement("div");
    f.className = "pts-float"; f.textContent = text;
    f.style.left = `${r.left + r.width / 2 - 20}px`; f.style.top = `${r.top}px`;
    document.body.appendChild(f); setTimeout(() => f.remove(), 1200);
  }
  function toast(msg, ic = "star") {
    const t = document.createElement("div");
    t.className = "toast"; t.innerHTML = `${icon(ic)}<span>${msg}</span>`;
    $("#toasts").appendChild(t); setTimeout(() => t.remove(), 3200);
  }
  function renderHud(bump) {
    const prevLevel = $("#hudLevel").textContent;
    $("#hudPoints").textContent = S.points;
    $("#hudLevel").textContent = levelFor(S.points);
    $("#hudBadges").textContent = S.badges.length;
    const pct = Math.round(S.done.length / C.modules.length * 100);
    $("#hudBar").style.width = pct + "%"; $("#hudPct").textContent = pct + "%";
    if (bump) { const h = $("#hudPoints").parentElement; h.classList.remove("bump"); void h.offsetWidth; h.classList.add("bump"); }
    if (bump && prevLevel !== $("#hudLevel").textContent) toast(`Level up! You are now a <b>${levelFor(S.points)}</b>`, "award");
  }

  /* confetti */
  function confetti(n = 160) {
    const cv = $("#confetti"), ctx = cv.getContext("2d");
    cv.width = innerWidth; cv.height = innerHeight;
    const cols = ["#0e7c86", "#14a3a8", "#e9a23b", "#0b2545", "#1f8a5b", "#ffffff"];
    const ps = Array.from({ length: n }, () => ({ x: Math.random() * cv.width, y: -20 - Math.random() * cv.height * .4, r: 4 + Math.random() * 6, c: cols[Math.random() * cols.length | 0], vy: 2 + Math.random() * 3, vx: -1.5 + Math.random() * 3, a: Math.random() * 6, va: -.2 + Math.random() * .4 }));
    let t = 0;
    (function frame() {
      ctx.clearRect(0, 0, cv.width, cv.height);
      ps.forEach(p => { p.x += p.vx; p.y += p.vy; p.a += p.va; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * .6); ctx.restore(); });
      if (++t < 220) requestAnimationFrame(frame); else ctx.clearRect(0, 0, cv.width, cv.height);
    })();
  }

  /* narration (Web Speech API) */
  const Narr = {
    playing: false, text: "",
    set(text) { this.stop(); this.text = text || ""; $("#narrBtn").classList.toggle("hidden", !this.text || !("speechSynthesis" in window)); },
    toggle() { this.playing ? this.stop() : this.play(); },
    play() {
      if (!this.text || !("speechSynthesis" in window)) return;
      const u = new SpeechSynthesisUtterance(this.text); u.rate = 1; u.lang = "en-US";
      u.onend = () => this.ui(false); speechSynthesis.speak(u); this.ui(true);
    },
    stop() { if ("speechSynthesis" in window) speechSynthesis.cancel(); this.ui(false); },
    ui(on) { this.playing = on; const b = $("#narrBtn"); b.classList.toggle("playing", on); b.innerHTML = on ? `${icon("volumeX")}<span>Stop narration</span>` : `${icon("volume")}<span>Play narration</span>`; }
  };

  /* ───────────────────────── modal ───────────────────────── */
  function modal(html, { dismiss = true } = {}) {
    $("#modalCard").innerHTML = html; $("#modal").classList.remove("hidden");
    $("#modal").onclick = e => { if (dismiss && e.target.id === "modal") closeModal(); };
    $$("[data-close]", $("#modalCard")).forEach(b => b.onclick = closeModal);
    const f = $("input,button", $("#modalCard")); f && f.focus();
  }
  const closeModal = () => { $("#modal").classList.add("hidden"); $("#modalCard").innerHTML = ""; };

  // Name entry is an inline form on the map (more reliable than a pop-up on iPad / in embedded viewers)
  function askName() {
    const card = $("#nameCard"); card.classList.remove("hidden");
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    card.classList.remove("nudge"); void card.offsetWidth; card.classList.add("nudge");
    setTimeout(() => { try { $("#nameInline").focus(); } catch {} }, 350);
  }
  function initNameForm() {
    $("#nameCard").addEventListener("submit", e => {
      e.preventDefault();
      const input = $("#nameInline"), v = input.value.trim();
      if (!v) { $("#nameErr").classList.remove("hidden"); input.focus(); return; }
      S.name = v; S.learnerId = S.learnerId || ((window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(36).slice(2));
      input.blur(); save(); renderMap();
      toast(`Route assigned to <b>${esc(v)}</b>. Safe travels!`, "navigation");
      setTimeout(() => openModule(1), 600);
    });
  }

  /* ───────────────────────── MAP ───────────────────────── */
  const isDone = id => S.done.includes(id);
  const isUnlocked = id => id === 1 || isDone(id - 1);
  const currentId = () => (C.modules.find(m => !isDone(m.id)) || {}).id || null;
  let pathLen = 0, nodePts = [];

  // Checkpoint waypoints (viewBox 1200×620). Low stops label below, high stops label above.
  const WAYPOINTS = [[100, 500], [245, 330], [400, 480], [550, 290], [705, 460], [855, 270], [1005, 430], [1110, 200]];

  function buildRoad(pts) {
    // Catmull-Rom → cubic Bézier for a smooth road through every checkpoint
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2, k = 1 / 6;
      d += ` C ${p1[0] + (p2[0] - p0[0]) * k} ${p1[1] + (p2[1] - p0[1]) * k}, ${p2[0] - (p3[0] - p1[0]) * k} ${p2[1] - (p3[1] - p1[1]) * k}, ${p2[0]} ${p2[1]}`;
    }
    return d;
  }

  function layoutNodes() {
    const d = buildRoad(WAYPOINTS);
    ["#roadBase", "#roadDash", "#roadDone"].forEach(s => $(s).setAttribute("d", d));
    const road = $("#roadBase");
    pathLen = road.getTotalLength();
    // find the path length at each waypoint by sampling
    const samples = [];
    for (let l = 0; l <= pathLen; l += 2) { const p = road.getPointAtLength(l); samples.push([l, p.x, p.y]); }
    nodePts = WAYPOINTS.map(([x, y], i) => {
      let best = samples[0], bd = Infinity;
      samples.forEach(s => { const dd = (s[1] - x) ** 2 + (s[2] - y) ** 2; if (dd < bd) { bd = dd; best = s; } });
      return { x, y, len: i === WAYPOINTS.length - 1 ? pathLen : i === 0 ? 0 : best[0], below: i % 2 === 0 };
    });
    const done = $("#roadDone");
    done.style.strokeDasharray = pathLen; done.style.strokeDashoffset = pathLen;
  }

  function renderMap(prevDone) {
    $("#learnerName").textContent = S.name || "Navigator";
    $("#nameCard").classList.toggle("hidden", !!S.name);
    const g = $("#nodes"); g.innerHTML = "";
    const cur = currentId();
    C.modules.forEach((m, i) => {
      const p = nodePts[i];
      const st = isDone(m.id) ? "done" : m.id === cur ? "current" : isUnlocked(m.id) ? "unlocked" : "locked";
      const ly = p.below ? 40 : -78;
      const w = Math.max(m.title.length * 6.6, m.district.length * 5.8) + 26;
      const node = document.createElementNS("http://www.w3.org/2000/svg", "g");
      node.setAttribute("class", `node ${st}`);
      node.setAttribute("transform", `translate(${p.x} ${p.y})`);
      node.setAttribute("tabindex", st === "locked" ? "-1" : "0");
      node.setAttribute("role", "button");
      node.setAttribute("aria-label", `Checkpoint ${m.id}: ${m.title} — ${st}`);
      node.innerHTML = `
        <circle class="pulse" r="30"/>
        <circle class="disc" r="28"/>
        <use href="#i-${st === "locked" ? "lock" : m.icon}" x="-13" y="-13" width="26" height="26" class="ic ic-node" style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"/>
        <circle class="num-bg" cx="21" cy="-21" r="11"/>
        <text class="num" x="21" y="-17" text-anchor="middle">${st === "done" ? "✓" : m.id}</text>
        <g class="label-g">
          <rect class="label-bg" x="${-w / 2}" y="${ly}" width="${w}" height="38" rx="10"/>
          <text class="label" x="0" y="${ly + 16}" text-anchor="middle">${esc(m.title)}</text>
          <text class="sublabel" x="0" y="${ly + 30}" text-anchor="middle">${esc(m.district)} · ${m.minutes} min</text>
        </g>`;
      const open = () => st === "locked" ? toast(`Complete checkpoint ${m.id - 1} to unlock this stretch of road.`, "lock") : openModule(m.id);
      node.addEventListener("click", open);
      node.addEventListener("keydown", e => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), open()));
      g.appendChild(node);
    });

    // road progress + marker
    const doneCount = S.done.length;
    const targetIdx = Math.min(doneCount, C.modules.length - 1);
    const fromIdx = prevDone != null ? Math.min(prevDone, C.modules.length - 1) : targetIdx;
    const road = $("#roadDone");
    const setRoad = idx => road.style.strokeDashoffset = pathLen - nodePts[idx].len;
    if (prevDone != null && fromIdx !== targetIdx) {
      setRoad(fromIdx);
      placeMarker(fromIdx);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setRoad(targetIdx);
        animateMarker(fromIdx, targetIdx);
        const nn = $$("#nodes .node")[targetIdx];
        if (nn) setTimeout(() => { nn.classList.add("unlocking"); toast(`New stretch unlocked: <b>${esc(C.modules[targetIdx].title)}</b>`, "key"); }, 1500);
      }));
    } else {
      setRoad(targetIdx);
      placeMarker(targetIdx);
    }

    // cards
    $("#moduleList").innerHTML = C.modules.map(m => {
      const st = isDone(m.id) ? "done" : isUnlocked(m.id) ? "open" : "locked";
      const chip = st === "done" ? `<span class="chip ok">${icon("check")} Complete</span>` : st === "open" ? `<span class="chip go">${icon("navigation")} Ready</span>` : `<span class="chip">${icon("lock")} Locked</span>`;
      return `<button class="mcard ${st}" data-mod="${m.id}" ${st === "locked" ? "disabled" : ""}>
        <span class="mi">${icon(st === "locked" ? "lock" : m.icon)}</span>
        <span><span class="eyebrow">Checkpoint ${m.id} · ${esc(m.district)}</span><h3>${esc(m.title)}</h3>
        <span class="meta">${icon("clock")} ${m.minutes} min ${chip}</span></span></button>`;
    }).join("");
    $$(".mcard").forEach(b => b.onclick = () => openModule(+b.dataset.mod));

    const cb = $("#continueBtn");
    if (!cur) cb.innerHTML = `${icon("award")}<span>View certificate</span>`;
    else cb.innerHTML = `${icon("navigation")}<span>${S.done.length ? `Continue: Checkpoint ${cur}` : "Start the route"}</span>`;
    cb.onclick = () => cur ? openModule(cur) : openModule(8, C.modules[7].screens.length - 1);
    renderHud();
  }

  // the traveller marker sits on the road just before the checkpoint it is heading to
  const markerLen = i => Math.max(0, nodePts[i].len - 52);
  function placeMarker(i) {
    const p = i === 0 ? { x: nodePts[0].x - 48, y: nodePts[0].y } : $("#roadBase").getPointAtLength(markerLen(i));
    $("#marker").setAttribute("transform", `translate(${p.x} ${p.y})`);
  }
  function animateMarker(fromIdx, toIdx) {
    const fromLen = markerLen(fromIdx), toLen = markerLen(toIdx);
    const road = $("#roadBase"), marker = $("#marker"), dur = 1600, t0 = performance.now();
    const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    (function step(now) {
      const t = Math.min(1, (now - t0) / dur);
      const p = road.getPointAtLength(fromLen + (toLen - fromLen) * ease(t));
      marker.setAttribute("transform", `translate(${p.x} ${p.y})`);
      if (t < 1) requestAnimationFrame(step);
    })(t0);
  }

  /* ───────────────────────── PLAYER ───────────────────────── */
  let mod = null, idx = 0, gate = false, cleanup = null;

  function openModule(id, startAt = 0) {
    if (!isUnlocked(id)) return;
    if (!S.name) return askName();
    mod = C.modules.find(m => m.id === id); idx = startAt;
    $("#mapView").classList.add("hidden"); $("#playerView").classList.remove("hidden");
    $("#sideIcon").setAttribute("href", `#i-${mod.icon}`);
    $("#sideEyebrow").textContent = `Checkpoint ${mod.id} of ${C.modules.length}`;
    $("#sideTitle").textContent = mod.title;
    $("#sideMeta").innerHTML = `${icon("mapPin")} ${esc(mod.district)} · ${icon("clock")} ${mod.minutes} min`;
    scrollTo({ top: 0, behavior: "smooth" });
    renderScreen();
  }

  function backToMap(prevDone) {
    Narr.stop(); cleanup && cleanup(); cleanup = null;
    $("#playerView").classList.add("hidden"); $("#mapView").classList.remove("hidden");
    renderMap(prevDone); scrollTo({ top: 0, behavior: "smooth" });
  }

  function setGate(locked, hint = "") {
    gate = locked; $("#nextBtn").disabled = locked;
    $("#navHint").textContent = locked ? hint : "";
  }
  const unlockNext = () => setGate(false);

  function renderScreen() {
    cleanup && cleanup(); cleanup = null;
    const sc = mod.screens[idx];
    $("#screenSteps").innerHTML = mod.screens.map((s, i) => `<li class="${i === idx ? "active" : i < idx ? "done" : ""}"><span class="dot">${i < idx ? "✓" : i + 1}</span>${esc(s.title)}</li>`).join("");
    $("#screenBar").style.width = `${(idx + 1) / mod.screens.length * 100}%`;
    $("#prevBtn").style.visibility = idx === 0 ? "hidden" : "visible";
    const last = idx === mod.screens.length - 1;
    $("#nextBtn").innerHTML = last ? `${icon("flag")} Complete checkpoint` : `Continue ${icon("arrowRight")}`;
    if (sc.type === "certificate") $("#nextBtn").innerHTML = `${icon("map")} Return to map`;
    const el = $("#screen"); el.style.animation = "none"; void el.offsetWidth; el.style.animation = "";
    Narr.set(sc.narration);
    setGate(false);
    (R[sc.type] || R.intro)(el, sc);
  }

  function next() {
    if (gate) return;
    Narr.stop();
    if (idx < mod.screens.length - 1) { idx++; renderScreen(); scrollTo({ top: 0, behavior: "smooth" }); return; }
    completeModule();
  }

  function completeModule() {
    const wasDone = isDone(mod.id);
    const prev = S.done.length;
    if (!wasDone) {
      S.done.push(mod.id);
      award(`mod-${mod.id}`, 50);
      if (!S.badges.includes(mod.badge.id)) S.badges.push(mod.badge.id);
      if (mod.id === C.modules.length) S.completedAt = new Date().toISOString();
      save();
      confetti(mod.id === C.modules.length ? 260 : 120);
      const nxt = C.modules[mod.id];
      modal(`<div class="badge-pop">
        <div class="big-badge">${icon(mod.badge.icon)}</div>
        <p class="eyebrow" style="justify-content:center">Badge earned · Checkpoint ${mod.id} complete</p>
        <h2 style="justify-content:center">${esc(mod.badge.name)}</h2>
        <p class="muted">+50 checkpoint bonus · ${S.points} total route points</p>
        ${nxt ? `<p>Next stop: <b>${esc(nxt.title)}</b> in ${esc(nxt.district)}.</p>` : "<p>You’ve reached your destination!</p>"}
        <div class="modal-actions" style="justify-content:center"><button class="btn btn-primary" id="toMap">${icon("map")} View my route</button></div></div>`, { dismiss: false });
      $("#toMap").onclick = () => { closeModal(); backToMap(prev); };
    } else backToMap();
  }

  /* ───────────────────────── SCREEN RENDERERS ───────────────────────── */
  const head = (sc, eyebrow) => `<div class="s-head"><div class="s-icon">${icon(sc.icon || mod.icon)}</div><div><p class="eyebrow">${esc(eyebrow || `Checkpoint ${mod.id} · Screen ${idx + 1}`)}</p><h2>${esc(sc.title)}</h2></div></div>`;
  const heroRoute = `<svg class="hero-route" viewBox="0 0 300 160"><path d="M10 150 C 80 150 60 70 140 70 S 220 140 290 10"/></svg>`;
  const feedbackBox = (kind, html) => `<div class="feedback ${kind}">${icon(kind === "good" ? "check" : kind === "mid" ? "alert" : "x")}<div>${html}</div></div>`;

  const R = {
    intro(el, sc) {
      const isWelcome = mod.id === 1 && idx === 0;
      el.innerHTML = isWelcome
        ? `<div class="hero">${heroRoute}<p class="eyebrow">${icon("map")} ${C.duration} · Self-paced</p><h2>${esc(sc.title)}</h2><p><b>${esc(sc.subtitle)}</b></p><p>${esc(sc.body)}</p></div>
           <div class="grid-2">${C.modules.slice(1).map(m => `<div class="tile"><span class="ti">${icon(m.icon)}</span><div><h3>${esc(m.title)}</h3><p>${m.minutes} minutes · ${esc(m.district)}</p></div></div>`).join("")}</div>`
        : `${head(sc)}<p class="s-body">${esc(sc.body)}</p>${sc.bullets ? `<div class="bullets">${sc.bullets.map((b, i) => `<div class="b" style="animation-delay:${i * .12}s">${icon(b.icon)}<span>${esc(b.text)}</span></div>`).join("")}</div>` : ""}`;
    },

    objectives(el, sc) { R.revealTiles(el, sc, "Reveal all four signposts to continue"); },
    channels(el, sc) { R.revealTiles(el, sc, "Explore every item to continue"); },
    revealTiles(el, sc, hint) {
      el.innerHTML = `${head(sc)}<p class="s-body">${esc(sc.lead)}</p><div class="grid-2">${sc.items.map((it, i) => `
        <button class="tile reveal" data-i="${i}"><span class="ti">${icon(it.icon)}</span><div><h3>${esc(it.title)}</h3><p class="txt"><span class="hide">Select to reveal</span></p></div>${icon("check", "tick")}</button>`).join("")}</div>`;
      const seen = new Set();
      setGate(true, hint);
      $$(".reveal", el).forEach(b => b.onclick = () => {
        const i = +b.dataset.i; b.classList.add("open"); $(".txt", b).textContent = sc.items[i].text;
        if (!seen.has(i)) { seen.add(i); award(`${mod.id}-${idx}-${i}`, sc.points || 5, b); }
        if (seen.size === sc.items.length) { unlockNext(); toast("All explored — continue down the road!", "check"); }
      });
    },

    howto(el, sc) {
      el.innerHTML = `${head(sc)}<p class="s-body">Here’s how your journey works. Every action on the route counts toward your navigator level.</p>
        <div class="grid-2">${sc.items.map((it, i) => `<div class="tile" style="animation:rise .5s ${i * .1}s both"><span class="ti">${icon(it.icon)}</span><div><h3>${esc(it.title)}</h3><p>${esc(it.text)}</p></div></div>`).join("")}</div>
        <div class="bullets">${C.levels.map((l, i) => `<div class="b" style="animation-delay:${.3 + i * .08}s">${icon("award")}<span><b>${esc(l.title)}</b> — ${l.min}+ route points</span></div>`).join("")}</div>`;
    },

    pillars(el, sc) {
      el.innerHTML = `${head(sc)}<p class="s-body">${esc(sc.lead)}</p>
        <div class="flips">${sc.cards.map((c, i) => `<button class="flip" data-i="${i}" aria-label="${esc(c.title)}"><div class="flip-in">
          <div class="flip-face flip-front">${icon(c.icon)}<h3>${esc(c.title)}</h3><small>Tap to flip</small></div>
          <div class="flip-face flip-back"><b>${esc(c.title)}</b><span>${esc(c.back)}</span></div></div></button>`).join("")}</div>`;
      const seen = new Set(); setGate(true, "Flip all four cards to continue");
      $$(".flip", el).forEach(b => b.onclick = () => {
        b.classList.toggle("open"); const i = +b.dataset.i;
        if (!seen.has(i)) { seen.add(i); award(`${mod.id}-${idx}-${i}`, sc.points, b); }
        if (seen.size === sc.cards.length) unlockNext();
      });
    },

    match(el, sc) {
      const defs = shuffle(sc.pairs.map((p, i) => ({ ...p, i })));
      el.innerHTML = `${head(sc)}<p class="s-body">${esc(sc.lead)}</p>
        <div class="match"><div class="match-col">${sc.pairs.map((p, i) => `<button class="mt term" data-i="${i}">${icon(p.icon)}<b>${esc(p.term)}</b></button>`).join("")}</div>
        <div class="match-col">${defs.map(d => `<button class="mt sign def" data-i="${d.i}">${icon("signpost")}<span>${esc(d.def)}</span></button>`).join("")}</div></div>
        <div id="mfb"></div>`;
      let sel = null, matched = 0, misses = 0; setGate(true, "Match all four pairs to continue");
      $$(".term", el).forEach(t => t.onclick = () => { if (t.classList.contains("matched")) return; $$(".term", el).forEach(x => x.classList.remove("sel")); t.classList.add("sel"); sel = +t.dataset.i; });
      $$(".def", el).forEach(d => d.onclick = () => {
        if (sel == null || d.classList.contains("matched")) return;
        const t = $(`.term[data-i="${sel}"]`, el);
        if (+d.dataset.i === sel) {
          t.classList.remove("sel"); t.classList.add("matched"); d.classList.add("matched"); matched++; sel = null;
          if (matched === sc.pairs.length) {
            const pts = Math.max(5, sc.points * sc.pairs.length - misses * 10);
            award(`${mod.id}-${idx}`, pts, d); unlockNext();
            $("#mfb", el).innerHTML = feedbackBox("good", `<p><b>All signs matched${misses ? "" : " — perfect run"}!</b> Policies set the expectation, procedures show the way, guidance helps when it’s unclear and accountability keeps everyone on course.</p>`);
          }
        } else { misses++; [d, t].forEach(x => { x.classList.remove("nope"); void x.offsetWidth; x.classList.add("nope"); }); }
      });
    },

    sort(el, sc) {
      const items = shuffle(sc.items.map((it, i) => ({ ...it, i })));
      el.innerHTML = `${head(sc)}<p class="s-body">${esc(sc.lead)}</p>
        <div class="sort-pool" id="pool">${items.map(it => `<button class="chipcard" draggable="true" data-i="${it.i}">${esc(it.text)}</button>`).join("")}</div>
        <div class="bins">${sc.bins.map(b => `<div class="bin" data-bin="${b.id}" tabindex="0" role="button" aria-label="Place in ${esc(b.label)}"><div class="bin-h">${icon(b.icon)}${esc(b.label)}</div></div>`).join("")}</div><div id="sfb"></div>`;
      let sel = null, placed = 0, misses = 0; setGate(true, "Sort every responsibility to continue");
      const place = (i, binEl) => {
        const it = sc.items[i], chip = $(`.chipcard[data-i="${i}"]`, el);
        if (!chip || chip.classList.contains("placed-ok")) return;
        if (it.bin === binEl.dataset.bin) {
          chip.classList.remove("sel"); chip.classList.add("placed-ok"); chip.draggable = false; binEl.appendChild(chip); placed++; sel = null;
          if (placed === sc.items.length) {
            award(`${mod.id}-${idx}`, Math.max(20, sc.points * 4 - misses * 10), binEl); unlockNext();
            $("#sfb", el).innerHTML = feedbackBox("good", `<p><b>Every stop has an owner.</b> ${misses ? `${misses} wrong turn(s) along the way — ` : "Flawless! "}Compliance works best when each role does its part.</p>`);
          }
        } else { misses++; binEl.classList.remove("nope"); void binEl.offsetWidth; binEl.classList.add("nope"); toast("Not quite — think about who owns that responsibility.", "alert"); }
      };
      $$(".chipcard", el).forEach(c => {
        c.onclick = () => { if (c.classList.contains("placed-ok")) return; $$(".chipcard", el).forEach(x => x.classList.remove("sel")); c.classList.add("sel"); sel = +c.dataset.i; $$(".bin", el).forEach(b => b.classList.add("target")); };
        c.ondragstart = e => { e.dataTransfer.setData("text/plain", c.dataset.i); c.classList.add("dragging"); };
        c.ondragend = () => c.classList.remove("dragging");
      });
      $$(".bin", el).forEach(b => {
        const drop = () => { if (sel != null) { place(sel, b); $$(".bin", el).forEach(x => x.classList.remove("target")); } };
        b.onclick = e => { if (e.target.closest(".chipcard")) return; drop(); };
        b.onkeydown = e => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), drop());
        b.ondragover = e => { e.preventDefault(); b.classList.add("over"); };
        b.ondragleave = () => b.classList.remove("over");
        b.ondrop = e => { e.preventDefault(); b.classList.remove("over"); place(+e.dataTransfer.getData("text/plain"), b); };
      });
    },

    choice(el, sc) {
      const keys = "ABCD";
      el.innerHTML = `${head(sc, sc.badgeLabel)}
        <div class="scene"><span class="si">${icon(sc.scenario.icon)}</span><div><span class="lbl">${esc(sc.scenario.label)}</span><p>${esc(sc.scenario.text)}</p></div></div>
        <p class="q">${esc(sc.question)}</p>
        <div class="options ${sc.tf ? "tf-opts" : ""}">${sc.options.map((o, i) => `<button class="opt" data-i="${i}">${sc.tf ? "" : `<span class="key">${keys[i]}</span>`}<span>${esc(o.text)}</span></button>`).join("")}</div><div id="cfb"></div>`;
      let tries = 0; setGate(true, "Choose the best answer to continue");
      $$(".opt", el).forEach(b => b.onclick = () => {
        const o = sc.options[+b.dataset.i]; tries++;
        if (o.correct) {
          b.classList.add("correct"); $$(".opt", el).forEach(x => x.disabled = true);
          const pts = tries === 1 ? sc.points : Math.round(sc.points / 3);
          award(`${mod.id}-${idx}`, pts, b);
          $("#cfb", el).innerHTML = feedbackBox("good", `<p><b>${tries === 1 ? "Right on route!" : "You found the route."}</b> ${esc(sc.feedback.correct)}</p>`);
          unlockNext();
        } else {
          b.classList.add("wrong"); b.disabled = true;
          $("#cfb", el).innerHTML = feedbackBox("bad", `<p><b>Wrong turn.</b> ${esc(sc.feedback.incorrect)} Try again.</p>`);
        }
      });
    },

    redflags(el, sc) {
      const items = shuffle(sc.items.map((it, i) => ({ ...it, i })));
      const C2 = 2 * Math.PI * 18;
      el.innerHTML = `${head(sc)}<p class="s-body">${esc(sc.lead)}</p>
        <div class="radar-bar"><div class="timer" id="tmr"><svg class="ring" viewBox="0 0 44 44"><circle class="bg" cx="22" cy="22" r="18"/><circle class="fg" cx="22" cy="22" r="18" stroke-dasharray="${C2}" stroke-dashoffset="0"/></svg><span id="tsec">${sc.seconds}s</span></div>
        <span class="chip" id="tagCount">${icon("flag")} 0 tagged</span>
        <button class="btn btn-primary btn-sm" id="rfSubmit">${icon("search")} Submit radar scan</button></div>
        <div class="inbox">${items.map(it => `<button class="mailrow" data-i="${it.i}" aria-pressed="false"><span class="mi">${icon(it.icon)}</span><span class="txt">${esc(it.text)}</span><span class="flagbox">${icon("flag")}</span></button>`).join("")}</div><div id="rfb"></div>`;
      setGate(true, "Submit your radar scan to continue");
      let left = sc.seconds, finished = false;
      const tagged = new Set();
      const fg = $(".fg", el);
      const iv = setInterval(() => {
        left--; $("#tsec", el).textContent = `${Math.max(0, left)}s`;
        fg.style.strokeDashoffset = C2 * (1 - left / sc.seconds);
        $("#tmr", el).classList.toggle("low", left <= 10);
        if (left <= 0) finish(true);
      }, 1000);
      cleanup = () => clearInterval(iv);
      $$(".mailrow", el).forEach(r => r.onclick = () => {
        if (finished) return; const i = +r.dataset.i;
        tagged.has(i) ? tagged.delete(i) : tagged.add(i);
        r.classList.toggle("tagged"); r.setAttribute("aria-pressed", tagged.has(i));
        $("#tagCount", el).innerHTML = `${icon("flag")} ${tagged.size} tagged`;
      });
      $("#rfSubmit", el).onclick = () => finish(false);
      function finish(timeout) {
        if (finished) return; finished = true; clearInterval(iv);
        let hits = 0, misses = 0, falses = 0;
        $$(".mailrow", el).forEach(r => {
          const it = sc.items[+r.dataset.i], t = tagged.has(+r.dataset.i);
          r.disabled = true;
          let res;
          if (it.flag && t) { hits++; r.classList.add("res-ok"); res = `<span class="res" style="color:var(--green)">Red flag spotted</span>`; }
          else if (it.flag && !t) { misses++; r.classList.add("res-miss"); res = `<span class="res" style="color:#9a5f05">Missed red flag</span>`; }
          else if (!it.flag && t) { falses++; r.classList.add("res-false"); res = `<span class="res" style="color:var(--red)">Routine — not a flag</span>`; }
          else res = `<span class="res" style="color:var(--muted)">Routine</span>`;
          $(".txt", r).innerHTML = `${esc(it.text)}<span class="why">${res} · ${esc(it.why)}</span>`;
        });
        const total = sc.items.filter(x => x.flag).length;
        const speed = timeout ? 0 : Math.round(left / 2);
        const pts = Math.max(0, hits * 25 - falses * 10 + speed);
        award(`${mod.id}-${idx}`, pts, $("#rfSubmit", el));
        const kind = hits === total && !falses ? "good" : hits >= total - 1 ? "mid" : "bad";
        $("#rfb", el).innerHTML = feedbackBox(kind, `<p><b>Radar result: ${hits}/${total} red flags spotted${falses ? `, ${falses} false alarm(s)` : ""}.</b> ${timeout ? "Time ran out — " : `Speed bonus +${speed}. `}Remember: pressure to rush, missing documentation, bypassed reviews and secrecy are all reasons to pause and check.</p><div class="pill-row"><span class="chip ok">+${pts} route points</span></div>`);
        if (hits === total && !falses) toast("Eagle eyes! Perfect radar scan.", "eye");
        unlockNext(); $("#rfSubmit", el).disabled = true;
      }
    },

    branch(el, sc) {
      const steps = ["s1", "s2", "s3"], labels = ["Pause", "Check", "Document"];
      let node = sc.start, earned = 0, perfect = true;
      setGate(true, "Work through the scenario to continue");
      const draw = () => {
        const n = sc.nodes[node], si = steps.indexOf(node);
        el.innerHTML = `${head(sc, "Scenario-based decision practice")}
          <div class="branch-track">${steps.map((s, i) => `${i ? '<span class="bt-sep"></span>' : ""}<span class="bt-step ${i < si ? "done" : i === si ? "on" : ""}">${icon(i < si ? "check" : ["pause", "clipboard", "fileText"][i])} ${labels[i]}</span>`).join("")}</div>
          <div class="scene"><span class="si">${icon(n.scene.icon)}</span><div><span class="lbl">Decision point ${si + 1} of 3</span><p>${esc(n.context)}</p><div class="bubble">${esc(n.scene.who)}: “${esc(n.scene.quote)}”</div></div></div>
          <p class="q">${esc(n.question)}</p>
          <div class="options">${n.options.map((o, i) => `<button class="opt" data-i="${i}"><span class="key">${icon(["signpost", "split", "navigation"][i])}</span><span>${esc(o.text)}</span></button>`).join("")}</div><div id="bfb"></div>`;
        $$(".opt", el).forEach(b => b.onclick = () => {
          const o = n.options[+b.dataset.i];
          $$(".opt", el).forEach(x => x.disabled = true);
          b.classList.add(o.quality === "best" ? "correct" : o.quality === "ok" ? "ok" : "wrong");
          if (o.quality !== "best") perfect = false;
          const key = `${mod.id}-${idx}-${node}`;
          const got = award(key, o.points, b); earned += got;
          const target = sc.nodes[o.next];
          const isRetry = target && target.retry;
          const kind = o.quality === "best" ? "good" : o.quality === "ok" ? "mid" : "bad";
          const title = o.quality === "best" ? "Best response." : o.quality === "ok" ? "Acceptable route." : "Detour ahead.";
          const extra = node === "s1" && o.quality === "best" ? `<div class="pill-row">${["pause", "clipboard", "fileText", "help"].map((ic, i) => `<span class="chip ok">${icon(ic)} ${["Pause", "Check", "Document", "Seek guidance"][i]}</span>`).join("")}</div>` : "";
          $("#bfb", el).innerHTML = feedbackBox(kind, `<p><b>${title}</b> ${esc(o.feedback)}</p>${extra}
            <div style="margin-top:12px"><button class="btn ${isRetry ? "btn-ghost" : "btn-primary"} btn-sm" id="bNext">${isRetry ? `${icon("refresh")} Try that decision again` : o.next === "end" ? `${icon("flag")} See scenario results` : `${icon("arrowRight")} Continue the scenario`}</button></div>`);
          $("#bNext", el).onclick = () => { node = isRetry ? target.retry : o.next; node === "end" ? end() : draw(); };
        });
      };
      const end = () => {
        el.innerHTML = `${head(sc, "Scenario complete")}
          <div class="result"><div class="stars">${[0, 1, 2].map(i => icon("star", (perfect || i < 2) ? "on" : "")).join("")}</div>
          <h2>${perfect ? "Flawless navigation!" : "Scenario complete"}</h2>
          <p class="muted">You paused, checked the procedure and documented the facts — the approved route for unclear requests.</p>
          <div class="stat-row"><div class="stat"><b>+${earned}</b>route points</div><div class="stat"><b>${perfect ? "3/3" : "Retried"}</b>best decisions</div></div></div>
          ${feedbackBox("good", "<p>Follow PRCI’s approved policies and reporting channels, and document the concern as directed.</p>")}`;
        if (perfect) award(`${mod.id}-${idx}-perfect`, 30);
        unlockNext();
      };
      draw();
    },

    order(el, sc) {
      let order = shuffle(sc.items.map((_, i) => i));
      while (order.every((v, i) => v === i)) order = shuffle(order);
      let moves = 0, solved = false; setGate(true, "Put the steps in order to continue");
      const draw = () => {
        el.innerHTML = `${head(sc)}<p class="s-body">${esc(sc.lead)}</p>
          <div class="order-list ${solved ? "solved" : ""}">${order.map((it, pos) => { const s = sc.items[it]; return `
            <div class="ord" draggable="${!solved}" data-pos="${pos}"><span class="grip">${icon("grip")}</span><span class="n">${pos + 1}</span>${icon(s.icon, "oi")}<div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>
            ${solved ? "" : `<span class="arrows"><button data-mv="-1" aria-label="Move up" ${pos === 0 ? "disabled" : ""}>${icon("up")}</button><button data-mv="1" aria-label="Move down" ${pos === order.length - 1 ? "disabled" : ""}>${icon("down")}</button></span>`}</div>`; }).join("")}</div>
          <div style="margin-top:14px">${solved ? "" : `<button class="btn btn-primary" id="chk">${icon("check")} Check my route</button>`}</div><div id="ofb"></div>`;
        if (solved) {
          $("#ofb", el).innerHTML = feedbackBox("good", "<p><b>Route plotted!</b> Pause → Check → Document → Ask for guidance. Keep this sequence handy for any unclear situation.</p>");
          return;
        }
        $$(".ord", el).forEach(r => {
          const pos = +r.dataset.pos;
          $$("[data-mv]", r).forEach(b => b.onclick = () => { const t = pos + +b.dataset.mv; [order[pos], order[t]] = [order[t], order[pos]]; moves++; draw(); });
          r.ondragstart = e => { e.dataTransfer.setData("text/plain", pos); r.classList.add("dragging"); };
          r.ondragend = () => r.classList.remove("dragging");
          r.ondragover = e => { e.preventDefault(); r.classList.add("over"); };
          r.ondragleave = () => r.classList.remove("over");
          r.ondrop = e => { e.preventDefault(); const from = +e.dataTransfer.getData("text/plain"); const [m] = order.splice(from, 1); order.splice(pos, 0, m); moves++; draw(); };
        });
        $("#chk", el).onclick = () => {
          if (order.every((v, i) => v === i)) { solved = true; draw(); award(`${mod.id}-${idx}`, Math.max(10, sc.points - Math.max(0, moves - 4) * 2), $("#ofb", el)); unlockNext(); }
          else { const ok = order.filter((v, i) => v === i).length; $("#ofb", el).innerHTML = feedbackBox("bad", `<p><b>${ok} of ${order.length} steps in place.</b> Think: what do you do before acting? What comes before asking?</p>`); }
        };
      };
      draw();
    },

    mythfact(el, sc) {
      let i = 0, right = 0; setGate(true, "Finish the speed round to continue");
      const draw = () => {
        if (i >= sc.statements.length) {
          award(`${mod.id}-${idx}`, right * sc.points + (right === sc.statements.length ? 20 : 0));
          el.innerHTML = `${head(sc)}<div class="result"><div class="stars">${[0, 1, 2].map(k => icon("star", right >= [1, 3, 4][k] ? "on" : "")).join("")}</div><h2>${right}/${sc.statements.length} correct</h2><p class="muted">${right === sc.statements.length ? "Perfect speed round! +20 bonus." : "Good effort — review the explanations and keep going."}</p></div>`;
          return unlockNext();
        }
        const s = sc.statements[i];
        el.innerHTML = `${head(sc)}<p class="s-body">${esc(sc.lead)}</p>
          <div class="mf-card">“${esc(s.text)}”</div><p class="mf-count">Statement ${i + 1} of ${sc.statements.length}</p>
          <div class="mf-btns"><button class="opt" data-v="0">${icon("x")} Myth</button><button class="opt" data-v="1">${icon("check")} Fact</button></div><div id="mffb"></div>`;
        $$(".mf-btns .opt", el).forEach(b => b.onclick = () => {
          const ans = b.dataset.v === "1", ok = ans === s.fact; if (ok) right++;
          $$(".mf-btns .opt", el).forEach(x => x.disabled = true); b.classList.add(ok ? "correct" : "wrong");
          $("#mffb", el).innerHTML = feedbackBox(ok ? "good" : "bad", `<p><b>${s.fact ? "Fact." : "Myth."}</b> ${esc(s.why || "That’s an accurate statement about speaking up.")}</p><div style="margin-top:10px"><button class="btn btn-primary btn-sm" id="mfn">${icon("arrowRight")} Next</button></div>`);
          $("#mfn", el).onclick = () => { i++; draw(); };
        });
      };
      draw();
    },

    quiz(el, sc) {
      const startScreen = () => {
        el.innerHTML = `${head(sc)}<div class="hero">${heroRoute}<p class="eyebrow">${icon("target")} Final assessment</p><h2>Ready for the summit?</h2><p>${esc(sc.lead)}</p></div>
          <div class="grid-2">
            <div class="tile"><span class="ti">${icon("fuel")}</span><div><h3>${sc.fuel} fuel tanks</h3><p>Each wrong turn burns one tank.</p></div></div>
            <div class="tile"><span class="ti">${icon("clock")}</span><div><h3>${sc.seconds}s per checkpoint</h3><p>Answer faster for a time bonus.</p></div></div>
            <div class="tile"><span class="ti">${icon("flame")}</span><div><h3>Streak multiplier</h3><p>Consecutive correct answers boost points up to ×3.</p></div></div>
            <div class="tile"><span class="ti">${icon("award")}</span><div><h3>Pass at ${Math.round(C.passMark * 100)}%</h3><p>Retry as often as you need.</p></div></div>
          </div>${S.bestScore != null ? `<p class="muted" style="margin-top:14px">${icon("trophy")} Your best score so far: <b>${S.bestScore}%</b></p>` : ""}
          <div style="margin-top:18px"><button class="btn btn-gold" id="qStart">${icon("zap")} Start the Final Route Challenge</button></div>`;
        $("#qStart", el).onclick = run;
      };
      setGate(!(S.bestScore >= C.passMark * 100), "Pass the challenge to continue");
      startScreen();

      function run() {
        const qs = sc.questions.map((q, i) => ({ ...q, i }));
        let qi = 0, fuel = sc.fuel, streak = 0, best = 0, score = 0, correct = 0, iv = null;
        const results = [], answers = [];
        const draw = () => {
          const q = qs[qi]; let left = sc.seconds;
          const order = shuffle(q.options.map((_, i) => i));
          el.innerHTML = `${head(sc, `Checkpoint question ${qi + 1} of ${qs.length}`)}
            <div class="quiz-hud">
              <span class="qh"><span class="fuel-tanks">${Array.from({ length: sc.fuel }, (_, k) => icon("fuel", k < fuel ? "" : "empty")).join("")}</span> Fuel</span>
              <span class="q-track">${qs.map((_, k) => `<span class="${results[k] === true ? "ok" : results[k] === false ? "no" : k === qi ? "cur" : ""}"></span>`).join("")}</span>
              <span class="qh streak ${streak > 1 ? "hot" : ""}">${icon("flame")} Streak ×${Math.min(3, 1 + streak * .5).toFixed(1)}</span>
              <span class="qh">${icon("star")} ${score}</span>
              <span class="qh" id="qt">${icon("clock")} ${left}s</span>
            </div>
            <div class="tbar"><i id="tb" style="width:100%"></i></div>
            <p class="q">${esc(q.q)}</p>
            <div class="options ${q.options.length === 2 ? "tf-opts" : ""}">${order.map((oi, k) => `<button class="opt" data-o="${oi}">${q.options.length === 2 ? "" : `<span class="key">${"ABC"[k]}</span>`}<span>${esc(q.options[oi])}</span></button>`).join("")}</div><div id="qfb"></div>`;
          iv = setInterval(() => {
            left--; $("#qt", el).innerHTML = `${icon("clock")} ${Math.max(0, left)}s`;
            $("#tb", el).style.width = `${left / sc.seconds * 100}%`; $(".tbar", el).classList.toggle("low", left <= 8);
            if (left <= 0) answer(-1);
          }, 1000);
          cleanup = () => clearInterval(iv);
          const answer = o => {
            clearInterval(iv);
            $$(".opt", el).forEach(x => { x.disabled = true; if (+x.dataset.o === q.answer) x.classList.add("correct"); });
            answers[q.i] = o;
            const ok = o === q.answer; results[qi] = ok;
            let gained = 0;
            if (ok) {
              const mult = Math.min(3, 1 + streak * .5); streak++; best = Math.max(best, streak); correct++;
              gained = Math.round((sc.base + left * 2) * mult); score += gained;
            } else {
              streak = 0; fuel = Math.max(0, fuel - 1);
              const b = $(`.opt[data-o="${o}"]`, el); b && b.classList.add("wrong");
            }
            const lastQ = qi === qs.length - 1;
            $("#qfb", el).innerHTML = feedbackBox(ok ? "good" : "bad", `<p><b>${ok ? `Correct! +${gained}` : o === -1 ? "Out of time — one fuel tank burned." : "Wrong turn — one fuel tank burned."}</b> ${esc(q.feedback)}</p>
              <div style="margin-top:12px"><button class="btn btn-primary btn-sm" id="qn">${lastQ ? `${icon("flag")} See results` : `${icon("arrowRight")} Next checkpoint`}</button></div>`);
            if (ok && streak >= 3) toast(`${streak} in a row! Streak multiplier ×${Math.min(3, 1 + streak * .5).toFixed(1)}`, "flame");
            $("#qn", el).onclick = () => { if (lastQ) finish(); else { qi++; draw(); } };
          };
          $$(".opt", el).forEach(b => b.onclick = () => answer(+b.dataset.o));
        };
        const finish = async () => {
          let pct = Math.round(correct / qs.length * 100);
          const server = await Api.grade(answers);
          if (server && typeof server.percent === "number") pct = server.percent;
          const pass = pct >= C.passMark * 100;
          const fuelBonus = pass ? fuel * 25 : 0;
          const stars = pct === 100 ? 3 : pct >= 80 ? 2 : pct >= 50 ? 1 : 0;
          if (S.bestScore == null || pct > S.bestScore) S.bestScore = pct;
          if (pass) {
            const prev = S.awarded[`${mod.id}-quiz`] || 0, total = score + fuelBonus;
            if (total > prev) { S.points += total - prev; S.awarded[`${mod.id}-quiz`] = total; floatPts(`+${total - prev}`); }
            renderHud(true); confetti(140); unlockNext();
          }
          save();
          el.innerHTML = `${head(sc, "Challenge results")}
            <div class="result ${pass ? "" : "fail"}"><div class="stars">${[0, 1, 2].map(k => icon("star", k < stars ? "on" : "")).join("")}</div>
            <div class="big">${pct}%</div><h2>${pass ? "Summit reached — you passed!" : "Not quite at the summit"}</h2>
            <p class="muted">${pass ? "Continue to complete the checkpoint and collect your badge." : `You need ${Math.round(C.passMark * 100)}% to pass. Review the feedback and try again — every attempt sharpens your route sense.`}</p>
            <div class="stat-row"><div class="stat"><b>${correct}/${qs.length}</b>correct</div><div class="stat"><b>${score}</b>challenge points</div><div class="stat"><b>×${best}</b>best streak</div><div class="stat"><b>${fuel}/${sc.fuel}</b>fuel left${pass ? ` (+${fuelBonus})` : ""}</div></div>
            ${server ? `<p class="muted" style="font-size:.8rem">${icon("shield")} Score verified by the course server.</p>` : ""}
            ${pass ? "" : `<button class="btn btn-gold" id="retry">${icon("refresh")} Retry the challenge</button>`}</div>`;
          const r = $("#retry", el); r && (r.onclick = run);
        };
        draw();
      }
    },

    takeaway(el, sc) {
      el.innerHTML = `${head(sc)}<p class="s-body">Compliance is part of everyday work. Keep this four-step route with you.</p>
        <div class="pcda">${sc.steps.map((s, i) => `<div class="pc" style="animation-delay:${i * .15}s"><span class="step">STEP ${i + 1}</span><div class="pi">${icon(s.icon)}</div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`).join("")}</div>
        <div class="bullets">${[["shield", "You don’t need proof to ask a question or raise a concern."], ["book", "Your organization’s policies and procedures guide the next steps."], ["megaphone", "Use PRCI’s approved channels for guidance and reporting."]].map(([ic, t], i) => `<div class="b" style="animation-delay:${.6 + i * .1}s">${icon(ic)}<span>${t}</span></div>`).join("")}</div>`;
    },

    reflect(el, sc) {
      el.innerHTML = `${head(sc)}<p class="s-body">${esc(sc.lead)}</p><textarea id="refl" placeholder="e.g. A rushed approval request — I’d pause, check the procedure, and contact my manager first.">${esc(S.reflection || "")}</textarea>
        <p class="muted" style="font-size:.85rem;margin-top:8px">${icon("star")} Write at least 20 characters for +${sc.points} route points.</p>`;
      const ta = $("#refl", el);
      ta.oninput = () => { S.reflection = ta.value; try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} if (ta.value.trim().length >= 20) award(`${mod.id}-${idx}`, sc.points, ta); };
    },

    certificate(el) {
      if (!isDone(8)) {
        S.done.includes(8) || S.done.push(8);
        if (!S.badges.includes(mod.badge.id)) S.badges.push(mod.badge.id);
        S.completedAt = S.completedAt || new Date().toISOString();
        award("mod-8", 50); save(); confetti(280);
      }
      const date = new Date(S.completedAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
      el.innerHTML = `<div class="cert">
        <div class="seal">${icon("award")}</div>
        <p class="eyebrow" style="justify-content:center">Certificate of completion</p>
        <h2>Compliance Route 101</h2><p class="muted">This certifies that</p>
        <div class="name">${esc(S.name)}</div>
        <p>has completed all eight checkpoints of <b>Compliance Route 101: Making responsible decisions at work</b>.</p>
        <div class="badges">${C.modules.map(m => `<span title="${esc(m.badge.name)}">${icon(m.badge.icon)}</span>`).join("")}</div>
        <div class="stat-row"><div class="stat"><b>${S.bestScore ?? "—"}%</b>final assessment</div><div class="stat"><b>${S.points}</b>route points</div><div class="stat"><b>${esc(levelFor(S.points))}</b>navigator level</div><div class="stat"><b>${date}</b>completed</div></div>
        <div class="cert-actions" style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:10px">
          ${window.self === window.top ? `<button class="btn btn-primary" id="printCert">${icon("printer")} Print / save as PDF</button>` : ""}
          <button class="btn btn-ghost" id="certBoard">${icon("trophy")} Leaderboard</button>
          <button class="btn btn-ghost" id="certRestart">${icon("refresh")} Restart course</button></div></div>`;
      const pc = $("#printCert", el); pc && (pc.onclick = () => print());
      $("#certBoard", el).onclick = showBoard;
      $("#certRestart", el).onclick = confirmRestart;
    }
  };

  /* ───────────────────────── passport + leaderboard ───────────────────────── */
  function showPassport() {
    modal(`<h2>${icon("award")} Route Passport</h2><p class="muted">${esc(S.name || "Navigator")} · ${S.points} points · ${esc(levelFor(S.points))}</p>
      <div class="passport">${C.modules.map(m => { const got = S.badges.includes(m.badge.id); return `<div class="stamp ${got ? "got" : ""}"><div class="si">${icon(got ? m.badge.icon : "lock")}</div><b>${esc(m.badge.name)}</b><br>Checkpoint ${m.id}</div>`; }).join("")}</div>
      <div class="modal-actions"><button class="btn btn-ghost" id="resetBtn">${icon("refresh")} Restart course</button><button class="btn btn-primary" data-close>Close</button></div>`);
    $("#resetBtn").onclick = confirmRestart;
  }

  /* ───────────────────────── restart ───────────────────────── */
  function confirmRestart() {
    modal(`<h2>${icon("refresh")} Restart the course?</h2>
      <p>This takes you back to the start and clears your name, progress, route points, badges and final assessment score on this device.</p>
      <p class="muted">You’ll type a name again before Checkpoint 1, so someone else can also take the course from the beginning.</p>
      <div class="modal-actions"><button class="btn btn-ghost" data-close>Keep my progress</button><button class="btn btn-primary" id="restartGo">${icon("refresh")} Restart course</button></div>`);
    $("#restartGo").onclick = restartCourse;
  }
  function restartCourse() {
    S = blank(); save();
    const nameIn = $("#nameInline"); if (nameIn) nameIn.value = "";
    $("#nameErr").classList.add("hidden");
    closeModal(); Narr.stop(); cleanup && cleanup(); cleanup = null; mod = null; idx = 0;
    $("#playerView").classList.add("hidden"); $("#mapView").classList.remove("hidden");
    renderMap(); scrollTo({ top: 0, behavior: "smooth" });
    toast("Course restarted. Type a name to begin the route again.", "refresh");
    setTimeout(askName, 400);
  }

  async function showBoard() {
    modal(`<h2>${icon("trophy")} Leaderboard</h2><p class="muted">Loading…</p>`);
    const data = await Api.leaderboard();
    let rows = data && Array.isArray(data.leaders) ? data.leaders : null;
    const note = rows ? "Live standings from the course server." : "Offline mode — showing your result only. Run the Java CourseServer for a shared leaderboard.";
    if (!rows) rows = [{ learnerId: S.learnerId, name: S.name || "You", points: S.points, modules: S.done.length }];
    modal(`<h2>${icon("trophy")} Leaderboard</h2><p class="muted" style="font-size:.85rem">${note}</p>
      <table class="board"><thead><tr><th>#</th><th>Navigator</th><th>Checkpoints</th><th>Points</th></tr></thead><tbody>
      ${rows.map((r, i) => `<tr class="${r.learnerId === S.learnerId ? "me" : ""}"><td>${i < 3 ? icon("trophy") : i + 1}</td><td>${esc(r.name)}</td><td>${r.modules}/8</td><td>${r.points}</td></tr>`).join("")}</tbody></table>
      <div class="modal-actions"><button class="btn btn-primary" data-close>Close</button></div>`);
  }

  /* ───────────────────────── theme ───────────────────────── */
  function initTheme() {
    let t = null; try { t = localStorage.getItem(KEY + ".theme"); } catch {}
    if (t) document.documentElement.dataset.theme = t;
    const sync = () => { const dark = document.documentElement.dataset.theme === "dark" || (!document.documentElement.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches); $("#themeBtn").innerHTML = icon(dark ? "sun" : "moon"); return dark; };
    sync();
    $("#themeBtn").onclick = () => { const dark = sync(); const nt = dark ? "light" : "dark"; document.documentElement.dataset.theme = nt; try { localStorage.setItem(KEY + ".theme", nt); } catch {} sync(); };
  }

  /* ───────────────────────── boot ───────────────────────── */
  $("#nextBtn").onclick = next;
  $("#prevBtn").onclick = () => { if (idx > 0) { Narr.stop(); idx--; renderScreen(); } };
  $("#backToMap").onclick = () => backToMap();
  $("#narrBtn").onclick = () => Narr.toggle();
  $("#passportBtn").onclick = showPassport;
  $("#boardBtn").onclick = showBoard;
  $("#restartBtn").onclick = confirmRestart;
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("#modal").classList.contains("hidden")) closeModal(); });
  initTheme();
  initNameForm();
  layoutNodes();
  renderMap();
  Api.ping().then(() => Api.sync());
})();
