#!/usr/bin/env node
// Floodlight Eleven — automated software verification.
// Runs the verification cases in docs/VERIFICATION_CASES.md against floodlight-eleven.html
// in headless Chromium and writes docs/VERIFICATION_RESULTS.md and docs/verification/results.json.
//
//   npm install          (fetches three.js r128 so the run works offline)
//   npm run verify       (needs Playwright with Chromium: npm i -D playwright && npx playwright install chromium)
//
// Environment: VERIFY_SEED (default 20261117) seeds Math.random so runs are repeatable.
'use strict';
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const GAME = path.join(ROOT, 'floodlight-eleven.html');
const OUT_DIR = path.join(ROOT, 'docs', 'verification');
const SEED = +(process.env.VERIFY_SEED || 20261117);
const CDN = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
let THREE_LOCAL = null;
try { THREE_LOCAL = require.resolve('three/build/three.min.js', { paths: [ROOT] }); } catch (e) { /* use the CDN */ }

const SEED_SCRIPT = `(()=>{let a=${SEED}>>>0;Math.random=function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};})();`;

// helpers installed in the page after load (window.T)
const HELPERS = `window.T=(()=>{const fe=window.__fe;fe.hold=true;const T={tick:0,ev:[]};
fe.onEvent=(k,d)=>T.ev.push({k,p:d.p,q:d.q,lob:d.lob,tick:T.tick});
T.step=n=>{for(let i=0;i<n;i++){fe.step(1);T.tick++;}};
T.start=(side=-1,len=300,diff=1)=>{fe.toMenu();const c=(o,v)=>document.querySelector('[data-opt='+o+'] [data-v="'+v+'"]').click();c('side',side);c('len',len);c('diff',diff);document.querySelector('#start').click();T.ev.length=0;};
T.toPlay=(max=3000)=>{let n=0;while(fe.state!=='play'&&n++<max)T.step(1);return fe.state==='play';};
T.until=(fn,max=600)=>{let n=0;while(!fn()&&n++<max)T.step(1);return !!fn();};
T.park=(keep=[])=>{let i=0;for(const p of fe.all){if(keep.includes(p))continue;const s=i%2?1:-1;p.x=s*(10+(i%10)*3.5);p.z=(i<11?1:-1)*(23+i%5);p.vx=p.vz=p.dvx=p.dvz=0;p.receiving=0;i++;}};
T.reset=()=>{for(const p of fe.all){p.stun=0;p.cool=0;p.slideT=0;p.slideCD=0;p.diveT=0;p.diveCD=0;p.receiving=0;p.tackleCD=0;p.vx=p.vz=p.dvx=p.dvz=0;}};
T.key=(code,down=true)=>window.dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code}));
T.press=code=>{T.key(code,true);T.key(code,false);};
T.banner=()=>document.querySelector('#banner').textContent;
T.give=(p,decide=10)=>{const b=fe.ball;b.owner=p;b.lock=null;b.gkick=false;b.inNet=false;b.x=p.x+Math.sin(p.fa)*0.5;b.z=p.z+Math.cos(p.fa)*0.5;b.y=0.17;b.vx=b.vy=b.vz=0;b.lastTouch=p.team;p.decideT=decide;};
T.loose=o=>Object.assign(fe.ball,{owner:null,lock:null,inNet:false,gkick:false,vx:0,vy:0,vz:0,y:0.17},o);
T.face=(p,dx,dz)=>{p.fa=Math.atan2(dx,dz);};
return T;})();`;

const results = [];
const pageErrors = [];
let browser;

async function newPage(opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, ...opts });
  await ctx.addInitScript(SEED_SCRIPT);
  if (opts.initScript) await ctx.addInitScript(opts.initScript);
  const pg = await ctx.newPage();
  pg.on('pageerror', e => pageErrors.push(`${e.message}`));
  pg.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) pageErrors.push(m.text()); });
  if (THREE_LOCAL) await pg.route(CDN, r => r.fulfill({ path: THREE_LOCAL, contentType: 'text/javascript' }));
  await pg.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await pg.goto('file://' + GAME);
  await pg.waitForFunction(() => window.__fe && window.THREE);
  await pg.addScriptTag({ content: HELPERS });
  return pg;
}

const pct = (a, b) => (b ? (100 * a / b).toFixed(1) + '%' : 'n/a');

