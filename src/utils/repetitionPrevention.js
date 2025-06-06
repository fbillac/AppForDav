// This module handles long-term repetition prevention for activities, components, and replacements
// It ensures no repetition for at least 10,000 generations

// Use IndexedDB for efficient storage of large amounts of data
// This is more suitable than localStorage which has size limitations

// Constants
const DB_NAME = 'ThingsGeneratorDB';
const DB_VERSION = 1;
const ACTIVITY_STORE = 'activities';
const COMPONENT_STORE = 'components';
const REPLACEMENT_STORE = 'replacements';
const MAX_HISTORY_SIZE = 10000; // Store up to 10,000 items per category

// Initialize the database
export const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    // Check if IndexedDB is supported
    if (!window.indexedDB) {
      console.error("Your browser doesn't support IndexedDB. Long-term repetition prevention will be limited.");
      resolve(false);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error("Database error:", event.target.error);
      reject(event.target.error);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(ACTIVITY_STORE)) {
        const activityStore = db.createObjectStore(ACTIVITY_STORE, { keyPath: 'id', autoIncrement: true });
        activityStore.createIndex('text', 'text', { unique: false });
        activityStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
      
      if (!db.objectStoreNames.contains(COMPONENT_STORE)) {
        const componentStore = db.createObjectStore(COMPONENT_STORE, { keyPath: 'id', autoIncrement: true });
        componentStore.createIndex('text', 'text', { unique: false });
        componentStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
      
      if (!db.objectStoreNames.contains(REPLACEMENT_STORE)) {
        const replacementStore = db.createObjectStore(REPLACEMENT_STORE, { keyPath: 'id', autoIncrement: true });
        replacementStore.createIndex('text', 'text', { unique: false });
        replacementStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      console.log("Database initialized successfully");
      resolve(true);
    };
  });
};

// Add an item to a specific store
const addToStore = (storeName, text) => {
  return new Promise((resolve, reject) => {
    if (!text || typeof text !== 'string') {
      resolve(false);
      return;
    }
    
    // Normalize text for consistent comparison
    const normalizedText = text.trim().toLowerCase();
    
    const request = indexedDB.open(DB_NAME);
    
    request.onerror = (event) => {
      console.error(`Error opening database to add to ${storeName}:`, event.target.error);
      reject(event.target.error);
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      // First check if this item already exists
      const textIndex = store.index('text');
      const getRequest = textIndex.getAll(normalizedText);
      
      getRequest.onsuccess = () => {
        // If the item already exists, we don't need to add it again
        if (getRequest.result && getRequest.result.length > 0) {
          resolve(false);
          return;
        }
        
        // Add the new item
        const addRequest = store.add({
          text: normalizedText,
          timestamp: Date.now()
        });
        
        addRequest.onsuccess = () => {
          // Now check if we need to remove old items to stay under MAX_HISTORY_SIZE
          const countRequest = store.count();
          
          countRequest.onsuccess = () => {
            const count = countRequest.result;
            
            if (count > MAX_HISTORY_SIZE) {
              // We need to remove the oldest items
              const itemsToRemove = count - MAX_HISTORY_SIZE;
              
              // Get the oldest items by timestamp
              const timestampIndex = store.index('timestamp');
              const cursorRequest = timestampIndex.openCursor();
              let removedCount = 0;
              
              cursorRequest.onsuccess = (event) => {
                const cursor = event.target.result;
                
                if (cursor && removedCount < itemsToRemove) {
                  // Delete this item
                  const deleteRequest = store.delete(cursor.primaryKey);
                  deleteRequest.onsuccess = () => {
                    removedCount++;
                  };
                  
                  cursor.continue();
                }
              };
            }
          };
          
          resolve(true);
        };
        
        addRequest.onerror = (event) => {
          console.error(`Error adding item to ${storeName}:`, event.target.error);
          reject(event.target.error);
        };
      };
    };
  });
};

// Check if an item exists in a specific store
const checkInStore = (storeName, text) => {
  return new Promise((resolve, reject) => {
    if (!text || typeof text !== 'string') {
      resolve(false);
      return;
    }
    
    // Normalize text for consistent comparison
    const normalizedText = text.trim().toLowerCase();
    
    const request = indexedDB.open(DB_NAME);
    
    request.onerror = (event) => {
      console.error(`Error opening database to check in ${storeName}:`, event.target.error);
      reject(event.target.error);
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      
      // Use the text index to find matching items
      const index = store.index('text');
      const getRequest = index.getAll(normalizedText);
      
      getRequest.onsuccess = () => {
        // If we found any matches, the item exists
        resolve(getRequest.result && getRequest.result.length > 0);
      };
      
      getRequest.onerror = (event) => {
        console.error(`Error checking item in ${storeName}:`, event.target.error);
        reject(event.target.error);
      };
    };
  });
};

