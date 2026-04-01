# Product Spec

## Working Title
ASCII GitHub Companion

## One-Sentence Product Definition
A standalone browser web app that connects to one or more GitHub accounts and/or watched repositories, then displays an animated ASCII creature that reacts emotionally and verbally to new development activity.

## Product Type
Companion web app, not a traditional game.

## Core Fantasy
A cute, funny, weird ASCII creature watches coding activity and behaves like a living dev buddy with opinions, moods, and reactions.

## MVP Goal
Ship a working browser app where a user can:
- connect GitHub
- define one or more watched sources
- keep the app open in a tab
- receive creature reactions to new commit/repository activity
- see mood/animation changes tied to that activity
- export/import local app state

## Non-Goals for MVP
- no full tamagotchi survival simulator
- no traditional pet care loop
- no room builder
- no multiplayer/social feed
- no mobile app
- no browser extension mode
- no cloud sync as a requirement
- no complex progression economy
- no large sandbox gameplay system

## Primary User Story
As a developer, I keep the companion open in a browser tab while coding so the creature can observe my GitHub-related activity and react to it in a fun, readable, emotionally expressive way.

## Secondary User Story
As a user, I can add public repositories to a watch list so the creature also reacts to interesting external open-source activity.

## Core Product Pillars
1. Reactive companion first
2. GitHub activity awareness
3. Strong ASCII personality and animation
4. Lightweight, low-friction usage
5. Local-first save model
6. Cute/funny/weird tone

## Primary Inputs
- connected GitHub user/account data
- watched repository list
- GitHub activity/events/commits
- optional AI-generated interpretation layer
- local user settings/themes

## Primary Outputs
- creature text reactions
- creature mood state
- creature animation state
- event history / activity feed
- visual room/theme changes over time

## MVP Feature Set
### Required
- standalone React/TypeScript browser web app
- GitHub connection flow
- watched account and/or repository configuration
- polling/refresh while app is open
- event ingestion for selected activity sources
- mapping event/activity to creature mood
- text reaction per meaningful activity update
- predefined creature animations already supplied by user
- room/theme customization scaffolding
- export/import local state
- local persistence

### Allowed but Optional in MVP
- AI-generated commentary if available
- fallback templated commentary when AI unavailable
- command-style input for user prompts to the creature
- light command controls for filtering, asking, or nudging behavior

## Product Success Criteria
The app is successful if:
- GitHub activity appears reliably while the tab is open
- the creature feels alive and expressive
- reactions are readable and entertaining
- the creature’s state clearly reflects observed activity
- the app works as a persistent buddy, not as a hardcore game

## Experience Tone
- cute
- funny
- weird
- companion-like
- slightly mischievous, not annoying