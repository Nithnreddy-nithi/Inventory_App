from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.sale_schema import SaleItemCreate, SaleItemUpdate, SaleItemOut
from app.services.sale_item_service import add_sale_item, update_sale_item, delete_sale_item
from app.repositories.sale_item_repository import SaleItemRepository
from app.services.auth_service import require_role


router = APIRouter(prefix="/sale-items", tags=["Sale Items"],dependencies=[Depends(require_role(["admin", "manager"]))])
repo = SaleItemRepository()

@router.post("/", response_model=SaleItemOut)
def create_sale_item(data: SaleItemCreate, db: Session = Depends(get_db)):
    return add_sale_item(db, data)

@router.get("/", response_model=list[SaleItemOut])
def list_sale_items(db: Session = Depends(get_db)):
    return repo.get_all(db)

@router.get("/{item_id}", response_model=SaleItemOut)
def get_sale_item(item_id: int, db: Session = Depends(get_db)):
    return repo.get_by_id(db, item_id)

@router.put("/{item_id}", response_model=SaleItemOut)
def update_item(item_id: int, data: SaleItemUpdate, db: Session = Depends(get_db)):
    return update_sale_item(db, item_id, data)

@router.delete("/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    return delete_sale_item(db, item_id)