// ---------------------------------------------------------------- cases
function cases(pg) {
  const ev = (fn, arg) => pg.evaluate(fn, arg);
  return [
    { id: 'VC-01', title: 'Start-up, delivery and start menu', reqs: ['SWR-001', 'SWR-002'], method: 'T, I', async run() {
      const r = await ev(() => { const q = s => document.querySelector(s); const pr = o => q(`[data-opt=${o}] [aria-pressed=true]`).dataset.v; const lab = o => [...document.querySelectorAll(`[data-opt=${o}] button`)].map(b => b.textContent);
        return { rev: THREE.REVISION, scripts: [...document.scripts].filter(s => s.src).map(s => s.src), styles: [...document.querySelectorAll('link[rel=stylesheet]')].map(l => l.href), menu: !q('#menu').hidden, def: [pr('side'), pr('len'), pr('diff')], side: lab('side'), len: lab('len'), diff: lab('diff'), go: q('#start').textContent }; });
      const htmlFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
      const ok = r.rev === '128' && r.scripts.length === 1 && r.scripts[0] === CDN && r.styles.every(h => h.startsWith('https://fonts.googleapis.com/')) && r.menu && r.def.join() === '0,300,1'
        && r.side.join() === 'Harbor City,Northvale,Watch' && r.len.join() === '3 min,5 min,8 min' && r.diff.join() === 'Easy,Normal,Hard' && r.go === 'KICK OFF' && htmlFiles.length === 1;
      return { pass: ok, evidence: `Repository has ${htmlFiles.length} HTML file (${htmlFiles.join()}); one external script (${r.scripts.join()}), three.js REVISION ${r.rev}; stylesheets only from Google Fonts. Menu shown on load. Defaults side=${r.def[0]} (Harbor City), len=${r.def[1]} s, diff=${r.def[2]} (Normal). Options: ${r.side.join(' / ')}; ${r.len.join(' / ')}; ${r.diff.join(' / ')}; button "${r.go}".` };
    } },
    { id: 'VC-02', title: 'Pitch and goal dimensions', reqs: ['SWR-010'], method: 'T', async run() {
      const d = await ev(() => window.__fe.dims);
      const L = 2 * d.HL, W = 2 * d.HW, gw = 2 * d.GW, bw = 2 * d.BOX_W;
      const near = (a, b) => Math.abs(a - b) < 1e-6;
      return { pass: near(L, 105) && near(W, 68) && near(gw, 7.32) && near(d.GH, 2.44) && near(d.BOX_D, 16.5) && near(bw, 40.32),
        evidence: `Pitch ${L} × ${W}; goal ${gw.toFixed(2)} × ${d.GH}; penalty area ${d.BOX_D} deep × ${bw.toFixed(2)} wide.` };
    } },
    { id: 'VC-03', title: 'Squads and 4-4-2 formation', reqs: ['SWR-011'], method: 'T', async run() {
      const r = await ev(() => { T.start(-1); return window.__fe.teams.map(t => ({ name: t.name, n: t.players.length, roles: ['GK', 'DF', 'MF', 'FW'].map(k => t.players.filter(p => p.role === k).length).join('-'), nums: t.players.map(p => p.num).sort((a, b) => a - b).join(',') })); });
      const ok = r.every(t => t.n === 11 && t.roles === '1-4-4-2' && t.nums === '1,2,3,4,5,6,7,8,9,10,11');
      return { pass: ok, evidence: r.map(t => `${t.name}: ${t.n} players, GK-DF-MF-FW ${t.roles}, numbers ${t.nums}`).join('; ') };
    } },
    { id: 'VC-04', title: 'Controlled player assignment', reqs: ['SWR-012'], method: 'T', async run() {
      const r = await ev(() => { const fe = window.__fe; T.start(-1); T.toPlay(); T.step(900); const watch = { human: fe.humanTeam, ctrl: fe.ctrl };
        T.start(1); T.toPlay(); let samples = 0, bad = 0;
        for (let i = 0; i < 200; i++) { T.step(30); if (fe.state === 'fulltime') break; samples++; const c = fe.ctrl; if (!c || c.team !== fe.teams[1] || c.role === 'GK' || c.off) bad++; }
        return { watchHuman: watch.human === null, watchCtrl: watch.ctrl === null, samples, bad }; });
      return { pass: r.watchHuman && r.watchCtrl && r.bad === 0 && r.samples > 100,
        evidence: `Watch mode: user team ${r.watchHuman ? 'none' : 'SET'}, controlled player ${r.watchCtrl ? 'none' : 'SET'}. Playing as Northvale: ${r.samples} samples over ${(r.samples * 0.5).toFixed(0)} s of play, ${r.bad} with no controlled player, wrong team or the goalkeeper.` };
    } },
    { id: 'VC-05', title: 'Match clock, half time and change of ends', reqs: ['SWR-020', 'SWR-021'], method: 'T', async run() {
      const r = await ev(() => { const fe = window.__fe; T.start(-1, 180); const dir0 = fe.teams.map(t => t.dir); T.toPlay(); const ko1 = fe.ball.owner && fe.ball.owner.team.short;
        let frozenBad = 0, nonPlaySteps = 0, ht = null;
        while (fe.half === 1 && fe.state !== 'fulltime') { const c0 = fe.clock, s0 = fe.state; T.step(1); if (s0 !== 'play') { nonPlaySteps++; if (fe.clock !== c0) frozenBad++; } if (fe.state === 'halftime' && !ht) ht = { clock: fe.clock, min: fe.gameMin() }; }
        T.toPlay(); return { ko1, ko2: fe.ball.owner && fe.ball.owner.team.short, dir0, dir1: fe.teams.map(t => t.dir), ht, frozenBad, nonPlaySteps, len: fe.matchLen }; });
      const ok = r.ht && Math.abs(r.ht.clock - 90) < 0.05 && r.ht.min >= 45 && r.ht.min < 45.05 && r.frozenBad === 0 && r.dir1[0] === -r.dir0[0] && r.dir1[1] === -r.dir0[1] && r.ko1 && r.ko2 && r.ko1 !== r.ko2;
      return { pass: !!ok, evidence: `3-minute match (L=${r.len} s). Half time at ${r.ht && r.ht.clock.toFixed(2)} s of play = ${r.ht && r.ht.min.toFixed(2)}'. Clock moved in ${r.frozenBad} of ${r.nonPlaySteps} steps with the ball out of play. Attacking directions ${r.dir0.join('/')} → ${r.dir1.join('/')}. First-half kick-off ${r.ko1}, second-half kick-off ${r.ko2}.` };
    } },
    { id: 'VC-06', title: 'Full time, result screen and replay reset', reqs: ['SWR-022', 'SWR-045'], method: 'T', async run() {
      const r = await ev(() => { const fe = window.__fe; T.start(-1, 180); T.toPlay(); T.until(() => fe.gameMin() > 60, 20000); T.toPlay();
        const B = fe.teams[1], q = B.players[3], c = fe.teams[0].players[6]; c.x = 0; c.z = 0; q.x = 0.8; q.z = 0; q.yellows = 1; q.fouls = 2; fe.foul(q, c, false); const sentOff = q.off;
        T.until(() => fe.state === 'fulltime', 40000);
        const q$ = s => document.querySelector(s); const ft = { clock: fe.clock, min: fe.gameMin(), shown: !q$('#ft').hidden, score: q$('#ftS').textContent, expect: `${fe.teams[0].score}–${fe.teams[1].score}`, line: q$('#ftLine').textContent };
        q$('#again').click(); const after = { score: fe.teams.map(t => t.score).join('-'), sizes: fe.teams.map(t => t.players.length).join('/'), all: fe.all.length, cards: fe.teams.map(t => t.yel + t.reds).join('/'), markers: q$('#hr').children.length + q$('#ar').children.length, state: fe.state };
        return { sentOff, ft, after }; });
      const ok = r.sentOff && Math.abs(r.ft.clock - 180) < 0.05 && Math.abs(r.ft.min - 90) < 1e-6 && r.ft.shown && r.ft.score === r.ft.expect && r.ft.line.length > 10 && /Cards:/.test(r.ft.line)
        && r.after.score === '0-0' && r.after.sizes === '11/11' && r.after.all === 22 && r.after.cards === '0/0' && r.after.markers === 0;
      return { pass: !!ok, evidence: `Full time at ${r.ft.clock.toFixed(2)} s of play (${r.ft.min}'); full-time screen ${r.ft.shown ? 'shown' : 'NOT shown'} with ${r.ft.score} (expected ${r.ft.expect}) and "${r.ft.line}". Player sent off before full time: ${r.sentOff}. After PLAY AGAIN: score ${r.after.score}, squads ${r.after.sizes} (${r.after.all} players), cards ${r.after.cards}, red markers ${r.after.markers}, state ${r.after.state}.` };
    } },
    { id: 'VC-07', title: 'Kick-off positions', reqs: ['SWR-023'], method: 'T', async run() {
      const r = await ev(() => { const fe = window.__fe; const check = () => { const b = fe.ball; let own = 0, minOpp = 1e9; const kt = fe.ball.owner ? fe.ball.owner.team : null;
          for (const p of fe.all) { if (p.x * p.team.dir > 0.01) own++; if (kt && p.team !== kt) minOpp = Math.min(minOpp, Math.hypot(p.x - b.x, p.z - b.z)); }
          return { own, minOpp, ball: Math.hypot(b.x, b.z) }; };
        T.start(-1); T.toPlay(); const a = check(); a.ball = 0; // ball is on the spot until the taker moves it
        T.reset(); T.park([]); const A = fe.teams[0]; fe.teams[1].players[0].cool = 99; T.loose({ x: A.dir * 49, z: 0, y: 0.5, vx: A.dir * 15, lastTouch: A });
        T.until(() => fe.state === 'goal', 200); fe.teams[1].players[0].cool = 0; let snap = null;
        T.until(() => { if (fe.state === 'kickoff') { const pre = fe.state; T.step(1); if (fe.state === 'play') snap = check(); return snap; } return false; }, 600);
        return { first: a, afterGoal: snap }; });
      const g = c => c && c.own === 0 && c.minOpp >= 9.15;
      return { pass: g(r.first) && g(r.afterGoal), evidence: `Opening kick-off: ${r.first.own} players outside their own half, nearest opponent ${r.first.minOpp.toFixed(2)} from the ball. Kick-off after a goal: ${r.afterGoal ? `${r.afterGoal.own} outside own half, nearest opponent ${r.afterGoal.minOpp.toFixed(2)}, ball ${r.afterGoal.ball.toFixed(2)} from the centre spot` : 'not reached'}.` };
    } },
    { id: 'VC-08', title: 'Goal scored, over the bar, restart', reqs: ['SWR-024'], method: 'T', async run() {
      const r = await ev(() => { const fe = window.__fe, HL = fe.dims.HL; T.start(-1); T.toPlay(); T.reset(); T.park([]); const A = fe.teams[0], B = fe.teams[1], gk = B.players[0]; gk.cool = 99;
        const s0 = A.score; T.loose({ x: A.dir * (HL - 3), z: 1, y: 0.5, vx: A.dir * 15, lastTouch: A }); T.until(() => fe.state !== 'play', 120);
        const g = { state: fe.state, delta: A.score - s0, inNet: fe.ball.inNet };
        T.until(() => fe.state === 'play', 900); const ko = { by: fe.ball.owner && fe.ball.owner.team.short, dist: Math.hypot(fe.ball.x, fe.ball.z) };
        T.reset(); T.park([]); gk.cool = 99; const s1 = A.score; T.loose({ x: A.dir * (HL - 3), z: 0, y: 3.2, vx: A.dir * 15, lastTouch: A }); T.until(() => fe.state !== 'play', 120);
        const bar = { state: fe.state, type: fe.restart && fe.restart.type, delta: A.score - s1 }; gk.cool = 0;
        return { g, ko, bar, conceded: B.short }; });
      const ok = r.g.state === 'goal' && r.g.delta === 1 && r.ko.by === r.conceded && r.ko.dist < 1.2 && r.bar.delta === 0 && r.bar.type === 'goalkick';
      return { pass: ok, evidence: `Ball under the bar: state "${r.g.state}", score +${r.g.delta}. Restart: kick-off by ${r.ko.by} (team that conceded: ${r.conceded}), ball ${r.ko.dist.toFixed(2)} from the centre spot. Ball over the bar (y=3.2): score +${r.bar.delta}, restart "${r.bar.type}".` };
    } },
    { id: 'VC-09', title: 'Throw-in', reqs: ['SWR-025'], method: 'T', async run() {
      const r = await ev(() => { const fe = window.__fe, HW = fe.dims.HW; const out = []; for (const [lt, zs] of [[0, 1], [1, -1]]) { T.start(-1); T.toPlay(); T.reset(); T.park([]); const L = fe.teams[lt];
          T.loose({ x: 10, z: zs * (HW - 0.5), y: 0.2, vz: zs * 8, lastTouch: L }); T.until(() => fe.state !== 'play', 120); const rs = fe.restart;
          out.push({ last: L.short, type: rs && rs.type, team: rs && rs.team.short, x: fe.ball.x, z: fe.ball.z, expectTeam: L.opp.short, taker: rs && rs.taker.team.short }); }
        return { out, HW }; });
      const ok = r.out.every(o => o.type === 'throw' && o.team === o.expectTeam && o.taker === o.expectTeam && Math.abs(o.x - 10) < 1.5 && Math.abs(Math.abs(o.z) - (r.HW - 0.4)) < 0.01);
      return { pass: ok, evidence: r.out.map(o => `last touch ${o.last} → ${o.type} to ${o.team} (taker ${o.taker}) at x=${o.x.toFixed(2)}, z=${o.z.toFixed(2)}`).join('; ') + '. Crossing point x≈10.' };
    } },
    { id: 'VC-10', title: 'Corner kick and goal kick', reqs: ['SWR-026'], method: 'T', async run() {
      const r = await ev(() => { const fe = window.__fe, HL = fe.dims.HL, HW = fe.dims.HW; const out = {};
        for (const who of ['def', 'att']) { T.start(-1); T.toPlay(); T.reset(); T.park([]); const def = fe.teams.find(t => t.dir === -1), att = def.opp;
          T.loose({ x: HL - 1, z: 10, y: 0.3, vx: 10, lastTouch: who === 'def' ? def : att }); T.until(() => fe.state !== 'play', 120); const rs = fe.restart;
          const o = { type: rs && rs.type, team: rs && rs.team.short, x: fe.ball.x, z: fe.ball.z, def: def.short, att: att.short, takerGK: rs && rs.taker === def.players[0] };
          if (who === 'att') { T.until(() => fe.state === 'play', 300); o.gkHasBall = fe.ball.owner === def.players[0]; }
          out[who] = o; }
        return { out, HL, HW }; });
      const d = r.out.def, a = r.out.att;
      const ok = d.type === 'corner' && d.team === d.att && Math.abs(d.x - (r.HL - 0.4)) < 0.01 && Math.abs(d.z - (r.HW - 0.4)) < 0.01 && a.type === 'goalkick' && a.team === a.def && a.takerGK && a.gkHasBall;
      return { pass: ok, evidence: `Over the goal line at z=10, last touch by defenders (${d.def}) → ${d.type} to ${d.team} at (${d.x.toFixed(2)}, ${d.z.toFixed(2)}). Last touch by attackers (${a.att}) → ${a.type} to ${a.team}, taker is the goalkeeper: ${a.takerGK}, goalkeeper has the ball when it is taken: ${a.gkHasBall}.` };
    } },
    { id: 'VC-11', title: 'Offside offence penalised', reqs: ['SWR-030', 'SWR-031'], method: 'T', async run() {
      const r = await ev(() => { T.start(-1); return [offsideRun({ px: 12, rx: 34, defX: 26 }), offsideRun({ px: 12, rx: 30, defX: 26, z: 6 })]; });
      const ok = r.every(o => o.state === 'restart' && o.type === 'freekick' && o.rteamIsDef && o.offs === 1 && /OFFSIDE/.test(o.banner));
      return { pass: ok, evidence: r.map(o => `Receiver ${o.rx} m vs second-last defender ${o.defX} m, ball at ${o.px} m → state "${o.state}", restart "${o.type}" to defending team: ${o.rteamIsDef}, offside count +${o.offs}, banner "${o.banner}"`).join('. ') + '.' };
    } },
    { id: 'VC-12', title: 'No offside: onside, own half, throw-in', reqs: ['SWR-030'], method: 'T', async run() {
      const r = await ev(() => { T.start(-1); return { onside: offsideRun({ px: 12, rx: 22, defX: 26 }), ownHalf: offsideRun({ px: -25, rx: -5, defX: -10 }), throwIn: offsideRun({ px: 12, rx: 34, defX: 26, lock: 'throw' }), corner: offsideRun({ px: 12, rx: 34, defX: 26, lock: 'corner' }) }; });
      const ok = Object.values(r).every(o => o.owner === 'receiver' && o.offs === 0);
      return { pass: ok, evidence: Object.entries(r).map(([k, o]) => `${k}: receiver ${o.rx}, line ${o.defX}, ball ${o.px}${o.lock ? ', from ' + o.lock : ''} → ball won by ${o.owner}, offside +${o.offs}`).join('; ') + '.' };
    } },
    { id: 'VC-13', title: 'Standing-tackle fouls by direction', reqs: ['SWR-040'], method: 'T', async run() {
      const r = await ev(() => { const fe = window.__fe; T.start(0); const res = {};
        for (const mode of ['front', 'behind']) { let n = 0, foul = 0, won = 0;
          for (let i = 0; i < 60; i++) { T.toPlay(); T.reset(); const A = fe.teams[0], B = fe.teams[1], c = B.players[6]; const me = A.players[6]; T.park([c, me]);
            c.x = 0; c.z = 0; T.face(c, 1, 0); c.stun = 5; T.give(c); me.z = 0; me.x = mode === 'front' ? 1.25 : -1.25; T.face(me, mode === 'front' ? -1 : 1, 0);
            T.step(1); if (fe.ctrl !== me) continue; const f0 = A.fouls; T.press('KeyJ'); T.step(2); n++; if (A.fouls > f0) foul++; else if (fe.ball.owner === me) won++; }
          res[mode] = { n, foul, won }; }
        return res; });
      const f = r.front.foul / r.front.n, b = r.behind.foul / r.behind.n;
      return { pass: r.front.n >= 40 && r.behind.n >= 40 && b > f + 0.15 && f <= 0.25, evidence: `From the front: ${r.front.foul}/${r.front.n} fouls (${pct(r.front.foul, r.front.n)}), ${r.front.won} balls won. From behind: ${r.behind.foul}/${r.behind.n} fouls (${pct(r.behind.foul, r.behind.n)}), ${r.behind.won} balls won.` };
    } },
    { id: 'VC-14', title: 'Free kick: award, wall distance, kick taken', reqs: ['SWR-041', 'SWR-042'], method: 'T', async run() {
      const r = await ev(() => { const fe = window.__fe; T.start(-1); const out = [];
        for (let i = 0; i < 5; i++) { T.toPlay(); T.reset(); const A = fe.teams[0], B = fe.teams[1], c = A.players[6], q = B.players[6]; const near = B.players.slice(2, 6); T.park([c, q, ...near]);
          c.x = A.dir * 5; c.z = 8 - i * 4; q.x = c.x - A.dir * 0.8; q.z = c.z; near.forEach((p, k) => { p.x = c.x + A.dir * (2 + k); p.z = c.z + (k % 2 ? 2 : -2); });
          const fx = c.x, fz = c.z; fe.foul(q, c, false); const rs = fe.restart; const o = { type: rs.type, team: rs.team === A, dSpot: Math.hypot(fe.ball.x - fx, fe.ball.z - fz) };
          let minD = 1e9; const taker = rs.taker; T.until(() => { if (fe.state !== 'restart') return true; minD = 1e9; for (const p of B.players) minD = Math.min(minD, Math.hypot(p.x - fe.ball.x, p.z - fe.ball.z)); return false; }, 600);
          o.minD = minD; const k0 = fe.ball.kickId; T.until(() => fe.ball.kickId !== k0, 240); const e = T.ev.slice(-3).reverse().find(e => e.p === taker); o.kicked = fe.ball.kickId !== k0 ? (e ? e.k : 'kick') : null; out.push(o); }
        return out; });
      const ok = r.every(o => o.type === 'freekick' && o.team && o.dSpot < 1.0 && o.minD >= 9.15 && o.kicked);
      return { pass: ok, evidence: r.map((o, i) => `#${i + 1}: ${o.type} to fouled team ${o.team}, ${o.dSpot.toFixed(2)} from foul spot, nearest opponent ${o.minD.toFixed(2)} at the kick, taker ${o.kicked || 'did NOT'} ${o.kicked ? '' : 'kick'}`).join('; ') + '.' };
    } },
    { id: 'VC-15', title: 'Penalty kick: award, spot, positions, kick taken', reqs: ['SWR-041', 'SWR-042'], method: 'T', async run() {
      const r = await ev(() => { const fe = window.__fe, HL = fe.dims.HL, BD = fe.dims.BOX_D, BW = fe.dims.BOX_W; T.start(-1); const out = [];
        for (let i = 0; i < 4; i++) { T.toPlay(); T.reset(); const A = fe.teams[0], B = fe.teams[1], c = A.players[9], q = B.players[3 + i]; T.park([c, q, B.players[0]]);
          c.x = A.dir * (HL - 8); c.z = 3 - i * 2; q.x = c.x - A.dir * 0.8; q.z = c.z; fe.foul(q, c, false); const rs = fe.restart, taker = rs.taker, gk = B.players[0];
          const o = { type: rs.type, team: rs.team === A, spotX: fe.ball.x * A.dir, spotZ: fe.ball.z };
          let inside = []; T.until(() => { if (fe.state !== 'restart') return true; inside = fe.all.filter(p => p !== taker && p !== gk && p.x * A.dir > HL - BD && Math.abs(p.z) < BW).map(p => p.team.short + p.num); return false; }, 600);
          o.inside = inside; const e0 = T.ev.length; T.until(() => T.ev.slice(e0).some(e => e.p === taker), 240); const e = T.ev.slice(e0).find(e => e.p === taker); o.kick = e ? e.k : null; out.push(o); }
        return { out, HL }; });
      const ok = r.out.every(o => o.type === 'penalty' && o.team && Math.abs(o.spotX - (r.HL - 11)) < 1e-6 && Math.abs(o.spotZ) < 1e-6 && o.inside.length === 0 && o.kick === 'shot');
      return { pass: ok, evidence: r.out.map((o, i) => `#${i + 1}: ${o.type} to fouled team ${o.team}, spot ${(r.HL - o.spotX).toFixed(2)} from goal line at z=${o.spotZ.toFixed(2)}, players inside area at kick: ${o.inside.length ? o.inside.join(',') : 'none'}, taker ${o.kick || 'did not kick'}`).join('; ') + '.' };
    } },
    { id: 'VC-16', title: 'Yellow and red cards', reqs: ['SWR-043', 'SWR-045'], method: 'T', async run() {
      const r = await ev(() => { const fe = window.__fe, HL = fe.dims.HL; T.start(-1); const A = fe.teams[0], B = fe.teams[1];
        const trial = (setup, q, tries = 6) => { let o; for (let k = 0; k < tries; k++) { T.toPlay(); T.reset(); const c = A.players[9]; setup(c); q.x = c.x - A.dir * 0.8; q.z = c.z; const pre = { y: q.yellows, f: q.fouls };
            fe.foul(q, c, false); o = { banner: T.banner(), type: fe.restart && fe.restart.type, off: q.off, yellows: q.yellows, num: q.num }; if (o.banner.includes('CARD')) break; q.yellows = pre.y; q.fouls = pre.f; } return o; };
        const coverMid = c => { T.park([c]); c.x = 0; c.z = 0; B.players.slice(1).forEach((p, k) => { if (!p.off) { p.x = A.dir * (18 + k); p.z = -10 + 2 * k; } }); };
        const alone = x => c => { T.park([c]); c.x = A.dir * x; c.z = 0; B.players.slice(1).forEach(p => { p.x = A.dir * -30; }); };
        const q1 = B.players[5]; q1.fouls = 2; const third = trial(coverMid, q1);
        const q2 = B.players[6]; q2.yellows = 1; q2.fouls = 2; const second = trial(coverMid, q2);
        const q3 = B.players[7]; const dogsoOut = trial(alone(HL - 20), q3, 1);
        const q4 = B.players[3]; const dogsoIn = trial(alone(HL - 8), q4, 1);
        return { third, second, dogsoOut, dogsoIn, team: B.name.toUpperCase() }; });
      const has = (o, s) => o.banner.includes(s) && o.banner.includes(`No. ${o.num}`) && o.banner.includes(r.team);
      const ok = has(r.third, 'YELLOW CARD') && !r.third.off && has(r.second, 'RED CARD') && r.second.banner.includes('SECOND YELLOW') && r.second.off
        && has(r.dogsoOut, 'RED CARD') && !r.dogsoOut.banner.includes('SECOND') && r.dogsoOut.off && r.dogsoOut.type === 'freekick'
        && has(r.dogsoIn, 'YELLOW CARD') && !r.dogsoIn.off && r.dogsoIn.type === 'penalty';
      const f = (k, o) => `${k}: "${o.banner}" (restart ${o.type}, sent off ${o.off})`;
      return { pass: ok, evidence: [f('Third foul', r.third), f('Foul by a player already booked', r.second), f('Last-man foul outside the area', r.dogsoOut), f('Last-man foul inside the area', r.dogsoIn)].join('; ') + '.' };
    } },
    { id: 'VC-17', title: 'Sending-off effects, minimum of seven, card display', reqs: ['SWR-044', 'SWR-045'], method: 'T, I', async run() {
      const r = await ev(() => { const fe = window.__fe, HL = fe.dims.HL; T.start(-1); const A = fe.teams[0], B = fe.teams[1];
        const red = q => { T.toPlay(); T.reset(); const c = A.players[9]; T.park([c, q]); c.x = A.dir * (HL - 20); c.z = 0; B.players.forEach(p => { if (p !== q && p.role !== 'GK') p.x = A.dir * -30; }); q.x = c.x - A.dir * 0.8; q.z = c.z; fe.foul(q, c, false); return T.banner(); };
        const first = B.players[4]; red(first); const one = { size: B.players.length, inAll: fe.all.includes(first), allLen: fe.all.length, markers: document.querySelector('#ar').children.length };
        while (B.players.length > 7) red(B.players[B.players.length - 1]);
        const extra = B.players[B.players.length - 1]; const bannerAtSeven = red(extra);
        T.toPlay(); T.press('KeyP'); const pauseText = document.querySelector('#pauseScore').textContent; T.press('KeyP');
        return { one, sevenSize: B.players.length, extraOff: extra.off, bannerAtSeven, reds: B.reds, markers: document.querySelector('#ar').children.length, pauseText, firstNum: first.num }; });
      // card shown above the player, then the sent-off player disappears: needs the real animation loop
      const vis = await pg.evaluate(async () => { const fe = window.__fe, A = fe.teams[0], B = fe.teams[1]; T.start(-1); T.toPlay(); T.reset(); const c = A.players[9], q = B.players[2]; T.park([c, q]); c.x = A.dir * (fe.dims.HL - 20); c.z = 0; B.players.forEach(p => { if (p !== q && p.role !== 'GK') p.x = A.dir * -30; }); q.x = c.x - A.dir * 0.8; q.z = c.z; fe.foul(q, c, false);
        await new Promise(r => setTimeout(r, 400)); const during = q.mesh.g.visible; await new Promise(r => setTimeout(r, 2600)); return { off: q.off, during, after: q.mesh.g.visible }; });
      await pg.screenshot({ path: path.join(OUT_DIR, 'red-card.png') }).catch(() => {});
      const ok = r.one.size === 10 && !r.one.inAll && r.one.allLen === 21 && r.one.markers === 1 && r.sevenSize === 7 && !r.extraOff && !/RED CARD/.test(r.bannerAtSeven) && r.markers === r.reds && /NOR \d+Y 4R/.test(r.pauseText) && vis.off && vis.during && !vis.after;
      return { pass: ok, evidence: `After one red: Northvale ${r.one.size} players, sent-off No. ${r.firstNum} still simulated: ${r.one.inAll}, ${r.one.allLen} players on the pitch, ${r.one.markers} red marker. At 7 players a last-man foul gave "${r.bannerAtSeven}", squad stays ${r.sevenSize}, offender sent off: ${r.extraOff}. Red markers ${r.markers} = reds ${r.reds}. Pause screen: "${r.pauseText}". Sent-off player visible while the card is shown: ${vis.during}, after 3 s: ${vis.after}. Screenshot: docs/verification/red-card.png.` };
    } },
    { id: 'VC-18', title: 'Ball physics: bounce, roll, woodwork', reqs: ['SWR-050'], method: 'T', async run() {
      const r = await ev(() => { const fe = window.__fe, HL = fe.dims.HL, GW = fe.dims.GW, GH = fe.dims.GH; T.start(-1); T.toPlay(); T.reset(); T.park([]); const freeze = () => fe.all.forEach(p => p.cool = 99); freeze(); const A = fe.teams[0];
        T.loose({ x: 0, z: 0, y: 3, lastTouch: A }); let bounced = false, peak = 0, rest = -1; for (let i = 0; i < 600; i++) { const vy0 = fe.ball.vy; T.step(1); if (!bounced && vy0 < 0 && fe.ball.vy > 0) bounced = true; if (bounced && fe.ball.vy >= 0) peak = Math.max(peak, fe.ball.y); if (fe.ball.vy === 0 && fe.ball.y <= 0.171 && rest < 0) rest = i / 60; }
        freeze(); T.loose({ x: -20, z: 0, vx: 10, lastTouch: A }); let mono = true, prev = 10, x0 = fe.ball.x; for (let i = 0; i < 900; i++) { T.step(1); const s = Math.hypot(fe.ball.vx, fe.ball.vz); if (s > prev + 1e-6) mono = false; prev = s; }
        const roll = { dist: fe.ball.x - x0, speed: prev, mono };
        freeze(); const s0 = A.score + fe.teams[1].score; T.loose({ x: A.dir * (HL - 4), z: GW, y: 1, vx: A.dir * 20, lastTouch: A }); T.step(25); const post = { vx: fe.ball.vx * A.dir, goal: A.score + fe.teams[1].score - s0 };
        if (fe.state !== 'play') T.toPlay(); freeze(); T.loose({ x: A.dir * (HL - 4), z: 0, y: GH + 0.5 * 9.81 * 0.2 * 0.2, vx: A.dir * 20, lastTouch: A }); T.step(25); const bar = { vx: fe.ball.vx * A.dir, goal: A.score + fe.teams[1].score - s0 };
        fe.all.forEach(p => p.cool = 0); return { bounced, peak, rest, roll, post, bar }; });
      const ok = r.bounced && r.peak > 0.3 && r.peak < 1.5 && r.rest > 0 && r.roll.mono && r.roll.speed < 0.05 && r.roll.dist > 5 && r.roll.dist < 30 && r.post.vx < 0 && r.post.goal === 0 && r.bar.vx < 0 && r.bar.goal === 0;
      return { pass: ok, evidence: `Dropped from 3.0: first rebound peak ${r.peak.toFixed(2)}, at rest after ${r.rest.toFixed(2)} s. Rolled at 10: speed never increased (${r.roll.mono}), stopped after ${r.roll.dist.toFixed(1)} (final speed ${r.roll.speed.toFixed(3)}). Shot at the post: rebound velocity ${r.post.vx.toFixed(1)} toward the field, goals +${r.post.goal}. Shot at the crossbar: ${r.bar.vx.toFixed(1)}, goals +${r.bar.goal}.` };
    } },
    { id: 'VC-19', title: 'Goalkeeper dives to the crossing point', reqs: ['SWR-060'], method: 'T', async run() {
      const r = await ev(() => { const fe = window.__fe, HL = fe.dims.HL, G = 9.81; T.start(-1); const out = [];
        for (const zt of [-3, -2, -1, 1, 2, 3]) { T.toPlay(); T.reset(); const A = fe.teams[0], B = fe.teams[1], gk = B.players[0]; T.park([gk]); gk.x = A.dir * (HL - 2); gk.z = 0; T.step(20);
          const sx = A.dir * (HL - 18), dx = A.dir * HL - sx, dz = zt, d = Math.hypot(dx, dz), sp = 24, Tt = d / sp; T.loose({ x: sx, z: 0, y: 1, vx: dx / d * sp, vz: dz / d * sp, vy: 0.5 * G * Tt, lastTouch: A });
          let maxZ = 0, cross = null, outcome = 'goal'; const trace = [];
          T.until(() => { trace.push(gk.z); if (!cross && (fe.ball.x - gk.x) * A.dir >= 0) cross = { zc: fe.ball.z, gz: gk.z }; if (fe.ball.owner) { outcome = 'caught'; return true; } if (fe.ball.lastTouch === B) { outcome = 'parried'; return true; } return fe.state !== 'play'; }, 120);
          if (!cross) cross = { zc: fe.ball.z, gz: gk.z }; if (outcome === 'goal' && fe.state !== 'goal') outcome = fe.state;
          const s = Math.sign(cross.zc) || 1; const over = Math.max(0, ...trace.map(z => (z - cross.zc) * s));
          out.push({ zt, gap: Math.abs(cross.gz - cross.zc), over, outcome }); }
        return out; });
      const ok = r.every(o => o.gap <= 1.9 && o.over <= 1.0);
      return { pass: ok, evidence: r.map(o => `aim z=${o.zt}: keeper ${o.gap.toFixed(2)} from the ball at the crossing, overshoot ${o.over.toFixed(2)}, ${o.outcome}`).join('; ') + '. Shots at 24 from 18 out.' };
    } },
    { id: 'VC-20', title: 'Receive assist', reqs: ['SWR-071'], method: 'T', async run() {
      const r = await ev(() => { const fe = window.__fe; T.start(0); const A = fe.teams[0], d = A.dir; const goalKey = d > 0 ? 'KeyD' : 'KeyA';
        const run = (rx, rz, key, divert) => { T.toPlay(); T.reset(); const P = A.players[6], R = A.players[9]; T.park([P, R]); P.x = 0; P.z = 0; T.face(P, d, 0); R.x = d * rx; R.z = rz; T.give(P); T.step(1);
          fe.passTo(P, R, false); if (divert) { const b = fe.ball, tx = d * divert - b.x, tz = -b.z, m = Math.hypot(tx, tz); b.vx = tx / m * 18; b.vz = tz / m * 18; }
          if (key) T.key(key, true); if (divert) { T.step(1); const o = { recv: R.receiving, dvz: R.dvz, ctrl: fe.ctrl === R }; T.key(key, false); return o; }
          T.until(() => fe.ball.owner || fe.state !== 'play', 300); if (key) T.key(key, false);
          return { ctrl: fe.ctrl === R, got: fe.ball.owner === R, recv: R.receiving }; };
        return { noKey: run(14, 8, null), holdForward: run(14, 8, goalKey), holdSide: run(14, 8, 'KeyS'), pullAway: run(10, 6, 'KeyS', 12) }; });
      const ok = ['noKey', 'holdForward', 'holdSide'].every(k => r[k].ctrl && r[k].got) && r.pullAway.recv === 0 && r.pullAway.ctrl && r.pullAway.dvz > 6;
      const f = o => `control on receiver ${o.ctrl}, ball received ${o.got}`;
      return { pass: ok, evidence: `No key held: ${f(r.noKey)}. Holding toward goal (along the pass): ${f(r.holdForward)}. Holding sideways: ${f(r.holdSide)}. Pass running across in front, user pushing away: assist cancelled ${r.pullAway.recv === 0} on the first frame and the player runs where the user pushes (target speed ${r.pullAway.dvz.toFixed(1)} in the pushed direction). After that the existing auto-switch may hand control to whoever is nearest the ball.` };
    } },
    { id: 'VC-21', title: 'Pass assist avoids blocked lanes; lofted pass', reqs: ['SWR-070'], method: 'T', async run() {
      const r = await ev(() => { const fe = window.__fe; T.start(0); const A = fe.teams[0], B = fe.teams[1], d = A.dir; const goalKey = d > 0 ? 'KeyD' : 'KeyA';
        const setup = () => { T.toPlay(); T.reset(); const P = A.players[6], X = A.players[9], Y = A.players[10], O = B.players[6]; T.park([P, X, Y, O]); P.x = 0; P.z = 0; T.face(P, d, 0); X.x = d * 15; X.z = -3; Y.x = d * 16; Y.z = 4; O.x = d * 7; O.z = -1.4; O.stun = 5; T.give(P); T.step(1); return { P, X, Y }; };
        let s = setup(); const e0 = T.ev.length; T.key(goalKey, true); T.press('KeyJ'); T.step(1); T.key(goalKey, false); const g = T.ev.slice(e0).find(e => e.k === 'pass');
        const ground = g ? { from: g.p === s.P, to: g.q === s.Y ? 'clear-lane mate' : g.q === s.X ? 'blocked-lane mate' : 'other', lob: g.lob } : null;
        s = setup(); const e1 = T.ev.length; T.key(goalKey, true); T.press('KeyL'); T.step(1); T.key(goalKey, false); const l = T.ev.slice(e1).find(e => e.k === 'pass'); const peak = (() => { let m = 0; for (let i = 0; i < 40; i++) { T.step(1); m = Math.max(m, fe.ball.y); } return m; })();
        return { ground, lob: l ? { from: l.p === s.P, lob: l.lob, peak } : null }; });
      const ok = r.ground && r.ground.from && r.ground.to === 'clear-lane mate' && r.ground.lob === false && r.lob && r.lob.from && r.lob.lob === true && r.lob.peak > 1.0 && r.lob.peak > 4 * 0.17;
      return { pass: !!ok, evidence: `Two team-mates ahead, one with an opponent in the lane. J: ${r.ground ? `ground pass to the ${r.ground.to}` : 'no pass'}. L: ${r.lob ? `lofted pass (lob flag ${r.lob.lob}), ball peak height ${r.lob.peak.toFixed(1)}` : 'no pass'}.` };
    } },
    { id: 'VC-22', title: 'Kicks are only sometimes blocked at source', reqs: ['SWR-072'], method: 'T', async run() {
      const r = await ev(() => { const fe = window.__fe; T.start(-1); const A = fe.teams[0], B = fe.teams[1], d = A.dir; let n = 0, blocked = 0;
        for (let i = 0; i < 80; i++) { T.toPlay(); T.reset(); const P = A.players[6], R = A.players[9], O = B.players[6]; T.park([P, R, O]); P.x = 0; P.z = 0; T.face(P, d, 0); R.x = d * 15; R.z = 0; O.x = d * 0.9; O.z = 0; T.give(P);
          fe.passTo(P, R, false); T.step(15); n++; if (fe.ball.owner === O) blocked++; }
        return { n, blocked }; });
      const f = r.blocked / r.n;
      return { pass: f <= 0.35 && r.blocked > 0, evidence: `Opponent 0.9 in front of the passer blocked ${r.blocked} of ${r.n} passes (${pct(r.blocked, r.n)}).` };
    } },
    { id: 'VC-23', title: 'Sliding tackle: trigger, motion, outcome', reqs: ['SWR-080', 'SWR-081'], method: 'T', async run() {
      const r = await ev(() => { const fe = window.__fe; T.start(0); const A = fe.teams[0], B = fe.teams[1]; const out = {};
        const setup = (fa, carrierIdx = 6) => { T.toPlay(); T.reset(); const c = B.players[carrierIdx], me = A.players[6]; T.park([c, me]); c.x = 0; c.z = 0; c.fa = fa; c.stun = 5; T.give(c); me.x = -2.2; me.z = 0; T.step(1); return { c, me }; };
        for (const [mode, fa] of [['front', -Math.PI / 2], ['side', 0], ['behind', Math.PI / 2]]) { const o = { n: 0, won: 0, foul: 0, yellow: 0, red: 0, kept: 0 };
          for (let i = 0; i < 40; i++) { const { c, me } = setup(fa); if (fe.ctrl !== me) continue; const f0 = A.fouls, y0 = A.yel, r0 = A.reds; T.press('KeyK'); T.step(2); if (me.slideT <= 0) continue; T.step(40); o.n++;
            if (A.fouls > f0) { o.foul++; if (A.reds > r0) o.red++; else if (A.yel > y0) o.yellow++; } else if (fe.ball.owner === c) o.kept++; else o.won++;
            A.reds = 0; A.yel = 0; for (const p of A.roster) { p.yellows = 0; p.fouls = 0; } if (A.players.length < 11) { T.start(0); } }
          out[mode] = o; }
        // motion: carrier far away so the slide runs its full course
        { T.toPlay(); T.reset(); const c = B.players[6], me = A.players[6]; T.park([c, me]); me.x = 0; me.z = 0; T.give(me); T.step(1); c.x = 8 * A.dir; c.z = 0; T.face(c, A.dir, 0); c.stun = 9; T.give(c); T.step(1); const x0 = me.x, z0 = me.z; T.press('KeyK'); T.step(1); const started = me.slideT > 0; let ticks = 0; T.until(() => { ticks++; return me.slideT <= 0; }, 120);
          const dist = Math.hypot(me.x - x0, me.z - z0), stunAfter = me.stun; T.press('KeyK'); T.step(1); const again = me.slideT > 0; out.motion = { started, dur: (ticks + 1) / 60, dist, stunAfter, again }; }
        // own team in possession: K must not slide
        { T.toPlay(); T.reset(); const me = A.players[6]; T.park([me]); me.x = 0; me.z = 0; T.give(me); T.step(1); T.key('KeyK', true); T.step(10); const slid = me.slideT > 0; T.key('KeyK', false); T.step(1); out.own = { slid, ctrlOwner: fe.ctrl === me }; }
        // opponents taking a set piece: K must not slide
        { T.toPlay(); T.reset(); const c = B.players[6], me = A.players[6]; T.park([c, me]); c.x = 0; c.z = 0; c.stun = 5; T.give(c); fe.ball.lock = 'freekick'; me.x = -2.2; me.z = 0; T.step(1); T.press('KeyK'); T.step(2); out.setPiece = { slid: me.slideT > 0 }; fe.ball.lock = null; }
        return out; });
      const m = r.motion, w = o => o.won / o.n, fl = o => o.foul / o.n;
      const ok = r.front.n >= 30 && r.side.n >= 30 && r.behind.n >= 30 && w(r.front) >= 0.8 && w(r.side) >= 0.8 && fl(r.behind) >= 0.8 && (r.behind.yellow + r.behind.red) / Math.max(1, r.behind.foul) > 0.6
        && m.started && Math.abs(m.dur - 0.65) < 0.05 && m.dist >= 2.5 && m.dist <= 4.0 && m.stunAfter >= 0.35 && !m.again && !r.own.slid && !r.setPiece.slid;
      const f = (k, o) => `${k}: ${o.n} slides, ball won ${o.won} (${pct(o.won, o.n)}), fouls ${o.foul} (${pct(o.foul, o.n)}; ${o.yellow} yellow, ${o.red} red), carrier kept ball ${o.kept}`;
      return { pass: ok, evidence: `${f('From the front', r.front)}. ${f('From the side', r.side)}. ${f('From behind', r.behind)}. Free slide: lasted ${m.dur.toFixed(2)} s, covered ${m.dist.toFixed(2)}, recovery ${m.stunAfter.toFixed(2)} s, second slide straight after: ${m.again}. K while own team has the ball: slide ${r.own.slid}. K during an opponents' free kick: slide ${r.setPiece.slid}.` };
    } },
    { id: 'VC-24', title: 'Keyboard controls', reqs: ['SWR-090'], method: 'T', async run() {
      const r = await ev(() => { const fe = window.__fe; T.start(0); const A = fe.teams[0], B = fe.teams[1], d = A.dir; const out = {}; const q = s => document.querySelector(s);
        const free = () => { T.toPlay(); T.reset(); const me = A.players[6], c = B.players[6]; T.park([me, c]); me.x = 0; me.z = 0; T.give(me); T.step(1); c.x = 0; c.z = -12; c.stun = 9; T.give(c); T.step(1); return me; };
        const move = (keys, n = 60) => { const me = free(); const x0 = me.x, z0 = me.z; keys.forEach(k => T.key(k, true)); T.step(n); keys.forEach(k => T.key(k, false)); return { dx: me.x - x0, dz: me.z - z0 }; };
        out.D = move(['KeyD']); out.Right = move(['ArrowRight']); out.W = move(['KeyW']); out.Down = move(['ArrowDown']); out.A = move(['KeyA']); out.sprint = move(['KeyD', 'ShiftLeft']);
        const withBall = () => { T.toPlay(); T.reset(); const me = A.players[6], m = A.players[9]; T.park([me, m]); me.x = 0; me.z = 0; T.face(me, d, 0); m.x = d * 14; m.z = 2; T.give(me); T.step(1); return me; };
        for (const [k, name] of [['KeyJ', 'J'], ['KeyZ', 'Z'], ['KeyL', 'L'], ['KeyC', 'C']]) { const me = withBall(); const e0 = T.ev.length; T.press(k); T.step(1); const e = T.ev.slice(e0).find(e => e.k === 'pass' && e.p === me); out[name] = e ? (e.lob ? 'lob' : 'ground') : 'none'; }
        for (const [k, name] of [['KeyK', 'K'], ['KeyX', 'X']]) { const me = withBall(); const e0 = T.ev.length; T.key(k, true); T.step(30); fe.sim(1); const bar = !q('#power').hidden && parseFloat(q('#power i').style.width) > 0; T.key(k, false); T.step(1); const e = T.ev.slice(e0).find(e => e.k === 'shot' && e.p === me); out[name] = { bar, shot: !!e }; }
        for (const [k, name] of [['Space', 'Space'], ['KeyQ', 'Q']]) { T.toPlay(); T.reset(); const c = B.players[6]; c.x = 0; c.z = 0; c.stun = 9; T.give(c); T.step(2); const before = fe.ctrl; T.press(k); T.step(1); out[name] = before && fe.ctrl && fe.ctrl !== before && fe.ctrl.team === A; }
        const cams = [q('#camtag').textContent]; for (let i = 0; i < 3; i++) { T.press('KeyV'); cams.push(q('#camtag').textContent); } out.cams = cams;
        T.press('KeyM'); const m1 = T.banner(); T.press('KeyM'); const m2 = T.banner(); out.mute = [m1, m2];
        T.press('KeyP'); const p1 = fe.paused; T.press('KeyP'); const p2 = fe.paused; T.press('Escape'); const p3 = fe.paused; T.press('Escape'); out.pause = [p1, p2, p3, fe.paused];
        return out; });
      const fw = A => A.dx > 3 && Math.abs(A.dz) < 0.5, ok = fw(r.D) && fw(r.Right) && r.W.dz < -3 && r.Down.dz > 3 && r.A.dx < -3 && r.sprint.dx > r.D.dx * 1.15
        && r.J === 'ground' && r.Z === 'ground' && r.L === 'lob' && r.C === 'lob' && r.K.bar && r.K.shot && r.X.bar && r.X.shot && r.Space && r.Q
        && r.cams.join() === 'BROADCAST CAM,PITCHSIDE CAM,TACTICAL CAM,BROADCAST CAM' && r.mute.join() === 'SOUND OFF,SOUND ON' && r.pause.join() === 'true,false,true,false';
      return { pass: !!ok, evidence: `1 s of D: ${r.D.dx.toFixed(1)} along x; →: ${r.Right.dx.toFixed(1)}; W: ${r.W.dz.toFixed(1)} along z; ↓: ${r.Down.dz.toFixed(1)}; A: ${r.A.dx.toFixed(1)}; D+Shift: ${r.sprint.dx.toFixed(1)}. J ${r.J}, Z ${r.Z}, L ${r.L}, C ${r.C} pass. K: power bar ${r.K.bar}, shot ${r.K.shot}; X: power bar ${r.X.bar}, shot ${r.X.shot}. Space switched ${r.Space}, Q switched ${r.Q}. V: ${r.cams.join(' → ')}. M: ${r.mute.join(' / ')}. P,P,Esc,Esc paused: ${r.pause.join(',')}.` };
    } },
  ];
}

