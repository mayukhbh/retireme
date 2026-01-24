from datetime import datetime
from typing import List, Tuple
import random
import statistics
from app.models.schemas import (
    UserProfile, RetirementPathsResponse, RetirementScenario,
    RetirementSummary, TimelineItem
)
from app.core.config import settings


def get_lifestyle_multiplier(lifestyle_intensity: int) -> float:
    """
    Convert lifestyle intensity (0-100) to expense multiplier.
    0 = Frugal (0.7x), 50 = Comfortable (1.0x), 100 = Luxe (1.6x)
    """
    min_mult = settings.LIFESTYLE_EXPENSE_RANGE["min"]
    max_mult = settings.LIFESTYLE_EXPENSE_RANGE["max"]
    # Linear interpolation
    return min_mult + (max_mult - min_mult) * (lifestyle_intensity / 100)


def calculate_skill_income_boost(skills: list) -> Tuple[float, str]:
    """
    Calculate income multiplier from skills.
    Returns (multiplier, top_skill_name)
    """
    multiplier = 1.0
    top_skill_name = None
    top_skill_value = 0

    for skill in skills:
        level = skill.level
        category = skill.category

        # Base uplift from skill level
        base_uplift = settings.SKILL_UPLIFT.get(level, 0)

        # Apply category bonus
        category_bonus = settings.SKILL_CATEGORY_BONUS.get(category, 1.0)
        skill_value = base_uplift * category_bonus

        multiplier += skill_value

        # Track top skill
        if skill_value > top_skill_value:
            top_skill_value = skill_value
            top_skill_name = skill.name

    # Cap the multiplier
    multiplier = min(multiplier, settings.MAX_SKILL_MULTIPLIER)

    return multiplier, top_skill_name


def simulate_single_path(
    current_age: int,
    current_assets: float,
    monthly_savings: float,
    annual_expenses: float,
    risk_profile: str,
    include_social_security: bool = True
) -> int:
    """
    Run a single Monte Carlo simulation path.
    Returns the retirement age for this simulation.
    """
    target_number = annual_expenses / settings.WITHDRAWAL_RATE
    assets = current_assets
    age = current_age

    # Get return parameters for this risk profile
    return_params = settings.MARKET_RETURNS[risk_profile]
    mean_return = return_params["mean"]
    std_return = return_params["std"]

    while assets < target_number and age < 100:
        # Random market return for this year
        market_return = random.gauss(mean_return, std_return)

        # Random inflation for this year
        inflation = random.gauss(settings.INFLATION_RATE, settings.INFLATION_VOLATILITY)

        # Real return
        real_return = market_return - inflation

        # Add annual savings
        assets += monthly_savings * 12

        # Apply returns (can be negative in bad years)
        assets *= (1 + real_return)

        # Prevent assets from going below zero
        if assets < 0:
            assets = 0

        # Adjust target for this year's actual inflation
        target_number *= (1 + inflation)

        age += 1

        # Social Security kicks in at 67 (reduces needed assets)
        if include_social_security and age >= settings.SOCIAL_SECURITY_AGE:
            # SS covers ~30% of expenses, so we need less
            ss_benefit = annual_expenses * settings.SOCIAL_SECURITY_BENEFIT_RATE
            # Reduce target proportionally
            target_number = (annual_expenses - ss_benefit) / settings.WITHDRAWAL_RATE
            # Only apply once
            include_social_security = False

    return min(age, 100)


def run_monte_carlo(
    current_age: int,
    current_assets: float,
    monthly_savings: float,
    annual_expenses: float,
    risk_profile: str,
    num_simulations: int = None
) -> Tuple[int, int, float]:
    """
    Run Monte Carlo simulation.
    Returns (median_age, p90_age, success_probability)
    """
    if num_simulations is None:
        num_simulations = settings.SIMULATION_RUNS

    results = []
    successes = 0

    for _ in range(num_simulations):
        retirement_age = simulate_single_path(
            current_age,
            current_assets,
            monthly_savings,
            annual_expenses,
            risk_profile
        )
        results.append(retirement_age)

        # Consider success if can retire before 70
        if retirement_age < 70:
            successes += 1

    results.sort()

    median_age = int(statistics.median(results))
    # P10 = 10th percentile (pessimistic but still possible)
    p10_index = max(0, int(len(results) * 0.10) - 1)
    p10_age = results[p10_index]
    # P90 = 90th percentile (optimistic scenario)
    p90_index = min(len(results) - 1, int(len(results) * 0.90))
    p90_age = results[p90_index]

    success_probability = (successes / num_simulations) * 100

    return median_age, p90_age, success_probability


