'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  displayName: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  logout: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user in localStorage
    const savedUser = localStorage.getItem('gymtracker_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    // Simple validation
    if (!email || !password || !displayName) {
      throw new Error('All fields are required');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('gymtracker_users') || '[]');
    if (existingUsers.find((u: User) => u.email === email)) {
      throw new Error('User already exists');
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email,
      displayName,
    };

    // Save user
    existingUsers.push(newUser);
    localStorage.setItem('gymtracker_users', JSON.stringify(existingUsers));
    localStorage.setItem('gymtracker_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const signIn = async (email: string, password: string) => {
    // Simple validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Check if user exists
    const existingUsers = JSON.parse(localStorage.getItem('gymtracker_users') || '[]');
    const user = existingUsers.find((u: User) => u.email === email);
    
    if (!user) {
      throw new Error('User not found');
    }

    // For demo purposes, accept any password
    // In a real app, you'd verify the password hash
    localStorage.setItem('gymtracker_user', JSON.stringify(user));
    setUser(user);
  };

  const logout = async () => {
    localStorage.removeItem('gymtracker_user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
