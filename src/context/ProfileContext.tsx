import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
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

const PROFILE_STORAGE_KEY = 'retireme_profile';
const RESULTS_STORAGE_KEY = 'retireme_results';

const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
        console.error(`Failed to load ${key} from localStorage:`, error);
        return defaultValue;
    }
};

const saveToStorage = <T,>(key: string, value: T): void => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Failed to save ${key} to localStorage:`, error);
    }
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
    const [profile, setProfile] = useState<UserProfile>(() =>
        loadFromStorage(PROFILE_STORAGE_KEY, defaultProfile)
    );
    const [results, setResults] = useState<RetirementPathsResponse | null>(() =>
        loadFromStorage(RESULTS_STORAGE_KEY, null)
    );

    useEffect(() => {
        saveToStorage(PROFILE_STORAGE_KEY, profile);
    }, [profile]);

    useEffect(() => {
        saveToStorage(RESULTS_STORAGE_KEY, results);
    }, [results]);

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
