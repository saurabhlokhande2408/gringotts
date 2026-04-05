import { useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000";

// --- KEEP YOUR ORIGINAL CSS HERE ---
const styles = `
  .auth-root {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #0a0a0a;
    font-family: 'Inter', sans-serif;
  }
  .vault-card {
    background: #141414;
    border: 1px solid #2a2a2a;
    padding: 2.5rem;
    border-radius: 12px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  }
  .vault-header { text-align: center; margin-bottom: 2rem; }
  .vault-crest { font-size: 2.5rem; margin-bottom: 0.5rem; }
  .vault-title { color: #d4af37; font-size: 1.5rem; font-weight: 800; letter-spacing: 2px; }
  .vault-subtitle { color: #888; font-size: 0.75rem; text-transform: uppercase; margin-top: 0.25rem; }
  .gold-rule { height: 2px; background: linear-gradient(90deg, transparent, #d4af37, transparent); margin: 10px 0; }
  .vault-tabs { display: flex; position: relative; background: #1f1f1f; border-radius: 8px; margin-bottom: 2rem; padding: 4px; }
  .vault-tab { flex: 1; border: none; background: none; color: #888; padding: 10px; cursor: pointer; font-weight: 600; z-index: 1; transition: color 0.3s; }
  .vault-tab.active { color: #fff; }
  .tab-indicator { position: absolute; height: calc(100% - 8px); width: calc(50% - 4px); background: #333; border-radius: 6px; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
  .tab-indicator.right { transform: translateX(100%); }
  .field-group { margin-bottom: 1.5rem; text-align: left; }
  .field-label { display: block; color: #aaa; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.5rem; font-weight: 700; }
  .field-input { width: 100%; padding: 12px; background: #1f1f1f; border: 1px solid #333; border-radius: 6px; color: #fff; box-sizing: border-box; }
  .field-input:focus { outline: none; border-color: #d4af37; }
  .vault-btn { width: 100%; padding: 14px; background: #d4af37; border: none; border-radius: 6px; color: #000; font-weight: 800; cursor: pointer; transition: transform 0.1s; }
  .vault-btn:active { transform: scale(0.98); }
  .vault-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .error-msg { background: rgba(255, 71, 87, 0.1); color: #ff4757; padding: 10px; border-radius: 6px; font-size: 0.85rem; margin-bottom: 1rem; border: 1px solid rgba(255, 71, 87, 0.2); }
  .success-msg { background: rgba(46, 213, 115, 0.1); color: #2ed573; padding: 10px; border-radius: 6px; font-size: 0.85rem; margin-bottom: 1rem; border: 1px solid rgba(46, 213, 115, 0.2); }
  .vault-divider { margin-top: 2rem; border-top: 1px solid #2a2a2a; position: relative; }
  .vault-divider span { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: #141414; padding: 0 10px; color: #444; font-size: 0.65rem; font-weight: 800; }
`;

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetState = (newMode) => {
    setMode(newMode);
    setEmail("");
    setPassword("");
    setError("");
    setSuccess("");
  };

  const validate = () => {
    if (!email.trim()) return "An owl post address (email) is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid owl post format.";
    if (!password) return "A vault passphrase is required.";
    return null;
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    const valErr = validate();
    if (valErr) { setError(valErr); return; }

    setLoading(true);
    try {
      if (mode === "login") {
        // 🔥 FIX: FastAPI OAuth2 expects Form Data, not JSON
        const params = new URLSearchParams();
        params.append("username", email); // Must be "username"
        params.append("password", password);

        const res = await axios.post(`${API}/login`, params, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });

        localStorage.setItem("token", res.data.access_token);
        setSuccess("Vault access granted. Welcome back.");

        // ✅ Trigger redirect to Dashboard
        setTimeout(() => {
          onLogin && onLogin();
        }, 600);

      } else {
        // Registration usually stays as JSON
        const res = await axios.post(`${API}/register`, { email, password });
        setSuccess(res.data.message || "Account created. You may now enter.");
        setTimeout(() => resetState("login"), 1500);
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "The goblins are refusing entry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="auth-root">
        <div className="vault-card">
          <div className="vault-header">
            <div className="vault-crest">⚡</div>
            <div className="gold-rule" />
            <div className="vault-title">GRINGOTTS</div>
            <div className="vault-subtitle">Wizarding Wealth Management</div>
          </div>

          <div className="vault-tabs">
            <div className={`tab-indicator ${mode === "login" ? "" : "right"}`} />
            <button className={`vault-tab ${mode === "login" ? "active" : ""}`} onClick={() => resetState("login")}>Enter Vault</button>
            <button className={`vault-tab ${mode === "register" ? "active" : ""}`} onClick={() => resetState("register")}>Open Account</button>
          </div>

          {error && <div className="error-msg">⚠ {error}</div>}
          {success && <div className="success-msg">✦ {success}</div>}

          <div className="field-group">
            <label className="field-label">Owl Post Address</label>
            <input className="field-input" type="email" placeholder="wizard@diagonalley.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="field-group">
            <label className="field-label">Vault Passphrase</label>
            <input className="field-input" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button className="vault-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "Verifying..." : "⚡ Access Vault"}
          </button>

          <div className="vault-divider"><span>Est. 1474</span></div>
        </div>
      </div>
    </>
  );
}