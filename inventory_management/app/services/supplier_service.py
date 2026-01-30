from sqlalchemy.orm import Session
from app.repositories.supplier_repository import SupplierRepository

class SupplierService:

    @staticmethod
    def create_supplier(db: Session, name: str):
        return SupplierRepository.create_supplier(db, name)

    @staticmethod
    def list_suppliers(db: Session):
        return SupplierRepository.get_all_suppliers(db)

    @staticmethod
    def edit_supplier(db: Session, supplier_id: int, name: str):
        return SupplierRepository.update_supplier(db, supplier_id, name)

    @staticmethod
    def remove_supplier(db: Session, supplier_id: int):
        return SupplierRepository.delete_supplier(db, supplier_id)
