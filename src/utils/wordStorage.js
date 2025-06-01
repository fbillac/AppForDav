// This module handles the storage and tracking of used words

// Initialize the used words storage
export const initializeUsedWordsStorage = () => {
  try {
    // Try to load used words from localStorage
    const storedWords = localStorage.getItem('usedWords');
    if (storedWords) {
      return new Set(JSON.parse(storedWords));
    }
    // If no stored words, return an empty Set
    return new Set();
  } catch (error) {
    console.error('Error initializing used words storage:', error);
    return new Set();
  }
};

// Add words to the used words set and persist to localStorage
export const addUsedWords = (words) => {
  try {
    // Get the current used words
    const storedWords = localStorage.getItem('usedWords');
    let usedWords = new Set();
    
    if (storedWords) {
      usedWords = new Set(JSON.parse(storedWords));
    }
    
    // Add the new words
    if (Array.isArray(words)) {
      words.forEach(word => usedWords.add(word));
    } else {
      usedWords.add(words);
    }
    
    // Persist to localStorage
    localStorage.setItem('usedWords', JSON.stringify([...usedWords]));
    
    return usedWords;
  } catch (error) {
    console.error('Error adding used words:', error);
    return new Set();
  }
};

// Get the count of used words
export const getUsedWordsCount = () => {
  try {
    const storedWords = localStorage.getItem('usedWords');
    if (storedWords) {
      return JSON.parse(storedWords).length;
    }
    return 0;
  } catch (error) {
    console.error('Error getting used words count:', error);
    return 0;
  }
};
