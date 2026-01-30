import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import urllib.parse
from app.core.config import settings

# Load .env variables (already loaded in config.py, but safe to keep if needed, though settings is better)
# load_dotenv() # Removed as settings handles this

# Construct connection string dynamically
# Encode credentials to handle special characters like '@'
encoded_user = urllib.parse.quote_plus(settings.DB_USER or "sa")
encoded_password = urllib.parse.quote_plus(settings.DB_PASSWORD or "")
server = settings.MSSQL_SERVER
database = settings.MSSQL_DATABASE
port = settings.MSSQL_PORT

# Handle named instance vs host:port
# If server has a backslash, it's a named instance, usually we don't specify port or we let the driver handle it.
# However, formatting it as host:port works if host is IP or simple name.
# For named instance "NITHINREDDY\SQLEXPRESS01", we might need to be careful.
# But putting it directly in the URL works for many drivers.
# Let's try standard format.

SQLALCHEMY_DATABASE_URL = (
    f"mssql+pyodbc://{encoded_user}:{encoded_password}@{server}:{port}/{database}"
    "?driver=ODBC+Driver+18+for+SQL+Server"
    "&TrustServerCertificate=yes"
)






# Create engine and session
engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()