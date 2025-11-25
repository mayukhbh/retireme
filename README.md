# RetireMe – AI-Powered Retirement Paths

RetireMe is an intelligent retirement planning application that simulates thousands of possible futures based on your unique skills, assets, and lifestyle choices. It goes beyond simple savings calculators by modeling career growth (upskilling) and geo-arbitrage opportunities to find your most efficient path to financial freedom.

## Key Features

-   **Multi-Scenario Modeling**: Automatically generates "Baseline", "Skill-Boosted", and "Geo-Arbitrage" retirement paths.
-   **Skill-Based Income Projection**: Estimates potential income increases based on your skill set and proficiency levels.
-   **Geo-Arbitrage Engine**: Calculates the impact of relocating to lower cost-of-living areas on your retirement timeline.
-   **Cosmic UI**: A premium, immersive "interstellar" design that visualizes your life trajectory as an orbit.
-   **Privacy-First**: No account required; all simulations run instantly.

## Architecture Overview

RetireMe follows a modern client-server architecture:

-   **Frontend**: A React Single Page Application (SPA) built with Vite, TypeScript, and Tailwind CSS. It handles user input via a multi-step wizard and visualizes results using Recharts and Framer Motion.
-   **Backend**: A high-performance FastAPI (Python) server. It exposes a REST API that accepts user profiles and returns calculated retirement scenarios.
-   **Engine**: A deterministic simulation engine within the backend that processes financial math, inflation adjustments, and career growth factors.

## Tech Stack

-   **Frontend**:
    -   React 18
    -   TypeScript
    -   Tailwind CSS v4
    -   Framer Motion (Animations)
    -   Recharts (Data Visualization)
    -   Vite (Build Tool)
-   **Backend**:
    -   Python 3.10+
    -   FastAPI
    -   Uvicorn (ASGI Server)
    -   Pydantic (Data Validation)
    -   Pytest (Testing)

## Getting Started

### Prerequisites
-   Node.js (v18+)
-   Python (v3.10+)

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload
```
The API will be available at `http://localhost:8000`. API Docs at `http://localhost:8000/docs`.

### 2. Frontend Setup

```bash
# Open a new terminal and navigate to root
cd retireme # (if not already there)

# Install dependencies
npm install

# Start development server
npm run dev
```
The app will be available at `http://localhost:5173`.

## API Overview

The core endpoint is `POST /api/retirement/paths`. It takes a user's financial and skill profile and returns a set of retirement scenarios.

See [API Reference](docs/API_REFERENCE.md) for details.

## Retirement Model Assumptions

The engine uses standard financial modeling principles with specific assumptions for growth and inflation:
-   **Inflation**: 3% annually.
-   **Market Returns**: 4-8% real return based on risk profile.
-   **Withdrawal Rate**: 4% (Safe Withdrawal Rate).

See [Retirement Model Documentation](docs/MODEL_RETIREMENT.md) for formulas and logic.

## Roadmap

-   [ ] **AI LLM Integration**: Use LLMs to generate personalized career advice and specific upskilling resources.
-   [ ] **Brokerage Integration**: Connect to Plaid/Yodlee for real-time asset tracking.
-   [ ] **User Accounts**: Save and track multiple scenarios over time.
-   [ ] **Tax Optimization**: Detailed modeling of 401k vs. Roth vs. Brokerage drawdowns.

## Screenshots

![Planner Wizard](docs/images/planner_placeholder.png)
*The Planner Wizard collects your financial and skill data.*

![Dashboard Results](docs/images/dashboard_placeholder.png)
*The Dashboard visualizes your optimal retirement trajectories.*
