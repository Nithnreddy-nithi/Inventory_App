from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.schemas.supplier_schema import SupplierCreate, SupplierOut
from app.services.supplier_service import SupplierService

router = APIRouter(prefix="/suppliers", tags=["Suppliers"])

@router.post("/", response_model=SupplierOut)
def create_supplier(data: SupplierCreate, db: Session = Depends(get_db)):
    return SupplierService.create_supplier(db, data.name)

@router.get("/", response_model=List[SupplierOut])
def list_suppliers(db: Session = Depends(get_db)):
    return SupplierService.list_suppliers(db)

@router.put("/{supplier_id}", response_model=SupplierOut)
def update_supplier(supplier_id: int, data: SupplierCreate, db: Session = Depends(get_db)):
    updated = SupplierService.edit_supplier(db, supplier_id, data.name)
    if not updated:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return updated

@router.delete("/{supplier_id}")
def delete_supplier(supplier_id: int, db: Session = Depends(get_db)):
    removed = SupplierService.remove_supplier(db, supplier_id)
    if not removed:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return {"message": "Supplier deleted successfully"}
