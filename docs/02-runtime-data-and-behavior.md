# Runtime, Data, and Behavior

## Runtime Model
The app updates only while open in the browser.
Background tab behavior is acceptable as long as browser throttling does not fully break the experience.
No requirement exists for closed-tab progression in MVP.

## Data Sources
### Primary
- connected GitHub account activity
- selected watched repositories

### Secondary
- public repository events where available
- local user commands/settings
- optional AI reaction service

## Watch Scope
The user can configure one or more of the following:
- own connected account
- additional connected accounts if supported later
- manually added watched repositories
- optional curated watch list

## Core Observation Loop
1. App starts
2. Local save is loaded
3. GitHub connection/session is restored if possible
4. Watched sources are resolved
5. Polling loop begins
6. New relevant activity is fetched
7. Activity is normalized into internal event objects
8. Creature mood is recalculated
9. Creature chooses animation state
10. Creature produces reaction text
11. UI updates
12. Event history is stored locally

## Normalized Internal Event Shape
Each incoming item should be converted into a minimal internal shape:

- id
- sourceType (`account` | `repo`)
- sourceName
- eventType
- timestamp
- actorName
- repoName
- branchName (optional)
- commitSha (optional)
- commitMessage (optional)
- summaryText
- url (optional)
- importanceScore
- noveltyScore
- tags

## Supported MVP Event Types
Prefer a narrow set first:
- new commit detected
- multiple commits in a short window
- push event
- repository activity spike
- watched repository updated
- no meaningful activity for a long time

## Mood Model
The creature does not need hard pet stats in MVP.
Instead, use derived soft state from observed activity.

### Suggested Derived States
- excited
- proud
- curious
- sleepy
- lonely
- overwhelmed
- confused
- impressed
- chaotic

## Mood Inputs
Mood is derived from:
- recent activity frequency
- commit streaks / bursts
- long inactivity
- watched repo novelty
- message tone heuristics
- user command prompts
- optional AI interpretation

## Reaction Generation Model
### MVP Priority
Use a hybrid model:
1. deterministic event classification
2. templated reaction generation as guaranteed fallback
3. optional AI rewrite/enhancement layer

### Why
This prevents total feature failure if AI is unavailable or expensive.

## Commit-Reaction Rules
Each meaningful commit-related event should produce:
- one mood state
- one animation state
- one text reaction

### Example rule ideas
- many commits quickly -> excited / chaotic
- long inactivity -> sleepy / lonely
- first activity after silence -> happy / relieved
- unusually large burst -> overwhelmed / impressed
- commit message with strong feature keywords -> curious / proud

## AI Layer Role
The AI layer is responsible for:
- rewriting bland template output into more characterful text
- lightly interpreting commit messages
- avoiding repetition
- keeping tone aligned with creature personality

The AI layer is not responsible for:
- determining ground truth about code quality
- acting as an autonomous coding agent
- deep repository code review in MVP

## Command Input
MVP may support one lightweight command field.
This is not a core action system.
Possible uses:
- "what happened?"
- "summarize today"
- "how do you feel?"
- "why are you excited?"
- "watch this repo"

## Persistence Model
Persist locally:
- user settings
- theme/room selections
- watched sources
- event history cache
- recent moods
- creature identity/profile
- import/export metadata

## Save Import/Export
A user can:
- export the current local state to file
- import a previously exported file
- continue in another browser manually

## Theming / Environment Progression
The creature itself already exists.
Progression/customization should focus on environment only.

### Environment Elements
- room style
- background theme
- accent colors
- decorative props or panels
- mood-driven ambient changes

### Unlock Direction
Room and theme changes may be unlocked by:
- time spent with app
- milestones in watched activity
- streak-like usage
- special observed repo events

This system should remain lightweight in MVP.