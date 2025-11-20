from sqlmodel import SQLModel, create_engine
import os

# Read PostgreSQL URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL")

# Ensure PostgreSQL uses pooling & SSL
engine = create_engine(
    DATABASE_URL,
    echo=True, 
    connect_args={"sslmode": "require"}
)

def init_db():
    SQLModel.metadata.create_all(engine)
