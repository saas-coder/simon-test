import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

interface Step {
  title: string;
  description: string;
  image: string;
  highlight?: string;
}

const GUIDE_STEPS: Step[] = [
  {
    title: "Import Your Data",
    description: "Enter your website URL in the Knowledge Base to automatically analyze your products and customer data.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    highlight: "knowledge-base-url"
  },
  {
    title: "Discover Templates",
    description: "Access personalized templates tailored to your brand and industry through the 'View Knowledge Templates' button.",
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&q=80&w=800",
    highlight: "templates-button"
  },
  {
    title: "Customize Your Campaign",
    description: "Select a template and let our AI generate optimized ad copy based on your product data.",
    image: "https://images.unsplash.com/photo-1553484771-047a44eee27f?auto=format&fit=crop&q=80&w=800",
    highlight: "template-selection"
  },
  {
    title: "Create Your Ad",
    description: "Edit your design in Canva or Figma and use our AI-generated text suggestions for maximum impact.",
    image: "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&q=80&w=800",
    highlight: "edit-buttons"
  }
];

export default function WelcomeGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('hasSeenWelcomeGuide');
    if (!hasSeenGuide) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenWelcomeGuide', 'true');
  };

  const handleNext = () => {
    if (currentStep < GUIDE_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      
      <div className="relative bg-gray-900 rounded-2xl max-w-2xl w-full mx-4 overflow-hidden shadow-2xl border border-gray-700">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="relative">
          {/* Image */}
          <div className="aspect-video relative">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
            <img
              src={GUIDE_STEPS[currentStep].image}
              alt={GUIDE_STEPS[currentStep].title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text Content */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-3">
              {GUIDE_STEPS[currentStep].title}
            </h2>
            <p className="text-gray-300 text-lg">
              {GUIDE_STEPS[currentStep].description}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 flex items-center justify-between">
          <div className="flex gap-2">
            {GUIDE_STEPS.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-blue-500'
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Skip Tutorial
            </button>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {currentStep === GUIDE_STEPS.length - 1 ? (
                  'Get Started'
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}