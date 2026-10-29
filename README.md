# BOOmp, set, spike! 🏐👻

A mobile-first Halloween grass volleyball site for **Sunday, November 1, 2026 at 1 pm**, at **Golden Gate Park Big Rec**. Built with Astro, React, and TypeScript, with local artwork and a fixed bottom tab bar.

Copied from the Bumpkin project into this independent local project. The original project's Git history, remote, build output, and preview screenshots are not included.

## Develop

Requires Node.js 22.23.4+ (Node 24 recommended).

```sh
npm ci
npm run dev
```

Open the localhost URL printed by Astro. Routes:

- `/` — event details, three teams of eight, 4v4 format, and packing list
- `/schedule/` — confirmed start time and pending four-player match assignments
- `/standings/` — team standings and expandable eight-player rosters

```sh
npm test       # Standings, filtering, and fixture consistency
npm run build # Astro/TypeScript checks and static build
npm run preview
```

The static output is written to `dist/`. This project has not been deployed.

## Update the event

`src/data/tournament.ts` holds the event details, teams, and matches. The home page and page metadata read from those event details; the home page lineup shares the same team data as the schedule and standings. Update `public/manifest.webmanifest` if the app name changes.

The confirmed roster contains 24 players on three teams of eight. Each team will split into two groups of four for 4v4 games across three courts at a time. The four-player groups, matchups, and match times have not been assigned, so `matches` is empty and the schedule shows a planning state. The old seven-team fixtures and bracket have been removed. Rules and prizes are still labeled as placeholders.

Standings show the three actual teams with no results yet. The existing calculation supports results attributed to a parent team across multiple games; ranking rules remain to be confirmed. No database or live score editing is configured.

## Phone home screen

The shared layout links `public/manifest.webmanifest` on all three pages. It uses the BOOmp name, standalone display mode, and local app icons. Once hosted over HTTPS, use Safari's **Share → Add to Home Screen** on iPhone or Chrome's **Add to Home screen / Install app** on Android. Offline page caching is not configured.

## Design and assets

The project retains Bumpkin's warm Halloween palette, system fonts, pumpkin-and-ghost artwork, and responsive layout. UI icons live in `src/components/Icon.tsx`; the favicon and home screen icons live in `public/`. Original artwork prompts remain in `docs/` as asset provenance.

## Future data integration

`getTournamentData()` is the data boundary for a future backend. Keep the `Team`, `Match`, and `TournamentData` contracts in sync when adding match assignments. A future score-entry screen will need authenticated, authorized writes; the current project contains no backend credentials or login flow.
