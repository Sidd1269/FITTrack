'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Target, Zap } from 'lucide-react';
import { Line, Bar, Chart } from 'react-chartjs-2';
// import AISuggestions from './AISuggestions';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

interface WorkoutData {
  id: string;
  name: string;
  date: string;
  exercises: any[];
  totalSets: number;
  totalVolume: number;
}

export default function ProgressDashboard() {
  const [workouts, setWorkouts] = useState<WorkoutData[]>([]);
  const [timeRange, setTimeRange] = useState('7');

  useEffect(() => {
    const savedWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');
    setWorkouts(savedWorkouts);
  }, []);

  const filteredWorkouts = workouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    const daysDiff = Math.floor((Date.now() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff <= parseInt(timeRange);
  });

  const totalWorkouts = filteredWorkouts.length;
  const totalVolume = filteredWorkouts.reduce((sum, workout) => sum + workout.totalVolume, 0);
  const totalSets = filteredWorkouts.reduce((sum, workout) => sum + workout.totalSets, 0);
  const avgVolumePerWorkout = totalWorkouts > 0 ? Math.round(totalVolume / totalWorkouts) : 0;

  // Create exercise categories for stacked area chart - matching workout types from WorkoutForm
  const exerciseCategories = {
    'Upper Body': [
      // Push Day exercises
      'bench press', 'incline bench press', 'overhead press', 'dumbbell press', 'push-ups', 'dips', 
      'tricep dips', 'tricep extensions', 'lateral raises', 'front raises', 'chest flyes', 'pec deck', 
      'close grip bench press',
      // Pull Day exercises  
      'pull-ups', 'chin-ups', 'lat pulldowns', 'barbell rows', 'dumbbell rows', 'cable rows', 
      'face pulls', 'reverse flyes', 'bicep curls', 'hammer curls', 'preacher curls', 'cable curls', 
      'shrugs'
    ],
    'Lower Body': [
      'squats', 'deadlifts', 'lunges', 'leg press', 'bulgarian split squats', 'romanian deadlifts', 
      'calf raises', 'leg extensions', 'leg curls', 'hip thrusts', 'goblet squats', 'step-ups', 
      'walking lunges'
    ],
    'Core': [
      // Abs & Core exercises
      'planks', 'crunches', 'sit-ups', 'russian twists', 'mountain climbers', 'bicycle crunches', 
      'leg raises', 'hanging knee raises', 'dead bug', 'bird dog', 'side planks', 'ab wheel', 
      'cable crunches'
    ],
    'Other': [
      // Cardio exercises
      'running', 'cycling', 'rowing', 'elliptical', 'stair climbing', 'jump rope', 'swimming', 
      'dancing', 'boxing',
      // HIIT exercises
      'burpees', 'jump squats', 'high knees', 'jumping jacks', 'plank jacks', 'push-up burpees', 
      'sprint intervals', 'battle ropes', 'kettlebell swings', 'box jumps', 'bear crawls'
    ]
  };

  const getExerciseCategory = (exerciseName: string) => {
    const name = exerciseName.toLowerCase();
    for (const [category, exercises] of Object.entries(exerciseCategories)) {
      if (exercises.some(ex => name.includes(ex))) {
        return category;
      }
    }
    return 'Other';
  };

  // Calculate volume by category for each workout
  const categoryData = {
    'Upper Body': [] as number[],
    'Lower Body': [] as number[],
    'Core': [] as number[],
    'Other': [] as number[]
  };

  // Calculate sets by category for each workout
  const categorySetsData = {
    'Upper Body': [] as number[],
    'Lower Body': [] as number[],
    'Core': [] as number[],
    'Other': [] as number[]
  };

  filteredWorkouts.forEach(workout => {
    const categoryVolumes = { 'Upper Body': 0, 'Lower Body': 0, 'Core': 0, 'Other': 0 };
    const categorySets = { 'Upper Body': 0, 'Lower Body': 0, 'Core': 0, 'Other': 0 };
    
    workout.exercises.forEach(exercise => {
      const category = getExerciseCategory(exercise.name);
      const exerciseVolume = exercise.sets.reduce((sum: number, set: any) => sum + (set.reps * set.weight), 0);
      const exerciseSets = exercise.sets.length;
      
      categoryVolumes[category as keyof typeof categoryVolumes] += exerciseVolume;
      categorySets[category as keyof typeof categorySets] += exerciseSets;
    });

    Object.keys(categoryData).forEach(category => {
      categoryData[category as keyof typeof categoryData].push(categoryVolumes[category as keyof typeof categoryVolumes]);
      categorySetsData[category as keyof typeof categorySetsData].push(categorySets[category as keyof typeof categorySets]);
    });
  });

  const chartData = {
    labels: filteredWorkouts.map(workout => 
      new Date(workout.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: 'Upper Body (Push + Pull)',
        data: categoryData['Upper Body'],
        backgroundColor: 'rgba(59, 130, 246, 0.8)', // Blue for Upper Body
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 0,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Lower Body (Legs)',
        data: categoryData['Lower Body'],
        backgroundColor: 'rgba(168, 85, 247, 0.8)', // Purple for Legs
        borderColor: 'rgb(168, 85, 247)',
        borderWidth: 0,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Core (Abs)',
        data: categoryData['Core'],
        backgroundColor: 'rgba(236, 72, 153, 0.8)', // Pink for Core
        borderColor: 'rgb(236, 72, 153)',
        borderWidth: 0,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Other (Cardio + HIIT)',
        data: categoryData['Other'],
        backgroundColor: 'rgba(239, 68, 68, 0.8)', // Red for Cardio/HIIT
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 0,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const setsChartData = {
    labels: filteredWorkouts.map(workout => 
      new Date(workout.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: 'Upper Body (Push + Pull)',
        data: categorySetsData['Upper Body'],
        backgroundColor: 'rgba(59, 130, 246, 0.8)', // Blue for Upper Body
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 0,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Lower Body (Legs)',
        data: categorySetsData['Lower Body'],
        backgroundColor: 'rgba(168, 85, 247, 0.8)', // Purple for Legs
        borderColor: 'rgb(168, 85, 247)',
        borderWidth: 0,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Core (Abs)',
        data: categorySetsData['Core'],
        backgroundColor: 'rgba(236, 72, 153, 0.8)', // Pink for Core
        borderColor: 'rgb(236, 72, 153)',
        borderWidth: 0,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Other (Cardio + HIIT)',
        data: categorySetsData['Other'],
        backgroundColor: 'rgba(239, 68, 68, 0.8)', // Red for Cardio/HIIT
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 0,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value}kg`;
          }
        }
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
    },
  };

  const exerciseData = filteredWorkouts.reduce((acc, workout) => {
    workout.exercises.forEach(exercise => {
      if (!acc[exercise.name]) {
        acc[exercise.name] = 0;
      }
      acc[exercise.name] += exercise.sets.reduce((sum: number, set: any) => 
        sum + (set.reps * set.weight), 0
      );
    });
    return acc;
  }, {} as Record<string, number>);

  const topExercises = Object.entries(exerciseData)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const exerciseChartData = {
    labels: topExercises.map(([name]) => name.length > 15 ? name.substring(0, 15) + '...' : name),
    datasets: [
      {
        label: 'Volume (kg)',
        data: topExercises.map(([, volume]) => volume),
        backgroundColor: [
          'rgba(14, 165, 233, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
      },
    ],
  };

  const getSuggestions = () => {
    if (totalWorkouts < 2) return ['Keep logging workouts to see personalized suggestions!'];
    
    const suggestions = [];
    
    if (totalWorkouts < 3) {
      suggestions.push('Try to maintain consistency - aim for at least 3 workouts per week');
    }
    
    if (avgVolumePerWorkout < 1000) {
      suggestions.push('Consider increasing your training volume gradually');
    }
    
    if (totalSets < 20) {
      suggestions.push('Add more sets to your workouts for better muscle development');
    }
    
    return suggestions.length > 0 ? suggestions : ['Great job! Keep up the consistent training!'];
  };

  return (
    <div className="space-y-8">
      {/* Time Range Selector */}
      <div className="card floating-animation">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold gradient-text">Progress Dashboard</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Track your fitness journey</p>
            </div>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input-field w-auto"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-6">
        <div className="card text-center hover:scale-105 transition-all duration-300 ease-out">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <div className="text-3xl font-bold gradient-text mb-2">{totalWorkouts}</div>
          <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">Workouts</div>
        </div>
        <div className="card text-center hover:scale-105 transition-all duration-300 ease-out">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <div className="text-3xl font-bold gradient-text mb-2">{totalVolume.toLocaleString()}</div>
          <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total Volume (kg)</div>
        </div>
        <div className="card text-center hover:scale-105 transition-all duration-300 ease-out">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Target className="h-8 w-8 text-white" />
          </div>
          <div className="text-3xl font-bold gradient-text mb-2">{totalSets}</div>
          <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total Sets</div>
        </div>
        <div className="card text-center hover:scale-105 transition-all duration-300 ease-out">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <div className="text-3xl font-bold gradient-text mb-2">{avgVolumePerWorkout}</div>
          <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">Avg Volume</div>
        </div>
      </div>

      {/* Volume Chart */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold gradient-text">Training Volume by Category</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upper Body (Push + Pull) • Lower Body (Legs) • Core (Abs) • Other (Cardio + HIIT)
            </p>
          </div>
        </div>
        {filteredWorkouts.length > 0 ? (
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-4">
            <Chart type="line" data={chartData} options={chartOptions} />
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-lg font-semibold mb-2">No Data Available</p>
            <p className="text-sm">No workout data available for the selected time range</p>
          </div>
        )}
      </div>

      {/* Sets Chart */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <Target className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold gradient-text">Sets by Category</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upper Body (Push + Pull) • Lower Body (Legs) • Core (Abs) • Other (Cardio + HIIT)
            </p>
          </div>
        </div>
        {filteredWorkouts.length > 0 ? (
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-4">
            <Chart type="line" data={setsChartData} options={chartOptions} />
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-lg font-semibold mb-2">No Data Available</p>
            <p className="text-sm">No workout data available for the selected time range</p>
          </div>
        )}
      </div>

      {/* Top Exercises */}
      {topExercises.length > 0 && (
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold gradient-text">Top Exercises by Volume</h3>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-4">
            <Bar data={exerciseChartData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* AI Suggestions - Temporarily disabled */}
      {/* <AISuggestions workouts={filteredWorkouts} /> */}
      
      {/* Basic Suggestions */}
      <div className="card pulse-glow">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-xl font-bold gradient-text">💡 Smart Suggestions</h3>
        </div>
        <div className="space-y-4">
          {getSuggestions().map((suggestion, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-white/50 dark:bg-gray-700/50 rounded-2xl hover:bg-white/70 dark:hover:bg-gray-600/50 transition-all duration-300 ease-out">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-white font-bold text-sm">{index + 1}</span>
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed">{suggestion}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
