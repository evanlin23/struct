import type { PDF, Class } from '../utils/types';

const DB_NAME = 'pdf-study-app';
const DB_VERSION = 2;
const PDF_STORE = 'pdfs';
const CLASS_STORE = 'classes';

<<<<<<< HEAD
let dbConnection: IDBDatabase | null = null;

export const initDB = (): Promise<IDBDatabase> => {
  if (dbConnection) {
    return Promise.resolve(dbConnection);
  }
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
=======
// Database connection singleton
let dbConnection: IDBDatabase | null = null;

export const initDB = (): Promise<IDBDatabase> => {
  // If we already have an open connection, use it
  if (dbConnection) {
    return Promise.resolve(dbConnection);
  }
  
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
>>>>>>> c9ca3fd252d81f5024c9bd39ccf02d3ebf789335
    request.onerror = (event) => {
      console.error('IndexedDB error:', event);
      reject('Error opening database');
    };
<<<<<<< HEAD
    request.onsuccess = (event) => {
      dbConnection = (event.target as IDBOpenDBRequest).result;
      dbConnection.onclose = () => { dbConnection = null; };
=======
    
    request.onsuccess = (event) => {
      dbConnection = (event.target as IDBOpenDBRequest).result;
      
      // Handle connection closing from browser
      dbConnection.onclose = () => {
        dbConnection = null;
      };
      
      // Handle version change events
>>>>>>> c9ca3fd252d81f5024c9bd39ccf02d3ebf789335
      dbConnection.onversionchange = () => {
        dbConnection?.close();
        dbConnection = null;
      };
<<<<<<< HEAD
      resolve(dbConnection);
    };
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const oldVersion = event.oldVersion;
      if (oldVersion < 1) {
        if (!db.objectStoreNames.contains(PDF_STORE)) {
          const pdfStore = db.createObjectStore(PDF_STORE, { keyPath: 'id', autoIncrement: true });
=======
      
      resolve(dbConnection);
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
>>>>>>> c9ca3fd252d81f5024c9bd39ccf02d3ebf789335
          pdfStore.createIndex('status', 'status', { unique: false });
          pdfStore.createIndex('dateAdded', 'dateAdded', { unique: false });
        }
      }
<<<<<<< HEAD
      if (oldVersion < 2) {
        if (!db.objectStoreNames.contains(CLASS_STORE)) {
          const classStore = db.createObjectStore(CLASS_STORE, { keyPath: 'id', autoIncrement: true });
          classStore.createIndex('name', 'name', { unique: false });
          classStore.createIndex('dateCreated', 'dateCreated', { unique: false });
        }
        const transaction = (event.target as IDBOpenDBRequest).transaction;
        const pdfStore = transaction?.objectStore(PDF_STORE);
=======
      
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
        const transaction = (event.target as IDBOpenDBRequest).transaction;
        const pdfStore = transaction?.objectStore(PDF_STORE);

>>>>>>> c9ca3fd252d81f5024c9bd39ccf02d3ebf789335
        if (pdfStore && !pdfStore.indexNames.contains('classId')) {
          pdfStore.createIndex('classId', 'classId', { unique: false });
        }
      }
    };
  });
};

<<<<<<< HEAD
// --- Class related functions ---

// Add Class (with doneCount initialized to 0)
export const addClass = async (classData: Class): Promise<number> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CLASS_STORE], 'readwrite');
    const store = transaction.objectStore(CLASS_STORE);
=======
// Class related functions
export const addClass = async (classData: Class): Promise<number> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CLASS_STORE], 'readwrite');
    const store = transaction.objectStore(CLASS_STORE);
    
    // Set up transaction error handling
>>>>>>> c9ca3fd252d81f5024c9bd39ccf02d3ebf789335
    transaction.onerror = (event) => {
      console.error('Transaction error while adding class:', event);
      reject('Transaction error while adding class');
    };
<<<<<<< HEAD
    const newClass = { ...classData, pdfCount: 0, doneCount: 0 };
    const request = store.add(newClass);
