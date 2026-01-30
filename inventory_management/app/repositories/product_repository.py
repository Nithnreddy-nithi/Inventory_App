from sqlalchemy.orm import Session
from app.models.product import Product

class ProductRepository:

    def create(self, db: Session, data: dict):
        product = Product(
            name=data["name"],
            price=data["price"],
            stock_qty=data["stock"],
            category_id=data.get("category_id"),
            supplier_id=data.get("supplier_id")
        )
        db.add(product)
        db.commit()
        db.refresh(product)
        return product

    def get_all(self, db: Session):
        return db.query(Product).all()

    def get_by_id(self, db: Session, product_id: int):
        return db.query(Product).filter(Product.id == product_id).first()

    def update(self, db: Session, product_id: int, product_data: dict):
        product = self.get_by_id(db, product_id)
        if not product:
            return None
        print(product_data)
        key_map = {
        "stock": "stock_qty"
            }
        for key, value in product_data.items():
            if value is not None: 
                attr = key_map.get(key, key)   # prevent overwriting with null
                setattr(product, attr, value)
        db.commit()
        db.refresh(product)
        return product

    def delete(self, db: Session, product_id: int):
        product = self.get_by_id(db, product_id)
        if not product:
            return None
        db.delete(product)
        db.commit()
        return True


product_repository = ProductRepository()
product_repo = ProductRepository()