// offside scenario helper installed in the page
const OFFSIDE_HELPER = `window.offsideRun=(o)=>{const fe=window.__fe,HL=fe.dims.HL;T.toPlay();T.reset();const A=fe.teams[0],B=fe.teams[1],d=A.dir;
  const P=A.players.find(p=>p.num===8),R=A.players.find(p=>p.num===9);let i=0;
  for(const p of A.players){if(p===P||p===R)continue;p.x=d*-40+(i%3);p.z=-25+i*5;i++;}
  const gk=B.players[0];gk.x=d*(HL-1);gk.z=0;let j=0;
  for(const p of B.players){if(p===gk)continue;p.x=d*o.defX;p.z=(j%2?1:-1)*(12+Math.floor(j/2)*4);j++;}
  P.x=d*o.px;P.z=0;T.face(P,d,0);R.x=d*o.rx;R.z=o.z||0;T.give(P);if(o.lock)fe.ball.lock=o.lock;
  const offs=A.offs;fe.passTo(P,R,false);T.until(()=>fe.ball.owner||fe.state!=='play',300);
  const rs=fe.restart;return {px:o.px,rx:o.rx,defX:o.defX,lock:o.lock,state:fe.state,type:rs&&rs.type,rteamIsDef:!!rs&&rs.team===B,owner:fe.ball.owner===R?'receiver':fe.ball.owner?fe.ball.owner.team.short+' '+fe.ball.owner.num:'nobody',offs:A.offs-offs,banner:T.banner()};};`;

