import { useCallback, useEffect, useRef, useState } from "react";

// Sandbox page — intentionally not linked from anywhere. Reach it at /blocks.
// A falling-blocks puzzle in the style of modern Tetris: 7-bag randomizer,
// SRS rotation with wall kicks, ghost piece, hold, lock delay.

const COLS = 10;
const ROWS = 20;
const HIDDEN = 2; // spawn rows above the visible board
const CELL = 30; // logical px per cell on the board canvas
const LOCK_DELAY = 500; // ms a piece may rest on the stack before locking
const MAX_LOCK_RESETS = 15;

type Kind = "I" | "J" | "L" | "O" | "S" | "T" | "Z";
type Cell = Kind | null;
type Grid = number[][];
type Piece = { kind: Kind; rot: number; x: number; y: number };
type Status = "ready" | "playing" | "paused" | "over";

const KINDS: Kind[] = ["I", "J", "L", "O", "S", "T", "Z"];

const SHAPES: Record<Kind, Grid> = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
};

const COLORS: Record<Kind, string> = {
  I: "#38bdf8",
  J: "#3b82f6",
  L: "#f59e0b",
  O: "#facc15",
  S: "#22c55e",
  T: "#a855f7",
  Z: "#ef4444",
};

const rotateCW = (m: Grid): Grid => m[0].map((_, c) => m.map((row) => row[c]).reverse());

// All four rotation states for each piece (0, R, 2, L).
const ROTATIONS = Object.fromEntries(
  KINDS.map((k) => {
    const states = [SHAPES[k]];
    for (let i = 1; i < 4; i++) states.push(rotateCW(states[i - 1]));
    return [k, states];
  }),
) as Record<Kind, Grid[]>;

// SRS wall kick offsets, written with y pointing down (the guideline tables use y up).
const KICKS_JLSTZ: Record<string, [number, number][]> = {
  "01": [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
  "10": [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
  "12": [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
  "21": [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
  "23": [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
  "32": [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
  "30": [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
  "03": [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
};
const KICKS_I: Record<string, [number, number][]> = {
  "01": [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]],
  "10": [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]],
  "12": [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]],
  "21": [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]],
  "23": [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]],
  "32": [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]],
  "30": [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]],
  "03": [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]],
};

const LINE_SCORES = [0, 100, 300, 500, 800];

// Guideline gravity: seconds per row = (0.8 - (level - 1) * 0.007) ^ (level - 1).
const gravityMs = (level: number) =>
  Math.max(16, 1000 * Math.pow(0.8 - (level - 1) * 0.007, level - 1));

const emptyBoard = (): Cell[][] =>
  Array.from({ length: ROWS + HIDDEN }, () => Array<Cell>(COLS).fill(null));

const shuffledBag = (): Kind[] => {
  const bag = [...KINDS];
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  return bag;
};

const spawn = (kind: Kind): Piece => ({
  kind,
  rot: 0,
  x: Math.floor((COLS - SHAPES[kind].length) / 2),
  y: HIDDEN - 1,
});

const collides = (board: Cell[][], p: Piece) => {
  const m = ROTATIONS[p.kind][p.rot];
  for (let r = 0; r < m.length; r++)
    for (let c = 0; c < m.length; c++) {
      if (!m[r][c]) continue;
      const x = p.x + c;
      const y = p.y + r;
      if (x < 0 || x >= COLS || y >= ROWS + HIDDEN) return true;
      if (y >= 0 && board[y][x]) return true;
    }
  return false;
};

const HIGH_SCORE_KEY = "sim2real_blocks_high";
const readHigh = () => {
  try {
    return Number(localStorage.getItem(HIGH_SCORE_KEY)) || 0;
  } catch {
    return 0;
  }
};
const writeHigh = (v: number) => {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, String(v));
  } catch {
    /* storage unavailable */
  }
};

type Game = {
  board: Cell[][];
  piece: Piece;
  queue: Kind[];
  hold: Kind | null;
  canHold: boolean;
  score: number;
  lines: number;
  level: number;
  fall: number; // ms accumulated toward the next gravity step
  lock: number; // ms spent resting on the stack
  lockResets: number;
};

