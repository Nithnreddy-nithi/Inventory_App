from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.purchase import (
    PurchaseCreate,
    PurchaseResponse,
    PurchaseDetailResponse,
)
from app.models.purchase import Purchase
from app.repositories import purchase as repo
from app.services.purchase_service import (
    receive_purchase,
    delete_purchase_service,
)
from app.services import purchase_service

router = APIRouter(prefix="/purchases", tags=["Purchases"])


@router.get("/", response_model=list[PurchaseResponse])
def list_purchases(db: Session = Depends(get_db)):
    return db.query(Purchase).all()


@router.get("/{purchase_id}", response_model=PurchaseDetailResponse)
def get_purchase_detail(
    purchase_id: int,
    db: Session = Depends(get_db)
):
    return purchase_service.get_purchase_detail(db, purchase_id)


@router.post("/")
def create_purchase(data: PurchaseCreate, db: Session = Depends(get_db)):
    purchase = repo.create_purchase(db, data.supplier_id)
    repo.add_purchase_items(db, purchase.id, data.items)
    return {"id": purchase.id, "status": purchase.status}


@router.put("/{purchase_id}/receive")
def receive(purchase_id: int, db: Session = Depends(get_db)):
    receive_purchase(db, purchase_id)
    return {"message": "Purchase received successfully"}


@router.delete("/{purchase_id}")
def delete_purchase(
    purchase_id: int,
    db: Session = Depends(get_db)
):
    return delete_purchase_service(db, purchase_id)