function moreCases() {
  return [
    { id: 'VC-25', title: 'Touch controls', reqs: ['SWR-091'], method: 'T', async run() {
      const pg = await newPage({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true });
      const r = await pg.evaluate(() => { const fe = window.__fe, q = s => document.querySelector(s), vis = s => { const e = q(s); return !!e && getComputedStyle(e).display !== 'none' && !e.hidden; };
        const coarse = matchMedia('(pointer:coarse)').matches; T.start(0); T.toPlay(); fe.sim(1);
        const o = { coarse, touch: vis('#touch'), keys: vis('#keys'), radar: vis('#radar'), buttons: [...document.querySelectorAll('#tbtns button')].map(b => b.dataset.k.toUpperCase()) };
        const A = fe.teams[0], B = fe.teams[1]; T.reset(); const c = B.players[6]; c.x = 0; c.z = 0; c.stun = 9; T.give(c); T.step(2); o.defending = q('#tbtns [data-k=shoot]').textContent;
        const me = A.players[6], m = A.players[9]; T.park([me, m]); me.x = 0; me.z = 0; T.face(me, A.dir, 0); m.x = A.dir * 14; m.z = 0; T.give(me); T.step(2); o.attacking = q('#tbtns [data-k=shoot]').textContent;
        const e0 = T.ev.length; const b = q('#tbtns [data-k=pass]'); b.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); T.step(1); b.dispatchEvent(new PointerEvent('pointerup', { bubbles: true })); o.tapPass = T.ev.slice(e0).some(e => e.k === 'pass' && e.p === me);
        return o; });
      await pg.screenshot({ path: path.join(OUT_DIR, 'touch-landscape.png') }).catch(() => {});
      await pg.context().close();
      const ok = r.coarse && r.touch && !r.keys && !r.radar && r.buttons.join() === 'SWITCH,LOB,SPRINT,PASS,SHOOT' && r.defending === 'SLIDE' && r.attacking === 'SHOOT' && r.tapPass;
      return { pass: ok, evidence: `Emulated phone 844 × 390 with touch (coarse pointer ${r.coarse}). Touch controls shown ${r.touch}, keyboard hints shown ${r.keys}, mini-map shown ${r.radar}. Buttons: ${r.buttons.join(', ')}. Shoot button reads "${r.defending}" when defending, "${r.attacking}" in possession. Tapping PASS passed the ball: ${r.tapPass}. Screenshot: docs/verification/touch-landscape.png.` };
    } },
    { id: 'VC-26', title: 'Heads-up display', reqs: ['SWR-092'], method: 'T', async run(pg) {
      const r = await pg.evaluate(() => { const fe = window.__fe, q = s => document.querySelector(s), vis = s => { const e = q(s); return !!e && !e.hidden && getComputedStyle(e).display !== 'none'; };
        T.start(0); T.toPlay(); T.step(1200); fe.sim(1); const o = { board: vis('#board'), hn: q('#hn').textContent, an: q('#an').textContent, score: q('#score').textContent, expScore: `${fe.teams[0].score}–${fe.teams[1].score}`, clock: q('#clock').textContent, expClock: Math.floor(fe.gameMin()) + "'", half: q('#half').textContent, cam: vis('#camtag'), radar: vis('#radar'), keys: vis('#keys'), power: vis('#power') };
        T.start(-1); T.toPlay(); fe.sim(1); o.keysWatch = vis('#keys'); return o; });
      await pg.screenshot({ path: path.join(OUT_DIR, 'hud-desktop.png') }).catch(() => {});
      const ok = r.board && r.hn === 'HAR' && r.an === 'NOR' && r.score === r.expScore && r.clock === r.expClock && r.half === '1ST HALF' && r.cam && r.radar && r.keys && !r.power && !r.keysWatch;
      return { pass: ok, evidence: `Scoreboard shown ${r.board}: ${r.hn} ${r.score} ${r.an}, clock ${r.clock} (expected ${r.expClock}), ${r.half}. Camera label ${r.cam}, mini-map ${r.radar}, key hints ${r.keys} when playing and ${r.keysWatch} in Watch mode, power bar ${r.power} when not shooting. Screenshot: docs/verification/hud-desktop.png.` };
    } },
    { id: 'VC-27', title: 'Pause, resume, back to menu', reqs: ['SWR-093'], method: 'T', async run(pg) {
      const r = await pg.evaluate(async () => { const fe = window.__fe, q = s => document.querySelector(s), wait = ms => new Promise(r => setTimeout(r, ms));
        T.start(0); T.toPlay(); fe.hold = false; await wait(300); T.press('KeyP'); const c0 = fe.clock; await wait(1000); const o = { shown: !q('#pause').hidden, frozen: fe.clock === c0, text: q('#pauseScore').textContent };
        q('#resume').click(); const c1 = fe.clock; await wait(1000); o.hiddenAfter = q('#pause').hidden; await wait(2000); o.advanced = fe.clock - c1;
        T.press('Escape'); q('#quit').click(); o.menu = !q('#menu').hidden && q('#board').hidden; fe.hold = true; return o; });
      const ok = r.shown && r.frozen && /Harbor City \d+ – \d+ Northvale · \d+'/.test(r.text) && r.hiddenAfter && r.advanced > 0.3 && r.menu;
      return { pass: ok, evidence: `P showed the pause screen ${r.shown} ("${r.text}"); clock frozen for 1 s ${r.frozen}. RESUME hid it ${r.hiddenAfter}; the clock then advanced ${r.advanced.toFixed(2)} s of play in 3 s of real time. Esc then "Back to menu" returned to the start menu ${r.menu}.` };
    } },
    { id: 'VC-28', title: 'Audio start, whistle and mute', reqs: ['SWR-094'], method: 'T, D', async run() {
      const init = `(()=>{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;window.__audio={ctx:0,osc:0,src:0};window.AudioContext=class extends C{constructor(...a){super(...a);window.__audio.ctx++;}createOscillator(){window.__audio.osc++;return super.createOscillator();}createBufferSource(){window.__audio.src++;return super.createBufferSource();}};})();`;
      const pg = await newPage({ initScript: init });
      const r = await pg.evaluate(async () => { const fe = window.__fe, a = window.__audio, wait = ms => new Promise(r => setTimeout(r, ms)); const before = { ...a };
        document.querySelector('[data-opt=side] [data-v="0"]').click(); document.querySelector('#start').click(); const afterStart = { ...a }; T.toPlay(); const afterKick = { ...a }; T.step(600); const afterPlay = { ...a };
        T.press('KeyM'); const m1 = T.banner(); T.press('KeyM'); const m2 = T.banner(); return { before, afterStart, afterKick, afterPlay, m1, m2 }; });
      await pg.context().close();
      const ok = r.before.ctx === 0 && r.afterStart.ctx === 1 && r.afterKick.osc > r.afterStart.osc && r.afterPlay.src > r.afterKick.src && r.m1 === 'SOUND OFF' && r.m2 === 'SOUND ON';
      return { pass: ok, evidence: `Audio contexts before KICK OFF ${r.before.ctx}, after ${r.afterStart.ctx}. Oscillators (whistle) ${r.afterStart.osc} → ${r.afterKick.osc} at kick-off. Buffer sources (crowd, kicks) ${r.afterKick.src} → ${r.afterPlay.src} after 10 s of play. M: "${r.m1}", then "${r.m2}". Whether the sound is actually heard is checked by demonstration (VC-31 session).` };
    } },
    { id: 'VC-29', title: 'Responsive layout', reqs: ['SWR-095'], method: 'T', async run() {
      const out = [];
      for (const [w, h, touch] of [[390, 844, true], [844, 390, true], [1280, 720, false]]) {
        const pg = await newPage({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch });
        const r = await pg.evaluate(() => { const fe = window.__fe, q = s => document.querySelector(s), inV = s => { const e = q(s); if (!e || e.hidden || getComputedStyle(e).display === 'none') return null; const b = e.getBoundingClientRect(); return b.left >= -0.5 && b.right <= innerWidth + 0.5 && b.top >= -0.5 && b.bottom <= innerHeight + 0.5; };
          const sc = () => document.documentElement.scrollWidth <= innerWidth && document.body.scrollWidth <= innerWidth; const sheet = q('#menu .sheet').getBoundingClientRect(); const menu = { scroll: sc(), sheetFits: sheet.left >= 0 && sheet.right <= innerWidth + 0.5 };
          T.start(0); T.toPlay(); fe.sim(1); return { menu, play: { scroll: sc(), board: inV('#board'), stick: inV('#stick'), btns: inV('#tbtns') } }; });
        if (w === 390) await pg.screenshot({ path: path.join(OUT_DIR, 'phone-portrait.png') }).catch(() => {});
        await pg.context().close();
        out.push({ w, h, ...r });
      }
      const ok = out.every(o => o.menu.scroll && o.menu.sheetFits && o.play.scroll && o.play.board && (o.w === 1280 || (o.play.stick && o.play.btns)));
      return { pass: ok, evidence: out.map(o => `${o.w}×${o.h}: no horizontal scroll on menu ${o.menu.scroll} / in play ${o.play.scroll}; menu fits ${o.menu.sheetFits}; scoreboard fits ${o.play.board}${o.w === 1280 ? '' : `; joystick fits ${o.play.stick}; buttons fit ${o.play.btns}`}`).join('. ') + '. Screenshot: docs/verification/phone-portrait.png.' };
    } },
    { id: 'VC-30', title: 'Simulation step cost', reqs: ['SWR-100'], method: 'T', async run(pg) {
      const r = await pg.evaluate(() => { T.start(-1); T.toPlay(); const fe = window.__fe; T.step(120); const n = 3600, t0 = performance.now(); fe.step(n); const ms = performance.now() - t0; return { n, ms, per: ms / n }; });
      return { pass: r.per <= 2, evidence: `${r.n} steps (60 s of match time) in ${r.ms.toFixed(0)} ms of CPU: ${r.per.toFixed(3)} ms per step on the verification machine.` };
    } },
    { id: 'VC-31', title: 'Frame rate on GPU hardware', reqs: ['SWR-101', 'SWR-094'], method: 'D', manual: true, async run() {
      return { pass: null, evidence: 'Manual demonstration: play a 5-minute match on a computer with a hardware GPU and watch the browser\'s frame-rate meter (Chrome DevTools > Rendering > Frame rendering stats). Not run here: the headless verification machine has no GPU, so software-rendered frame rates would not be meaningful.' };
    } },
    { id: 'VC-32', title: 'Simulated computer-vs-computer matches', reqs: ['SWR-032', 'SWR-061', 'SWR-073', 'SWR-082'], method: 'A', async run(pg) {
      const N = 10, tot = {};
      for (let m = 0; m < N; m++) { const st = await pg.evaluate(() => matchStats(false)); for (const k in st) tot[k] = (tot[k] || 0) + st[k]; }
      const conv = tot.goals / tot.shots, gr = tot.recv_gr / tot.pass_gr, lob = tot.recv_lob / tot.pass_lob, slides = tot.slides / N, offs = tot.offs / N;
      const ok = conv >= 0.10 && conv <= 0.30 && gr >= 0.75 && lob >= 0.65 && slides >= 1 && offs <= 2;
      return { pass: ok, stats: tot, evidence: `${N} matches of 5 minutes, both teams computer-controlled. Shots ${tot.shots}, goals ${tot.goals}: conversion ${pct(tot.goals, tot.shots)} (${(tot.goals / N).toFixed(1)} goals per match). Ground passes received ${tot.recv_gr}/${tot.pass_gr} (${pct(tot.recv_gr, tot.pass_gr)}). Lofted passes received ${tot.recv_lob}/${tot.pass_lob} (${pct(tot.recv_lob, tot.pass_lob)}). Per match: sliding tackles ${slides.toFixed(1)}, offsides ${offs.toFixed(1)}, fouls ${(tot.fouls / N).toFixed(1)}, yellow cards ${(tot.yel / N).toFixed(1)}, red cards ${(tot.reds / N).toFixed(2)}.` };
    } },
    { id: 'VC-33', title: 'Scripted-user pass completion', reqs: ['SWR-073'], method: 'A', async run(pg) {
      const N = 6, tot = {};
      for (let m = 0; m < N; m++) { const st = await pg.evaluate(() => matchStats(true)); for (const k in st) tot[k] = (tot[k] || 0) + st[k]; }
      const u = tot.urecv_gr / tot.upass_gr;
      return { pass: u >= 0.70, stats: tot, evidence: `${N} matches of 5 minutes as Harbor City. The scripted user dribbles toward goal, passes with J every 0.7–1.7 s and keeps holding the forward key for 0.5 s after each pass. User ground passes received ${tot.urecv_gr}/${tot.upass_gr} (${pct(tot.urecv_gr, tot.upass_gr)}); ${tot.ulost_near || 0} lost by the receiver within 1.5 of the ball, the rest intercepted on the way.` };
    } },
  ];
}

