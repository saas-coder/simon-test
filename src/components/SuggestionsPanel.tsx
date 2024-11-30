import React from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';
import type { FormData } from '../types';

interface SuggestionsPanelProps {
  data: FormData;
}

export default function SuggestionsPanel({ data }: SuggestionsPanelProps) {
  // Generate suggestions based on the knowledge base data
  const suggestions = [
    {
      title: 'Optimize Product Descriptions',
      description: 'Add more emotional triggers and benefits to your product descriptions.',
      action: 'Review Descriptions',
      priority: 'high'
    },
    {
      title: 'Expand Keywords',
      description: 'Consider adding more industry-specific keywords to improve targeting.',
      action: 'Add Keywords',
      priority: 'medium'
    },
    {
      title: 'Update Brand Tone',
      description: 'Your content could be more aligned with your selected brand voice.',
      action: 'Adjust Tone',
      priority: 'low'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
          <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Suggested Improvements
        </h3>
      </div>

      <div className="space-y-4">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                  {suggestion.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {suggestion.description}
                </p>
                <span className={`inline-block mt-2 px-2 py-0.5 text-xs rounded-full ${getPriorityColor(suggestion.priority)}`}>
                  {suggestion.priority.charAt(0).toUpperCase() + suggestion.priority.slice(1)} Priority
                </span>
              </div>
              <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                {suggestion.action}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Last updated {new Date().toLocaleDateString()}
          </span>
          <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            View All Suggestions
          </button>
        </div>
      </div>
    </div>
  );
}