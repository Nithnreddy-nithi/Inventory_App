from pydantic import BaseModel, computed_field
from typing import List, Optional
from datetime import datetime

class PurchaseItemCreate(BaseModel):
    product_id: int
    quantity: int
    unit_price: float


class PurchaseCreate(BaseModel):
    supplier_id: int
    items: List[PurchaseItemCreate]


class ProductMiniResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class PurchaseItemResponse(BaseModel):
    product_id: int
    quantity: int
    unit_price: float
    product: Optional[ProductMiniResponse] = None

    @computed_field
    @property
    def total_price(self) -> float:
        return self.quantity * self.unit_price

    class Config:
        from_attributes = True


class SupplierResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class PurchaseResponse(BaseModel):
    id: int
    supplier: Optional[SupplierResponse]
    status: str
    total_amount: float
    created_at: datetime

    class Config:
        from_attributes = True


class PurchaseDetailResponse(PurchaseResponse):
    items: List[PurchaseItemResponse]
