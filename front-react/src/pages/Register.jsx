import { useState } from "react";

export default function Register({ onNavigate }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Nome obrigatório";
    if (!form.email.includes("@")) e.email = "E-mail inválido";
    if (form.password.length < 8) e.password = "Mínimo 8 caracteres";
    if (form.password !== form.confirm) e.confirm = "Senhas não coincidem";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("auth_user", JSON.stringify({ name: form.name, email: form.email }));
      setLoading(false);
      onNavigate("qrcode");
    }, 1200);
  };

  const Field = ({ id, label, type = "text", placeholder }) => (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={form[id]}
        onChange={(ev) => { setForm({ ...form, [id]: ev.target.value }); setErrors({ ...errors, [id]: "" }); }}
        className={errors[id] ? "error" : ""}
      />
      {errors[id] && <span className="err-msg">{errors[id]}</span>}
    </div>
  );

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
        body { background: var(--bg); }
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
          top: -40%;
          right: -20%;
          width: 700px;
          height: 700px;
          background: radial-gradient(circle, rgba(124,92,252,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .page::after {
          content: '';
          position: fixed;
          bottom: -30%;
          left: -10%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(0,229,192,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .card {
          width: 100%;
          max-width: 460px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 48px 40px;
          position: relative;
          z-index: 1;
          animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        .card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--accent), var(--accent2));
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: var(--accent2);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }
        .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent2); animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        h1 {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: var(--text);
          margin-bottom: 6px;
          letter-spacing: -0.02em;
        }
        .subtitle { font-size: 13px; color: var(--muted); margin-bottom: 36px; line-height: 1.6; }
        form { display: flex; flex-direction: column; gap: 18px; }
        .field { display: flex; flex-direction: column; gap: 7px; }
        label { font-size: 11px; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; }
        input {
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
        input.error { border-color: var(--danger); }
        .err-msg { font-size: 11px; color: var(--danger); }
        .row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        button {
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
          position: relative;
          overflow: hidden;
        }
        button:hover { background: #8f6dff; transform: translateY(-1px); }
        button:active { transform: translateY(0); }
        button:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .footer-link { text-align: center; font-size: 12px; color: var(--muted); margin-top: 20px; }
        .footer-link span { color: var(--accent); cursor: pointer; }
        .footer-link span:hover { color: var(--accent2); }
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
      `}</style>

      <div className="card">
        <div className="badge"><span className="badge-dot" /> Nova conta</div>
        <h1>Criar conta</h1>
        <p className="subtitle">Configure o 2FA após o cadastro para maior segurança.</p>

        <form onSubmit={handleSubmit}>
          <Field id="name" label="Nome completo" placeholder="Seu nome" />
          <Field id="email" label="E-mail" type="email" placeholder="voce@email.com" />
          <div className="row">
            <Field id="password" label="Senha" type="password" placeholder="••••••••" />
            <Field id="confirm" label="Confirmar" type="password" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? <><span className="spinner" />Criando...</> : "Criar conta →"}
          </button>
        </form>

        <p className="footer-link">
          Já tem conta? <span onClick={() => onNavigate("login")}>Entrar</span>
        </p>
      </div>
    </div>
  );
}
