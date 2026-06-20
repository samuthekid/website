// BlockedBySquare hero:
//  1. scatter a wall of faux terminals behind the content
//  2. the glass square follows the cursor inside the hero
//  3. the two text lines rotate through preset phrases
// Vanilla, no deps.
(function () {
  "use strict";

  // ---------- 1. terminal wall ----------
  var TERMS = [
    { title: "agent — refactor", lines: [
      '<b class="t-cmd">&gt; refactor the auth module</b>',
      '<b class="t-ai">●</b> <b class="t-ai">Thinking…</b>',
      '<b class="t-dim">  the token logic is duplicated in 3</b>',
      '<b class="t-dim">  places — I\'ll extract a helper first</b>',
      '<b class="t-info">● Read(src/auth/session.ts)</b>',
      '<b class="t-dim">  ⎿ read 214 lines</b>',
      '<b class="t-info">● Grep("refreshToken")</b>',
      '<b class="t-dim">  ⎿ 6 matches in 3 files</b>',
      '<b class="t-info">● Edit(src/auth/tokens.ts)</b>',
      '<b class="t-dim">  ⎿ +41 −18</b>',
      '<b class="t-info">● Bash(npm test)</b>',
      '<b class="t-ok">  ⎿ ✓ 128 passing (2.4s)</b>',
      '<b class="t-ai">●</b> Done. Extracted <b class="t-ai">refreshToken()</b>',
      '<b class="t-dim">  and removed the duplication.</b>',
      '<b class="t-dim">  3 files edited · 412 tokens</b>',
    ]},
    { title: "agent — model", lines: [
      '<b class="t-cmd">&gt; tune the classifier</b>',
      '<b class="t-ai">●</b> <b class="t-ai">Thinking…</b>',
      '<b class="t-dim">  acc plateaued at 0.92 — likely lr</b>',
      '<b class="t-dim">  too high. trying cosine decay.</b>',
      '<b class="t-info">● Edit(train.py)</b>',
      '<b class="t-dim">  ⎿ scheduler = cosine(3e-4)</b>',
      '<b class="t-info">● Bash(python train.py)</b>',
      '<b class="t-dim">  ⎿ epoch 14  loss 0.187  acc 0.93</b>',
      '<b class="t-dim">  ⎿ epoch 16  loss 0.168  acc 0.94</b>',
      '<b class="t-dim">  ⎿ epoch 18  loss 0.151  acc 0.95</b>',
      '<b class="t-ok">  ⎿ ✓ best checkpoint saved</b>',
      '<b class="t-ai">●</b> +3pp accuracy from the decay',
      '<b class="t-dim">  change. want me to push the run?</b>',
    ]},
    { title: "agent — ship", lines: [
      '<b class="t-cmd">&gt; deploy the api to prod</b>',
      '<b class="t-ai">●</b> <b class="t-ai">Thinking…</b>',
      '<b class="t-dim">  I\'ll build, smoke-test, then roll</b>',
      '<b class="t-dim">  out one instance before scaling.</b>',
      '<b class="t-info">● Bash(docker build -t app .)</b>',
      '<b class="t-ok">  ⎿ ✓ image built (38s)</b>',
      '<b class="t-info">● Bash(fly deploy)</b>',
      '<b class="t-dim">  ⎿ creating release v42</b>',
      '<b class="t-dim">  ⎿ 1 desired · 1 healthy</b>',
      '<b class="t-info">● Fetch(/healthz)</b>',
      '<b class="t-ok">  ⎿ 200 OK · 1ms</b>',
      '<b class="t-ai">●</b> Live at <b class="t-ai">app.fly.dev</b>',
      '<b class="t-dim">  rollout clean, no errors.</b>',
    ]},
    { title: "agent — research", lines: [
      '<b class="t-cmd">&gt; find and fix every TODO</b>',
      '<b class="t-ai">●</b> <b class="t-ai">Thinking…</b>',
      '<b class="t-dim">  I\'ll map them first, then fix in</b>',
      '<b class="t-dim">  order of blast radius.</b>',
      '<b class="t-info">● Grep("TODO", src/)</b>',
      '<b class="t-dim">  ⎿ 23 matches · 9 files</b>',
      '<b class="t-dim">    auth/ 7 · api/ 9 · workers/ 7</b>',
      '<b class="t-info">● Task(fix-todos × 9)</b>',
      '<b class="t-dim">  ⎿ spawning 9 subagents…</b>',
      '<b class="t-ok">  ⎿ ✓ 9 files staged</b>',
      '<b class="t-ai">●</b> Drafted patches for all 23.',
      '<b class="t-dim">  +212 −96 · waiting on review</b>',
    ]},
    { title: "agent — debug", lines: [
      '<b class="t-cmd">&gt; the feed endpoint is slow</b>',
      '<b class="t-ai">●</b> <b class="t-ai">Thinking…</b>',
      '<b class="t-dim">  240ms p95 smells like an N+1.</b>',
      '<b class="t-dim">  let me trace the query path.</b>',
      '<b class="t-info">● Read(src/api/feed.ts)</b>',
      '<b class="t-info">● Grep("findOne", api/)</b>',
      '<b class="t-dim">  ⎿ called inside .map() — N+1</b>',
      '<b class="t-info">● Edit(src/api/feed.ts)</b>',
      '<b class="t-dim">  ⎿ batched into one query</b>',
      '<b class="t-info">● Bash(autocannon /feed)</b>',
      '<b class="t-ok">  ⎿ p95 240ms → 31ms</b>',
      '<b class="t-ai">●</b> Fixed. 8× faster on the feed.',
    ]},
    { title: "agent — tests", lines: [
      '<b class="t-cmd">&gt; add tests for the date parser</b>',
      '<b class="t-ai">●</b> <b class="t-ai">Thinking…</b>',
      '<b class="t-dim">  edge cases: empty, garbage, DST,</b>',
      '<b class="t-dim">  and out-of-range — cover each.</b>',
      '<b class="t-info">● Write(parser.test.ts)</b>',
      '<b class="t-info">● Bash(npm run test)</b>',
      '<b class="t-ok">  ⎿ ✓ parses ISO dates</b>',
      '<b class="t-ok">  ⎿ ✓ clamps to bounds</b>',
      '<b class="t-ok">  ⎿ ✓ rejects garbage</b>',
      '<b class="t-ok">  ⎿ ✓ coverage 94%</b>',
      '<b class="t-ai">●</b> 5 tests added, all green.',
      '<b class="t-dim">  pushed to ci/auto-tests</b>',
    ]},
    { title: "agent — docs", lines: [
      '<b class="t-cmd">&gt; document the public API</b>',
      '<b class="t-ai">●</b> <b class="t-ai">Thinking…</b>',
      '<b class="t-dim">  I\'ll pull signatures from the</b>',
      '<b class="t-dim">  types and write examples per route.</b>',
      '<b class="t-info">● Glob(src/api/**/*.ts)</b>',
      '<b class="t-dim">  ⎿ 14 route handlers</b>',
      '<b class="t-info">● Read(src/api/types.ts)</b>',
      '<b class="t-info">● Write(docs/api.md)</b>',
      '<b class="t-dim">  ⎿ +318 lines</b>',
      '<b class="t-ok">  ⎿ ✓ examples compile</b>',
      '<b class="t-ai">●</b> Documented all 14 endpoints.',
      '<b class="t-dim">  preview: localhost:3000/docs</b>',
    ]},
    { title: "agent — review", lines: [
      '<b class="t-cmd">&gt; review PR #481</b>',
      '<b class="t-ai">●</b> <b class="t-ai">Thinking…</b>',
      '<b class="t-dim">  scanning error paths and auth</b>',
      '<b class="t-dim">  boundaries before style nits.</b>',
      '<b class="t-info">● Bash(git diff main…HEAD)</b>',
      '<b class="t-dim">  ⎿ +142 −37 · 6 files</b>',
      '<b class="t-warn">  ! missing null check user.ts:31</b>',
      '<b class="t-warn">  ! unhandled reject jobs.ts:54</b>',
      '<b class="t-ok">  ✓ no security issues</b>',
      '<b class="t-ok">  ✓ types sound</b>',
      '<b class="t-ai">●</b> Posted 4 comments.',
      '<b class="t-dim">  approve once nits are addressed.</b>',
    ]},
  ];

  var wall = document.getElementById("wall");
  if (wall) {
    var COUNT = window.innerWidth < 700 ? 4 : 12; // far fewer terminals on mobile
    for (var i = 0; i < COUNT; i++) {
      var tpl = TERMS[i % TERMS.length];
      var term = document.createElement("div");
      term.className = "term";
      // scatter around the edges, keeping the center clear for the headline card
      var side = ["left", "right", "top", "bottom"][i % 4];
      var left, top;
      if (side === "left")       { left = Math.random() * 24 - 8;  top = Math.random() * 96 - 8; }
      else if (side === "right") { left = 60 + Math.random() * 32; top = Math.random() * 96 - 8; }
      else if (side === "top")   { left = Math.random() * 96 - 8;  top = Math.random() * 18 - 10; }
      else                       { left = Math.random() * 96 - 8;  top = 70 + Math.random() * 22; }
      term.style.left = left + "%";
      term.style.top = top + "%";
      term.style.zIndex = String(Math.floor(Math.random() * 5));

      var lines = tpl.lines.join("\n");
      var span = '<span style="animation-duration:' + (16 + Math.random() * 22).toFixed(1) +
        "s;animation-delay:-" + (Math.random() * 10).toFixed(1) + 's">' +
        lines + "\n" + lines + "\n</span>";

      term.innerHTML =
        '<div class="term__bar"><i></i><i></i><i></i><span>' + tpl.title + "</span></div>" +
        '<div class="term__body">' + span + "</div>";
      wall.appendChild(term);
    }
  }

  // ---------- 1b. duplicate the "Why?" cards for a seamless marquee loop ----------
  var whyRow = document.getElementById("why-row");
  if (whyRow) whyRow.innerHTML += whyRow.innerHTML;

  // ---------- 2 + 3. glass square + rotating phrases ----------
  var hero = document.getElementById("hero");
  var square = document.getElementById("square");
  var topEl = document.getElementById("sq-top");
  var botEl = document.getElementById("sq-bottom");
  if (!hero || !square) return;

  var HALF = 100; // half the 200px square

  var phrases = [
    ["don't touch 🚫", "only look 👀"],
    ["agents working 🤖", "hands off ✋"],
    ["back in 5 ⏳", "look, don't touch 👀"],
    ["do not disturb 🔒", "it's still running ▶️"],
  ];
  var idx = 0;
  setInterval(function () {
    idx = (idx + 1) % phrases.length;
    square.classList.add("is-swapping");
    setTimeout(function () {
      topEl.textContent = phrases[idx][0];
      botEl.textContent = phrases[idx][1];
      square.classList.remove("is-swapping");
    }, 300);
  }, 3200);

  // ---------- 4. cursor follow + auto-pilot demo ----------
  // A fake cursor + the square drift between random spots whenever the real
  // mouse isn't over the hero (off-window, or on touch/mobile). As soon as the
  // user moves into the hero, we hand control back to their real cursor.
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var fake = document.createElement("div");
  fake.className = "fake-cursor";
  fake.setAttribute("aria-hidden", "true");
  fake.innerHTML =
    '<svg width="22" height="24" viewBox="0 0 22 24"><path d="M1 1 L1 19 L6 14.5 L9 22 L12 20.8 L9 13.5 L16 13.5 Z" ' +
    'fill="#fff" stroke="#1d1d1f" stroke-width="1.4" stroke-linejoin="round"/></svg>';
  hero.appendChild(fake);

  var targetX = 0, targetY = 0, curX = 0, curY = 0, raf = null;
  var auto = false, pauseTimer = null;

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  function rand(lo, hi) { return lo + Math.random() * (hi - lo); }

  function render() {
    square.style.transform = "translate(" + curX + "px, " + curY + "px)";
    fake.style.transform = "translate(" + curX + "px, " + curY + "px)";
  }

  function tick() {
    var ease = auto ? 0.07 : 0.18; // slower, calmer glide on auto-pilot
    curX += (targetX - curX) * ease;
    curY += (targetY - curY) * ease;
    render();
    if (Math.abs(targetX - curX) > 0.5 || Math.abs(targetY - curY) > 0.5) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = null;
      if (auto) pauseTimer = setTimeout(autoStep, rand(1600, 3400)); // move, pause, move…
    }
  }

  function kick() { if (!raf) raf = requestAnimationFrame(tick); }

  var content = hero.querySelector(".hero__content");

  function autoStep() {
    if (!auto) return;
    var r = hero.getBoundingClientRect();
    // measure the actual headline card (in hero-local coords) and keep the
    // 200px square clear of it, with a margin so it never even touches.
    var SLACK = 70; // let the square drift this far behind the card edges
    var ex = content ? content.getBoundingClientRect() : null;
    var reach = HALF - SLACK; // how far the square edge must clear the card
    var x, y;
    for (var i = 0; i < 24; i++) {
      x = rand(HALF, r.width - HALF);
      y = rand(HALF, r.height - HALF);
      // reject only if the square overlaps the card by MORE than the slack
      if (!ex ||
          x + reach < ex.left - r.left || x - reach > ex.right - r.left ||
          y + reach < ex.top - r.top || y - reach > ex.bottom - r.top) break;
    }
    targetX = x;
    targetY = y;
    kick();
  }

  function enterAuto() {
    auto = true;
    square.classList.add("is-visible");
    var r = hero.getBoundingClientRect();
    if (curX === 0 && curY === 0) { curX = r.width / 2; curY = r.height / 2; render(); }
    if (reduce) { return; } // respect reduced-motion: park the square, no drifting
    fake.classList.add("is-visible");
    autoStep();
  }

  function exitAuto() {
    auto = false;
    if (pauseTimer) { clearTimeout(pauseTimer); pauseTimer = null; }
    fake.classList.remove("is-visible");
  }

  hero.addEventListener("mousemove", function (e) {
    if (auto) exitAuto();
    var r = hero.getBoundingClientRect();
    targetX = clamp(e.clientX - r.left, HALF, r.width - HALF);
    targetY = clamp(e.clientY - r.top, HALF, r.height - HALF);
    square.classList.add("is-visible");
    kick();
  });

  hero.addEventListener("mouseleave", enterAuto);

  enterAuto(); // start in demo mode; the first real mousemove takes over
})();
