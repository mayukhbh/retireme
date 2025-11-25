export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type SkillCategory = 'Tech' | 'Management' | 'Creative' | 'Manual' | 'Other';

export interface Skill {
    id: string;
    name: string;
    level: SkillLevel;
    category: SkillCategory;
}

export type RiskProfile = 'Conservative' | 'Balanced' | 'Aggressive';
export type CostOfLiving = 'Low' | 'Medium' | 'High';

export interface UserProfile {
    // Personal & Financial
    currentAge: number;
    targetRetirementAge: number | null; // null means "as early as possible"
    country: string;
    costOfLiving: CostOfLiving;
    annualIncome: number;
    investableAssets: number;
    monthlySavings: number;
    riskProfile: RiskProfile;

    // Skills & Work
    skills: Skill[];
    workInterests: string;

    // Lifestyle
    preferredLocations: string[]; // comma separated strings for now
    lifestyleIntensity: number; // 0 (Frugal) to 100 (Luxe)
}

export interface RetirementScenario {
    id: string;
    label: string;
    description: string;
    targetRetirementAge: number;
    targetYear: number;
    requiredMonthlySavings: number;
    probabilityScore: number; // 0-100
    keyActions: string[];
    timeline: {
        period: string;
        actions: string[];
    }[];
}

export interface RetirementPathsResponse {
    summary: {
        earliestRetirementAge: number;
        earliestRetirementYear: number;
        headline: string;
        caveats: string[];
    };
    scenarios: RetirementScenario[];
}
