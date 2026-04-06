from sqlalchemy import Column, Integer, String, Float, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import json
import os

SQLALCHEMY_DATABASE_URL = "sqlite:///./ecommerce.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    category = Column(String)
    price = Column(Float)
    image = Column(String)
    description = Column(String)
    views = Column(Integer, default=0)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    password = Column(String)
    last_viewed_category = Column(String, nullable=True)

Base.metadata.create_all(bind=engine)

def seed_db():
    db = SessionLocal()
    files = ["data.json", "data (1).json", "data (2).json"]
    base_dir = r"c:\Users\AkramZekri\Desktop\ML\salma\frontend\src\data"
    
    try:
        db.query(Product).delete()
        db.commit()
        
        all_products = []
        to_skip = ["Multi Purpose Powder - Blush & Eye", "Mineral Blush", "Creme to Powder Blush", "Cloud Paint", "Diorskin Rosy Glow", "DIORBLUSH PRECIOUS ROCKS - Christmas 2017 Limited Edition", "Diorblush Sculpt"]
        
        for filename in files:
            file_path = os.path.join(base_dir, filename)
            if os.path.exists(file_path):
                print(f"DEBUG: Reading {filename}")
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                category = "Makeup"
                if filename == "data (1).json": category = "Skincare"
                elif filename == "data (2).json": category = "Accessories"
                
                count = 0
                for item in data:
                    name = str(item.get("name", "")).strip()
                    if name in to_skip: continue
                    
                    price = 35.0
                    try:
                        p = item.get("price")
                        if p and float(p) > 0: price = float(p)
                    except: pass
                    
                    img = item.get("image_link") or item.get("api_featured_image")
                    if img and img.startswith("//"): img = "https:" + img
                    if not img: img = "https://images.unsplash.com/photo-1596462502278-27bfaf433394?w=500"

                    all_products.append(Product(
                        name=name or "Produit Glamour",
                        category=category,
                        price=price,
                        image=img,
                        description=str(item.get("description") or "Luxe quotidien.")
                    ))
                    count += 1
                    if count >= 30: break # Increased limit
                print(f"DEBUG: Added {count} products from {filename}")
        
        db.add_all(all_products)
        db.commit()
        print(f"DEBUG: Seed complete. Total: {db.query(Product).count()}")
    except Exception as e:
        print(f"DEBUG ERROR: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    # If run directly, delete db and seed
    if os.path.exists("ecommerce.db"):
        os.remove("ecommerce.db")
    Base.metadata.create_all(bind=engine)
    seed_db()
