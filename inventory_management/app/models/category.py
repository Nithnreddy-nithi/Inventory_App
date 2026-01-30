# app/models/category.py
from sqlalchemy import Column, Integer, String
from app.database.database import Base
from sqlalchemy.orm import relationship

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), unique=True, nullable=False)
    products = relationship("Product", back_populates="category")
