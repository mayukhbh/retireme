from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/retirement/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_get_paths_endpoint():
    payload = {
        "currentAge": 30,
        "country": "USA",
        "costOfLiving": "Medium",
        "annualIncome": 80000,
        "investableAssets": 20000,
        "monthlySavings": 1000,
        "riskProfile": "Balanced",
        "skills": [
            {"id": "1", "name": "Python", "level": "Advanced", "category": "Tech"}
        ],
        "lifestyleIntensity": 50
    }
    
    response = client.post("/api/retirement/paths", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
    assert "scenarios" in data
    assert len(data["scenarios"]) >= 1
