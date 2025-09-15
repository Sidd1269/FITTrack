'use client';

import { useState } from 'react';
import { Plus, BarChart3, User, Settings, Dumbbell, Clock, Flame } from 'lucide-react';
import WorkoutForm from '@/components/WorkoutForm';
import ProgressDashboard from '@/components/ProgressDashboard';
import RecentWorkouts from '@/components/RecentWorkouts';

export default function Home() {
  const [activeTab, setActiveTab] = useState('track');

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
              <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
              <p className="text-gray-600 mb-4">Authentication will be added soon!</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default Units
                  </label>
                  <select className="input-field">
                    <option value="kg">Kilograms (kg)</option>
                    <option value="lbs">Pounds (lbs)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <WorkoutForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-primary-600 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Dumbbell className="h-6 w-6" />
            <h1 className="text-xl font-bold">GymTracker Pro</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Flame className="h-5 w-5" />
            <span className="text-sm">1,250 cal</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
