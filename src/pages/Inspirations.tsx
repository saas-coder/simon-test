import React, { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import AdDetailsPanel from '../components/AdDetailsPanel';

// Create themed categories with matching images
const themes = [
  {
    industry: 'Fashion',
    images: [
      'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=800'
    ]
  },
  // ... rest of themes array remains the same
];

// Generate mock ads data
const MOCK_ADS = Array.from({ length: 50 }, (_, i) => {
  const theme = themes[Math.floor(Math.random() * themes.length)];
  const image = theme.images[Math.floor(Math.random() * theme.images.length)];

  return {
    id: `ad-${i + 1}`,
    title: `Ad Campaign ${i + 1}`,
    brand: `Brand ${Math.floor(i / 3) + 1}`,
    platform: ['Facebook', 'Instagram', 'Messenger', 'Audience Network'][Math.floor(Math.random() * 4)],
    format: Math.random() > 0.5 ? 'Image' : 'Video',
    status: Math.random() > 0.3 ? 'Active' : 'Inactive',
    performanceScore: ['Winner', 'Great', 'Good', 'Average'][Math.floor(Math.random() * 4)],
    industry: theme.industry,
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
    image: image,
    metrics: {
      impressions: Math.floor(Math.random() * 1000000),
      clicks: Math.floor(Math.random() * 50000),
      ctr: (Math.random() * 5).toFixed(2),
      spend: Math.floor(Math.random() * 10000),
      conversions: Math.floor(Math.random() * 1000)
    }
  };
});

export default function Inspirations() {
  const [selectedAd, setSelectedAd] = useState(null);
  const [filters, setFilters] = useState({
    format: '',
    platform: '',
    status: '',
    performanceScore: '',
    timeLive: '',
    industry: '',
    brand: ''
  });

  const [showFilter, setShowFilter] = useState({
    format: false,
    platform: false,
    status: false,
    performanceScore: false,
    timeLive: false,
    industry: false,
    brand: false
  });

  const filterOptions = {
    format: ['Image', 'Video'],
    platform: ['Facebook', 'Instagram', 'Messenger', 'Audience Network'],
    status: ['Active', 'Inactive'],
    performanceScore: ['Winner', 'Great', 'Good', 'Average'],
    timeLive: ['Under 7 days', 'Over 7 days', 'Over 30 days', 'Over 3 months', 'Over 6 months', 'Over 12 months'],
    industry: ['Fashion', 'Technology', 'Food', 'Health', 'Education'],
    brand: Array.from(new Set(MOCK_ADS.map(ad => ad.brand)))
  };

  const filteredAds = MOCK_ADS.filter(ad => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return ad[key] === value;
    });
  });

  const handleFilterClick = (filterType: string) => {
    setShowFilter(prev => ({
      ...Object.fromEntries(Object.keys(prev).map(key => [key, false])),
      [filterType]: !prev[filterType]
    }));
  };

  const handleFilterSelect = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType] === value ? '' : value
    }));
    setShowFilter(prev => ({ ...prev, [filterType]: false }));
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-gray-900 to-black">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Get Inspired</h1>
          <p className="text-gray-400">Browse successful ad campaigns from top brands</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {Object.entries(filterOptions).map(([filterType, options]) => (
            <div key={filterType} className="relative">
              <button
                onClick={() => handleFilterClick(filterType)}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors ${
                  filters[filterType]
                    ? 'bg-[#6563fc] text-white'
                    : 'bg-white/10 border border-gray-700 text-white hover:bg-white/20'
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                <ChevronDown className={`w-4 h-4 transition-transform ${
                  showFilter[filterType] ? 'rotate-180' : ''
                }`} />
              </button>

              {showFilter[filterType] && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowFilter(prev => ({ ...prev, [filterType]: false }))}
                  />
                  <div className="absolute top-full left-0 mt-2 w-48 bg-gray-800 rounded-xl border border-gray-700 shadow-lg z-20 py-2">
                    {options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleFilterSelect(filterType, option)}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-700 ${
                          filters[filterType] === option
                            ? 'text-[#6563fc]'
                            : 'text-white'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Ads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAds.map((ad) => (
            <div
              key={ad.id}
              onClick={() => setSelectedAd(ad)}
              className="bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-700 shadow-[0_0_15px_rgba(101,99,252,0.1)] hover:shadow-[0_0_30px_rgba(101,99,252,0.2)] overflow-hidden cursor-pointer group"
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={ad.image}
                  alt={ad.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-4 left-4">
                    <button className="px-4 py-2 bg-white/90 hover:bg-white text-gray-900 rounded-lg backdrop-blur-sm transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-white">{ad.brand}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    ad.status === 'Active'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {ad.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs rounded-full">
                    {ad.platform}
                  </span>
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs rounded-full">
                    {ad.format}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedAd && (
        <AdDetailsPanel
          ad={selectedAd}
          onClose={() => setSelectedAd(null)}
        />
      )}
    </div>
  );
}