const STATS_HELPER = `window.matchStats=(bot)=>{const fe=window.__fe;T.start(bot?0:-1,300);const st={shots:0,goals:0,pass_gr:0,recv_gr:0,pass_lob:0,recv_lob:0,upass_gr:0,urecv_gr:0,ulost_near:0,slides:0};
  let pend=null,shot=null;fe.onEvent=(k,d)=>{if(k==='pass'){const user=bot&&d.p===fe.ctrl;pend={q:d.q,t:d.p.team,lob:d.lob,user};if(user){if(!d.lob)st.upass_gr++;}else st[d.lob?'pass_lob':'pass_gr']++;}
    if(k==='shot'&&!(bot&&d.p===fe.ctrl)){st.shots++;shot={t:d.p.team};}if(k==='slide'&&!(bot&&d.p===fe.ctrl))st.slides++;};
  const key=T.key;let owner=null,state=fe.state,botT=0,held=null,holdEnd=0,t=0;
  while(fe.state!=='fulltime'&&t<60*600){fe.step(1);t++;const o=fe.ball.owner;
    if(o!==owner){owner=o;if(o&&pend){const ok=o===pend.q;if(pend.user){if(!pend.lob){if(ok)st.urecv_gr++;else if(o.team!==pend.t&&Math.hypot(pend.q.x-fe.ball.x,pend.q.z-fe.ball.z)<1.5)st.ulost_near++;}}else if(ok)st[pend.lob?'recv_lob':'recv_gr']++;pend=null;}if(o&&shot)shot=null;}
    if(fe.state!==state){state=fe.state;if(state!=='play')pend=null;if(shot&&state==='goal'&&fe.teams.find(x=>x.dir===Math.sign(fe.ball.x))===shot.t)st.goals++;shot=null;}
    if(bot){const c=fe.ctrl,dk=fe.teams[0].dir>0?'KeyD':'KeyA';if(held&&t>=holdEnd){key(held,false);held=null;}
      if(c&&fe.ball.owner===c&&fe.state==='play'&&!fe.ball.lock){botT++;if(!held){key(dk,true);held=dk;holdEnd=t+1e9;}if(botT>40+Math.random()*60){T.press('KeyJ');botT=0;holdEnd=t+30;}}else botT=0;}}
  if(held)key(held,false);fe.onEvent=(k,d)=>T.ev.push({k,p:d.p,q:d.q,lob:d.lob,tick:T.tick});
  st.offs=fe.teams[0].offs+fe.teams[1].offs;st.fouls=fe.teams[0].fouls+fe.teams[1].fouls;st.yel=fe.teams[0].yel+fe.teams[1].yel;st.reds=fe.teams[0].reds+fe.teams[1].reds;return st;};`;

