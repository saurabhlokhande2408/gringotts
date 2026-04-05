from pydantic import BaseModel, EmailStr


# ---------------------- Request Schema ----------------------
class UserCreate(BaseModel):
    email: EmailStr
    password: str


# ---------------------- Response Schema ----------------------
class UserResponse(BaseModel):
    id: int
    email: EmailStr

    class Config:
        from_attributes = True