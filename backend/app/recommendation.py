from sqlalchemy.orm import Session
from .models import Product, User, Order, OrderItem, ProductView, WishlistItem
from sqlalchemy import func, desc, or_
import random
from datetime import datetime, timedelta
import math

def get_personalized_recommendations(db: Session, user_id: int = None, limit: int = 10):
    all_products = db.query(Product).all()
    if not all_products:
        return []

    scores = {p.id: 0.0 for p in all_products}
    
    max_views = db.query(func.max(Product.views)).scalar() or 1
    for p in all_products:
        scores[p.id] += (p.views / max_views) * 10

    now = datetime.utcnow()
    for p in all_products:
        days_old = (now - p.created_at).days
        scores[p.id] += math.exp(-0.05 * days_old) * 15

    if user_id:
        user_orders = db.query(Order).filter(Order.user_id == user_id).all()
        purchased_categories = set()
        purchased_product_ids = set()
        for o in user_orders:
            for item in o.items:
                purchased_categories.add(item.product.category)
                purchased_product_ids.add(item.product_id)
                for p in all_products:
                    if p.category == item.product.category:
                        scores[p.id] += 20
        
        recent_views = db.query(ProductView).filter(ProductView.user_id == user_id)\
                        .order_by(desc(ProductView.timestamp)).limit(20).all()
        for v in recent_views:
            scores[v.product_id] += 15
            hours_old = (now - v.timestamp).total_seconds() / 3600
            scores[v.product_id] *= math.exp(-0.01 * hours_old)
            
        wishlist = db.query(WishlistItem).filter(WishlistItem.user_id == user_id).all()
        for w in wishlist:
            scores[w.product_id] += 25
            for p in all_products:
                if p.category == w.product.category:
                    scores[p.id] += 10

    sorted_ids = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    top_ids = [item[0] for item in sorted_ids[:limit]]
    
    return db.query(Product).filter(Product.id.in_(top_ids)).all()

def get_similar_products(db: Session, product_id: int, limit: int = 4):
    ref = db.query(Product).filter(Product.id == product_id).first()
    if not ref: return []
    
    candidates = db.query(Product).filter(Product.id != product_id, Product.category == ref.category).all()
    
    scored = []
    for p in candidates:
        price_diff_ratio = 1 - (abs(p.price - ref.price) / (ref.price or 1))
        score = max(0, price_diff_ratio) * 100
        scored.append((p, score))
        
    scored.sort(key=lambda x: x[1], reverse=True)
    return [x[0] for x in scored[:limit]]

def get_frequently_bought_together(db: Session, product_id: int, limit: int = 4):
    order_ids = db.query(OrderItem.order_id).filter(OrderItem.product_id == product_id).all()
    order_ids = [r[0] for r in order_ids]
    
    if not order_ids:
        return get_similar_products(db, product_id, limit)
        
    other_products = db.query(OrderItem.product_id, func.count(OrderItem.product_id))\
                       .filter(OrderItem.order_id.in_(order_ids), OrderItem.product_id != product_id)\
                       .group_by(OrderItem.product_id)\
                       .order_by(desc(func.count(OrderItem.product_id)))\
                       .limit(limit).all()
                       
    p_ids = [p[0] for p in other_products]
    if not p_ids:
        return get_similar_products(db, product_id, limit)
        
    return db.query(Product).filter(Product.id.in_(p_ids)).all()

def get_trending_products(db: Session, limit: int = 8):
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    trending = db.query(ProductView.product_id, func.count(ProductView.id))\
                 .filter(ProductView.timestamp >= seven_days_ago)\
                 .group_by(ProductView.product_id)\
                 .order_by(desc(func.count(ProductView.id)))\
                 .limit(limit).all()
                 
    p_ids = [p[0] for p in trending]
    if not p_ids:
        return db.query(Product).order_by(desc(Product.views)).limit(limit).all()
        
    return db.query(Product).filter(Product.id.in_(p_ids)).all()