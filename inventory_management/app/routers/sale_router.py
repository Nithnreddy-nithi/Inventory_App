from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.schemas.sale_schema import SaleCreate, SaleOut
from app.services.sale_service import sale_service
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/sales", tags=["Sales"])

@router.post("/", response_model=SaleOut)
def create_sale(
    sale: SaleCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    data = sale.dict()
    data["user_id"] = current_user.id
    return sale_service.create_sale(db, data)


@router.get("/", response_model=List[SaleOut])
def list_sales(db: Session = Depends(get_db)):
    return sale_service.get_all_sales(db)

@router.get("/{sale_id}", response_model=SaleOut)
def get_sale(sale_id: int, db: Session = Depends(get_db)):
    sale = sale_service.get_sale(db, sale_id)
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    return sale

@router.delete("/{sale_id}")
def delete_sale(sale_id: int, db: Session = Depends(get_db)):
    success = sale_service.delete_sale(db, sale_id)
    if not success:
        raise HTTPException(status_code=404, detail="Sale not found")
    return {"message": "Sale deleted"}
