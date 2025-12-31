import { User } from '../types';

// PURE FRONTEND MOCK SERVICE
// This removes all dependencies on a Python/Node backend.

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to manage multi-user storage
const saveUserToStore = (user: User) => {
  const storedUsersStr = localStorage.getItem('medassist_users');
  let storedUsers: User[] = storedUsersStr ? JSON.parse(storedUsersStr) : [];
  
  // Remove existing entry for this ID if it exists (to update it)
  storedUsers = storedUsers.filter(u => u.id !== user.id);
  // Add to top
  storedUsers.unshift(user);
  
  localStorage.setItem('medassist_users', JSON.stringify(storedUsers));
  localStorage.setItem('aura_session', JSON.stringify(user));
};

export const getStoredUsers = (): User[] => {
  const storedUsersStr = localStorage.getItem('medassist_users');
  return storedUsersStr ? JSON.parse(storedUsersStr) : [];
};

export const switchUser = async (userId: string): Promise<User | null> => {
  await delay(400);
  const users = getStoredUsers();
  const targetUser = users.find(u => u.id === userId);
  
  if (targetUser) {
    localStorage.setItem('aura_session', JSON.stringify(targetUser));
    return targetUser;
  }
  return null;
};

export const signup = async (name: string, email: string, password: string): Promise<User> => {
  await delay(800);
  const newUser: User = {
    id: `user_${Math.random().toString(36).substring(2, 9)}`,
    name: name,
    email: email,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    role: 'patient' // Default role
  };
  saveUserToStore(newUser);
  return newUser;
};

export const login = async (email: string, password: string): Promise<User> => {
  await delay(800);

  // Hardcoded demo credentials for convenience
  if (email.toLowerCase().includes('madhu') || password === 'CR') {
     const user: User = {
        id: 'user_madhu_vip',
        name: 'Dr. Madhu',
        email: 'madhu@medassist.ai',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Madhu`,
        role: 'doctor'
     };
     saveUserToStore(user);
     return user;
  }

  // Generic login handler for any other user
  const nameParts = email.split('@')[0];
  const formattedName = nameParts.charAt(0).toUpperCase() + nameParts.slice(1);
  const user: User = {
    id: 'user_demo_' + Math.floor(Math.random() * 1000),
    name: formattedName,
    email: email,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formattedName}`,
    role: 'patient'
  };
  saveUserToStore(user);
  return user;
};

export const logout = async () => {
  await delay(200);
  localStorage.removeItem('aura_session');
};

export const getSession = (): User | null => {
  const session = localStorage.getItem('aura_session');
  return session ? JSON.parse(session) : null;
};

export const fetchHealthStats = async (userId: string) => {
  await delay(600);
  return {
    wellnessScore: 94,
    vitals: {
      heartRate: 72,
      bloodPressure: '118/75',
      oxygen: 99,
      sleep: '7h 45m',
      weight: '68 kg',
      hydration: 'Optimal'
    },
    activity: {
      steps: 8432,
      calories: 1450,
      stepGoal: 10000
    },
    appointments: 0,
    medicationsPending: 0
  };
};