import type { PDF } from '../App';

const DB_NAME = 'pdf-study-app';
const DB_VERSION = 1;
const STORE_NAME = 'pdfs';

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error('IndexedDB error:', event);
      reject('Error opening database');
    };
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        
        // Create indexes
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('dateAdded', 'dateAdded', { unique: false });
      }
    };
  });
};

export const addPDF = async (pdf: PDF): Promise<number> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const request = store.add(pdf);
    
    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result as number);
    };
    
    request.onerror = (event) => {
      console.error('Error adding PDF:', event);
      reject('Error adding PDF');
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

export const getPDFs = async (): Promise<PDF[]> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    const request = store.getAll();
    
    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result as PDF[]);
    };
    
    request.onerror = (event) => {
      console.error('Error getting PDFs:', event);
      reject('Error getting PDFs');
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

export const getPDF = async (id: number): Promise<PDF> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    const request = store.get(id);
    
    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result as PDF);
    };
    
    request.onerror = (event) => {
      console.error('Error getting PDF:', event);
      reject('Error getting PDF');
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

export const updatePDFStatus = async (id: number, status: 'to-study' | 'done'): Promise<void> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    // First get the current object
    const getRequest = store.get(id);
    
    getRequest.onsuccess = (event) => {
      const pdf = (event.target as IDBRequest).result as PDF;
      pdf.status = status;
      
      // Update with new status
      const updateRequest = store.put(pdf);
      
      updateRequest.onsuccess = () => {
        resolve();
      };
      
      updateRequest.onerror = (event) => {
        console.error('Error updating PDF status:', event);
        reject('Error updating PDF status');
      };
    };
    
    getRequest.onerror = (event) => {
      console.error('Error getting PDF for update:', event);
      reject('Error getting PDF for update');
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

export const deletePDF = async (id: number): Promise<void> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const request = store.delete(id);
    
    request.onsuccess = () => {
      resolve();
    };
    
    request.onerror = (event) => {
      console.error('Error deleting PDF:', event);
      reject('Error deleting PDF');
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};