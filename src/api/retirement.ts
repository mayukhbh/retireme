import type { RetirementPathsResponse, UserProfile } from '../types/retirement';

const API_URL = 'http://localhost:8000/api/retirement';

export const generateRetirementPaths = async (profile: UserProfile): Promise<RetirementPathsResponse> => {
    try {
        const response = await fetch(`${API_URL}/paths`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profile),
        });

        if (!response.ok) {
            throw new Error(`API call failed: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to fetch retirement paths:", error);
        throw error;
    }
};
