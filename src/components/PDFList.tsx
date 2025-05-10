import React, { useState } from 'react';
import type { PDF } from '../App';
import PDFViewer from './PDFViewer';

interface PDFListProps {
  pdfs: PDF[];
  onStatusChange: (id: number, status: 'to-study' | 'done') => void;
  onDelete: (id: number) => void;
}

const PDFList: React.FC<PDFListProps> = ({ pdfs, onStatusChange, onDelete }) => {
  const [selectedPDF, setSelectedPDF] = useState<PDF | null>(null);
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const handleViewPDF = (pdf: PDF) => {
    setSelectedPDF(pdf);
  };
  
  const handleCloseViewer = () => {
    setSelectedPDF(null);
  };

  if (pdfs.length === 0) {
    return (
      <div className="text-center py-12">
        <svg 
          className="mx-auto h-12 w-12 text-[var(--color-text-secondary)]" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
          <polyline points="13 2 13 9 20 9"></polyline>
        </svg>
        <h3 className="mt-2 text-lg font-medium text-[var(--color-text-primary)]">No PDFs available</h3>
        <p className="mt-1 text-[var(--color-text-secondary)]">
          {pdfs[0]?.status === 'to-study' 
            ? 'Upload some PDFs to get started'
            : 'You haven\'t completed any PDFs yet'}
        </p>
      </div>
    );
  }

  return (
    <div>
      {selectedPDF ? (
        <PDFViewer 
          pdf={selectedPDF} 
          onClose={handleCloseViewer}
          onStatusChange={onStatusChange}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {pdfs.map((pdf) => (
            <div 
              key={pdf.id} 
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-[var(--color-border-primary)] rounded-lg bg-[var(--color-bg-primary)] hover:bg-[var(--color-border-primary)] transition-colors"
            >
              <div className="flex items-center mb-2 sm:mb-0">
                <svg 
                  className="h-8 w-8 text-[var(--color-text-secondary)]" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <div className="ml-3">
                  <h3 className="text-[var(--color-text-primary)] font-medium truncate max-w-xs">
                    {pdf.name}
                  </h3>
                  <div className="flex text-xs text-[var(--color-text-secondary)]">
                    <span>{formatFileSize(pdf.size)}</span>
                    <span className="mx-2">•</span>
                    <span>Added on {formatDate(pdf.dateAdded)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2 mt-2 sm:mt-0">
                <button
                  onClick={() => handleViewPDF(pdf)}
                  className="px-3 py-1 text-sm bg-[var(--color-accent-secondary)] text-[var(--color-text-primary)] rounded hover:opacity-90 transition-opacity"
                >
                  View
                </button>
                
                <button
                  onClick={() => onStatusChange(pdf.id!, pdf.status === 'to-study' ? 'done' : 'to-study')}
                  className={`px-3 py-1 text-sm rounded hover:opacity-90 transition-opacity ${
                    pdf.status === 'to-study'
                      ? 'bg-[var(--color-accent-primary)] text-[var(--color-text-primary)]'
                      : 'bg-[var(--color-border-secondary)] text-[var(--color-text-primary)]'
                  }`}
                >
                  {pdf.status === 'to-study' ? 'Mark Done' : 'Study Again'}
                </button>
                
                <button
                  onClick={() => onDelete(pdf.id!)}
                  className="px-3 py-1 text-sm bg-[var(--color-error)] text-[var(--color-text-primary)] rounded hover:opacity-90 transition-opacity"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PDFList;