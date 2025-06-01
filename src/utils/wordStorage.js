// Utility for tracking used words across sessions

// Constants
const USED_WORDS_KEY = 'thingsGenerator_usedWords';
const MAX_WORDS_TO_TRACK = 1000;

// Initialize the used words storage
export const initializeUsedWordsStorage = () => {
  try {
    // Try to get existing used words from localStorage
    const storedWords = localStorage.getItem(USED_WORDS_KEY);
    
    if (!storedWords) {
      // If no stored words exist, initialize with an empty array
      localStorage.setItem(USED_WORDS_KEY, JSON.stringify([]));
      return new Set();
    }
    
    // Parse the stored words and return as a Set
    const parsedWords = JSON.parse(storedWords);
    return new Set(parsedWords);
  } catch (error) {
    console.error('Error initializing used words storage:', error);
    // Return empty Set if there's an error
    return new Set();
  }
};

// Add new words to the used words storage
export const addUsedWords = (words) => {
  try {
    // Get current used words
    const storedWords = localStorage.getItem(USED_WORDS_KEY);
    let usedWords = storedWords ? JSON.parse(storedWords) : [];
    
    // Add new words
    if (Array.isArray(words)) {
      usedWords = [...usedWords, ...words];
    } else if (words instanceof Set) {
      usedWords = [...usedWords, ...Array.from(words)];
    } else if (typeof words === 'string') {
      usedWords.push(words.toLowerCase());
    }
    
    // Remove duplicates
    usedWords = [...new Set(usedWords)];
    
    // If we've exceeded our limit, reset
    if (usedWords.length > MAX_WORDS_TO_TRACK) {
      usedWords = [];
    }
    
    // Save back to localStorage
    localStorage.setItem(USED_WORDS_KEY, JSON.stringify(usedWords));
    
    // Return the updated Set
    return new Set(usedWords);
  } catch (error) {
    console.error('Error adding used words:', error);
    return new Set();
  }
};

// Clear all used words
export const clearUsedWords = () => {
  try {
    localStorage.setItem(USED_WORDS_KEY, JSON.stringify([]));
    return new Set();
  } catch (error) {
    console.error('Error clearing used words:', error);
    return new Set();
  }
};

// Get the current count of used words
export const getUsedWordsCount = () => {
  try {
    const storedWords = localStorage.getItem(USED_WORDS_KEY);
    const usedWords = storedWords ? JSON.parse(storedWords) : [];
    return usedWords.length;
  } catch (error) {
    console.error('Error getting used words count:', error);
    return 0;
  }
};
