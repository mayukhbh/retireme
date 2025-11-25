class Settings:
    PROJECT_NAME: str = "RetireMe API"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api"

    # Financial Assumptions
    INFLATION_RATE: float = 0.03
    MARKET_RETURNS = {
        "Conservative": 0.04,
        "Balanced": 0.06,
        "Aggressive": 0.08
    }
    WITHDRAWAL_RATE: float = 0.04
    
    # Skill Uplift Assumptions
    SKILL_UPLIFT = {
        "Advanced": 0.10,
        "Intermediate": 0.05,
        "Beginner": 0.02
    }
    
    # Geo Arbitrage Assumptions
    GEO_ARBITRAGE_SAVINGS = {
        "Low": 0.40,
        "Medium": 0.20,
        "High": 0.0
    }

settings = Settings()
