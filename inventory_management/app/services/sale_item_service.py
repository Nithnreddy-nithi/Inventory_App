from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.product import Product
from app.models.sale import Sale
from app.repositories.sale_item_repository import SaleItemRepository

repo = SaleItemRepository()

def recalc_sale_total(db: Session, sale_id: int):
    sale = db.query(Sale).filter(Sale.id == sale_id).first()
    sale.total_amount = sum(item.quantity * item.price for item in sale.items)
    db.commit()
    db.refresh(sale)
    return sale

def add_sale_item(db: Session, data):
    product = db.query(Product).filter(Product.id == data.product_id).first()
    if product.stock_qty < data.quantity:
        raise HTTPException(400, "Not enough stock!")

    product.stock_qty -= data.quantity
    db.commit()

    sale_item = repo.create(db, data.dict())
    recalc_sale_total(db, data.sale_id)
    return sale_item

def update_sale_item(db: Session, item_id, data):
    item = repo.get_by_id(db, item_id)
    if not item:
        raise HTTPException(404, "Sale Item not found")

    product = item.product
    diff = data.quantity - item.quantity

    if diff > 0 and product.stock_qty < diff:
        raise HTTPException(400, "Not enough stock!")

    product.stock_qty -= diff
    updated = repo.update(db, item, data.dict())
    recalc_sale_total(db, item.sale_id)
    return updated

def delete_sale_item(db: Session, item_id):
    item = repo.get_by_id(db, item_id)
    if not item:
        raise HTTPException(404, "Sale Item not found")

    product = item.product
    product.stock_qty += item.quantity

    sale_id = item.sale_id
    repo.delete(db, item)
    recalc_sale_total(db, sale_id)
    return {"message": "Sale item deleted & stock restored"}
