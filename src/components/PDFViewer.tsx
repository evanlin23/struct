import React, { useEffect, useState } from 'react';
import type { PDF } from '../App';

interface PDFViewerProps {
  pdf: PDF;
  onClose: () => void;
  onStatusChange: (id: number, status: 'to-study' | 'done') => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdf, onClose, onStatusChange }) => {
  const [pdfUrl, setPdfUrl] = useState<string>('');
  
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] truncate max-w-lg">
          {pdf.name}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => onStatusChange(pdf.id!, pdf.status === 'to-study' ? 'done' : 'to-study')}
            className={`px-3 py-1 text-sm rounded hover:opacity-90 transition-opacity ${
              pdf.status === 'to-study'
                ? 'bg-[var(--color-accent-primary)] text-[var(--color-text-primary)]'
                : 'bg-[var(--color-border-secondary)] text-[var(--color-text-primary)]'
            }`}
          >
            {pdf.status === 'to-study' ? 'Mark as Done' : 'Mark as To Study'}
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1 text-sm bg-[var(--color-border-secondary)] text-[var(--color-text-primary)] rounded hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </div>

      <div className="flex-1 border border-[var(--color-border-primary)] rounded-lg overflow-hidden">
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            width="100%"
            height="100%"
            title={pdf.name}
            className="rounded-lg"
            style={{ border: 'none' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--color-text-secondary)]">
            Loading PDF...
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;