import React from 'react';
import { Book, Video, FileText, ArrowRight } from 'lucide-react';

const guides = [
  {
    title: "Getting Started with Ad Templates",
    description: "Learn how to use our template library effectively",
    type: "video",
    duration: "5 min",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Creating High-Converting Ads",
    description: "Best practices for ad creation and optimization",
    type: "article",
    duration: "10 min read",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Advanced Ad Analytics",
    description: "Understanding performance metrics and optimization",
    type: "video",
    duration: "15 min",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800"
  }
];

export default function Guides() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Guides</h1>
            <p className="mt-1 text-gray-400">
              Learn how to create better ads and improve your campaigns
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide, index) => (
            <div
              key={index}
              className="bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-700 shadow-[0_0_15px_rgba(101,99,252,0.1)] hover:shadow-[0_0_30px_rgba(101,99,252,0.2)] overflow-hidden group"
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={guide.image}
                  alt={guide.title}
                  className="w-full h-full object-cover"
                />
                {guide.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                      <Video className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  {guide.type === 'video' ? (
                    <Video className="w-4 h-4 text-blue-400" />
                  ) : (
                    <FileText className="w-4 h-4 text-blue-400" />
                  )}
                  <span className="text-sm text-gray-400">
                    {guide.duration}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">
                  {guide.title}
                </h3>
                <p className="text-gray-400 mb-4">
                  {guide.description}
                </p>

                <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                  Start Learning
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}