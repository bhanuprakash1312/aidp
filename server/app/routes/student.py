from fastapi import APIRouter, Depends , UploadFile, File
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import crud, schemas
from fastapi import HTTPException
from app.core.deps import get_current_user
from app.models import RiskHistory, Student
import pandas as pd
from io import BytesIO
from app.services.risk_engine import calculate_risk
router = APIRouter(prefix="/students", tags=["Students"])
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
# @router.post("/", response_model=schemas.StudentOut)
# def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db)):
#     return crud.create_student(db=db, student=student) 
# @router.get("/", response_model=list[schemas.StudentOut])
# def read_students(db: Session = Depends(get_db)):
#     return crud.get_student(db=db)
@router.get("/")
def get_students(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
    page: int = 1,
    limit: int = 10,
):
    offset = (page - 1) * limit

    query = (
        db.query(
            Student.id,
            Student.name,
            Student.class_name,
            Student.attendance,
            Student.grade,
            Student.fee_due,
            RiskHistory.risk_level,
        )
        .outerjoin(
            RiskHistory,
            RiskHistory.student_id == Student.id
        )
    )

    # 🔐 Admin → only assigned class
    if current_user["role"] == "admin":
        query = query.filter(
            Student.class_name == current_user["class_assigned"]
        )

    # ✅ Total count (before pagination)
    total = query.count()

    # ✅ Apply pagination
    results = (
        query
        .offset(offset)
        .limit(limit)
        .all()
    )

    return {
        "page": page,
        "limit": limit,
        "total": total,
        "data": [
            {
                "id": r.id,
                "name": r.name,
                "class_name": r.class_name,
                "attendance": r.attendance,
                "grade": r.grade,
                "fee_due": r.fee_due,
                "risk_level": r.risk_level or "enrolled",
            }
            for r in results
        ]
    }

@router.post("/upload-excel")
def upload_students(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    REQUIRED_COLUMNS = ["name", "class_name", "attendance", "grade", "fee_due"]

    try:
        print("UPLOAD HIT")

        df = pd.read_excel(file.file)
        print("Excel loaded")

        for i, row in df.iterrows():
            print("ROW:", i, row.to_dict())

            # ✅ Normalize column names (Name → name, CLASS_NAME → class_name)
            row = {str(k).strip().lower(): v for k, v in row.to_dict().items()}

            # ✅ Validate required columns
            for col in REQUIRED_COLUMNS:
                if col not in row:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Missing required column: {col}",
                    )

            try:
                student = Student(
                    name=str(row["name"]).strip(),
                    class_name=str(row["class_name"]).strip(),
                    attendance=float(row["attendance"]),
                    grade=float(row["grade"]),   # ✅ FIXED
                    fee_due=float(row["fee_due"]),
                )

            except ValueError:
                raise HTTPException(
                    status_code=400,
                    detail=(
                        f"Invalid data type in row {i + 2}. "
                        "Attendance and Fee Due must be numeric."
                    ),
                )

            db.add(student)
            db.commit()   # commit per row (your choice)

        return {"detail": "Upload finished successfully"}

    except HTTPException:
        # pass through clean errors
        raise

    except Exception as e:
        print("🔥 ERROR OCCURRED 🔥")
        print(e)
        raise HTTPException(
            status_code=500,
            detail="Unexpected server error during Excel upload",
        )


# @router.get("/{student_id}", response_model=schemas.StudentOut)
# def get_student(student_id: int, db:Session = Depends(get_db)):
#     student = crud.get_student_by_id(db=db, student_id=student_id)
#     if not student:
#         raise HTTPException(status_code=404, detail="Student not found")
#     return student
# @router.put("/{student_id}", response_model=schemas.StudentOut)
# def update_student(student_id:int, student:schemas.StudentCreate, db:Session=Depends(get_db)):
#     updated = crud.update_student(db=db, student_id=student_id, student=student)
#     if not updated:
#         raise HTTPException(status_code=404, detail="Student not found")    
#     return updated
# @router.delete("/{student_id}")
# def delete_student(student_id:int, db:Session=Depends(get_db)):
#     deleted = crud.delete_student(db=db, student_id=student_id)
#     if not deleted:
#         raise HTTPException(status_code=404, detail="Student not found")    
#     return {"detail":"Student deleted successfully"}
@router.get("/")
def get_students(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    query = (
        db.query(
            Student.id,
            Student.name,
            Student.class_name,
            Student.attendance,
            Student.grade,
            Student.fee_due,
            RiskHistory.risk_level.label("risk_level"),
        )
        .outerjoin(
            RiskHistory,
            RiskHistory.student_id == Student.id
        )
    )

    if current_user['role'] == "admin":
        query = query.filter(
            Student.class_name == current_user['class_assigned']
        )

    results = query.all()

    response = []
    for r in results:
        response.append({
            "id": r.id,
            "name": r.name,
            "class_name": r.class_name,
            "attendance": r.attendance,
            "grade": r.grade,
            "fee_due": r.fee_due,
            # ✅ THIS IS THE KEY
            "risk_level": r.risk_level or "enrolled",
        })
    

    return response


