from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


# ------------------ SALE ITEM ------------------

class SaleItemBase(BaseModel):
    product_id: int
    quantity: int
    price: float


class SaleItemCreate(SaleItemBase):
    pass


class SaleItemUpdate(BaseModel):
    quantity: Optional[int] = None
    price: Optional[float] = None


class SaleItemOut(SaleItemBase):
    id: int
    sale_id: int

    class Config:
        from_attributes = True


# ------------------ SALE ------------------

class SaleBase(BaseModel):
    user_id: Optional[int] = None
    total_amount: float = 0.0


class SaleCreate(SaleBase):
    items: List[SaleItemCreate]


class SaleUpdate(SaleBase):
    items: Optional[List[SaleItemCreate]] = None


class SaleOut(SaleBase):
    id: int
    date: datetime
    items: List[SaleItemOut]

    class Config:
        from_attributes = True

class ProductMiniOut(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class SaleItemOut(BaseModel):
    product_id: int
    quantity: int
    price: float
    product: ProductMiniOut   # 🔥 ADD THIS

    class Config:
        from_attributes = True
class SaleItemUpdate(BaseModel):
    quantity: Optional[int] = None
    price: Optional[float] = None
