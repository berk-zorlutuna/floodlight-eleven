# Floodlight Eleven

A 3D, 11-a-side football (soccer) game that runs in the browser. Harbor City host Northvale under the floodlights, both in a 4-4-2.

Everything is in one file, `floodlight-eleven.html`. It uses [three.js](https://threejs.org/) r128 from a CDN and has no build step.

## Play

Open `floodlight-eleven.html` in a browser, or serve the folder:

```bash
python -m http.server 8765
```

Then open <http://localhost:8765/floodlight-eleven.html>.

## Controls

| Key | Action |
| --- | --- |
| WASD / arrow keys | Move the highlighted player |
| Shift | Sprint |
| J or Z | Pass in the held direction; tackle without the ball (mistimed tackles and tackles from behind risk a foul and a card) |
| K or X (hold) | Charge and release to shoot; hold up or down to pick a corner |
| K or X (defending) | Sliding tackle when the other side has the ball; from behind it is usually a foul |
| L or C | Lofted pass or cross |
| I | Through ball into space ahead of a runner |
| O | Skill move: a quick turn that beats a close defender |
| Space or Q | Switch to the player nearest the ball |
| V / M / P | Camera angle / sound / pause (substitutions are in the pause menu) |

On a phone there is an on-screen joystick with large SHOOT, PASS and THRU buttons and smaller LOB, SKILL, SPRINT and SWITCH buttons; SHOOT becomes SLIDE while defending. Hold the phone sideways.

When a pass is played to you, your player runs onto the ball by himself; push the stick firmly away from the ball to break off.

## Career mode

Press **CAREER MODE** on the start screen to found your own club:

- **Club identity:** name, short name, crest (shape, pattern, colours, letters), and home and away kits
- **Six divisions:** from Division 5 to the Elite Division. A season is 14 league matchdays against seven rivals, plus the 8-club Floodlight Cup. The top two go up and the bottom two go down.
- **Play or simulate:** every fixture can be played in 3D, or simulated
- **Squad:** named players with seven ratings that change how they play. Choose a formation (4-4-2, 4-3-3, 4-2-3-1, 3-5-2, 5-3-2), your starting eleven and five substitutes.
- **Coins:** earned from results, goals and home gates, and spent on the transfer market or on expanding the stadium from 2,000 to 48,000 seats
- **Players change over time:** young players improve, older ones decline and retire, and youth players join
- **Saving:** progress is saved in the browser automatically, and can be exported to a file and imported again

## Features

- Computer-controlled teammates and opponents that hold shape, press, pass, cross and shoot
- Goalkeepers that position, dive, catch and parry
- Through balls, skill moves, player stamina and substitutions, and a name tag over your player
- Sliding tackles for you and the computer defenders
- Ball physics with bounces, rolling friction, posts and crossbar
- Throw-ins, corners, goal kicks, kick-offs, half time and full time
- Offside, judged at the moment of the pass and flagged when the offside player receives the ball
- Fouls with free kicks and penalties, yellow cards, second yellows and straight reds; a sent-off player leaves the pitch for the rest of the match
- Scoreboard, match clock, mini-map and shot-power bar
- Choice of side (or watch), match length and difficulty

## Requirements and verification

| Document | Contents |
| --- | --- |
| [System Requirements](docs/SYSTEM_REQUIREMENTS.md) | What the game must do, as seen by a player (SYS-01 to SYS-25) |
| [Software Requirements](docs/SOFTWARE_REQUIREMENTS.md) | Measurable software behaviour, traced to the system requirements (SWR-001 to SWR-144) |
| [Verification Cases](docs/VERIFICATION_CASES.md) | How each software requirement is verified (VC-01 to VC-50) |
| [Verification Results](docs/VERIFICATION_RESULTS.md) | Latest run: result and evidence per case, requirement coverage, defects found |

The automated cases run in headless Chromium:

```bash
npm install        # three.js r128, so the run works offline
npm run verify     # needs Playwright with Chromium
```

The run rewrites `docs/VERIFICATION_RESULTS.md` and `docs/verification/results.json`, and saves screenshots in `docs/verification/`. It exits with a non-zero code if any case fails.
