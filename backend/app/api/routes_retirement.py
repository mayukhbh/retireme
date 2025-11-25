from fastapi import APIRouter, HTTPException
from app.models.schemas import UserProfile, RetirementPathsResponse
from app.services.retirement_engine import generate_retirement_paths

router = APIRouter()

@router.post("/paths", response_model=RetirementPathsResponse)
async def get_retirement_paths(profile: UserProfile):
    try:
        # In a real app, we might save the profile to DB here
        response = generate_retirement_paths(profile)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check():
    return {"status": "ok"}