=======
    
    const request = store.add(classData);
    
>>>>>>> c9ca3fd252d81f5024c9bd39ccf02d3ebf789335
    request.onsuccess = (event) => {
      const id = (event.target as IDBRequest).result as number;
      resolve(id);
    };
<<<<<<< HEAD
=======
    
>>>>>>> c9ca3fd252d81f5024c9bd39ccf02d3ebf789335
    request.onerror = (event) => {
      console.error('Error adding class:', event);
      reject('Error adding class');
    };
  });
};

export const getClasses = async (): Promise<Class[]> => {
  const db = await initDB();
<<<<<<< HEAD
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CLASS_STORE], 'readonly');
    const store = transaction.objectStore(CLASS_STORE);
=======
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CLASS_STORE], 'readonly');
    const store = transaction.objectStore(CLASS_STORE);
    
>>>>>>> c9ca3fd252d81f5024c9bd39ccf02d3ebf789335
    transaction.onerror = (event) => {
      console.error('Transaction error while getting classes:', event);
      reject('Transaction error while getting classes');
    };
<<<<<<< HEAD
    const request = store.getAll();
=======
    
    const request = store.getAll();
    
>>>>>>> c9ca3fd252d81f5024c9bd39ccf02d3ebf789335
    request.onsuccess = (event) => {
      const classes = (event.target as IDBRequest).result as Class[];
      resolve(classes);
    };
<<<<<<< HEAD
=======
    
>>>>>>> c9ca3fd252d81f5024c9bd39ccf02d3ebf789335
    request.onerror = (event) => {
      console.error('Error getting classes:', event);
      reject('Error getting classes');
    };
  });
};

export const getClass = async (id: number): Promise<Class> => {
  const db = await initDB();
<<<<<<< HEAD
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CLASS_STORE], 'readonly');
    const store = transaction.objectStore(CLASS_STORE);
=======
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CLASS_STORE], 'readonly');
    const store = transaction.objectStore(CLASS_STORE);
    
>>>>>>> c9ca3fd252d81f5024c9bd39ccf02d3ebf789335
    transaction.onerror = (event) => {
      console.error('Transaction error while getting class:', event);
      reject('Transaction error while getting class');
    };
<<<<<<< HEAD
    const request = store.get(id);
    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result as Class);
    };
=======
    
    const request = store.get(id);
    
    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result as Class);
    };
    
>>>>>>> c9ca3fd252d81f5024c9bd39ccf02d3ebf789335
    request.onerror = (event) => {
      console.error('Error getting class:', event);
      reject('Error getting class');
    };
  });
};

export const updateClass = async (id: number, updates: Partial<Class>): Promise<void> => {
  const db = await initDB();
<<<<<<< HEAD
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CLASS_STORE], 'readwrite');
    const store = transaction.objectStore(CLASS_STORE);
=======
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CLASS_STORE], 'readwrite');
    const store = transaction.objectStore(CLASS_STORE);
    
>>>>>>> c9ca3fd252d81f5024c9bd39ccf02d3ebf789335
    transaction.onerror = (event) => {
      console.error('Transaction error while updating class:', event);
      reject('Transaction error while updating class');
    };
<<<<<<< HEAD
    const getRequest = store.get(id);
    getRequest.onsuccess = (event) => {
      const classData = (event.target as IDBRequest).result as Class;
      const updatedClass = { ...classData, ...updates };
      const updateRequest = store.put(updatedClass);
      updateRequest.onsuccess = () => resolve();
=======
    
    // First get the current object
    const getRequest = store.get(id);
    
    getRequest.onsuccess = (event) => {
      const classData = (event.target as IDBRequest).result as Class;
      const updatedClass = { ...classData, ...updates };
      
      const updateRequest = store.put(updatedClass);
      
      updateRequest.onsuccess = () => {
        resolve();
      };
      
>>>>>>> c9ca3fd252d81f5024c9bd39ccf02d3ebf789335
      updateRequest.onerror = (event) => {
        console.error('Error updating class:', event);
        reject('Error updating class');
      };
    };
<<<<<<< HEAD
=======
    
>>>>>>> c9ca3fd252d81f5024c9bd39ccf02d3ebf789335
    getRequest.onerror = (event) => {
      console.error('Error getting class for update:', event);
      reject('Error getting class for update');
    };
  });
};

