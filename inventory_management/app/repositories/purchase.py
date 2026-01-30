from sqlalchemy.orm import Session
from app.models.purchase import Purchase
from app.models.purchase_item import PurchaseItem
from sqlalchemy.orm import joinedload


def create_purchase(db: Session, supplier_id: int):
    purchase = Purchase(supplier_id=supplier_id, status="draft")
    db.add(purchase)
    db.commit()
    db.refresh(purchase)
    return purchase


def add_purchase_items(db, purchase_id, items):
    total_amount = 0

    for item in items:
        line_total = item.quantity * item.unit_price
        total_amount += line_total

        db.add(
            PurchaseItem(
                purchase_id=purchase_id,
                product_id=item.product_id,
                quantity=item.quantity,
                unit_price=item.unit_price,
            )
        )

    # 🔥 UPDATE PURCHASE TOTAL
    purchase = db.query(Purchase).filter(Purchase.id == purchase_id).first()
    purchase.total_amount = total_amount

    db.commit()
    db.refresh(purchase)



def get_purchase(db: Session, purchase_id: int):
    return db.query(Purchase).filter(Purchase.id == purchase_id).first()


def list_purchases(db: Session):
    return db.query(Purchase).order_by(Purchase.created_at.desc()).all()
def get_purchase_by_id(db: Session, purchase_id: int):
    return db.query(Purchase).filter(Purchase.id == purchase_id).first()


def delete_purchase(db: Session, purchase: Purchase):
    db.delete(purchase)
    db.commit()



def get_purchase_with_items(db, purchase_id: int):
    return (
        db.query(Purchase)
        .options(
            joinedload(Purchase.items)
            .joinedload(PurchaseItem.product)
        )
        .filter(Purchase.id == purchase_id)
        .first()
    )


