// Side-effect entry: import "hmm.css/auto" to wire up data-hmm-* markup on load.
import { init } from "./hmm.js";

if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => init());
  else init();
}
