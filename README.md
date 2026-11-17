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
| Space or Q | Switch to the player nearest the ball |
| V / M / P | Camera angle / sound / pause |

On a phone there is an on-screen joystick and buttons; the SHOOT button becomes SLIDE while defending. Hold the phone sideways.

When a pass is played to you, your player runs onto the ball by himself; push the stick firmly away from the ball to break off.

## Features

- Computer-controlled teammates and opponents that hold shape, press, pass, cross and shoot
- Goalkeepers that position, dive, catch and parry
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
| [System Requirements](docs/SYSTEM_REQUIREMENTS.md) | What the game must do, as seen by a player (SYS-01 to SYS-21) |
| [Software Requirements](docs/SOFTWARE_REQUIREMENTS.md) | Measurable software behaviour, traced to the system requirements (SWR-001 to SWR-101) |
| [Verification Cases](docs/VERIFICATION_CASES.md) | How each software requirement is verified (VC-01 to VC-34) |
| [Verification Results](docs/VERIFICATION_RESULTS.md) | Latest run: result and evidence per case, requirement coverage, defects found |

The automated cases run in headless Chromium:

```bash
npm install        # three.js r128, so the run works offline
npm run verify     # needs Playwright with Chromium
```

The run rewrites `docs/VERIFICATION_RESULTS.md` and `docs/verification/results.json`, and saves screenshots in `docs/verification/`. It exits with a non-zero code if any case fails.