// ---------------------------------------------------------------- report
function gitInfo() {
  try { return { commit: execSync('git rev-parse --short HEAD', { cwd: ROOT }).toString().trim(), dirty: execSync('git status --porcelain floodlight-eleven.html', { cwd: ROOT }).toString().trim() !== '' }; } catch (e) { return { commit: 'unknown', dirty: false }; }
}

function writeReport(meta) {
  const swrDoc = fs.readFileSync(path.join(ROOT, 'docs', 'SOFTWARE_REQUIREMENTS.md'), 'utf8');
  const swrs = [...swrDoc.matchAll(/\*\*(SWR-\d+) — ([^*]+?)\.\*\*/g)].map(m => ({ id: m[1], title: m[2] }));
  const st = r => r.pass === null ? 'NOT RUN (manual)' : r.pass ? 'PASS' : 'FAIL';
  const counts = { PASS: 0, FAIL: 0, NR: 0 }; results.forEach(r => r.pass === null ? counts.NR++ : r.pass ? counts.PASS++ : counts.FAIL++);
  const L = [];
  L.push('# Floodlight Eleven — Software Verification Results', '');
  L.push('| | |', '| --- | --- |');
  L.push('| Document | Software Verification Results |');
  L.push(`| Software under test | \`floodlight-eleven.html\` at commit \`${meta.commit}\`${meta.dirty ? ' plus uncommitted changes' : ''} |`);
  L.push(`| Run | ${meta.date} |`);
  L.push(`| Procedure | [Verification Cases](VERIFICATION_CASES.md), executed by \`tests/verify.js\` |`);
  L.push(`| Environment | Headless Chromium ${meta.browser}, Node ${process.version}, ${meta.os}; three.js r128 ${THREE_LOCAL ? 'served from the local npm package' : 'from the CDN'}; web fonts blocked |`);
  L.push(`| Random seed | ${SEED} (\`Math.random\` is seeded, so a rerun on the same code gives the same results) |`);
  L.push(`| Duration | ${meta.secs.toFixed(0)} s |`, '');
  L.push('## 1. Summary', '');
  L.push(`**${counts.PASS} passed, ${counts.FAIL} failed, ${counts.NR} not run (manual)** out of ${results.length} verification cases.`, '');
  const failed = results.filter(r => r.pass === false);
  if (failed.length) { L.push('Failed cases:', ''); failed.forEach(r => L.push(`- **${r.id}** ${r.title} (${r.reqs.join(', ')})`)); L.push(''); }
  L.push('## 2. Results by case', '');
  L.push('| Case | Title | Requirements | Method | Result |', '| --- | --- | --- | --- | --- |');
  results.forEach(r => L.push(`| [${r.id}](#${r.id.toLowerCase()}) | ${r.title} | ${r.reqs.join(', ')} | ${r.method} | **${st(r)}** |`));
  L.push('', '## 3. Requirement coverage', '');
  L.push('| Requirement | Title | Cases | Status |', '| --- | --- | --- | --- |');
  for (const s of swrs) { const rs = results.filter(r => r.reqs.includes(s.id)); const status = !rs.length ? 'NOT COVERED' : rs.some(r => r.pass === false) ? 'FAIL' : rs.every(r => r.pass === null) ? 'NOT RUN (manual)' : rs.some(r => r.pass === null) ? 'PASS (automated part); manual part not run' : 'PASS';
    L.push(`| ${s.id} | ${s.title} | ${rs.map(r => r.id).join(', ') || '—'} | ${status} |`); }
  L.push('', '## 4. Evidence', '');
  for (const r of results) { L.push(`### ${r.id}`, '', `**${r.title}** — ${r.reqs.join(', ')} — ${st(r)}`, '', r.evidence, ''); if (r.error) L.push('```', r.error, '```', ''); }
  const defects = path.join(OUT_DIR, 'defects.md');
  if (fs.existsSync(defects)) L.push(fs.readFileSync(defects, 'utf8').trim(), '');
  if (pageErrors.length) { L.push('## 6. Script errors recorded during the run', '', '```', ...pageErrors.slice(0, 50), '```', ''); }
  fs.writeFileSync(path.join(ROOT, 'docs', 'VERIFICATION_RESULTS.md'), L.join('\n'));
  fs.writeFileSync(path.join(OUT_DIR, 'results.json'), JSON.stringify({ meta, seed: SEED, results: results.map(({ run, ...r }) => r), pageErrors }, null, 2));
  return counts;
}

