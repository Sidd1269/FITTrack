'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Dumbbell, Trash2, Eye } from 'lucide-react';

interface WorkoutData {
  id: string;
  name: string;
  date: string;
  exercises: Array<{
    id: string;
    name: string;
    sets: Array<{
      id: string;
      reps: number;
      weight: number;
      restTime: number;
    }>;
  }>;
  totalSets: number;
  totalVolume: number;
}

export default function RecentWorkouts() {
  const [workouts, setWorkouts] = useState<WorkoutData[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutData | null>(null);

  useEffect(() => {
    const savedWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');
    // Sort by date, most recent first
    const sortedWorkouts = savedWorkouts.sort((a: WorkoutData, b: WorkoutData) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setWorkouts(sortedWorkouts);
  }, []);

  const deleteWorkout = (workoutId: string) => {
    if (confirm('Are you sure you want to delete this workout?')) {
      const updatedWorkouts = workouts.filter(workout => workout.id !== workoutId);
      setWorkouts(updatedWorkouts);
      localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
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

  const getWorkoutDuration = (workout: WorkoutData) => {
    // Estimate duration based on sets and rest time
    const totalRestTime = workout.exercises.reduce((sum, exercise) => 
      sum + exercise.sets.reduce((setSum, set) => setSum + set.restTime, 0), 0
    );
    const estimatedMinutes = Math.round((totalRestTime + workout.totalSets * 2) / 60);
    return `${estimatedMinutes} min`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <h2 className="text-xl font-bold mb-2">Workout History</h2>
        <p className="text-gray-600">Track your progress and review past workouts</p>
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
                  <h3 className="text-lg font-semibold mb-1">{workout.name}</h3>
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
                    onClick={() => deleteWorkout(workout.id)}
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
