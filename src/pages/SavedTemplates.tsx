import React, { useState, useEffect } from 'react';
import { Bookmark, Clock, Star, Trash2, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

type SavedType = 'all' | 'requests';

interface SavedTemplate {
  id: string;
  title: string;
  brand: string;
  image: string;
  status: string;
  requestedAt?: string;
  savedAt?: Date;
  category: string;
}

export default function SavedTemplates() {
  const [activeTab, setActiveTab] = useState<SavedType>('all');
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);

  useEffect(() => {
    const templates = JSON.parse(localStorage.getItem('savedTemplates') || '[]');
    const templatesWithUniqueIds = templates.map((template: SavedTemplate, index: number) => ({
      ...template,
      id: template.id || `template-${Date.now()}-${index}`
    }));
    setSavedTemplates(templatesWithUniqueIds);
  }, []);

  const filteredTemplates = savedTemplates.filter(template => {
    if (activeTab === 'all') return !template.requestedAt;
    return template.requestedAt;
  });

  const formatDate = (date: string | Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  };

  const handleDelete = (templateId: string) => {
    const updatedTemplates = savedTemplates.filter(t => t.id !== templateId);
    localStorage.setItem('savedTemplates', JSON.stringify(updatedTemplates));
    setSavedTemplates(updatedTemplates);
    toast.success('Template removed from saved items');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Mes sauvegardes</h1>
            <p className="mt-1 text-gray-400">
              Manage your saved and requested templates
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 rounded-xl bg-white/10 backdrop-blur-sm p-1 border border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'all'
                ? 'bg-[#6563fc] text-white shadow-lg shadow-[#6563fc]/25'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            All Saved
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'requests'
                ? 'bg-[#6563fc] text-white shadow-lg shadow-[#6563fc]/25'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            Request Templates
          </button>
        </div>

        {/* Grid of templates */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-700 shadow-[0_0_15px_rgba(101,99,252,0.1)] hover:shadow-[0_0_30px_rgba(101,99,252,0.2)] transition-all overflow-hidden group"
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={template.image}
                  alt={template.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                    <button className="flex-1 px-3 py-1.5 bg-white/90 hover:bg-white text-gray-900 rounded-lg backdrop-blur-sm transition-colors">
                      View Template
                    </button>
                    <button 
                      onClick={() => handleDelete(template.id)}
                      className="p-1.5 bg-white/90 hover:bg-white text-red-600 rounded-lg backdrop-blur-sm transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-white">{template.brand}</h3>
                  {template.requestedAt && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      template.status === 'Approved'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {template.status}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    {template.requestedAt 
                      ? `Requested ${formatDate(template.requestedAt)}`
                      : `Saved ${formatDate(template.savedAt || new Date())}`
                    }
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs rounded-full">
                    {template.category}
                  </span>
                  {!template.requestedAt && (
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Saved
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              {activeTab === 'all' ? (
                <Bookmark className="w-8 h-8 text-gray-400" />
              ) : (
                <FileText className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <h3 className="text-lg font-medium text-white mb-1">
              No {activeTab === 'all' ? 'saved templates' : 'template requests'} yet
            </h3>
            <p className="text-gray-400">
              {activeTab === 'all'
                ? 'Start saving templates you like for quick access'
                : 'Request templates from brands to get customized versions'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}