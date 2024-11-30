import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowUpDown, X } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';

// Mock data for brands
const MOCK_BRANDS = Array.from({ length: 500 }, (_, i) => ({
  id: `brand-${i + 1}`,
  name: `Brand ${i + 1}`,
  industry: ['Healthcare', 'Sports', 'Beauty', 'Technology', 'Entertainment', 'Sports'][Math.floor(Math.random() * 6)],
  size: ['Startup', 'Mid-Market', 'Enterprise'][Math.floor(Math.random() * 3)],
  status: ['Active', 'Paused', 'Archived'][Math.floor(Math.random() * 3)],
  activeAds: Math.floor(Math.random() * 1000),
  totalAds: Math.floor(Math.random() * 5000),
  monthlySpend: Math.floor(Math.random() * 1000000),
  engagement: Math.floor(Math.random() * 100),
  lastUpdated: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
}));

export default function Brands() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All Industries');
  const [sizeFilter, setSizeFilter] = useState('All Sizes');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestForm, setRequestForm] = useState({
    brandName: '',
    brandDomain: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredBrands = MOCK_BRANDS.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = industryFilter === 'All Industries' || brand.industry === industryFilter;
    const matchesSize = sizeFilter === 'All Sizes' || brand.size === sizeFilter;
    const matchesStatus = statusFilter === 'All Statuses' || brand.status === statusFilter;
    return matchesSearch && matchesIndustry && matchesSize && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Brand request submitted successfully');
      setShowRequestModal(false);
      setRequestForm({ brandName: '', brandDomain: '' });
    } catch (error) {
      toast.error('Failed to submit brand request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Top Brands</h1>
            <p className="text-gray-400">
              Analyze ad performance across 500 leading brands
            </p>
          </div>
          <button
            onClick={() => setShowRequestModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Request Brand
          </button>
        </div>

        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search brands..."
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                />
              </div>
            </div>
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
            >
              <option>All Industries</option>
              <option>Healthcare</option>
              <option>Sports</option>
              <option>Beauty</option>
              <option>Technology</option>
              <option>Entertainment</option>
            </select>
            <select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
            >
              <option>All Sizes</option>
              <option>Startup</option>
              <option>Mid-Market</option>
              <option>Enterprise</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
            >
              <option>All Statuses</option>
              <option>Active</option>
              <option>Paused</option>
              <option>Archived</option>
            </select>
          </div>

          {/* Brands Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBrands.map((brand) => (
              <div
                key={brand.id}
                className="bg-gray-800/95 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-[0_0_15px_rgba(101,99,252,0.1)] hover:shadow-[0_0_30px_rgba(101,99,252,0.2)] hover:bg-gray-800 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-xl font-bold text-white">
                        {brand.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{brand.name}</h3>
                      <span className="text-sm text-gray-400">{brand.industry}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    brand.status === 'Active'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : brand.status === 'Paused'
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {brand.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <p className="text-sm text-gray-400">Monthly Spend</p>
                    <p className="text-lg font-semibold text-white">
                      {formatCurrency(brand.monthlySpend)}
                    </p>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <p className="text-sm text-gray-400">Active Ads</p>
                    <p className="text-lg font-semibold text-white">
                      {brand.activeAds}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <span className="text-sm text-gray-400">
                    Updated {formatDate(brand.lastUpdated)}
                  </span>
                  <button
                    onClick={() => navigate(`/brands/${brand.id}/ads`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Ads
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Request Brand Modal */}
      <Dialog
        open={showRequestModal}
        onClose={() => !isSubmitting && setShowRequestModal(false)}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

          <div className="relative bg-gray-900 rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 border border-gray-700">
            <div className="absolute right-4 top-4">
              <button
                onClick={() => setShowRequestModal(false)}
                className="p-1 text-gray-400 hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <Dialog.Title className="text-2xl font-bold text-white mb-8">
              Request Brand
            </Dialog.Title>

            <form onSubmit={handleRequestSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={requestForm.brandName}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, brandName: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Brand Domain
                </label>
                <input
                  type="url"
                  value={requestForm.brandDomain}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, brandDomain: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="www.website.com"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-gray-400 hover:text-gray-300 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </div>
  );
}