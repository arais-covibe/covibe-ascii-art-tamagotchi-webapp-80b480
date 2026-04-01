import {
  addWatch,
  applyIncomingEvent,
  createDemoEvent,
  exportState,
  importState,
  loadState,
  markPolled,
  removeWatch,
  saveState,
  setActiveWatch,
  shouldPoll,
  tickPassiveState,
} from "./game-state.js";

const REFRESH_INTERVAL_MS = 1_000;

let state = loadState();

function ensureFallbackShell() {
  let root = document.getElementById("runtime-root");

  if (root) {
    return root;
  }

  root = document.createElement("section");
  root.id = "runtime-root";
  root.style.maxWidth = "1080px";
  root.style.margin = "2rem auto";
  root.style.padding = "1.25rem";
  root.style.border = "1px solid rgba(148, 163, 184, 0.25)";
  root.style.borderRadius = "20px";
  root.style.background = "rgba(15, 23, 42, 0.9)";
  root.style.color = "#e2e8f0";
  root.style.boxShadow = "0 24px 80px rgba(2, 6, 23, 0.45)";

  root.innerHTML = `
    <div style="display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));">
      <section style="padding:1rem;border-radius:16px;background:rgba(30,41,59,0.7);">
        <div style="display:flex;justify-content:space-between;gap:1rem;align-items:center;">
          <div>
            <p style="margin:0;color:#94a3b8;font-size:0.75rem;letter-spacing:0.18em;text-transform:uppercase;">Runtime</p>
            <h2 id="companion-name" style="margin:0.25rem 0 0;font-size:1.5rem;">ASCII Companion</h2>
          </div>
          <span id="companion-mood" style="padding:0.35rem 0.7rem;border-radius:999px;background:#1d4ed8;color:white;font-size:0.8rem;text-transform:capitalize;"></span>
        </div>
        <p id="reaction-text" style="margin:1rem 0 0;line-height:1.5;color:#cbd5e1;"></p>
        <dl style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.75rem;margin:1rem 0 0;">
          <div><dt style="font-size:0.75rem;color:#94a3b8;">Excitement</dt><dd id="stat-excitement" style="margin:0.35rem 0 0;font-size:1.15rem;"></dd></div>
          <div><dt style="font-size:0.75rem;color:#94a3b8;">Social</dt><dd id="stat-social" style="margin:0.35rem 0 0;font-size:1.15rem;"></dd></div>
          <div><dt style="font-size:0.75rem;color:#94a3b8;">Focus</dt><dd id="stat-focus" style="margin:0.35rem 0 0;font-size:1.15rem;"></dd></div>
        </dl>
      </section>
      <section style="padding:1rem;border-radius:16px;background:rgba(30,41,59,0.7);">
        <div style="display:flex;justify-content:space-between;gap:1rem;align-items:center;">
          <h3 style="margin:0;font-size:1rem;">Watch List</h3>
          <button id="simulate-event" style="border:0;border-radius:999px;padding:0.55rem 0.9rem;background:#10b981;color:#052e16;cursor:pointer;font-weight:600;">Simulate Event</button>
        </div>
        <form id="watch-form" style="display:flex;gap:0.5rem;margin-top:1rem;">
          <input id="watch-input" type="text" placeholder="owner/repo or label" style="flex:1;padding:0.7rem 0.9rem;border-radius:12px;border:1px solid rgba(148,163,184,0.25);background:#020617;color:#e2e8f0;">
          <button type="submit" style="border:0;border-radius:12px;padding:0.7rem 1rem;background:#38bdf8;color:#082f49;font-weight:700;cursor:pointer;">Add</button>
        </form>
        <ul id="watch-list" style="list-style:none;margin:1rem 0 0;padding:0;display:grid;gap:0.5rem;"></ul>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:1rem;">
          <button id="export-state" style="border:0;border-radius:12px;padding:0.7rem 1rem;background:#f59e0b;color:#451a03;cursor:pointer;font-weight:700;">Export State</button>
          <label style="display:inline-flex;align-items:center;gap:0.5rem;border-radius:12px;padding:0.7rem 1rem;background:#a78bfa;color:#2e1065;cursor:pointer;font-weight:700;">
            <span>Import State</span>
            <input id="import-state" type="file" accept="application/json" style="display:none;">
          </label>
        </div>
      </section>
    </div>
    <section style="margin-top:1rem;padding:1rem;border-radius:16px;background:rgba(30,41,59,0.7);">
      <h3 style="margin:0 0 0.75rem;">Activity Feed</h3>
      <ul id="activity-feed" style="list-style:none;margin:0;padding:0;display:grid;gap:0.75rem;"></ul>
    </section>
  `;

  document.body.appendChild(root);
  return root;
}

