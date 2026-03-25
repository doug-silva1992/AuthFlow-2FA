import { useState, useEffect, useRef } from "react";

// Minimal TOTP-like 6-digit code generator (simulated)
function generateSecret() {
  return Array.from({ length: 16 }, () => "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"[Math.floor(Math.random() * 32)]).join("");
}

function generateCode(secret) {
  // Simulated TOTP: changes every 30s based on time
  const step = Math.floor(Date.now() / 30000);
  let hash = 0;
  for (let i = 0; i < secret.length; i++) hash = ((hash << 5) - hash + secret.charCodeAt(i)) | 0;
  hash = Math.abs(hash ^ (step * 2654435761));
  return String(hash % 1000000).padStart(6, "0");
}

function QRCodeSVG({ value, size = 180 }) {
  // Simple visual QR placeholder that looks like a real QR code
  const modules = 21;
  const cellSize = size / modules;

  const seed = value.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = (i) => {
    let x = Math.sin(seed + i) * 10000;
    return x - Math.floor(x);
  };

  const isFinderPattern = (r, c) => {
    // Top-left, top-right, bottom-left finder patterns
    if (r < 7 && c < 7) return true;
    if (r < 7 && c >= modules - 7) return true;
    if (r >= modules - 7 && c < 7) return true;
    return false;
  };

  const finderCell = (r, c) => {
    const inTopLeft = r < 7 && c < 7;
    const inTopRight = r < 7 && c >= modules - 7;
    const inBotLeft = r >= modules - 7 && c < 7;
    let lr = r, lc = c;
    if (inTopRight) lc = c - (modules - 7);
    if (inBotLeft) lr = r - (modules - 7);
    if (inTopLeft || inTopRight || inBotLeft) {
      if (lr === 0 || lr === 6 || lc === 0 || lc === 6) return true;
      if (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4) return true;
      return false;
    }
    return false;
  };

  const cells = [];
  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      let dark;
      if (isFinderPattern(r, c)) {
        dark = finderCell(r, c);
      } else if (r === 6 || c === 6) {
        dark = (r + c) % 2 === 0;
      } else {
        dark = rng(r * modules + c) > 0.5;
      }
      if (dark) {
        cells.push(
          <rect
            key={`${r}-${c}`}
            x={c * cellSize}
            y={r * cellSize}
            width={cellSize}
            height={cellSize}
            fill="currentColor"
          />
        );
      }
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ color: "#e8e8f0" }}>
      {cells}
    </svg>
  );
}

function TimerRing({ seconds, total = 30 }) {
  const r = 14;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - seconds / total);
  return (
    <svg width="36" height="36" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r={r} fill="none" stroke="#1e1e2e" strokeWidth="3" />
      <circle
        cx="18" cy="18" r={r}
        fill="none"
        stroke={seconds <= 8 ? "#ff4d6d" : "#00e5c0"}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 18 18)"
        style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
      />
      <text x="18" y="22" textAnchor="middle" fontSize="10" fill="#e8e8f0" fontFamily="monospace" fontWeight="600">
        {seconds}
      </text>
    </svg>
  );
}