// Public API for activities
export const addActivity = (activityText) => {
  return addToStore(ACTIVITY_STORE, activityText);
};

export const checkActivityExists = (activityText) => {
  return checkInStore(ACTIVITY_STORE, activityText);
};

// Public API for components
export const addComponent = (componentText) => {
  return addToStore(COMPONENT_STORE, componentText);
};

export const checkComponentExists = (componentText) => {
  return checkInStore(COMPONENT_STORE, componentText);
};

// Public API for replacements
export const addReplacement = (replacementText) => {
  return addToStore(REPLACEMENT_STORE, replacementText);
};

export const checkReplacementExists = (replacementText) => {
  return checkInStore(REPLACEMENT_STORE, replacementText);
};

// Add multiple items at once
export const addMultipleComponents = async (components) => {
  if (!components || !Array.isArray(components)) return;
  
  for (const component of components) {
    await addComponent(component);
  }
};

export const addMultipleReplacements = async (replacements) => {
  if (!replacements || !Array.isArray(replacements)) return;
  
  for (const replacement of replacements) {
    if (typeof replacement === 'object' && replacement.replacement) {
      await addReplacement(replacement.replacement);
    } else if (typeof replacement === 'string') {
      await addReplacement(replacement);
    }
  }
};

// Get database statistics
export const getRepetitionPreventionStats = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    
    request.onerror = (event) => {
      console.error("Error opening database for stats:", event.target.error);
      reject(event.target.error);
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const stats = {
        activities: 0,
        components: 0,
        replacements: 0
      };
      
      // Get activity count
      const activityTransaction = db.transaction([ACTIVITY_STORE], 'readonly');
      const activityStore = activityTransaction.objectStore(ACTIVITY_STORE);
      const activityCountRequest = activityStore.count();
      
      activityCountRequest.onsuccess = () => {
        stats.activities = activityCountRequest.result;
        
        // Get component count
        const componentTransaction = db.transaction([COMPONENT_STORE], 'readonly');
        const componentStore = componentTransaction.objectStore(COMPONENT_STORE);
        const componentCountRequest = componentStore.count();
        
        componentCountRequest.onsuccess = () => {
          stats.components = componentCountRequest.result;
          
          // Get replacement count
          const replacementTransaction = db.transaction([REPLACEMENT_STORE], 'readonly');
          const replacementStore = replacementTransaction.objectStore(REPLACEMENT_STORE);
          const replacementCountRequest = replacementStore.count();
          
          replacementCountRequest.onsuccess = () => {
            stats.replacements = replacementCountRequest.result;
            resolve(stats);
          };
        };
      };
    };
  });
};

// Clear all repetition prevention data (for testing or resetting)
export const clearRepetitionPreventionData = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    
    request.onerror = (event) => {
      console.error("Error opening database for clearing:", event.target.error);
      reject(event.target.error);
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      
      // Clear all stores
      const transaction = db.transaction([ACTIVITY_STORE, COMPONENT_STORE, REPLACEMENT_STORE], 'readwrite');
      
      const activityStore = transaction.objectStore(ACTIVITY_STORE);
      const componentStore = transaction.objectStore(COMPONENT_STORE);
      const replacementStore = transaction.objectStore(REPLACEMENT_STORE);
      
      activityStore.clear();
      componentStore.clear();
      replacementStore.clear();
      
      transaction.oncomplete = () => {
        console.log("All repetition prevention data cleared");
        resolve(true);
      };
      
      transaction.onerror = (event) => {
        console.error("Error clearing repetition prevention data:", event.target.error);
        reject(event.target.error);
      };
    };
  });
};

// Fallback mechanism for browsers that don't support IndexedDB
// This uses localStorage with a limited history
const FALLBACK_PREFIX = 'thingsGenerator_';
const FALLBACK_ACTIVITY_KEY = `${FALLBACK_PREFIX}activities`;
const FALLBACK_COMPONENT_KEY = `${FALLBACK_PREFIX}components`;
const FALLBACK_REPLACEMENT_KEY = `${FALLBACK_PREFIX}replacements`;
const FALLBACK_MAX_SIZE = 1000; // Smaller size for localStorage to avoid exceeding limits

