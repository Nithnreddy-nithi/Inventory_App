# app/services/category_service.py
from sqlalchemy.orm import Session
from app.repositories.category_repository import CategoryRepository

class CategoryService:

    @staticmethod
    def create_category(db: Session, name: str):
        return CategoryRepository.create(db, name)

    @staticmethod
    def list_categories(db: Session):
        return CategoryRepository.get_all(db)

    @staticmethod
    def get_category(db: Session, category_id: int):
        return CategoryRepository.get_by_id(db, category_id)
    @staticmethod
    def update_category(db: Session, category_id: int, name: str):
        return CategoryRepository.update(db, category_id, name)

    @staticmethod
    def delete_category(db: Session, category_id: int):
        return CategoryRepository.delete(db, category_id)

