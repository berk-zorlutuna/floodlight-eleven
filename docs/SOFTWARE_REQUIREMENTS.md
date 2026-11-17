# Floodlight Eleven — Software Requirements

| | |
| --- | --- |
| Document | SWR — Software Requirements Specification |
| Software | `floodlight-eleven.html` |
| Version | 1.0 |
| Parent | [System Requirements](SYSTEM_REQUIREMENTS.md) |
| Verified by | [Verification Cases](VERIFICATION_CASES.md) · [Verification Results](VERIFICATION_RESULTS.md) |

## 1. Conventions

- Each requirement has an ID `SWR-nnn`, a parent system requirement, a verification method and the verification case(s) that cover it.
- Methods: **T** test (automated, `tests/verify.js`), **A** analysis of measured statistics over simulated matches, **I** inspection, **D** demonstration by a person.
- Units are metres, seconds and metres per second. The pitch origin is the centre spot; *x* runs along the length of the pitch, *z* across it.
- "Match minutes" are the 0–90 minutes shown on the clock. "Real time" is wall-clock time while the ball is in play.

## 2. Requirements

### 2.1 Start-up and robustness

**SWR-001 — Delivery.** The software shall be a single HTML file. It shall load three.js r128 from `cdnjs.cloudflare.com` and stylesheets only from Google Fonts, with all other code and styles inline.
Parent: SYS-01, SYS-02 · Method: T, I · Case: VC-01

**SWR-002 — Start menu.** On load the software shall show a start menu with three options and a KICK OFF button:
- Play as: Harbor City / Northvale / Watch — default Harbor City
- Match: 3 min / 5 min / 8 min — default 5 min
- Opposition: Easy / Normal / Hard — default Normal

Parent: SYS-04, SYS-06, SYS-07, SYS-18 · Method: T · Case: VC-01

**SWR-003 — No script errors.** No uncaught script error or console error shall occur during load, menus or complete matches. Failures to load web fonts are excluded.
Parent: SYS-20 · Method: T · Case: VC-34

### 2.2 Pitch, teams and control

**SWR-010 — Dimensions.** The pitch shall be 105 × 68. Each goal shall be 7.32 wide and 2.44 high. Each penalty area shall be 16.5 deep and 40.32 wide.
Parent: SYS-03 · Method: T · Case: VC-02

**SWR-011 — Squads.** Each team shall field 11 players in a 4-4-2: 1 goalkeeper, 4 defenders, 4 midfielders and 2 forwards, with unique shirt numbers 1–11.
Parent: SYS-03 · Method: T · Case: VC-03

**SWR-012 — Controlled player.** In Watch mode no player shall be user-controlled. When the user plays, at every moment exactly one outfield player of the chosen team shall be controlled, never the goalkeeper.
Parent: SYS-04 · Method: T · Case: VC-04

### 2.3 Match flow and restarts

**SWR-020 — Match clock.** The selected real-time length *L* (180, 300 or 480 s) shall map linearly to 90 match minutes. The clock shall advance only while the ball is in play.
Parent: SYS-06 · Method: T · Case: VC-05

**SWR-021 — Half time.** At 45 match minutes the software shall stop play for half time. Teams shall then change ends, and the second half shall start with a kick-off by the team that did not kick off the first half.
Parent: SYS-06 · Method: T · Case: VC-05

**SWR-022 — Full time.** At 90 match minutes the software shall end the match and show a full-time screen with the score and a result line. PLAY AGAIN shall start a new match with score, cards and full squads reset.
Parent: SYS-06, SYS-18 · Method: T · Case: VC-06

**SWR-023 — Kick-off.** At each kick-off the ball shall be on the centre spot and every player in their own half. Players of the team not kicking off shall be at least 9.15 from the ball.
Parent: SYS-08 · Method: T · Case: VC-07

**SWR-024 — Goal.** When the ball wholly crosses the goal line between the posts and under the crossbar, the attacking team's score shall increase by one. Play shall restart with a kick-off by the team that conceded. A ball crossing the line above the bar shall not count as a goal.
Parent: SYS-08 · Method: T · Case: VC-08

**SWR-025 — Throw-in.** When the ball wholly crosses a touchline, the opponents of the team that last touched it shall be given a throw-in from where it crossed.
Parent: SYS-08 · Method: T · Case: VC-09

