from app.models import SessionLocal, Product
db = SessionLocal()
products = db.query(Product).all()
print(f"TOTAL PRODUCTS: {len(products)}")
for p in products[:5]:
    print(f"ID: {p.id}, NAME: {p.name}, CATEGORY: {p.category}")
db.close()
