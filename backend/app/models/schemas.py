from typing import List, Literal, Optional
from pydantic import BaseModel

RiskProfile = Literal["Conservative", "Balanced", "Aggressive"]
SkillLevel = Literal["Beginner", "Intermediate", "Advanced"]
SkillCategory = Literal["Tech", "Management", "Creative", "Manual", "Other"]
CostOfLiving = Literal["Low", "Medium", "High"]

class Skill(BaseModel):
    id: str
    name: str
    level: SkillLevel
    category: SkillCategory

class UserProfile(BaseModel):
    currentAge: int
    targetRetirementAge: Optional[int] = None
    country: str
    costOfLiving: CostOfLiving
    annualIncome: float
    investableAssets: float
    monthlySavings: float
    riskProfile: RiskProfile
    skills: List[Skill]
    workInterests: Optional[str] = None
    preferredLocations: List[str] = []
    lifestyleIntensity: int # 0-100

class TimelineItem(BaseModel):
    period: str
    actions: List[str]

class RetirementScenario(BaseModel):
    id: str
    label: str
    description: str
    targetRetirementAge: int
    targetYear: int
    requiredMonthlySavings: float
    probabilityScore: float
    keyActions: List[str]
    timeline: List[TimelineItem]

class RetirementSummary(BaseModel):
    earliestRetirementAge: int
    earliestRetirementYear: int
    headline: str
    caveats: List[str]

class RetirementPathsResponse(BaseModel):
    summary: RetirementSummary
    scenarios: List[RetirementScenario]
