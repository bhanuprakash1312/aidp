from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app import models
from app.routes import risk
from app.routes import student
from app.routes import auth , dashboard
from dotenv import load_dotenv
import os

load_dotenv()

FRONTEND_URL = os.getenv("FRONTEND_URL")


models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Dropout Prediction API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL] if FRONTEND_URL else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(risk.router)
app.include_router(student.router)
app.include_router(auth.router)
app.include_router(dashboard.router)

