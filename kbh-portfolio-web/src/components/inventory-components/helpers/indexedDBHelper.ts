// src/helpers/indexedDBHelper.ts

export const openDatabase = () => {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = window.indexedDB.open("transactionDB", 1);
  
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBRequest).result as IDBDatabase;
        if (!db.objectStoreNames.contains("transactionBuffer")) {
          db.createObjectStore("transactionBuffer", { keyPath: "product_code" });
        }
      };
  
      request.onerror = () => reject("Error opening IndexedDB");
  
      request.onsuccess = (event) => {
        resolve((event.target as IDBRequest).result);
      };
    });
  };
  
  // Add transaction to IndexedDB buffer
  export const addToBuffer = async (transaction: any) => {
    const db = await openDatabase();
    const transactionStore = db.transaction("transactionBuffer", "readwrite").objectStore("transactionBuffer");
    transactionStore.put(transaction); // Put the transaction (overwrites if key exists)
    console.log("Buffered:", transaction);
  };
  
  // Get all transactions from IndexedDB buffer
  export const getFromBuffer = async () => {
    const db = await openDatabase();
    const transactionStore = db.transaction("transactionBuffer", "readonly").objectStore("transactionBuffer");
    return new Promise<any[]>((resolve, reject) => {
      const allTransactions: any[] = [];
      const request = transactionStore.openCursor();
  
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          allTransactions.push(cursor.value);
          cursor.continue();
        } else {
          resolve(allTransactions);
        }
      };
  
      request.onerror = () => reject("Error reading from IndexedDB");
    });
  };
  
  // Clear buffer after sending to API
  export const clearBuffer = async () => {
    const db = await openDatabase();
    const transactionStore = db.transaction("transactionBuffer", "readwrite").objectStore("transactionBuffer");
    const request = transactionStore.clear();
    request.onsuccess = () => console.log("Buffer cleared!");
    request.onerror = () => console.error("Error clearing buffer");
  };
  