export default function QRCode({ onNavigate }) {
  const [secret] = useState(generateSecret);
  const [currentCode, setCurrentCode] = useState(() => generateCode(secret));
  const [timeLeft, setTimeLeft] = useState(30 - (Math.floor(Date.now() / 1000) % 30));
  const [input, setInput] = useState(["", "", "", "", "", ""]);
  const [phase, setPhase] = useState("scan"); // scan | verify
  const [status, setStatus] = useState("idle"); // idle | error | success
  const [shake, setShake] = useState(false);
  const refs = useRef([]);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("auth_user")) || {}; } catch { return {}; }
  })();

  useEffect(() => {
    const t = setInterval(() => {
      const secs = 30 - (Math.floor(Date.now() / 1000) % 30);
      setTimeLeft(secs);
      if (secs === 30) setCurrentCode(generateCode(secret));
    }, 1000);
    return () => clearInterval(t);
  }, [secret]);

  const handleDigit = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...input];
    next[i] = val.slice(-1);
    setInput(next);
    setStatus("idle");
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKey = (i, e) => {
    if (e.key === "Backspace" && !input[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
    if (e.key === "Enter") verifyCode();
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (paste.length === 6) {
      setInput(paste.split(""));
      setTimeout(verifyCode, 100);
    }
    e.preventDefault();
  };

  const verifyCode = () => {
    const entered = input.join("");
    if (entered.length < 6) return;
    if (entered === currentCode) {
      setStatus("success");
      setTimeout(() => onNavigate("success"), 800);
    } else {
      setStatus("error");
      setShake(true);
      setTimeout(() => { setShake(false); setInput(["", "", "", "", "", ""]); refs.current[0]?.focus(); }, 600);
    }
  };

  const otpauthUrl = `otpauth://totp/SecureApp:${user.email || "user"}?secret=${secret}&issuer=SecureApp`;

  return (
    <div className="page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inconsolata:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #0a0a0f;
          --surface: #111118;
          --border: #1e1e2e;
          --accent: #7c5cfc;
          --accent2: #00e5c0;
          --text: #e8e8f0;
          --muted: #555570;
          --danger: #ff4d6d;
        }
        .page {
          min-height: 100vh;
          background: var(--bg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inconsolata', monospace;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }
        .bg-glow-1 {
          position: fixed; top: -20%; left: 50%; transform: translateX(-50%);
          width: 800px; height: 400px;
          background: radial-gradient(ellipse, rgba(124,92,252,0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        .card {
          width: 100%;
          max-width: 440px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 4px;
          overflow: hidden;
          position: relative;
          z-index: 1;
          animation: up 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .top-bar {
          background: linear-gradient(135deg, rgba(124,92,252,0.15), rgba(0,229,192,0.08));
          border-bottom: 1px solid var(--border);
          padding: 28px 32px;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .step-badge {
          width: 40px; height: 40px;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }
        .top-info h2 {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 800;
          color: var(--text);
          letter-spacing: -0.01em;
        }
        .top-info p { font-size: 12px; color: var(--muted); margin-top: 2px; }
        .body { padding: 28px 32px; }
        .tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: var(--border);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 24px;
        }
        .tab {
          padding: 10px;
          font-size: 11px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-align: center;
          cursor: pointer;
          background: var(--bg);
          color: var(--muted);
          border: none;
          transition: all 0.2s;
        }
        .tab.active { background: var(--accent); color: #fff; }
        .qr-wrap {
          background: #fff;
          border-radius: 8px;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          width: fit-content;
          box-shadow: 0 0 0 1px rgba(124,92,252,0.3);
        }
        .secret-box {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 3px;
          padding: 10px 14px;
          font-size: 13px;
          letter-spacing: 0.12em;
          color: var(--accent2);
          text-align: center;
          margin-bottom: 20px;
          word-break: break-all;
        }
        .info-steps { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
        .info-step {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: 12px; color: var(--muted); line-height: 1.5;
        }
        .step-num {
          width: 20px; height: 20px;
          border: 1px solid var(--border);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; color: var(--accent);
          flex-shrink: 0;
          margin-top: 1px;
        }
        .verify-section { text-align: center; }
        .verify-section p { font-size: 13px; color: var(--muted); margin-bottom: 20px; line-height: 1.6; }
        .live-code {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          margin-bottom: 24px;
        }
        .live-code-value {
          font-size: 24px;
          font-weight: 500;
          letter-spacing: 0.2em;
          color: var(--accent2);
        }
        .digits-wrap {
          display: flex; gap: 8px; justify-content: center; margin-bottom: 20px;
        }
        .digit-input {
          width: 44px; height: 54px;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 4px;
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: var(--text);
          text-align: center;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          caret-color: var(--accent);
        }
        .digit-input:focus { border-color: var(--accent); background: rgba(124,92,252,0.07); }
        .digit-input.has-val { border-color: rgba(124,92,252,0.5); color: var(--accent2); }
        .digit-input.err { border-color: var(--danger); background: rgba(255,77,109,0.07); }
        .digit-input.ok { border-color: var(--accent2); background: rgba(0,229,192,0.07); }
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-6px)}
          40%{transform:translateX(6px)}
          60%{transform:translateX(-4px)}
          80%{transform:translateX(4px)}
        }
        .shake { animation: shake 0.5s ease; }
        .verify-btn {
          width: 100%;
          padding: 13px;
          background: var(--accent);
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border: none;
          border-radius: 3px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .verify-btn:hover { background: #8f6dff; transform: translateY(-1px); }
        .verify-btn:disabled { opacity: 0.4; transform: none; cursor: not-allowed; }
        .err-text { color: var(--danger); font-size: 12px; margin-bottom: 12px; }
        .back { text-align: center; font-size: 12px; color: var(--muted); margin-top: 16px; cursor: pointer; }
        .back:hover { color: var(--accent); }
      `}</style>
      <div className="bg-glow-1" />

      <div className="card">
        <div className="top-bar">
          <div className="step-badge">🔐</div>
          <div className="top-info">
            <h2>Autenticação em 2 Fatores</h2>
            <p>Configure o 2FA para proteger sua conta</p>
          </div>
        </div>

        <div className="body">
          <div className="tabs">
            <button className={`tab ${phase === "scan" ? "active" : ""}`} onClick={() => setPhase("scan")}>
              1. Escanear
            </button>
            <button className={`tab ${phase === "verify" ? "active" : ""}`} onClick={() => setPhase("verify")}>
              2. Verificar
            </button>
          </div>

          {phase === "scan" ? (
            <>
              <div className="qr-wrap">
                <QRCodeSVG value={otpauthUrl} size={172} />
              </div>

              <div className="secret-box">{secret}</div>

              <div className="info-steps">
                <div className="info-step">
                  <span className="step-num">1</span>
                  <span>Abra o <strong style={{color:"var(--text)"}}>Google Authenticator</strong> ou <strong style={{color:"var(--text)"}}>Authy</strong> no seu celular.</span>
                </div>
                <div className="info-step">
                  <span className="step-num">2</span>
                  <span>Toque em <strong style={{color:"var(--text)"}}>+ → Escanear QR code</strong> e aponte para o código acima.</span>
                </div>
                <div className="info-step">
                  <span className="step-num">3</span>
                  <span>Alternativamente, insira a chave secreta manualmente no app.</span>
                </div>
              </div>

              <button className="verify-btn" onClick={() => setPhase("verify")}>
                Já escaniei → Verificar código
              </button>
            </>
          ) : (
            <div className="verify-section">
              <p>Digite o código de 6 dígitos exibido no<br />seu aplicativo autenticador.</p>

              <div className="live-code">
                <span style={{fontSize:"11px",color:"var(--muted)",textTransform:"uppercase",letterSpacing:"0.08em"}}>Código atual:</span>
                <span className="live-code-value">{currentCode}</span>
                <TimerRing seconds={timeLeft} />
              </div>

              {status === "error" && <p className="err-text">✗ Código inválido. Tente novamente.</p>}

              <div className={`digits-wrap ${shake ? "shake" : ""}`} onPaste={handlePaste}>
                {input.map((v, i) => (
                  <input
                    key={i}
                    ref={(el) => (refs.current[i] = el)}
                    className={`digit-input ${status === "error" ? "err" : ""} ${status === "success" ? "ok" : ""} ${v ? "has-val" : ""}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={v}
                    onChange={(e) => handleDigit(i, e.target.value)}
                    onKeyDown={(e) => handleKey(i, e)}
                  />
                ))}
              </div>

              <button
                className="verify-btn"
                onClick={verifyCode}
                disabled={input.join("").length < 6 || status === "success"}
              >
                {status === "success" ? "✓ Verificado!" : "Confirmar →"}
              </button>

              <p className="back" onClick={() => setPhase("scan")}>← Voltar para o QR code</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
