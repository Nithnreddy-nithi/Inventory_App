from sqlalchemy.orm import Session, joinedload
from app.models.sale import Sale
from app.models.sale_item import SaleItem

class SaleRepository:

    def create(self, db: Session, user_id: int, items: list):
        sale = Sale(user_id=user_id)
        db.add(sale)
        db.commit()
        db.refresh(sale)

        total = 0

        for item in items:
            subtotal = item["quantity"] * item["price"]
            total += subtotal

            sale_item = SaleItem(
                sale_id=sale.id,
                product_id=item["product_id"],
                quantity=item["quantity"],
                price=item["price"]
            )
            db.add(sale_item)

        sale.total_amount = total
        db.commit()
        db.refresh(sale)

        return sale

    def get_by_id(self, db: Session, sale_id: int):
        return (
            db.query(Sale)
            .options(
                joinedload(Sale.items).joinedload(SaleItem.product)  # 🔥 IMPORTANT
            )
            .filter(Sale.id == sale_id)
            .first()
        )

    def get_all(self, db: Session):
        return db.query(Sale).options(joinedload(Sale.items)).all()


    def delete(self, db: Session, sale_id: int):
        sale = self.get_by_id(db, sale_id)
        if not sale:
            return None
        db.delete(sale)
        db.commit()
        return True

sale_repository = SaleRepository()