export const deleteClass = async (id: number): Promise<void> => {
  const db = await initDB();
<<<<<<< HEAD
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CLASS_STORE, PDF_STORE], 'readwrite');
=======
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CLASS_STORE, PDF_STORE], 'readwrite');
    
>>>>>>> c9ca3fd252d81f5024c9bd39ccf02d3ebf789335
    transaction.onerror = (event) => {
      console.error('Transaction error while deleting class:', event);
      reject('Transaction error while deleting class');
    };
<<<<<<< HEAD
    const classStore = transaction.objectStore(CLASS_STORE);
    const pdfStore = transaction.objectStore(PDF_STORE);
    const pdfIndex = pdfStore.index('classId');
    const deleteClassRequest = classStore.delete(id);
=======
    
    const classStore = transaction.objectStore(CLASS_STORE);
    const pdfStore = transaction.objectStore(PDF_STORE);
    const pdfIndex = pdfStore.index('classId');
    
    // Delete class
    const deleteClassRequest = classStore.delete(id);
    
>>>>>>> c9ca3fd252d81f5024c9bd39ccf02d3ebf789335
    deleteClassRequest.onerror = (event) => {
      console.error('Error deleting class:', event);
      reject('Error deleting class');
    };
<<<<<<< HEAD
    const pdfCursorRequest = pdfIndex.openCursor(IDBKeyRange.only(id));
=======
    
    // Find and delete all PDFs associated with the class
    const pdfCursorRequest = pdfIndex.openCursor(IDBKeyRange.only(id));
    
>>>>>>> c9ca3fd252d81f5024c9bd39ccf02d3ebf789335
    pdfCursorRequest.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        pdfStore.delete(cursor.primaryKey);
        cursor.continue();
      } else {
<<<<<<< HEAD
        resolve();
      }
    };
=======
        // All PDFs processed
        resolve();
      }
    };
    
>>>>>>> c9ca3fd252d81f5024c9bd39ccf02d3ebf789335
    pdfCursorRequest.onerror = (event) => {
      console.error('Error deleting PDFs for class:', event);
      reject('Error deleting PDFs for class');
    };
  });
};

<<<<<<< HEAD
// --- PDF related functions ---

// Add PDF (and update class pdfCount)
export const addPDF = async (pdf: PDF): Promise<number> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PDF_STORE, CLASS_STORE], 'readwrite');
=======
// PDF related functions
export const addPDF = async (pdf: PDF): Promise<number> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PDF_STORE, CLASS_STORE], 'readwrite');
    
>>>>>>> c9ca3fd252d81f5024c9bd39ccf02d3ebf789335
    transaction.onerror = (event) => {
      console.error('Transaction error while adding PDF:', event);
      reject('Transaction error while adding PDF');
    };
