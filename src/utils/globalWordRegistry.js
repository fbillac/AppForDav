// This module implements a global word registry to absolutely prevent any word repetition
// It uses a combination of localStorage and IndexedDB for maximum reliability

// Constants
const DB_NAME = 'GlobalWordRegistryDB';
const DB_VERSION = 1;
const STORE_NAME = 'usedWords';
const FALLBACK_KEY = 'globalWordRegistry';

// Initialize the database
const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      console.log("IndexedDB not supported, using localStorage fallback");
      resolve(false);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error("Database error:", event.target.error);
      resolve(false);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'word' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      console.log("Global word registry database initialized successfully");
      resolve(true);
    };
  });
};

// Initialize the registry
let registryInitialized = false;
let useIndexedDB = true;
let memoryCache = new Set(); // In-memory cache for fastest checks

export const initializeRegistry = async () => {
  if (registryInitialized) return true;
  
  try {
    // Try to initialize IndexedDB
    useIndexedDB = await initializeDatabase();
    
    // If using IndexedDB, load words into memory cache
    if (useIndexedDB) {
      await loadWordsIntoMemory();
    } else {
      // Initialize localStorage fallback
      if (!localStorage.getItem(FALLBACK_KEY)) {
        localStorage.setItem(FALLBACK_KEY, JSON.stringify([]));
      }
      
      // Load from localStorage into memory
      const storedWords = JSON.parse(localStorage.getItem(FALLBACK_KEY) || '[]');
      memoryCache = new Set(storedWords.map(item => item.toLowerCase()));
    }
    
    registryInitialized = true;
    console.log(`Global word registry initialized with ${memoryCache.size} words`);
    return true;
  } catch (error) {
    console.error("Error initializing global word registry:", error);
    
    // Last resort: just use memory cache
    memoryCache = new Set();
    registryInitialized = true;
    return false;
  }
};

// Load all words from IndexedDB into memory for faster checks
const loadWordsIntoMemory = async () => {
  return new Promise((resolve, reject) => {
    if (!useIndexedDB) {
      resolve();
      return;
    }
    
    const request = indexedDB.open(DB_NAME);
    
    request.onerror = (event) => {
      console.error("Error opening database for loading words:", event.target.error);
      resolve();
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => {
        const words = getAllRequest.result;
        memoryCache = new Set(words.map(item => item.word.toLowerCase()));
        console.log(`Loaded ${memoryCache.size} words into memory cache`);
        resolve();
      };
      
      getAllRequest.onerror = (event) => {
        console.error("Error loading words into memory:", event.target.error);
        resolve();
      };
    };
  });
};

// Check if a word exists in the registry (using memory cache for speed)
export const wordExists = async (word) => {
  // Ensure registry is initialized before checking
  if (!registryInitialized) {
    console.log("Registry not initialized, initializing now...");
    await initializeRegistry();
  }
  
  if (!word || typeof word !== 'string') return false;
  
  // Normalize the word
  const normalizedWord = word.trim().toLowerCase();
  
  // First check memory cache (fastest)
  if (memoryCache.has(normalizedWord)) {
    return true;
  }
  
  // If not in memory cache, it's definitely not in the database
  return false;
};

// Add a word to the registry
export const addWord = async (word) => {
  // Ensure registry is initialized before adding
  if (!registryInitialized) {
    console.log("Registry not initialized, initializing now...");
    await initializeRegistry();
  }
  
  if (!word || typeof word !== 'string') return false;
  
  try {
    // Normalize the word
    const normalizedWord = word.trim().toLowerCase();
    
    // Check if already exists in memory cache
    if (memoryCache.has(normalizedWord)) {
      return false; // Word already exists
    }
    
    // Add to memory cache first
    memoryCache.add(normalizedWord);
    
    // Then add to persistent storage
    if (useIndexedDB) {
      await addWordToIndexedDB(normalizedWord);
    } else {
      await addWordToLocalStorage(normalizedWord);
    }
    
    return true;
  } catch (error) {
    console.error("Error adding word to registry:", error);
    return false;
  }
};

// Add multiple words at once
export const addWords = async (words) => {
  // Ensure registry is initialized before adding
  if (!registryInitialized) {
    console.log("Registry not initialized, initializing now...");
    await initializeRegistry();
  }
  
  if (!words || !Array.isArray(words)) return;
  
  const promises = [];
  
  for (const word of words) {
    if (word && typeof word === 'string') {
      promises.push(addWord(word));
    }
  }
  
  await Promise.all(promises);
};

// Add a word to IndexedDB
const addWordToIndexedDB = (word) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    
    request.onerror = (event) => {
      console.error("Error opening database to add word:", event.target.error);
      resolve(false);
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const addRequest = store.add({
        word: word,
        timestamp: Date.now()
      });
      
      addRequest.onsuccess = () => {
        resolve(true);
      };
      
      addRequest.onerror = (event) => {
        // If error is due to the word already existing, that's fine
        if (event.target.error.name === 'ConstraintError') {
          resolve(false);
        } else {
          console.error("Error adding word to IndexedDB:", event.target.error);
          resolve(false);
        }
      };
    };
  });
};

// Add a word to localStorage
const addWordToLocalStorage = (word) => {
  try {
    const storedData = JSON.parse(localStorage.getItem(FALLBACK_KEY) || '[]');
    
    // Check if word already exists
    if (storedData.some(w => w.toLowerCase() === word.toLowerCase())) {
      return false;
    }
    
    // Add the word
    storedData.push(word);
    
    // Save back to localStorage
    localStorage.setItem(FALLBACK_KEY, JSON.stringify(storedData));
    
    return true;
  } catch (error) {
    console.error("Error adding word to localStorage:", error);
    return false;
  }
};

// Get the count of words in the registry
export const getWordCount = () => {
  return memoryCache.size;
};

// Clear the registry (for testing purposes)
export const clearRegistry = async () => {
  try {
    // Clear memory cache
    memoryCache.clear();
    
    // Clear persistent storage
    if (useIndexedDB) {
      await clearIndexedDB();
    } else {
      localStorage.removeItem(FALLBACK_KEY);
      localStorage.setItem(FALLBACK_KEY, JSON.stringify([]));
    }
    
    return true;
  } catch (error) {
    console.error("Error clearing word registry:", error);
    return false;
  }
};

// Clear IndexedDB
const clearIndexedDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    
    request.onerror = (event) => {
      console.error("Error opening database for clearing:", event.target.error);
      resolve(false);
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const clearRequest = store.clear();
      
      clearRequest.onsuccess = () => {
        resolve(true);
      };
      
      clearRequest.onerror = (event) => {
        console.error("Error clearing IndexedDB:", event.target.error);
        resolve(false);
      };
    };
  });
};

// Generate a guaranteed unique word by adding a timestamp if needed
export const ensureUniqueWord = async (baseWord) => {
  // Ensure registry is initialized
  if (!registryInitialized) {
    console.log("Registry not initialized, initializing now...");
    await initializeRegistry();
  }
  
  if (!baseWord || typeof baseWord !== 'string') {
    return `unique_${Date.now()}`;
  }
  
  const normalizedWord = baseWord.trim().toLowerCase();
  
  // Check if the word already exists
  if (await wordExists(normalizedWord)) {
    // Generate a unique variant by adding a timestamp
    const timestamp = Date.now();
    const uniqueWord = `${baseWord}_${timestamp}`;
    
    // Add the unique word to the registry
    await addWord(uniqueWord);
    
    return uniqueWord;
  }
  
  // If the word doesn't exist, add it to the registry and return it
  await addWord(normalizedWord);
  return baseWord;
};
