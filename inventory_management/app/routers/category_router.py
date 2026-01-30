# app/routers/category_router.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.category_schema import CategoryCreate, CategoryOut
from app.services.category_service import CategoryService
from typing import List
from app.schemas.category_schema import CategoryUpdate
router = APIRouter(prefix="/categories", tags=["Categories"])

@router.post("/", response_model=CategoryOut)
def create_category(data: CategoryCreate, db: Session = Depends(get_db)):
    return CategoryService.create_category(db, data.name)

@router.get("/", response_model=List[CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return CategoryService.list_categories(db)


@router.put("/{category_id}", response_model=CategoryOut)
def update_category(category_id: int, data: CategoryUpdate, db: Session = Depends(get_db)):
    updated = CategoryService.update_category(db, category_id, data.name)
    if not updated:
        return {"detail": "Category not found"}
    return updated

@router.delete("/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db)):
    deleted = CategoryService.delete_category(db, category_id)
    if not deleted:
        return {"detail": "Category not found"}
    return {"message": "Category deleted successfully"}

