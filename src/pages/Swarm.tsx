import { useCallback, useEffect, useRef, useState } from "react";

// Sandbox page — intentionally not linked from anywhere. Reach it at /swarm.
// An arcade shooter in the style of Galaga: enemies fly in along curved paths,
// settle into a breathing formation, then peel off to dive at the player.
// Boss enemies take two hits and can capture the player's ship with a tractor
// beam; shoot the boss while it's diving to rescue the ship for double fire.

const W = 240; // logical arcade resolution (portrait), scaled up crisply with CSS
const H = 320;
const PLAYER_Y = 296;
const DUAL_GAP = 13;

type Vec = { x: number; y: number };
type Kind = "bee" | "fly" | "boss";
type EState = "waiting" | "entering" | "homing" | "formation" | "diving" | "beam" | "dead";
type Status = "ready" | "playing" | "paused" | "over";

type Path = { pts: Vec[]; cum: number[]; len: number };

type Enemy = {
  kind: Kind;
  row: number;
  col: number;
  x: number;
  y: number;
  angle: number; // 0 = facing down
  hp: number;
  state: EState;
  delay: number;
  entry: Path;
  path: Path | null;
  pd: number; // distance travelled along path
  pi: number; // segment index hint
  speed: number;
  fireYs: number[];
  capture: boolean; // current dive is a tractor beam dive
  beamT: number;
  captive: { x: number; y: number; rising: boolean } | null;
};

type Game = {
  t: number;
  stage: number;
  score: number;
  lives: number; // ships remaining, including the one in play
  enemies: Enemy[];
  bullets: Vec[];
  ebullets: { x: number; y: number; vx: number; vy: number }[];
  parts: { x: number; y: number; vx: number; vy: number; life: number; color: string }[];
  stars: { x: number; y: number; v: number; c: string; p: number }[];
  player: {
    x: number;
    state: "alive" | "dead" | "captured";
    dual: boolean;
    respawnT: number;
    invuln: number;
    cooldown: number;
  };
  rescue: { x: number; y: number; a: number } | null;
  diveT: number;
  stageT: number; // countdown before the next stage starts
  overT: number; // countdown before showing game over
};

// --- Sprites -------------------------------------------------------------

const PALETTE: Record<string, string> = {
  w: "#ffffff",
  r: "#ef4444",
  b: "#3b82f6",
  y: "#facc15",
  g: "#34d399",
  p: "#c084fc",
  o: "#fb923c",
};

const SPRITES = {
  player: [
    ".....w.....",
    ".....w.....",
    "....www....",
    "....www....",
    ".r..wbw..r.",
    ".r.wwbww.r.",
    ".wwwwwwwww.",
    "wwwrwwwrwww",
    "ww.rr.rr.ww",
    "w..r...r..w",
  ],
  bee: [
    [
      "b.........b",
      ".b..yyy..b.",
      "..byyyyyb..",
      "...yybyy...",
      "..yyybyyy..",
      "...yybyy...",
      "....yyy....",
      ".....r.....",
    ],
    [
      ".b.......b.",
      "b...yyy...b",
      "bb.yyyyy.bb",
      "...yybyy...",
      "..yyybyyy..",
      "...yybyy...",
      "....yyy....",
      ".....r.....",
    ],
  ],
  fly: [
    [
      "rr.......rr",
      "rrr..w..rrr",
      ".rrrwwwrrr.",
      "..rrbwbrr..",
      ".rrrwwwrrr.",
      "rrr.www.rrr",
      "rr...w...rr",
      ".....w.....",
    ],
    [
      "...........",
      ".rr..w..rr.",
      "rrrrwwwrrrr",
      "rrrrbwbrrrr",
      "rrrrwwwrrrr",
      ".rr.www.rr.",
      ".....w.....",
      ".....w.....",
    ],
  ],
  boss: [
    "..g.......g..",
    "...g.....g...",
    "..ggggggggg..",
    ".ggygggggygg.",
    "gggggoooggggg",
    "gg.ggooogg.gg",
    "g..gg.o.gg..g",
    "...g.....g...",
  ],
};

const makeSprite = (rows: string[], swap: Record<string, string> = {}) => {
  const c = document.createElement("canvas");
  c.width = rows[0].length;
  c.height = rows.length;
  const ctx = c.getContext("2d")!;
  rows.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (ch === ".") return;
      ctx.fillStyle = PALETTE[swap[ch] ?? ch];
      ctx.fillRect(x, y, 1, 1);
    }),
  );
  return c;
};

