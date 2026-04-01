# Risks, Constraints, and Open Questions

## Hard Constraints
- standalone browser web app
- local-first persistence
- export/import support
- tab-open runtime model for MVP
- no hardcore tamagotchi simulation required
- creature animations already exist and should drive design
- GitHub connection/watch behavior is core scope

## Product Risks
### 1. GitHub API / event coverage risk
Not all desired repository/account events may be easy or clean to fetch in the browser-only model.

### 2. AI dependency risk
If the product requires AI for every reaction, cost/reliability becomes a core failure point.

### 3. Background tab throttling
Browsers may throttle polling/timers in inactive tabs.

### 4. Ambiguous gameplay expectation
Users may expect a real game, but the product is closer to a reactive companion.

### 5. Undefined failure/progression systems
Failure state and deep progression are intentionally unresolved.

## Recommended MVP Risk Response
- use deterministic event normalization first
- use templates as fallback
- keep AI optional or pluggable
- describe product clearly as companion/buddy
- defer complex pet simulation
- do not promise true realtime guarantees

## Open Questions
### 1. GitHub auth model
Need final decision:
- public repo watching only
- signed-in personal GitHub account
- both

### 2. AI model strategy
Need final decision:
- BYOK
- built-in hosted model
- optional AI with fallback templates
- fully template-only MVP

### 3. Event scope
Need final decision on minimum supported event list for launch.

### 4. Creature personality definition
Need a tighter voice spec:
- more cute?
- more gremlin?
- more sarcastic?
- more wholesome?

### 5. Failure state
Currently unresolved.
Most likely answer for MVP:
- no death
- mood degradation only

### 6. Theme progression
Need final decision whether room/theme unlocks are:
- manual only
- milestone-based
- time-based

### 7. Command input scope
Need final decision whether command input is:
- included in MVP
- postponed until v1.1

## Suggested MVP Decisions
If forced to choose now:
- use GitHub sign-in plus public repo watch list
- use optional AI layer with fallback templates
- support a narrow event set
- no creature death in MVP
- theme progression light and milestone-based
- command input included only if trivial after core loop works