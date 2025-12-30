from app.database import SessionLocal
from app.models import User
from app.core.security import hash_password

admins = [
    ("Irfan", "irfan69@gmail.com", "admin123", "Class A"),
    ("Rasoola", "rasoola@gmail.com", "admin123", "Class B"),
    ("Hasini", "hasini@gmail.com", "admin123", "Class C"),
    ("Comtoose", "comtoose@gmail.com", "admin123", "Class D"),
]

db = SessionLocal()

for name, email, password, cls in admins:
    user = User(
        name=name,
        email=email,
        password_hash=hash_password(password),
        role="admin",
        class_assigned=cls
    )
    db.add(user)

db.commit()
db.close()
