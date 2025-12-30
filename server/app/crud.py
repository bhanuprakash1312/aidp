from sqlalchemy.orm import Session
from app.models import Student
from app.schemas import StudentCreate
from fastapi import HTTPException

def create_student(db:Session, student: StudentCreate):
    db_student = Student(**student.dict())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student
def get_student(db:Session):
    return db.query(Student).all()
def get_student_by_id(db:Session,student_id:int):
    return db.query(Student).filter(Student.id==student_id).first()
def update_student(db:Session,student_id:int,student:StudentCreate):
    db_student = db.query(Student).filter(Student.id==student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    db_student.name = student.name
    db_student.attendance = student.attendance
    db_student.grade = student.grade
    db_student.class_name = student.class_name
    db_student.fee_due = student.fee_due
    db.commit()
    db.refresh(db_student)
    return db_student
def delete_student(db:Session,student_id:int):
    db_student = db.query(Student).filter(Student.id==student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(db_student)
    db.commit()
    return {"detail":"Student deleted successfully"}
        