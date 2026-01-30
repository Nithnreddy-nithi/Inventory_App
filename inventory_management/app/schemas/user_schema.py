

from pydantic import BaseModel, constr
class UserCreate(BaseModel):
    username: str
    password: str
    role: str = "staff"

class UserOut(BaseModel):
    id: int
    username: str
    role: str

    class Config:
        from_attributes = True  # Updated from orm_mode = True
        
class Token(BaseModel):
    access_token: str
    token_type: str


class UserRegister(BaseModel):
    username: constr(min_length=3, max_length=50)
    password: constr(min_length=4, max_length=72)  # bcrypt max 72 bytes
    role: str = "staff"


class ChangePasswordRequest(BaseModel):
    old_password: constr(min_length=4, max_length=72)
    new_password: constr(min_length=6, max_length=72)
