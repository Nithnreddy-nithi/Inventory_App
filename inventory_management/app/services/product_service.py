from sqlalchemy.orm import Session
from app.models.product import Product    # ✅ Import Product model
from app.repositories.product_repository import product_repository


class ProductService:

    def create_product(self, db: Session, data):

        # ✅ Correct duplicate check
        existing = db.query(Product).filter_by(name=data["name"]).first()
        if existing:
            return {"message": "Product already exists"}

        # ✅ Create product
        return product_repository.create(db, data)

    def get_all_products(self, db: Session):
        return product_repository.get_all(db)

    def get_product(self, db: Session, product_id: int):
        return product_repository.get_by_id(db, product_id)

    def update_product(self, db: Session, product_id: int, data):
        return product_repository.update(db, product_id, data)

    def delete_product(self, db: Session, product_id: int):
        return product_repository.delete(db, product_id)


product_service = ProductService()
