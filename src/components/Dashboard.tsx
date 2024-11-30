import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import TemplateCard from './TemplateCard';
import FilterDropdown from './FilterDropdown';
import AdPanel from './AdPanel';
import { categories, formats, adTypes, templates } from '../data/templateData';
import type { Template } from '../types';

export default function Dashboard() {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium'>('premium');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [filters, setFilters] = useState({
    category: '',
    format: '',
    adType: ''
  });

  const clearFilters = () => {
    setFilters({
      category: '',
      format: '',
      adType: ''
    });
  };

  const filteredTemplates = templates.filter(template => {
    if (selectedPlan === 'free' && !template.isFree) return false;
    
    return (!filters.category || template.category === filters.category) &&
           (!filters.format || template.format === filters.format) &&
           (!filters.adType || template.adType === filters.adType);
  });

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ad Templates</h1>
            <p className="text-gray-500 dark:text-gray-400">
              {selectedPlan === 'premium' ? '1000+ premium templates' : '50 free templates'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setSelectedPlan('free')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  selectedPlan === 'free'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Free
              </button>
              <button
                onClick={() => setSelectedPlan('premium')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  selectedPlan === 'premium'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Premium
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <FilterDropdown
            label="Category"
            options={categories}
            value={filters.category}
            onChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
          />
          <FilterDropdown
            label="Format"
            options={formats}
            value={filters.format}
            onChange={(value) => setFilters(prev => ({ ...prev, format: value }))}
          />
          <FilterDropdown
            label="Ad Type"
            options={adTypes}
            value={filters.adType}
            onChange={(value) => setFilters(prev => ({ ...prev, adType: value }))}
          />
          
          {(filters.category || filters.format || filters.adType) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 auto-rows-max">
          {filteredTemplates.map((template, index) => (
            <div key={index} onClick={() => setSelectedTemplate(template)}>
              <TemplateCard template={template} />
            </div>
          ))}
        </div>
      </div>

      {selectedTemplate && (
        <>
          <div
            className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setSelectedTemplate(null)}
          />
          <AdPanel
            template={selectedTemplate}
            onClose={() => setSelectedTemplate(null)}
          />
        </>
      )}
    </div>
  );
}