from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.product_schema import ProductCreate, ProductUpdate, ProductOut
from app.services.product_service import product_service

router = APIRouter(prefix="/products", tags=["Products"])

@router.post("/", response_model=ProductOut)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    return product_service.create_product(db, product.dict())

@router.get("/", response_model=list[ProductOut])
def list_products(db: Session = Depends(get_db)):
    return product_service.get_all_products(db)

@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    result = product_service.get_product(db, product_id)
    if not result:
        raise HTTPException(404, "Product Not Found")
    return result

@router.put("/{product_id}", response_model=ProductOut)
def update_product(product_id: int, product: ProductUpdate, db: Session = Depends(get_db)):
    result = product_service.update_product(db, product_id, product.dict())
    if not result:
        raise HTTPException(404, "Product Not Found")
    return result

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    success = product_service.delete_product(db, product_id)
    if not success:
        raise HTTPException(404, "Product Not Found")
    return {"message": "Product deleted successfully"}
