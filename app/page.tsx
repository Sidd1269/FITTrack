'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, BarChart3, User, Settings, Dumbbell, Clock, Flame, LogOut, ChevronDown, Sun, Moon } from 'lucide-react';
import WorkoutForm from '@/components/WorkoutForm';
import ProgressDashboard from '@/components/ProgressDashboard';
import RecentWorkouts from '@/components/RecentWorkouts';
import FirebaseAuthForm from '@/components/FirebaseAuthForm';
import { useAuth } from '@/lib/firebaseAuth';
import { useTheme } from '@/lib/themeContext';

export default function Home() {
  const [activeTab, setActiveTab] = useState('track');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debug user data
  useEffect(() => {
    if (user) {
      console.log('User data:', {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid
      });
    }
  }, [user]);

  const tabs = [
    { id: 'track', label: 'Track', icon: Plus },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'track':
        return <WorkoutForm />;
      case 'progress':
        return <ProgressDashboard />;
      case 'history':
        return <RecentWorkouts />;
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Profile Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={user?.displayName || ''}
                    placeholder="Enter your name"
                    className="input-field"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    placeholder="Enter your email"
                    className="input-field"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Default Units
                  </label>
                  <select className="input-field">
                    <option value="kg">Kilograms (kg)</option>
                    <option value="lbs">Pounds (lbs)</option>
                  </select>
                </div>
                <button
                  onClick={logout}
                  className="w-full btn-secondary flex items-center justify-center space-x-2 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <WorkoutForm />;
    }
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth form if not authenticated
  if (!user) {
    return <FirebaseAuthForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-white p-6 sticky top-0 z-10 border-b border-white/20 dark:border-gray-700/50 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Dumbbell className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">FitTrack</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Your fitness companion</p>
            </div>
          </div>
          
          {/* Theme Toggle & User Profile */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-3 rounded-2xl bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-600/80 transition-all duration-300 ease-out shadow-lg hover:shadow-xl transform hover:scale-110"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-indigo-600" />}
            </button>
            
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 p-3 rounded-2xl bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-600/80 transition-all duration-300 ease-out shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Hi, {user?.displayName?.split(' ')[0] || 'User'}!</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Welcome back</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg">
                  {user?.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-2xl object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-sm ${user?.photoURL ? 'hidden' : ''}`}>
                    {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-3 w-64 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 py-4 z-50">
                  <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{user?.displayName || 'User'}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setShowProfileMenu(false);
                      }}
                      className="w-full px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-200 ease-out flex items-center space-x-3"
                    >
                      <User className="h-5 w-5" />
                      <span>Profile Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full px-6 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-all duration-200 ease-out flex items-center space-x-3"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-t border-white/20 dark:border-gray-700/50 px-4 py-2 shadow-2xl">
        <div className="flex justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`nav-item ${
                  activeTab === tab.id
                    ? 'nav-item-active'
                    : 'nav-item-inactive'
                }`}
              >
                <div className={`p-2 rounded-xl transition-all duration-300 ease-out ${
                  activeTab === tab.id
                    ? 'bg-blue-500/20 shadow-lg'
                    : 'hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                }`}>
                  <Icon className={`h-5 w-5 mb-1 ${
                    activeTab === tab.id
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`} />
                </div>
                <span className={`text-xs font-semibold ${
                  activeTab === tab.id
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