**SWR-026 — Corner and goal kick.** When the ball wholly crosses a goal line outside the goal, the outcome shall depend on who touched it last:
- the defending team → a corner kick to the attacking team, from the corner on that side
- otherwise → a goal kick taken by the defending goalkeeper

Parent: SYS-08 · Method: T · Case: VC-10

### 2.4 Offside

**SWR-030 — Offside position.** When a player plays the ball (pass, shot or clearance), each team-mate is in an offside position if they are both:
- in the opponents' half
- nearer the opponents' goal line than both the ball and the second-last opponent

Balls played from a throw-in, a corner kick or a goal kick are exempt.
Parent: SYS-09 · Method: T · Cases: VC-11, VC-12

**SWR-031 — Offside offence.** If a player who was in an offside position when the ball was played is the next player to gain possession, play shall stop. The defending team shall get a free kick at that point, announced as OFFSIDE.
Parent: SYS-09 · Method: T · Case: VC-11

**SWR-032 — Computer players and offside.** Computer attackers shall time their runs, and computer passers shall choose targets, so that offside is called no more than 2 times per match on average across simulated matches.
Parent: SYS-05, SYS-09 · Method: A · Case: VC-32

### 2.5 Fouls, set pieces and cards

**SWR-040 — Standing-tackle fouls.** A standing tackle on the ball carrier may be a foul. The chance of a foul shall be higher for tackles from behind than for tackles from the front. A tackle from the front shall be a foul no more than 25% of the time.
Parent: SYS-10 · Method: T · Case: VC-13

**SWR-041 — Free kick or penalty.** A foul outside the offending team's penalty area shall give the other team a free kick at the place of the foul. A foul inside it shall give a penalty kick from the penalty mark, 11 from the goal line on the centre line of the pitch.
Parent: SYS-10 · Method: T · Cases: VC-14, VC-15

**SWR-042 — Taking free kicks and penalties.**
- The kicking team may shoot or pass.
- At a free kick, opponents shall be at least 9.15 from the ball when it is kicked.
- At a penalty kick, all players except the kicker and the defending goalkeeper shall be outside the penalty area when it is kicked.

Parent: SYS-10 · Method: T · Cases: VC-14, VC-15

**SWR-043 — Cards.**

| Situation | Card |
| --- | --- |
| A player's third foul | Yellow |
| Second yellow | Red |
| Foul that denies an obvious goal-scoring opportunity (last defender, attacker running at goal), outside the area | Red |
| The same foul inside the area | Yellow, plus the penalty |
| Other fouls | Sometimes yellow, more often for tackles from behind; rarely a straight red |

Parent: SYS-11 · Method: T · Case: VC-16

**SWR-044 — Sending-off.** A sent-off player shall leave the match for its remainder, and the team shall play on with one fewer. The scoreboard shall show one red marker per sending-off. No team shall be reduced below 7 players; fouls that would cause this shall not be punished with a red card.
Parent: SYS-11 · Method: T · Case: VC-17

**SWR-045 — Announcements.**
- Each foul, card and offside shall be announced on screen. Card announcements shall name the team and shirt number.
- After a card, the card shall be shown above the player.
- The pause and full-time screens shall show card totals per team.

Parent: SYS-11, SYS-16 · Method: T, I · Cases: VC-16, VC-17, VC-06

### 2.6 Ball and goalkeeping

**SWR-050 — Ball physics.** The ball shall fall under gravity, lose height on each bounce and slow to rest when rolling. It shall rebound off the posts and crossbar.
Parent: SYS-03 · Method: T · Case: VC-18

**SWR-060 — Goalkeeper diving.** When a shot heads for goal, the goalkeeper shall move or dive toward the point where the ball will cross him. A dive shall not carry him more than 1.0 beyond that point. At the moment the ball crosses him, he shall be within diving reach (1.9).
Parent: SYS-05, SYS-14 · Method: T · Case: VC-19

**SWR-061 — Shot conversion.** Across simulated computer-vs-computer matches, between 10% and 30% of shots shall result in goals.
Parent: SYS-14 · Method: A · Case: VC-32

### 2.7 Passing and receiving

**SWR-070 — Pass assist.**
- J/Z shall pass along the ground to the team-mate who best fits the held direction, preferring team-mates whose passing lane is not blocked by an opponent.
- L/C shall play the same choice as a lofted pass.

Parent: SYS-13 · Method: T · Case: VC-21

