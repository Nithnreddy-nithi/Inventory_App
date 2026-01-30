from sqlalchemy.orm import Session
from app.repositories.sale_repository import sale_repository
from app.services.product_service import product_service

class SaleService:


    def create_sale(self, db: Session, data):
        return sale_repository.create(db, data["user_id"], data["items"])

    def get_all_sales(self, db: Session):
        return sale_repository.get_all(db)

    def get_sale(self, db: Session, sale_id: int):
        return sale_repository.get_by_id(db, sale_id)

    def delete_sale(self, db: Session, sale_id: int):
        return sale_repository.delete(db, sale_id)

sale_service = SaleService()