// Initialize fallback storage
export const initializeFallbackStorage = () => {
  try {
    // Initialize each storage area if it doesn't exist
    if (!localStorage.getItem(FALLBACK_ACTIVITY_KEY)) {
      localStorage.setItem(FALLBACK_ACTIVITY_KEY, JSON.stringify([]));
    }
    
    if (!localStorage.getItem(FALLBACK_COMPONENT_KEY)) {
      localStorage.setItem(FALLBACK_COMPONENT_KEY, JSON.stringify([]));
    }
    
    if (!localStorage.getItem(FALLBACK_REPLACEMENT_KEY)) {
      localStorage.setItem(FALLBACK_REPLACEMENT_KEY, JSON.stringify([]));
    }
    
    return true;
  } catch (error) {
    console.error("Error initializing fallback storage:", error);
    return false;
  }
};

// Add an item to fallback storage
const addToFallbackStorage = (key, text) => {
  try {
    if (!text || typeof text !== 'string') {
      return false;
    }
    
    // Normalize text
    const normalizedText = text.trim().toLowerCase();
    
    // Get current items
    const itemsJson = localStorage.getItem(key);
    let items = [];
    
    if (itemsJson) {
      items = JSON.parse(itemsJson);
    }
    
    // Check if item already exists
    if (items.includes(normalizedText)) {
      return false;
    }
    
    // Add new item
    items.push(normalizedText);
    
    // Trim if necessary
    if (items.length > FALLBACK_MAX_SIZE) {
      items = items.slice(items.length - FALLBACK_MAX_SIZE);
    }
    
    // Save back to storage
    localStorage.setItem(key, JSON.stringify(items));
    
    return true;
  } catch (error) {
    console.error(`Error adding to fallback storage (${key}):`, error);
    return false;
  }
};

// Check if an item exists in fallback storage
const checkInFallbackStorage = (key, text) => {
  try {
    if (!text || typeof text !== 'string') {
      return false;
    }
    
    // Normalize text
    const normalizedText = text.trim().toLowerCase();
    
    // Get current items
    const itemsJson = localStorage.getItem(key);
    let items = [];
    
    if (itemsJson) {
      items = JSON.parse(itemsJson);
    }
    
    // Check if item exists
    return items.includes(normalizedText);
  } catch (error) {
    console.error(`Error checking in fallback storage (${key}):`, error);
    return false;
  }
};

// Fallback API for activities
export const addActivityFallback = (activityText) => {
  return addToFallbackStorage(FALLBACK_ACTIVITY_KEY, activityText);
};

export const checkActivityExistsFallback = (activityText) => {
  return checkInFallbackStorage(FALLBACK_ACTIVITY_KEY, activityText);
};

// Fallback API for components
export const addComponentFallback = (componentText) => {
  return addToFallbackStorage(FALLBACK_COMPONENT_KEY, componentText);
};

export const checkComponentExistsFallback = (componentText) => {
  return checkInFallbackStorage(FALLBACK_COMPONENT_KEY, componentText);
};

// Fallback API for replacements
export const addReplacementFallback = (replacementText) => {
  return addToFallbackStorage(FALLBACK_REPLACEMENT_KEY, replacementText);
};

export const checkReplacementExistsFallback = (replacementText) => {
  return checkInFallbackStorage(FALLBACK_REPLACEMENT_KEY, replacementText);
};

// Get fallback storage statistics
export const getFallbackStorageStats = () => {
  try {
    const stats = {
      activities: 0,
      components: 0,
      replacements: 0
    };
    
    // Get activity count
    const activitiesJson = localStorage.getItem(FALLBACK_ACTIVITY_KEY);
    if (activitiesJson) {
      const activities = JSON.parse(activitiesJson);
      stats.activities = activities.length;
    }
    
    // Get component count
    const componentsJson = localStorage.getItem(FALLBACK_COMPONENT_KEY);
    if (componentsJson) {
      const components = JSON.parse(componentsJson);
      stats.components = components.length;
    }
    
    // Get replacement count
    const replacementsJson = localStorage.getItem(FALLBACK_REPLACEMENT_KEY);
    if (replacementsJson) {
      const replacements = JSON.parse(replacementsJson);
      stats.replacements = replacements.length;
    }
    
    return stats;
  } catch (error) {
    console.error("Error getting fallback storage stats:", error);
    return { activities: 0, components: 0, replacements: 0 };
  }
};

// Clear all fallback storage data
export const clearFallbackStorageData = () => {
  try {
    localStorage.removeItem(FALLBACK_ACTIVITY_KEY);
    localStorage.removeItem(FALLBACK_COMPONENT_KEY);
    localStorage.removeItem(FALLBACK_REPLACEMENT_KEY);
    
    // Reinitialize empty storage
    initializeFallbackStorage();
    
    return true;
  } catch (error) {
    console.error("Error clearing fallback storage data:", error);
    return false;
  }
};

