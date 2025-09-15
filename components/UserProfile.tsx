'use client';

import { useState } from 'react';
import { User, LogOut, Settings, Mail, Calendar, Target, TrendingUp } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function UserProfile() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMemberSince = () => {
    if (user?.metadata?.creationTime) {
      const date = new Date(user.metadata.creationTime);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return 'Unknown';
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="card">
        <div className="text-center">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-10 w-10 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            {user?.displayName || 'User'}
          </h2>
          <p className="text-gray-600 mb-4">{user?.email}</p>
          <div className="flex items-center justify-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            Member since {getMemberSince()}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card text-center">
          <Target className="h-8 w-8 text-primary-600 mx-auto mb-2" />
          <div className="text-2xl font-bold">0</div>
          <div className="text-sm text-gray-600">Goals Set</div>
        </div>
        <div className="card text-center">
          <TrendingUp className="h-8 w-8 text-primary-600 mx-auto mb-2" />
          <div className="text-2xl font-bold">0</div>
          <div className="text-sm text-gray-600">Streak Days</div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <div className="font-medium">Email</div>
                <div className="text-sm text-gray-500">{user?.email}</div>
              </div>
            </div>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Change
            </button>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <Settings className="h-5 w-5 text-gray-400" />
              <div>
                <div className="font-medium">Notifications</div>
                <div className="text-sm text-gray-500">Manage your preferences</div>
              </div>
            </div>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Workout Preferences */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Workout Preferences</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Units
            </label>
            <select className="input-field">
              <option value="kg">Kilograms (kg)</option>
              <option value="lbs">Pounds (lbs)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rest Time (seconds)
            </label>
            <input
              type="number"
              defaultValue="60"
              className="input-field"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="card">
        <button
          onClick={handleLogout}
          disabled={loading}
          className="w-full btn-secondary flex items-center justify-center space-x-2 py-3 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          <span>{loading ? 'Signing Out...' : 'Sign Out'}</span>
        </button>
      </div>

      {/* App Info */}
      <div className="text-center text-sm text-gray-500">
        <p>GymTracker Pro v1.0</p>
        <p>Built with Next.js & Firebase</p>
      </div>
    </div>
  );
}
