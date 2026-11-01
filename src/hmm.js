/*!
 * hmm.css helpers — split, scramble, cycle
 * MIT License
 */

const GLYPHS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/";
const running = new WeakMap();

const reducedMotion = () =>
  typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Give an element a screen-reader copy of its text plus an aria-hidden
 * layer the animations can scribble on. Returns that visual layer.
 */
function stage(el, text) {
  let sr = el.querySelector(":scope > .hmm-sr");
  let visual = el.querySelector(":scope > [aria-hidden]");
  if (!sr) {
    el.textContent = "";
    sr = document.createElement("span");
    sr.className = "hmm-sr";
    visual = document.createElement("span");
    visual.setAttribute("aria-hidden", "true");
    el.append(sr, visual);
  }
  sr.textContent = text;
  return visual;
}

/** Wrap each character in a span with --i set, for .hmm-wave / .hmm-glimmer / .hmm-rise. */
export function split(el, text = el.textContent.trim()) {
  const visual = stage(el, text);
  visual.replaceChildren(
    ...[...text].map((ch, i) => {
      const span = document.createElement("span");
      span.textContent = ch;
      span.style.setProperty("--i", i);
      return span;
    })
  );
  el.style.setProperty("--n", text.length);
  return el;
}

/** Decode from random glyphs into `text`, left to right. Resolves when done. */
export function scramble(el, text, { duration = 700 } = {}) {
  const visual = stage(el, text);
  const token = {};
  running.set(el, token);

  if (reducedMotion()) {
    visual.textContent = text;
    return Promise.resolve();
  }

  const start = performance.now();
  return new Promise((resolve) => {
    const frame = (now) => {
      if (running.get(el) !== token) return resolve();
      const t = Math.min((now - start) / duration, 1);
      const settled = Math.floor(t * text.length);
      let out = text.slice(0, settled);
      for (let i = settled; i < text.length; i++) {
        out += text[i] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      visual.textContent = out;
      if (t < 1) requestAnimationFrame(frame);
      else resolve();
    };
    requestAnimationFrame(frame);
  });
}

function roll(el, text) {
  const visual = stage(el, text);
  const next = document.createElement("span");
  next.textContent = text;

  if (reducedMotion() || !visual.firstElementChild) {
    visual.replaceChildren(next);
    return;
  }
  for (const old of [...visual.children]) {
    // Anything still leaving from a previous swap goes now, so words never stack up.
    if (old.className === "hmm-roll-out") {
      old.remove();
      continue;
    }
    old.className = "hmm-roll-out";
    old.addEventListener("animationend", () => old.remove(), { once: true });
    setTimeout(() => old.remove(), 600);
  }
  next.className = "hmm-roll-in";
  visual.append(next);
}

/**
 * Rotate through status words: "Thinking" → "Searching" → "Reading".
 * effect: "roll" (needs .hmm-roll on the element) or "scramble".
 * Returns a stop() function.
 */
export function cycle(el, words, { interval = 2200, effect = "roll" } = {}) {
  let i = 0;
  const show = (word) => (effect === "scramble" ? scramble(el, word) : roll(el, word));
  if (effect === "roll") el.classList.add("hmm-roll");
  show(words[0]);
  const id = setInterval(() => show(words[(i = (i + 1) % words.length)]), interval);
  return () => clearInterval(id);
}

/**
 * Wire up declarative markup:
 *   <span class="hmm-wave" data-hmm-split>Thinking</span>
 *   <span data-hmm-cycle="Thinking|Searching|Reading"></span>
 *   <span data-hmm-cycle="Thinking|Searching" data-hmm-effect="scramble"></span>
 */
export function init(root = document) {
  root.querySelectorAll("[data-hmm-split]").forEach((el) => split(el));
  root.querySelectorAll("[data-hmm-cycle]").forEach((el) => {
    if (el._hmmStop) el._hmmStop();
    el._hmmStop = cycle(el, el.dataset.hmmCycle.split("|"), {
      effect: el.dataset.hmmEffect || "roll",
      interval: Number(el.dataset.hmmInterval) || undefined,
    });
  });
}
