from sqlalchemy.orm import Session
from app.repositories import purchase as repo
from app.models.product import Product
from app.models.transaction import InventoryTransaction
from app.models.audit import AuditLog


def receive_purchase(db: Session, purchase_id: int, user_id: int | None = None):
    purchase = repo.get_purchase(db, purchase_id)

    if not purchase:
        raise ValueError("Purchase not found")

    if purchase.status != "draft":
        raise ValueError("Only draft purchases can be received")

    total_amount = 0

    for item in purchase.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise ValueError("Product not found")

        # 🔺 STOCK IN
        product.stock_qty += item.quantity

        line_total = item.quantity * item.unit_price
        total_amount += line_total

        # 🔹 TRANSACTION LOG
        db.add(
            InventoryTransaction(
                product_id=product.id,
                type="purchase",
                quantity=item.quantity,
                unit_price=item.unit_price,
                total_price=line_total
            )
        )

    purchase.total_amount = total_amount
    purchase.status = "received"

    # 🔹 AUDIT LOG
    db.add(
        AuditLog(
            entity_name="Purchase",
            entity_id=purchase.id,
            operation="UPDATE",
            new_data="Purchase received",
            performed_by=user_id
        )
    )

    db.commit()
