from app.database import SessionLocal
from app.models import User
from app.core.security import hash_password

def create_super_admin():
    db = SessionLocal()

    user = User(
        name="Bhanuprakash",
        email="bp136897@gmail.com",
        password_hash=hash_password("bhanu1312"),
        role="super_admin"
    )

    db.add(user)
    db.commit()
    db.close()

if __name__ == "__main__":
    create_super_admin()
