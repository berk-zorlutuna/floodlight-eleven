# Floodlight Eleven — Software Verification Cases

| | |
| --- | --- |
| Document | Software Verification Cases |
| Software | `floodlight-eleven.html` |
| Version | 1.0 |
| Verifies | [Software Requirements](SOFTWARE_REQUIREMENTS.md) |
| Results | [Verification Results](VERIFICATION_RESULTS.md) |
| Implementation | `tests/verify.js` (automated); VC-31 is manual |

## 1. Approach

Each case is listed with:
- the requirements it verifies
- the verification method
- its setup and procedure
- the pass criteria

All cases except VC-31 are automated and run against the unmodified game file in headless Chromium.

**Test hooks.** The game exposes a debug object, `window.__fe`. Through it the script can:
- step the simulation without rendering
- place players and the ball
- call the game's own foul, offside, pass and slide functions
- read state: score, clock, restart in progress, controlled player, counters
- receive pass, shot and slide events

Keyboard input is sent as real `keydown`/`keyup` events, so it goes through the game's own input handling.

**Repeatability.** `Math.random` is replaced by a seeded generator (seed in the results header). While the script drives the clock, the animation loop renders but does not advance the match. A rerun on the same code therefore gives the same results.

**Statistical cases.** The analysis cases (method A) run whole matches between computer teams, and run the user's team with a scripted user, then compare totals with the requirement thresholds.

**Common setup.** "Start a match" means the following steps:
1. Return to the menu.
2. Pick the side (Harbor City, Northvale or Watch), length and difficulty.
3. Press KICK OFF.
4. Step until the ball is in play.

"Clear the area" means moving every player not named in the case to the flanks, at least 22 from the centre line of the pitch.

### Running

```bash
npm install            # three.js r128 for offline runs
npm run verify         # all cases; writes docs/VERIFICATION_RESULTS.md
node tests/verify.js VC-14 VC-19   # selected cases, console only
```

Playwright with Chromium must be available (`npm i -D playwright && npx playwright install chromium`).

## 2. Cases

### VC-01 — Start-up, delivery and start menu
- **Requirements:** SWR-001, SWR-002 · **Method:** T, I
- **Procedure:** Load the page. List its external scripts and stylesheets and read `THREE.REVISION`. Read the menu's option labels and which options are pre-selected. Count the HTML files in the repository.
- **Pass if:**
  - there is exactly one HTML file and one external script, the cdnjs three.js r128 URL, with REVISION `128`
  - all stylesheets come from Google Fonts
  - the menu is visible, with options Harbor City / Northvale / Watch, 3 / 5 / 8 min and Easy / Normal / Hard, and the button KICK OFF
  - defaults are Harbor City, 5 min (300 s) and Normal

### VC-02 — Pitch and goal dimensions
- **Requirements:** SWR-010 · **Method:** T
- **Procedure:** Read the game's dimension constants.
- **Pass if:** the pitch is 105 × 68, the goal 7.32 × 2.44, and the penalty area 16.5 deep × 40.32 wide.

### VC-03 — Squads and 4-4-2 formation
- **Requirements:** SWR-011 · **Method:** T
- **Procedure:** Start a match. For each team count players by role and list the shirt numbers.
- **Pass if:** each team has 11 players (1 GK, 4 DF, 4 MF, 2 FW) numbered 1–11.

### VC-04 — Controlled player assignment
- **Requirements:** SWR-012 · **Method:** T
- **Procedure:**
  1. Start a Watch match and play 15 s; read the user team and the controlled player.
  2. Start a match as Northvale and sample the controlled player every 0.5 s for 100 s.
- **Pass if:** in Watch mode there is no user team and no controlled player, and as Northvale every sample (more than 100) is a Northvale outfield player.

