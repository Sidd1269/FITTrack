'use client';

import { useState } from 'react';
import { Plus, Trash2, Save, Clock, Cloud, Wifi, WifiOff } from 'lucide-react';
import { WorkoutService, Exercise, Set } from '@/lib/workoutService';

export default function FirebaseWorkoutForm() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState('');
  const [workoutName, setWorkoutName] = useState('');
  const [workoutDate, setWorkoutDate] = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // Monitor online status
  useState(() => {
    if (typeof window !== 'undefined') {
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  });

  const addExercise = () => {
    if (currentExercise.trim()) {
      const newExercise: Exercise = {
        id: Date.now().toString(),
        name: currentExercise.trim(),
        sets: [{
          id: Date.now().toString(),
          reps: 10,
          weight: 0,
          restTime: 60
        }]
      };
      setExercises([...exercises, newExercise]);
      setCurrentExercise('');
    }
  };

  const addSet = (exerciseId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      const lastSet = exercise.sets[exercise.sets.length - 1];
      const newSet: Set = {
        id: Date.now().toString(),
        reps: lastSet.reps,
        weight: lastSet.weight,
        restTime: lastSet.restTime
      };
      
      setExercises(exercises.map(ex => 
        ex.id === exerciseId 
          ? { ...ex, sets: [...ex.sets, newSet] }
          : ex
      ));
    }
  };

  const removeSet = (exerciseId: string, setId: string) => {
    setExercises(exercises.map(ex => 
      ex.id === exerciseId 
        ? { ...ex, sets: ex.sets.filter(set => set.id !== setId) }
        : ex
    ));
  };

  const removeExercise = (exerciseId: string) => {
    setExercises(exercises.filter(ex => ex.id !== exerciseId));
  };

  const updateSet = (exerciseId: string, setId: string, field: keyof Set, value: number) => {
    setExercises(exercises.map(ex => 
      ex.id === exerciseId 
        ? { 
            ...ex, 
            sets: ex.sets.map(set => 
              set.id === setId ? { ...set, [field]: value } : set
            )
          }
        : ex
    ));
  };

  const saveWorkout = async () => {
    if (workoutName.trim() && exercises.length > 0) {
      setSaving(true);
      
      const workoutData = {
        name: workoutName.trim(),
        date: workoutDate,
        exercises,
        totalSets: exercises.reduce((sum, ex) => sum + ex.sets.length, 0),
        totalVolume: exercises.reduce((sum, ex) => 
          sum + ex.sets.reduce((setSum, set) => setSum + (set.reps * set.weight), 0), 0
        )
      };

      try {
        if (isOnline) {
          // Save to Firebase
          await WorkoutService.saveWorkout(workoutData);
          alert('Workout saved to cloud successfully! 🚀');
        } else {
          // Save to localStorage as fallback
          const savedWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');
          savedWorkouts.push({ ...workoutData, id: Date.now().toString(), synced: false });
          localStorage.setItem('workouts', JSON.stringify(savedWorkouts));
          alert('Workout saved locally (will sync when online)! 📱');
        }
        
        // Reset form
        setExercises([]);
        setWorkoutName('');
      } catch (error) {
        console.error('Error saving workout:', error);
        // Fallback to localStorage
        const savedWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');
        savedWorkouts.push({ ...workoutData, id: Date.now().toString(), synced: false });
        localStorage.setItem('workouts', JSON.stringify(savedWorkouts));
        alert('Saved locally due to connection issue. Will sync later! 📱');
      } finally {
        setSaving(false);
      }
    } else {
      alert('Please add a workout name and at least one exercise');
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold">Log Workout</h2>
            {isOnline ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-500" />
            )}
          </div>
          <div className="text-sm text-gray-600">
            {isOnline ? 'Cloud sync enabled' : 'Offline mode'}
          </div>
        </div>
      </div>

      {/* Workout Header */}
      <div className="card">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Workout Name
            </label>
            <input
              type="text"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="e.g., Push Day, Leg Day"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={workoutDate}
              onChange={(e) => setWorkoutDate(e.target.value)}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Add Exercise */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-3">Add Exercise</h3>
        <div className="flex space-x-2">
          <input
            type="text"
            value={currentExercise}
            onChange={(e) => setCurrentExercise(e.target.value)}
            placeholder="Exercise name"
            className="input-field flex-1"
            onKeyPress={(e) => e.key === 'Enter' && addExercise()}
          />
          <button
            onClick={addExercise}
            className="btn-primary flex items-center space-x-1"
          >
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Exercises */}
      {exercises.map((exercise) => (
        <div key={exercise.id} className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{exercise.name}</h3>
            <button
              onClick={() => removeExercise(exercise.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          {/* Sets */}
          <div className="space-y-3">
            {exercise.sets.map((set, index) => (
              <div key={set.id} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600 w-8">
                  {index + 1}
                </span>
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Reps</label>
                    <input
                      type="number"
                      value={set.reps}
                      onChange={(e) => updateSet(exercise.id, set.id, 'reps', parseInt(e.target.value) || 0)}
                      className="input-field text-sm"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      value={set.weight}
                      onChange={(e) => updateSet(exercise.id, set.id, 'weight', parseFloat(e.target.value) || 0)}
                      className="input-field text-sm"
                      min="0"
                      step="0.5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Rest (sec)</label>
                    <input
                      type="number"
                      value={set.restTime}
                      onChange={(e) => updateSet(exercise.id, set.id, 'restTime', parseInt(e.target.value) || 0)}
                      className="input-field text-sm"
                      min="0"
                    />
                  </div>
                </div>
                {exercise.sets.length > 1 && (
                  <button
                    onClick={() => removeSet(exercise.id, set.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => addSet(exercise.id)}
            className="w-full mt-3 btn-secondary flex items-center justify-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Set</span>
          </button>
        </div>
      ))}

      {/* Save Button */}
      {exercises.length > 0 && (
        <div className="sticky bottom-20">
          <button
            onClick={saveWorkout}
            disabled={saving}
            className="w-full btn-primary flex items-center justify-center space-x-2 py-4 text-lg font-semibold disabled:opacity-50"
          >
            {saving ? (
              <>
                <Clock className="h-5 w-5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                {isOnline ? <Cloud className="h-5 w-5" /> : <Save className="h-5 w-5" />}
                <span>{isOnline ? 'Save to Cloud' : 'Save Locally'}</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
