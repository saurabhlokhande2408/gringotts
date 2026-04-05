from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from core.config import settings
from sqlalchemy.orm import declarative_base



Base=declarative_base()

db_url=settings.DATABASE_URL #importing database url

engine=create_engine(db_url,pool_pre_ping=True) #creating a engine

SessionLocal=sessionmaker(bind=engine,autocommit=False,autoflush=False) #ceating sessions

def get_db(): #calling and creating session in db
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()


        