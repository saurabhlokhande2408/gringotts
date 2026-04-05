from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from db.session import get_db
from core.security import hash_password,create_access_token
from db.models import User
from schemas.user import UserCreate
from core.security import verify_password
from fastapi.security import OAuth2PasswordRequestForm



router=APIRouter()
'''
Router = where endpoints live

'''


#register/signup end point
@router.post("/register",status_code=201)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()  #checking user exisst or not

    if existing_user:
     raise HTTPException(status_code=400, detail="Email already registered")
    
    
    hashed = hash_password(user.password)

    new_user = User(
        email=user.email,
        hashed_password=hashed
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "New user created successfully"}



#login end point    
@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user_exist = db.query(User).filter(User.email == form_data.username).first()

    if not user_exist:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not verify_password(form_data.password, user_exist.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token = create_access_token(
        data={"sub": user_exist.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }