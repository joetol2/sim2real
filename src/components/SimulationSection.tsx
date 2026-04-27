import { useEffect, useRef, useState } from "react";

const CANVAS_W = 1300;
const CANVAS_H = 950;

const loadedScripts = new Set<string>();

function SimCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scaleRef = useRef(1);

  useEffect(() => {
    const w = window as any;

    w.ATOMS = [];
    w.BONDS = [];
    w.THINGS = [];
    w.CONTACTS = [];
    w.COLLIDES = [];
    w.LAYER_FILTERS = [["DEFAULT", "DEFAULT"]];

    const origAlert = window.alert;
    window.alert = () => {};

    const origSetInterval = window.setInterval;
    const intervalIds: number[] = [];
    (window as any).setInterval = function (fn: TimerHandler, delay?: number, ...args: unknown[]) {
      const id = origSetInterval(fn as TimerHandler, delay, ...args) as unknown as number;
      intervalIds.push(id);
      return id;
    };

    const loadScript = (src: string): Promise<void> =>
      new Promise((resolve) => {
        if (loadedScripts.has(src)) { resolve(); return; }
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => { loadedScripts.add(src); resolve(); };
        script.onerror = () => { console.warn("fizx: failed to load", src); resolve(); };
        document.head.appendChild(script);
      });

    const base = import.meta.env.BASE_URL;
    const v = "4";
    const scripts = [
      `${base}fizx/fizx.js?v=${v}`,
      `${base}fizx/ball16.js?v=${v}`,
      `${base}fizx/ball23.js?v=${v}`,
      `${base}fizx/delaunay.js?v=${v}`,
      `${base}fizx/display_canvas.js?v=${v}`,
      `${base}fizx/test.js?v=${v}`,
    ];

    (async () => {
      for (const src of scripts) await loadScript(src);
      window.alert = origAlert;
      (window as any).setInterval = origSetInterval;
      if (typeof w.first_run === "function") w.first_run();
    })();

    const updateScale = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const scale = containerRef.current.clientWidth / CANVAS_W;
      scaleRef.current = scale;
      canvasRef.current.style.transform = `scale(${scale})`;
      containerRef.current.style.height = `${CANVAS_H * scale}px`;
    };

    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) observer.observe(containerRef.current);
    updateScale();

    return () => {
      observer.disconnect();
      intervalIds.forEach((id) => clearInterval(id));
      window.alert = origAlert;
      (window as any).setInterval = origSetInterval;
      w.ATOMS = [];
      w.BONDS = [];
      w.THINGS = [];
      w.CONTACTS = [];
      w.COLLIDES = [];
      w.LAYER_FILTERS = [["DEFAULT", "DEFAULT"]];
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const w = window as any;
    if (!w.nmouse || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scale = scaleRef.current;
    w.nmouse.x = (e.clientX - rect.left) / scale;
    w.nmouse.y = CANVAS_H - (e.clientY - rect.top) / scale;
  };

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", overflow: "hidden", position: "relative" }}
    >
      <canvas
        ref={canvasRef}
        id="canvas"
        width={CANVAS_W}
        height={CANVAS_H}
        style={{ transformOrigin: "top left", display: "block" }}
        onMouseMove={handleMouseMove}
        onMouseDown={() => { const w = window as any; if (w.nmouse) w.nmouse.d = true; }}
        onMouseUp={() => { const w = window as any; if (w.nmouse) w.nmouse.d = false; }}
      />
    </div>
  );
}

const SimulationSection = () => {
  const [resetKey, setResetKey] = useState(0);

  return (
    <section className="py-24 sm:py-32 border-t border-border">
      <div className="max-w-6xl mx-auto px-8 sm:px-12 lg:px-20">
        <p className="text-base font-heading tracking-[0.3em] uppercase text-muted-foreground mb-6">
          Physics simulation
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-semibold tracking-tight leading-[1.15] mb-10">
          Soft-body dynamics in the browser.
        </h2>
        <SimCanvas key={resetKey} />
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Drag objects to interact.
          </p>
          <button
            onClick={() => setResetKey(k => k + 1)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-300 ml-4 shrink-0"
          >
            Reset
          </button>
        </div>
      </div>
    </section>
  );
};

export default SimulationSection;
