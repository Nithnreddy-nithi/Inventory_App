# app/models/product.py
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    

    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=True)  # ✅ ADD THIS

    price = Column(Float, nullable=False, default=0.0)
    stock_qty = Column(Integer, nullable=False, default=0)

    category = relationship("Category", back_populates="products", lazy="joined")
    supplier = relationship("Supplier", back_populates="products", lazy="joined")  # ✅ Correct relation
    transactions = relationship("InventoryTransaction", back_populates="product", cascade="all, delete", lazy="raise")
    purchase_items = relationship("PurchaseItem",back_populates="product",
        cascade="all, delete-orphan")



    