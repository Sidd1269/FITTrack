import OpenAI from 'openai';

// Initialize OpenAI with proper configuration
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Required for client-side usage
});

export interface WorkoutAnalysis {
  suggestions: string[];
  strengths: string[];
  areasForImprovement: string[];
  weeklyRecommendation: string;
  motivation: string;
}

export class AIService {
  static async analyzeWorkoutData(workouts: any[], userGoals?: string): Promise<WorkoutAnalysis> {
    try {
      // Prepare workout data for analysis
      const workoutSummary = this.prepareWorkoutSummary(workouts);
      
      const prompt = this.createAnalysisPrompt(workoutSummary, userGoals);
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a professional fitness trainer and nutritionist with 10+ years of experience. Provide helpful, actionable advice for gym enthusiasts. Keep responses concise, motivating, and scientifically sound."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      return this.parseAIResponse(response);
    } catch (error) {
      console.error('Error analyzing workout data:', error);
      return this.getFallbackAnalysis();
    }
  }

  static async generateWorkoutPlan(userLevel: string, goals: string[], availableDays: number): Promise<string> {
    try {
      const prompt = `Create a personalized workout plan for a ${userLevel} fitness level. 
      Goals: ${goals.join(', ')}
      Available days per week: ${availableDays}
      
      Provide a structured workout plan with specific exercises, sets, reps, and rest periods. 
      Include both strength and cardio components.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a certified personal trainer. Create detailed, safe, and effective workout plans."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      return completion.choices[0]?.message?.content || "Unable to generate workout plan at this time.";
    } catch (error) {
      console.error('Error generating workout plan:', error);
      return "Unable to generate workout plan at this time. Please try again later.";
    }
  }

  static async getExerciseSuggestions(currentExercise: string): Promise<string[]> {
    try {
      const prompt = `Suggest 3-5 similar or complementary exercises to "${currentExercise}". 
      Include variations, progressions, or alternative exercises that target similar muscle groups.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a fitness expert. Provide exercise suggestions that are safe, effective, and suitable for gym workouts."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content || "";
      return response.split('\n').filter(line => line.trim()).slice(0, 5);
    } catch (error) {
      console.error('Error getting exercise suggestions:', error);
      return ["Try adding more sets", "Increase weight gradually", "Focus on proper form"];
    }
  }

  private static prepareWorkoutSummary(workouts: any[]): string {
    if (workouts.length === 0) {
      return "No workout data available yet.";
    }

    const recentWorkouts = workouts.slice(0, 10);
    const totalVolume = recentWorkouts.reduce((sum, w) => sum + w.totalVolume, 0);
    const avgSets = recentWorkouts.reduce((sum, w) => sum + w.totalSets, 0) / recentWorkouts.length;
    const exerciseFrequency = this.getExerciseFrequency(recentWorkouts);

    return `
Recent Workouts (${recentWorkouts.length}):
- Average sets per workout: ${avgSets.toFixed(1)}
- Total volume: ${totalVolume}kg
- Most frequent exercises: ${exerciseFrequency.slice(0, 3).join(', ')}
- Workout frequency: ${this.getWorkoutFrequency(recentWorkouts)} per week
    `.trim();
  }

  private static getExerciseFrequency(workouts: any[]): string[] {
    const exerciseCount: Record<string, number> = {};
    
    workouts.forEach(workout => {
      workout.exercises.forEach((exercise: any) => {
        exerciseCount[exercise.name] = (exerciseCount[exercise.name] || 0) + 1;
      });
    });

    return Object.entries(exerciseCount)
      .sort(([,a], [,b]) => b - a)
      .map(([name]) => name);
  }

  private static getWorkoutFrequency(workouts: any[]): number {
    if (workouts.length < 2) return workouts.length;
    
    const firstDate = new Date(workouts[workouts.length - 1].date);
    const lastDate = new Date(workouts[0].date);
    const daysDiff = (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);
    
    return Math.round((workouts.length / daysDiff) * 7 * 10) / 10;
  }

  private static createAnalysisPrompt(workoutSummary: string, userGoals?: string): string {
    return `
Analyze this workout data and provide fitness advice:

${workoutSummary}

User Goals: ${userGoals || 'General fitness improvement'}

Please provide:
1. 3-4 specific suggestions for improvement
2. 2-3 strengths in their current routine
3. 2-3 areas that need attention
4. A weekly recommendation
5. A motivational message

Format your response as:
SUGGESTIONS: [list suggestions]
STRENGTHS: [list strengths]
IMPROVEMENTS: [list areas for improvement]
WEEKLY_RECOMMENDATION: [recommendation]
MOTIVATION: [motivational message]
    `.trim();
  }

  private static parseAIResponse(response: string): WorkoutAnalysis {
    const lines = response.split('\n').map(line => line.trim());
    
    const getSection = (keyword: string): string[] => {
      const sectionIndex = lines.findIndex(line => line.startsWith(keyword));
      if (sectionIndex === -1) return [];
      
      const sectionLines = [];
      for (let i = sectionIndex + 1; i < lines.length; i++) {
        if (lines[i].startsWith('STRENGTHS:') || lines[i].startsWith('IMPROVEMENTS:') || 
            lines[i].startsWith('WEEKLY_RECOMMENDATION:') || lines[i].startsWith('MOTIVATION:')) {
          break;
        }
        if (lines[i]) sectionLines.push(lines[i].replace(/^[-•*]\s*/, ''));
      }
      return sectionLines;
    };

    return {
      suggestions: getSection('SUGGESTIONS:'),
      strengths: getSection('STRENGTHS:'),
      areasForImprovement: getSection('IMPROVEMENTS:'),
      weeklyRecommendation: getSection('WEEKLY_RECOMMENDATION:').join(' ') || 'Keep up the great work!',
      motivation: getSection('MOTIVATION:').join(' ') || 'You\'re making excellent progress!'
    };
  }

  private static getFallbackAnalysis(): WorkoutAnalysis {
    return {
      suggestions: [
        'Try to maintain consistency - aim for at least 3 workouts per week',
        'Consider increasing your training volume gradually',
        'Add more variety to your exercise selection'
      ],
      strengths: [
        'You\'re starting your fitness journey!',
        'Consistency is key to progress'
      ],
      areasForImprovement: [
        'Build a consistent workout routine',
        'Focus on progressive overload'
      ],
      weeklyRecommendation: 'Start with 3 workouts per week and gradually increase frequency',
      motivation: 'Every workout counts! You\'re building healthy habits that will last a lifetime.'
    };
  }
}
