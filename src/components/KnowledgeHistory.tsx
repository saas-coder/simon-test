import React, { useState } from 'react';
import { Edit2, Trash2, ChevronRight, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { AnalysisResult } from '../types';

interface KnowledgeHistoryProps {
  history: (AnalysisResult & { brandTone: string; timestamp: string })[];
  onDelete: (timestamp: string) => void;
  onEdit: (timestamp: string) => void;
}

export default function KnowledgeHistory({ history, onDelete, onEdit }: KnowledgeHistoryProps) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(history.length / itemsPerPage);
  
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const paginatedHistory = history.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (history.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
        <Clock className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Analysis History
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Your analysis history will appear here once you analyze your first store.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {paginatedHistory.map((item) => (
          <div
            key={item.timestamp}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {item.brandName}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(item.timestamp)}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Products Analyzed
                  </div>
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {item.products.length}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Brand Tone
                  </div>
                  <div className="inline-block px-3 py-1 mt-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-full">
                    {item.brandTone.charAt(0).toUpperCase() + item.brandTone.slice(1)}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Main Keywords
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {item.mainKeywords.slice(0, 3).map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                    {item.mainKeywords.length > 3 && (
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                        +{item.mainKeywords.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => onEdit(item.timestamp)}
                  className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item.timestamp)}
                  className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${
                page === pageNum
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}