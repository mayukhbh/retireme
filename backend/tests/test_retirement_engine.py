from app.services.retirement_engine import calculate_retirement_age, generate_retirement_paths
from app.models.schemas import UserProfile, Skill

def test_calculate_retirement_age_basic():
    # Simple case: 0 assets, need 1M, save 10k/year, 0 return -> 100 years
    # With return, should be less.
    age = calculate_retirement_age(
        current_age=30,
        current_assets=0,
        annual_income=100000,
        monthly_savings=1000, # 12k/year
        annual_expenses=40000, # Target 1M
        rate_of_return=0.05,
        target_withdrawal_rate=0.04
    )
    assert 30 < age < 100

def test_generate_retirement_paths_structure():
    profile = UserProfile(
        currentAge=30,
        country="USA",
        costOfLiving="Medium",
        annualIncome=80000,
        investableAssets=20000,
        monthlySavings=1000,
        riskProfile="Balanced",
        skills=[Skill(id="1", name="Python", level="Advanced", category="Tech")],
        lifestyleIntensity=50
    )
    
    response = generate_retirement_paths(profile)
    
    assert response.summary.earliestRetirementAge > 30
    assert len(response.scenarios) == 3
    
    # Check if upskill scenario exists and is better or equal to baseline (usually better)
    baseline = next(s for s in response.scenarios if s.id == "baseline")
    upskill = next(s for s in response.scenarios if s.id == "upskill")
    
    assert upskill.targetRetirementAge <= baseline.targetRetirementAge
