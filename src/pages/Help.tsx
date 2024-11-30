import React from 'react';
import { MessageCircle, Mail, Book, Search, ChevronRight } from 'lucide-react';

const faqs = [
  {
    question: "How do I create my first ad template?",
    answer: "Navigate to Templates, click 'Create New', and follow our step-by-step guide to create your first ad template."
  },
  {
    question: "Can I export my templates?",
    answer: "Yes! You can export templates in multiple formats including PSD, AI, and PNG. Just click the export button on any template."
  },
  {
    question: "How do I share templates with my team?",
    answer: "Use the share button on any template to invite team members or generate a shareable link."
  }
];

export default function Help() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Help Center</h1>
          <p className="mt-1 text-gray-400">
            Get help with your questions and find resources
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-2xl mx-auto mb-12">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for help..."
            className="w-full pl-12 pr-4 py-3 bg-white/10 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <button className="p-6 bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-700 shadow-[0_0_15px_rgba(101,99,252,0.1)] hover:shadow-[0_0_30px_rgba(101,99,252,0.2)] transition-all text-left">
            <MessageCircle className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Live Chat
            </h3>
            <p className="text-gray-400">
              Chat with our support team
            </p>
          </button>

          <button className="p-6 bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-700 shadow-[0_0_15px_rgba(101,99,252,0.1)] hover:shadow-[0_0_30px_rgba(101,99,252,0.2)] transition-all text-left">
            <Mail className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Email Support
            </h3>
            <p className="text-gray-400">
              Get help via email
            </p>
          </button>

          <button className="p-6 bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-700 shadow-[0_0_15px_rgba(101,99,252,0.1)] hover:shadow-[0_0_30px_rgba(101,99,252,0.2)] transition-all text-left">
            <Book className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Documentation
            </h3>
            <p className="text-gray-400">
              Browse our guides
            </p>
          </button>
        </div>

        {/* FAQs */}
        <div className="bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-700 shadow-[0_0_15px_rgba(101,99,252,0.1)] overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="divide-y divide-gray-700">
            {faqs.map((faq, index) => (
              <button
                key={index}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
              >
                <div className="text-left">
                  <h3 className="text-white font-medium">
                    {faq.question}
                  </h3>
                  <p className="mt-1 text-gray-400">
                    {faq.answer}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}