const newGame = (): Game => {
  const queue = [...shuffledBag(), ...shuffledBag()];
  return {
    board: emptyBoard(),
    piece: spawn(queue.shift()!),
    queue,
    hold: null,
    canHold: true,
    score: 0,
    lines: 0,
    level: 1,
    fall: 0,
    lock: 0,
    lockResets: 0,
  };
};

const onGround = (g: Game) => collides(g.board, { ...g.piece, y: g.piece.y + 1 });

// Moving or rotating a resting piece buys it more time, up to a limit.
const afterShift = (g: Game) => {
  if (onGround(g) && g.lockResets < MAX_LOCK_RESETS) {
    g.lock = 0;
    g.lockResets++;
  }
};

const drawCell = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
  ctx.fillStyle = color;
  ctx.fillRect(x + 1, y + 1, size - 2, size - 2);
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.fillRect(x + 1, y + 1, size - 2, 3);
};

const drawMini = (canvas: HTMLCanvasElement | null, kind: Kind | null, dim = false) => {
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!kind) return;
  const m = SHAPES[kind];
  const size = 18;
  const cells = m.flatMap((row, r) => row.map((v, c) => (v ? [r, c] : null))).filter(Boolean) as number[][];
  const minR = Math.min(...cells.map((p) => p[0]));
  const maxR = Math.max(...cells.map((p) => p[0]));
  const minC = Math.min(...cells.map((p) => p[1]));
  const maxC = Math.max(...cells.map((p) => p[1]));
  const ox = (canvas.width - (maxC - minC + 1) * size) / 2;
  const oy = (canvas.height - (maxR - minR + 1) * size) / 2;
  ctx.globalAlpha = dim ? 0.35 : 1;
  for (const [r, c] of cells) drawCell(ctx, ox + (c - minC) * size, oy + (r - minR) * size, size, COLORS[kind]);
  ctx.globalAlpha = 1;
};

