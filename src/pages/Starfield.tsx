import { useEffect, useRef, useState } from "react";

// Sandbox page — intentionally not linked from anywhere. Reach it at /starfield.
// A "warp speed" starfield header, modeled on the canvas effect in the
// sharedsapience.com header (reconstructed from its markup, not their source).

type Settings = {
  starCount: number;
  speed: number;
  fov: number;
  trail: number; // 0 = long trails, 1 = no trails
  color: string;
  followMouse: boolean;
};

const DEFAULTS: Settings = {
  starCount: 220,
  speed: 6.5,
  fov: 266,
  trail: 0.14,
  color: "#c8dcff",
  followMouse: true,
};

// How quickly the center eases toward its target each frame (0-1).
const CENTER_EASE = 0.08;

type Star = { x: number; y: number; z: number; pz: number };

const hexToRgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
};

const SpeedField = ({ settings }: { settings: Settings }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let w = 0;
    let h = 0;
    const stars: Star[] = [];
    let running = true;
    let raf = 0;
    // Vanishing point the stars fly out of, and where it's easing toward.
    // null target = no pointer over the header, so ease back to the middle.
    let cx = 0;
    let cy = 0;
    let target: { x: number; y: number } | null = null;

    const spawn = (s: Star = { x: 0, y: 0, z: 0, pz: 0 }) => {
      s.x = (Math.random() - 0.5) * w;
      s.y = (Math.random() - 0.5) * h;
      s.z = Math.random() * w;
      s.pz = s.z;
      return s;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!target) {
        cx = w / 2;
        cy = h / 2;
      }
    };

    const frame = () => {
      const { starCount, speed, fov, trail, color, followMouse } = settingsRef.current;

      const tx = followMouse && target ? target.x : w / 2;
      const ty = followMouse && target ? target.y : h / 2;
      cx += (tx - cx) * CENTER_EASE;
      cy += (ty - cy) * CENTER_EASE;

      // Keep the star pool in sync with the slider.
      while (stars.length < starCount) stars.push(spawn());
      if (stars.length > starCount) stars.length = starCount;

      const v = reduce.matches ? Math.min(speed, 0.5) : speed;
      canvas.dataset.motion = reduce.matches ? "reduced" : "active";

      // Translucent clear leaves motion trails behind each star.
      ctx.fillStyle = `rgba(5,6,10,${trail})`;
      ctx.fillRect(0, 0, w, h);

      const rgb = hexToRgb(color);
      for (const s of stars) {
        s.pz = s.z;
        s.z -= v;
        if (s.z < 1) {
          spawn(s);
          s.z = s.pz = w;
          continue;
        }

        const k = fov / s.z;
        const pk = fov / s.pz;
        const x = s.x * k + cx;
        const y = s.y * k + cy;
        const px = s.x * pk + cx;
        const py = s.y * pk + cy;
        if (x < 0 || x > w || y < 0 || y > h) {
          spawn(s);
          continue;
        }

        const t = Math.max(0, 1 - s.z / w); // closer = brighter, thicker
        ctx.strokeStyle = `rgba(${rgb},${t})`;
        ctx.lineWidth = t * 2;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      if (running) raf = requestAnimationFrame(frame);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Pause when the header scrolls offscreen.
    const io = new IntersectionObserver(([entry]) => {
      const was = running;
      running = entry.isIntersecting;
      if (running && !was) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);

    // Track the pointer over the whole header (the title sits above the canvas).
    const area = canvas.parentElement ?? canvas;
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      target = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => {
      target = null;
    };
    area.addEventListener("pointermove", onMove);
    area.addEventListener("pointerleave", onLeave);

    raf = requestAnimationFrame(frame);

    return () => {
      running = false;
      area.removeEventListener("pointermove", onMove);
      area.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
      role="presentation"
      data-motion="active"
    />
  );
};

const Slider = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) => (
  <label className="flex flex-col gap-1 text-xs text-white/70">
    <span className="flex justify-between">
      <span>{label}</span>
      <span className="font-mono text-white">{value}</span>
    </span>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="accent-white"
    />
  </label>
);

const Starfield = () => {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const set = <K extends keyof Settings>(key: K) => (v: Settings[K]) =>
    setSettings((s) => ({ ...s, [key]: v }));

  return (
    <main className="min-h-screen text-white" style={{ backgroundColor: "#012b62" }}>
      <header className="relative flex h-[70vh] items-center justify-center overflow-hidden">
        <SpeedField settings={settings} />
        <div className="relative text-center">
          <h1 className="text-2xl font-bold tracking-tight md:text-4xl">Starfield</h1>
          <p className="mt-2 text-xs text-white/60">Play with the controls below</p>
        </div>
      </header>

      <section className="border-t">
        <div className="mx-auto grid max-w-3xl gap-6 px-4 py-10 sm:grid-cols-2">
          <Slider label="Stars" value={settings.starCount} min={0} max={2000} step={10} onChange={set("starCount")} />
          <Slider label="Speed" value={settings.speed} min={0} max={40} step={0.5} onChange={set("speed")} />
          <Slider label="Field of view" value={settings.fov} min={32} max={512} step={1} onChange={set("fov")} />
          <Slider label="Trail clear (low = long trails)" value={settings.trail} min={0.02} max={1} step={0.01} onChange={set("trail")} />
          <label className="flex items-center justify-between text-xs text-white/70">
            <span>Star color</span>
            <input
              type="color"
              value={settings.color}
              onChange={(e) => set("color")(e.target.value)}
              className="h-8 w-14 cursor-pointer rounded bg-transparent"
            />
          </label>
          <label className="flex items-center gap-2 text-xs text-white/70">
            <input
              type="checkbox"
              checked={settings.followMouse}
              onChange={(e) => set("followMouse")(e.target.checked)}
              className="h-4 w-4 accent-white"
            />
            <span>Center follows mouse</span>
          </label>
          <button
            onClick={() => setSettings(DEFAULTS)}
            className="rounded border border-white/20 px-3 py-2 text-xs hover:bg-white/10"
          >
            Reset to defaults
          </button>
        </div>
      </section>
    </main>
  );
};

export default Starfield;
