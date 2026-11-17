# Floodlight Eleven — Software Verification Results

| | |
| --- | --- |
| Document | Software Verification Results |
| Software under test | `floodlight-eleven.html` at commit `2403146` plus uncommitted changes |
| Run | 2026-11-17 13:26 UTC |
| Procedure | [Verification Cases](VERIFICATION_CASES.md), executed by `tests/verify.js` |
| Environment | Headless Chromium 153.0.8010.12, Node v22.23.4, linux 6.18.44-fc-v553; three.js r128 served from the local npm package; web fonts blocked |
| Random seed | 20261117 (`Math.random` is seeded, so a rerun on the same code gives the same results) |
| Duration | 58 s |

## 1. Summary

**49 passed, 0 failed, 1 not run (manual)** out of 50 verification cases.

## 2. Results by case

| Case | Title | Requirements | Method | Result |
| --- | --- | --- | --- | --- |
| [VC-01](#vc-01) | Start-up, delivery and start menu | SWR-001, SWR-002 | T, I | **PASS** |
| [VC-02](#vc-02) | Pitch and goal dimensions | SWR-010 | T | **PASS** |
| [VC-03](#vc-03) | Squads and 4-4-2 formation | SWR-011 | T | **PASS** |
| [VC-04](#vc-04) | Controlled player assignment | SWR-012 | T | **PASS** |
| [VC-05](#vc-05) | Match clock, half time and change of ends | SWR-020, SWR-021 | T | **PASS** |
| [VC-06](#vc-06) | Full time, result screen and replay reset | SWR-022, SWR-045 | T | **PASS** |
| [VC-07](#vc-07) | Kick-off positions | SWR-023 | T | **PASS** |
| [VC-08](#vc-08) | Goal scored, over the bar, restart | SWR-024 | T | **PASS** |
| [VC-09](#vc-09) | Throw-in | SWR-025 | T | **PASS** |
| [VC-10](#vc-10) | Corner kick and goal kick | SWR-026 | T | **PASS** |
| [VC-11](#vc-11) | Offside offence penalised | SWR-030, SWR-031 | T | **PASS** |
| [VC-12](#vc-12) | No offside: onside, own half, throw-in | SWR-030 | T | **PASS** |
| [VC-13](#vc-13) | Standing-tackle fouls by direction | SWR-040 | T | **PASS** |
| [VC-14](#vc-14) | Free kick: award, wall distance, kick taken | SWR-041, SWR-042 | T | **PASS** |
| [VC-15](#vc-15) | Penalty kick: award, spot, positions, kick taken | SWR-041, SWR-042 | T | **PASS** |
| [VC-16](#vc-16) | Yellow and red cards | SWR-043, SWR-045 | T | **PASS** |
| [VC-17](#vc-17) | Sending-off effects, minimum of seven, card display | SWR-044, SWR-045 | T, I | **PASS** |
| [VC-18](#vc-18) | Ball physics: bounce, roll, woodwork | SWR-050 | T | **PASS** |
| [VC-19](#vc-19) | Goalkeeper dives to the crossing point | SWR-060 | T | **PASS** |
| [VC-20](#vc-20) | Receive assist | SWR-071 | T | **PASS** |
| [VC-21](#vc-21) | Pass assist avoids blocked lanes; lofted pass | SWR-070 | T | **PASS** |
| [VC-22](#vc-22) | Kicks are only sometimes blocked at source | SWR-072 | T | **PASS** |
| [VC-23](#vc-23) | Sliding tackle: trigger, motion, outcome | SWR-080, SWR-081 | T | **PASS** |
| [VC-24](#vc-24) | Keyboard controls | SWR-090 | T | **PASS** |
| [VC-25](#vc-25) | Touch controls | SWR-091 | T | **PASS** |
| [VC-26](#vc-26) | Heads-up display | SWR-092 | T | **PASS** |
| [VC-27](#vc-27) | Pause, resume, back to menu | SWR-093 | T | **PASS** |
| [VC-28](#vc-28) | Audio start, whistle and mute | SWR-094 | T, D | **PASS** |
| [VC-29](#vc-29) | Responsive layout | SWR-095 | T | **PASS** |
| [VC-30](#vc-30) | Simulation step cost | SWR-100 | T | **PASS** |
| [VC-31](#vc-31) | Frame rate on GPU hardware | SWR-101, SWR-094 | D | **NOT RUN (manual)** |
| [VC-32](#vc-32) | Simulated computer-vs-computer matches | SWR-032, SWR-061, SWR-073, SWR-082 | A | **PASS** |
| [VC-33](#vc-33) | Scripted-user pass completion | SWR-073 | A | **PASS** |
| [VC-34](#vc-34) | No script errors across the whole run | SWR-003 | T | **PASS** |
| [VC-35](#vc-35) | Founding a club | SWR-110 | T | **PASS** |
| [VC-36](#vc-36) | Season structure, league table and cup | SWR-111, SWR-112, SWR-114 | T | **PASS** |
| [VC-37](#vc-37) | Promotion, relegation and prize money | SWR-113 | T | **PASS** |
| [VC-38](#vc-38) | Playing a career fixture in 3D | SWR-115, SWR-130, SWR-131 | T | **PASS** |
| [VC-39](#vc-39) | Match earnings | SWR-116 | T | **PASS** |
| [VC-40](#vc-40) | Saving, reloading, export, import, delete | SWR-117 | T | **PASS** |
| [VC-41](#vc-41) | Player model and ratings in play | SWR-120, SWR-122 | T | **PASS** |
| [VC-42](#vc-42) | Formation and line-up | SWR-121 | T | **PASS** |
| [VC-43](#vc-43) | Transfer market | SWR-123 | T | **PASS** |
| [VC-44](#vc-44) | Player development, ageing and youth | SWR-124 | T | **PASS** |
| [VC-45](#vc-45) | Stadium expansion | SWR-131 | T | **PASS** |
| [VC-46](#vc-46) | Through balls | SWR-140 | T, A | **PASS** |
| [VC-47](#vc-47) | Skill moves | SWR-141 | T, A | **PASS** |
| [VC-48](#vc-48) | Stamina | SWR-142 | T, A | **PASS** |
| [VC-49](#vc-49) | Substitutions | SWR-143 | T, A | **PASS** |
| [VC-50](#vc-50) | Name tag over the controlled player | SWR-144 | T | **PASS** |

## 3. Requirement coverage

| Requirement | Title | Cases | Status |
| --- | --- | --- | --- |
| SWR-001 | Delivery | VC-01 | PASS |
| SWR-002 | Start menu | VC-01 | PASS |
| SWR-003 | No script errors | VC-34 | PASS |
| SWR-010 | Dimensions | VC-02 | PASS |
| SWR-011 | Squads | VC-03 | PASS |
| SWR-012 | Controlled player | VC-04 | PASS |
| SWR-020 | Match clock | VC-05 | PASS |
| SWR-021 | Half time | VC-05 | PASS |
| SWR-022 | Full time | VC-06 | PASS |
| SWR-023 | Kick-off | VC-07 | PASS |
| SWR-024 | Goal | VC-08 | PASS |
| SWR-025 | Throw-in | VC-09 | PASS |
| SWR-026 | Corner and goal kick | VC-10 | PASS |
| SWR-030 | Offside position | VC-11, VC-12 | PASS |
| SWR-031 | Offside offence | VC-11 | PASS |
| SWR-032 | Computer players and offside | VC-32 | PASS |
| SWR-040 | Standing-tackle fouls | VC-13 | PASS |
| SWR-041 | Free kick or penalty | VC-14, VC-15 | PASS |
| SWR-042 | Taking free kicks and penalties | VC-14, VC-15 | PASS |
| SWR-043 | Cards | VC-16 | PASS |
| SWR-044 | Sending-off | VC-17 | PASS |
| SWR-045 | Announcements | VC-06, VC-16, VC-17 | PASS |
| SWR-050 | Ball physics | VC-18 | PASS |
| SWR-060 | Goalkeeper diving | VC-19 | PASS |
| SWR-061 | Shot conversion | VC-32 | PASS |
| SWR-070 | Pass assist | VC-21 | PASS |
| SWR-071 | Receive assist | VC-20 | PASS |
| SWR-072 | Blocks at source | VC-22 | PASS |
| SWR-073 | Pass completion | VC-32, VC-33 | PASS |
| SWR-080 | Sliding tackle | VC-23 | PASS |
| SWR-081 | Sliding tackle outcome | VC-23 | PASS |
| SWR-082 | Computer slides | VC-32 | PASS |
| SWR-090 | Keyboard | VC-24 | PASS |
| SWR-091 | Touch controls | VC-25 | PASS |
| SWR-092 | HUD | VC-26 | PASS |
| SWR-093 | Pause and menus | VC-27 | PASS |
| SWR-094 | Audio | VC-28, VC-31 | PASS (automated part); manual part not run |
| SWR-095 | Layout | VC-29 | PASS |
| SWR-100 | Simulation cost | VC-30 | PASS |
| SWR-101 | Frame rate | VC-31 | NOT RUN (manual) |

## 4. Evidence

### VC-01

**Start-up, delivery and start menu** — SWR-001, SWR-002 — PASS

Repository has 1 HTML file (floodlight-eleven.html); one external script (https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js), three.js REVISION 128; stylesheets only from Google Fonts. Menu shown on load. Defaults side=0 (Harbor City), len=300 s, diff=1 (Normal). Options: Harbor City / Northvale / Watch; 3 min / 5 min / 8 min; Easy / Normal / Hard; button "KICK OFF".

### VC-02

**Pitch and goal dimensions** — SWR-010 — PASS

Pitch 105 × 68; goal 7.32 × 2.44; penalty area 16.5 deep × 40.32 wide.

### VC-03

**Squads and 4-4-2 formation** — SWR-011 — PASS

Harbor City: 11 players, GK-DF-MF-FW 1-4-4-2, numbers 1,2,3,4,5,6,7,8,9,10,11; Northvale: 11 players, GK-DF-MF-FW 1-4-4-2, numbers 1,2,3,4,5,6,7,8,9,10,11

### VC-04

**Controlled player assignment** — SWR-012 — PASS

Watch mode: user team none, controlled player none. Playing as Northvale: 200 samples over 100 s of play, 0 with no controlled player, wrong team or the goalkeeper.

### VC-05

**Match clock, half time and change of ends** — SWR-020, SWR-021 — PASS

3-minute match (L=180 s). Half time at 90.02 s of play = 45.01'. Clock moved in 0 of 897 steps with the ball out of play. Attacking directions 1/-1 → -1/1. First-half kick-off HAR, second-half kick-off NOR.

### VC-06

**Full time, result screen and replay reset** — SWR-022, SWR-045 — PASS

Full time at 180.00 s of play (90'); full-time screen shown with 0–1 (expected 0–1) and "Northvale take the derby. Cards: HAR 0Y 0R · NOR 1Y 1R". Player sent off before full time: true. After PLAY AGAIN: score 0-0, squads 11/11 (22 players), cards 0/0, red markers 0, state kickoff.

### VC-07

**Kick-off positions** — SWR-023 — PASS

Opening kick-off: 0 players outside their own half, nearest opponent 9.62 from the ball. Kick-off after a goal: 0 outside own half, nearest opponent 9.62, ball 0.04 from the centre spot.

### VC-08

**Goal scored, over the bar, restart** — SWR-024 — PASS

Ball under the bar: state "goal", score +1. Restart: kick-off by NOR (team that conceded: NOR), ball 0.04 from the centre spot. Ball over the bar (y=3.2): score +0, restart "goalkick".

### VC-09

**Throw-in** — SWR-025 — PASS

last touch HAR → throw to NOR (taker NOR) at x=10.00, z=33.60; last touch NOR → throw to HAR (taker HAR) at x=10.00, z=-33.60. Crossing point x≈10.

### VC-10

**Corner kick and goal kick** — SWR-026 — PASS

Over the goal line at z=10, last touch by defenders (NOR) → corner to HAR at (52.10, 33.60). Last touch by attackers (HAR) → goalkick to NOR, taker is the goalkeeper: true, goalkeeper has the ball when it is taken: true.

### VC-11

**Offside offence penalised** — SWR-030, SWR-031 — PASS

Receiver 34 m vs second-last defender 26 m, ball at 12 m → state "restart", restart "freekick" to defending team: true, offside count +1, banner "OFFSIDEFREE KICK · NORTHVALE". Receiver 30 m vs second-last defender 26 m, ball at 12 m → state "restart", restart "freekick" to defending team: true, offside count +1, banner "OFFSIDEFREE KICK · NORTHVALE".

### VC-12

**No offside: onside, own half, throw-in** — SWR-030 — PASS

onside: receiver 22, line 26, ball 12 → ball won by receiver, offside +0; ownHalf: receiver -5, line -10, ball -25 → ball won by receiver, offside +0; throwIn: receiver 34, line 26, ball 12, from throw → ball won by receiver, offside +0; corner: receiver 34, line 26, ball 12, from corner → ball won by receiver, offside +0.

### VC-13

**Standing-tackle fouls by direction** — SWR-040 — PASS

From the front: 7/60 fouls (11.7%), 45 balls won. From behind: 36/60 fouls (60.0%), 18 balls won.

### VC-14

**Free kick: award, wall distance, kick taken** — SWR-041, SWR-042 — PASS

#1: freekick to fouled team true, 0.00 from foul spot, nearest opponent 9.21 at the kick, taker pass ; #2: freekick to fouled team true, 0.00 from foul spot, nearest opponent 9.19 at the kick, taker pass ; #3: freekick to fouled team true, 0.00 from foul spot, nearest opponent 11.27 at the kick, taker pass ; #4: freekick to fouled team true, 0.00 from foul spot, nearest opponent 14.48 at the kick, taker pass ; #5: freekick to fouled team true, 0.00 from foul spot, nearest opponent 9.17 at the kick, taker pass .

### VC-15

**Penalty kick: award, spot, positions, kick taken** — SWR-041, SWR-042 — PASS

#1: penalty to fouled team true, spot 11.00 from goal line at z=0.00, players inside area at kick: none, taker shot; #2: penalty to fouled team true, spot 11.00 from goal line at z=0.00, players inside area at kick: none, taker shot; #3: penalty to fouled team true, spot 11.00 from goal line at z=0.00, players inside area at kick: none, taker shot; #4: penalty to fouled team true, spot 11.00 from goal line at z=0.00, players inside area at kick: none, taker shot.

### VC-16

**Yellow and red cards** — SWR-043, SWR-045 — PASS

Third foul: "YELLOW CARDNORTHVALE No. 7 · FREE KICK" (restart freekick, sent off false); Foul by a player already booked: "RED CARDSECOND YELLOW · NORTHVALE No. 8 · FREE KICK" (restart freekick, sent off true); Last-man foul outside the area: "RED CARDNORTHVALE No. 11 · FREE KICK" (restart freekick, sent off true); Last-man foul inside the area: "YELLOW CARDNORTHVALE No. 4 · PENALTY" (restart penalty, sent off false).

### VC-17

**Sending-off effects, minimum of seven, card display** — SWR-044, SWR-045 — PASS

After one red: Northvale 10 players, sent-off No. 3 still simulated: false, 21 players on the pitch, 1 red marker. At 7 players a last-man foul gave "FOULFREE KICK · HARBOR CITY", squad stays 7, offender sent off: false. Red markers 4 = reds 4. Pause screen: "Harbor City 0 – 0 Northvale · 0' · HAR 0Y 0R · NOR 0Y 4R". Sent-off player visible while the card is shown: true, after 3 s: false. Screenshot: docs/verification/red-card.png.

### VC-18

**Ball physics: bounce, roll, woodwork** — SWR-050 — PASS

Dropped from 3.0: first rebound peak 0.92, at rest after 2.13 s. Rolled at 10: speed never increased (true), stopped after 13.2 (final speed 0.000). Shot at the post: rebound velocity -10.1 toward the field, goals +0. Shot at the crossbar: -11.8, goals +0.

### VC-19

**Goalkeeper dives to the crossing point** — SWR-060 — PASS

aim z=-3: keeper 0.18 from the ball at the crossing, overshoot 0.18, caught; aim z=-2: keeper 0.04 from the ball at the crossing, overshoot 0.00, goal; aim z=-1: keeper 0.10 from the ball at the crossing, overshoot 0.73, parried; aim z=1: keeper 0.18 from the ball at the crossing, overshoot 0.72, parried; aim z=2: keeper 0.83 from the ball at the crossing, overshoot 0.00, parried; aim z=3: keeper 0.32 from the ball at the crossing, overshoot 0.32, parried. Shots at 24 from 18 out.

### VC-20

**Receive assist** — SWR-071 — PASS

No key held: control on receiver true, ball received true. Holding toward goal (along the pass): control on receiver true, ball received true. Holding sideways: control on receiver true, ball received true. Pass running across in front, user pushing away: assist cancelled true on the first frame and the player runs where the user pushes (target speed 6.5 in the pushed direction). After that the existing auto-switch may hand control to whoever is nearest the ball.

### VC-21

**Pass assist avoids blocked lanes; lofted pass** — SWR-070 — PASS

Two team-mates ahead, one with an opponent in the lane. J: ground pass to the clear-lane mate. L: lofted pass (lob flag true), ball peak height 1.4.

### VC-22

**Kicks are only sometimes blocked at source** — SWR-072 — PASS

Opponent 0.9 in front of the passer blocked 9 of 80 passes (11.3%).

### VC-23

**Sliding tackle: trigger, motion, outcome** — SWR-080, SWR-081 — PASS

From the front: 40 slides, ball won 37 (92.5%), fouls 3 (7.5%; 1 yellow, 0 red), carrier kept ball 0. From the side: 40 slides, ball won 39 (97.5%), fouls 1 (2.5%; 0 yellow, 0 red), carrier kept ball 0. From behind: 40 slides, ball won 0 (0.0%), fouls 40 (100.0%; 35 yellow, 2 red), carrier kept ball 0. Free slide: lasted 0.68 s, covered 3.14, recovery 0.40 s, second slide straight after: false. K while own team has the ball: slide false. K during an opponents' free kick: slide false.

### VC-24

**Keyboard controls** — SWR-090 — PASS

1 s of D: 5.4 along x; →: 5.4; W: -5.4 along z; ↓: 5.4; A: -5.4; D+Shift: 6.4. J ground, Z ground, L lob, C lob pass. K: power bar true, shot true; X: power bar true, shot true. Space switched true, Q switched true. V: BROADCAST CAM → PITCHSIDE CAM → TACTICAL CAM → BROADCAST CAM. M: SOUND OFF / SOUND ON. P,P,Esc,Esc paused: true,false,true,false.

### VC-25

**Touch controls** — SWR-091 — PASS

Emulated phone 844 × 390 with touch (coarse pointer true). Touch controls shown true, keyboard hints shown false, mini-map shown false. Buttons: SWITCH, LOB, SPRINT, SKILL, PASS, SHOOT, THRU. Shoot button reads "SLIDE" when defending, "SHOOT" in possession. Tapping PASS passed the ball: true. Screenshot: docs/verification/touch-landscape.png.

### VC-26

**Heads-up display** — SWR-092 — PASS

Scoreboard shown true: HAR 0–0 NOR, clock 4' (expected 4'), 1ST HALF. Camera label true, mini-map true, key hints true when playing and false in Watch mode, power bar false when not shooting. Screenshot: docs/verification/hud-desktop.png.

### VC-27

**Pause, resume, back to menu** — SWR-093 — PASS

P showed the pause screen true ("Harbor City 0 – 0 Northvale · 0'"); clock frozen for 1 s true. RESUME hid it true; the clock then advanced 2.58 s of play in 3 s of real time. Esc then "Back to menu" returned to the start menu true.

### VC-28

**Audio start, whistle and mute** — SWR-094 — PASS

Audio contexts before KICK OFF 0, after 1. Oscillators (whistle) 0 → 2 at kick-off. Buffer sources (crowd, kicks) 1 → 12 after 10 s of play. M: "SOUND OFF", then "SOUND ON". Whether the sound is actually heard is checked by demonstration (VC-31 session).

### VC-29

**Responsive layout** — SWR-095 — PASS

390×844: no horizontal scroll on menu true / in play true; menu fits true; scoreboard fits true; joystick fits true; buttons fit true. 844×390: no horizontal scroll on menu true / in play true; menu fits true; scoreboard fits true; joystick fits true; buttons fit true. 1280×720: no horizontal scroll on menu true / in play true; menu fits true; scoreboard fits true. Screenshot: docs/verification/phone-portrait.png.

### VC-30

**Simulation step cost** — SWR-100 — PASS

3600 steps (60 s of match time) in 53 ms of CPU: 0.015 ms per step on the verification machine.

### VC-31

**Frame rate on GPU hardware** — SWR-101, SWR-094 — NOT RUN (manual)

Manual demonstration: play a 5-minute match on a computer with a hardware GPU and watch the browser's frame-rate meter (Chrome DevTools > Rendering > Frame rendering stats). Not run here: the headless verification machine has no GPU, so software-rendered frame rates would not be meaningful.

### VC-32

**Simulated computer-vs-computer matches** — SWR-032, SWR-061, SWR-073, SWR-082 — PASS

10 matches of 5 minutes, both teams computer-controlled. Shots 137, goals 24: conversion 17.5% (2.4 goals per match). Ground passes received 552/691 (79.9%). Lofted passes received 464/639 (72.6%). Per match: sliding tackles 4.2, offsides 0.1, fouls 2.0, yellow cards 0.8, red cards 0.20.

### VC-33

**Scripted-user pass completion** — SWR-073 — PASS

6 matches of 5 minutes as Harbor City. The scripted user dribbles toward goal, passes with J every 0.7–1.7 s and keeps holding the forward key for 0.5 s after each pass. User ground passes received 66/76 (86.8%); 0 lost by the receiver within 1.5 of the ball, the rest intercepted on the way.

### VC-34

**No script errors across the whole run** — SWR-003 — PASS

0 uncaught errors or console errors (other than blocked web-font requests) were recorded across every page and match in this run, including 16 complete 5-minute matches, several 3-minute matches and the career-mode cases.

### VC-35

**Founding a club** — SWR-110 — PASS

Create screen shown true. Typed name cut to 22 characters: "Test Rovers Football C"; short name "tr1x" → "TR1"; crest letters "trx9" → "TRX" (preview shows them true). Crest diamond/hoops/#7b2cbf; home shirt #f2c94c; away shorts #111827; opposition 2, match 180 s. New club: tier 0 (Division 5), 1000 coins, season 1, 18 players (GK-DF-MF-FW 2-6-6-4), stadium level 1, lineup of 18; hub shown true.

### VC-36

**Season structure, league table and cup** — SWR-111, SWR-112, SWR-114 — PASS

14 matchdays of 4 matches with all 8 clubs each time: true; 56 distinct home-and-away pairings (8 × 7 = 56). Event order LLLC0LLLLC1LLLLC2LLL (L league, C0–C2 cup rounds). After 13 simulated matchdays: every club has 13 played with W+D+L = 13, goals for = goals against overall, table sorted by points, goal difference, goals: true. Cup: quarter-finals 4, semi-finals 2, final 1, winner set, every winner consistent with score or penalties: true (2 ties went to penalties). Final matchday led to the end-of-season screen true; history has 1 season; now season 2.

### VC-37

**Promotion, relegation and prize money** — SWR-113 — PASS

tier 0, finished 1: move +1, now tier 1, prize 1760 (coins +1760); tier 0, finished 2: move +1, now tier 1, prize 840 (coins +840); tier 0, finished 3: move 0, now tier 0, prize 720 (coins +720); tier 0, finished 8: move 0, now tier 0, prize 120 (coins +120); tier 3, finished 7: move -1, now tier 2, prize 600 (coins +600); tier 3, finished 8: move -1, now tier 2, prize 300 (coins +300); tier 5, finished 1: move 0, now tier 5, prize 6160 (coins +6160); tier 5, finished 8: move -1, now tier 4, prize 420 (coins +420); tier 2, finished 2: move +1, now tier 3, prize 1680 (coins +1680). Tier 0 is Division 5, tier 5 the Elite Division.

### VC-38

**Playing a career fixture in 3D** — SWR-115, SWR-130, SWR-131 — PASS

PLAY MATCH started the 3D match true with the user controlling "Pitch Test" (away); the user's starting eleven is on the pitch in lineup order true; stadium level 1 = home club's level 1; crests on the scoreboard 2. With home shirts forced to clash, the away side wore its away kit true (shirts #7b2cbf v #f2f6f9). After full time and CONTINUE: result recorded in the table true, result screen matches the score true, coins added equal the shown total true, back in the career screens true. Leaving the next match from the pause menu ("Leave match (not counted)"): fixture not consumed true, still 1 played, career screens shown true.

### VC-39

**Match earnings** — SWR-116 — PASS

W (away, 3 scored): Win bonus +150, Goals scored (3) +45; total 195, coins +195. D (home, 2 scored): Draw bonus +70, Goals scored (2) +30, Gate receipts, 1,299 fans +32; total 132, coins +132. L (away, 0 scored): Appearance fee +30, Goals scored (0) +0; total 30, coins +30.

### VC-40

**Saving, reloading, export, import, delete** — SWR-117 — PASS

Before reload: {"name":"Saved FC","coins":6190,"ev":2,"squad":19,"P":2}. After reloading the page and opening Career: {"name":"Saved FC","coins":6190,"ev":2,"squad":19,"P":2,"hub":"Saved FC"} (identical true). Export downloaded "floodlight-eleven-flt-season1.json" with club "Saved FC" and 6190 coins. Delete (confirmed): career cleared true, storage entry removed true, create screen shown true. Importing the exported file restored "Saved FC" with 6190 coins ("Save imported."). Importing an unrelated JSON file was refused ("That file is not a Floodlight Eleven career save.") and kept the career.

### VC-41

**Player model and ratings in play** — SWR-120, SWR-122 — PASS

Squad of 18: attributes 15–99, overall = position-weighted sum, potential ≥ overall, names, ages and numbers present: true; shirt numbers unique true. Rated 90 v 50 for pace, run speed 7.31 v 6.21 m/s. Passing 95 v 40: mean sideways miss over 25 m 0.14 v 0.59 m. Shooting 95 v 40: share of shots from 20 m on target 0.92 v 0.77. Defending 95 v 35 against a 70 dribbler: standing tackles won 0.87 v 0.62. Goalkeeping 95 v 40: shots saved or parried 0.97 v 0.80. Stamina 95 v 40: stamina used in 5 s of sprinting 0.017 v 0.027.

### VC-42

**Formation and line-up** — SWR-121 — PASS

Choosing 4-3-3 re-picked the eleven with a goalkeeper in slot 1: true; slots shown GK,LB,CB,CB,RB,CM,DM,CM,LW,ST,RW. Tapping a forward highlighted the row true; tapping a substitute defender swapped them true and saved it true. The defender in a forward slot shows his rating −8 in red true (keeper in an outfield slot −35). In the 3D match that player's attributes are scaled by 0.9 in the forward role true. Auto-pick put a forward back in the slot true.

### VC-43

**Transfer market** — SWR-123 — PASS

Market lists 19 players, priced by rating and age true. With 0 coins every paid player's Buy is disabled true. Buying the first player for 315 coins took the coins and added him to the squad and line-up true. At 25 players Buy is disabled true. Selling returned 60% of value (78 coins) and removed him true. At 16 players every Sell is disabled and the eleven is still complete true. After one match the market had new players true.

### VC-44

**Player development, ageing and youth** — SWR-124 — PASS

Across 12 simulated matches, 5 starters improved their overall rating. At the end of the season every remaining player is a year older true; three 20-year-olds with room to grow all improved true; three 32-year-olds all declined true; 2 of five 36-year-olds retired; 2 17-year-old youth players joined, leaving 18 players. The season report lists the retirements and youth players true, and the new line-up is complete with a keeper in goal true.

### VC-45

**Stadium expansion** — SWR-131 — PASS

With 1,000 coins the 1,200-coin upgrade is disabled true. With 1,300 coins, expanding took the stadium to level 2 (6000 seats, shown true) and left 100 coins. Capacities 2000/6000/14000/28000/48000; costs 1200/3500/9000/20000. Stands visible by level as [end stands, main roof, end roofs]: 000 · 100 · 110 · 111 · 111. Matches use the home club's stadium (VC-38).

### VC-46

**Through balls** — SWR-140 — PASS

20 trials: I played 20 passes, 20 flagged as through balls to the runner; 20 sent into space at least 2 ahead of him; 20 reached him. Computer teams played 29 through balls in 10 simulated matches (2.9 per match).

### VC-47

**Skill moves** — SWR-141 — PASS

A defender kept on the ball for 0.35 s took it 27 times in 80 trials without a skill move and 0 times in 79 trials where the move started (1 did not start because control had not passed to the dribbler). Pressing O started a 0.38 s move with a 1.28 s cooldown, cost 0.030 stamina and carried the player 2.3 with the ball (still his: true); pressing again at once did nothing true. Computer dribblers made 193 skill moves in 10 matches (19.3 per match).

### VC-48

**Stamina** — SWR-142 — PASS

5 s of sprinting used 0.024 stamina; 5 s of running 0.015. Standing still for 5 s recovered 0.006. Running speed at 20% stamina is 89% of a fresh player's. Half time took every player from 0.50 to at least 0.65. Average outfield stamina at full time over 10 simulated matches: 0.71.

### VC-49

**Substitutions** — SWR-143 — PASS

Pause menu shows Substitutions true; it opens the panel true. Swapping a tired player for the first substitute put the new player on with full stamina true; 1 used, 4 left on the bench; announced "HAR SUBSTITUTION · ON M. Holm · OFF Z. Bonnet". After 5 substitutions every button is disabled true. Done returns to the pause menu true; in Watch mode the button is hidden true. Computer teams made 47 substitutions in 10 matches, at most 3 per team per match, the earliest at 60.2'.

### VC-50

**Name tag over the controlled player** — SWR-144 — PASS

Tag shown true reading "9 FERRO" (expected "9 FERRO"), on screen true; stamina bar 42% for stamina 0.42. Hidden in Watch mode true.

## 5. Defects found and corrected during verification

The first full run on 17 November 2026 failed 7 cases. Four of the failures were defects in the game, which were corrected; the other three were errors in the test script. The results above are from the rerun after the fixes.

| Case | Finding | Kind | Correction |
| --- | --- | --- | --- |
| VC-14 | At free kicks, opponents were as close as 4.4 to the ball when it was kicked (required: 9.15). Set pieces were taken on a fixed timer, before players had walked back. | Software defect | Set pieces now wait until opponents are 9.15 away. After 2.5 s any player still too close is moved back. Players retreat at running pace. |
| VC-15 | At penalties, players were still inside the penalty area when the kick was taken. | Software defect | Same fix: penalties wait for the area and the arc to clear, and move any players still in them after 2.5 s. |
| VC-19 | A diving keeper could carry on up to 1.6 past the ball's line. He was driven toward the target at full speed and could not brake in time. | Software defect | Dive and shot-tracking speeds now taper with the remaining distance, so the keeper stops on the line of the ball. |
| VC-17 (found while writing it) | If a second card was shown within 2.5 s of a red card, the first sent-off player was left standing on the pitch. | Software defect | A new card now removes any player still waiting to leave. |
| VC-20 (found while writing it) | The receive assist turned off when the user kept holding the direction they had passed in — the most common case. | Software defect | The assist now stays on when the user pushes along the ball's path, and turns off only when pushing away from the ball and across its path. |
| VC-18 | The crossbar shot was aimed at the bar's underside, and the ball correctly went in. | Test error | The shot now meets the front of the bar. |
| VC-20 | After the assist was cancelled, the test measured several frames later, after the game's auto-switch had handed control to another player. | Test error | The test now checks the first frame after the cancel. |
| VC-23 | The free-slide measurement used a player who was not the controlled one. | Test error | The test player is made the controlled player first. |
| VC-25 | The test read the shoot button's label while the opponents had the ball, so it read SLIDE. | Test error | Buttons are now identified by their role, not their label. |