const Blocks = () => {
  const boardRef = useRef<HTMLCanvasElement>(null);
  const holdRef = useRef<HTMLCanvasElement>(null);
  const nextRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const game = useRef<Game>(newGame());
  const statusRef = useRef<Status>("ready");

  const [status, setStatusState] = useState<Status>("ready");
  const [stats, setStats] = useState({ score: 0, lines: 0, level: 1 });
  const [high, setHigh] = useState(readHigh);

  const setStatus = useCallback((s: Status) => {
    statusRef.current = s;
    setStatusState(s);
  }, []);

  const syncStats = useCallback(() => {
    const g = game.current;
    setStats({ score: g.score, lines: g.lines, level: g.level });
  }, []);

  const drawSide = useCallback(() => {
    const g = game.current;
    drawMini(holdRef.current, g.hold, !g.canHold);
    nextRefs.current.forEach((c, i) => drawMini(c, g.queue[i] ?? null));
  }, []);

  const draw = useCallback(() => {
    const canvas = boardRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const g = game.current;
    ctx.clearRect(0, 0, COLS * CELL, ROWS * CELL);

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    for (let c = 1; c < COLS; c++) {
      ctx.beginPath();
      ctx.moveTo(c * CELL + 0.5, 0);
      ctx.lineTo(c * CELL + 0.5, ROWS * CELL);
      ctx.stroke();
    }
    for (let r = 1; r < ROWS; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * CELL + 0.5);
      ctx.lineTo(COLS * CELL, r * CELL + 0.5);
      ctx.stroke();
    }

    // Locked stack
    for (let r = HIDDEN; r < ROWS + HIDDEN; r++)
      for (let c = 0; c < COLS; c++) {
        const k = g.board[r][c];
        if (k) drawCell(ctx, c * CELL, (r - HIDDEN) * CELL, CELL, COLORS[k]);
      }

    if (statusRef.current === "ready") return;

    // Ghost + active piece
    const ghost = { ...g.piece };
    while (!collides(g.board, { ...ghost, y: ghost.y + 1 })) ghost.y++;
    const m = ROTATIONS[g.piece.kind][g.piece.rot];
    for (let r = 0; r < m.length; r++)
      for (let c = 0; c < m.length; c++) {
        if (!m[r][c]) continue;
        const gy = ghost.y + r - HIDDEN;
        if (gy >= 0) {
          ctx.strokeStyle = COLORS[g.piece.kind];
          ctx.globalAlpha = 0.45;
          ctx.strokeRect((ghost.x + c) * CELL + 2.5, gy * CELL + 2.5, CELL - 5, CELL - 5);
          ctx.globalAlpha = 1;
        }
        const py = g.piece.y + r - HIDDEN;
        if (py >= 0) drawCell(ctx, (g.piece.x + c) * CELL, py * CELL, CELL, COLORS[g.piece.kind]);
      }
  }, []);

  const nextPiece = useCallback(() => {
    const g = game.current;
    if (g.queue.length < 7) g.queue.push(...shuffledBag());
    g.piece = spawn(g.queue.shift()!);
    g.canHold = true;
    g.fall = 0;
    g.lock = 0;
    g.lockResets = 0;
    if (collides(g.board, g.piece)) {
      setStatus("over");
      if (g.score > readHigh()) {
        writeHigh(g.score);
        setHigh(g.score);
      }
    }
    drawSide();
  }, [drawSide, setStatus]);

  const lockPiece = useCallback(() => {
    const g = game.current;
    const m = ROTATIONS[g.piece.kind][g.piece.rot];
    for (let r = 0; r < m.length; r++)
      for (let c = 0; c < m.length; c++)
        if (m[r][c] && g.piece.y + r >= 0) g.board[g.piece.y + r][g.piece.x + c] = g.piece.kind;

    const kept = g.board.filter((row) => row.some((v) => !v));
    const cleared = g.board.length - kept.length;
    while (kept.length < ROWS + HIDDEN) kept.unshift(Array<Cell>(COLS).fill(null));
    g.board = kept;
    if (cleared) {
      g.score += LINE_SCORES[cleared] * g.level;
      g.lines += cleared;
      g.level = Math.floor(g.lines / 10) + 1;
    }
    syncStats();
    nextPiece();
  }, [nextPiece, syncStats]);

  const move = useCallback((dx: number) => {
    if (statusRef.current !== "playing") return;
    const g = game.current;
    const p = { ...g.piece, x: g.piece.x + dx };
    if (!collides(g.board, p)) {
      g.piece = p;
      afterShift(g);
    }
  }, []);

  const rotate = useCallback((dir: 1 | -1) => {
    if (statusRef.current !== "playing") return;
    const g = game.current;
    if (g.piece.kind === "O") return;
    const from = g.piece.rot;
    const to = (from + dir + 4) % 4;
    const kicks = (g.piece.kind === "I" ? KICKS_I : KICKS_JLSTZ)[`${from}${to}`];
    for (const [kx, ky] of kicks) {
      const p = { ...g.piece, rot: to, x: g.piece.x + kx, y: g.piece.y + ky };
      if (!collides(g.board, p)) {
        g.piece = p;
        afterShift(g);
        return;
      }
    }
  }, []);

  const softDrop = useCallback(() => {
    if (statusRef.current !== "playing") return;
    const g = game.current;
    const p = { ...g.piece, y: g.piece.y + 1 };
    if (!collides(g.board, p)) {
      g.piece = p;
      g.fall = 0;
      g.score += 1;
      syncStats();
    }
  }, [syncStats]);

  const hardDrop = useCallback(() => {
    if (statusRef.current !== "playing") return;
    const g = game.current;
    let dropped = 0;
    while (!collides(g.board, { ...g.piece, y: g.piece.y + 1 })) {
      g.piece = { ...g.piece, y: g.piece.y + 1 };
      dropped++;
    }
    g.score += dropped * 2;
    lockPiece();
  }, [lockPiece]);

  const hold = useCallback(() => {
    if (statusRef.current !== "playing") return;
    const g = game.current;
    if (!g.canHold) return;
    const current = g.piece.kind;
    if (g.hold) {
      g.piece = spawn(g.hold);
      g.hold = current;
      g.fall = 0;
      g.lock = 0;
      g.lockResets = 0;
    } else {
      g.hold = current;
      nextPiece();
    }
    g.canHold = false;
    drawSide();
  }, [drawSide, nextPiece]);

  const start = useCallback(() => {
    game.current = newGame();
    syncStats();
    setStatus("playing");
    drawSide();
  }, [drawSide, setStatus, syncStats]);

  const togglePause = useCallback(() => {
    if (statusRef.current === "playing") setStatus("paused");
    else if (statusRef.current === "paused") setStatus("playing");
  }, [setStatus]);

  // Primary action for the overlay / Enter key.
  const primary = useCallback(() => {
    if (statusRef.current === "ready" || statusRef.current === "over") start();
    else togglePause();
  }, [start, togglePause]);

  // Game loop
  useEffect(() => {
    const canvas = boardRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = COLS * CELL * dpr;
    canvas.height = ROWS * CELL * dpr;
    canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100);
      last = now;
      if (statusRef.current === "playing") {
        const g = game.current;
        if (onGround(g)) {
          g.lock += dt;
          if (g.lock >= LOCK_DELAY || g.lockResets >= MAX_LOCK_RESETS) lockPiece();
        } else {
          g.fall += dt;
          const step = gravityMs(g.level);
          while (g.fall >= step && !onGround(g)) {
            g.fall -= step;
            g.piece = { ...g.piece, y: g.piece.y + 1 };
          }
        }
      }
      draw();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    drawSide();

    const onHidden = () => {
      if (document.hidden && statusRef.current === "playing") setStatus("paused");
    };
    document.addEventListener("visibilitychange", onHidden);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onHidden);
    };
  }, [draw, drawSide, lockPiece, setStatus]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const keys: Record<string, () => void> = {
        ArrowLeft: () => move(-1),
        ArrowRight: () => move(1),
        ArrowDown: softDrop,
        ArrowUp: () => rotate(1),
        KeyX: () => rotate(1),
        KeyZ: () => rotate(-1),
        Space: hardDrop,
        KeyC: hold,
        ShiftLeft: hold,
        ShiftRight: hold,
        KeyP: togglePause,
        Escape: togglePause,
        Enter: primary,
      };
      const action = keys[e.code];
      if (!action) return;
      e.preventDefault(); // keep arrows and space from scrolling the page
      if (e.repeat && ["ArrowUp", "KeyX", "KeyZ", "Space", "KeyC", "ShiftLeft", "ShiftRight", "KeyP", "Escape", "Enter"].includes(e.code)) return;
      action();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hardDrop, hold, move, primary, rotate, softDrop, togglePause]);

  // Touch gestures on the board: drag sideways to move, drag down to soft drop,
  // flick down to hard drop, tap to rotate.
  const touch = useRef<{ x: number; y: number; t: number; mx: number; my: number; moved: boolean } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return;
    touch.current = { x: e.clientX, y: e.clientY, t: performance.now(), mx: e.clientX, my: e.clientY, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const t = touch.current;
    const canvas = boardRef.current;
    if (!t || !canvas) return;
    const cell = canvas.getBoundingClientRect().width / COLS;
    while (e.clientX - t.mx > cell) {
      move(1);
      t.mx += cell;
      t.moved = true;
    }
    while (t.mx - e.clientX > cell) {
      move(-1);
      t.mx -= cell;
      t.moved = true;
    }
    while (e.clientY - t.my > cell) {
      softDrop();
      t.my += cell;
      t.moved = true;
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const t = touch.current;
    touch.current = null;
    if (!t) return;
    const dt = performance.now() - t.t;
    const dx = e.clientX - t.x;
    const dy = e.clientY - t.y;
    if (statusRef.current !== "playing") {
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) primary();
      return;
    }
    if (dy > 60 && dt < 250 && Math.abs(dy) > Math.abs(dx) * 2) hardDrop();
    else if (!t.moved && Math.abs(dx) < 10 && Math.abs(dy) < 10 && dt < 300) rotate(1);
  };

  const overlay =
    status === "ready"
      ? { title: "Blocks", sub: "Press Enter or tap to start" }
      : status === "paused"
        ? { title: "Paused", sub: "Press P or tap to resume" }
        : status === "over"
          ? { title: "Game over", sub: "Press Enter or tap to play again" }
          : null;

  const Stat = ({ label, value }: { label: string; value: number }) => (
    <div>
      <div className="text-[10px] uppercase tracking-[0.3em] text-white/40">{label}</div>
      <div className="font-mono text-lg text-white">{value}</div>
    </div>
  );

  const Pad = ({ label, onPress, wide = false }: { label: string; onPress: () => void; wide?: boolean }) => (
    <button
      onPointerDown={(e) => {
        e.preventDefault();
        onPress();
      }}
      className={`rounded border border-white/20 py-3 text-sm text-white active:bg-white/20 ${wide ? "col-span-2" : ""}`}
    >
      {label}
    </button>
  );

  return (
    <main className="min-h-screen bg-[#05060a] px-4 py-8 text-white">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight md:text-4xl">Blocks</h1>
          <p className="mt-2 text-xs text-white/60">A falling-blocks sandbox</p>
        </div>

        <div className="flex items-start gap-3 sm:gap-4">
          {/* Left column: hold + stats */}
          <div className="flex w-16 flex-col gap-4 sm:w-24">
            <div>
              <div className="mb-1 text-[10px] uppercase tracking-[0.3em] text-white/40">Hold</div>
              <canvas ref={holdRef} width={80} height={60} className="w-full rounded border border-white/10" />
            </div>
            <Stat label="Score" value={stats.score} />
            <Stat label="Lines" value={stats.lines} />
            <Stat label="Level" value={stats.level} />
            <Stat label="Best" value={high} />
          </div>

          {/* Board. Height is capped by screen width too, so board + side columns fit on phones. */}
          <div className="relative">
            <canvas
              ref={boardRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={() => (touch.current = null)}
              onClick={(e) => {
                if (e.nativeEvent instanceof PointerEvent && e.nativeEvent.pointerType !== "mouse") return;
                if (statusRef.current !== "playing") primary();
              }}
              className="block touch-none select-none rounded border border-white/20 bg-black/40"
              style={{ height: "min(70vh, 600px, calc((100vw - 184px) * 2))", aspectRatio: `${COLS} / ${ROWS}` }}
            />
            {overlay && (
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center rounded bg-black/60 text-center">
                <div className="text-xl font-bold">{overlay.title}</div>
                <div className="mt-2 px-2 text-xs text-white/60">{overlay.sub}</div>
              </div>
            )}
          </div>

          {/* Right column: next queue */}
          <div className="flex w-16 flex-col gap-2 sm:w-24">
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/40">Next</div>
            {[0, 1, 2].map((i) => (
              <canvas
                key={i}
                ref={(el) => (nextRefs.current[i] = el)}
                width={80}
                height={60}
                className="w-full rounded border border-white/10"
                style={{ opacity: i === 0 ? 1 : 0.6 }}
              />
            ))}
          </div>
        </div>

        {/* Touch controls */}
        <div className="grid w-full max-w-sm grid-cols-4 gap-2 md:hidden">
          <Pad label="◀" onPress={() => move(-1)} />
          <Pad label="▶" onPress={() => move(1)} />
          <Pad label="⟳" onPress={() => rotate(1)} />
          <Pad label="Hold" onPress={hold} />
          <Pad label="▼ Soft" onPress={softDrop} wide />
          <Pad label="⤓ Drop" onPress={hardDrop} wide />
          <Pad label={status === "playing" ? "Pause" : status === "paused" ? "Resume" : "Start"} onPress={primary} wide />
        </div>
        <p className="text-center text-xs text-white/50 md:hidden">
          On the board: drag to move, drag down to soft drop, flick down to drop, tap to rotate.
        </p>

        {/* Keyboard help */}
        <div className="hidden grid-cols-2 gap-x-8 gap-y-1 text-xs text-white/60 md:grid">
          <span>← → move</span>
          <span>↑ / X rotate, Z rotate back</span>
          <span>↓ soft drop</span>
          <span>Space hard drop</span>
          <span>C / Shift hold</span>
          <span>P / Esc pause, Enter start</span>
        </div>
      </div>
    </main>
  );
};

export default Blocks;
