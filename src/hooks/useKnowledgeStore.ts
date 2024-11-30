import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where, orderBy, Timestamp, DocumentData, deleteDoc } from '@firebase/firestore';
import { db } from '../lib/firebase';
import type { AnalysisResult } from '../types';

interface KnowledgeData extends AnalysisResult {
  brandTone: string;
  timestamp: string;
}

interface KnowledgeStore {
  currentData: KnowledgeData | null;
  history: KnowledgeData[];
}

const STORAGE_KEY = 'knowledge_base_data';

const initialStore: KnowledgeStore = {
  currentData: null,
  history: []
};

export function useKnowledgeStore() {
  const [store, setStore] = useState<KnowledgeStore>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : initialStore;
    } catch (error) {
      console.error('Error loading knowledge store:', error);
      return initialStore;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (error) {
      console.error('Error saving knowledge store:', error);
    }
  }, [store]);

  const deleteFromHistory = async (timestamp: string) => {
    if (!timestamp) {
      throw new Error('Timestamp is required for deletion');
    }

    try {
      // Remove from local state first for immediate feedback
      setStore(prev => ({
        currentData: prev.currentData?.timestamp === timestamp ? null : prev.currentData,
        history: prev.history.filter(item => item.timestamp !== timestamp)
      }));

      // Delete from Firestore
      const knowledgeRef = collection(db, 'knowledge_base');
      const q = query(knowledgeRef, where('timestamp', '==', timestamp));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('Knowledge base not found in database');
      }

      // Delete all matching documents
      const deletePromises = querySnapshot.docs.map(async (doc) => {
        try {
          await deleteDoc(doc.ref);
        } catch (error) {
          console.error(`Failed to delete document ${doc.id}:`, error);
          throw error;
        }
      });

      await Promise.all(deletePromises);

    } catch (error) {
      // Revert local state if Firestore delete fails
      const deletedItem = store.history.find(item => item.timestamp === timestamp);
      if (deletedItem) {
        setStore(prev => ({
          currentData: prev.currentData?.timestamp === timestamp ? deletedItem : prev.currentData,
          history: [...prev.history, deletedItem]
        }));
      }

      // Throw a more descriptive error
      throw new Error(
        error instanceof Error 
          ? `Failed to delete knowledge base: ${error.message}`
          : 'Failed to delete knowledge base'
      );
    }
  };

  const updateFormData = async (data: KnowledgeData) => {
    try {
      // Update local state first for immediate feedback
      const newStore = {
        currentData: data,
        history: [data, ...store.history]
      };
      setStore(newStore);

      // Save to Firestore
      const knowledgeRef = collection(db, 'knowledge_base');
      const docRef = await addDoc(knowledgeRef, {
        ...data,
        createdAt: Timestamp.fromDate(new Date())
      });

      if (!docRef.id) {
        throw new Error('Failed to save to database');
      }

      return data;

    } catch (error) {
      console.error('Error saving to Firestore:', error);
      throw new Error(
        error instanceof Error 
          ? `Failed to save knowledge base: ${error.message}`
          : 'Failed to save knowledge base'
      );
    }
  };

  const loadFromHistory = (timestamp: string) => {
    if (!timestamp) return null;
    
    const data = store.history.find(item => item.timestamp === timestamp);
    if (data) {
      setStore(prev => ({
        ...prev,
        currentData: data
      }));
      return data;
    }
    return null;
  };

  const clearFormData = () => {
    setStore(initialStore);
  };

  return {
    formData: store.currentData,
    history: store.history || [],
    updateFormData,
    deleteFromHistory,
    loadFromHistory,
    clearFormData,
    hasData: !!store.currentData
  };
}