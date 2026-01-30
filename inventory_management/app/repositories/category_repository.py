# app/repositories/category_repository.py
from sqlalchemy.orm import Session
from app.models.category import Category

class CategoryRepository:

    @staticmethod
    def create(db: Session, name: str):
        category = Category(name=name)
        db.add(category)
        db.commit()
        db.refresh(category)
        return category

    @staticmethod
    def get_all(db: Session):
        return db.query(Category).all()

    @staticmethod
    def get_by_id(db: Session, category_id: int):
        return db.query(Category).filter(Category.id == category_id).first()

    @staticmethod
    def delete(db: Session, category_id: int):
        category = db.query(Category).filter(Category.id == category_id).first()
        if category:
            db.delete(category)
            db.commit()
        return category
    @staticmethod
    def update(db: Session, category_id: int, new_name: str):
        category = db.query(Category).filter(Category.id == category_id).first()
        if not category:
            return None
        category.name = new_name
        db.commit()
        db.refresh(category)
        return category


