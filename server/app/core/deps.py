from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer 

from app.core.jwt import SECRET_KEY, ALGORITHM
from jose import jwt, JWTError

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
        return {
            "id": payload.get("sub"),
            "role": payload.get("role"),
            "class_assigned": payload.get("class_assigned")
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
def admin_required(current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["admin","super_admin"]:
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return current_user
def super_admin_required(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "super_admin":
        raise HTTPException(status_code=403, detail="Super admin privileges required")
    return current_user

def class_admin_required(user=Depends(get_current_user)):
    if user["role"] == "super_admin":
        return user
    if user["role"] == "admin" and user["class_assigned"]:
        return user
    raise HTTPException(status_code=403, detail="Class admin privileges required")