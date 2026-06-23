import { useEffect, useRef } from "react";

interface Body {
  x: number; y: number;
  vx: number; vy: number;
  angle: number; av: number;
  radius: number; mass: number;
  type: "circle" | "square" | "rect" | "triangle";
  w: number; h: number;
  stroke: string; fill: string;
  wireframe: boolean;
  dragging: boolean;
}

const BREAKPOINT = 768;
const GRAVITY = 480;

function initBodies(W: number, H: number): Body[] {
  const small = W < BREAKPOINT;

  if (small) {
    return [
      {
        x: W * 0.22, y: H * 0.50, vx: 75, vy: 55,
        angle: 0, av: 0, radius: 44, mass: 130,
        type: "circle", w: 44, h: 44,
        stroke: "rgba(120,185,240,0.38)", fill: "rgba(120,185,240,0.03)",
        wireframe: true, dragging: false,
      },
      {
        x: W * 0.70, y: H * 0.35, vx: -60, vy: -50,
        angle: 0.3, av: 0.18, radius: 48, mass: 150,
        type: "square", w: 68, h: 68,
        stroke: "rgba(100,170,230,0.34)", fill: "rgba(100,170,230,0.03)",
        wireframe: false, dragging: false,
      },
      {
        x: W * 0.50, y: H * 0.75, vx: 55, vy: -65,
        angle: 0.5, av: 0.22, radius: 44, mass: 125,
        type: "triangle", w: 44, h: 44,
        stroke: "rgba(140,200,245,0.36)", fill: "rgba(140,200,245,0.03)",
        wireframe: false, dragging: false,
      },
    ];
  }

  return [
    {
      x: W * 0.19, y: H * 0.62, vx: 95, vy: 60,
      angle: 0, av: 0, radius: 58, mass: 170,
      type: "circle", w: 58, h: 58,
      stroke: "rgba(120,185,240,0.42)", fill: "rgba(120,185,240,0.03)",
      wireframe: true, dragging: false,
    },
    {
      x: W * 0.57, y: H * 0.28, vx: -70, vy: -55,
      angle: 0, av: 0, radius: 44, mass: 125,
      type: "circle", w: 44, h: 44,
      stroke: "rgba(180,215,250,0.36)", fill: "rgba(180,215,250,0.02)",
      wireframe: true, dragging: false,
    },
    {
      x: W * 0.81, y: H * 0.68, vx: -75, vy: 90,
      angle: 0, av: 0, radius: 52, mass: 150,
      type: "circle", w: 52, h: 52,
      stroke: "rgba(100,170,230,0.40)", fill: "rgba(100,170,230,0.03)",
      wireframe: true, dragging: false,
    },
    {
      x: W * 0.40, y: H * 0.45, vx: 45, vy: -58,
      angle: 0.3, av: 0.22, radius: 62, mass: 190,
      type: "square", w: 88, h: 88,
      stroke: "rgba(100,170,230,0.34)", fill: "rgba(100,170,230,0.03)",
      wireframe: false, dragging: false,
    },
    {
      x: W * 0.71, y: H * 0.22, vx: -58, vy: 72,
      angle: -0.2, av: -0.16, radius: 71, mass: 210,
      type: "rect", w: 128, h: 62,
      stroke: "rgba(140,195,245,0.55)", fill: "rgba(140,195,245,0.08)",
      wireframe: false, dragging: false,
    },
    {
      x: W * 0.14, y: H * 0.22, vx: 62, vy: 50,
      angle: 0.8, av: -0.19, radius: 62, mass: 190,
      type: "square", w: 88, h: 88,
      stroke: "rgba(160,210,250,0.30)", fill: "rgba(160,210,250,0.03)",
      wireframe: false, dragging: false,
    },
    {
      x: W * 0.86, y: H * 0.42, vx: -48, vy: -65,
      angle: 1.2, av: 0.14, radius: 62, mass: 190,
      type: "square", w: 88, h: 88,
      stroke: "rgba(120,185,240,0.30)", fill: "rgba(120,185,240,0.03)",
      wireframe: false, dragging: false,
    },
    {
      x: W * 0.31, y: H * 0.80, vx: 70, vy: -80,
      angle: 0.5, av: 0.28, radius: 52, mass: 145,
      type: "triangle", w: 52, h: 52,
      stroke: "rgba(100,170,230,0.36)", fill: "rgba(100,170,230,0.03)",
      wireframe: false, dragging: false,
    },
    {
      x: W * 0.63, y: H * 0.58, vx: -85, vy: 55,
      angle: 1.0, av: -0.22, radius: 46, mass: 130,
      type: "triangle", w: 46, h: 46,
      stroke: "rgba(180,215,250,0.32)", fill: "rgba(180,215,250,0.02)",
      wireframe: false, dragging: false,
    },
    {
      x: W * 0.48, y: H * 0.12, vx: 55, vy: 90,
      angle: -0.6, av: 0.20, radius: 50, mass: 140,
      type: "triangle", w: 50, h: 50,
      stroke: "rgba(140,200,245,0.34)", fill: "rgba(140,200,245,0.03)",
      wireframe: false, dragging: false,
    },
  ];
}

