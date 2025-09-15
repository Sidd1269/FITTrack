'use client';

import { useState } from 'react';
import { Plus, Trash2, Save, Clock, Dumbbell, Heart, Timer, Activity, Target, Zap } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  sets: Set[];
}

interface Set {
  id: string;
  reps: number;
  weight: number;
  restTime: number;
}

export default function WorkoutForm() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState('');
  const [workoutName, setWorkoutName] = useState('');
  const [workoutDate, setWorkoutDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedWorkoutType, setSelectedWorkoutType] = useState('push');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Workout type data with exercises
  const workoutTypes = {
    push: {
      name: 'Push Day',
      icon: Dumbbell,
      color: 'bg-blue-500',
      exercises: [
        'Bench Press', 'Incline Bench Press', 'Overhead Press', 'Dumbbell Press',
        'Push-ups', 'Dips', 'Tricep Dips', 'Tricep Extensions', 'Lateral Raises',
        'Front Raises', 'Chest Flyes', 'Pec Deck', 'Close Grip Bench Press'
      ]
    },
    pull: {
      name: 'Pull Day',
      icon: Target,
      color: 'bg-green-500',
      exercises: [
        'Pull-ups', 'Chin-ups', 'Lat Pulldowns', 'Barbell Rows', 'Dumbbell Rows',
        'Cable Rows', 'Face Pulls', 'Reverse Flyes', 'Bicep Curls', 'Hammer Curls',
        'Preacher Curls', 'Cable Curls', 'Deadlifts', 'Shrugs'
      ]
    },
    legs: {
      name: 'Leg Day',
      icon: Activity,
      color: 'bg-purple-500',
      exercises: [
        'Squats', 'Deadlifts', 'Lunges', 'Leg Press', 'Bulgarian Split Squats',
        'Romanian Deadlifts', 'Calf Raises', 'Leg Extensions', 'Leg Curls',
        'Hip Thrusts', 'Goblet Squats', 'Step-ups', 'Walking Lunges'
      ]
    },
    cardio: {
      name: 'Cardio',
      icon: Heart,
      color: 'bg-red-500',
      exercises: [
        'Running', 'Cycling', 'Rowing', 'Elliptical', 'Stair Climbing',
        'Jump Rope', 'Burpees', 'Mountain Climbers', 'High Knees',
        'Jumping Jacks', 'Swimming', 'Dancing', 'Boxing'
      ]
    },
    hiit: {
      name: 'HIIT',
      icon: Timer,
      color: 'bg-orange-500',
      exercises: [
        'Burpees', 'Mountain Climbers', 'Jump Squats', 'High Knees',
        'Jumping Jacks', 'Plank Jacks', 'Push-up Burpees', 'Sprint Intervals',
        'Battle Ropes', 'Kettlebell Swings', 'Box Jumps', 'Bear Crawls'
      ]
    },
    abs: {
      name: 'Abs & Core',
      icon: Target,
      color: 'bg-pink-500',
      exercises: [
        'Planks', 'Crunches', 'Sit-ups', 'Russian Twists', 'Mountain Climbers',
        'Bicycle Crunches', 'Leg Raises', 'Hanging Knee Raises', 'Dead Bug',
        'Bird Dog', 'Side Planks', 'Ab Wheel', 'Cable Crunches'
      ]
    }
  };

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

  const handleWorkoutTypeChange = (type: string) => {
    setSelectedWorkoutType(type);
    setWorkoutName(workoutTypes[type as keyof typeof workoutTypes].name);
    setShowSuggestions(true);
  };

  const addSuggestedExercise = (exerciseName: string) => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: exerciseName,
      sets: [{
        id: Date.now().toString(),
        reps: 10,
        weight: 0,
        restTime: 60
      }]
    };
    setExercises([...exercises, newExercise]);
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

  const saveWorkout = () => {
    if (workoutName.trim() && exercises.length > 0) {
      const workout = {
        id: Date.now().toString(),
        name: workoutName.trim(),
        date: workoutDate,
        exercises,
        totalSets: exercises.reduce((sum, ex) => sum + ex.sets.length, 0),
        totalVolume: exercises.reduce((sum, ex) => 
          sum + ex.sets.reduce((setSum, set) => setSum + (set.reps * set.weight), 0), 0
        )
      };
      
      // Save to localStorage for now (will be replaced with Firebase)
      const savedWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');
      savedWorkouts.push(workout);
      localStorage.setItem('workouts', JSON.stringify(savedWorkouts));
      
      // Reset form
      setExercises([]);
      setWorkoutName('');
      alert('Workout saved successfully!');
    } else {
      alert('Please add a workout name and at least one exercise');
    }
  };

  return (
    <div className="space-y-8">
      {/* Workout Header */}
      <div className="card floating-animation">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Dumbbell className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold gradient-text">Log Workout</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Track your fitness journey</p>
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
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
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
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

      {/* Workout Type Selection */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <Target className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-xl font-bold gradient-text">Choose Workout Type</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(workoutTypes).map(([key, workout]) => {
            const Icon = workout.icon;
            return (
              <button
                key={key}
                onClick={() => handleWorkoutTypeChange(key)}
                className={`workout-type-btn ${
                  selectedWorkoutType === key
                    ? 'workout-type-selected'
                    : 'workout-type-unselected'
                }`}
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className={`w-12 h-12 rounded-2xl ${workout.color} flex items-center justify-center shadow-lg transform transition-transform duration-300 ${
                    selectedWorkoutType === key ? 'scale-110' : 'scale-100'
                  }`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className={`text-sm font-semibold ${
                    selectedWorkoutType === key
                      ? 'text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>{workout.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Exercise Suggestions */}
      {showSuggestions && (
        <div className="card pulse-glow">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold gradient-text">
              Suggested Exercises for {workoutTypes[selectedWorkoutType as keyof typeof workoutTypes].name}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {workoutTypes[selectedWorkoutType as keyof typeof workoutTypes].exercises.map((exercise, index) => (
              <button
                key={index}
                onClick={() => addSuggestedExercise(exercise)}
                className="exercise-suggestion-btn"
              >
                {exercise}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add Exercise */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
            <Plus className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-xl font-bold gradient-text">Add Custom Exercise</h3>
        </div>
        <div className="flex space-x-3">
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
            className="btn-primary flex items-center space-x-2 px-6"
          >
            <Plus className="h-5 w-5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Exercises */}
      {exercises.map((exercise, exerciseIndex) => (
        <div key={exercise.id} className="card" style={{ animationDelay: `${exerciseIndex * 100}ms` }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Dumbbell className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold gradient-text">{exercise.name}</h3>
            </div>
            <button
              onClick={() => removeExercise(exercise.id)}
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300 ease-out"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          {/* Sets */}
          <div className="space-y-4">
            {exercise.sets.map((set, index) => (
              <div key={set.id} className="set-container">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg">
                  {index + 1}
                </div>
                <div className="flex-1 grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Reps</label>
                    <input
                      type="number"
                      value={set.reps}
                      onChange={(e) => updateSet(exercise.id, set.id, 'reps', parseInt(e.target.value) || 0)}
                      className="input-field text-sm"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Weight (kg)</label>
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
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Rest (sec)</label>
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
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300 ease-out"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => addSet(exercise.id)}
            className="w-full mt-6 btn-secondary flex items-center justify-center space-x-2 py-4"
          >
            <Plus className="h-5 w-5" />
            <span>Add Set</span>
          </button>
        </div>
      ))}

      {/* Save Button */}
      {exercises.length > 0 && (
        <div className="sticky bottom-20 z-10">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1 rounded-3xl shadow-2xl">
            <button
              onClick={saveWorkout}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-3xl flex items-center justify-center space-x-3 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-out"
            >
              <Save className="h-6 w-6" />
              <span>Save Workout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