// Unified API that tries IndexedDB first, then falls back to localStorage
let useIndexedDB = true;

// Initialize the repetition prevention system
export const initializeRepetitionPrevention = async () => {
  try {
    // Try to initialize IndexedDB
    const indexedDBInitialized = await initializeDatabase();
    useIndexedDB = indexedDBInitialized;
    
    // If IndexedDB failed, initialize fallback storage
    if (!indexedDBInitialized) {
      console.log("Using fallback localStorage for repetition prevention");
      initializeFallbackStorage();
    }
    
    return true;
  } catch (error) {
    console.error("Error initializing repetition prevention:", error);
    
    // Try fallback as a last resort
    console.log("Using fallback localStorage for repetition prevention");
    initializeFallbackStorage();
    useIndexedDB = false;
    
    return false;
  }
};

// Unified API functions
export const addActivityUnified = async (activityText) => {
  if (useIndexedDB) {
    try {
      return await addActivity(activityText);
    } catch (error) {
      console.error("Error with IndexedDB, falling back to localStorage:", error);
      useIndexedDB = false;
      return addActivityFallback(activityText);
    }
  } else {
    return addActivityFallback(activityText);
  }
};

export const checkActivityExistsUnified = async (activityText) => {
  if (useIndexedDB) {
    try {
      return await checkActivityExists(activityText);
    } catch (error) {
      console.error("Error with IndexedDB, falling back to localStorage:", error);
      useIndexedDB = false;
      return checkActivityExistsFallback(activityText);
    }
  } else {
    return checkActivityExistsFallback(activityText);
  }
};

export const addComponentUnified = async (componentText) => {
  if (useIndexedDB) {
    try {
      return await addComponent(componentText);
    } catch (error) {
      console.error("Error with IndexedDB, falling back to localStorage:", error);
      useIndexedDB = false;
      return addComponentFallback(componentText);
    }
  } else {
    return addComponentFallback(componentText);
  }
};

export const checkComponentExistsUnified = async (componentText) => {
  if (useIndexedDB) {
    try {
      return await checkComponentExists(componentText);
    } catch (error) {
      console.error("Error with IndexedDB, falling back to localStorage:", error);
      useIndexedDB = false;
      return checkComponentExistsFallback(componentText);
    }
  } else {
    return checkComponentExistsFallback(componentText);
  }
};

export const addReplacementUnified = async (replacementText) => {
  if (useIndexedDB) {
    try {
      return await addReplacement(replacementText);
    } catch (error) {
      console.error("Error with IndexedDB, falling back to localStorage:", error);
      useIndexedDB = false;
      return addReplacementFallback(replacementText);
    }
  } else {
    return addReplacementFallback(replacementText);
  }
};

export const checkReplacementExistsUnified = async (replacementText) => {
  if (useIndexedDB) {
    try {
      return await checkReplacementExists(replacementText);
    } catch (error) {
      console.error("Error with IndexedDB, falling back to localStorage:", error);
      useIndexedDB = false;
      return checkReplacementExistsFallback(replacementText);
    }
  } else {
    return checkReplacementExistsFallback(replacementText);
  }
};

export const getRepetitionPreventionStatsUnified = async () => {
  if (useIndexedDB) {
    try {
      return await getRepetitionPreventionStats();
    } catch (error) {
      console.error("Error with IndexedDB, falling back to localStorage:", error);
      useIndexedDB = false;
      return getFallbackStorageStats();
    }
  } else {
    return getFallbackStorageStats();
  }
};

export const clearRepetitionPreventionDataUnified = async () => {
  if (useIndexedDB) {
    try {
      return await clearRepetitionPreventionData();
    } catch (error) {
      console.error("Error with IndexedDB, falling back to localStorage:", error);
      useIndexedDB = false;
      return clearFallbackStorageData();
    }
  } else {
    return clearFallbackStorageData();
  }
};

// Add multiple items with unified API
export const addMultipleComponentsUnified = async (components) => {
  if (!components || !Array.isArray(components)) return;
  
  for (const component of components) {
    await addComponentUnified(component);
  }
};

export const addMultipleReplacementsUnified = async (replacements) => {
  if (!replacements || !Array.isArray(replacements)) return;
  
  for (const replacement of replacements) {
    if (typeof replacement === 'object' && replacement.replacement) {
      await addReplacementUnified(replacement.replacement);
    } else if (typeof replacement === 'string') {
      await addReplacementUnified(replacement);
    }
  }
};
