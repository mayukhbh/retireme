class Settings:
    PROJECT_NAME: str = "RetireMe API"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api"

    # Monte Carlo Simulation
    SIMULATION_RUNS: int = 100

    # Financial Assumptions
    INFLATION_RATE: float = 0.03
    INFLATION_VOLATILITY: float = 0.01  # Standard deviation for inflation variance

    # Market returns by risk profile (mean, standard deviation)
    MARKET_RETURNS = {
        "Conservative": {"mean": 0.05, "std": 0.06},  # Lower returns, lower volatility
        "Balanced": {"mean": 0.07, "std": 0.12},      # Moderate returns and volatility
        "Aggressive": {"mean": 0.09, "std": 0.18}     # Higher returns, higher volatility
    }

    WITHDRAWAL_RATE: float = 0.04

    # Skill Uplift Assumptions (income boost per skill)
    SKILL_UPLIFT = {
        "Advanced": 0.12,      # 12% per advanced skill
        "Intermediate": 0.06,  # 6% per intermediate skill
        "Beginner": 0.02       # 2% per beginner skill (now used)
    }
    MAX_SKILL_MULTIPLIER: float = 1.5  # Cap at 50% income boost

    # Skill category bonuses (some categories have higher market demand)
    SKILL_CATEGORY_BONUS = {
        "Tech": 1.2,        # Tech skills worth 20% more
        "Management": 1.1,  # Management skills worth 10% more
        "Creative": 1.0,
        "Manual": 0.9,
        "Other": 1.0
    }

    # Geo Arbitrage Assumptions
    GEO_ARBITRAGE_SAVINGS = {
        "Low": 0.45,    # 45% expense reduction from High to Low
        "Medium": 0.25, # 25% expense reduction from High to Medium
        "High": 0.0
    }

    # Lifestyle Intensity Multipliers
    # lifestyleIntensity 0-100 maps to expense multiplier
    LIFESTYLE_EXPENSE_RANGE = {
        "min": 0.7,  # Frugal = 70% of baseline expenses
        "max": 1.6   # Luxe = 160% of baseline expenses
    }

    # Social Security estimate (simplified - age 67 in US)
    SOCIAL_SECURITY_AGE: int = 67
    SOCIAL_SECURITY_BENEFIT_RATE: float = 0.30  # ~30% of pre-retirement income

settings = Settings()
