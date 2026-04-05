from dotenv import load_dotenv
import os

load_dotenv() #loading env file

class Settings:
    def __init__(self):
        self.SECRET_KEY=os.getenv("SECRET_KEY")
        if not self.SECRET_KEY:
            raise ValueError("SECRET_KEY is missing in environment variables")
        self.DATABASE_URL=os.getenv("DATABASE_URL")
        if not self.DATABASE_URL:
            raise ValueError("DATABASE_URL is missing in environment variables")
        self.ALGORITHM=os.getenv("ALGORITHM")
        if not self.ALGORITHM:
            raise ValueError("ALOGORITHM is missing in environment variables")

        self.ACCESS_TOKEN_EXPIRE_MINUTES =30
        if not self.ACCESS_TOKEN_EXPIRE_MINUTES:
            raise ValueError("ACCESS_TOKEN_EXPIRE_MINUTES is missing in environment variables")

settings=Settings()  #settings object that will be imported everywhere