### VC-05 — Match clock, half time and change of ends
- **Requirements:** SWR-020, SWR-021 · **Method:** T
- **Procedure:** Start a 3-minute Watch match and note the first kick-off team and the attacking directions. Step one frame at a time until the second half kicks off. On every frame where the ball was out of play, check that the clock did not move. Record the clock when half time starts.
- **Pass if:**
  - half time starts at 90.00 ± 0.05 s of play (45')
  - the clock never moves while the ball is out of play
  - both teams' attacking directions are reversed
  - the second half is kicked off by the other team

### VC-06 — Full time, result screen and replay reset
- **Requirements:** SWR-022, SWR-045 · **Method:** T
- **Procedure:**
  1. Start a 3-minute Watch match and play past 60'.
  2. Send off a Northvale player: a third foul by an already-booked player.
  3. Play to full time and read the full-time screen.
  4. Press PLAY AGAIN.
- **Pass if:**
  - full time comes at 180.00 ± 0.05 s of play (90')
  - the screen is shown with the actual score and a result line that includes the card totals
  - after PLAY AGAIN the score is 0–0, both squads have 11 again (22 players), card counts are zero and no red markers are shown

### VC-07 — Kick-off positions
- **Requirements:** SWR-023 · **Method:** T
- **Procedure:**
  1. Start a match. As the ball comes into play, check every player's half and the distance of the defending team from the ball.
  2. Score a goal by rolling the ball into an unguarded net.
  3. Repeat the check at the next kick-off.
- **Pass if:** at both kick-offs no player is outside their own half, every opponent of the kicking team is at least 9.15 from the ball, and the ball is on the centre spot.

### VC-08 — Goal scored, over the bar, restart
- **Requirements:** SWR-024 · **Method:** T
- **Procedure:** Clear the area and disable the keeper. Then:
  1. Roll the ball at 15 into the goal, 0.5 high.
  2. Wait for the restart.
  3. Repeat with the ball 3.2 high, above the bar.
- **Pass if:**
  - the first shot gives state "goal" and the attacking score +1
  - the restart is a kick-off by the conceding team from the centre spot
  - the high ball scores nothing and gives a goal kick

### VC-09 — Throw-in
- **Requirements:** SWR-025 · **Method:** T
- **Procedure:** Clear the area. Roll the ball over a touchline at x = 10: once over one touchline, last touched by Harbor City; once over the other, last touched by Northvale.
- **Pass if:** each gives a throw-in to the other team, taken by a player of that team, from x = 10 ± 1.5 on that touchline.

### VC-10 — Corner kick and goal kick
- **Requirements:** SWR-026 · **Method:** T
- **Procedure:** Clear the area. Roll the ball over the goal line at z = 10, wide of the goal: once last touched by the defending team, once by the attacking team.
- **Pass if:**
  - the first gives a corner to the attacking team from the corner arc on that side
  - the second gives a goal kick to the defending team, taken by its goalkeeper, who has the ball when play restarts

### VC-11 — Offside offence penalised
- **Requirements:** SWR-030, SWR-031 · **Method:** T
- **Setup:** Harbor City's No. 8 has the ball 12 m into the opponents' half. Northvale's outfield players are all on one line 26 m in, spread across the pitch away from the passing lane. Their goalkeeper is on his line.
- **Procedure:** Pass with the game's own pass function to No. 9, who stands at 34 m. Repeat with No. 9 at 30 m, slightly off-centre.
- **Pass if:** each time play stops for a free kick to Northvale, Harbor City's offside count rises by 1, and the banner reads OFFSIDE.

### VC-12 — No offside: onside, own half, throw-in, corner
- **Requirements:** SWR-030 · **Method:** T
- **Procedure:** Same setup as VC-11, with four variants:
  1. Receiver at 22 m, behind the line.
  2. The whole play inside Harbor City's own half: defenders at −10, receiver at −5, ball at −25.
  3. Receiver at 34 m, but the ball is played from a throw-in.
  4. As 3, but from a corner.
- **Pass if:** in every variant the receiver takes the ball and no offside is called.

### VC-13 — Standing-tackle fouls by direction
- **Requirements:** SWR-040 · **Method:** T
- **Procedure:** Play as Harbor City. A Northvale player stands still with the ball; the user's player stands 1.25 away, in front of him or behind him. Press J (standing tackle). Run 60 trials from each side.
- **Pass if:** at least 40 valid trials from each side, the foul rate from behind is at least 15 percentage points higher than from the front, and the foul rate from the front is no more than 25%.

### VC-14 — Free kick: award, wall distance, kick taken
- **Requirements:** SWR-041, SWR-042 · **Method:** T
- **Procedure:** Five times, at different places in midfield:
  1. Place the fouled Harbor City player with the offender beside him and four more Northvale players 2–5 away.
  2. Call the game's foul function.
  3. Track the nearest Northvale player's distance from the ball until the kick is taken.
- **Pass if:** each time:
  - the restart is a free kick to Harbor City, less than 1.0 from the foul
  - no Northvale player is closer than 9.15 when it is taken
  - the taker then kicks the ball

### VC-15 — Penalty kick: award, spot, positions, kick taken
- **Requirements:** SWR-041, SWR-042 · **Method:** T
- **Procedure:** Four times, foul a Harbor City forward 8 m from Northvale's goal line, inside the area, at different offsets across the pitch. Track every player except the kicker and Northvale's goalkeeper until the kick.
- **Pass if:** each time:
  - the restart is a penalty to Harbor City from the mark, exactly 11 from the goal line on the centre line
  - no other player is inside the penalty area when it is taken
  - the kicker shoots

### VC-16 — Yellow and red cards
- **Requirements:** SWR-043, SWR-045 · **Method:** T
- **Procedure:** Using the game's foul function, with Northvale players committing the foul:
  1. A third foul in midfield, with team-mates covering.
  2. A foul by a player who already has a yellow card.
  3. A last-defender foul 20 m from goal, outside the area.
  4. The same foul 8 m out, inside the area.

  Cases 1 and 2 may be repeated up to six times if the random straight-red rule fires first.
- **Pass if:**
  - (1) YELLOW CARD, player stays on
  - (2) RED CARD with SECOND YELLOW, player sent off
  - (3) RED CARD (not "second yellow"), player sent off, free kick
  - (4) YELLOW CARD, player stays on, penalty
  - every banner names NORTHVALE and the player's shirt number

### VC-17 — Sending-off effects, minimum of seven, card display
- **Requirements:** SWR-044, SWR-045 · **Method:** T, I
- **Procedure:**
  1. Send off one Northvale player with a last-defender foul and check the squad and scoreboard.
  2. Repeat until Northvale has 7 players, then commit one more such foul.
  3. Pause and read the pause screen.
  4. In a new match, send a player off and let the animation loop run for 3 s. Capture a screenshot.
- **Pass if:**
  - after one red: Northvale has 10 players, the sent-off player has left the simulation (21 players on the pitch), and there is 1 red marker
  - at 7 players the extra foul gives no red card and the squad stays at 7
  - red markers equal red cards
  - the pause screen shows `NOR nY 4R`
  - the sent-off player is visible while the card is shown and gone 3 s later (`docs/verification/red-card.png`)

### VC-18 — Ball physics: bounce, roll, woodwork
- **Requirements:** SWR-050 · **Method:** T
- **Procedure:** Clear the area and stop all players touching the ball. Then:
  1. Drop the ball from 3.0.
  2. Roll it at 10.
  3. Shoot at 20 at the centre of a post.
  4. Shoot at 20 at the front of the crossbar.
- **Pass if:**
  - the first rebound peaks between 0.3 and 1.5 and the ball then comes to rest
  - the rolling speed never increases and the ball stops after 5–30
  - post and bar both send the ball back into the field with no goal

### VC-19 — Goalkeeper dives to the crossing point
- **Requirements:** SWR-060 · **Method:** T
- **Procedure:** Six shots at 24 from 18 m, aimed at z = −3, −2, −1, 1, 2 and 3 at the goal line, with only the keeper in place. Record the keeper's side-to-side position each frame, his distance from the ball when it passes him, and how far he goes past the ball's line.
- **Pass if:** for every shot the keeper is within 1.9 when the ball passes him and never goes more than 1.0 past the ball's line. Saves and goals are recorded but are not criteria.

### VC-20 — Receive assist
- **Requirements:** SWR-071 · **Method:** T
- **Procedure:** Play as Harbor City. No. 6 passes with the game's own pass function to No. 9, 14 ahead and 8 to the side. Run it three times:
  1. no key held
  2. the forward key held throughout
  3. a sideways key held throughout

  Then divert a pass so the ball runs across in front of the receiver, while the user pushes away from it.
- **Pass if:**
  - in the first three runs, control switches to the receiver and he gets the ball
  - in the diverted run, on the first frame the assist is cancelled and the player is driven in the pushed direction at running speed

### VC-21 — Pass assist avoids blocked lanes; lofted pass
- **Requirements:** SWR-070 · **Method:** T
- **Setup:** The user has the ball. Team-mate X is 15 ahead with a stationary opponent in the passing lane. Team-mate Y is 16 ahead with a clear lane.
- **Procedure:** Hold forward and press J. Reset, then hold forward and press L.
- **Pass if:** J plays a ground pass to Y, and L plays a lofted pass that rises above 1.0.

### VC-22 — Kicks are only sometimes blocked at source
- **Requirements:** SWR-072 · **Method:** T
- **Procedure:** 80 trials. An opponent stands 0.9 directly in front of a passer, who passes to a team-mate 15 away. Count how often the opponent has the ball 0.25 s later.
- **Pass if:** at least one block occurs, and no more than 35% of passes are blocked.

### VC-23 — Sliding tackle: trigger, motion, outcome
- **Requirements:** SWR-080, SWR-081 · **Method:** T
- **Procedure:**
  1. Outcome: a Northvale player stands still with the ball; the user's player is 2.2 away, in front, at the side, or behind. Press K. Run 40 trials from each direction.
  2. Motion: with the carrier 8 away, press K and measure the slide's duration, distance and recovery, then press K again straight away.
  3. Press K with the user's own team in possession.
  4. Press K while Northvale is taking a free kick.
- **Pass if:**
  - at least 30 slides from each direction
  - front and side win the ball at least 80% of the time
  - behind is a foul at least 80% of the time, and more than 60% of those fouls are booked
  - the slide lasts 0.65 ± 0.05 s, covers 2.5–4.0, and is followed by at least 0.35 s of recovery
  - the immediate second press does nothing
  - no slide happens in steps 3 and 4

### VC-24 — Keyboard controls
- **Requirements:** SWR-090 · **Method:** T
- **Procedure:**
  - Movement: from a standstill without the ball, hold each of D, →, W, ↓ and A for 1 s, then D + Shift.
  - With the ball and a team-mate ahead, press J, Z, L and C in turn. Hold K for 0.5 s and release; repeat with X.
  - With the opponents in possession, press Space, then Q.
  - Press V three times, M twice, and P, P, Esc, Esc.
- **Pass if:**
  - each movement key moves the player more than 3 the right way
  - sprint goes at least 15% further than running
  - J and Z play ground passes; L and C play lofted passes
  - K and X show the power bar while held and shoot on release
  - Space and Q each switch to another Harbor City player
  - the camera label cycles BROADCAST → PITCHSIDE → TACTICAL → BROADCAST
  - M announces SOUND OFF then SOUND ON
  - pause state goes on, off, on, off

### VC-25 — Touch controls
- **Requirements:** SWR-091 · **Method:** T
- **Procedure:** Emulate a phone (844 × 390, touch, mobile). Start a match as Harbor City. Then:
  1. Read which controls are visible.
  2. Read the shoot button's label with the opponents in possession, then with the user in possession.
  3. Tap PASS.
- **Pass if:**
  - the pointer is coarse
  - the touch controls are shown; keyboard hints and mini-map are hidden
  - the buttons are SWITCH, LOB, SPRINT, PASS and SHOOT
  - the label reads SLIDE when defending and SHOOT in possession
  - tapping PASS passes the ball (`docs/verification/touch-landscape.png`)

### VC-26 — Heads-up display
- **Requirements:** SWR-092 · **Method:** T
- **Procedure:** Play 20 s as Harbor City and read the HUD. Then start a Watch match and read it again.
- **Pass if:**
  - the scoreboard shows HAR, NOR, the true score, the true minute and 1ST HALF
  - the camera label, mini-map and key hints are shown
  - the power bar is hidden
  - in Watch mode the key hints are hidden (`docs/verification/hud-desktop.png`)

### VC-27 — Pause, resume, back to menu
- **Requirements:** SWR-093 · **Method:** T
- **Procedure:** With the real animation loop running:
  1. Press P and wait 1 s.
  2. Press RESUME and wait 3 s.
  3. Press Esc, then "Back to menu".
- **Pass if:**
  - the pause screen shows "Harbor City n – n Northvale · m'" and the clock does not move while paused
  - after RESUME the screen hides and the clock advances by more than 0.3 s
  - "Back to menu" shows the start menu and hides the scoreboard

### VC-28 — Audio start, whistle and mute
- **Requirements:** SWR-094 · **Method:** T, D
- **Procedure:** Count audio contexts, oscillators and buffer sources created by the page. Check the counts before and after KICK OFF, at the kick-off whistle, and after 10 s of play. Then press M twice.
- **Pass if:**
  - no audio context exists before KICK OFF and one exists after
  - oscillators are created at the kick-off whistle
  - buffer sources (crowd and kicks) are created during play
  - M announces SOUND OFF then SOUND ON
- **Not covered here:** whether the sound is audible is checked during the VC-31 demonstration.

### VC-29 — Responsive layout
- **Requirements:** SWR-095 · **Method:** T
- **Procedure:** At 390 × 844 (touch), 844 × 390 (touch) and 1280 × 720, check the menu and then a match in progress.
- **Pass if:** at every size:
  - there is no horizontal scroll
  - the menu sheet fits the width and the scoreboard fits the viewport
  - on touch sizes, the joystick and buttons fit the viewport

  Screenshot: `docs/verification/phone-portrait.png`.

### VC-30 — Simulation step cost
- **Requirements:** SWR-100 · **Method:** T
- **Procedure:** Time 3,600 simulation steps (60 s of play) of a Watch match.
- **Pass if:** the average is no more than 2 ms per step.

### VC-31 — Frame rate on GPU hardware (manual)
- **Requirements:** SWR-101, and the audible part of SWR-094 · **Method:** D
- **Procedure:** On a computer with a hardware GPU and speakers, open the game in Chrome with DevTools > Rendering > Frame rendering stats turned on. Play a 5-minute match.
- **Pass if:** the frame rate stays at or near 60 fps during play, and the whistle, kicks and crowd are heard. M silences them and pressing M again restores them.

### VC-32 — Simulated computer-vs-computer matches
- **Requirements:** SWR-032, SWR-061, SWR-073, SWR-082 · **Method:** A
- **Procedure:** Play 10 Watch matches of 5 minutes. Count:
  - shots, and goals from those shots
  - ground and lofted passes, and how many reach the intended receiver
  - sliding tackles, offsides, fouls and cards
- **Pass if:**
  - shot conversion is 10–30%
  - ground-pass completion is at least 75% and lofted-pass completion at least 65%
  - there is at least 1 sliding tackle per match and at most 2 offsides per match on average

### VC-33 — Scripted-user pass completion
- **Requirements:** SWR-073 · **Method:** A
- **Procedure:** Play 6 matches of 5 minutes as Harbor City with a scripted user, who:
  - holds the forward key while dribbling
  - presses J every 0.7–1.7 s when in possession
  - keeps holding forward for 0.5 s after each pass
- **Pass if:** at least 70% of the scripted user's ground passes reach the intended receiver.

### VC-34 — No script errors across the whole run
- **Requirements:** SWR-003 · **Method:** T
- **Procedure:** Record every uncaught error and console error on every page throughout the run, apart from the blocked web-font requests. The run includes 16 complete 5-minute matches.
- **Pass if:** none are recorded.

## 3. Traceability

| Requirement | Cases |
| --- | --- |
| SWR-001 | VC-01 |
| SWR-002 | VC-01 |
| SWR-003 | VC-34 |
| SWR-010 | VC-02 |
| SWR-011 | VC-03 |
| SWR-012 | VC-04 |
| SWR-020 | VC-05 |
| SWR-021 | VC-05 |
| SWR-022 | VC-06 |
| SWR-023 | VC-07 |
| SWR-024 | VC-08 |
| SWR-025 | VC-09 |
| SWR-026 | VC-10 |
| SWR-030 | VC-11, VC-12 |
| SWR-031 | VC-11 |
| SWR-032 | VC-32 |
| SWR-040 | VC-13 |
| SWR-041 | VC-14, VC-15 |
| SWR-042 | VC-14, VC-15 |
| SWR-043 | VC-16 |
| SWR-044 | VC-17 |
| SWR-045 | VC-06, VC-16, VC-17 |
| SWR-050 | VC-18 |
| SWR-060 | VC-19 |
| SWR-061 | VC-32 |
| SWR-070 | VC-21 |
| SWR-071 | VC-20 |
| SWR-072 | VC-22 |
| SWR-073 | VC-32, VC-33 |
| SWR-080 | VC-23 |
| SWR-081 | VC-23 |
| SWR-082 | VC-32 |
| SWR-090 | VC-24 |
| SWR-091 | VC-25 |
| SWR-092 | VC-26 |
| SWR-093 | VC-27 |
| SWR-094 | VC-28, VC-31 |
| SWR-095 | VC-29 |
| SWR-100 | VC-30 |
| SWR-101 | VC-31 |
