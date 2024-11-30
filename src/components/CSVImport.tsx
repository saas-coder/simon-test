import React, { useState } from 'react';
import { Upload, X, Check, AlertCircle, Info, Plus } from 'lucide-react';
import Papa from 'papaparse';
import toast from 'react-hot-toast';

interface Review {
  rating: number;
  comment: string;
  date: string;
}

interface CSVImportProps {
  productId: string;
  productName: string;
  onImport: (reviews: Review[]) => void;
}

export default function CSVImport({ productId, productName, onImport }: CSVImportProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualReview, setManualReview] = useState<Partial<Review>>({
    rating: 5,
    comment: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateCSV = (results: any[]) => {
    const requiredColumns = ['rating', 'comment', 'date'];
    const headers = Object.keys(results[0]);
    
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    if (missingColumns.length > 0) {
      throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
    }

    return results.map(row => ({
      rating: Number(row.rating),
      comment: row.comment,
      date: row.date
    }));
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const validatedReviews = validateCSV(results.data);
          setPreview(validatedReviews.slice(0, 3));
          onImport(validatedReviews);
          toast.success(`${validatedReviews.length} reviews imported for ${productName}`);
          setError(null);
        } catch (err: any) {
          setError(err.message);
          toast.error('Failed to import reviews');
        }
      },
      error: () => {
        setError('Failed to parse CSV file');
        toast.error('Failed to parse CSV file');
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualReview.comment || !manualReview.rating) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newReview: Review = {
      rating: Number(manualReview.rating),
      comment: manualReview.comment,
      date: manualReview.date || new Date().toISOString().split('T')[0]
    };

    onImport([newReview]);
    toast.success('Review added successfully');
    setShowManualEntry(false);
    setManualReview({
      rating: 5,
      comment: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Customer Reviews for {productName}
          </h3>
          <div className="relative">
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <Info className="w-4 h-4" />
            </button>
            {showTooltip && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 p-3 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg shadow-lg z-50">
                <p className="leading-relaxed">
                  Import customer reviews to identify key benefits and objections. This helps create targeted ad copy that resonates with your audience.
                </p>
                <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 border-8 border-transparent border-t-gray-900 dark:border-t-gray-700" />
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowManualEntry(!showManualEntry)}
          className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
        >
          <Plus className="w-4 h-4" />
          Add Review
        </button>
      </div>

      {showManualEntry && (
        <form onSubmit={handleManualSubmit} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Rating
              </label>
              <select
                value={manualReview.rating}
                onChange={(e) => setManualReview(prev => ({ ...prev, rating: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {[5, 4, 3, 2, 1].map(rating => (
                  <option key={rating} value={rating}>{rating} stars</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Review
              </label>
              <textarea
                value={manualReview.comment}
                onChange={(e) => setManualReview(prev => ({ ...prev, comment: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                rows={3}
                placeholder="Enter customer review..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                value={manualReview.date}
                onChange={(e) => setManualReview(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowManualEntry(false)}
                className="px-3 py-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Review
              </button>
            </div>
          </div>
        </form>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600'
        }`}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Drag and drop your CSV file here, or click to browse
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            CSV file should include: rating, comment, date
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {preview.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 dark:text-white">Preview</h4>
          {preview.map((review, index) => (
            <div
              key={index}
              className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {review.rating}/5
                  </span>
                  <span className="text-yellow-400">{'★'.repeat(Math.round(review.rating))}</span>
                </div>
                <span className="text-xs text-gray-500">{review.date}</span>
              </div>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}