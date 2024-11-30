import React, { useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';
import type { FormData } from '../types';

interface KnowledgeSummaryProps {
  data: FormData;
  onTitleUpdate: (title: string) => void;
}

export default function KnowledgeSummary({ data, onTitleUpdate }: KnowledgeSummaryProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.brandName);

  const handleSave = () => {
    onTitleUpdate(title);
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter title"
            />
            <button
              onClick={handleSave}
              className="p-1.5 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md"
            >
              <Save className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Website
            </h3>
            <p className="mt-1 text-gray-900 dark:text-white">
              {data.websiteUrl}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Industry
            </h3>
            <p className="mt-1 text-gray-900 dark:text-white">
              {data.industry}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Brand Tone
            </h3>
            <p className="mt-1 text-gray-900 dark:text-white">
              {data.brandTone}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Target Customer
            </h3>
            <p className="mt-1 text-gray-900 dark:text-white">
              {data.targetCustomer}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Main Value Proposition
          </h3>
          <p className="mt-1 text-gray-900 dark:text-white">
            {data.mainArgument}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Product Features
          </h3>
          <p className="mt-1 text-gray-900 dark:text-white whitespace-pre-line">
            {data.productFeatures}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Keywords
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {data.keywords.split(',').map((keyword, index) => (
              <span
                key={index}
                className="px-2.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
              >
                {keyword.trim()}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}