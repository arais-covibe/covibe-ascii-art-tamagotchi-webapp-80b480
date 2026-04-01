// animations.js — creature data, mood mapping, and animation engine
// Owned by: agent_a (Claude)
// Contract: exports CREATURES, MOOD_MAP, getMoodForEvent, startAnimation, triggerReaction

export const CREATURES = {
  idle: {
    name: "Idle",
    speed: 300,
    frames: [
      `        \n  ____  \n / o o\\ \n \\____/ `,
      `        \n  ____  \n / o o\\ \n \\____/ `,
      `        \n  ____  \n / o o\\ \n \\____/ `,
      `        \n  ____  \n / - -\\ \n \\____/ `,
      `        \n  ____  \n / o o\\ \n \\____/ `,
      `        \n  ____  \n / o .\\ \n \\____/ `,
      `        \n  ____  \n / . o\\ \n \\____/ `,
    ]
  },
  happy: {
    name: "Happy",
    speed: 500,
    frames: [
      `        \n  ____  \n / ^ ^\\ \n \\_U__/ `,
      `        \n  ____  \n / ^ ^\\ \n \\_D__/ `
    ]
  },
  excited: {
    name: "Hyper",
    speed: 150,
    frames: [
      `  ____  \n / O O\\ \n \\____/ \n        `,
      `        \n  ____  \n / O O\\ \n \\____/ `
    ]
  },
  success: {
    name: "Success",
    speed: 200,
    frames: [
      `        \n  ____  \n / ^ ^\\ \n \\_D__/ `,
      `   .    \n  ____  \n / ^ ^\\ \n \\_D__/ `,
      `  \\|/   \n  ____  \n / ^ ^\\ \n \\_D__/ `,
      ` --*--  \n  ____  \n / ^ ^\\ \n \\_D__/ `,
      `  /|\\   \n  ____  \n / ^ ^\\ \n \\_D__/ `
    ]
  },
  thinking: {
    name: "Thinking",
    speed: 500,
    frames: [
      `        \n  ____  \n / ^ ^\\ \n \\____/ `,
      `   .    \n  ____  \n / ^ ^\\ \n \\____/ `,
      `   ..   \n  ____  \n / ^ ^\\ \n \\____/ `,
      `   ...  \n  ____  \n / ^ ^\\ \n \\____/ `
    ]
  },
  sleepy: {
    name: "Sleepy",
    speed: 1000,
    frames: [
      `   z    \n  ____  \n / - -\\ \n \\____/ `,
      `    Z   \n  ____  \n / - -\\ \n \\____/ `,
      `     Z  \n  ____  \n / - -\\ \n \\____/ `,
      `        \n  ____  \n / - -\\ \n \\____/ `
    ]
  },
  sad: {
    name: "Sad",
    speed: 800,
    frames: [
      `        \n  ____  \n / T T\\ \n \\_n__/ `,
      `        \n  ____  \n / T T\\ \n \\_~__/ `,
      `  .     \n  ____  \n / T T\\ \n \\_n__/ `,
      `    .   \n  ____  \n / T T\\ \n \\_~__/ `
    ]
  },
  angry: {
    name: "Angry",
    speed: 150,
    frames: [
      `   /|   \n  ____  \n / > <\\ \n \\_m__/ `,
      `   |\\   \n  ____  \n / > <\\ \n \\_m__/ `
    ]
  },
  error: {
    name: "Error",
    speed: 200,
    frames: [
      `        \n  ____  \n / > <\\ \n \\____/ `,
      `  \\  /  \n  ____  \n / > <\\ \n \\____/ `,
      `   ><   \n  ____  \n / > <\\ \n \\____/ `,
      `  /  \\  \n  ____  \n / > <\\ \n \\____/ `
    ]
  },
  scanning: {
    name: "Scanning",
    speed: 150,
    frames: [
      `        \n  ____  \n / .  \\ \n \\____/ `,
      `        \n  ____  \n /  . \\ \n \\____/ `,
      `        \n  ____  \n /   .\\ \n \\____/ `,
      `        \n  ____  \n /  . \\ \n \\____/ `
    ]
  },
  inlove: {
    name: "In Love",
    speed: 600,
    frames: [
      `   \u2665    \n  ____  \n / \u2665 \u2665\\ \n \\_w__/ `,
      `        \n  ____  \n / \u2665 \u2665\\ \n \\_w__/ `,
      `     \u2665  \n  ____  \n / \u2665 \u2665\\ \n \\_w__/ `,
      `        \n  ____  \n / \u2665 \u2665\\ \n \\_w__/ `
    ]
  },
  surprised: {
    name: "Surprised",
    speed: 400,
    frames: [
      `        \n  ____  \n / O O\\ \n \\_O__/ `,
      `   !    \n  ____  \n / O O\\ \n \\_O__/ `,
      `   !!   \n  ____  \n / O O\\ \n \\_O__/ `,
      `        \n  ____  \n / o o\\ \n \\_o__/ `
    ]
  },
  singing: {
    name: "Singing",
    speed: 600,
    frames: [
      `   \u266a    \n  ____  \n / ^ ^\\ \n \\_O__/ `,
      `        \n  ____  \n / ^ ^\\ \n \\_o__/ `,
      `      \u266b \n  ____  \n / ^ ^\\ \n \\_O__/ `,
      `        \n  ____  \n / ^ ^\\ \n \\_o__/ `
    ]
  },
  typing: {
    name: "Typing",
    speed: 150,
    frames: [
      `        \n  ____  \n / - -\\ \n \\_ww_/ `,
      `        \n  ____  \n / - -\\ \n \\_mm_/ `,
      `        \n  ____  \n / - -\\ \n \\_wm_/ `,
      `        \n  ____  \n / - -\\ \n \\_mw_/ `
    ]
  },
  greeting: {
    name: "Greeting",
    speed: 250,
    frames: [
      `        \n  ____/ \n / ^ ^| \n \\____/ `,
      `        \n  ____\\ \n / ^ ^| \n \\____/ `
    ]
  },
  zen: {
    name: "Zen",
    speed: 1500,
    frames: [
      `   ~    \n  ____  \n / - -\\ \n \\____/ `,
      `        \n  ____  \n / - -\\ \n \\____/ `
    ]
  },
  confused: {
    name: "Confused",
    speed: 700,
    frames: [
      `   ?    \n  ____  \n / o .\\ \n \\____/ `,
      `    ?   \n  ____  \n / . o\\ \n \\____/ `
    ]
  },
  bouncing: {
    name: "Bouncing",
    speed: 300,
    frames: [
      `        \n  ____  \n / o o\\ \n \\____/ `,
      `  ____  \n / o o\\ \n \\____/ \n        `,
      `        \n  ____  \n / o o\\ \n \\____/ `,
      `        \n        \n  ____  \n /_o_o\\ `
    ]
  },
  disagreeing: {
    name: "Disagreeing",
    speed: 200,
    frames: [
      `        \n  ____  \n / o o\\ \n \\____/ `,
      `        \n  ____  \n /o o \\ \n \\____/ `,
      `        \n  ____  \n / o o\\ \n \\____/ `,
      `        \n  ____  \n /  oo\\ \n \\____/ `
    ]
  },
  anxious: {
    name: "Anxious",
    speed: 250,
    frames: [
      `   ,    \n  ____  \n / o o\\ \n \\_~__/ `,
      `    ,   \n  ____  \n / o o\\ \n \\_~__/ `,
      `        \n  ____  \n / o o\\ \n \\_~__/ `,
      `  ,     \n  ____  \n / o o\\ \n \\_~__/ `
    ]
  },
};

