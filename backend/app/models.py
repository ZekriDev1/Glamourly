from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import json
import os
from datetime import datetime

SQLALCHEMY_DATABASE_URL = "sqlite:///./ecommerce_v3.db"
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
    created_at = Column(DateTime, default=datetime.utcnow)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    password = Column(String)
    last_viewed_category = Column(String, nullable=True)
    
    views = relationship("ProductView", back_populates="user")
    wishlist = relationship("WishlistItem", back_populates="user")
    orders = relationship("Order", back_populates="user")

class ProductView(Base):
    __tablename__ = "product_views"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="views")
    product = relationship("Product")

class WishlistItem(Base):
    __tablename__ = "wishlist_items"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="wishlist")
    product = relationship("Product")

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    total_price = Column(Float)
    status = Column(String, default="completed")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer, default=1)
    price_at_purchase = Column(Float)
    
    order = relationship("Order", back_populates="items")
    product = relationship("Product")

Base.metadata.create_all(bind=engine)

def seed_db():
    db = SessionLocal()
    files = ["data.json", "data (1).json", "data (2).json"]
    base_dir = r"c:\Users\AkramZekri\Desktop\ML\salma\frontend\src\data"
    
    try:
        if db.query(Product).count() > 0:
            return
            
        all_products = []
        to_skip = [
            "Multi Purpose Powder - Blush & Eye", "Mineral Blush", "Creme to Powder Blush",
            "Cloud Paint", "Diorskin Rosy Glow", "DIORBLUSH PRECIOUS ROCKS - Christmas 2017 Limited Edition",
            "Diorblush Sculpt", "Diorblush", "Cheek & Lip Glow", "Luxury Blushing Powder Posh",
            "Liquid Liner", "Gel Liner", "Eyeliner", "Fearless Eyeliner", "Lippie Stix",
            "Lipstick", "B Glossy Lip Gloss", "Lip Gloss", "Amalia", "Conch Lipstick",
            "Reflect Lip Gloss", "Generation G"
        ]
        
        for filename in files:
            file_path = os.path.join(base_dir, filename)
            if os.path.exists(file_path):
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                category = "Makeup"
                if filename == "data (1).json":
                    category = "Skincare"
                elif filename == "data (2).json":
                    category = "Accessories"
                
                added = 0
                for item in data:
                    name = str(item.get("name", "")).strip()
                    if name in to_skip: continue
                        
                    raw_price = item.get("price")
                    try:
                        price = float(raw_price) if raw_price and float(raw_price) > 0 else 35.0
                    except:
                        price = 35.0
                    
                    img_url = item.get("image_link") or item.get("api_featured_image")
                    if img_url and img_url.startswith("//"):
                        img_url = "https:" + img_url
                    if not img_url:
                        img_url = "https://images.unsplash.com/photo-1596462502278-27bfaf433394?w=500"

                    all_products.append(Product(
                        name=name or "Produit Glamour",
                        category=category,
                        price=price,
                        image=img_url,
                        description=str(item.get("description") or "Une touche de luxe pour votre routine beauté quotidienne."),
                        created_at=datetime.utcnow()
                    ))
                    
                    added += 1
                    if added >= 25: break
        
        db.add_all(all_products)
        db.commit()
        print(f"Successfully seeded {len(all_products)} products.")
    except Exception as e:
        print(f"Error seeding: {e}")
        db.rollback()
    finally:
        db.close()
