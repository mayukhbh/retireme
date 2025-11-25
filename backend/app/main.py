from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import routes_retirement
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development, allow all. In prod, restrict to frontend domain.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes_retirement.router, prefix="/api/retirement", tags=["retirement"])

@app.get("/")
async def root():
    return {"message": "Welcome to RetireMe API"}