function resolveCollision(a: Body, b: Body) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const minDist = a.radius + b.radius;
  if (dist >= minDist || dist < 0.001) return;

  const nx = dx / dist;
  const ny = dy / dist;

  const overlap = minDist - dist;
  const totalMass = a.mass + b.mass;
  if (!a.dragging) { a.x -= nx * overlap * (b.mass / totalMass); a.y -= ny * overlap * (b.mass / totalMass); }
  if (!b.dragging) { b.x += nx * overlap * (a.mass / totalMass); b.y += ny * overlap * (a.mass / totalMass); }

  const dvx = b.vx - a.vx;
  const dvy = b.vy - a.vy;
  const vRel = dvx * nx + dvy * ny;
  if (vRel > 0) return;

  const e = 0.42;
  const j = -(1 + e) * vRel / (1 / a.mass + 1 / b.mass);
  if (!a.dragging) { a.vx -= (j / a.mass) * nx; a.vy -= (j / a.mass) * ny; }
  if (!b.dragging) { b.vx += (j / b.mass) * nx; b.vy += (j / b.mass) * ny; }
}

function hitTestRect(b: Body, x: number, y: number): boolean {
  const cos = Math.cos(-b.angle);
  const sin = Math.sin(-b.angle);
  const lx = cos * (x - b.x) - sin * (y - b.y);
  const ly = sin * (x - b.x) + cos * (y - b.y);
  return Math.abs(lx) <= b.w / 2 && Math.abs(ly) <= b.h / 2;
}

function drawBody(ctx: CanvasRenderingContext2D, b: Body, gravityOn: boolean) {
  ctx.save();
  ctx.lineWidth = 1.5;
  if (b.type === "circle") {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fillStyle = b.fill;
    ctx.fill();
    ctx.strokeStyle = b.stroke;
    ctx.stroke();
  } else if (b.type === "triangle") {
    ctx.translate(b.x, b.y);
    ctx.rotate(b.angle);
    ctx.beginPath();
    for (let i = 0; i < 3; i++) {
      const a = (i * 2 * Math.PI / 3) - Math.PI / 2;
      const vx = b.radius * Math.cos(a);
      const vy = b.radius * Math.sin(a);
      i === 0 ? ctx.moveTo(vx, vy) : ctx.lineTo(vx, vy);
    }
    ctx.closePath();
    ctx.fillStyle = b.fill;
    ctx.fill();
    ctx.strokeStyle = b.stroke;
    ctx.stroke();
  } else {
    ctx.translate(b.x, b.y);
    ctx.rotate(b.angle);
    ctx.beginPath();
    ctx.rect(-b.w / 2, -b.h / 2, b.w, b.h);
    ctx.fillStyle = b.fill;
    ctx.fill();
    ctx.strokeStyle = b.stroke;
    ctx.stroke();

    if (b.type === "rect") {
      // tint the rect fill green (on) or red (off)
      ctx.beginPath();
      ctx.rect(-b.w / 2, -b.h / 2, b.w, b.h);
      ctx.fillStyle = gravityOn
        ? "rgba(255,100,100,0.18)"
        : "rgba(80,220,140,0.18)";
      ctx.fill();

      ctx.font = "700 9px 'Space Grotesk', sans-serif";
      ctx.letterSpacing = "0.10em";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = gravityOn ? "rgba(255,160,160,0.90)" : "rgba(120,240,180,0.90)";
      ctx.fillText("ARTRON INHIBITOR", 0, -7);
      ctx.font = "700 11px 'Space Grotesk', sans-serif";
      ctx.fillText(gravityOn ? "OFF" : "ON", 0, 7);
    }
  }
  ctx.restore();
}

