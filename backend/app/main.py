from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.models import SessionLocal, Product, User, ProductView, WishlistItem, Order, OrderItem, seed_db
from app.recommendation import (
    get_personalized_recommendations, 
    get_similar_products, 
    get_frequently_bought_together, 
    get_trending_products
)
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

app = FastAPI()

seed_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class AuthSchema(BaseModel):
    username: str
    password: str

class ProductSchema(BaseModel):
    id: int
    name: str
    category: str
    price: float
    image: str
    description: str
    views: int
    created_at: datetime

    class Config:
        from_attributes = True

class OrderItemSchema(BaseModel):
    product_id: int
    quantity: int

class OrderCreateSchema(BaseModel):
    user_id: int
    items: List[OrderItemSchema]

@app.get("/products", response_model=List[ProductSchema])
def list_products(db: Session = Depends(get_db)):
    return db.query(Product).all()

@app.get("/products/{id}", response_model=ProductSchema)
def get_product(id: int, user_id: Optional[int] = None, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product.views += 1
    
    if user_id:
        view = ProductView(user_id=user_id, product_id=id)
        db.add(view)
        
    db.commit()
    db.refresh(product)
    return product

@app.get("/categories/{name}", response_model=List[ProductSchema])
def get_by_category(name: str, db: Session = Depends(get_db)):
    return db.query(Product).filter(Product.category.ilike(name)).all()

@app.get("/recommendations/personalized", response_model=List[ProductSchema])
def personalized_recommendations(user_id: Optional[int] = None, db: Session = Depends(get_db)):
    return get_personalized_recommendations(db, user_id)

@app.get("/recommendations/trending", response_model=List[ProductSchema])
def trending_recommendations(db: Session = Depends(get_db)):
    return get_trending_products(db)

@app.get("/recommendations/similar/{id}", response_model=List[ProductSchema])
def similar_recommendations(id: int, db: Session = Depends(get_db)):
    return get_similar_products(db, id)

@app.get("/recommendations/frequent/{id}", response_model=List[ProductSchema])
def frequent_recommendations(id: int, db: Session = Depends(get_db)):
    return get_frequently_bought_together(db, id)

@app.post("/wishlist/{product_id}")
def add_to_wishlist(product_id: int, user_id: int, db: Session = Depends(get_db)):
    existing = db.query(WishlistItem).filter(WishlistItem.user_id == user_id, WishlistItem.product_id == product_id).first()
    if existing:
        db.delete(existing)
        db.commit()
        return {"message": "Removed from wishlist"}
    
    item = WishlistItem(user_id=user_id, product_id=product_id)
    db.add(item)
    db.commit()
    return {"message": "Added to wishlist"}

@app.get("/wishlist/{user_id}", response_model=List[ProductSchema])
def get_wishlist(user_id: int, db: Session = Depends(get_db)):
    items = db.query(WishlistItem).filter(WishlistItem.user_id == user_id).all()
    return [i.product for i in items]

@app.post("/orders")
def create_order(order_data: OrderCreateSchema, db: Session = Depends(get_db)):
    total = 0
    order_items = []
    for item in order_data.items:
        p = db.query(Product).filter(Product.id == item.product_id).first()
        if p:
            total += p.price * item.quantity
            order_items.append(OrderItem(
                product_id=p.id,
                quantity=item.quantity,
                price_at_purchase=p.price
            ))
            
    db_order = Order(user_id=order_data.user_id, total_price=total, items=order_items)
    db.add(db_order)
    db.commit()
    return {"message": "Order placed", "order_id": db_order.id}

@app.post("/register")
def register(user: AuthSchema, db: Session = Depends(get_db)):
    db_user = User(username=user.username, password=user.password)
    db.add(db_user)
    db.commit()
    return {"message": "User registered"}

@app.post("/login")
def login(user: AuthSchema, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username, User.password == user.password).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"id": db_user.id, "username": db_user.username}

@app.get("/admin/stats", response_model=List[ProductSchema])
def get_stats(db: Session = Depends(get_db)):
    return db.query(Product).order_by(Product.views.desc()).limit(5).all()
