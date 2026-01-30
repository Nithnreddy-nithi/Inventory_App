# app/schemas/product.py
from pydantic import BaseModel
from typing import Optional 
class ProductBase(BaseModel):
    name: str
    price: float
    stock: int = 0
    stock_qty:int = 0

class ProductCreate(ProductBase):
    category_id: Optional[int] = None
    supplier_id: Optional[int] = None

class ProductUpdate(ProductBase):
    pass

class Product(ProductBase):
    id: int

    class Config:
        from_attributes = True
class ProductOut(ProductBase):
    id: int
    category_id: Optional[int] = None
    supplier_id: Optional[int] = None
    class Config:
        from_attributes = True
