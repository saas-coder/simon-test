import React, { useState } from 'react';
import { ArrowRight, Info } from 'lucide-react';
import type { AnalysisResult } from '../types';

interface BrandToneSelectorProps {
  analysisResult: AnalysisResult;
  onToneSelected: (tone: string) => void;
}

const BRAND_TONES = [
  {
    id: 'professional',
    label: 'Professional',
    icon: '🎯',
    description: 'Authoritative and trustworthy communication style',
    examples: ['Expert insights', 'Data-driven results', 'Industry-leading solutions']
  },
  {
    id: 'humorous',
    label: 'Humorous',
    icon: '😄',
    description: 'Light-hearted and entertaining approach',
    examples: ['Witty headlines', 'Playful messaging', 'Relatable content']
  },
  {
    id: 'inspiring',
    label: 'Inspiring',
    icon: '✨',
    description: 'Motivational and empowering voice',
    examples: ['Transformative stories', 'Aspirational goals', 'Life-changing results']
  },
  {
    id: 'casual',
    label: 'Casual',
    icon: '👋',
    description: 'A relaxed and engaging style, perfect for friendly and approachable campaigns',
    examples: ['Friendly conversations', 'Easy-going tone', 'Relatable stories']
  }
];

export default function BrandToneSelector({ analysisResult, onToneSelected }: BrandToneSelectorProps) {
  const [showProductTooltip, setShowProductTooltip] = useState(false);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
          <span className="text-3xl">🎯</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Select Your Brand Voice
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Choose a tone that best represents your brand personality
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
          Analysis Results
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="text-sm font-medium text-blue-800 dark:text-blue-200 flex items-center gap-2">
              Products Detected
              <div className="relative">
                <button
                  onMouseEnter={() => setShowProductTooltip(true)}
                  onMouseLeave={() => setShowProductTooltip(false)}
                  className="p-1 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-full transition-colors"
                >
                  <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </button>
                {showProductTooltip && (
                  <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 w-64 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Detected Products
                    </h4>
                    <div className="max-h-48 overflow-y-auto">
                      <ul className="space-y-2">
                        {analysisResult.products.map((product, index) => (
                          <li 
                            key={product.id}
                            className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2"
                          >
                            <span className="text-blue-600 dark:text-blue-400 font-medium">
                              {index + 1}.
                            </span>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {product.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-500">
                                {product.category}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-3 h-3 rotate-45 bg-white dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700" />
                  </div>
                )}
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {analysisResult.products.length}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Categories
            </div>
            <div className="flex flex-wrap gap-2">
              {analysisResult.categories.map((category, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Main Keywords
            </div>
            <div className="flex flex-wrap gap-2">
              {analysisResult.mainKeywords.slice(0, 5).map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {BRAND_TONES.map((tone) => (
          <button
            key={tone.id}
            onClick={() => onToneSelected(tone.id)}
            className="flex items-start gap-4 p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-transparent hover:border-blue-500 transition-all text-left"
          >
            <span className="text-3xl">{tone.icon}</span>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center justify-between">
                {tone.label}
                <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </h3>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                {tone.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {tone.examples.map((example, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-full"
                  >
                    {example}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}