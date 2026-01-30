from pydantic import BaseModel

class SupplierBase(BaseModel):
    name: str

class SupplierCreate(SupplierBase):
    pass

class SupplierOut(SupplierBase):
    id: int

    class Config:
        from_attributes = True
