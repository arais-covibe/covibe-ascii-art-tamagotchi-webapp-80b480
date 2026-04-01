# UI, UX, and Interaction

## UI Principle
The creature is the hero.
The app should feel like a companion dashboard, not a dense developer tool.

## Presentation Style
- modern web UI
- creature rendered in ASCII style
- UI may remain normal, readable, and structured
- optional later ASCII decoration is allowed
- tone is cute, funny, weird

## Main Screen Layout
Recommended MVP layout:
- top bar
- creature stage
- reaction bubble / dialogue area
- recent activity panel
- watch list panel
- command input
- settings/theme/export area

## Primary Screen Sections
### 1. Creature Stage
Displays:
- current ASCII creature
- active animation state
- mood indicator
- environment / room background

### 2. Reaction Area
Displays:
- latest reaction text
- brief interpretation of recent activity
- optional timestamp

### 3. Activity Feed
Displays:
- recent observed events
- repo/account source
- commit message or summary
- event timestamp
- clickable link if available

### 4. Watch Management
Allows:
- adding watched repositories
- removing watched repositories
- enabling/disabling sources
- showing connection status

### 5. Command Input
If included in MVP, command input supports short textual prompts.
This is assistant-like, not a full chat app.

### 6. Theme / Room Settings
Allows:
- switching theme
- changing colors
- changing room/environment variants
- export/import state

## Interaction Model
### Core Interaction
Passive observation first.
The user mainly:
- opens app
- watches creature
- glances at activity
- occasionally asks a question or adds a repo

### Optional User Inputs
- typed command
- refresh/check now
- add/remove watch source
- select theme
- export/import state

No pet-care action buttons are required in MVP.

## Animation Rules
- every mood must map to a valid predefined animation state
- animation changes must be readable, not noisy
- mood transitions should feel intentional
- idle animation must exist for no-event periods

## Text Tone Rules
Creature text must be:
- concise
- characterful
- readable at a glance
- not essay-like
- not code-review heavy
- not excessively repetitive

## Notification Behavior
Avoid aggressive notifications in MVP.
The app should feel ambient, not spammy.

Allowed:
- visible feed update
- subtle stage animation change
- reaction bubble update
- optional soft badge/counter

Avoid:
- loud popups
- invasive browser notifications by default
- constant blinking nonsense

## Accessibility / Usability Notes
- readable text contrast
- clear distinction between creature speech and raw GitHub data
- event list must remain scannable
- long commit messages should truncate gracefully
- no mandatory AI dependency for basic use