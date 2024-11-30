import React from 'react';
import { X, ExternalLink, Copy, BarChart2, DollarSign, Users, Eye, Clock, FileText, Globe } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface AdMetrics {
  impressions: number;
  clicks: number;
  ctr: string;
  spend: number;
  conversions: number;
}

interface Ad {
  id: string;
  title: string;
  brand: string;
  platform: string;
  format: string;
  status: string;
  performanceScore: string;
  industry: string;
  createdAt: Date;
  image: string;
  metrics: AdMetrics;
}

interface AdDetailsPanelProps {
  ad: Ad;
  onClose: () => void;
}

export default function AdDetailsPanel({ ad, onClose }: AdDetailsPanelProps) {
  const navigate = useNavigate();
  
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return format(date, 'MMM d, yyyy');
  };

  const handleRequestTemplate = () => {
    // Add to saved templates
    const savedTemplates = JSON.parse(localStorage.getItem('savedTemplates') || '[]');
    const newRequest = {
      ...ad,
      id: `template-${Date.now()}`, // Ensure unique ID
      requestedAt: new Date().toISOString(),
      status: 'Pending'
    };
    
    savedTemplates.push(newRequest);
    localStorage.setItem('savedTemplates', JSON.stringify(savedTemplates));
    
    toast.success('Template request added to saved templates');
    navigate('/saved');
  };

  const metrics = [
    { icon: Eye, label: 'Impressions', value: formatNumber(ad.metrics.impressions) },
    { icon: Users, label: 'Clicks', value: formatNumber(ad.metrics.clicks) },
    { icon: BarChart2, label: 'CTR', value: `${ad.metrics.ctr}%` },
    { icon: DollarSign, label: 'Spend', value: formatCurrency(ad.metrics.spend) },
    { icon: Users, label: 'Conversions', value: formatNumber(ad.metrics.conversions) }
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-[480px] bg-white dark:bg-gray-800 shadow-2xl flex flex-col z-50">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Ad Details</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-6">
          <div className="aspect-video relative my-6">
            <img
              src={ad.image}
              alt={ad.title}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>

        <div className="px-6 space-y-6">
          {/* Header Info */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{ad.brand}</h3>
              <span className={`px-2.5 py-1 text-xs rounded-full ${
                ad.status === 'Active'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {ad.status}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Created on {formatDate(ad.createdAt)}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-sm rounded-full">
              {ad.format}
            </span>
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 text-sm rounded-full">
              {ad.platform}
            </span>
            <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 text-sm rounded-full">
              {ad.performanceScore}
            </span>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 text-sm rounded-full">
              {ad.industry}
            </span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            {metrics.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{label}</span>
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {value}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button 
              onClick={handleRequestTemplate}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FileText className="w-5 h-5" />
              Request Template
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Globe className="w-5 h-5" />
              View Landing Page
            </button>
          </div>

          {/* Copy URL */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex-1 text-sm text-gray-600 dark:text-gray-400 truncate">
              https://example.com/ad/{ad.id}
            </div>
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <Copy className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}