function getElements() {
  ensureFallbackShell();

  return {
    name: document.getElementById("companion-name"),
    mood: document.getElementById("companion-mood"),
    reaction: document.getElementById("reaction-text"),
    excitement: document.getElementById("stat-excitement"),
    social: document.getElementById("stat-social"),
    focus: document.getElementById("stat-focus"),
    watchList: document.getElementById("watch-list"),
    activityFeed: document.getElementById("activity-feed"),
    watchForm: document.getElementById("watch-form"),
    watchInput: document.getElementById("watch-input"),
    simulateEvent: document.getElementById("simulate-event"),
    exportStateButton: document.getElementById("export-state"),
    importStateInput: document.getElementById("import-state"),
  };
}

function renderWatchItem(watch) {
  const activeMarkup = watch.id === state.activeSourceId
    ? `<span style="font-size:0.7rem;color:#86efac;">active</span>`
    : "";

  return `
    <li style="display:flex;justify-content:space-between;gap:0.75rem;align-items:center;padding:0.75rem 0.9rem;border-radius:12px;background:rgba(2,6,23,0.55);">
      <button data-set-active="${watch.id}" style="border:0;background:none;color:#e2e8f0;text-align:left;cursor:pointer;padding:0;">
        <div style="font-weight:700;">${watch.label}</div>
        <div style="font-size:0.75rem;color:#94a3b8;">${watch.type}</div>
      </button>
      <div style="display:flex;align-items:center;gap:0.75rem;">
        ${activeMarkup}
        <button data-remove-watch="${watch.id}" style="border:0;border-radius:999px;padding:0.35rem 0.6rem;background:#7f1d1d;color:#fecaca;cursor:pointer;">remove</button>
      </div>
    </li>
  `;
}

function renderFeedItem(event) {
  const timestamp = new Date(event.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `
    <li style="padding:0.9rem 1rem;border-radius:12px;background:rgba(2,6,23,0.55);">
      <div style="display:flex;justify-content:space-between;gap:0.75rem;align-items:center;">
        <strong style="text-transform:capitalize;">${event.eventType}</strong>
        <span style="font-size:0.75rem;color:#94a3b8;">${timestamp}</span>
      </div>
      <p style="margin:0.45rem 0 0;color:#cbd5e1;">${event.summaryText}</p>
      <p style="margin:0.45rem 0 0;font-size:0.75rem;color:#94a3b8;">${event.sourceName}</p>
    </li>
  `;
}

function render() {
  const elements = getElements();

  elements.name.textContent = state.creatureName;
  elements.mood.textContent = state.mood;
  elements.reaction.textContent = state.reaction;
  elements.excitement.textContent = Math.round(state.stats.excitement);
  elements.social.textContent = Math.round(state.stats.social);
  elements.focus.textContent = Math.round(state.stats.focus);
  elements.watchList.innerHTML = state.watches.map(renderWatchItem).join("");
  elements.activityFeed.innerHTML = state.activityFeed.length
    ? state.activityFeed.map(renderFeedItem).join("")
    : `<li style="padding:0.9rem 1rem;border-radius:12px;background:rgba(2,6,23,0.55);color:#94a3b8;">No events yet. Simulate one or add a watch target.</li>`;
}

function persistAndRender() {
  saveState(state);
  render();
}

function ingestEvent(event) {
  state = applyIncomingEvent(state, event);
  state = markPolled(state);
  persistAndRender();
}

function wireEvents() {
  const elements = getElements();

  elements.watchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    state = addWatch(state, elements.watchInput.value);
    elements.watchInput.value = "";
    persistAndRender();
  });

  elements.watchList.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const removeId = target.getAttribute("data-remove-watch");
    if (removeId) {
      state = removeWatch(state, removeId);
      persistAndRender();
      return;
    }

    const activateButton = target.closest("[data-set-active]");
    if (activateButton instanceof HTMLElement) {
      state = setActiveWatch(state, activateButton.getAttribute("data-set-active"));
      persistAndRender();
    }
  });

  elements.simulateEvent.addEventListener("click", () => {
    ingestEvent(createDemoEvent(Date.now()));
  });

  elements.exportStateButton.addEventListener("click", () => {
    const blob = new Blob([exportState(state)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "ascii-companion-state.json";
    anchor.click();
    URL.revokeObjectURL(url);
  });

  elements.importStateInput.addEventListener("change", async (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || !input.files?.[0]) {
      return;
    }

    const text = await input.files[0].text();
    state = importState(text);
    persistAndRender();
    input.value = "";
  });
}

function backgroundLoop() {
  const now = new Date();
  state = tickPassiveState(state, now);

  if (shouldPoll(state, now)) {
    state = markPolled(state, now);
  }

  persistAndRender();
}

function start() {
  wireEvents();
  persistAndRender();
  window.setInterval(backgroundLoop, REFRESH_INTERVAL_MS);
}

start();
