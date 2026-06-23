import { useEffect, useRef } from "react";

interface Body {
  x: number; y: number;
  vx: number; vy: number;
  angle: number; av: number;
  radius: number; mass: number;
  type: "circle" | "square" | "rect";
  w: number; h: number;
  stroke: string; fill: string;
  wireframe: boolean;
  dragging: boolean;
}

function initBodies(W: number, H: number): Body[] {
  return [
    {
      x: W * 0.19, y: H * 0.62, vx: 95, vy: 60,
      angle: 0, av: 0, radius: 58, mass: 170,
      type: "circle", w: 58, h: 58,
      stroke: "rgba(200,228,255,0.88)", fill: "rgba(200,228,255,0.06)",
      wireframe: true, dragging: false,
    },
    {
      x: W * 0.57, y: H * 0.28, vx: -70, vy: -55,
      angle: 0, av: 0, radius: 44, mass: 125,
      type: "circle", w: 44, h: 44,
      stroke: "rgba(255,255,255,0.82)", fill: "rgba(255,255,255,0.05)",
      wireframe: true, dragging: false,
    },
    {
      x: W * 0.81, y: H * 0.68, vx: -75, vy: 90,
      angle: 0, av: 0, radius: 52, mass: 150,
      type: "circle", w: 52, h: 52,
      stroke: "rgba(155,205,245,0.88)", fill: "rgba(155,205,245,0.06)",
      wireframe: true, dragging: false,
    },
    {
      x: W * 0.40, y: H * 0.45, vx: 45, vy: -58,
      angle: 0.3, av: 0.22, radius: 62, mass: 190,
      type: "square", w: 88, h: 88,
      stroke: "rgba(220,238,255,0.70)", fill: "rgba(220,238,255,0.07)",
      wireframe: false, dragging: false,
    },
    {
      x: W * 0.71, y: H * 0.22, vx: -58, vy: 72,
      angle: -0.2, av: -0.16, radius: 71, mass: 210,
      type: "rect", w: 128, h: 62,
      stroke: "rgba(175,215,250,0.70)", fill: "rgba(175,215,250,0.07)",
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

  // push apart so they don't overlap
  const overlap = minDist - dist;
  const totalMass = a.mass + b.mass;
  if (!a.dragging) { a.x -= nx * overlap * (b.mass / totalMass); a.y -= ny * overlap * (b.mass / totalMass); }
  if (!b.dragging) { b.x += nx * overlap * (a.mass / totalMass); b.y += ny * overlap * (a.mass / totalMass); }

  // velocity component along collision normal
  const dvx = b.vx - a.vx;
  const dvy = b.vy - a.vy;
  const vRel = dvx * nx + dvy * ny;
  if (vRel > 0) return; // already separating

  const e = 0.42;
  const j = -(1 + e) * vRel / (1 / a.mass + 1 / b.mass);
  if (!a.dragging) { a.vx -= (j / a.mass) * nx; a.vy -= (j / a.mass) * ny; }
  if (!b.dragging) { b.vx += (j / b.mass) * nx; b.vy += (j / b.mass) * ny; }
}

function drawBody(ctx: CanvasRenderingContext2D, b: Body) {
  ctx.save();
  ctx.lineWidth = 1.5;
  if (b.type === "circle") {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
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
  }
  ctx.restore();
}

function SimCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const bodiesRef = useRef<Body[]>([]);
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
    const H = canvas.offsetHeight;
    bodiesRef.current = initBodies(W, H);

    let lastTime = performance.now();

    const loop = (now: number) => {
      const rawDt = (now - lastTime) / 1000;
      const dt = Math.min(rawDt, 0.033);
      lastTime = now;

      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      const bodies = bodiesRef.current;

      for (const b of bodies) {
        if (b.dragging) continue;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        if (b.type !== "circle") b.angle += b.av * dt;

        const r = b.radius;
        if (b.x - r < 0)    { b.x = r;     b.vx =  Math.abs(b.vx) * 0.72; }
        if (b.x + r > W)    { b.x = W - r; b.vx = -Math.abs(b.vx) * 0.72; }
        if (b.y - r < 0)    { b.y = r;     b.vy =  Math.abs(b.vy) * 0.72; }
        if (b.y + r > H)    { b.y = H - r; b.vy = -Math.abs(b.vy) * 0.72; }
      }

      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          resolveCollision(bodies[i], bodies[j]);
        }
      }

      ctx.clearRect(0, 0, W, H);
      for (const b of bodies) drawBody(ctx, b);

      frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);

    const getXY = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onDown = (e: MouseEvent) => {
      const { x, y } = getXY(e);
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

    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    const ro = new ResizeObserver(() => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(frameRef.current);
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "520px", display: "block", cursor: "grab" }}
    />
  );
}

const SimulationSection2 = () => (
  <section className="border-t border-border">
    <SimCanvas />
  </section>
);

export default SimulationSection2;