export default function PhysicsBackground({ height = "520px" }: { height?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const bodiesRef = useRef<Body[]>([]);
  const modeRef = useRef<"full" | "small">("full");
  const gravityRef = useRef<boolean>(false);
  const dragRef = useRef<{
    body: Body | null;
    prevX: number; prevY: number;
    prevTime: number;
    velX: number; velY: number;
  }>({ body: null, prevX: 0, prevY: 0, prevTime: 0, velX: 0, velY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const setSize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    setSize();

    const W = canvas.offsetWidth;
    modeRef.current = W < BREAKPOINT ? "small" : "full";
    bodiesRef.current = initBodies(W, canvas.offsetHeight);

    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.033);
      lastTime = now;

      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      const bodies = bodiesRef.current;
      const gravityOn = gravityRef.current;

      for (const b of bodies) {
        if (b.dragging) continue;
        if (gravityOn) b.vy += GRAVITY * dt;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        if (b.type !== "circle") b.angle += b.av * dt;

        const r = b.radius;
        if (b.x - r < 0)    { b.x = r;     b.vx =  Math.abs(b.vx) * 0.72; }
        if (b.x + r > W)    { b.x = W - r; b.vx = -Math.abs(b.vx) * 0.72; }
        if (b.y - r < 0)    { b.y = r;     b.vy =  Math.abs(b.vy) * 0.72; }
        if (b.y + r > H)    { b.y = H - r; b.vy = -Math.abs(b.vy) * (gravityOn ? 0.60 : 0.72); }
      }

      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          resolveCollision(bodies[i], bodies[j]);
        }
      }

      ctx.clearRect(0, 0, W, H);
      for (const b of bodies) drawBody(ctx, b, gravityOn);

      frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);

    const getXY = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onDown = (e: MouseEvent) => {
      const { x, y } = getXY(e);

      // check if the rect button was clicked
      for (const b of bodiesRef.current) {
        if (b.type === "rect" && hitTestRect(b, x, y)) {
          gravityRef.current = !gravityRef.current;
          return;
        }
      }

      for (const b of bodiesRef.current) {
        const dx = b.x - x, dy = b.y - y;
        if (Math.sqrt(dx * dx + dy * dy) <= b.radius) {
          b.dragging = true;
          b.vx = 0; b.vy = 0;
          dragRef.current = { body: b, prevX: x, prevY: y, prevTime: performance.now(), velX: 0, velY: 0 };
          break;
        }
      }
    };

    const onMove = (e: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag.body) return;
      const { x, y } = getXY(e);
      const now = performance.now();
      const elapsed = (now - drag.prevTime) / 1000;
      if (elapsed > 0) {
        drag.velX = (x - drag.prevX) / elapsed;
        drag.velY = (y - drag.prevY) / elapsed;
      }
      drag.body.x = x;
      drag.body.y = y;
      drag.prevX = x; drag.prevY = y;
      drag.prevTime = now;
    };

    const onUp = () => {
      const drag = dragRef.current;
      if (!drag.body) return;
      drag.body.vx = drag.velX * 0.6;
      drag.body.vy = drag.velY * 0.6;
      drag.body.dragging = false;
      dragRef.current.body = null;
    };

    window.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    const ro = new ResizeObserver(() => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);

      const W = canvas.offsetWidth;
      const newMode = W < BREAKPOINT ? "small" : "full";
      if (newMode !== modeRef.current) {
        modeRef.current = newMode;
        bodiesRef.current = initBodies(W, canvas.offsetHeight);
      }
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height, display: "block", cursor: "grab" }}
    />
  );
}
