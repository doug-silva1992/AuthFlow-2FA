import { useState } from "react";

export default function Login({ onNavigate }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) return setError("Preencha todos os campos.");
    setLoading(true);
    setTimeout(() => {
      const stored = localStorage.getItem("auth_user");
      if (!stored) {
        setError("Conta não encontrada. Cadastre-se primeiro.");
        setLoading(false);
        return;
      }
      const user = JSON.parse(stored);
      if (user.email !== form.email) {
        setError("E-mail ou senha incorretos.");
        setLoading(false);
        return;
      }
      setLoading(false);
      onNavigate("qrcode");
    }, 1000);
  };

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
        .page::before {
          content: '';
          position: fixed;
          bottom: -30%;
          right: -10%;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(124,92,252,0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        .page::after {
          content: '';
          position: fixed;
          top: -20%;
          left: -15%;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(0,229,192,0.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .card {
          width: 100%;
          max-width: 420px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 48px 40px;
          position: relative;
          z-index: 1;
          animation: fadeIn 0.45s cubic-bezier(0.16,1,0.3,1) both;
        }
        .card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--accent2), var(--accent));
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .logo-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 28px;
        }
        .logo-icon {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 16px;
          color: #fff;
        }
        .logo-name {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 16px;
          color: var(--text);
          letter-spacing: -0.01em;
        }
        h1 {
          font-family: 'Syne', sans-serif;
          font-size: 26px;
          font-weight: 800;
          color: var(--text);
          margin-bottom: 6px;
          letter-spacing: -0.02em;
        }
        .subtitle { font-size: 13px; color: var(--muted); margin-bottom: 32px; }
        form { display: flex; flex-direction: column; gap: 16px; }
        .field { display: flex; flex-direction: column; gap: 7px; }
        label { font-size: 11px; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; }
        .input-wrap { position: relative; }
        input {
          width: 100%;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 3px;
          padding: 12px 14px;
          font-family: 'Inconsolata', monospace;
          font-size: 14px;
          color: var(--text);
          outline: none;
          transition: border-color 0.2s;
        }
        input::placeholder { color: var(--muted); }
        input:focus { border-color: var(--accent); }
        .toggle-pass {
          position: absolute;
          right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          color: var(--muted); cursor: pointer;
          font-size: 13px;
          padding: 0;
          margin: 0;
          transition: color 0.2s;
        }
        .toggle-pass:hover { color: var(--text); }
        .error-box {
          background: rgba(255,77,109,0.1);
          border: 1px solid rgba(255,77,109,0.3);
          border-radius: 3px;
          padding: 10px 14px;
          font-size: 12px;
          color: #ff4d6d;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        button.submit {
          margin-top: 8px;
          padding: 14px;
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
        button.submit:hover { background: #8f6dff; transform: translateY(-1px); }
        button.submit:active { transform: translateY(0); }
        button.submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .divider {
          display: flex; align-items: center; gap: 12px;
          margin: 20px 0 16px;
        }
        .divider-line { flex: 1; height: 1px; background: var(--border); }
        .divider span { font-size: 11px; color: var(--muted); }
        .footer-link { text-align: center; font-size: 12px; color: var(--muted); }
        .footer-link a { color: var(--accent); cursor: pointer; text-decoration: none; }
        .footer-link a:hover { color: var(--accent2); }
        .spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
          margin-right: 8px;
          vertical-align: middle;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .hint {
          font-size: 11px;
          color: var(--muted);
          text-align: right;
          cursor: pointer;
          margin-top: -8px;
        }
        .hint:hover { color: var(--accent2); }
      `}</style>

      <div className="card">
        <div className="logo-wrap">
          <div className="logo-icon">S</div>
          <span className="logo-name">SecureApp</span>
        </div>

        <h1>Bem-vindo</h1>
        <p className="subtitle">Entre com suas credenciais para acessar.</p>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-box">⚠ {error}</div>}

          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="voce@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="field">
            <label htmlFor="password">Senha</label>
            <div className="input-wrap">
              <input
                id="password"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={{ paddingRight: "40px" }}
              />
              <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)}>
                {showPass ? "●" : "○"}
              </button>
            </div>
          </div>

          <p className="hint">Esqueceu a senha?</p>

          <button type="submit" className="submit" disabled={loading}>
            {loading ? <><span className="spinner" />Verificando...</> : "Entrar →"}
          </button>
        </form>

        <div className="divider">
          <div className="divider-line" />
          <span>ou</span>
          <div className="divider-line" />
        </div>

        <p className="footer-link">
          Não tem conta? <a onClick={() => onNavigate("register")}>Criar conta</a>
        </p>
      </div>
    </div>
  );
}
