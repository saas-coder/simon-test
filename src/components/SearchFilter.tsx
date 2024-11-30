import React from 'react';
import { Search, Filter } from 'lucide-react';
import Select from 'react-select';

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
}

const filterOptions = [
  { value: 'products', label: 'Products' },
  { value: 'categories', label: 'Categories' },
  { value: 'keywords', label: 'Keywords' },
  { value: 'brandTone', label: 'Brand Tone' }
];

export default function SearchFilter({
  searchQuery,
  onSearchChange,
  selectedFilters,
  onFilterChange
}: SearchFilterProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search knowledge base..."
          className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
        />
      </div>
      
      <div className="w-64">
        <Select
          isMulti
          options={filterOptions}
          value={filterOptions.filter(option => selectedFilters.includes(option.value))}
          onChange={(selected) => onFilterChange(selected.map(option => option.value))}
          placeholder="Filter by..."
          className="react-select-container"
          classNamePrefix="react-select"
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary: '#2563eb',
              primary75: '#3b82f6',
              primary50: '#60a5fa',
              primary25: '#93c5fd',
            },
          })}
        />
      </div>
    </div>
  );
}