import { useEffect, useState } from "react";

export default function Success({ onNavigate }) {
  const [visible, setVisible] = useState(false);
  const [particles, setParticles] = useState([]);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("auth_user")) || {}; } catch { return {}; }
  })();

  const getInitials = (name) =>
    (name || "U").split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    setParticles(
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 1.2,
        dur: 1.5 + Math.random() * 1.5,
        size: 4 + Math.random() * 6,
        color: ["#7c5cfc", "#00e5c0", "#ff4d6d", "#ffd700", "#fff"][Math.floor(Math.random() * 5)],
      }))
    );
  }, []);

  const now = new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

  const cards = [
    { icon: "🛡️", label: "Status 2FA", value: "Ativo" },
    { icon: "📍", label: "Localização", value: "São Paulo, BR" },
    { icon: "🕐", label: "Login em", value: now },
    { icon: "💻", label: "Dispositivo", value: "Web" },
  ];

  return (
    <div className="page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inconsolata:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #0a0a0f;
          --surface: #111118;
          --surface2: #16161f;
          --border: #1e1e2e;
          --accent: #7c5cfc;
          --accent2: #00e5c0;
          --text: #e8e8f0;
          --muted: #555570;
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
        .bg-center {
          position: fixed;
          top: 50%; left: 50%;
          transform: translate(-50%,-50%);
          width: 800px; height: 800px;
          background: radial-gradient(circle, rgba(0,229,192,0.07) 0%, rgba(124,92,252,0.06) 40%, transparent 70%);
          pointer-events: none;
        }
        .particle {
          position: fixed;
          border-radius: 50%;
          opacity: 0;
          pointer-events: none;
        }
        @keyframes confetti {
          0% { opacity: 1; transform: translateY(0) rotate(0deg); }
          100% { opacity: 0; transform: translateY(-80px) rotate(360deg); }
        }
        .card {
          width: 100%;
          max-width: 460px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 4px;
          overflow: hidden;
          position: relative;
          z-index: 1;
          opacity: 0;
          transform: scale(0.96) translateY(20px);
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .card.show { opacity: 1; transform: scale(1) translateY(0); }
        .card-top {
          background: linear-gradient(135deg, rgba(0,229,192,0.12), rgba(124,92,252,0.1));
          border-bottom: 1px solid var(--border);
          padding: 40px 32px 32px;
          text-align: center;
          position: relative;
        }
        .check-ring {
          width: 72px; height: 72px;
          margin: 0 auto 20px;
          position: relative;
        }
        .check-ring svg { width: 100%; height: 100%; }
        @keyframes drawCircle {
          from { stroke-dashoffset: 220; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes drawCheck {
          from { stroke-dashoffset: 50; }
          to { stroke-dashoffset: 0; }
        }
        .ring-circle {
          stroke-dasharray: 220;
          stroke-dashoffset: 220;
          animation: drawCircle 0.8s cubic-bezier(0.4,0,0.2,1) 0.3s forwards;
        }
        .check-path {
          stroke-dasharray: 50;
          stroke-dashoffset: 50;
          animation: drawCheck 0.4s ease 1s forwards;
        }
        h1 {
          font-family: 'Syne', sans-serif;
          font-size: 26px;
          font-weight: 800;
          color: var(--text);
          letter-spacing: -0.02em;
          margin-bottom: 6px;
        }
        .sub { font-size: 13px; color: var(--muted); line-height: 1.6; }
        .card-body { padding: 28px 32px 32px; }
        .user-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 4px;
          margin-bottom: 20px;
        }
        .avatar {
          width: 44px; height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 16px;
          color: #fff;
          flex-shrink: 0;
        }
        .user-info strong {
          display: block;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: var(--text);
        }
        .user-info span { font-size: 12px; color: var(--muted); }
        .badge-2fa {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(0,229,192,0.1);
          border: 1px solid rgba(0,229,192,0.25);
          border-radius: 20px;
          padding: 5px 10px;
          font-size: 11px;
          color: var(--accent2);
          font-weight: 500;
          flex-shrink: 0;
        }
        .badge-2fa-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent2); animation: blink 2s infinite; }
        @keyframes blink { 0%,100%{opacity:1}50%{opacity:0.2} }
        .meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 24px;
        }
        .meta-card {
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 14px;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.4s ease;
        }
        .meta-card.show { opacity: 1; transform: translateY(0); }
        .meta-icon { font-size: 18px; margin-bottom: 8px; }
        .meta-label { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 2px; }
        .meta-val { font-size: 13px; color: var(--text); font-weight: 500; }
        .actions { display: flex; gap: 10px; }
        .btn-primary {
          flex: 1;
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
        .btn-primary:hover { background: #8f6dff; transform: translateY(-1px); }
        .btn-secondary {
          padding: 13px 20px;
          background: transparent;
          color: var(--muted);
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border: 1px solid var(--border);
          border-radius: 3px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-secondary:hover { color: var(--text); border-color: var(--muted); }
      `}</style>

      <div className="bg-center" />

      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.x}%`,
            bottom: "30%",
            width: p.size,
            height: p.size,
            background: p.color,
            animation: `confetti ${p.dur}s ease-out ${p.delay}s both`,
          }}
        />
      ))}

      <div className={`card ${visible ? "show" : ""}`}>
        <div className="card-top">
          <div className="check-ring">
            <svg viewBox="0 0 72 72" fill="none">
              <circle cx="36" cy="36" r="34" stroke="var(--border)" strokeWidth="2" />
              <circle
                className="ring-circle"
                cx="36" cy="36" r="34"
                stroke="var(--accent2)"
                strokeWidth="2.5"
                strokeLinecap="round"
                transform="rotate(-90 36 36)"
              />
              <path
                className="check-path"
                d="M22 36L31 46L50 27"
                stroke="var(--accent2)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1>Acesso autorizado</h1>
          <p className="sub">Autenticação de dois fatores verificada com<br />sucesso. Você está logado.</p>
        </div>

        <div className="card-body">
          <div className="user-row">
            <div className="avatar">{getInitials(user.name)}</div>
            <div className="user-info">
              <strong>{user.name || "Usuário"}</strong>
              <span>{user.email || "—"}</span>
            </div>
            <div className="badge-2fa">
              <span className="badge-2fa-dot" />
              2FA Ativo
            </div>
          </div>

          <div className="meta-grid">
            {cards.map((c, i) => (
              <div
                key={c.label}
                className={`meta-card ${visible ? "show" : ""}`}
                style={{ transitionDelay: `${0.5 + i * 0.1}s` }}
              >
                <div className="meta-icon">{c.icon}</div>
                <div className="meta-label">{c.label}</div>
                <div className="meta-val">{c.value}</div>
              </div>
            ))}
          </div>

          <div className="actions">
            <button className="btn-primary" onClick={() => alert("Painel carregado!")}>
              Ir para o painel →
            </button>
            <button className="btn-secondary" onClick={() => {
              localStorage.removeItem("auth_user");
              onNavigate("login");
            }}>
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
