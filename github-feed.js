// github-feed.js — polls GitHub public events API, drives pet reactions
// Owned by: agent_a (Claude)
// No state management here — just fetch + call window.petReact / window.petSetMood

import { getPassiveMood } from './animations.js';

const POLL_INTERVAL_MS = 60_000; // GitHub rate limit: 60 req/hr unauthenticated
const STORAGE_KEY = 'tamago_github_feed';

const EVENT_ICONS = {
  PushEvent:              '⌨',
  CreateEvent:            '✦',
  DeleteEvent:            '✗',
  PullRequestEvent:       '⇌',
  PullRequestReviewEvent: '◉',
  IssuesEvent:            '⚠',
  IssueCommentEvent:      '◆',
  ForkEvent:              '⑂',
  WatchEvent:             '★',
  ReleaseEvent:           '⬡',
  CommitCommentEvent:     '◇',
  MemberEvent:            '◈',
  PublicEvent:            '◎',
  GollumEvent:            '✎',
  SponsorshipEvent:       '♥',
};

function icon(type) {
  return EVENT_ICONS[type] || '·';
}

function timeAgo(isoString) {
  const diff = Math.floor((Date.now() - new Date(isoString)) / 1000);
  if (diff < 60)   return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function loadSeen() {
  try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')); }
  catch { return new Set(); }
}

function saveSeen(set) {
  // Keep only last 200 IDs to avoid unbounded growth
  const arr = [...set].slice(-200);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

function appendFeedItem(eventType, repoName, time, isNew) {
  const feed = document.getElementById('activity-feed');
  if (!feed) return;

  // Remove the "no events yet" placeholder
  const placeholder = feed.querySelector('.placeholder');
  if (placeholder) placeholder.remove();

  const li = document.createElement('li');
  li.className = 'feed-item' + (isNew ? ' fresh' : '');
  li.innerHTML = `<span style="color:var(--green)">${icon(eventType)}</span> <span style="color:var(--text)">${repoName}</span> <span style="color:var(--muted);float:right">${time}</span>`;

  // Newest on top, cap at 30 items
  feed.prepend(li);
  while (feed.children.length > 30) feed.lastChild.remove();
}

function updatePollStatus(text) {
  const el = document.getElementById('poll-status');
  if (el) el.textContent = text;
}

function updateStatusDot(online) {
  const dot = document.getElementById('status-dot');
  if (!dot) return;
  dot.className = 'dot ' + (online ? 'on' : 'off');
  const label = document.getElementById('status-label');
  if (label) label.textContent = online ? 'connected' : 'not connected';
}

async function fetchEvents(username, token) {
  const headers = { 'Accept': 'application/vnd.github+json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=30`, { headers });

  if (!res.ok) {
    if (res.status === 404) throw new Error(`user "${username}" not found`);
    if (res.status === 403) throw new Error('rate limit hit — add a token for more requests');
    throw new Error(`GitHub API error ${res.status}`);
  }
  return res.json();
}

let pollTimer = null;
let lastEventAt = null;

export function startPolling(username, token) {
  if (pollTimer) clearInterval(pollTimer);

  const seen = loadSeen();
  let firstPoll = true;

  async function poll() {
    updatePollStatus('polling...');
    try {
      const events = await fetchEvents(username, token);
      updateStatusDot(true);

      let newCount = 0;
      // Events come newest-first; reverse so we process oldest→newest
      const ordered = [...events].reverse();

      for (const ev of ordered) {
        const isNew = !seen.has(ev.id);
        if (isNew) {
          seen.add(ev.id);
          newCount++;
          lastEventAt = new Date(ev.created_at);

          if (!firstPoll && window.petReact) {
            window.petReact(ev.type, null);
          }
        }
        appendFeedItem(ev.type, ev.repo?.name || username, timeAgo(ev.created_at), isNew && !firstPoll);
      }

      saveSeen(seen);

      if (firstPoll) {
        firstPoll = false;
        // Set passive mood based on how long ago last event was
        const newest = events[0];
        if (newest && window.petSetMood) {
          const mins = newest ? (Date.now() - new Date(newest.created_at)) / 60000 : 999;
          window.petSetMood(getPassiveMood(mins));
        }
      }

      const mins = lastEventAt ? Math.floor((Date.now() - lastEventAt) / 60000) : null;
      updatePollStatus(`last polled ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);

    } catch (err) {
      updateStatusDot(false);
      updatePollStatus(`error: ${err.message}`);

      const errEl = document.getElementById('connect-error');
      if (errEl) { errEl.textContent = err.message; errEl.classList.remove('hidden'); }
    }
  }

  poll();
  pollTimer = setInterval(poll, POLL_INTERVAL_MS);
  return () => clearInterval(pollTimer);
}

export function stopPolling() {
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
  updateStatusDot(false);
  updatePollStatus('polling paused');
}
