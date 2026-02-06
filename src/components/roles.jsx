import { base44 } from '@/api/base44Client';

export const getUserRole = async (email) => {
    if (!email) return null;
    try {
        const profiles = await base44.entities.UserProfile.list();
        return profiles.find(p => p.email === email) || { role: 'Fan', email }; 
    } catch (e) {
        console.error(e);
        return { role: 'Fan', email };
    }
};

export const hasPermission = (userRole, requiredRole) => {
    const levels = {
        'Fan': 1,
        'Player': 2,
        'Coach': 3,
        'LeagueAdmin': 4,
        'OrganizationAdmin': 5
    };
    return (levels[userRole] || 0) >= (levels[requiredRole] || 99);
};