// Maps GitHub event types → mood keys
export const MOOD_MAP = {
  PushEvent:              'typing',
  CreateEvent:            'excited',
  DeleteEvent:            'sad',
  PullRequestEvent:       'thinking',
  PullRequestReviewEvent: 'scanning',
  IssuesEvent:            'surprised',
  IssueCommentEvent:      'singing',
  ForkEvent:              'inlove',
  WatchEvent:             'happy',
  ReleaseEvent:           'success',
  CommitCommentEvent:     'agreeing',
  MemberEvent:            'greeting',
  PublicEvent:            'bouncing',
  GollumEvent:            'confused',
  SponsorshipEvent:       'inlove',
  // fallback
  default:                'idle',
};

// Reaction text for each event type
export const REACTIONS = {
  PushEvent:              ["ooh code! lemme see...", "typing detected. respect.", "push it reaaaal good 👀", "new commits! my whole life has meaning again"],
  CreateEvent:            ["A NEW BRANCH/REPO?? i'm hyperventilating", "creation! i felt that", "something new was born today 🌱"],
  DeleteEvent:            ["they deleted something... it hurts", "rip 🕯️", "gone. just like that.", "deleted. i barely knew them"],
  PullRequestEvent:       ["ooh a PR. this is gonna be interesting", "merge drama incoming 🍿", "PR time... thinking cap on", "pull request spotted. assessing..."],
  PullRequestReviewEvent: ["reading the diff rn", "reviewing... eyes narrowing...", "scanning every line with extreme prejudice"],
  IssuesEvent:            ["an issue!! chaos mode activated", "bug or feature? the eternal question", "issues issues issues... send help"],
  IssueCommentEvent:      ["they're talking about it now", "someone had opinions 💬", "thread getting spicy?"],
  ForkEvent:              ["someone forked it!! i love them", "FORK!! a fan! i'm blushing 💕", "they liked it enough to fork it 🥹"],
  WatchEvent:             ["new watcher!! hi!! hi hi hi!!", "they pressed the star ⭐ i'm emotional", "being watched. in a good way."],
  ReleaseEvent:           ["RELEASE DAY!! LETS GOOO 🎉", "they shipped it. tears of joy.", "v-something-dot-something dropped!!"],
  IssueCommentEvent:      ["hot take dropped in the comments", "discourse. delicious."],
  default:                ["something happened... i felt a disturbance", "activity detected 👁️", "hm. interesting.", "noted."],
};

