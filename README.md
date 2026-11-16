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
| J or Z | Pass in the held direction; tackle without the ball |
| K or X (hold) | Charge and release to shoot; hold up or down to pick a corner |
| L or C | Lofted pass or cross |
| Space or Q | Switch to the player nearest the ball |
| V / M / P | Camera angle / sound / pause |

On a phone there is an on-screen joystick and buttons. Hold the phone sideways.

## Features

- Computer-controlled teammates and opponents that hold shape, press, pass, cross and shoot
- Goalkeepers that position, dive, catch and parry
- Ball physics with bounces, rolling friction, posts and crossbar
- Throw-ins, corners, goal kicks, kick-offs, half time and full time
- Scoreboard, match clock, mini-map and shot-power bar
- Choice of side (or watch), match length and difficulty