<<<<<<< HEAD
    const pdfStore = transaction.objectStore(PDF_STORE);
    const classStore = transaction.objectStore(CLASS_STORE);
    const request = pdfStore.add(pdf);
    request.onsuccess = (event) => {
      const pdfId = (event.target as IDBRequest).result as number;
      if (pdf.classId !== undefined) {
        const getClassRequest = classStore.get(pdf.classId);
        getClassRequest.onsuccess = (event) => {
          const classData = (event.target as IDBRequest).result as Class;
          if (classData) {
            const newPdfCount = (classData.pdfCount || 0) + 1;
            const newDoneCount = classData.doneCount || 0;
            const updateClassRequest = classStore.put({
              ...classData,
              pdfCount: newPdfCount,
              doneCount: newDoneCount
            });
            updateClassRequest.onerror = (event) => {
              console.error('Error updating class PDF count:', event);
              resolve(pdfId);
            };
=======
    
    const pdfStore = transaction.objectStore(PDF_STORE);
    const classStore = transaction.objectStore(CLASS_STORE);
    
    // Add the PDF
    const request = pdfStore.add(pdf);
    
    request.onsuccess = (event) => {
      const pdfId = (event.target as IDBRequest).result as number;
      
      // Update the PDF count for the class if classId exists
      if (pdf.classId !== undefined) {
        const getClassRequest = classStore.get(pdf.classId);
        
        getClassRequest.onsuccess = (event) => {
          const classData = (event.target as IDBRequest).result as Class;
          if (classData) {
            classData.pdfCount = (classData.pdfCount || 0) + 1;
            
            const updateClassRequest = classStore.put(classData);
            
            updateClassRequest.onerror = (event) => {
              console.error('Error updating class PDF count:', event);
              // Still resolve with PDF ID since PDF was added successfully
              resolve(pdfId);
            };
            
>>>>>>> c9ca3fd252d81f5024c9bd39ccf02d3ebf789335
            updateClassRequest.onsuccess = () => {
              resolve(pdfId);
            };
          } else {
<<<<<<< HEAD
            resolve(pdfId);
          }
        };
        getClassRequest.onerror = (event) => {
          console.error('Error getting class for PDF count update:', event);
          resolve(pdfId);
        };
      } else {
        resolve(pdfId);
      }
    };
=======
            // Class not found, but PDF was added, so resolve with PDF ID
            resolve(pdfId);
          }
        };
        
        getClassRequest.onerror = (event) => {
          console.error('Error getting class for PDF count update:', event);
          // Still resolve with PDF ID since PDF was added successfully
          resolve(pdfId);
        };
      } else {
        // No class ID, just resolve with PDF ID
        resolve(pdfId);
      }
    };
    
>>>>>>> c9ca3fd252d81f5024c9bd39ccf02d3ebf789335
    request.onerror = (event) => {
      console.error('Error adding PDF:', event);
      reject('Error adding PDF');
    };
  });
};

export const getPDFs = async (): Promise<PDF[]> => {
  const db = await initDB();
<<<<<<< HEAD
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PDF_STORE], 'readonly');
    const store = transaction.objectStore(PDF_STORE);
=======
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PDF_STORE], 'readonly');
    const store = transaction.objectStore(PDF_STORE);
    
>>>>>>> c9ca3fd252d81f5024c9bd39ccf02d3ebf789335
    transaction.onerror = (event) => {
      console.error('Transaction error while getting PDFs:', event);
      reject('Transaction error while getting PDFs');
    };
<<<<<<< HEAD
    const request = store.getAll();
    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result as PDF[]);
    };
=======
    
    const request = store.getAll();
    
    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result as PDF[]);
    };
    
>>>>>>> c9ca3fd252d81f5024c9bd39ccf02d3ebf789335
    request.onerror = (event) => {
      console.error('Error getting PDFs:', event);
      reject('Error getting PDFs');
    };
  });
};

export const getClassPDFs = async (classId: number): Promise<PDF[]> => {
  const db = await initDB();
<<<<<<< HEAD
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PDF_STORE], 'readonly');
    const store = transaction.objectStore(PDF_STORE);
=======
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PDF_STORE], 'readonly');
    const store = transaction.objectStore(PDF_STORE);
    
>>>>>>> c9ca3fd252d81f5024c9bd39ccf02d3ebf789335
    transaction.onerror = (event) => {
      console.error('Transaction error while getting class PDFs:', event);
      reject('Transaction error while getting class PDFs');
    };
<<<<<<< HEAD
    const index = store.index('classId');
    const request = index.getAll(IDBKeyRange.only(classId));
    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result as PDF[]);
    };
=======
    
    const index = store.index('classId');
    const request = index.getAll(IDBKeyRange.only(classId));
    
    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result as PDF[]);
    };
    
>>>>>>> c9ca3fd252d81f5024c9bd39ccf02d3ebf789335
    request.onerror = (event) => {
      console.error('Error getting class PDFs:', event);
      reject('Error getting class PDFs');
    };
  });
};

