import { User } from '../types';

const API_BASE = "http://127.0.0.1:8000";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


const saveUserToStore = (user: User) => {
  const storedUsersStr = localStorage.getItem('medassist_users');
  let storedUsers: User[] = storedUsersStr ? JSON.parse(storedUsersStr) : [];

  storedUsers = storedUsers.filter(u => u.id !== user.id);
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



export const signup = async (
  name: string,
  email: string,
  password: string
): Promise<User> => {

  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: name,
      password: password
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Signup failed");
  }

  const user: User = {
    id: name,
    name,
    email,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    role: "patient"
  };

  saveUserToStore(user);

  return user;
};



export const login = async (
  username: string,
  password: string
): Promise<User> => {

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Invalid credentials");
  }

  const data = await res.json();

  const user: User = {
    id: String(data.user.id),
    name: data.user.username,
    email: data.user.username,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.username}`,
    role: "patient"
  };

  // SAVE SESSION (THIS WAS THE MISSING PART)
  localStorage.setItem("aura_session", JSON.stringify(user));

  // SAVE TOKEN
  localStorage.setItem("medassist_token", data.access_token);

  // SAVE USER LIST
  saveUserToStore(user);

  return user;
};


export const googleLogin = async (googleUser: {
  email: string;
  name: string;
  picture?: string;
}): Promise<User> => {

  try {

    const res = await fetch(`${API_BASE}/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: googleUser.email
      })
    });

    if (!res.ok) {
      throw new Error("Google login failed");
    }

  } catch (err) {
    console.error("Google login error:", err);
  }

  const user: User = {
    id: `google_${googleUser.email}`,
    name: googleUser.name,
    email: googleUser.email,
    avatar:
      googleUser.picture ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${googleUser.name}`,
    role: "patient",
    oauth: true
  };

  saveUserToStore(user);

  return user;
};



export const logout = async () => {
  await delay(200);

  localStorage.removeItem('aura_session');
  localStorage.removeItem('medassist_token');
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