(async () => {
  const t0 = Date.now();
  fs.mkdirSync(OUT_DIR, { recursive: true });
  browser = await chromium.launch();
  const pg = await newPage();
  await pg.addScriptTag({ content: OFFSIDE_HELPER + STATS_HELPER });
  await pg.screenshot({ path: path.join(OUT_DIR, 'menu.png') }).catch(() => {});
  const list = [...cases(pg), ...moreCases()];
  const only = process.argv.slice(2);
  for (const c of list) {
    if (only.length && !only.includes(c.id)) continue;
    process.stdout.write(`${c.id} ${c.title} ... `);
    let res;
    try { res = await c.run(pg); } catch (e) { res = { pass: false, evidence: 'The case raised an error before completing.', error: String(e && e.stack || e).split('\n').slice(0, 6).join('\n') }; }
    results.push({ id: c.id, title: c.title, reqs: c.reqs, method: c.method, ...res });
    console.log(res.pass === null ? 'NOT RUN (manual)' : res.pass ? 'PASS' : 'FAIL');
    if (res.pass === false) console.log('   ', res.evidence, res.error || '');
  }
  if (!only.length || only.includes('VC-34')) {
    const ok = pageErrors.length === 0;
    results.push({ id: 'VC-34', title: 'No script errors across the whole run', reqs: ['SWR-003'], method: 'T', pass: ok,
      evidence: `${pageErrors.length} uncaught errors or console errors (other than blocked web-font requests) were recorded across every page and match in this run, including ${16} complete 5-minute matches and several 3-minute matches.` });
    console.log(`VC-34 No script errors ... ${ok ? 'PASS' : 'FAIL'}`);
  }
  const meta = { ...gitInfo(), date: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC', browser: browser.version(), os: `${process.platform} ${require('os').release()}`, secs: (Date.now() - t0) / 1000 };
  await browser.close();
  if (only.length) { console.log('(partial run: report not written)'); return; }
  const counts = writeReport(meta);
  console.log(`\n${counts.PASS} passed, ${counts.FAIL} failed, ${counts.NR} not run. Report: docs/VERIFICATION_RESULTS.md`);
  process.exitCode = counts.FAIL ? 1 : 0;
})();
