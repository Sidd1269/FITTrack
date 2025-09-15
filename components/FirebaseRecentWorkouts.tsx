'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Dumbbell, Trash2, Eye, Cloud, WifiOff } from 'lucide-react';
import { WorkoutService, Workout } from '@/lib/workoutService';

export default function FirebaseRecentWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to load from Firebase first
      const firebaseWorkouts = await WorkoutService.getWorkouts();
      setWorkouts(firebaseWorkouts);
    } catch (error) {
      console.error('Error loading from Firebase:', error);
      // Fallback to localStorage
      const localWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');
      setWorkouts(localWorkouts);
      setError('Using local data - will sync when online');
    } finally {
      setLoading(false);
    }
  };

  const deleteWorkout = async (workoutId: string) => {
    if (confirm('Are you sure you want to delete this workout?')) {
      try {
        // Try to delete from Firebase first
        await WorkoutService.deleteWorkout(workoutId);
        
        // Update local state
        const updatedWorkouts = workouts.filter(workout => workout.id !== workoutId);
        setWorkouts(updatedWorkouts);
      } catch (error) {
        console.error('Error deleting from Firebase:', error);
        // Fallback to localStorage
        const savedWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');
        const updatedWorkouts = savedWorkouts.filter((workout: any) => workout.id !== workoutId);
        localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
        setWorkouts(updatedWorkouts);
        alert('Deleted locally - will sync when online');
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getWorkoutDuration = (workout: Workout) => {
    // Estimate duration based on sets and rest time
    const totalRestTime = workout.exercises.reduce((sum, exercise) => 
      sum + exercise.sets.reduce((setSum, set) => setSum + set.restTime, 0), 0
    );
    const estimatedMinutes = Math.round((totalRestTime + workout.totalSets * 2) / 60);
    return `${estimatedMinutes} min`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-2">Workout History</h2>
          <p className="text-gray-600">Loading your workouts...</p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-3"></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">Workout History</h2>
            <p className="text-gray-600">Track your progress and review past workouts</p>
          </div>
          <button
            onClick={loadWorkouts}
            className="btn-secondary text-sm"
          >
            Refresh
          </button>
        </div>
        {error && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <WifiOff className="h-4 w-4 text-yellow-600" />
              <span className="text-yellow-800 text-sm">{error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Workouts List */}
      {workouts.length === 0 ? (
        <div className="card text-center py-12">
          <Dumbbell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No workouts yet</h3>
          <p className="text-gray-500">Start logging your workouts to see them here!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {workouts.map((workout) => (
            <div key={workout.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold">{workout.name}</h3>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(workout.date)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{getWorkoutDuration(workout)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedWorkout(workout)}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteWorkout(workout.id!)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-primary-600">{workout.exercises.length}</div>
                  <div className="text-xs text-gray-600">Exercises</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-primary-600">{workout.totalSets}</div>
                  <div className="text-xs text-gray-600">Sets</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-primary-600">{workout.totalVolume}</div>
                  <div className="text-xs text-gray-600">Volume (kg)</div>
                </div>
              </div>

              {/* Exercise Preview */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Exercises:</span>{' '}
                  {workout.exercises.map(ex => ex.name).join(', ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Workout Detail Modal */}
      {selectedWorkout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{selectedWorkout.name}</h3>
                <button
                  onClick={() => setSelectedWorkout(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  <strong>Date:</strong> {formatDate(selectedWorkout.date)}
                </div>

                {selectedWorkout.exercises.map((exercise) => (
                  <div key={exercise.id} className="border border-gray-200 rounded-lg p-3">
                    <h4 className="font-semibold mb-2">{exercise.name}</h4>
                    <div className="space-y-2">
                      {exercise.sets.map((set, index) => (
                        <div key={set.id} className="flex justify-between text-sm bg-gray-50 px-2 py-1 rounded">
                          <span>Set {index + 1}</span>
                          <span>{set.reps} reps × {set.weight}kg</span>
                          <span>{set.restTime}s rest</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 text-center">
                  <div>
                    <div className="text-lg font-bold text-primary-600">{selectedWorkout.exercises.length}</div>
                    <div className="text-xs text-gray-600">Exercises</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-primary-600">{selectedWorkout.totalSets}</div>
                    <div className="text-xs text-gray-600">Sets</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-primary-600">{selectedWorkout.totalVolume}</div>
                    <div className="text-xs text-gray-600">Volume (kg)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
