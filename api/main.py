"""
Health Evaluation API
Saves and loads evaluations as JSON files.
"""

import os
import json
import re
from datetime import datetime
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional, Dict, Any, List

app = FastAPI(title="Health Evaluation API")

# CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data directory - use absolute path
DATA_DIR = Path("/Users/valdimareggertsson/health-observation/api/data")
DATA_DIR.mkdir(exist_ok=True)
print(f"Data directory: {DATA_DIR}")


def sanitize_filename(name: str) -> str:
    """Create safe filename from string."""
    name = name.lower().strip()
    name = re.sub(r'[^a-z0-9\-_]', '-', name)
    name = re.sub(r'-+', '-', name)
    return name[:50]


def get_eval_filename(name: str, age: int, sex: str) -> str:
    """Generate filename from person info."""
    name_part = sanitize_filename(name or "unnamed")
    sex_part = (sex or "unknown")[0].lower()
    return f"{name_part}_{age}_{sex_part}.json"


class Evaluation(BaseModel):
    id: str
    created_at: str
    updated_at: str
    person_name: Optional[str] = None
    person_age: Optional[int] = None
    person_sex: Optional[str] = None
    measurements: Dict[str, Any] = {}
    notes: Optional[str] = None


class EvaluationSummary(BaseModel):
    filename: str
    name: str
    age: Optional[int]
    sex: Optional[str]
    measurement_count: int
    updated_at: str


@app.get("/api/evaluations", response_model=List[EvaluationSummary])
def list_evaluations():
    """List all saved evaluations."""
    evaluations = []
    
    for file in DATA_DIR.glob("*.json"):
        try:
            with open(file, "r") as f:
                data = json.load(f)
                evaluations.append(EvaluationSummary(
                    filename=file.stem,
                    name=data.get("person_name", "Unnamed"),
                    age=data.get("person_age"),
                    sex=data.get("person_sex"),
                    measurement_count=len(data.get("measurements", {})),
                    updated_at=data.get("updated_at", "")
                ))
        except Exception:
            continue
    
    # Sort by updated_at descending
    evaluations.sort(key=lambda x: x.updated_at, reverse=True)
    return evaluations


@app.get("/api/evaluations/{filename}")
def get_evaluation(filename: str):
    """Load a specific evaluation."""
    filepath = DATA_DIR / f"{sanitize_filename(filename)}.json"
    
    if not filepath.exists():
        raise HTTPException(status_code=404, detail="Evaluation not found")
    
    with open(filepath, "r") as f:
        return json.load(f)


@app.post("/api/evaluations")
def save_evaluation(evaluation: Evaluation):
    """Save an evaluation."""
    if not evaluation.person_age:
        raise HTTPException(status_code=400, detail="Age is required")
    
    filename = get_eval_filename(
        evaluation.person_name,
        evaluation.person_age,
        evaluation.person_sex
    )
    filepath = DATA_DIR / filename
    
    # Update timestamp
    data = evaluation.dict()
    data["updated_at"] = datetime.utcnow().isoformat() + "Z"
    
    with open(filepath, "w") as f:
        json.dump(data, f, indent=2)
    
    return {"status": "saved", "filename": filename}


@app.delete("/api/evaluations/{filename}")
def delete_evaluation(filename: str):
    """Delete an evaluation."""
    filepath = DATA_DIR / f"{sanitize_filename(filename)}.json"
    
    if not filepath.exists():
        raise HTTPException(status_code=404, detail="Evaluation not found")
    
    filepath.unlink()
    return {"status": "deleted"}


# Serve static files (the app)
app.mount("/", StaticFiles(directory=Path(__file__).parent.parent / "app", html=True), name="static")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8090)
