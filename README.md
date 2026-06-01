# CrisisMind AI — Emergency Operations Center

AI-powered disaster response dashboard that triages incoming incident reports in under 2 minutes.

**Team TSK Labs · CodeSprint 11 · Track 02 — Intelligence · Informatics Institute of Technology**

---

## What it does

Operators submit raw incident text → the system automatically:
1. Classifies the disaster type (flood, fire, earthquake, chemical spill)
2. Scores urgency (low / medium / high / critical)
3. Predicts secondary risks
4. Recommends resources to deploy
5. Generates an ICS emergency checklist

Results appear live on an interactive map dashboard.

---

## Project Structure

```
Crisis-mind/
├── backend/
│   ├── main.py               ← FastAPI server + all API routes
│   └── modules/
│       ├── classifier.py     ← Disaster classification (BERT → keyword-based for now)
│       ├── urgency.py        ← Urgency scoring
│       ├── risk.py           ← Risk prediction
│       ├── resources.py      ← Resource suggestion
│       └── checklist.py      ← Emergency checklist generation
├── models/
│   └── classifier/           ← Trained BERT model goes here (Member 2)
├── data/
│   └── training/             ← Training datasets go here (Member 2)
├── frontend/
│   ├── index.html            ← EOC Dashboard
│   ├── style.css
│   ├── app.js                ← Dashboard logic + API calls
│   └── demo.js               ← Automated demo mode
├── pyproject.toml
├── Dockerfile
└── docker-compose.yml
```

---

## Setup & Run (Windows)

### Prerequisites
- Python 3.12 — download from https://www.python.org/downloads/ (check "Add Python to PATH")
- Git — download from https://git-scm.com/downloads
- Any modern browser (Chrome, Edge, Firefox)

---

**1. Install uv**
```bash
pip install uv
```

**2. Clone the repo**
```bash
git clone https://github.com/winindu942/Crisis-mind.git
cd Crisis-mind
```

**3. Create virtual environment**
```bash
uv venv
```

**4. Activate it**
```bash
.venv\Scripts\activate
```

**5. Install dependencies**
```bash
uv sync
```

**6. Start the backend**
```bash
uvicorn backend.main:app --reload --port 8001
```

**7. Open the dashboard**

Open `frontend/index.html` in your browser — you can double-click it in File Explorer.

---

### Verify it's working

- Go to `http://127.0.0.1:8001/incidents` — should return `[]`
- Dashboard should load with 4 demo incidents on the map

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/report` | Submit an incident report |
| GET | `/incidents` | Get all incidents |
| POST | `/incidents/{id}/resolve` | Resolve an incident |

Interactive docs available at `http://127.0.0.1:8001/docs`

---

## Team

| Member | Role | Module |
|--------|------|--------|
| Jaleel | Backend + Integration | FastAPI, PostgreSQL, Redis, Docker |
| Hamdhi | Disaster Classification AI | BERT, HuggingFace, PyTorch |
| Fiham | Urgency Scoring AI | scikit-learn, rule-based |
| Thalha | EOC Dashboard | React.js, Leaflet.js |
| Winindu | Risk Prediction AI | pgmpy, GeoPandas |
| Avyusshkar | UI/UX + Resource + Checklist | Figma, Python |
