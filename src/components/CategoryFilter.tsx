import React from 'react';
import { Tag } from 'lucide-react';

const categories = [
  { name: 'All', count: 245 },
  { name: 'E-commerce', count: 89 },
  { name: 'Service', count: 56 },
  { name: 'Retail', count: 43 },
  { name: 'SaaS', count: 32 },
  { name: 'Education', count: 25 }
];

export default function CategoryFilter() {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-2 mb-4 px-2">
        <Tag className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-900">Categories</h3>
      </div>
      <div className="space-y-1">
        {categories.map((category) => (
          <button
            key={category.name}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-gray-700">{category.name}</span>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {category.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}