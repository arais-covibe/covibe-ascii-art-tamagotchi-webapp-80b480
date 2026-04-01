const STORAGE_KEY = "ascii-companion-state";
const MAX_FEED_ITEMS = 12;
const POLL_INTERVAL_MS = 60_000;

const DEFAULT_WATCHES = [
  { id: "local-demo", type: "demo", label: "Local demo stream", enabled: true },
];

const DEFAULT_STATE = {
  creatureName: "Byte",
  mood: "idle",
  animation: "idle",
  reaction: "Boot complete. I am watching for signs of developer life.",
  theme: "terminal",
  lastTickAt: null,
  lastPolledAt: null,
  activeSourceId: "local-demo",
  watches: DEFAULT_WATCHES,
  activityFeed: [],
  reactionHistory: [],
  stats: {
    excitement: 42,
    social: 55,
    focus: 68,
  },
};

function safeNow() {
  return new Date().toISOString();
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function readStorage() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStorage(raw) {
  try {
    window.localStorage.setItem(STORAGE_KEY, raw);
  } catch {
    return false;
  }

  return true;
}

function mergeState(candidate = {}) {
  return {
    ...DEFAULT_STATE,
    ...candidate,
    watches: Array.isArray(candidate.watches) && candidate.watches.length
      ? candidate.watches
      : DEFAULT_WATCHES,
    activityFeed: Array.isArray(candidate.activityFeed) ? candidate.activityFeed : [],
    reactionHistory: Array.isArray(candidate.reactionHistory) ? candidate.reactionHistory : [],
    stats: {
      ...DEFAULT_STATE.stats,
      ...(candidate.stats || {}),
    },
  };
}

export function loadState() {
  const raw = readStorage();
  if (!raw) {
    return createInitialState();
  }

  try {
    return mergeState(JSON.parse(raw));
  } catch {
    return createInitialState();
  }
}

export function saveState(state) {
  return writeStorage(JSON.stringify(state));
}

export function createInitialState(overrides = {}) {
  return mergeState({
    ...DEFAULT_STATE,
    ...overrides,
    lastTickAt: safeNow(),
    lastPolledAt: safeNow(),
  });
}

export function createDemoEvent(seed = Date.now()) {
  const templates = [
    {
      eventType: "push",
      summaryText: "A fresh push just landed.",
      tags: ["ship", "momentum"],
      importanceScore: 0.64,
      noveltyScore: 0.48,
    },
    {
      eventType: "burst",
      summaryText: "Multiple changes arrived in quick succession.",
      tags: ["burst", "chaos"],
      importanceScore: 0.82,
      noveltyScore: 0.72,
    },
    {
      eventType: "quiet",
      summaryText: "The code cave has been quiet for a while.",
      tags: ["silence", "waiting"],
      importanceScore: 0.34,
      noveltyScore: 0.23,
    },
    {
      eventType: "watch",
      summaryText: "A watched repo twitched with new activity.",
      tags: ["watch", "signal"],
      importanceScore: 0.58,
      noveltyScore: 0.61,
    },
  ];

  const template = templates[seed % templates.length];

  return {
    id: `evt-${seed}`,
    sourceType: "demo",
    sourceName: "Local demo stream",
    eventType: template.eventType,
    timestamp: safeNow(),
    actorName: "demo-bot",
    repoName: "mock/ascii-buddy",
    branchName: "main",
    commitSha: null,
    commitMessage: null,
    summaryText: template.summaryText,
    url: null,
    importanceScore: template.importanceScore,
    noveltyScore: template.noveltyScore,
    tags: template.tags,
  };
}

function deriveMoodFromEvent(event, previousState) {
  if (event.eventType === "burst") {
    return {
      mood: "chaotic",
      animation: "hyper",
      stats: {
        excitement: clamp(previousState.stats.excitement + 18, 0, 100),
        social: clamp(previousState.stats.social + 8, 0, 100),
        focus: clamp(previousState.stats.focus - 12, 0, 100),
      },
    };
  }

  if (event.eventType === "quiet") {
    return {
      mood: "sleepy",
      animation: "sleepy",
      stats: {
        excitement: clamp(previousState.stats.excitement - 10, 0, 100),
        social: clamp(previousState.stats.social - 6, 0, 100),
        focus: clamp(previousState.stats.focus + 4, 0, 100),
      },
    };
  }

  if (event.eventType === "watch") {
    return {
      mood: "curious",
      animation: "thinking",
      stats: {
        excitement: clamp(previousState.stats.excitement + 6, 0, 100),
        social: clamp(previousState.stats.social + 2, 0, 100),
        focus: clamp(previousState.stats.focus + 8, 0, 100),
      },
    };
  }

  return {
    mood: "proud",
    animation: "success",
    stats: {
      excitement: clamp(previousState.stats.excitement + 10, 0, 100),
      social: clamp(previousState.stats.social + 4, 0, 100),
      focus: clamp(previousState.stats.focus + 2, 0, 100),
    },
  };
}

function buildReaction(event, derivedMood, state) {
  const prefixByMood = {
    proud: "I noticed progress.",
    chaotic: "Things escalated quickly.",
    sleepy: "I am idling with one eye open.",
    curious: "Something interesting moved at the edge of the terminal.",
    idle: "I am still listening.",
  };

  const prefix = prefixByMood[derivedMood.mood] || prefixByMood.idle;

  return `${prefix} ${event.summaryText} Current watch: ${state.activeSourceId || "none"}.`;
}

export function applyIncomingEvent(state, event) {
  const derivedMood = deriveMoodFromEvent(event, state);
  const nextReaction = buildReaction(event, derivedMood, state);
  const reactionEntry = {
    id: `reaction-${event.id}`,
    timestamp: event.timestamp,
    mood: derivedMood.mood,
    text: nextReaction,
  };

  return {
    ...state,
    mood: derivedMood.mood,
    animation: derivedMood.animation,
    reaction: nextReaction,
    lastTickAt: safeNow(),
    activityFeed: [event, ...state.activityFeed].slice(0, MAX_FEED_ITEMS),
    reactionHistory: [reactionEntry, ...state.reactionHistory].slice(0, MAX_FEED_ITEMS),
    stats: derivedMood.stats,
  };
}

export function tickPassiveState(state, now = new Date()) {
  const previousTick = state.lastTickAt ? new Date(state.lastTickAt) : now;
  const elapsedMs = Math.max(0, now.getTime() - previousTick.getTime());
  const elapsedMinutes = elapsedMs / 60_000;

  if (elapsedMinutes < 1) {
    return state;
  }

  const socialDrop = elapsedMinutes * 0.12;
  const excitementDrop = elapsedMinutes * 0.08;
  const focusGain = elapsedMinutes * 0.03;

  let mood = state.mood;
  let animation = state.animation;
  let reaction = state.reaction;

  const stats = {
    excitement: clamp(state.stats.excitement - excitementDrop, 0, 100),
    social: clamp(state.stats.social - socialDrop, 0, 100),
    focus: clamp(state.stats.focus + focusGain, 0, 100),
  };

  if (stats.social < 25) {
    mood = "lonely";
    animation = "sad";
    reaction = "The feed has gone quiet. I would like another signal soon.";
  } else if (stats.excitement < 28) {
    mood = "idle";
    animation = "idle";
    reaction = "No notable events yet. Monitoring continues.";
  }

  return {
    ...state,
    mood,
    animation,
    reaction,
    stats,
    lastTickAt: now.toISOString(),
  };
}

export function shouldPoll(state, now = new Date()) {
  if (!state.lastPolledAt) {
    return true;
  }

  const elapsedMs = now.getTime() - new Date(state.lastPolledAt).getTime();
  return elapsedMs >= POLL_INTERVAL_MS;
}

export function markPolled(state, now = new Date()) {
  return {
    ...state,
    lastPolledAt: now.toISOString(),
  };
}

export function addWatch(state, label) {
  const trimmed = label.trim();
  if (!trimmed) {
    return state;
  }

  const normalizedId = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  if (state.watches.some((watch) => watch.id === normalizedId)) {
    return state;
  }

  const watch = {
    id: normalizedId,
    type: "repo",
    label: trimmed,
    enabled: true,
  };

  return {
    ...state,
    activeSourceId: watch.id,
    watches: [...state.watches, watch],
  };
}

export function removeWatch(state, id) {
  const watches = state.watches.filter((watch) => watch.id !== id);
  const nextActiveSourceId = state.activeSourceId === id
    ? (watches[0]?.id || null)
    : state.activeSourceId;

  return {
    ...state,
    watches,
    activeSourceId: nextActiveSourceId,
  };
}

export function setActiveWatch(state, id) {
  if (!state.watches.some((watch) => watch.id === id)) {
    return state;
  }

  return {
    ...state,
    activeSourceId: id,
  };
}

export function exportState(state) {
  return JSON.stringify(state, null, 2);
}

export function importState(raw) {
  const parsed = JSON.parse(raw);
  return mergeState(parsed);
}
