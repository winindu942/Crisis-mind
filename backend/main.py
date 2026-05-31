from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.modules.classifier import classify
from backend.modules.urgency import score_urgency
from backend.modules.risk import predict_risks
from backend.modules.resources import suggest_resources
from backend.modules.checklist import get_checklist
import uuid
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

incidents = []

class ReportInput(BaseModel):
    report_text: str
    location: str
    lat: float = 6.9271
    lng: float = 79.8612

@app.post("/report")
def submit_report(data: ReportInput):
    disaster_type = classify(data.report_text)
    urgency = score_urgency(disaster_type, data.report_text)
    risks = predict_risks(disaster_type, urgency)
    resources = suggest_resources(disaster_type, urgency)
    checklist = get_checklist(disaster_type)

    incident = {
        "incident_id": f"INC-{str(uuid.uuid4())[:6].upper()}",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "report_text": data.report_text,
        "location": data.location,
        "lat": data.lat,
        "lng": data.lng,
        "disaster_type": disaster_type,
        "urgency": urgency,
        "risk_predictions": risks,
        "resources": resources,
        "checklist": checklist,
        "status": "active"
    }

    incidents.append(incident)
    return incident

@app.get("/incidents")
def get_incidents():
    return incidents

@app.post("/incidents/{incident_id}/resolve")
def resolve_incident(incident_id: str):
    for inc in incidents:
        if inc["incident_id"] == incident_id:
            inc["status"] = "resolved"
            return inc
    return {"error": "Incident not found"}
