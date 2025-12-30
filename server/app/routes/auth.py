from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.core.security import  verify_password
from app.core.jwt import create_access_token
from app.schemas import LoginSchema
router = APIRouter(prefix="/auth", tags=["Auth"])
@router.post("/login")
def login(login_data: LoginSchema,db:Session=Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password,user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Invalid email or password")
    token = create_access_token({"sub":user.email,"role":user.role,"class_assigned":user.class_assigned})
    return {
        "access_token": token,
        "token_type": "bearer",
        "role":user.role,
        "class_assigned":user.class_assigned
    }