export const getPDF = async (id: number): Promise<PDF> => {
  const db = await initDB();
<<<<<<< HEAD
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PDF_STORE], 'readonly');
    const store = transaction.objectStore(PDF_STORE);
=======
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PDF_STORE], 'readonly');
    const store = transaction.objectStore(PDF_STORE);
    
>>>>>>> c9ca3fd252d81f5024c9bd39ccf02d3ebf789335
    transaction.onerror = (event) => {
      console.error('Transaction error while getting PDF:', event);
      reject('Transaction error while getting PDF');
    };
<<<<<<< HEAD
    const request = store.get(id);
    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result as PDF);
    };
=======
    
    const request = store.get(id);
    
    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result as PDF);
    };
    
>>>>>>> c9ca3fd252d81f5024c9bd39ccf02d3ebf789335
    request.onerror = (event) => {
      console.error('Error getting PDF:', event);
      reject('Error getting PDF');
    };
  });
};

<<<<<<< HEAD
// Update PDF status (and update class doneCount)
export const updatePDFStatus = async (id: number, status: 'to-study' | 'done'): Promise<void> => {
  const db = await initDB();
  return new Promise(async (resolve, reject) => {
    try {
      // 1. Get current PDF
      const pdf = await getPDF(id);
      const oldStatus = pdf.status;
      const classId = pdf.classId;

      // 2. Update PDF status
      const transaction = db.transaction([PDF_STORE, CLASS_STORE], 'readwrite');
      const pdfStore = transaction.objectStore(PDF_STORE);
      const classStore = transaction.objectStore(CLASS_STORE);

      const updatePDFRequest = pdfStore.put({ ...pdf, status });
      updatePDFRequest.onerror = (event) => {
        console.error('Error updating PDF status:', event);
        reject('Error updating PDF status');
      };

      updatePDFRequest.onsuccess = () => {
        // 3. If status changed and has class, update doneCount
        if (classId !== undefined && oldStatus !== status) {
          const getClassRequest = classStore.get(classId);
          getClassRequest.onsuccess = (event) => {
            const classObj = (event.target as IDBRequest).result as Class;
            if (classObj) {
              let doneCount = classObj.doneCount || 0;
              if (status === 'done' && oldStatus === 'to-study') {
                doneCount += 1;
              } else if (status === 'to-study' && oldStatus === 'done') {
                doneCount = Math.max(0, doneCount - 1);
              }
              const updateClassRequest = classStore.put({
                ...classObj,
                doneCount,
              });
              updateClassRequest.onerror = (event) => {
                console.error('Error updating class doneCount:', event);
                resolve();
              };
              updateClassRequest.onsuccess = () => resolve();
            } else {
              resolve();
            }
          };
          getClassRequest.onerror = (event) => {
            console.error('Error getting class for doneCount update:', event);
            resolve();
          };
        } else {
          resolve();
        }
      };
    } catch (error) {
      console.error('Error in updatePDFStatus:', error);
      reject('Error in updatePDFStatus');
    }
  });
};