def generate_retirement_paths(profile: UserProfile) -> RetirementPathsResponse:
    current_year = datetime.now().year

    # Calculate base expenses with lifestyle adjustment
    base_expenses = profile.annualIncome - (profile.monthlySavings * 12)
    if base_expenses <= 0:
        base_expenses = profile.annualIncome * 0.5

    # Apply lifestyle intensity multiplier
    lifestyle_mult = get_lifestyle_multiplier(profile.lifestyleIntensity)
    annual_expenses = base_expenses * lifestyle_mult

    # --- Scenario 1: Baseline ---
    baseline_median, baseline_p90, baseline_prob = run_monte_carlo(
        profile.currentAge,
        profile.investableAssets,
        profile.monthlySavings,
        annual_expenses,
        profile.riskProfile
    )

    years_to_retire = baseline_median - profile.currentAge
    lifestyle_label = "frugal" if profile.lifestyleIntensity < 33 else "comfortable" if profile.lifestyleIntensity < 66 else "luxurious"

    baseline_scenario = RetirementScenario(
        id="baseline",
        label="Baseline Path",
        description=f"Your current trajectory with a {lifestyle_label} lifestyle and {profile.riskProfile.lower()} investing.",
        targetRetirementAge=baseline_median,
        targetYear=current_year + years_to_retire,
        requiredMonthlySavings=profile.monthlySavings,
        probabilityScore=int(baseline_prob),
        keyActions=[
            f"Maintain ${profile.monthlySavings:,.0f}/month savings rate",
            "Rebalance portfolio annually",
            "Maximize tax-advantaged accounts"
        ],
        timeline=generate_timeline(profile, "baseline", years_to_retire)
    )

    # --- Scenario 2: Upskill Accelerator ---
    income_multiplier, top_skill = calculate_skill_income_boost(profile.skills)
    income_boost_pct = int((income_multiplier - 1) * 100)

    new_income = profile.annualIncome * income_multiplier
    income_diff = new_income - profile.annualIncome
    # Invest 60% of raises
    upskill_monthly_savings = profile.monthlySavings + (income_diff * 0.6 / 12)

    upskill_median, upskill_p90, upskill_prob = run_monte_carlo(
        profile.currentAge,
        profile.investableAssets,
        upskill_monthly_savings,
        annual_expenses,  # Keep expenses same - no lifestyle creep
        profile.riskProfile
    )

    upskill_years = upskill_median - profile.currentAge

    if income_boost_pct > 0:
        upskill_desc = f"Leverage your skills for a {income_boost_pct}% income boost, investing most of your raises."
        skill_action = f"Capitalize on {top_skill} expertise" if top_skill else "Develop high-demand skills"
    else:
        upskill_desc = "Develop marketable skills to increase your earning potential by 20-30%."
        skill_action = "Learn in-demand skills (Tech, Management)"
        income_boost_pct = 25  # Potential boost
        upskill_monthly_savings = profile.monthlySavings * 1.5

    upskill_scenario = RetirementScenario(
        id="upskill",
        label="Skill Accelerator",
        description=upskill_desc,
        targetRetirementAge=upskill_median,
        targetYear=current_year + upskill_years,
        requiredMonthlySavings=round(upskill_monthly_savings, 2),
        probabilityScore=int(min(upskill_prob, 85)),  # Cap at 85% - career changes are uncertain
        keyActions=[
            skill_action,
            "Invest 60% of all raises",
            "Negotiate salary or change jobs every 2-3 years"
        ],
        timeline=generate_timeline(profile, "upskill", upskill_years, top_skill)
    )

    # --- Scenario 3: Geo-Arbitrage ---
    expense_reduction = 0.0
    target_location = "a lower cost area"

    if profile.costOfLiving == "High":
        expense_reduction = settings.GEO_ARBITRAGE_SAVINGS["Low"]
        target_location = "a low-cost region"
    elif profile.costOfLiving == "Medium":
        expense_reduction = settings.GEO_ARBITRAGE_SAVINGS["Medium"]
        target_location = "a lower-cost city"
    else:
        expense_reduction = 0.15
        target_location = "an ultra-low-cost destination"

    # Use preferred locations if provided
    if profile.preferredLocations:
        target_location = profile.preferredLocations[0]

    geo_expenses = annual_expenses * (1 - expense_reduction)

    # With lower expenses, can potentially save more
    expense_savings = annual_expenses - geo_expenses
    geo_monthly_savings = profile.monthlySavings + (expense_savings * 0.3 / 12)

    geo_median, geo_p90, geo_prob = run_monte_carlo(
        profile.currentAge,
        profile.investableAssets,
        geo_monthly_savings,
        geo_expenses,
        profile.riskProfile
    )

    geo_years = geo_median - profile.currentAge

    geo_scenario = RetirementScenario(
        id="geo-arbitrage",
        label="Geo-Arbitrage",
        description=f"Relocate to {target_location} to reduce expenses by {int(expense_reduction*100)}%.",
        targetRetirementAge=geo_median,
        targetYear=current_year + geo_years,
        requiredMonthlySavings=round(geo_monthly_savings, 2),
        probabilityScore=int(min(geo_prob + 5, 95)),  # Slightly higher - expense reduction is more reliable
        keyActions=[
            f"Move to {target_location}",
            f"Reduce monthly expenses by ${int(expense_savings/12):,}",
            "Maintain remote income if possible"
        ],
        timeline=generate_timeline(profile, "geo", geo_years, target_location=target_location)
    )

    scenarios = [baseline_scenario, upskill_scenario, geo_scenario]

    # Sort by retirement age (best first)
    scenarios.sort(key=lambda x: x.targetRetirementAge)
    best_case = scenarios[0]

    # Generate headline
    years_saved = baseline_median - best_case.targetRetirementAge
    if years_saved > 0:
        headline = f"You could retire {years_saved} years earlier at age {best_case.targetRetirementAge} with the {best_case.label}."
    else:
        headline = f"Your earliest retirement is at age {best_case.targetRetirementAge} with the {best_case.label}."

    return RetirementPathsResponse(
        summary=RetirementSummary(
            earliestRetirementAge=best_case.targetRetirementAge,
            earliestRetirementYear=best_case.targetYear,
            headline=headline,
            caveats=[
                f"Based on {settings.SIMULATION_RUNS} Monte Carlo simulations.",
                f"Assumes {profile.riskProfile.lower()} risk with historical volatility.",
                "Includes Social Security benefits starting at age 67.",
                "Does not account for major life events or healthcare costs."
            ]
        ),
        scenarios=scenarios
    )


