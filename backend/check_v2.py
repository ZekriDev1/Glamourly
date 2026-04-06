from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import Product, Base

engine = create_engine("sqlite:///./ecommerce_v2.db")
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()
try:
    count = db.query(Product).count()
    print(f"DATABASE V2 COUNT: {count}")
    for p in db.query(Product).limit(5).all():
        print(f"{p.name} - {p.category}")
except Exception as e:
    print(f"ERROR: {e}")
db.close()