// Delete PDF (and update class pdfCount and doneCount)
export const deletePDF = async (id: number): Promise<void> => {
  const db = await initDB();
  return new Promise(async (resolve, reject) => {
    try {
      const pdf = await getPDF(id);
      const status = pdf.status;
      const classId = pdf.classId;

      const transaction = db.transaction([PDF_STORE, CLASS_STORE], 'readwrite');
      const pdfStore = transaction.objectStore(PDF_STORE);
      const classStore = transaction.objectStore(CLASS_STORE);

      const deleteRequest = pdfStore.delete(id);
      deleteRequest.onerror = (event) => {
        console.error('Error deleting PDF:', event);
        reject('Error deleting PDF');
      };
      deleteRequest.onsuccess = () => {
        if (classId !== undefined) {
          const getClassRequest = classStore.get(classId);
          getClassRequest.onsuccess = (event) => {
            const classObj = (event.target as IDBRequest).result as Class;
            if (classObj) {
              const newPdfCount = Math.max(0, (classObj.pdfCount || 0) - 1);
              let doneCount = classObj.doneCount || 0;
              if (status === 'done') {
                doneCount = Math.max(0, doneCount - 1);
              }
              const updateClassRequest = classStore.put({
                ...classObj,
                pdfCount: newPdfCount,
                doneCount,
              });
              updateClassRequest.onerror = (event) => {
                console.error('Error updating class after PDF deletion:', event);
                resolve();
              };
              updateClassRequest.onsuccess = () => resolve();
            } else {
              resolve();
            }
          };
          getClassRequest.onerror = (event) => {
            console.error('Error getting class for PDF count update after deletion:', event);
            resolve();
          };
        } else {
          resolve();
        }
      };
    } catch (error) {
      // Fallback: just delete
      console.error('Error in deletePDF:', error);
      const transaction = db.transaction([PDF_STORE], 'readwrite');
      const store = transaction.objectStore(PDF_STORE);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
=======
export const updatePDFStatus = async (id: number, status: 'to-study' | 'done'): Promise<void> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PDF_STORE], 'readwrite');
    const store = transaction.objectStore(PDF_STORE);
    
    transaction.onerror = (event) => {
      console.error('Transaction error while updating PDF status:', event);
      reject('Transaction error while updating PDF status');
    };
    
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
  });
};

export const deletePDF = async (id: number): Promise<void> => {
  const db = await initDB();
  
  return new Promise(async (resolve, reject) => {
    try {
      // First get the PDF to check if it belongs to a class
      const pdf = await getPDF(id);
      
      const transaction = db.transaction([PDF_STORE, CLASS_STORE], 'readwrite');
      
      transaction.onerror = (event) => {
        console.error('Transaction error while deleting PDF:', event);
        reject('Transaction error while deleting PDF');
      };
      
      const pdfStore = transaction.objectStore(PDF_STORE);
      
      // Delete the PDF
      const deleteRequest = pdfStore.delete(id);
      
      deleteRequest.onsuccess = () => {
        // If this PDF belongs to a class, update the class PDF count
        if (pdf && pdf.classId !== undefined) {
          const classStore = transaction.objectStore(CLASS_STORE);
          const getClassRequest = classStore.get(pdf.classId);
          
          getClassRequest.onsuccess = (event) => {
            const classData = (event.target as IDBRequest).result as Class;
            
            if (classData && classData.pdfCount > 0) {
              classData.pdfCount -= 1;
              
              const updateClassRequest = classStore.put(classData);
              
              updateClassRequest.onerror = (event) => {
                console.error('Error updating class PDF count after deletion:', event);
                // Still resolve since PDF was deleted successfully
                resolve();
              };
              
              updateClassRequest.onsuccess = () => {
                resolve();
              };
            } else {
              // Class not found or count already 0, so just resolve
              resolve();
            }
          };
          
          getClassRequest.onerror = (event) => {
            console.error('Error getting class for PDF count update after deletion:', event);
            // Still resolve since PDF was deleted successfully
            resolve();
          };
        } else {
          // No class ID, just resolve
          resolve();
        }
      };
      
      deleteRequest.onerror = (event) => {
        console.error('Error deleting PDF:', event);
        reject('Error deleting PDF');
      };
    } catch (error) {
      // If there was an error getting the PDF, just try to delete it anyway
      console.error('Error in deletePDF:', error);
      
      const transaction = db.transaction([PDF_STORE], 'readwrite');
      const store = transaction.objectStore(PDF_STORE);
      
      const request = store.delete(id);
      
      request.onsuccess = () => {
        resolve();
      };
      
>>>>>>> c9ca3fd252d81f5024c9bd39ccf02d3ebf789335
      request.onerror = (event) => {
        console.error('Error in fallback PDF deletion:', event);
        reject('Error in fallback PDF deletion');
      };
    }
  });
<<<<<<< HEAD
};
=======
};
>>>>>>> c9ca3fd252d81f5024c9bd39ccf02d3ebf789335