def generate_timeline(
    profile: UserProfile,
    scenario_type: str,
    years_to_retire: int,
    skill_name: str = None,
    target_location: str = None
) -> List[TimelineItem]:
    """Generate personalized timeline based on scenario and years."""

    timeline = []

    if scenario_type == "baseline":
        timeline.append(TimelineItem(
            period="Now - 6 months",
            actions=[
                "Build 6-month emergency fund",
                "Review and optimize investment allocation",
                f"Set up automatic ${profile.monthlySavings:,.0f}/month transfers"
            ]
        ))
        if years_to_retire > 5:
            timeline.append(TimelineItem(
                period="Years 1-5",
                actions=[
                    "Maximize 401(k) contributions",
                    "Consider Roth conversions in low-income years",
                    "Review insurance coverage"
                ]
            ))
        if years_to_retire > 10:
            timeline.append(TimelineItem(
                period="Years 5-10",
                actions=[
                    "Evaluate early retirement healthcare options",
                    "Build taxable brokerage for pre-59.5 access",
                    "Consider part-time work transition"
                ]
            ))

    elif scenario_type == "upskill":
        skill_focus = skill_name if skill_name else "high-demand skills"
        timeline.append(TimelineItem(
            period="Next 3 months",
            actions=[
                f"Audit market demand for {skill_focus}",
                "Update resume and LinkedIn profile",
                "Identify salary benchmarks in your field"
            ]
        ))
        timeline.append(TimelineItem(
            period="Months 3-12",
            actions=[
                "Complete relevant certifications or courses",
                "Negotiate raise or start job search",
                "Network in target industry/role"
            ]
        ))
        timeline.append(TimelineItem(
            period="Years 1-3",
            actions=[
                "Change jobs for 15-25% salary increase",
                "Invest 60% of all salary increases",
                "Build expertise for consulting/freelance options"
            ]
        ))

    elif scenario_type == "geo":
        location = target_location if target_location else "lower-cost area"
        timeline.append(TimelineItem(
            period="Now - 6 months",
            actions=[
                f"Research cost of living in {location}",
                "Explore remote work options with employer",
                "Visit potential destinations"
            ]
        ))
        timeline.append(TimelineItem(
            period="Months 6-18",
            actions=[
                "Negotiate remote work arrangement",
                "Plan logistics: housing, healthcare, visas",
                "Build local connections before move"
            ]
        ))
        timeline.append(TimelineItem(
            period="Years 1-3",
            actions=[
                "Execute relocation",
                "Optimize for local tax advantages",
                "Redirect expense savings to investments"
            ]
        ))

    return timeline