**SWR-071 — Receive assist.** When the user's team passes, control shall switch to the intended receiver, who shall move to intercept the ball automatically. The assist shall stay on while the user holds no direction, holds a direction toward the ball, or holds one along the ball's path. It shall turn off only when the user pushes away from the ball and across its path.
Parent: SYS-14 · Method: T · Case: VC-20

**SWR-072 — Blocks at source.** For the first 0.16 s after a kick, an opponent shall be able to take the ball in only about 20% of kicks. Over repeated trials, an opponent 0.9 in front of the passer shall block no more than 35% of passes, and some blocks shall occur.
Parent: SYS-14 · Method: T · Case: VC-22

**SWR-073 — Pass completion.** Across simulated matches, the following shares of passes shall reach the intended receiver:

| Passes | At least |
| --- | --- |
| Computer ground passes | 75% |
| Computer lofted passes | 65% |
| Ground passes by a scripted user who keeps holding the pass direction | 70% |

Parent: SYS-14 · Method: A · Cases: VC-32, VC-33

### 2.8 Tackling

**SWR-080 — Sliding tackle.**
- Pressing K/X while the opponents have the ball shall start a sliding tackle toward the ball, or in the held direction.
- The slide shall last 0.65 s and cover 2.5–4.0, followed by at least 0.35 s getting up. Another slide shall not be possible within 1.6 s of the previous one.
- K/X shall not slide while the user's team has the ball, or while the opponents are taking a set piece.

Parent: SYS-13 · Method: T · Case: VC-23

**SWR-081 — Sliding tackle outcome.**
- From the front or side: the slide shall win (knock loose) the ball at least 80% of the time.
- From behind: it shall be a foul at least 80% of the time, with higher odds of a card than a standing tackle.

Parent: SYS-10, SYS-13 · Method: T · Case: VC-23

**SWR-082 — Computer slides.** Computer defenders shall make sliding tackles: at least one per match on average across simulated matches.
Parent: SYS-05 · Method: A · Case: VC-32

### 2.9 Controls and user interface

**SWR-090 — Keyboard.**

| Key | Action |
| --- | --- |
| W A S D / arrow keys | Move |
| Shift | Sprint (faster than normal running) |
| J / Z | Pass, or standing tackle without the ball |
| K / X | Hold to charge a shot, shown by a power bar; release to shoot. Slide while defending |
| L / C | Lofted pass |
| Space / Q | Switch to another player when the team is not in possession |
| V | Cycle three camera views, named on screen |
| M | Mute / unmute |
| P / Esc | Pause |

Parent: SYS-12, SYS-13, SYS-15 · Method: T · Case: VC-24

**SWR-091 — Touch controls.** On coarse-pointer (touch) devices the software shall show a joystick and five buttons: SWITCH, LOB, SPRINT, PASS and SHOOT. The keyboard hints and mini-map shall be hidden. SHOOT shall read SLIDE while the opponents have the ball.
Parent: SYS-12 · Method: T · Case: VC-25

**SWR-092 — HUD.**
- Scoreboard with team codes, score, match minute and half.
- Camera label.
- Mini-map on desktop.
- Keyboard hints on desktop when the user plays (not in Watch mode).
- Shot-power bar only while charging a shot.

Parent: SYS-16 · Method: T · Case: VC-26

**SWR-093 — Pause and menus.** P/Esc shall show a pause screen with teams, score and minute, and freeze the match. RESUME shall continue the match. Back to menu shall return to the start menu.
Parent: SYS-18 · Method: T · Case: VC-27

**SWR-094 — Audio.** The software shall create its audio context when the user starts a match, and play a whistle at kick-off. M shall toggle sound off and on, announcing SOUND OFF / SOUND ON.
Parent: SYS-17 · Method: T, D · Case: VC-28

**SWR-095 — Layout.** At viewport sizes of 390 × 844, 844 × 390 and 1280 × 720 there shall be no horizontal page scroll, and the menu, scoreboard and touch controls shall lie within the viewport.
Parent: SYS-19 · Method: T · Case: VC-29

### 2.10 Performance

**SWR-100 — Simulation cost.** One simulation step (1/60 s of match time, all 22 players and the ball) shall take no more than 2 ms of CPU time on average.
Parent: SYS-21 · Method: T · Case: VC-30

**SWR-101 — Frame rate.** On a computer with a hardware GPU, the game shall render at or near 60 frames per second during play.
Parent: SYS-21 · Method: D · Case: VC-31
