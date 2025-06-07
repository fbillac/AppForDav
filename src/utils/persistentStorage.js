// This module handles persistent storage of used words across sessions
// It uses localforage for reliable cross-browser storage with fallbacks

import localforage from 'localforage';
import { wordExists, addWord, initializeRegistry } from './globalWordRegistry';

// Constants
const STORAGE_KEY = 'thingsGenerator_usedWords';
const VERSION = 1;

// Initialize the storage
export const initializePersistentStorage = async () => {
  try {
    // Configure localforage
    localforage.config({
      name: 'ThingsGenerator',
      storeName: 'used_words',
      description: 'Persistent storage for used words in The Things Generator'
    });
    
    // Check if we need to migrate data from localStorage
    const shouldMigrate = !await localforage.getItem('migration_completed');
    
    if (shouldMigrate) {
      await migrateFromLocalStorage();
      await localforage.setItem('migration_completed', true);
    }
    
    // Initialize the registry first to ensure it's ready
    await initializeRegistry();
    
    // Load words from persistent storage into the registry
    await loadWordsIntoRegistry();
    
    console.log('Persistent storage initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing persistent storage:', error);
    return false;
  }
};

// Migrate data from localStorage to localforage
const migrateFromLocalStorage = async () => {
  try {
    // Check if we have any data in localStorage
    const usedWordsJson = localStorage.getItem('usedWords');
    if (usedWordsJson) {
      const usedWords = JSON.parse(usedWordsJson);
      
      if (Array.isArray(usedWords) && usedWords.length > 0) {
        console.log(`Migrating ${usedWords.length} words from localStorage to localforage`);
        
        // Get existing words from localforage
        const existingWords = await localforage.getItem(STORAGE_KEY) || [];
        
        // Merge the words, removing duplicates
        const mergedWords = [...new Set([...existingWords, ...usedWords])];
        
        // Save to localforage
        await localforage.setItem(STORAGE_KEY, mergedWords);
        
        console.log(`Migration complete. ${mergedWords.length} words now in persistent storage`);
      }
    }
  } catch (error) {
    console.error('Error migrating from localStorage:', error);
  }
};

// Load words from persistent storage into the registry
export const loadWordsIntoRegistry = async () => {
  try {
    // Get words from localforage
    const storedWords = await localforage.getItem(STORAGE_KEY) || [];
    
    if (storedWords.length > 0) {
      console.log(`Loading ${storedWords.length} words from persistent storage into registry`);
      
      // Add each word to the registry
      let addedCount = 0;
      for (const word of storedWords) {
        if (word && typeof word === 'string') {
          // Only add if it doesn't already exist
          if (!await wordExists(word)) {
            await addWord(word);
            addedCount++;
          }
        }
      }
      
      console.log(`Loaded ${addedCount} new words into registry from persistent storage`);
    } else {
      console.log('No words found in persistent storage');
    }
    
    return true;
  } catch (error) {
    console.error('Error loading words from persistent storage:', error);
    return false;
  }
};

// Save words to persistent storage
export const saveWordsToStorage = async (words) => {
  try {
    if (!words || (!Array.isArray(words) && !(words instanceof Set))) {
      return false;
    }
    
    // Convert to array if it's a Set
    const wordsArray = Array.isArray(words) ? words : Array.from(words);
    
    // Get existing words from storage
    const existingWords = await localforage.getItem(STORAGE_KEY) || [];
    
    // Merge the words, removing duplicates
    const mergedWords = [...new Set([...existingWords, ...wordsArray])];
    
    // Save to localforage
    await localforage.setItem(STORAGE_KEY, mergedWords);
    
    console.log(`Saved ${mergedWords.length} words to persistent storage`);
    return true;
  } catch (error) {
    console.error('Error saving words to persistent storage:', error);
    return false;
  }
};

