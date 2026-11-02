# hmm.css

Thinking states for AI interfaces. Shimmer text, typing carets, orbs, scramble text and rolling status words, ready to copy and paste.

Docs and live playground: https://arjunkshah12345-hash.github.io/hmm.css/

Pure CSS, ~3 kB of CSS gzipped, zero dependencies. Colour comes from `currentColor`, and reduced-motion users get a gentle fade instead of movement.

## Install

```sh
npm i hmm.css
```

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/arjunkshah12345-hash/hmm.css@main/src/hmm.css">
```

## Use

```html
<span class="hmm-shimmer">Thinking</span>
<span class="hmm-ellipsis">Thinking</span>
<span class="hmm-dots"><i></i><i></i><i></i></span>
<p>Streaming answer<span class="hmm-caret"></span></p>
<div class="hmm-trace"><div class="card">Working on it…</div></div>
```

Per-letter and text-swapping effects need the JS helper:

```js
import "hmm.css";
import "hmm.css/auto"; // wires up data-hmm-* attributes on load
```

```html
<span class="hmm-wave" data-hmm-split>Reasoning</span>
<span data-hmm-cycle="Thinking|Searching|Writing"></span>
<span data-hmm-cycle="Thinking|Calling tools" data-hmm-effect="scramble"></span>
```

Or drive them yourself:

```js
import { split, scramble, cycle } from "hmm.css/js";

const stop = cycle(el, ["Thinking", "Searching", "Reading"]);
stop();
await scramble(el, "Thought for 4s");
```

The JS helpers keep a screen-reader copy of the real text and hide the animated layer from assistive tech.

## Indicators

| Text | Shapes | Surfaces |
| --- | --- | --- |
| `hmm-shimmer` | `hmm-dots` | `hmm-trace` |
| `hmm-ellipsis` | `hmm-bars` | `hmm-lines` |
| `hmm-wave` (js) | `hmm-matrix` | |
| `hmm-glimmer` (js) | `hmm-ping` | |
| `hmm-rise` (js) | `hmm-orbit` | |
| `hmm-roll` (js) | `hmm-orb` | |
| scramble (js) | `hmm-aura` | |
| `hmm-caret` (`--bar`, `--dot`) | `hmm-sparkle`, `hmm-blob` | |

## Customise

| Property | Does |
| --- | --- |
| `--hmm-duration` | Length of one cycle |
| `--hmm-size` | Size of shape indicators |
| `--hmm-highlight` | Shimmer sweep colour |
| `--hmm-a` … `--hmm-d` | Palette for aura, sparkle, blob and trace |
| `--hmm-radius`, `--hmm-width` | Corner radius and stroke width of `hmm-trace` |

## License

MIT
