import { useEffect, useState } from 'react'
import { initDB, addPDF, getPDFs, updatePDFStatus, deletePDF } from './utils/db'
import Header from './components/Header'
import FileUpload from './components/FileUpload'
import PDFList from './components/PDFList'
import ProgressStats from './components/ProgressStats'

export type PDF = {
  id?: number;
  name: string;
  size: number;
  lastModified: number;
  data: ArrayBuffer;
  status: 'to-study' | 'done';
  dateAdded: number;
}

function App() {
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'to-study' | 'done'>('to-study');

  // Initialize the database
  useEffect(() => {
    const setupDatabase = async () => {
      await initDB();
      await loadPDFs();
      setIsLoading(false);
    };
    
    setupDatabase();
  }, []);

  const loadPDFs = async () => {
    const allPDFs = await getPDFs();
    setPdfs(allPDFs);
  };

  const handleFileUpload = async (files: FileList) => {
    setIsLoading(true);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        
        const pdfData: PDF = {
          name: file.name,
          size: file.size,
          lastModified: file.lastModified,
          data: arrayBuffer,
          status: 'to-study',
          dateAdded: Date.now()
        };
        
        await addPDF(pdfData);
      }
    }
    
    await loadPDFs();
    setIsLoading(false);
  };

  const handleStatusChange = async (id: number, newStatus: 'to-study' | 'done') => {
    await updatePDFStatus(id, newStatus);
    await loadPDFs();
  };

  const handleDelete = async (id: number) => {
    await deletePDF(id);
    await loadPDFs();
  };

  const toStudyPDFs = pdfs.filter(pdf => pdf.status === 'to-study');
  const donePDFs = pdfs.filter(pdf => pdf.status === 'done');

  const statsData = {
    total: pdfs.length,
    toStudy: toStudyPDFs.length,
    done: donePDFs.length
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:space-x-6">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <FileUpload onUpload={handleFileUpload} />
            <ProgressStats stats={statsData} />
          </div>
          
          <div className="w-full md:w-2/3">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex mb-4 border-b border-gray-700">
                <button
                  className={`px-4 py-2 text-lg ${
                    activeTab === 'to-study'
                      ? 'text-green-400 border-b-2 border-green-400'
                      : 'text-gray-400'
                  }`}
                  onClick={() => setActiveTab('to-study')}
                >
                  To Study ({toStudyPDFs.length})
                </button>
                <button
                  className={`px-4 py-2 text-lg ${
                    activeTab === 'done'
                      ? 'text-green-400 border-b-2 border-green-400'
                      : 'text-gray-400'
                  }`}
                  onClick={() => setActiveTab('done')}
                >
                  Done ({donePDFs.length})
                </button>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400"></div>
                </div>
              ) : (
                <PDFList
                  pdfs={activeTab === 'to-study' ? toStudyPDFs : donePDFs}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-4 text-center text-gray-400 bg-gray-800">
        <p>&copy; {new Date().getFullYear()} PDF Study Tool</p>
      </footer>
    </div>
  );
}

export default App