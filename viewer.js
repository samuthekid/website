// Lightweight image viewer: tap a gallery image to open it fullscreen,
// then zoom (wheel / pinch / double-tap) and pan (drag). No dependencies.
(function () {
  "use strict";

  var MIN_SCALE = 1;
  var MAX_SCALE = 6;

  // ---- Build the overlay once ----
  var overlay = document.createElement("div");
  overlay.className = "viewer";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML =
    '<button class="viewer__close" type="button" aria-label="Close">&times;</button>' +
    '<div class="viewer__stage"><img class="viewer__img" alt="" draggable="false" /></div>' +
    '<p class="viewer__hint">Scroll or pinch to zoom · drag to pan · double-tap to reset</p>';
  document.body.appendChild(overlay);

  var stage = overlay.querySelector(".viewer__stage");
  var img = overlay.querySelector(".viewer__img");
  var closeBtn = overlay.querySelector(".viewer__close");

  // ---- Transform state ----
  var scale = 1;
  var tx = 0; // translation in px (applied before scale)
  var ty = 0;

  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }

  function apply() {
    img.style.transform = "translate(" + tx + "px," + ty + "px) scale(" + scale + ")";
    overlay.classList.toggle("is-zoomed", scale > 1.001);
  }

  function reset() {
    scale = 1; tx = 0; ty = 0;
    apply();
  }

  // Keep panning within sensible bounds so the image can't be flung away.
  function constrain() {
    var rect = stage.getBoundingClientRect();
    var maxX = (rect.width * (scale - 1)) / 2;
    var maxY = (rect.height * (scale - 1)) / 2;
    tx = clamp(tx, -maxX, maxX);
    ty = clamp(ty, -maxY, maxY);
  }

  // Zoom toward a point (cx, cy) given in stage-local coordinates.
  function zoomAt(cx, cy, nextScale) {
    nextScale = clamp(nextScale, MIN_SCALE, MAX_SCALE);
    var rect = stage.getBoundingClientRect();
    var originX = cx - rect.width / 2;
    var originY = cy - rect.height / 2;
    var ratio = nextScale / scale;
    // Adjust translation so the point under the cursor stays put.
    tx = originX - (originX - tx) * ratio;
    ty = originY - (originY - ty) * ratio;
    scale = nextScale;
    constrain();
    apply();
  }

  // ---- Open / close ----
  function open(fullSrc, altText) {
    img.src = fullSrc;
    img.alt = altText || "";
    reset();
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function close() {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    // Drop the (large) source so it isn't kept in memory.
    img.removeAttribute("src");
  }

  // ---- Wire up gallery thumbnails ----
  var thumbs = document.querySelectorAll(".gallery img");
  thumbs.forEach(function (t) {
    t.classList.add("zoomable");
    t.addEventListener("click", function () {
      open(t.src, t.alt);
    });
  });

  closeBtn.addEventListener("click", close);

  // Click the backdrop (not the image) to close — only when not zoomed in.
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay || (e.target === stage && scale <= 1.001)) close();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) close();
  });

  // ---- Wheel zoom ----
  stage.addEventListener("wheel", function (e) {
    if (!overlay.classList.contains("is-open")) return;
    e.preventDefault();
    var rect = stage.getBoundingClientRect();
    var factor = Math.exp(-e.deltaY * 0.0015);
    zoomAt(e.clientX - rect.left, e.clientY - rect.top, scale * factor);
  }, { passive: false });

  // ---- Double-click / double-tap toggles zoom ----
  function toggleZoom(clientX, clientY) {
    var rect = stage.getBoundingClientRect();
    if (scale > 1.001) {
      reset();
    } else {
      zoomAt(clientX - rect.left, clientY - rect.top, 2.5);
    }
  }
  stage.addEventListener("dblclick", function (e) {
    e.preventDefault();
    toggleZoom(e.clientX, e.clientY);
  });

  // ---- Mouse drag to pan ----
  var dragging = false, lastX = 0, lastY = 0;
  stage.addEventListener("mousedown", function (e) {
    if (scale <= 1.001) return;
    dragging = true; lastX = e.clientX; lastY = e.clientY;
    overlay.classList.add("is-dragging");
    e.preventDefault();
  });
  window.addEventListener("mousemove", function (e) {
    if (!dragging) return;
    tx += e.clientX - lastX; ty += e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    constrain(); apply();
  });
  window.addEventListener("mouseup", function () {
    dragging = false; overlay.classList.remove("is-dragging");
  });

  // ---- Touch: pinch zoom, one-finger pan, double-tap reset ----
  var touchStartDist = 0, touchStartScale = 1, pinchCx = 0, pinchCy = 0;
  var panX = 0, panY = 0;
  var lastTap = 0;

  function dist(t1, t2) {
    var dx = t1.clientX - t2.clientX, dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  stage.addEventListener("touchstart", function (e) {
    if (!overlay.classList.contains("is-open")) return;
    var rect = stage.getBoundingClientRect();
    if (e.touches.length === 2) {
      touchStartDist = dist(e.touches[0], e.touches[1]);
      touchStartScale = scale;
      pinchCx = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
      pinchCy = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;
    } else if (e.touches.length === 1) {
      panX = e.touches[0].clientX; panY = e.touches[0].clientY;
      // Double-tap detection
      var now = Date.now();
      if (now - lastTap < 300) {
        e.preventDefault();
        toggleZoom(e.touches[0].clientX, e.touches[0].clientY);
        lastTap = 0;
      } else {
        lastTap = now;
      }
    }
  }, { passive: false });

  stage.addEventListener("touchmove", function (e) {
    if (!overlay.classList.contains("is-open")) return;
    if (e.touches.length === 2) {
      e.preventDefault();
      var d = dist(e.touches[0], e.touches[1]);
      if (touchStartDist > 0) {
        zoomAt(pinchCx, pinchCy, touchStartScale * (d / touchStartDist));
      }
    } else if (e.touches.length === 1 && scale > 1.001) {
      e.preventDefault();
      tx += e.touches[0].clientX - panX;
      ty += e.touches[0].clientY - panY;
      panX = e.touches[0].clientX; panY = e.touches[0].clientY;
      constrain(); apply();
    }
  }, { passive: false });

  stage.addEventListener("touchend", function (e) {
    if (e.touches.length < 2) touchStartDist = 0;
  });
})();
