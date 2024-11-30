import React, { useState } from 'react';
import { ArrowRight, Loader2, AlertCircle, CheckCircle2, Globe, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { analyzeWebsite } from '../lib/api';
import type { AnalysisResult } from '../types';

interface AnalysisSectionProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
}

export default function AnalysisSection({ onAnalysisComplete }: AnalysisSectionProps) {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const validateUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const cleanUrl = (url: string) => {
    let cleanedUrl = url.trim();
    if (!cleanedUrl.startsWith('http://') && !cleanedUrl.startsWith('https://')) {
      cleanedUrl = 'https://' + cleanedUrl;
    }
    return cleanedUrl;
  };

  const handleAnalyze = async () => {
    if (!url) {
      toast.error('Please enter a URL');
      return;
    }

    const cleanedUrl = cleanUrl(url);
    if (!validateUrl(cleanedUrl)) {
      toast.error('Please enter a valid website URL');
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setError(null);

    try {
      // Start progress animation
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const analysisResults = await analyzeWebsite(cleanedUrl);
      
      clearInterval(progressInterval);
      setProgress(100);

      onAnalysisComplete(analysisResults);
      
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Analysis failed. Please try again.';
        
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Analysis error:', errorMessage);
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
          <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Analyze Your Store
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Enter your store URL to automatically analyze your products and optimize your campaigns
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <label htmlFor="url-input" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Store URL
            </label>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>

          {showHelp && (
            <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-sm text-blue-800 dark:text-blue-200">
              <p className="mb-2"><strong>Tips for best results:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Use your store's main product page or category page</li>
                <li>Ensure the URL is accessible (not password protected)</li>
                <li>Include the full URL with https://</li>
              </ul>
            </div>
          )}

          <div className="relative flex items-center">
            <input
              id="url-input"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL here: https://"
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white
                ${validateUrl(cleanUrl(url)) 
                  ? 'border-green-300 dark:border-green-600' 
                  : 'border-gray-300 dark:border-gray-600'
                }`}
            />
            <button
              onClick={handleAnalyze}
              disabled={!url || isAnalyzing}
              className="absolute right-2 flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Start Analysis
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {validateUrl(cleanUrl(url)) && !error && (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <CheckCircle2 className="w-4 h-4" />
            Valid URL format
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Analysis failed
              </p>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                {error}
              </p>
              <p className="mt-2 text-sm text-red-700 dark:text-red-300">
                Try using a different page URL or contact support if the issue persists.
              </p>
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="space-y-3">
            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Analysis in progress...</span>
              <span>{progress}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}