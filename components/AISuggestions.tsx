'use client';

import { useState, useEffect } from 'react';
import { Brain, Sparkles, TrendingUp, Target, Heart } from 'lucide-react';
import { SimpleAIService as AIService, WorkoutAnalysis } from '@/lib/simpleAIService';

interface AISuggestionsProps {
  workouts: any[];
  userGoals?: string;
}

export default function AISuggestions({ workouts, userGoals }: AISuggestionsProps) {
  const [analysis, setAnalysis] = useState<WorkoutAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSuggestions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const aiAnalysis = await AIService.analyzeWorkoutData(workouts, userGoals);
      setAnalysis(aiAnalysis);
    } catch (err) {
      setError('Unable to generate AI suggestions. Please try again later.');
      console.error('Error generating suggestions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workouts.length > 0) {
      generateSuggestions();
    }
  }, [workouts.length]);

  if (workouts.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">AI-Powered Insights</h3>
          <p className="text-gray-500">Complete a few workouts to get personalized AI suggestions!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-primary-600" />
            <h3 className="text-lg font-semibold">AI-Powered Insights</h3>
          </div>
          <button
            onClick={generateSuggestions}
            disabled={loading}
            className="btn-primary text-sm"
          >
            {loading ? 'Analyzing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="card bg-red-50 border-red-200">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {analysis && (
        <>
          {/* Motivational Message */}
          <div className="card bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
            <div className="flex items-start space-x-3">
              <Heart className="h-6 w-6 text-primary-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-primary-800 mb-1">Motivation</h4>
                <p className="text-primary-700">{analysis.motivation}</p>
              </div>
            </div>
          </div>

          {/* Weekly Recommendation */}
          <div className="card">
            <div className="flex items-start space-x-3">
              <Target className="h-6 w-6 text-primary-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-2">This Week's Focus</h4>
                <p className="text-gray-700">{analysis.weeklyRecommendation}</p>
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="card">
            <div className="flex items-start space-x-3">
              <TrendingUp className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-3">Suggestions for Improvement</h4>
                <ul className="space-y-2">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">{suggestion}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Strengths */}
          {analysis.strengths.length > 0 && (
            <div className="card">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                  <span className="text-green-600 font-bold text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Your Strengths</h4>
                  <ul className="space-y-2">
                    {analysis.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700">{strength}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Areas for Improvement */}
          {analysis.areasForImprovement.length > 0 && (
            <div className="card">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                  <span className="text-orange-600 font-bold text-sm">!</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Areas to Focus On</h4>
                  <ul className="space-y-2">
                    {analysis.areasForImprovement.map((area, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700">{area}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
