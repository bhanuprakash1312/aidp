from pydantic import BaseModel

class StudentCreate(BaseModel):
    name : str
    attendance : float
    class_name : str
    grade : float
    fee_due : float

class StudentOut(StudentCreate):
    id : int

    class Config:
        from_attribute = True
class LoginSchema(BaseModel):
    email: str
    password: str