import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .dash-root {
    min-height: 100vh;
    background: #0a0a0f;
    font-family: 'Crimson Pro', Georgia, serif;
    position: relative;
    overflow-x: hidden;
  }

  .dash-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 40% at 10% 10%, rgba(180,140,30,0.06) 0%, transparent 70%),
      radial-gradient(ellipse 50% 50% at 90% 80%, rgba(100,60,10,0.07) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  /* ── NAV ── */
  .dash-nav {
    position: sticky;
    top: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
    height: 64px;
    background: rgba(10,10,15,0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(185,145,30,0.12);
  }

  .nav-brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .nav-crest {
    width: 36px;
    height: 36px;
    border: 1px solid rgba(185,145,30,0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    background: radial-gradient(circle, rgba(185,145,30,0.1) 0%, transparent 70%);
    animation: pulseGold 3s ease-in-out infinite;
  }

  @keyframes pulseGold {
    0%, 100% { box-shadow: 0 0 12px rgba(185,145,30,0.1); }
    50%       { box-shadow: 0 0 24px rgba(185,145,30,0.22); }
  }

  .nav-title {
    font-family: 'Cinzel', serif;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.15em;
    color: #c9a84c;
    text-shadow: 0 0 20px rgba(185,145,30,0.25);
  }

  .nav-subtitle {
    font-size: 11px;
    color: rgba(185,145,30,0.35);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    font-weight: 300;
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .nav-user {
    font-size: 13px;
    color: rgba(185,145,30,0.5);
    font-style: italic;
    letter-spacing: 0.03em;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .logout-btn {
    background: transparent;
    border: 1px solid rgba(185,145,30,0.2);
    border-radius: 1px;
    padding: 7px 18px;
    cursor: pointer;
    font-family: 'Cinzel', serif;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(185,145,30,0.5);
    transition: color 0.2s, border-color 0.2s, background 0.2s;
  }

  .logout-btn:hover {
    color: #c9a84c;
    border-color: rgba(185,145,30,0.4);
    background: rgba(185,145,30,0.05);
  }

  /* ── MAIN CONTENT ── */
  .dash-body {
    position: relative;
    z-index: 1;
    max-width: 900px;
    margin: 0 auto;
    padding: 48px 24px 80px;
  }

  .dash-heading {
    margin-bottom: 40px;
    animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .section-eyebrow {
    font-family: 'Cinzel', serif;
    font-size: 10px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: rgba(185,145,30,0.4);
    margin-bottom: 8px;
  }

  .section-title {
    font-family: 'Cinzel', serif;
    font-size: 26px;
    font-weight: 700;
    color: #c9a84c;
    letter-spacing: 0.05em;
    text-shadow: 0 0 30px rgba(185,145,30,0.2);
  }

  .gold-rule {
    width: 48px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(185,145,30,0.4), transparent);
    margin-top: 12px;
  }

  /* ── ADD FORM ── */
  .add-panel {
    background: linear-gradient(160deg, #12100e 0%, #1a1510 50%, #0f0d0a 100%);
    border: 1px solid rgba(185,145,30,0.18);
    border-radius: 2px;
    padding: 28px 32px;
    margin-bottom: 36px;
    box-shadow: 0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(185,145,30,0.1);
    animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.05s both;
    position: relative;
  }

  .add-panel::before, .add-panel::after {
    content: '✦';
    position: absolute;
    color: rgba(185,145,30,0.2);
    font-size: 8px;
  }
  .add-panel::before { top: 10px; left: 14px; }
  .add-panel::after  { bottom: 10px; right: 14px; }

  .add-panel-label {
    font-family: 'Cinzel', serif;
    font-size: 10px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: rgba(185,145,30,0.4);
    margin-bottom: 14px;
  }

  .add-row {
    display: flex;
    gap: 12px;
    align-items: stretch;
  }

  .symbol-input {
    flex: 1;
    background: rgba(185,145,30,0.04);
    border: 1px solid rgba(185,145,30,0.15);
    border-radius: 1px;
    padding: 13px 18px;
    font-family: 'Crimson Pro', Georgia, serif;
    font-size: 16px;
    color: #e8d8a0;
    outline: none;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
  }

  .symbol-input::placeholder {
    color: rgba(185,145,30,0.2);
    font-style: italic;
    text-transform: none;
    letter-spacing: 0.02em;
  }

  .symbol-input:focus {
    border-color: rgba(185,145,30,0.5);
    background: rgba(185,145,30,0.07);
    box-shadow: 0 0 0 3px rgba(185,145,30,0.05), 0 0 16px rgba(185,145,30,0.05);
  }

  .add-btn {
    padding: 13px 28px;
    background: linear-gradient(135deg, #c9a84c 0%, #a07830 60%, #8a6020 100%);
    border: none;
    border-radius: 1px;
    cursor: pointer;
    font-family: 'Cinzel', serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #1a1510;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 16px rgba(185,145,30,0.2);
    white-space: nowrap;
    position: relative;
    overflow: hidden;
  }

  .add-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%);
    opacity: 0;
    transition: opacity 0.25s;
  }

  .add-btn:hover::before { opacity: 1; }
  .add-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(185,145,30,0.28); }
  .add-btn:active { transform: translateY(0); }
  .add-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

  /* ── FEEDBACK BANNERS ── */
  .feedback {
    display: flex;
    align-items: center;
    gap: 8px;
    border-radius: 2px;
    padding: 10px 14px;
    font-size: 13px;
    font-style: italic;
    margin-top: 14px;
    animation: slideIn 0.3s ease both;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .feedback.error {
    background: rgba(200,60,40,0.08);
    border: 1px solid rgba(200,60,40,0.2);
    color: #e07060;
  }

  .feedback.success {
    background: rgba(40,160,80,0.08);
    border: 1px solid rgba(40,160,80,0.2);
    color: #70d090;
  }

  /* ── WATCHLIST TABLE ── */
  .watchlist-panel {
    animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both;
  }

  .wl-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .wl-count {
    font-family: 'Cinzel', serif;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(185,145,30,0.35);
  }

  .refresh-btn {
    background: transparent;
    border: 1px solid rgba(185,145,30,0.15);
    border-radius: 1px;
    padding: 6px 14px;
    cursor: pointer;
    font-family: 'Cinzel', serif;
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(185,145,30,0.4);
    transition: color 0.2s, border-color 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .refresh-btn:hover {
    color: #c9a84c;
    border-color: rgba(185,145,30,0.35);
  }

  .refresh-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* Table */
  .wl-table {
    width: 100%;
    border-collapse: collapse;
    background: linear-gradient(160deg, #12100e 0%, #1a1510 50%, #0f0d0a 100%);
    border: 1px solid rgba(185,145,30,0.15);
    border-radius: 2px;
    overflow: hidden;
    box-shadow: 0 4px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(185,145,30,0.1);
  }

  .wl-table thead tr {
    border-bottom: 1px solid rgba(185,145,30,0.12);
  }

  .wl-table th {
    font-family: 'Cinzel', serif;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: rgba(185,145,30,0.35);
    padding: 14px 24px;
    text-align: left;
  }

  .wl-table th:last-child { text-align: right; }

  .wl-table tbody tr {
    border-bottom: 1px solid rgba(185,145,30,0.07);
    transition: background 0.2s;
    animation: rowIn 0.35s cubic-bezier(0.16,1,0.3,1) both;
  }

  .wl-table tbody tr:last-child { border-bottom: none; }

  .wl-table tbody tr:hover {
    background: rgba(185,145,30,0.04);
  }

  @keyframes rowIn {
    from { opacity: 0; transform: translateX(-8px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .wl-table td {
    padding: 18px 24px;
    vertical-align: middle;
  }

  .wl-table td:last-child { text-align: right; }

  .sym-badge {
    font-family: 'Cinzel', serif;
    font-size: 15px;
    font-weight: 600;
    color: #c9a84c;
    letter-spacing: 0.06em;
  }

  .price-val {
    font-size: 17px;
    font-weight: 300;
    color: #e8d8a0;
    letter-spacing: 0.02em;
  }

  .price-unavail {
    font-size: 13px;
    color: rgba(185,145,30,0.3);
    font-style: italic;
  }

  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px;
    border-radius: 20px;
    font-family: 'Cinzel', serif;
    font-size: 8px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .status-pill.ok {
    background: rgba(40,160,80,0.1);
    border: 1px solid rgba(40,160,80,0.2);
    color: #70d090;
  }

  .status-pill.unavailable {
    background: rgba(200,60,40,0.08);
    border: 1px solid rgba(200,60,40,0.15);
    color: #e07060;
  }

  .dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    display: inline-block;
  }

  .dot.ok { background: #70d090; }
  .dot.unavailable { background: #e07060; }

  .del-btn {
    background: transparent;
    border: 1px solid rgba(200,60,40,0.2);
    border-radius: 1px;
    padding: 6px 14px;
    cursor: pointer;
    font-family: 'Cinzel', serif;
    font-size: 9px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(200,90,70,0.5);
    transition: color 0.2s, border-color 0.2s, background 0.2s;
  }

  .del-btn:hover {
    color: #e07060;
    border-color: rgba(200,60,40,0.4);
    background: rgba(200,60,40,0.06);
  }

  .del-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  /* ── EMPTY STATE ── */
  .empty-state {
    text-align: center;
    padding: 64px 40px;
    background: linear-gradient(160deg, #12100e 0%, #1a1510 50%, #0f0d0a 100%);
    border: 1px solid rgba(185,145,30,0.12);
    border-radius: 2px;
    box-shadow: 0 4px 32px rgba(0,0,0,0.3);
    animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.15s both;
  }

  .empty-icon {
    font-size: 36px;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  .empty-title {
    font-family: 'Cinzel', serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.1em;
    color: rgba(185,145,30,0.4);
    margin-bottom: 8px;
  }

  .empty-sub {
    font-size: 14px;
    color: rgba(185,145,30,0.25);
    font-style: italic;
  }

  /* ── LOADING STATE ── */
  .skeleton-row td {
    padding: 18px 24px;
  }

  .skel {
    border-radius: 2px;
    background: linear-gradient(90deg,
      rgba(185,145,30,0.05) 0%,
      rgba(185,145,30,0.12) 50%,
      rgba(185,145,30,0.05) 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1.6s infinite;
  }

  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* Spinner */
  .spinner {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 2px solid rgba(26,21,16,0.4);
    border-top-color: #1a1510;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    vertical-align: middle;
  }

  .spinner-gold {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 2px solid rgba(185,145,30,0.15);
    border-top-color: rgba(185,145,30,0.5);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    vertical-align: middle;
  }

  @keyframes spin { to { transform: rotate(360deg); } }
`;

// ── helpers ──────────────────────────────────────────────
function authHeader() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

function SkeletonRows() {
  return Array.from({ length: 3 }).map((_, i) => (
    <tr key={i} className="skeleton-row" style={{ opacity: 1 - i * 0.2 }}>
      <td><div className="skel" style={{ width: 60, height: 18 }} /></td>
      <td><div className="skel" style={{ width: 80, height: 18 }} /></td>
      <td><div className="skel" style={{ width: 56, height: 18, borderRadius: 20 }} /></td>
      <td style={{ textAlign: "right" }}><div className="skel" style={{ width: 60, height: 26, marginLeft: "auto" }} /></td>
    </tr>
  ));
}

// ── component ────────────────────────────────────────────
export default function Dashboard({ onLogout }) {
  const [watchlist, setWatchlist]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [symbol, setSymbol]         = useState("");
  const [adding, setAdding]         = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [addMsg, setAddMsg]         = useState({ type: "", text: "" });

  // decode email from JWT for display
  const userEmail = (() => {
    try {
      const token = localStorage.getItem("token");
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub || "";
    } catch { return ""; }
  })();

  // ── fetch watchlist ──
  const fetchWatchlist = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await axios.get(`${API}/watchlist`, { headers: authHeader() });
      setWatchlist(res.data);
    } catch (err) {
      if (err.response?.status === 401) handleLogout();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchWatchlist(); }, [fetchWatchlist]);

  // ── add symbol ──
  const handleAdd = async () => {
    const sym = symbol.trim().toUpperCase();
    if (!sym) {
      setAddMsg({ type: "error", text: "Enter a valid ticker symbol." });
      return;
    }
    setAdding(true);
    setAddMsg({ type: "", text: "" });
    try {
      await axios.post(
        `${API}/watchlist`,
        { symbol: sym },
        { headers: authHeader() }
      );
      setSymbol("");
      setAddMsg({ type: "success", text: `${sym} added to your vault.` });
      fetchWatchlist(true);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setAddMsg({
        type: "error",
        text: typeof detail === "string" ? detail : "The goblins rejected that ticker.",
      });
    } finally {
      setAdding(false);
    }
  };

  // ── delete item ──
  const handleDelete = async (id, sym) => {
    setDeletingId(id);
    try {
      await axios.delete(`${API}/watchlist/${id}`, { headers: authHeader() });
      setWatchlist((prev) => prev.filter((item) => item.id !== id));
    } catch {
      // silently re-fetch to sync state
      fetchWatchlist(true);
    } finally {
      setDeletingId(null);
    }
  };

  // ── logout ──
  const handleLogout = () => {
    localStorage.removeItem("token");
    if (onLogout) onLogout();
    else window.location.reload();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <>
      <style>{styles}</style>
      <div className="dash-root">

        {/* NAV */}
        <nav className="dash-nav">
          <div className="nav-brand">
            <div className="nav-crest">⚡</div>
            <div>
              <div className="nav-title">GRINGOTTS</div>
              <div className="nav-subtitle">Wizarding Wealth Management</div>
            </div>
          </div>
          <div className="nav-right">
            {userEmail && <span className="nav-user">{userEmail}</span>}
            <button className="logout-btn" onClick={handleLogout}>
              Leave Vault
            </button>
          </div>
        </nav>

        {/* BODY */}
        <div className="dash-body">

          {/* Heading */}
          <div className="dash-heading">
            <div className="section-eyebrow">Your Portfolio</div>
            <div className="section-title">The Vault Ledger</div>
            <div className="gold-rule" />
          </div>

          {/* Add Panel */}
          <div className="add-panel">
            <div className="add-panel-label">Track a new holding</div>
            <div className="add-row">
              <input
                className="symbol-input"
                type="text"
                placeholder="e.g. AAPL, TSLA, INFY"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={adding}
                maxLength={12}
              />
              <button className="add-btn" onClick={handleAdd} disabled={adding}>
                {adding
                  ? <><span className="spinner" style={{ marginRight: 8 }} />Inscribing…</>
                  : "✦ Add to Vault"}
              </button>
            </div>
            {addMsg.text && (
              <div className={`feedback ${addMsg.type}`}>
                {addMsg.type === "error" ? "⚠" : "✦"} {addMsg.text}
              </div>
            )}
          </div>

          {/* Watchlist */}
          <div className="watchlist-panel">
            <div className="wl-header">
              <span className="wl-count">
                {!loading && `${watchlist.length} holding${watchlist.length !== 1 ? "s" : ""} tracked`}
              </span>
              <button
                className="refresh-btn"
                onClick={() => fetchWatchlist(true)}
                disabled={refreshing || loading}
              >
                {refreshing
                  ? <><span className="spinner-gold" /> Refreshing…</>
                  : "↻ Refresh Prices"}
              </button>
            </div>

            {loading ? (
              <table className="wl-table">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Market Price</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody><SkeletonRows /></tbody>
              </table>
            ) : watchlist.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🏦</div>
                <div className="empty-title">The vault is empty</div>
                <div className="empty-sub">Add your first holding above to begin tracking.</div>
              </div>
            ) : (
              <table className="wl-table">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Market Price</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {watchlist.map((item, i) => (
                    <tr key={item.id} style={{ animationDelay: `${i * 0.05}s` }}>
                      <td><span className="sym-badge">{item.symbol}</span></td>
                      <td>
                        {item.price != null
                          ? <span className="price-val">$ {Number(item.price).toFixed(2)}</span>
                          : <span className="price-unavail">—</span>
                        }
                      </td>
                      <td>
                        <span className={`status-pill ${item.status}`}>
                          <span className={`dot ${item.status}`} />
                          {item.status === "ok" ? "Live" : "Unavailable"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="del-btn"
                          onClick={() => handleDelete(item.id, item.symbol)}
                          disabled={deletingId === item.id}
                        >
                          {deletingId === item.id
                            ? <span className="spinner-gold" />
                            : "Remove"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}