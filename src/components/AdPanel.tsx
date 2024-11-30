import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Copy, Check, History, ChevronDown, Box } from 'lucide-react';
import { useKnowledgeStore } from '../hooks/useKnowledgeStore';
import type { Template } from '../types';

interface AdPanelProps {
  template: Template | null;
  onClose: () => void;
}

export default function AdPanel({ template, onClose }: AdPanelProps) {
  const { formData } = useKnowledgeStore();
  const [suggestions, setSuggestions] = useState<string[]>([
    "Drive 3x more sales with our proven formula",
    "Join 50,000+ happy customers worldwide",
    "Transform your results in just 14 days"
  ]);
  const [regenerateCount, setRegenerateCount] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [suggestionHistory, setSuggestionHistory] = useState<SuggestionSet[]>([]);

  const handleProductSelect = (productId: string) => {
    setSelectedProduct(productId);
    setShowProductDropdown(false);
    
    // Generate new suggestions based on selected product
    const product = formData?.products.find(p => p.id === productId);
    if (product) {
      const newSuggestions = [
        `Experience the power of ${product.name} today`,
        `Join thousands loving ${product.name}`,
        `Discover why ${product.name} is the #1 choice`
      ];
      setSuggestions(newSuggestions);
      setRegenerateCount(0);
    }
  };

  const handleRegenerate = () => {
    if (regenerateCount < 3) {
      const product = formData?.products.find(p => p.id === selectedProduct);
      const newSuggestions = product ? [
        `Boost your results with ${product.name}`,
        `The smart choice: ${product.name}`,
        `Premium ${product.category.toLowerCase()} solution: ${product.name}`
      ] : [
        `Boost your ${template?.category.toLowerCase()} results today`,
        `The #1 choice for ${template?.category.toLowerCase()} brands`,
        `Premium ${template?.category.toLowerCase()} solutions for you`
      ];
      setSuggestions(newSuggestions);
      setRegenerateCount(prev => prev + 1);
      setSuggestionHistory(prev => [
        { texts: newSuggestions, timestamp: new Date() },
        ...prev
      ]);
    }
  };

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (!template) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-[480px] card-gradient shadow-2xl flex flex-col z-50">
      <div className="flex items-center justify-between p-6 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white">Template Details</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="aspect-square relative">
          <img
            src={template.image}
            alt={template.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">{template.title}</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[#6563fc]/10 text-[#6563fc] text-sm rounded-full">
                {template.category}
              </span>
              <span className="px-3 py-1 bg-purple-900/30 text-purple-400 text-sm rounded-full">
                {template.format}
              </span>
              <span className="px-3 py-1 bg-gray-700/50 text-gray-300 text-sm rounded-full">
                {template.adType}
              </span>
            </div>
          </div>

          {/* Product Selection */}
          {formData?.products && formData.products.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-white">Choose your product</h4>
              <div className="relative">
                <button
                  onClick={() => setShowProductDropdown(!showProductDropdown)}
                  className="w-full flex items-center justify-between px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg hover:bg-gray-600/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Box className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-200">
                      {selectedProduct 
                        ? formData.products.find(p => p.id === selectedProduct)?.name 
                        : 'Select a product'}
                    </span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                    showProductDropdown ? 'rotate-180' : ''
                  }`} />
                </button>

                {showProductDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowProductDropdown(false)}
                    />
                    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-20 max-h-60 overflow-y-auto">
                      {formData.products.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleProductSelect(product.id)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700/50 transition-colors text-left"
                        >
                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <div className="font-medium text-white">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-400">
                              {product.category}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-white">AI Text Suggestions</h4>
              <button
                onClick={handleRegenerate}
                disabled={regenerateCount >= 3}
                className={`flex items-center gap-2 text-sm ${
                  regenerateCount >= 3
                    ? 'text-gray-500 cursor-not-allowed'
                    : 'text-[#6563fc] hover:text-[#5452d6]'
                }`}
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate ({3 - regenerateCount} left)
              </button>
            </div>

            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 group relative"
                >
                  <p className="pr-10 text-white">{suggestion}</p>
                  <button
                    onClick={() => handleCopy(suggestion, index)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-white">Generated Text History</span>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
            </button>

            {showHistory && (
              <div className="mt-4 space-y-6">
                {suggestionHistory.map((set, setIndex) => (
                  <div key={setIndex} className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>Generation {setIndex + 1}</span>
                      <span>{formatTimestamp(set.timestamp)}</span>
                    </div>
                    <div className="space-y-2">
                      {set.texts.map((text, textIndex) => (
                        <div
                          key={textIndex}
                          className="p-4 bg-gray-700/50 rounded-lg group relative"
                        >
                          <p className="pr-10 text-white text-sm">{text}</p>
                          <button
                            onClick={() => handleCopy(text, setIndex * 3 + textIndex + suggestions.length)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {copiedIndex === setIndex * 3 + textIndex + suggestions.length ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => window.open(template.canvaUrl, '_blank')}
              className="flex-1 px-4 py-2 bg-[#6563fc] text-white rounded-lg hover:bg-[#5452d6] transition-colors"
            >
              Edit in Canva
            </button>
            <button
              onClick={() => window.open(template.figmaUrl, '_blank')}
              className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Edit in Figma
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}