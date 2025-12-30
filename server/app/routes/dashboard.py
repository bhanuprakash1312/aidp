from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Student
from app.models import RiskHistory
from app.core.deps import get_current_user
from sqlalchemy import func

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary")
def dashboard_summary(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # Base queries
    student_query = db.query(Student)
    risk_query = db.query(RiskHistory)

    
    if current_user["role"] == "admin":
        student_query = student_query.filter(
            Student.class_name == current_user["class_assigned"]
        )
        risk_query = risk_query.filter(
            RiskHistory.class_name == current_user["class_assigned"]
        )
    # print(current_user)

    # Total students
    total_students = student_query.count()

    # Average attendance (safe fallback)
    average_attendance = student_query.with_entities(
        func.avg(Student.attendance)
    ).scalar() or 0

    # Risk distribution
    risk_counts = (
        risk_query
        .with_entities(
            RiskHistory.risk_level,
            func.count(RiskHistory.id)
        )
        .group_by(RiskHistory.risk_level)
        .all()
    )

    return {
        "risk_distribution": [
            {"risk": r[0], "count": r[1]} for r in risk_counts
        ],
        "total_students": total_students,
        "average_attendance": round(float(average_attendance), 2),
    }
