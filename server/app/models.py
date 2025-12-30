from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from app.database import Base
from sqlalchemy.sql import func



class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    class_name = Column(String(50), nullable=False)   
    attendance = Column(Float)
    grade = Column(Float)
    fee_due = Column(Float)

class RiskHistory(Base):
    __tablename__ = "risk_history"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer,ForeignKey("students.id"),nullable=False)
    risk_level = Column(String(10),nullable=False)
    attendance = Column(Float)
    grade = Column(Float)
    class_name = Column(String(50), nullable=False)
    fee_due = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String(20), nullable=False)  # admin | super_admin
    class_assigned = Column(String(50), nullable=True)  
    created_at = Column(DateTime(timezone=True), server_default=func.now())
