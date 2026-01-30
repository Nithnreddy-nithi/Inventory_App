from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date
from datetime import date
from app.database.database import get_db
from app.models.sale import Sale
from app.models.product import Product

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary")
def dashboard_summary(db: Session = Depends(get_db)):
    total_products = db.query(func.count(Product.id)).scalar()
    total_stock = db.query(func.sum(Product.stock_qty)).scalar() or 0
    out_of_stock = db.query(func.count(Product.id)).filter(Product.stock_qty == 0).scalar()

    total_orders = db.query(func.count(Sale.id)).scalar()
    total_revenue = db.query(func.sum(Sale.total_amount)).scalar() or 0

    today = date.today()
    today_orders = db.query(func.count(Sale.id)).filter(cast(Sale.date, Date) == today).scalar()
    today_revenue = db.query(func.sum(Sale.total_amount)).filter(cast(Sale.date, Date) == today).scalar() or 0

    low_stock = db.query(func.count(Product.id)).filter(Product.stock_qty < 10).scalar()

    return {
        "total_products": total_products,
        "total_stock": total_stock,
        "out_of_stock": out_of_stock,
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "today_orders": today_orders,
        "today_revenue": today_revenue,
        "low_stock": low_stock
    }



@router.get("/sales-chart")
def sales_chart(db: Session = Depends(get_db)):
    data = (
        db.query(
            cast(Sale.date, Date).label("date"),
            func.sum(Sale.total_amount).label("total")
        )
        .group_by(cast(Sale.date, Date))
        .order_by(cast(Sale.date, Date))
        .all()
    )

    return [
        {"date": str(row.date), "total": row.total}
        for row in data
    ]
