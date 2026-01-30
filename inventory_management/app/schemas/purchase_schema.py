from pydantic import BaseModel
from typing import List
from datetime import datetime


class PurchaseItemCreate(BaseModel):
    product_id: int
    quantity: int
    unit_price: float


class PurchaseCreate(BaseModel):
    supplier_id: int
    items: List[PurchaseItemCreate]


class PurchaseItemResponse(BaseModel):
    product_id: int
    quantity: int
    unit_price: float
    total_price: float


class PurchaseResponse(BaseModel):
    id: int
    supplier_id: int
    status: str
    total_amount: float
    created_at: datetime

    class Config:
        from_attributes = True


class PurchaseDetailResponse(PurchaseResponse):
    items: List[PurchaseItemResponse]
