from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Student,RiskHistory
from app.services.risk_engine import calculate_risk
from app.core.deps import get_current_user


router = APIRouter(prefix="/risk", tags=["Risk"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/evaluate")
def get_risk_students(db: Session = Depends(get_db)):

            students = db.query(Student).all()
            result = []

            for s in students:
                risk = calculate_risk(s.attendance,s.fee_due,s.grade)
                history = RiskHistory(
                    student_id=s.id,
                    risk_level=risk,
                    class_name = s.class_name,
                    attendance=s.attendance,
                    grade=s.grade,
                    fee_due = s.fee_due)
                db.add(history)
                result.append({
                    "student_id": s.id,
                    "name": s.name,
                    "risk_level": risk
                })

                db.commit()
            return result

@router.get("/risk")
def get_risk_history(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    query = (
        db.query(
            RiskHistory.id,
            RiskHistory.student_id,
            RiskHistory.risk_level,
            RiskHistory.created_at,
            Student.name.label("name"),
            Student.class_name.label("class_name"),
        )
        .join(Student, RiskHistory.student_id == Student.id)
    )

    # Admin → only their class
    if current_user["role"] == "admin":
        query = query.filter(
            Student.class_name == current_user["class_assigned"]
        )

    results = query.all()

    return [
        {
            "id": r.id,
            "student_id": r.student_id,
            "name": r.name,
            "class_name": r.class_name,
            "risk_level": r.risk_level,
            "created_at": r.created_at,
            "notes": "-",   # 👈 SAFE DEFAULT
        }
        for r in results
    ]


