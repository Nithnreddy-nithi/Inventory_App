from sqlalchemy.orm import Session
from app.models.sale_item import SaleItem

class SaleItemRepository:

    def create(self, db: Session, data):
        item = SaleItem(**data)
        db.add(item)
        db.commit()
        db.refresh(item)
        return item

    def get_by_id(self, db: Session, item_id: int):
        return db.query(SaleItem).filter(SaleItem.id == item_id).first()

    def get_all(self, db: Session):
        return db.query(SaleItem).all()

    def update(self, db: Session, item_id: int, data: dict):
        item = self.get_by_id(db, item_id)
        if not item:
            return None
        for key, value in data.items():
            if value is not None:
                setattr(item, key, value)
        db.commit()
        db.refresh(item)
        return item

    def delete(self, db: Session, item_id: int):
        item = self.get_by_id(db, item_id)
        if not item:
            return None
        db.delete(item)
        db.commit()
        return item

sale_item_repository = SaleItemRepository()