type SpriteSet = ReturnType<typeof buildSprites>;
const buildSprites = () => ({
  player: makeSprite(SPRITES.player),
  captive: makeSprite(SPRITES.player, { w: "r", r: "w" }),
  bee: SPRITES.bee.map((f) => makeSprite(f)),
  fly: SPRITES.fly.map((f) => makeSprite(f)),
  boss: makeSprite(SPRITES.boss),
  bossHit: makeSprite(SPRITES.boss, { g: "p" }),
});

// --- Paths ---------------------------------------------------------------

// Catmull-Rom spline through the control points, sampled into a polyline.
const makePath = (ctrl: Vec[]): Path => {
  const at = (i: number) => ctrl[Math.max(0, Math.min(ctrl.length - 1, i))];
  const pts: Vec[] = [];
  for (let i = 0; i < ctrl.length - 1; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    for (let s = 0; s < 12; s++) {
      const t = s / 12;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      pts.push({ x: f(p0.x, p1.x, p2.x, p3.x), y: f(p0.y, p1.y, p2.y, p3.y) });
    }
  }
  pts.push(ctrl[ctrl.length - 1]);
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  return { pts, cum, len: cum[cum.length - 1] };
};

const mirror = (ctrl: Vec[]) => ctrl.map((v) => ({ x: W - v.x, y: v.y }));

// Entry swoops (left-hand versions; mirrored for the right).
const ENTRY_TOP: Vec[] = [
  { x: 100, y: -12 },
  { x: 104, y: 40 },
  { x: 84, y: 120 },
  { x: 44, y: 168 },
  { x: 28, y: 140 },
  { x: 46, y: 108 },
  { x: 78, y: 100 },
];
const ENTRY_SIDE: Vec[] = [
  { x: -12, y: 250 },
  { x: 40, y: 232 },
  { x: 92, y: 190 },
  { x: 112, y: 150 },
  { x: 92, y: 118 },
  { x: 60, y: 128 },
];

// Five waves of eight fill the 40-slot formation: [row, col] per enemy.
const WAVES: { slots: [number, number][]; path: (i: number) => Vec[]; gap: (i: number) => number }[] = [
  {
    slots: [[1, 3], [3, 3], [1, 4], [3, 4], [1, 5], [3, 5], [1, 6], [3, 6]],
    path: (i) => (i % 2 ? mirror(ENTRY_TOP) : ENTRY_TOP),
    gap: (i) => Math.floor(i / 2) * 0.18,
  },
  {
    slots: [[0, 3], [1, 1], [0, 4], [1, 2], [0, 5], [1, 7], [0, 6], [1, 8]],
    path: () => ENTRY_SIDE,
    gap: (i) => i * 0.14,
  },
  {
    slots: [[2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [2, 8]],
    path: () => mirror(ENTRY_SIDE),
    gap: (i) => i * 0.14,
  },
  {
    slots: [[3, 0], [3, 1], [3, 2], [3, 7], [3, 8], [3, 9], [4, 4], [4, 5]],
    path: () => ENTRY_TOP,
    gap: (i) => i * 0.14,
  },
  {
    slots: [[4, 0], [4, 1], [4, 2], [4, 3], [4, 6], [4, 7], [4, 8], [4, 9]],
    path: () => mirror(ENTRY_TOP),
    gap: (i) => i * 0.14,
  },
];

const kindForRow = (row: number): Kind => (row === 0 ? "boss" : row <= 2 ? "fly" : "bee");

// Points: in formation / while diving.
const POINTS: Record<Kind, [number, number]> = { bee: [50, 100], fly: [80, 160], boss: [150, 400] };

const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const clampX = (x: number) => Math.max(10, Math.min(W - 10, x));

const slotPos = (row: number, col: number, t: number): Vec => {
  const breath = 1 + 0.06 * Math.sin(t * 1.7);
  return {
    x: W / 2 + Math.sin(t * 0.7) * 10 + (col - 4.5) * 18 * breath,
    y: 44 + row * 16 * breath,
  };
};

const difficulty = (stage: number) => ({
  entrySpeed: 130 + stage * 5,
  diveSpeed: 115 + stage * 10,
  diveEvery: Math.max(0.7, 2.6 - stage * 0.25),
  maxDivers: 2 + Math.floor(stage / 2),
  fireChance: Math.min(0.9, 0.35 + stage * 0.08),
});

const buildStage = (stage: number): Enemy[] =>
  WAVES.flatMap((wave, w) =>
    wave.slots.map(([row, col], i) => {
      const ctrl = wave.path(i);
      const kind = kindForRow(row);
      return {
        kind,
        row,
        col,
        x: ctrl[0].x,
        y: ctrl[0].y,
        angle: 0,
        hp: kind === "boss" ? 2 : 1,
        state: "waiting" as EState,
        delay: 0.8 + w * 2.6 + wave.gap(i),
        entry: makePath(ctrl),
        path: null,
        pd: 0,
        pi: 0,
        speed: difficulty(stage).entrySpeed,
        fireYs: [],
        capture: false,
        beamT: 0,
        captive: null,
      };
    }),
  );

const makeStars = () =>
  Array.from({ length: 70 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    v: rnd(8, 30),
    c: ["#ffffff", "#93c5fd", "#fca5a5", "#fde68a", "#a7f3d0"][Math.floor(Math.random() * 5)],
    p: Math.random() * 6,
  }));

