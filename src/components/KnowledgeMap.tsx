import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Box, MessageSquare, Star, Tag } from 'lucide-react';
import type { AnalysisResult } from '../types';

interface KnowledgeMapProps {
  data: AnalysisResult & {
    brandTone: string;
    reviews?: { productId: string; count: number }[];
  };
}

export default function KnowledgeMap({ data }: KnowledgeMapProps) {
  const navigate = useNavigate();
  const totalReviews = data.reviews?.reduce((sum, review) => sum + review.count, 0) || 0;

  const handleEditClick = () => {
    navigate('/knowledge', { 
      state: { 
        isEditing: true,
        currentStep: 1
      }
    });
  };

  const handleViewTemplates = () => {
    navigate('/', { 
      state: { 
        activeTab: 'knowledge',
        showSuccess: true 
      }
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="relative p-8 bg-gradient-to-r from-[#6563fc]/80 to-purple-600/80 rounded-t-xl">
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-white">
              {data.brandName}
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={handleViewTemplates}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-all"
              >
                View Knowledge Templates
              </button>
              <button
                onClick={handleEditClick}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-all"
              >
                <Edit2 className="w-4 h-4" />
                Edit Configuration
              </button>
            </div>
          </div>
          <p className="text-blue-100">
            {data.websiteUrl}
          </p>
        </div>
      </div>

      {/* Rest of the component remains the same */}
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Box className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Products</p>
              <p className="text-2xl font-bold text-white">{data.products.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <MessageSquare className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Brand Tone</p>
              <p className="text-2xl font-bold text-white capitalize">{data.brandTone}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <Star className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Reviews</p>
              <p className="text-2xl font-bold text-white">{totalReviews}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-8">
        <h3 className="text-lg font-semibold text-white mb-6">
          Product Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.products.map((product) => (
            <div
              key={product.id}
              className="group bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-[#6563fc]/50 transition-all"
            >
              <div className="flex items-start gap-4">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white truncate group-hover:text-[#6563fc] transition-colors">
                    {product.name}
                  </h4>
                  <p className="mt-1 text-sm text-gray-400 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                      <Tag className="w-3 h-3" />
                      {product.category}
                    </span>
                    {data.reviews?.find(r => r.productId === product.id)?.count && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                        <Star className="w-3 h-3" />
                        {data.reviews.find(r => r.productId === product.id)?.count} reviews
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Keywords Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white mb-4">
            Main Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.mainKeywords.map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-gray-700/50 text-gray-300 text-sm rounded-full hover:bg-gray-600/50 transition-colors cursor-default"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}