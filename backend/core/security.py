from passlib.context import CryptContext
from db.models import User
from datetime import datetime,timedelta,timezone
from uuid import uuid4
from jose import JWTError, jwt
from datetime import datetime, timedelta
from core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Hashing  password
def hash_password(plain: str):
    return pwd_context.hash(plain)


# Verify password
def verify_password(plain: str, hashed_password: str):
    return pwd_context.verify(plain, hashed_password)




SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

#creating access token
def create_access_token(data: dict):
    to_encode_data = data.copy()

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    iat=datetime.utcnow()
    jti= str(uuid4())
    to_encode_data.update({"exp": expire})
    to_encode_data.update({"iat":iat})
    to_encode_data.update({"jwti":jti})
    encoded_jwt = jwt.encode(to_encode_data, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt

    

