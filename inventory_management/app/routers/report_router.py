from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date
from datetime import date
from app.database.database import get_db
from app.models.sale import Sale
from app.models.sale_item import SaleItem
from app.models.product import Product

router = APIRouter(prefix="/reports", tags=["Reports"])


# ---------------- SALES BY DATE RANGE ----------------
@router.get("/sales")
def sales_report(start_date: date, end_date: date, db: Session = Depends(get_db)):
    results = (
        db.query(
            cast(Sale.date, Date).label("date"),
            func.sum(Sale.total_amount).label("total_sales"),
            func.count(Sale.id).label("orders")
        )
        .filter(cast(Sale.date, Date).between(start_date, end_date))
        .group_by(cast(Sale.date, Date))
        .order_by(cast(Sale.date, Date))
        .all()
    )

    return [
        {
            "date": r.date,
            "total_sales": r.total_sales,
            "orders": r.orders
        } for r in results
    ]


# ---------------- PRODUCT WISE SALES ----------------
@router.get("/product-sales")
def product_sales_report(db: Session = Depends(get_db)):
    results = (
        db.query(
            Product.name,
            func.sum(SaleItem.quantity).label("total_qty"),
            func.sum(SaleItem.quantity * SaleItem.price).label("total_amount")
        )
        .join(SaleItem, SaleItem.product_id == Product.id)
        .group_by(Product.name)
        .order_by(func.sum(SaleItem.quantity * SaleItem.price).desc())
        .all()
    )

    return [
        {
            "product": r.name,
            "total_qty": r.total_qty,
            "total_amount": r.total_amount
        } for r in results
    ]


# ---------------- LOW STOCK REPORT ----------------
@router.get("/low-stock")
def low_stock_report(db: Session = Depends(get_db)):
    products = db.query(Product).filter(Product.stock_qty < 10).all()

    return [
        {
            "id": p.id,
            "name": p.name,
            "stock_qty": p.stock_qty
        } for p in products
    ]
