import React, { useEffect, useState } from 'react';
import type { PDF } from '../App';

interface PDFViewerProps {
  pdf: PDF;
  onClose: () => void;
  onStatusChange: (id: number, status: 'to-study' | 'done') => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdf, onClose, onStatusChange }) => {
  const [pdfUrl, setPdfUrl] = useState('');
  
  useEffect(() => {
    // Convert ArrayBuffer to Blob URL
    const blob = new Blob([pdf.data], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
    
    // Clean up URL when component unmounts
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [pdf]);

  // Add event listener to handle Escape key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col">
      {/* Header with controls */}
      <div className="bg-gray-800 text-white p-4 flex items-center justify-between shadow-md">
        <h2 className="font-semibold text-lg truncate max-w-lg">{pdf.name}</h2>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onStatusChange(pdf.id!, pdf.status === 'to-study' ? 'done' : 'to-study')}
            className={`px-3 py-1 text-sm rounded hover:opacity-90 transition-opacity ${
              pdf.status === 'to-study'
                ? 'bg-green-500 text-white'
                : 'bg-blue-500 text-white'
            }`}
          >
            {pdf.status === 'to-study' ? 'Mark as Done' : 'Mark as To Study'}
          </button>
          
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* PDF Content - takes remaining height */}
      <div className="flex-1 overflow-hidden bg-gray-100">
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            className="w-full h-full border-0"
            title={`PDF Viewer - ${pdf.name}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Loading PDF...
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;