// Add a single word to persistent storage
export const addWordToStorage = async (word) => {
  try {
    if (!word || typeof word !== 'string') {
      return false;
    }
    
    // Normalize the word
    const normalizedWord = word.trim().toLowerCase();
    
    // Get existing words from storage
    const existingWords = await localforage.getItem(STORAGE_KEY) || [];
    
    // Check if the word already exists
    if (existingWords.includes(normalizedWord)) {
      return false;
    }
    
    // Add the word
    existingWords.push(normalizedWord);
    
    // Save to localforage
    await localforage.setItem(STORAGE_KEY, existingWords);
    
    return true;
  } catch (error) {
    console.error('Error adding word to persistent storage:', error);
    return false;
  }
};

// Add multiple words to persistent storage
export const addMultipleWordsToStorage = async (words) => {
  try {
    if (!words || (!Array.isArray(words) && !(words instanceof Set))) {
      return false;
    }
    
    // Convert to array if it's a Set
    const wordsArray = Array.isArray(words) ? words : Array.from(words);
    
    // Get existing words from storage
    const existingWords = await localforage.getItem(STORAGE_KEY) || [];
    
    // Add new words
    let addedCount = 0;
    for (const word of wordsArray) {
      if (word && typeof word === 'string') {
        const normalizedWord = word.trim().toLowerCase();
        
        // Only add if it doesn't already exist
        if (!existingWords.includes(normalizedWord)) {
          existingWords.push(normalizedWord);
          addedCount++;
        }
      }
    }
    
    // Save to localforage
    await localforage.setItem(STORAGE_KEY, existingWords);
    
    console.log(`Added ${addedCount} new words to persistent storage`);
    return true;
  } catch (error) {
    console.error('Error adding multiple words to persistent storage:', error);
    return false;
  }
};

// Check if a word exists in persistent storage
export const wordExistsInStorage = async (word) => {
  try {
    if (!word || typeof word !== 'string') {
      return false;
    }
    
    // Normalize the word
    const normalizedWord = word.trim().toLowerCase();
    
    // Get existing words from storage
    const existingWords = await localforage.getItem(STORAGE_KEY) || [];
    
    // Check if the word exists
    return existingWords.includes(normalizedWord);
  } catch (error) {
    console.error('Error checking if word exists in persistent storage:', error);
    return false;
  }
};

// Get the count of words in persistent storage
export const getWordCountInStorage = async () => {
  try {
    const existingWords = await localforage.getItem(STORAGE_KEY) || [];
    return existingWords.length;
  } catch (error) {
    console.error('Error getting word count from persistent storage:', error);
    return 0;
  }
};

// Clear all words from persistent storage (for testing or resetting)
export const clearPersistentStorage = async () => {
  try {
    await localforage.removeItem(STORAGE_KEY);
    console.log('Persistent storage cleared');
    return true;
  } catch (error) {
    console.error('Error clearing persistent storage:', error);
    return false;
  }
};

// Get all words from persistent storage
export const getAllWordsFromStorage = async () => {
  try {
    const existingWords = await localforage.getItem(STORAGE_KEY) || [];
    return existingWords;
  } catch (error) {
    console.error('Error getting all words from persistent storage:', error);
    return [];
  }
};

// Export a function to get storage statistics
export const getPersistentStorageStats = async () => {
  try {
    const existingWords = await localforage.getItem(STORAGE_KEY) || [];
    
    // Count words by length
    const wordsByLength = {};
    for (const word of existingWords) {
      const length = word.length;
      wordsByLength[length] = (wordsByLength[length] || 0) + 1;
    }
    
    // Count words by first letter
    const wordsByFirstLetter = {};
    for (const word of existingWords) {
      if (word.length > 0) {
        const firstLetter = word[0].toLowerCase();
        wordsByFirstLetter[firstLetter] = (wordsByFirstLetter[firstLetter] || 0) + 1;
      }
    }
    
    return {
      totalWords: existingWords.length,
      wordsByLength,
      wordsByFirstLetter
    };
  } catch (error) {
    console.error('Error getting persistent storage stats:', error);
    return {
      totalWords: 0,
      wordsByLength: {},
      wordsByFirstLetter: {}
    };
  }
};