const newGame = (): Game => ({
  t: 0,
  stage: 1,
  score: 0,
  lives: 3,
  enemies: buildStage(1),
  bullets: [],
  ebullets: [],
  parts: [],
  stars: makeStars(),
  player: { x: W / 2, state: "alive", dual: false, respawnT: 0, invuln: 1.5, cooldown: 0 },
  rescue: null,
  diveT: 3,
  stageT: 0,
  overT: 0,
});

const HIGH_KEY = "sim2real_swarm_high";
const readHigh = () => {
  try {
    return Number(localStorage.getItem(HIGH_KEY)) || 0;
  } catch {
    return 0;
  }
};
const writeHigh = (v: number) => {
  try {
    localStorage.setItem(HIGH_KEY, String(v));
  } catch {
    /* storage unavailable */
  }
};

// --- Component -----------------------------------------------------------

const Swarm = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const game = useRef<Game>(newGame());
  const statusRef = useRef<Status>("ready");
  const keys = useRef({ left: false, right: false, fire: false });
  const touchX = useRef<number | null>(null);

  const [status, setStatusState] = useState<Status>("ready");
  const [hud, setHud] = useState({ score: 0, lives: 3, stage: 1 });
  const [high, setHigh] = useState(readHigh);
  const [banner, setBanner] = useState<string | null>(null);
  const bannerTimer = useRef<ReturnType<typeof setTimeout>>();

  const setStatus = useCallback((s: Status) => {
    statusRef.current = s;
    setStatusState(s);
  }, []);

  const flash = useCallback((text: string, ms = 1800) => {
    setBanner(text);
    clearTimeout(bannerTimer.current);
    bannerTimer.current = setTimeout(() => setBanner(null), ms);
  }, []);

  const start = useCallback(() => {
    game.current = newGame();
    setHud({ score: 0, lives: 3, stage: 1 });
    setStatus("playing");
    flash("Stage 1");
  }, [flash, setStatus]);

  const primary = useCallback(() => {
    const s = statusRef.current;
    if (s === "ready" || s === "over") start();
    else setStatus(s === "playing" ? "paused" : "playing");
  }, [setStatus, start]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    canvas.width = W;
    canvas.height = H;
    const spr: SpriteSet = buildSprites();
    let lastHud = "";

    const syncHud = () => {
      const g = game.current;
      const key = `${g.score}|${g.lives}|${g.stage}`;
      if (key !== lastHud) {
        lastHud = key;
        setHud({ score: g.score, lives: g.lives, stage: g.stage });
      }
    };

    const explode = (x: number, y: number, colors: string[], n = 14) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = rnd(20, 80);
        game.current.parts.push({
          x,
          y,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          life: rnd(0.3, 0.7),
          color: colors[i % colors.length],
        });
      }
    };

    const followPath = (e: Enemy, dt: number) => {
      const p = e.path!;
      e.pd += e.speed * dt;
      while (e.pi < p.cum.length - 2 && p.cum[e.pi + 1] < e.pd) e.pi++;
      const a = p.pts[e.pi];
      const b = p.pts[e.pi + 1] ?? a;
      const seg = p.cum[e.pi + 1] - p.cum[e.pi] || 1;
      const t = Math.min(1, Math.max(0, (e.pd - p.cum[e.pi]) / seg));
      const nx = a.x + (b.x - a.x) * t;
      const ny = a.y + (b.y - a.y) * t;
      if (nx !== e.x || ny !== e.y) e.angle = Math.atan2(ny - e.y, nx - e.x) - Math.PI / 2;
      e.x = nx;
      e.y = ny;
      return e.pd >= p.len;
    };

    const setPath = (e: Enemy, ctrl: Vec[]) => {
      e.path = makePath(ctrl);
      e.pd = 0;
      e.pi = 0;
    };

    const killPlayerShip = (which: "left" | "right" | "both") => {
      const g = game.current;
      const pl = g.player;
      if (pl.dual && which !== "both") {
        const hitX = which === "left" ? pl.x : pl.x + DUAL_GAP;
        explode(hitX, PLAYER_Y, ["#ffffff", "#ef4444", "#3b82f6"]);
        if (which === "left") pl.x += DUAL_GAP;
        pl.dual = false;
        return;
      }
      explode(pl.x, PLAYER_Y, ["#ffffff", "#ef4444", "#3b82f6", "#facc15"], 24);
      if (pl.dual) explode(pl.x + DUAL_GAP, PLAYER_Y, ["#ffffff", "#ef4444"], 16);
      pl.dual = false;
      pl.state = "dead";
      pl.respawnT = 2.5;
      g.lives--;
      if (g.lives <= 0) g.overT = 2;
    };

    const launchDive = (e: Enemy) => {
      const g = game.current;
      const d = difficulty(g.stage);
      const side = e.x < W / 2 ? -1 : 1;
      const px = g.player.x;
      const loop: Vec[] = [
        { x: e.x, y: e.y },
        { x: e.x + side * 14, y: e.y - 14 },
        { x: e.x + side * 28, y: e.y - 2 },
        { x: e.x + side * 22, y: e.y + 20 },
      ];
      const canCapture =
        e.kind === "boss" &&
        !e.captive &&
        g.lives >= 2 &&
        !g.player.dual &&
        !g.rescue &&
        !g.enemies.some((o) => o.capture || o.captive) &&
        Math.random() < 0.4;

      e.speed = d.diveSpeed;
      e.fireYs = [];
      if (canCapture) {
        e.capture = true;
        e.beamT = 0;
        setPath(e, [...loop, { x: clampX(px), y: 120 }, { x: clampX(px), y: 176 }]);
      } else {
        e.capture = false;
        if (Math.random() < d.fireChance) e.fireYs.push(rnd(110, 150));
        if (Math.random() < d.fireChance * 0.6) e.fireYs.push(rnd(170, 210));
        const tail = [
          { x: clampX(px + rnd(-40, 40)), y: 170 },
          { x: clampX(px + rnd(-50, 50)), y: 250 },
          { x: clampX(px + rnd(-60, 60)), y: H + 20 },
        ];
        setPath(e, [...loop, ...tail]);
        // Bosses bring up to two escorts from the row below.
        if (e.kind === "boss") {
          const escorts = g.enemies
            .filter((o) => o.kind === "fly" && o.row === 1 && o.state === "formation" && Math.abs(o.col - e.col) <= 2)
            .slice(0, 2);
          escorts.forEach((o, i) => {
            const off = i === 0 ? -14 : 14;
            o.speed = d.diveSpeed;
            o.capture = false;
            o.fireYs = Math.random() < d.fireChance ? [rnd(120, 180)] : [];
            o.state = "diving";
            setPath(o, [{ x: o.x, y: o.y }, ...[...loop.slice(1), ...tail].map((v) => ({ x: v.x + off, y: v.y }))]);
          });
        }
      }
      e.state = "diving";
    };

    const fireAt = (e: Enemy) => {
      const g = game.current;
      if (g.player.state !== "alive") return;
      const vy = 120 + g.stage * 6;
      const time = (PLAYER_Y - e.y) / vy;
      const vx = Math.max(-60, Math.min(60, (g.player.x - e.x) / Math.max(0.5, time)));
      g.ebullets.push({ x: e.x, y: e.y + 6, vx, vy });
    };

    const hitEnemy = (e: Enemy) => {
      const g = game.current;
      e.hp--;
      if (e.hp > 0) return;
      const diving = e.state !== "formation";
      g.score += POINTS[e.kind][diving ? 1 : 0];
      const colors =
        e.kind === "bee" ? ["#facc15", "#3b82f6", "#ffffff"] : e.kind === "fly" ? ["#ef4444", "#ffffff", "#3b82f6"] : ["#c084fc", "#34d399", "#fb923c"];
      explode(e.x, e.y, colors);
      if (e.captive && !e.captive.rising) {
        // Shot down mid-dive: the captured ship is freed and rejoins the player.
        if (diving) g.rescue = { x: e.captive.x, y: e.captive.y, a: 0 };
        else explode(e.captive.x, e.captive.y, ["#ef4444", "#ffffff"], 8);
      }
      if (e.captive?.rising) {
        // Boss died while pulling the ship up: the ship falls back to the player.
        g.rescue = { x: e.captive.x, y: e.captive.y, a: 0 };
        g.player.state = "dead";
        g.player.respawnT = 999; // the rescue will restore the ship
      }
      e.captive = null;
      e.capture = false;
      e.state = "dead";
    };

    const update = (dt: number) => {
      const g = game.current;
      const d = difficulty(g.stage);
      const pl = g.player;
      g.t += dt;

      for (const s of g.stars) {
        s.y += s.v * dt;
        if (s.y > H) {
          s.y = 0;
          s.x = Math.random() * W;
        }
      }
      for (const p of g.parts) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
      }
      g.parts = g.parts.filter((p) => p.life > 0);

      if (statusRef.current !== "playing") return;

      // Player
      if (pl.state === "alive") {
        pl.invuln = Math.max(0, pl.invuln - dt);
        pl.cooldown = Math.max(0, pl.cooldown - dt);
        const speed = 110;
        const maxX = W - 10 - (pl.dual ? DUAL_GAP : 0);
        if (touchX.current !== null) {
          const target = touchX.current - (pl.dual ? DUAL_GAP / 2 : 0);
          const dx = target - pl.x;
          pl.x += Math.sign(dx) * Math.min(Math.abs(dx), speed * dt);
        } else {
          if (keys.current.left) pl.x -= speed * dt;
          if (keys.current.right) pl.x += speed * dt;
        }
        pl.x = Math.max(10, Math.min(maxX, pl.x));
        const volleys = g.bullets.length / (pl.dual ? 2 : 1);
        if ((keys.current.fire || touchX.current !== null) && pl.cooldown === 0 && volleys < 2) {
          g.bullets.push({ x: pl.x, y: PLAYER_Y - 6 });
          if (pl.dual) g.bullets.push({ x: pl.x + DUAL_GAP, y: PLAYER_Y - 6 });
          pl.cooldown = 0.2;
        }
      } else if (pl.state === "dead" && g.lives > 0 && g.overT === 0) {
        pl.respawnT -= dt;
        const beamActive = g.enemies.some((e) => e.state === "beam");
        if (pl.respawnT <= 0 && !beamActive) {
          pl.state = "alive";
          pl.x = W / 2;
          pl.invuln = 2;
        }
      }

      // Bullets
      for (const b of g.bullets) b.y -= 260 * dt;
      g.bullets = g.bullets.filter((b) => b.y > -8);
      for (const b of g.ebullets) {
        b.x += b.vx * dt;
        b.y += b.vy * dt;
      }
      g.ebullets = g.ebullets.filter((b) => b.y < H + 8 && b.x > -8 && b.x < W + 8);

      // Enemies
      for (const e of g.enemies) {
        switch (e.state) {
          case "waiting":
            e.delay -= dt;
            if (e.delay <= 0) {
              e.state = "entering";
              e.path = e.entry;
              e.pd = 0;
              e.pi = 0;
            }
            break;
          case "entering":
            if (followPath(e, dt)) e.state = "homing";
            break;
          case "homing": {
            const s = slotPos(e.row, e.col, g.t);
            const dx = s.x - e.x;
            const dy = s.y - e.y;
            const dist = Math.hypot(dx, dy);
            const step = 110 * dt;
            if (dist <= step) {
              e.x = s.x;
              e.y = s.y;
              e.angle = 0;
              e.state = "formation";
            } else {
              e.x += (dx / dist) * step;
              e.y += (dy / dist) * step;
              e.angle = Math.atan2(dy, dx) - Math.PI / 2;
            }
            break;
          }
          case "formation": {
            const s = slotPos(e.row, e.col, g.t);
            e.x = s.x;
            e.y = s.y;
            e.angle = 0;
            break;
          }
          case "diving": {
            const done = followPath(e, dt);
            e.fireYs = e.fireYs.filter((fy) => {
              if (e.y >= fy) {
                fireAt(e);
                return false;
              }
              return true;
            });
            if (done) {
              if (e.capture) {
                e.state = "beam";
                e.beamT = 0;
                e.angle = 0;
              } else {
                // Off the bottom: re-enter from the top and fly home.
                const s = slotPos(e.row, e.col, g.t);
                e.x = s.x;
                e.y = -14;
                e.state = "homing";
              }
            }
            break;
          }
          case "beam": {
            e.beamT += dt;
            const full = e.beamT > 0.6 && e.beamT < 3.2;
            if (
              full &&
              !e.captive &&
              pl.state === "alive" &&
              pl.invuln === 0 &&
              Math.abs(pl.x - e.x) < 16
            ) {
              pl.state = "captured";
              e.captive = { x: pl.x, y: PLAYER_Y, rising: true };
              e.beamT = 1; // hold the beam while the ship is pulled up
            }
            if (e.captive?.rising) {
              const tx = e.x;
              const ty = e.y - 14;
              const dx = tx - e.captive.x;
              const dy = ty - e.captive.y;
              const dist = Math.hypot(dx, dy);
              const step = 70 * dt;
              if (dist <= step) {
                e.captive.x = tx;
                e.captive.y = ty;
                e.captive.rising = false;
                e.capture = false;
                e.state = "homing";
                pl.state = "dead";
                pl.respawnT = 2.5;
                g.lives--;
                flash("Fighter captured");
              } else {
                e.captive.x += (dx / dist) * step;
                e.captive.y += (dy / dist) * step;
              }
            } else if (e.beamT > 3.8) {
              e.capture = false;
              e.speed = d.diveSpeed;
              setPath(e, [
                { x: e.x, y: e.y },
                { x: clampX(e.x + rnd(-30, 30)), y: e.y + 60 },
                { x: clampX(e.x + rnd(-40, 40)), y: H + 20 },
              ]);
              e.state = "diving";
            }
            break;
          }
        }
        // A captured ship trails behind its boss.
        if (e.captive && !e.captive.rising) {
          e.captive.x = e.x + Math.sin(e.angle) * 14;
          e.captive.y = e.y - Math.cos(e.angle) * 14;
        }
      }

      // Dive scheduling once everyone has arrived.
      const arriving = g.enemies.some((e) => e.state === "waiting" || e.state === "entering");
      const divers = g.enemies.filter((e) => e.state === "diving" || e.state === "beam").length;
      if (!arriving && pl.state === "alive") {
        g.diveT -= dt;
        if (g.diveT <= 0 && divers < d.maxDivers) {
          const pool = g.enemies.filter((e) => e.state === "formation");
          if (pool.length) launchDive(pool[Math.floor(Math.random() * pool.length)]);
          g.diveT = d.diveEvery * rnd(0.6, 1.4);
        }
      }

      // Player bullets vs enemies and captive ships
      g.bullets = g.bullets.filter((b) => {
        for (const e of g.enemies) {
          if (e.state === "dead" || e.state === "waiting") continue;
          if (e.captive && !e.captive.rising && Math.abs(b.x - e.captive.x) < 6 && Math.abs(b.y - e.captive.y) < 6) {
            explode(e.captive.x, e.captive.y, ["#ef4444", "#ffffff"], 10);
            e.captive = null;
            return false;
          }
          const r = e.kind === "boss" ? 8 : 6;
          if (Math.abs(b.x - e.x) < r && Math.abs(b.y - e.y) < r) {
            hitEnemy(e);
            return false;
          }
        }
        return true;
      });

      // Hazards vs player
      if (pl.state === "alive" && pl.invuln === 0) {
        const ships: ("left" | "right")[] = pl.dual ? ["left", "right"] : ["left"];
        for (const which of ships) {
          if (pl.state !== "alive") break;
          const sx = which === "left" ? pl.x : pl.x + DUAL_GAP;
          const hitBullet = g.ebullets.findIndex((b) => Math.abs(b.x - sx) < 5 && Math.abs(b.y - PLAYER_Y) < 6);
          if (hitBullet >= 0) {
            g.ebullets.splice(hitBullet, 1);
            killPlayerShip(which);
            continue;
          }
          const rammer = g.enemies.find(
            (e) => (e.state === "diving" || e.state === "homing") && Math.abs(e.x - sx) < 9 && Math.abs(e.y - PLAYER_Y) < 9,
          );
          if (rammer) {
            rammer.hp = 1; // a collision destroys even a fresh boss
            hitEnemy(rammer);
            killPlayerShip(which);
          }
        }
      }

      // Rescued ship drifting down to dock beside the player
      if (g.rescue) {
        const r = g.rescue;
        r.a += dt * 10;
        const tx = pl.state === "alive" ? Math.min(pl.x + DUAL_GAP, W - 10) : W / 2;
        const dx = tx - r.x;
        const dy = PLAYER_Y - r.y;
        const dist = Math.hypot(dx, dy);
        const step = 90 * dt;
        if (dist <= step) {
          if (pl.state === "alive" && !pl.dual) {
            pl.dual = true;
            pl.x = Math.min(pl.x, W - 10 - DUAL_GAP);
          } else if (pl.state !== "alive") {
            pl.state = "alive";
            pl.x = W / 2;
            pl.invuln = 1.5;
          }
          g.rescue = null;
          flash("Fighter rescued");
        } else {
          r.x += (dx / dist) * step;
          r.y += (dy / dist) * step;
        }
      }

      // Stage clear / game over
      if (g.overT > 0) {
        g.overT -= dt;
        if (g.overT <= 0) {
          g.overT = 0;
          setStatus("over");
          if (g.score > readHigh()) {
            writeHigh(g.score);
            setHigh(g.score);
          }
        }
      } else if (g.enemies.every((e) => e.state === "dead") && !g.rescue) {
        if (g.stageT === 0) g.stageT = 2.5;
        g.stageT -= dt;
        if (g.stageT <= 0) {
          g.stageT = 0;
          g.stage++;
          g.enemies = buildStage(g.stage);
          g.ebullets = [];
          g.diveT = 3;
          flash(`Stage ${g.stage}`);
        }
      }

      syncHud();
    };

    const drawSprite = (img: HTMLCanvasElement, x: number, y: number, angle = 0) => {
      ctx.save();
      ctx.translate(Math.round(x), Math.round(y));
      if (angle) ctx.rotate(angle);
      ctx.drawImage(img, -Math.floor(img.width / 2), -Math.floor(img.height / 2));
      ctx.restore();
    };

    const draw = () => {
      const g = game.current;
      const pl = g.player;
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = "#05060a";
      ctx.fillRect(0, 0, W, H);

      for (const s of g.stars) {
        if (Math.sin(g.t * 3 + s.p) < -0.3) continue; // twinkle
        ctx.fillStyle = s.c;
        ctx.fillRect(Math.floor(s.x), Math.floor(s.y), 1, 1);
      }

      if (statusRef.current === "ready") return;

      const frame = Math.floor(g.t * 3) % 2;

      // Tractor beams
      for (const e of g.enemies) {
        if (e.state !== "beam") continue;
        const ext = e.captive?.rising ? 1 : Math.min(1, e.beamT / 0.6, Math.max(0, (3.8 - e.beamT) / 0.6));
        if (ext <= 0) continue;
        const top = e.y + 6;
        const bottom = top + (PLAYER_Y + 8 - top) * ext;
        const halfTop = 5;
        const halfBot = 5 + 15 * ext;
        ctx.fillStyle = "rgba(56,189,248,0.25)";
        ctx.beginPath();
        ctx.moveTo(e.x - halfTop, top);
        ctx.lineTo(e.x + halfTop, top);
        ctx.lineTo(e.x + halfBot, bottom);
        ctx.lineTo(e.x - halfBot, bottom);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "rgba(186,230,253,0.6)";
        for (let k = 0; k < 6; k++) {
          const f = ((g.t * 1.5 + k / 6) % 1) * ext;
          const y = top + (PLAYER_Y + 8 - top) * f;
          const half = halfTop + (halfBot - halfTop) * (f / Math.max(ext, 0.01));
          ctx.fillRect(Math.round(e.x - half), Math.round(y), Math.round(half * 2), 1);
        }
      }

      // Enemies and their captives
      for (const e of g.enemies) {
        if (e.state === "dead" || e.state === "waiting") continue;
        const img = e.kind === "boss" ? (e.hp < 2 ? spr.bossHit : spr.boss) : spr[e.kind][e.state === "formation" ? frame : 0];
        drawSprite(img, e.x, e.y, e.angle);
        if (e.captive) {
          const spin = e.captive.rising ? g.t * 12 : e.angle + Math.PI;
          drawSprite(e.captive.rising ? spr.player : spr.captive, e.captive.x, e.captive.y, spin);
        }
      }

      if (g.rescue) drawSprite(spr.player, g.rescue.x, g.rescue.y, g.rescue.a);

      // Bullets
      ctx.fillStyle = "#fde68a";
      for (const b of g.bullets) ctx.fillRect(Math.round(b.x) - 0.5, Math.round(b.y) - 3, 1, 5);
      ctx.fillStyle = "#f87171";
      for (const b of g.ebullets) ctx.fillRect(Math.round(b.x) - 1, Math.round(b.y) - 2, 2, 4);

      // Player
      if (pl.state === "alive" && !(pl.invuln > 0 && Math.floor(g.t * 10) % 2)) {
        drawSprite(spr.player, pl.x, PLAYER_Y);
        if (pl.dual) drawSprite(spr.player, pl.x + DUAL_GAP, PLAYER_Y);
      }

      for (const p of g.parts) {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.min(1, p.life * 2);
        ctx.fillRect(Math.round(p.x), Math.round(p.y), 1, 1);
      }
      ctx.globalAlpha = 1;
    };

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      update(dt);
      draw();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onHidden = () => {
      if (document.hidden && statusRef.current === "playing") setStatus("paused");
    };
    document.addEventListener("visibilitychange", onHidden);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onHidden);
      clearTimeout(bannerTimer.current);
    };
  }, [flash, setStatus]);

  // Keyboard
  useEffect(() => {
    const map: Record<string, "left" | "right" | "fire"> = {
      ArrowLeft: "left",
      KeyA: "left",
      ArrowRight: "right",
      KeyD: "right",
      Space: "fire",
      KeyZ: "fire",
    };
    const down = (e: KeyboardEvent) => {
      if (map[e.code]) {
        e.preventDefault(); // keep arrows and space from scrolling the page
        keys.current[map[e.code]] = true;
      } else if (e.code === "Enter" || e.code === "KeyP" || e.code === "Escape") {
        e.preventDefault();
        if (!e.repeat) {
          if (e.code === "Enter" || statusRef.current === "playing" || statusRef.current === "paused") primary();
        }
      }
    };
    const up = (e: KeyboardEvent) => {
      if (map[e.code]) keys.current[map[e.code]] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [primary]);

  // Touch: hold anywhere on the screen to steer toward your finger and auto-fire.
  const toLogicalX = (clientX: number) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * W;
  };
  const onPointerDown = (e: React.PointerEvent) => {
    if (statusRef.current !== "playing") {
      primary();
      return;
    }
    if (e.pointerType === "mouse") return;
    touchX.current = toLogicalX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (touchX.current !== null) touchX.current = toLogicalX(e.clientX);
  };
  const endTouch = () => {
    touchX.current = null;
  };

  const overlay =
    status === "ready"
      ? { title: "Swarm", sub: "Press Enter or tap to start" }
      : status === "paused"
        ? { title: "Paused", sub: "Press P or tap to resume" }
        : status === "over"
          ? { title: "Game over", sub: "Press Enter or tap to play again" }
          : null;

  const Stat = ({ label, value }: { label: string; value: number }) => (
    <div className="text-center">
      <div className="text-[10px] uppercase tracking-[0.3em] text-white/40">{label}</div>
      <div className="font-mono text-base text-white">{value}</div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#05060a] px-4 py-8 text-white">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight md:text-4xl">Swarm</h1>
          <p className="mt-2 text-xs text-white/60">An arcade shooter sandbox</p>
        </div>

        <div className="flex w-full max-w-sm justify-between px-2">
          <Stat label="Score" value={hud.score} />
          <Stat label="Best" value={Math.max(high, hud.score)} />
          <Stat label="Stage" value={hud.stage} />
          <Stat label="Ships" value={hud.lives} />
        </div>

        <div className="relative">
          <canvas
            ref={canvasRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endTouch}
            onPointerCancel={endTouch}
            onPointerLeave={endTouch}
            className="block touch-none select-none rounded border border-white/20"
            style={{
              height: "min(75vh, 640px, calc((100vw - 32px) * 4 / 3))",
              aspectRatio: `${W} / ${H}`,
              imageRendering: "pixelated",
            }}
          />
          {overlay && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center rounded bg-black/50 text-center">
              <div className="text-xl font-bold">{overlay.title}</div>
              <div className="mt-2 px-2 text-xs text-white/60">{overlay.sub}</div>
            </div>
          )}
          {!overlay && banner && (
            <div className="pointer-events-none absolute inset-x-0 top-1/3 text-center text-sm font-bold tracking-[0.3em] text-sky-300 uppercase">
              {banner}
            </div>
          )}
        </div>

        <p className="text-center text-xs text-white/50 md:hidden">
          Hold your finger on the screen to steer. Your ship fires while you hold.
        </p>
        <div className="hidden grid-cols-2 gap-x-8 gap-y-1 text-xs text-white/60 md:grid">
          <span>← → or A D move</span>
          <span>Space fire (hold for rapid)</span>
          <span>P / Esc pause</span>
          <span>Enter start</span>
        </div>
        <p className="max-w-sm text-center text-xs text-white/40">
          Bosses take two hits. If one catches your ship in its tractor beam, shoot that boss while it dives to get your ship back and double your firepower.
        </p>
      </div>
    </main>
  );
};

export default Swarm;
