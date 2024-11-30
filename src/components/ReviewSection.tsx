import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Save, ExternalLink, Edit2, Tag, Info } from 'lucide-react';
import CSVImport from './CSVImport';
import ProductEditModal from './ProductEditModal';
import type { AnalysisResult, Product } from '../types';

interface ReviewSectionProps {
  analysisResult: AnalysisResult;
  selectedTone: string;
  onSave: () => void;
  isSaving: boolean;
}

const INITIAL_PRODUCTS_TO_SHOW = 2;

// Helper function to generate product descriptions
const generateProductDescription = (product: Product): string => {
  const descriptions = [
    `Premium ${product.category.toLowerCase()} solution designed for optimal performance and reliability.`,
    `High-quality ${product.category.toLowerCase()} product that delivers exceptional results.`,
    `Innovative ${product.category.toLowerCase()} offering with advanced features and capabilities.`,
    `Professional-grade ${product.category.toLowerCase()} solution for demanding users.`
  ];
  
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

export default function ReviewSection({ 
  analysisResult, 
  selectedTone, 
  onSave,
  isSaving 
}: ReviewSectionProps) {
  const navigate = useNavigate();
  const [showFullDescription, setShowFullDescription] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Initialize products with descriptions
  const [products, setProducts] = useState<Product[]>(
    analysisResult.products.map(product => ({
      ...product,
      description: product.description || generateProductDescription(product),
      image: product.image || `https://source.unsplash.com/800x600/?${encodeURIComponent(product.category.toLowerCase())}`
    }))
  );

  const displayedProducts = showAllProducts 
    ? products 
    : products.slice(0, INITIAL_PRODUCTS_TO_SHOW);

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prevProducts => 
      prevProducts.map(p => 
        p.id === updatedProduct.id ? updatedProduct : p
      )
    );
    setEditingProduct(null);
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const handleSaveAndContinue = async () => {
    await onSave();
    navigate('/knowledge-base');
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
          <span className="text-3xl">📋</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Review and Import
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Review detected products and import customer reviews
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Analysis Summary
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Brand Name
              </div>
              <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                {analysisResult.brandName}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Selected Tone
              </div>
              <div className="mt-1">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  {selectedTone.charAt(0).toUpperCase() + selectedTone.slice(1)}
                </span>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Products Detected
              </div>
              <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                {products.length}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Import Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Import Customer Reviews
            </h3>
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 relative"
            >
              <Info className="w-4 h-4" />
              {showTooltip && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-72 p-3 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg shadow-lg z-50">
                  <p>Import customer reviews to enhance your ad targeting and messaging. Reviews help identify key benefits, pain points, and customer language patterns.</p>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-gray-900 dark:border-r-gray-700" />
                </div>
              )}
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Upload your customer reviews to automatically analyze sentiment, extract key benefits, and identify common pain points. This data will help create more targeted and effective ad campaigns.
          </p>
          <CSVImport
            productId="all"
            productName="All Products"
            onImport={(reviews) => {
              console.log(`Imported ${reviews.length} reviews`);
            }}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Products Detected
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
              >
                {product.image && (
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {product.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                          <Tag className="w-3.5 h-3.5" />
                          {product.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {showFullDescription === product.id 
                          ? product.description
                          : truncateText(product.description)}
                        {product.description && product.description.length > 150 && (
                          <button
                            onClick={() => setShowFullDescription(
                              showFullDescription === product.id ? null : product.id
                            )}
                            className="ml-1 text-blue-600 hover:text-blue-500"
                          >
                            {showFullDescription === product.id ? 'Show less' : 'Read more'}
                          </button>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      {product.url && (
                        <a
                          href={product.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {products.length > INITIAL_PRODUCTS_TO_SHOW && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setShowAllProducts(!showAllProducts)}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {showAllProducts ? (
                  <>Show Less</>
                ) : (
                  <>Show {products.length - INITIAL_PRODUCTS_TO_SHOW} More Products</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {editingProduct && (
        <ProductEditModal
          product={editingProduct}
          onSave={handleUpdateProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}

      <div className="sticky bottom-6 flex justify-center">
        <button
          onClick={handleSaveAndContinue}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save and Continue
            </>
          )}
        </button>
      </div>
    </div>
  );
}