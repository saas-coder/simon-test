import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Globe, History, Share2, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import { Dialog } from '@headlessui/react';
import ShareModal from '../components/ShareModal';
import HistoryModal from '../components/HistoryModal';
import KnowledgeMap from '../components/KnowledgeMap';
import { useKnowledgeStore } from '../hooks/useKnowledgeStore';

export default function KnowledgeBase() {
  const navigate = useNavigate();
  const { formData, deleteFromHistory } = useKnowledgeStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  const handleDelete = async () => {
    if (!formData?.timestamp) {
      toast.error('No knowledge base to delete');
      return;
    }

    setIsDeleting(true);
    
    try {
      await deleteFromHistory(formData.timestamp);
      toast.success('Knowledge base deleted successfully');
      setShowDeleteDialog(false);
      navigate('/knowledge');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete knowledge base');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = () => {
    navigate('/knowledge', { 
      state: { 
        isEditing: true,
        currentStep: 1
      }
    });
  };

  if (!formData) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-gray-900 to-black flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center">
          <Globe className="w-16 h-16 mx-auto text-gray-600 mb-6" />
          <h2 className="text-2xl font-bold text-white mb-3">
            No Knowledge Base Found
          </h2>
          <p className="text-gray-400 mb-8">
            Create your first knowledge base by analyzing your store.
          </p>
          <button
            onClick={() => navigate('/knowledge')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Knowledge Base
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Knowledge Base</h1>
            <p className="mt-1 text-gray-400">
              View and manage your knowledge base insights
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHistoryModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-gray-700 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              <History className="w-4 h-4" />
              History
            </button>
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-gray-700 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Knowledge Map */}
        <div className="bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-700 shadow-[0_0_15px_rgba(101,99,252,0.1)] hover:shadow-[0_0_30px_rgba(101,99,252,0.2)] transition-all">
          <KnowledgeMap data={formData} />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => !isDeleting && setShowDeleteDialog(false)}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

          <div className="relative bg-gray-900 rounded-xl shadow-xl max-w-md w-full mx-4 p-6 border border-gray-700">
            <Dialog.Title className="text-xl font-semibold text-white mb-4">
              Delete Knowledge Base
            </Dialog.Title>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this knowledge base? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-400 hover:text-gray-300 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        data={formData}
      />

      {/* History Modal */}
      <HistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        history={[formData]}
      />
    </div>
  );
}