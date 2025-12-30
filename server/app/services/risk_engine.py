import joblib
import numpy as np
import os

# Base directory: app/
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "ml", "project.joblib")

# Load model bundle
bundle = joblib.load(MODEL_PATH)

model = bundle["model"]
label_map = bundle["label_map"]   # {0:'dropout', 1:'enrolled', 2:'graduate'}

def calculate_risk(attendance: float, grade: float, fee_due: float) -> str:
    # Convert fee_due (float) → binary (as used in training)
    fee_due_binary = 1 if fee_due > 0 else 0

    # ⚠️ IMPORTANT: FEATURE ORDER
    # Model was trained on: [attendance, fee_due_binary, grade]
    X = np.array([[attendance, fee_due_binary, grade]])

    pred = model.predict(X)[0]
    return label_map[pred]
