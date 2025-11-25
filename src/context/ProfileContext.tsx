import { createContext, useContext, useState, type ReactNode } from 'react';
import type { UserProfile, RetirementPathsResponse } from '../types/retirement';

interface ProfileContextType {
    profile: UserProfile;
    updateProfile: (updates: Partial<UserProfile>) => void;
    results: RetirementPathsResponse | null;
    setResults: (results: RetirementPathsResponse | null) => void;
    resetProfile: () => void;
}

const defaultProfile: UserProfile = {
    currentAge: 30,
    targetRetirementAge: null,
    country: 'USA',
    costOfLiving: 'Medium',
    annualIncome: 75000,
    investableAssets: 25000,
    monthlySavings: 1000,
    riskProfile: 'Balanced',
    skills: [],
    workInterests: '',
    preferredLocations: [],
    lifestyleIntensity: 50,
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
    const [profile, setProfile] = useState<UserProfile>(defaultProfile);
    const [results, setResults] = useState<RetirementPathsResponse | null>(null);

    const updateProfile = (updates: Partial<UserProfile>) => {
        setProfile(prev => ({ ...prev, ...updates }));
    };

    const resetProfile = () => {
        setProfile(defaultProfile);
        setResults(null);
    };

    return (
        <ProfileContext.Provider value={{ profile, updateProfile, results, setResults, resetProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};
