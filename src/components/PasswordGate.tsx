import { useState, useEffect, useRef } from "react";

const PASSWORD = "s2rVIP";
const SESSION_KEY = "sim2real_gate_ok";

const PasswordGate = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<"locked" | "unlocking" | "unlocked">("locked");
  const [value, setValue] = useState("");
  const [shake, setShake] = useState(false);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      setStatus("unlocked");
    } else {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, []);

  function tryPassword() {
    if (value === PASSWORD) {
      setStatus("unlocking");
      sessionStorage.setItem(SESSION_KEY, "1");
      setTimeout(() => setStatus("unlocked"), 600);
    } else {
      setError(true);
      setShake(false);
      requestAnimationFrame(() => setShake(true));
      setValue("");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") tryPassword();
    if (error) setError(false);
  }

  if (status === "unlocked") return <>{children}</>;

  return (
    <>
      {/* Blurred page content behind gate */}
      <div
        style={{
          filter: "blur(8px)",
          transform: "scale(1.01)",
          pointerEvents: "none",
          userSelect: "none",
          transition: "filter 0.6s ease, transform 0.6s ease",
          ...(status === "unlocking" ? { filter: "none", transform: "scale(1)" } : {}),
        }}
      >
        {children}
      </div>

      {/* Gate overlay */}
      <div
        id="gate"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(13, 28, 61, 0.55)",
          backdropFilter: "blur(18px) saturate(1.4)",
          WebkitBackdropFilter: "blur(18px) saturate(1.4)",
          transition: "opacity 0.55s ease, transform 0.55s ease",
          ...(status === "unlocking"
            ? { opacity: 0, transform: "scale(1.04)", pointerEvents: "none" }
            : {}),
        }}
      >
        <div className="gate-card">
          {/* Lock icon */}
          <div style={{ display: "inline-flex", marginBottom: 12 }}>
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
              <rect width="38" height="38" rx="10" fill="rgba(255,255,255,0.12)" />
              <path d="M19 8C15.13 8 12 11.13 12 15v2H10v13h18V17h-2v-2c0-3.87-3.13-7-7-7zm0 2.5c2.48 0 4.5 2.02 4.5 4.5v2h-9v-2c0-2.48 2.02-4.5 4.5-4.5zm0 10a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" fill="white" />
            </svg>
          </div>

          <div className="gate-brand">sim2real</div>
          <h2 className="gate-title">Access Required</h2>
          <p className="gate-subtitle">
            This section is restricted.<br />Enter the access code to continue.
          </p>

          <div className={`gate-input-wrap${shake ? " shake" : ""}${error ? " error" : ""}`}
            onAnimationEnd={() => setShake(false)}
          >
            <input
              ref={inputRef}
              type="password"
              placeholder="Enter access code"
              autoComplete="current-password"
              value={value}
              onChange={e => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="gate-input"
            />
            <button onClick={tryPassword} className="gate-btn">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 9h12M10 4l5 5-5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className={`gate-error${error ? " visible" : ""}`}>
            Incorrect code — try again
          </div>
        </div>
      </div>
    </>
  );
};

export default PasswordGate;
