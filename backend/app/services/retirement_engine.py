from datetime import datetime
from app.models.schemas import (
    UserProfile, RetirementPathsResponse, RetirementScenario, 
    RetirementSummary, TimelineItem
)
from app.core.config import settings

def calculate_retirement_age(
    current_age: int,
    current_assets: float,
    annual_income: float,
    monthly_savings: float,
    annual_expenses: float,
    rate_of_return: float,
    target_withdrawal_rate: float
) -> int:
    """
    Calculates the age at which assets >= annual_expenses / target_withdrawal_rate.
    Uses a simple compound interest loop.
    """
    target_number = annual_expenses / target_withdrawal_rate
    assets = current_assets
    age = current_age
    
    # Safety break to prevent infinite loops
    while assets < target_number and age < 100:
        # Add annual savings
        assets += monthly_savings * 12
        # Add investment returns
        assets *= (1 + rate_of_return)
        # Adjust target for inflation (simplified: we assume real returns or adjust target)
        # For this MVP, let's use real returns (nominal - inflation) for growth
        # and keep target constant in today's dollars.
        age += 1
        
    return age

def generate_retirement_paths(profile: UserProfile) -> RetirementPathsResponse:
    current_year = datetime.now().year
    
    # 1. Determine Financial Baselines
    # Estimate expenses if not provided (Income - Savings - Taxes/Other)
    # Simplified: Expenses = Income - (Savings * 12)
    # In reality, taxes matter, but for MVP this is a proxy for "spending level".
    annual_expenses = profile.annualIncome - (profile.monthlySavings * 12)
    if annual_expenses < 0: annual_expenses = profile.annualIncome * 0.5 # Fallback
    
    real_return = settings.MARKET_RETURNS[profile.riskProfile] - settings.INFLATION_RATE
    
    # --- Scenario 1: Baseline ---
    baseline_age = calculate_retirement_age(
        profile.currentAge,
        profile.investableAssets,
        profile.annualIncome,
        profile.monthlySavings,
        annual_expenses,
        real_return,
        settings.WITHDRAWAL_RATE
    )
    
    baseline_scenario = RetirementScenario(
        id="baseline",
        label="Baseline Path",
        description="Continuing your current trajectory with standard market returns.",
        targetRetirementAge=baseline_age,
        targetYear=current_year + (baseline_age - profile.currentAge),
        requiredMonthlySavings=profile.monthlySavings,
        probabilityScore=90,
        keyActions=["Maintain current savings rate", "Rebalance portfolio annually"],
        timeline=[
            TimelineItem(period="Next 1 Year", actions=["Build emergency fund"]),
            TimelineItem(period="Long Term", actions=["Maximize tax-advantaged accounts"])
        ]
    )
    
    # --- Scenario 2: Upskill ---
    # Calculate potential income boost
    income_multiplier = 1.0
    top_skill = None
    for skill in profile.skills:
        if skill.level == "Advanced":
            income_multiplier += settings.SKILL_UPLIFT["Advanced"]
            if not top_skill: top_skill = skill
        elif skill.level == "Intermediate":
            income_multiplier += settings.SKILL_UPLIFT["Intermediate"]
            
    # Cap multiplier
    income_multiplier = min(income_multiplier, 1.4)
    
    # Assume 50% of new income goes to savings
    new_income = profile.annualIncome * income_multiplier
    income_diff = new_income - profile.annualIncome
    upskill_monthly_savings = profile.monthlySavings + (income_diff * 0.5 / 12)
    
    upskill_age = calculate_retirement_age(
        profile.currentAge,
        profile.investableAssets,
        new_income,
        upskill_monthly_savings,
        annual_expenses, # Assume expenses stay same (lifestyle creep controlled)
        real_return,
        settings.WITHDRAWAL_RATE
    )
    
    upskill_scenario = RetirementScenario(
        id="upskill",
        label="Upskilled Accelerator",
        description=f"Leveraging skills to increase income by {int((income_multiplier-1)*100)}%.",
        targetRetirementAge=upskill_age,
        targetYear=current_year + (upskill_age - profile.currentAge),
        requiredMonthlySavings=upskill_monthly_savings,
        probabilityScore=75,
        keyActions=[
            f"Leverage {top_skill.name if top_skill else 'skills'} for promotion" if top_skill else "Acquire high-value skills",
            "Invest 50% of all raises"
        ],
        timeline=[
            TimelineItem(period="Next 6 Months", actions=["Identify skill gaps", "Negotiate salary"]),
            TimelineItem(period="Next 2 Years", actions=["Switch jobs or get promoted"])
        ]
    )
    
    # --- Scenario 3: Geo-Arbitrage ---
    # If already in Low COL, this might not apply effectively, but let's assume moving to an even cheaper place
    # or if in High/Medium, moving to Low.
    
    expense_reduction = 0.0
    if profile.costOfLiving == "High":
        expense_reduction = settings.GEO_ARBITRAGE_SAVINGS["Low"] # Move to Low
    elif profile.costOfLiving == "Medium":
        expense_reduction = settings.GEO_ARBITRAGE_SAVINGS["Medium"] # Move to Low
    else:
        expense_reduction = 0.10 # Move to ultra-low
        
    geo_expenses = annual_expenses * (1 - expense_reduction)
    
    geo_age = calculate_retirement_age(
        profile.currentAge,
        profile.investableAssets,
        profile.annualIncome,
        profile.monthlySavings, # Savings might actually go UP if income stays same, but let's keep savings same and expenses lower implies faster accumulation relative to target
        geo_expenses,
        real_return,
        settings.WITHDRAWAL_RATE
    )
    
    geo_scenario = RetirementScenario(
        id="geo-arbitrage",
        label="Geo-Arbitrage",
        description="Moving to a lower cost-of-living area to reduce expenses.",
        targetRetirementAge=geo_age,
        targetYear=current_year + (geo_age - profile.currentAge),
        requiredMonthlySavings=profile.monthlySavings,
        probabilityScore=85,
        keyActions=[
            "Relocate to a lower cost-of-living area",
            f"Reduce annual expenses by {int(expense_reduction*100)}%"
        ],
        timeline=[
            TimelineItem(period="Next 1 Year", actions=["Research locations", "Plan move"]),
            TimelineItem(period="Next 3 Years", actions=["Execute relocation"])
        ]
    )

    scenarios = [baseline_scenario, upskill_scenario, geo_scenario]
    
    # Sort by age
    scenarios.sort(key=lambda x: x.targetRetirementAge)
    best_case = scenarios[0]
    
    return RetirementPathsResponse(
        summary=RetirementSummary(
            earliestRetirementAge=best_case.targetRetirementAge,
            earliestRetirementYear=best_case.targetYear,
            headline=f"You could retire at {best_case.targetRetirementAge} with the {best_case.label}.",
            caveats=[
                "Assumes consistent market returns.",
                "Inflation adjusted at 3%.",
                "Does not account for major health events."
            ]
        ),
        scenarios=scenarios
    )
