import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import TemplateCard from '../components/TemplateCard';
import FilterDropdown from '../components/FilterDropdown';
import AdPanel from '../components/AdPanel';
import TabSelector from '../components/TabSelector';
import { categories, formats, adTypes, templates } from '../data/templateData';
import { useKnowledgeStore } from '../hooks/useKnowledgeStore';
import type { Template } from '../types';

export default function Templates() {
  const location = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium'>('premium');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'knowledge'>(
    (location.state as any)?.activeTab === 'knowledge' ? 'knowledge' : 'all'
  );
  const [filters, setFilters] = useState({
    category: '',
    format: '',
    adType: ''
  });
  const { formData } = useKnowledgeStore();

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

  const tabs = [
    { id: 'all', label: 'All Templates' },
    { 
      id: 'knowledge', 
      label: 'Knowledge Templates',
      disabled: !formData 
    }
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-gray-900 to-black">
      <div className="p-6 space-y-6">
        {/* Header with Title and Plan Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Ad Templates</h1>
            <p className="text-gray-400">
              {selectedPlan === 'premium' ? '1000+ premium templates' : '50 free templates'}
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-1 rounded-xl border border-gray-700">
            <button
              onClick={() => setSelectedPlan('free')}
              className={`px-6 py-2 rounded-lg transition-all ${
                selectedPlan === 'free'
                  ? 'bg-[#6563fc] text-white shadow-lg shadow-[#6563fc]/25'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Free
            </button>
            <button
              onClick={() => setSelectedPlan('premium')}
              className={`px-6 py-2 rounded-lg transition-all ${
                selectedPlan === 'premium'
                  ? 'bg-[#6563fc] text-white shadow-lg shadow-[#6563fc]/25'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Premium
            </button>
          </div>
        </div>

        {/* Template Type Tabs */}
        <div className="flex justify-start">
          <TabSelector
            tabs={tabs}
            activeTab={activeTab}
            onChange={(tab) => setActiveTab(tab as 'all' | 'knowledge')}
          />
        </div>

        {/* Filters */}
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
              className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template, index) => (
            <div key={index} onClick={() => setSelectedTemplate(template)}>
              <TemplateCard template={template} />
            </div>
          ))}
        </div>
      </div>

      {/* Template Details Panel */}
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