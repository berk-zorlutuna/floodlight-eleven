# Floodlight Eleven — System Requirements

| | |
| --- | --- |
| Document | SYS — System Requirements Specification |
| Product | Floodlight Eleven, a 3D 11-a-side football game for the web browser |
| Version | 1.0 |
| Related | [Software Requirements](SOFTWARE_REQUIREMENTS.md) · [Verification Cases](VERIFICATION_CASES.md) · [Verification Results](VERIFICATION_RESULTS.md) |

## 1. Purpose and scope

This document states what the Floodlight Eleven game must do, as seen by a player. It is the top level of the requirement tree. Each system requirement is refined into software requirements (SWR) in the Software Requirements Specification. Those are verified by the cases in the Verification Cases document.

The system is a single-player football game. One person controls one team against a computer-controlled team, or watches two computer teams play. The match follows a simplified version of the Laws of the Game.

## 2. Operating context

- **Users:** one person at a time, on a desktop or laptop with a keyboard, or on a phone or tablet with a touch screen.
- **Platform:** a current web browser with WebGL (Chrome, Edge, Firefox or Safari).
- **Distribution:** one HTML file, opened directly or served by any static web server.
- **External dependency:** the three.js 3D library (r128) and web fonts, loaded from public CDNs.

## 3. Conventions

- "Shall" marks a requirement. Each requirement has a unique ID of the form `SYS-nn`.
- Verification method, assigned at software level: **T** test, **A** analysis, **I** inspection, **D** demonstration.

## 4. System requirements

### 4.1 Platform and distribution

**SYS-01 — Browser platform.** The game shall run in a current desktop or mobile web browser that supports WebGL, with no installation, plug-in or build step.

**SYS-02 — Single-file distribution.** The game shall be delivered as one HTML file. Its only external resources shall be the three.js library and web fonts from public CDNs.

### 4.2 The match

**SYS-03 — Eleven a side.** The game shall simulate an association football match between two teams of eleven players, Harbor City and Northvale, on a full-size pitch with standard goals and markings.

**SYS-04 — Participation.** Before kick-off the user shall be able to choose to control Harbor City, control Northvale, or watch both teams played by the computer.

**SYS-05 — Computer players.** All players not controlled by the user shall be controlled by the computer. They shall hold a team shape, attack, defend, pass, shoot, tackle and keep goal.

**SYS-06 — Match length and halves.** The user shall be able to choose a short, medium or long match. Whichever is chosen shall be presented as 90 match minutes in two halves, with half time, a change of ends and full time.

**SYS-07 — Difficulty.** The user shall be able to choose an easy, normal or hard computer opponent.

### 4.3 Laws of the game

**SYS-08 — Restarts.** The game shall apply kick-offs, goals, throw-ins, goal kicks and corner kicks.

**SYS-09 — Offside.** The game shall apply the offside law.

**SYS-10 — Fouls and set pieces.** The game shall detect fouls from tackles and award free kicks, or penalty kicks for fouls in the penalty area.

**SYS-11 — Disciplinary action.** The game shall caution players with yellow cards and send them off with red cards, including for a second caution. A team shall play on with fewer players after a sending-off.

### 4.4 Player control and playability

**SYS-12 — Input.** The user shall control the game with a keyboard on desktop computers, and with on-screen touch controls on touch-screen devices.

**SYS-13 — Ball skills.** The user shall be able to move, sprint, pass along the ground, play lofted passes, shoot with variable power, switch player, and win the ball with standing and sliding tackles.

**SYS-14 — Playability.** Passes to the user's team shall be reliably receivable. Goalkeepers shall save a realistic share of shots, so that the score stays plausible for football.

### 4.5 Presentation

**SYS-15 — 3D presentation.** The match shall be shown in 3D in a floodlit stadium, with a choice of camera views.

**SYS-16 — Match information.** The game shall show the score, match clock and half. It shall also show a mini-map on desktop, and on-screen announcements of goals, restarts, fouls, offsides and cards.

**SYS-17 — Sound.** The game shall play a referee's whistle, ball-kick sounds and crowd noise, and the user shall be able to mute them.

**SYS-18 — Menus.** The game shall provide a start menu, a pause menu (resume or quit), and a full-time screen showing the result, with options to play again or change settings.

**SYS-19 — Screen sizes.** The game shall be usable on phone screens in landscape and portrait as well as on desktop screens, without horizontal scrolling.

### 4.6 Quality

**SYS-20 — Robustness.** The game shall run complete matches without script errors.

**SYS-21 — Performance.** The game shall play smoothly on typical current hardware, targeting 60 frames per second.

## 5. Traceability to software requirements

| SYS | Refined by SWR |
| --- | --- |
| SYS-01 | SWR-001 |
| SYS-02 | SWR-001 |
| SYS-03 | SWR-010, SWR-011, SWR-050 |
| SYS-04 | SWR-002, SWR-012 |
| SYS-05 | SWR-032, SWR-060, SWR-082 |
| SYS-06 | SWR-002, SWR-020, SWR-021, SWR-022 |
| SYS-07 | SWR-002 |
| SYS-08 | SWR-023, SWR-024, SWR-025, SWR-026 |
| SYS-09 | SWR-030, SWR-031, SWR-032 |
| SYS-10 | SWR-040, SWR-041, SWR-042 |
| SYS-11 | SWR-043, SWR-044, SWR-045 |
| SYS-12 | SWR-090, SWR-091 |
| SYS-13 | SWR-070, SWR-080, SWR-081, SWR-090 |
| SYS-14 | SWR-061, SWR-071, SWR-072, SWR-073 |
| SYS-15 | SWR-090 |
| SYS-16 | SWR-045, SWR-092 |
| SYS-17 | SWR-094 |
| SYS-18 | SWR-002, SWR-022, SWR-093 |
| SYS-19 | SWR-095 |
| SYS-20 | SWR-003 |
| SYS-21 | SWR-100, SWR-101 |
