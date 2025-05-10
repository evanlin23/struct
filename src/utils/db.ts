import type { PDF, Class } from '../utils/types';

const DB_NAME = 'pdf-study-app';
const DB_VERSION = 2; // Increased version for schema update
const PDF_STORE = 'pdfs';
const CLASS_STORE = 'classes';

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
      const oldVersion = event.oldVersion;
      
      // Create PDF store if upgrading from version 0
      if (oldVersion < 1) {
        if (!db.objectStoreNames.contains(PDF_STORE)) {
          const pdfStore = db.createObjectStore(PDF_STORE, { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          
          // Create indexes
          pdfStore.createIndex('status', 'status', { unique: false });
          pdfStore.createIndex('dateAdded', 'dateAdded', { unique: false });
        }
      }
      
      // Create class store and add classId index to PDF store if upgrading from version 1
      if (oldVersion < 2) {
        // Create class store
        if (!db.objectStoreNames.contains(CLASS_STORE)) {
          const classStore = db.createObjectStore(CLASS_STORE, {
            keyPath: 'id',
            autoIncrement: true
          });
          
          classStore.createIndex('name', 'name', { unique: false });
          classStore.createIndex('dateCreated', 'dateCreated', { unique: false });
        }
        
        // Add classId index to PDF store
        const pdfStore = event.target?.transaction?.objectStore(PDF_STORE);
        if (pdfStore && !pdfStore.indexNames.contains('classId')) {
          pdfStore.createIndex('classId', 'classId', { unique: false });
        }
      }
    };
  });
};

// Class related functions
export const addClass = async (classData: Class): Promise<number> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CLASS_STORE], 'readwrite');
    const store = transaction.objectStore(CLASS_STORE);
    
    const request = store.add(classData);
    
    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result as number);
    };
    
    request.onerror = (event) => {
      console.error('Error adding class:', event);
      reject('Error adding class');
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

export const getClasses = async (): Promise<Class[]> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CLASS_STORE], 'readonly');
    const store = transaction.objectStore(CLASS_STORE);
    
    const request = store.getAll();
    
    request.onsuccess = (event) => {
      const classes = (event.target as IDBRequest).result as Class[];
      resolve(classes);
    };
    
    request.onerror = (event) => {
      console.error('Error getting classes:', event);
      reject('Error getting classes');
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

export const getClass = async (id: number): Promise<Class> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CLASS_STORE], 'readonly');
    const store = transaction.objectStore(CLASS_STORE);
    
    const request = store.get(id);
    
    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result as Class);
    };
    
    request.onerror = (event) => {
      console.error('Error getting class:', event);
      reject('Error getting class');
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

export const updateClass = async (id: number, updates: Partial<Class>): Promise<void> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CLASS_STORE], 'readwrite');
    const store = transaction.objectStore(CLASS_STORE);
    
    // First get the current object
    const getRequest = store.get(id);
    
    getRequest.onsuccess = (event) => {
      const classData = (event.target as IDBRequest).result as Class;
      const updatedClass = { ...classData, ...updates };
      
      const updateRequest = store.put(updatedClass);
      
      updateRequest.onsuccess = () => {
        resolve();
      };
      
      updateRequest.onerror = (event) => {
        console.error('Error updating class:', event);
        reject('Error updating class');
      };
    };
    
    getRequest.onerror = (event) => {
      console.error('Error getting class for update:', event);
      reject('Error getting class for update');
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

export const deleteClass = async (id: number): Promise<void> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CLASS_STORE, PDF_STORE], 'readwrite');
    const classStore = transaction.objectStore(CLASS_STORE);
    const pdfStore = transaction.objectStore(PDF_STORE);
    const pdfIndex = pdfStore.index('classId');
    
    // Delete class
    classStore.delete(id);
    
    // Find and delete all PDFs associated with the class
    const pdfCursorRequest = pdfIndex.openCursor(IDBKeyRange.only(id));
    
    pdfCursorRequest.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        pdfStore.delete(cursor.primaryKey);
        cursor.continue();
      }
    };
    
    pdfCursorRequest.onerror = (event) => {
      console.error('Error deleting PDFs for class:', event);
      reject('Error deleting PDFs for class');
    };
    
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    
    transaction.onerror = (event) => {
      console.error('Error in delete class transaction:', event);
      reject('Error in delete class transaction');
    };
  });
};

// PDF related functions
export const addPDF = async (pdf: PDF): Promise<number> => {
  const db = await initDB();
  
  return new Promise(async (resolve, reject) => {
    const transaction = db.transaction([PDF_STORE, CLASS_STORE], 'readwrite');
    const pdfStore = transaction.objectStore(PDF_STORE);
    const classStore = transaction.objectStore(CLASS_STORE);
    
    // Add the PDF
    const request = pdfStore.add(pdf);
    
    request.onsuccess = (event) => {
      // Update the PDF count for the class if classId exists
      if (pdf.classId !== undefined) {
        const getClassRequest = classStore.get(pdf.classId);
        
        getClassRequest.onsuccess = (event) => {
          const classData = (event.target as IDBRequest).result as Class;
          if (classData) {
            classData.pdfCount += 1;
            classStore.put(classData);
          }
        };
      }
      
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
    const transaction = db.transaction([PDF_STORE], 'readonly');
    const store = transaction.objectStore(PDF_STORE);
    
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

export const getClassPDFs = async (classId: number): Promise<PDF[]> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PDF_STORE], 'readonly');
    const store = transaction.objectStore(PDF_STORE);
    const index = store.index('classId');
    
    const request = index.getAll(IDBKeyRange.only(classId));
    
    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result as PDF[]);
    };
    
    request.onerror = (event) => {
      console.error('Error getting class PDFs:', event);
      reject('Error getting class PDFs');
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

export const getPDF = async (id: number): Promise<PDF> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PDF_STORE], 'readonly');
    const store = transaction.objectStore(PDF_STORE);
    
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
    const transaction = db.transaction([PDF_STORE], 'readwrite');
    const store = transaction.objectStore(PDF_STORE);
    
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
    const transaction = db.transaction([PDF_STORE], 'readwrite');
    const store = transaction.objectStore(PDF_STORE);
    
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