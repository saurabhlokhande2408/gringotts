from fastapi import FastAPI     # Import models so SQLAlchemy registers them
import db.models # Import DB components
from db.session import engine, Base
from routers.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
from routers.auth import router as auth_router
from routers.watchlist import router as watchlist_router




Base.metadata.create_all(bind=engine)       # Create tables


# Create FastAPI app
app = FastAPI()
app.include_router(auth_router)
app.include_router(watchlist_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)