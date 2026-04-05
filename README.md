# ⚡ GRINGOTTS — Wizarding Wealth Management
### *From `print("Hello World")` to a full JWT-authenticated REST API with a React frontend*



---

## 🧙 The Origin Story

This project started the way every developer's learning journey does  not with a plan, not with an architecture diagram. It started with *confusion of Auth and RESTAPI, and the burning need to understand what the hell a JWT actually is.*

`Gringotts` is a **stock watchlist web app** wrapped in Harry Potter lore because i like Harry Potter. You log in (like a wizard accessing their vault), you search for stocks, and you watch your portfolio like a goblin watches gold. The concept? Dead simple. The point? **Learning how a real backend auth pipeline works — end to end.**

This was my first full-stack project. The frontend was vibecoded (lovingly, aggressively, unapologetically). The backend was *understood*, debugged, cried over, and eventually conquered.

---

## 🗺️ The Full Stack Map

```
frontend/src/                     backend/
─────────────────────────        ──────────────────────────────
components/Auth.jsx             → Login/Register       routers/auth.py      → /register, /login
components/Dashboard.jsx        → Watchlist UI         routers/watchlist.py → /watchlist (GET, POST, DELETE)
App.jsx (auth state mgmt)        routers/user.py      → (reserved — user profile)
                                 routers/user.py      → (reserved — user profile)
                                 core/security.py     → hashing, JWT creation
                                 core/deps.py         → JWT verification, route guard
                                 core/stocky.py       → Yahoo Finance price fetch
                                 db/models.py         → SQLAlchemy ORM models
                                 db/session.py        → DB engine + session
                                 db/schemas/          → Pydantic input/output shapes
                                 core/config.py       → Env var loader
                                 main.py              → App bootstrap + CORS
```

---

## 🏗️ Project Structure

```
GRINGOTTS/
│
├── backend/
│   ├── core/
│   │   ├── config.py            # Settings loader from .env
│   │   ├── deps.py              # Token extraction + route protection
│   │   ├── security.py          # Password hashing + JWT creation
│   │   └── stocky.py            # Live price fetcher (yahooquery)
│   │
│   ├── db/
│   │   ├── models.py            # User + Watchlist SQLAlchemy models
│   │   └── session.py           # DB engine, SessionLocal, get_db()
│   │
│   ├── routers/
│   │   ├── auth.py              # /register + /login
│   │   ├── user.py              # (user profile — reserved for expansion)
│   │   └── watchlist.py         # /watchlist GET, POST, DELETE
│   │
│   ├── schemas/
│   │   ├── user.py              # UserCreate, UserResponse (Pydantic)
│   │   └── watchlist.py         # WatchlistCreate (Pydantic)
│   │
│   ├── .env                     # Secret keys — never commit this
│   └── main.py                  # App bootstrap, CORS, router registration
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   ├── Auth.jsx         # Login + Register UI
    │   │   └── Dashboard.jsx    # Watchlist UI
    │   ├── App.css
    │   ├── App.jsx              # Root component — auth state + routing logic
    │   ├── index.css
    │   └── main.jsx             # React DOM entry point
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── package-lock.json
    └── vite.config.js
```

---


## 🖥️ The Frontend (Vibecoded with Intent)

The frontend was intentionally vibecoded. The focus was backend. But it's not sloppy — it's *strategically aesthetic.*

**`Auth.jsx`** — Handles login and register with a tab toggle, client-side validation, and proper error display. JWT is stored in localStorage post-login and the parent component gets an `onLogin()` callback to trigger redirect.

**`Dashboard.jsx`** — The real UI. Skeleton loading rows while data fetches. JWT decoded *on the client* (`atob(token.split(".")[1])`) to extract the email for display — no extra API call needed. Refreshable prices. Delete with optimistic UI (item removed immediately, re-fetched on failure).

The Harry Potter theme (`Cinzel` + `Crimson Pro` fonts, gold gradient, `#c9a84c` everywhere) was not an accident. Goblins deserve good typography.

---



### Backend

🛡️ Technical Audit & Security Review
To ensure the safety of the Gringotts vaults, the codebase has been audited for architectural integrity. Here is the breakdown of the implementation:

1. The Auth Pipeline
Secure Hashing: Utilizes passlib with the bcrypt scheme in security.py to ensure passwords are never stored in plain text.

JWT Standards: The create_access_token function generates tokens including exp (expiry), iat (issued at), and jti (unique identifier) claims for robust session management.

