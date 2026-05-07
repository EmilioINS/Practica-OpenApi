from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Modify postgresql:// to postgresql+psycopg2:// if needed, or simply use psycopg2
SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL.replace("postgres://", "postgresql://")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