// Activity level → passive mood (when no events)
export function getPassiveMood(minutesSinceLastEvent) {
  if (minutesSinceLastEvent === null) return 'greeting';
  if (minutesSinceLastEvent < 5)   return 'happy';
  if (minutesSinceLastEvent < 30)  return 'idle';
  if (minutesSinceLastEvent < 120) return 'zen';
  if (minutesSinceLastEvent < 480) return 'sleepy';
  return 'sleepy';
}

export function getMoodForEvent(eventType) {
  return MOOD_MAP[eventType] || MOOD_MAP.default;
}

export function getReactionText(eventType) {
  const pool = REACTIONS[eventType] || REACTIONS.default;
  return pool[Math.floor(Math.random() * pool.length)];
}

// Starts an animation loop on the given <pre> element.
// Returns a stop function — call it to cancel the loop.
export function startAnimation(preElement, moodKey) {
  const creature = CREATURES[moodKey] || CREATURES.idle;
  let frame = 0;
  preElement.textContent = creature.frames[0];

  const id = setInterval(() => {
    frame = (frame + 1) % creature.frames.length;
    preElement.textContent = creature.frames[frame];
  }, creature.speed);

  return () => clearInterval(id);
}

// Temporarily override animation for `durationMs`, then revert to `revertMoodKey`.
export function triggerReaction(preElement, moodKey, durationMs, revertMoodKey, onDone) {
  const stop = startAnimation(preElement, moodKey);
  setTimeout(() => {
    stop();
    const revertStop = startAnimation(preElement, revertMoodKey || 'idle');
    if (onDone) onDone(revertStop);
  }, durationMs);
}