Dependency Injection: Implementation of OAuth2PasswordBearer in deps.py creates a seamless verification chain (get_token → verify_token) that protects routes without bloating logic.

OAuth2 Compliance: The login flow via OAuth2PasswordRequestForm correctly maps user identification to the username field as per specification.

2. Database & Data Integrity
Relational Mapping: SQLAlchemy models in models.py establish a clean one-to-many relationship between User and Watchlist entries.

Session Management: The get_db generator in session.py follows FastAPI best practices, using a try/finally block to ensure database connections are closed after every request.

Strict Validation: Pydantic schemas (e.g., UserCreate using EmailStr) act as the first line of defense, validating data types before they reach the database.

3. Market Data Logic
Efficient Fetching: The get_multiple_prices utility in stocky.py uses batch requests via yahooquery to minimize network overhead.

Resilient Fallbacks: The price logic intelligently checks regularMarketPrice, preMarketPrice, and postMarketPrice to ensure data availability across different trading hours.

Startup Safety: The Settings class in config.py performs a mandatory environment check, preventing the server from starting if critical secrets like DATABASE_URL are missing.

## 🧠 What I Actually Learned

**Authentication isn't magic.** It's just:
1. Hash the password (bcrypt)
2. On login, verify hash → issue a signed JWT
3. On every protected request, verify the JWT signature
4. Pull identity (`sub`) from the JWT payload
5. Never trust the client

**FastAPI's dependency injection** (`Depends()`) is genuinely elegant. Writing `current_user: str = Depends(get_current_user)` and having the entire auth chain run automatically — token extraction, decode, validation, email return — without touching the route logic is clean architecture.

**SQLAlchemy ORM** means you stop writing raw SQL and start thinking in Python objects. `db.query(User).filter(User.email == email).first()` reads like English.

**Pydantic schemas** are the bouncers. They check IDs at the door. Invalid email? Rejected before it touches your database.

**CORS is not optional.** Your browser will not let you down easy.

---
## 🚀 Running Locally

```bash
# 1. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install fastapi uvicorn sqlalchemy psycopg2-binary passlib[bcrypt] python-jose python-dotenv yahooquery pydantic[email]

# 3. Create your .env file (see config section above)

# 4. Run
uvicorn main:app --reload
```

Backend lives at: `http://127.0.0.1:8000`
Auto-generated API docs: `http://127.0.0.1:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend lives at: `http://localhost:5173`

---

## 🧪 API Endpoints

| Method | Route               | Auth Required | Description |
|--------|---------------------|---------------|-------------|
| `POST` | `/register`           ❌            | Create a new account |
| `POST` | `/login`            | ❌            | Get JWT token (form data) |
| `GET` | `/watchlist`         | ✅            | Get your watchlist with live prices |
| `POST` | `/watchlist`        | ✅            | Add a stock symbol |
| `DELETE` | `/watchlist/{id}` | ✅            | Remove a stock by ID |

---

## 🔮 What's Next (The Goblin Expansion Plan)

- [ ] Refresh tokens (JWTs expire — handle that gracefully)
- [ ] Token revocation using the `jti` claim (already in the payload — it's ready)
- [ ] Rate limiting on `/login` to prevent brute force
- [ ] Price change % since last fetch
- [ ] Price alerts ("owl me when TSLA drops below $200")
- [ ] PostgreSQL → production deployment on Railway or Render
- [ ] The `user.py` router is empty — user profile management goes there

---

## 🧾 Tech Stack

| Layer | Technology |
|---|---|
| Backend Framework | FastAPI |
| Database ORM | SQLAlchemy |
| Database | PostgreSQL  |
| Auth — Passwords | passlib + bcrypt |
| Auth — Tokens | python-jose (JWT) |
| Data Validation | Pydantic v2 |
| Stock Data | yahooquery |
| Frontend | React + Vite |
| HTTP Client | axios |
| Styling | Inline CSS-in-JS |

---

## 🏦 Final Words from the Goblins

> *"Gringotts is the safest place in the world for something you want to keep safe — except perhaps Hogwarts."*

This app is neither of those things — it stores JWTs in localStorage and runs on localhost. But as a first full-stack project, as a first real look at how auth *actually works* under the hood, as proof that you can go from `print("Hello World")` to a working REST API with password hashing, token signing, protected routes, live market data, and a frontend that talks to all of it?

That's the win.

The goblins are impressed.Maybe.

---

*Built with confusion, caffeine, and the firm belief that naming your database models after a wizarding bank makes backend learning  more fun.*