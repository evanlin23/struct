import React, { useState, useEffect } from 'react';
import type { Class } from '../utils/types';
import { getClasses, addClass, deleteClass, updateClass } from '../utils/db';
import ConfirmationModal from './ConfirmationModal';

interface ClassManagementProps {
  onSelectClass: (classId: number) => void;
  onCreateClass: (classId: number) => void;
}

const ClassManagement: React.FC<ClassManagementProps> = ({ onSelectClass, onCreateClass }) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [newClassName, setNewClassName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; classId: number | null }>({
    isOpen: false,
    classId: null,
  });
  const [editingClass, setEditingClass] = useState<{ id: number; name: string } | null>(null);
  const [showOnlyPinned, setShowOnlyPinned] = useState(false);
  
  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setIsLoading(true);
    try {
      const classData = await getClasses();
      
      // Use the actual doneCount from the class data
      // Calculate progress based on doneCount and pdfCount
      const classesWithProgress = classData.map(cls => {
        // If doneCount is not set, default to 0
        const doneCount = cls.doneCount || 0;
        const totalItems = cls.pdfCount;
        
        // Calculate progress percentage
        const progress = totalItems > 0 ? Math.round((doneCount / totalItems) * 100) : 0;
        
        return {
          ...cls,
          progress,
          completedItems: doneCount,
          totalItems
        };
      });
      
      // Sort classes: pinned first, then by name
      const sortedClasses = classesWithProgress.sort((a, b) => {
        // First sort by pinned status
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        
        // Then sort by name
        return a.name.localeCompare(b.name);
      });
      
      setClasses(sortedClasses);
    } catch (error) {
      console.error('Failed to load classes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateClass = async () => {
    if (!newClassName.trim()) return;
    
    try {
      const classId = await addClass({
        name: newClassName.trim(),
        dateCreated: Date.now(),
        pdfCount: 0,
        isPinned: false
      });
      
      setNewClassName('');
      await loadClasses();
      onCreateClass(classId);
    } catch (error) {
      console.error('Failed to create class:', error);
    }
  };

  const handleConfirmDelete = (classId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDelete({ isOpen: true, classId });
  };

  const handleDeleteClass = async () => {
    if (confirmDelete.classId === null) return;
    
    try {
      await deleteClass(confirmDelete.classId);
      setConfirmDelete({ isOpen: false, classId: null });
      await loadClasses();
    } catch (error) {
      console.error('Failed to delete class:', error);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete({ isOpen: false, classId: null });
  };

  const handleTogglePin = async (classId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Use the new toggle function instead of directly updating
      await toggleClassPin(classId);
      await loadClasses();
    } catch (error) {
      console.error('Failed to toggle pin status:', error);
    }
  };  

  const startEditingClassName = (classId: number, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingClass({ id: classId, name: currentName });
  };

  const handleEditNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingClass) {
      setEditingClass({ ...editingClass, name: e.target.value });
    }
  };

  const saveClassName = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && editingClass && editingClass.name.trim()) {
      try {
        await updateClass(editingClass.id, { name: editingClass.name.trim() });
        setEditingClass(null);
        await loadClasses();
      } catch (error) {
        console.error('Failed to update class name:', error);
      }
    } else if (e.key === 'Escape') {
      setEditingClass(null);
    }
  };

  const handleClickOutside = async () => {
    if (editingClass && editingClass.name.trim()) {
      try {
        await updateClass(editingClass.id, { name: editingClass.name.trim() });
        await loadClasses();
      } catch (error) {
        console.error('Failed to update class name:', error);
      }
    }
    setEditingClass(null);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  // Function to determine the color of the progress bar based on completion percentage
  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleTogglePinnedFilter = () => {
    setShowOnlyPinned(prev => !prev);
  };

  const filteredClasses = showOnlyPinned 
    ? classes.filter(cls => cls.isPinned) 
    : classes;
    
  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="bg-gray-800 py-8 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-green-400">
            struct
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-200">Create New Class</h2>
          <div className="flex">
            <input
              type="text"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="Enter class name"
              className="flex-1 p-2 rounded-l bg-gray-800 border border-gray-700 text-gray-200"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateClass()}
            />
            <button
              onClick={handleCreateClass}
              className="bg-green-500 text-white px-4 py-2 rounded-r hover:bg-green-600 transition-colors"
            >
              Create
            </button>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-200">Your Classes</h2>
          <button
            onClick={handleTogglePinnedFilter}
            className={`flex items-center px-3 py-1 rounded ${
              showOnlyPinned ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            <svg
              className="h-4 w-4 mr-2"
              viewBox="0 0 24 24"
              fill={showOnlyPinned ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="7" r="5" />
              <line x1="12" y1="12" x2="12" y2="22" />
            </svg>
            {showOnlyPinned ? 'Show All' : 'Show Pinned'}
          </button>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400"></div>
          </div>
        ) : classes.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 20v-6M6 20V10M18 20V4"></path>
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-200">No classes yet</h3>
            <p className="mt-1 text-gray-400">
              Create your first class to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClasses.map((cls) => (
              <div
                key={cls.id}
                onClick={() => onSelectClass(cls.id!)}
                className={`bg-gray-800 p-6 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700 transition-colors
                  ${cls.isPinned ? 'border-l-4 border-green-400' : ''}`}
              >
                <div className="flex justify-between items-start">
                  {editingClass && editingClass.id === cls.id ? (
                    <input
                      type="text"
                      value={editingClass.name}
                      onChange={handleEditNameChange}
                      onKeyDown={saveClassName}
                      onBlur={handleClickOutside}
                      autoFocus
                      className="text-xl font-bold bg-gray-700 text-gray-200 p-1 rounded w-full"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <div className="flex items-center">
                      <h3 className="text-xl font-bold text-gray-200 truncate">
                        {cls.name}
                      </h3>
                      <button
                        onClick={(e) => startEditingClassName(cls.id!, cls.name, e)}
                        className="ml-2 text-gray-400 hover:text-green-400 transition-colors"
                      >
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button
                        onClick={(e) => handleTogglePin(cls.id!, cls.isPinned || false, e)}
                        className={`ml-2 transition-colors ${cls.isPinned ? 'text-green-400' : 'text-gray-400 hover:text-green-400'}`}
                      >
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill={cls.isPinned ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 10l-6-6m0 0L3 16v6h6l12-12zm0 0l6 6" />
                        </svg>
                      </button>
                    </div>
                  )}
                  <button
                    onClick={(e) => handleConfirmDelete(cls.id!, e)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
                <div className="mt-2 text-gray-400 text-sm">
                  Created: {formatDate(cls.dateCreated)}
                </div>
                <div className="mt-1 text-gray-400 text-sm">
                  {cls.pdfCount} {cls.pdfCount === 1 ? 'PDF' : 'PDFs'}
                </div>
                
                {/* Progress section */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{cls.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`${getProgressColor(cls.progress || 0)} h-2 rounded-full`} 
                      style={{ width: `${cls.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {cls.doneCount || 0} of {cls.pdfCount} PDFs completed
                  </div>
                </div>
                
                <div className="mt-4">
                  <button className="w-full bg-blue-500 text-center py-2 rounded text-gray-200 hover:bg-blue-600 transition-colors">
                    Open Class
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={confirmDelete.isOpen}
        title="Delete Class"
        message="Are you sure you want to delete this class? All PDFs associated with this class will also be deleted. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteClass}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default ClassManagement;