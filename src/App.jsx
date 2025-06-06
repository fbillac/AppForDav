import React, { useState, useEffect } from 'react';
import './App.css';
import { generateStatement } from './utils/statementGenerator';
import { replaceWords, replaceIndividualWord } from './utils/wordReplacer';
import { initializeUsedWordsStorage, addUsedWords } from './utils/wordStorage';
import { initializeRepetitionPrevention, getRepetitionPreventionStatsUnified } from './utils/repetitionPrevention';
import ApiKeyInput from './components/ApiKeyInput';
import Timer from './components/Timer';
import openAIService from './utils/openaiService';

function App() {
  const [statement, setStatement] = useState(null);
  const [replacedStatement, setReplacedStatement] = useState('');
  const [usedWords, setUsedWords] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [numComponents, setNumComponents] = useState(3);
  const [replacements, setReplacements] = useState([]);
  const [showSimplify, setShowSimplify] = useState(false);
  const [isSimplifying, setIsSimplifying] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showApiSection, setShowApiSection] = useState(false);
  const [isReplacingWord, setIsReplacingWord] = useState(false);
  const [replacingWordIndex, setReplacingWordIndex] = useState(null);
  const [isReplacingOriginal, setIsReplacingOriginal] = useState(false);
  const [noMoreOriginalWords, setNoMoreOriginalWords] = useState(false);
  const [noMoreReplacementWords, setNoMoreReplacementWords] = useState(false);
  const [repetitionStats, setRepetitionStats] = useState({ activities: 0, components: 0, replacements: 0 });

  // Initialize used words from storage and repetition prevention system
  useEffect(() => {
    const initializeApp = async () => {
      // Initialize used words from storage
      const storedWords = initializeUsedWordsStorage();
      setUsedWords(storedWords);
      
      // Initialize repetition prevention system
      await initializeRepetitionPrevention();
      
      // Get initial stats
      const stats = await getRepetitionPreventionStatsUnified();
      setRepetitionStats(stats);
      
      // Check if dark mode preference is stored
      const storedDarkMode = localStorage.getItem('darkMode');
      if (storedDarkMode) {
        setDarkMode(storedDarkMode === 'true');
      }
      
      // Check if API is connected
      const isApiConnected = openAIService.initialized;
      setShowApiSection(!isApiConnected);
    };
    
    initializeApp();
  }, []);

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Check if we've exhausted available words
  useEffect(() => {
    if (statement && usedWords.size > 0) {
      checkAvailableWords();
    }
  }, [statement, usedWords]);

  // Update repetition prevention stats periodically
  useEffect(() => {
    const updateStats = async () => {
      const stats = await getRepetitionPreventionStatsUnified();
      setRepetitionStats(stats);
    };
    
    // Update stats when component mounts
    updateStats();
    
    // Set up interval to update stats every 30 seconds
    const interval = setInterval(updateStats, 30000);
    
    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []);

  // Helper function to check if a word already exists in components
  const isWordDuplicate = (word, components, indexToIgnore = -1) => {
    if (!word) return false;
    
    const lowerWord = word.toLowerCase();
    return components.some((component, index) => 
      index !== indexToIgnore && 
      component && 
      component.toLowerCase() === lowerWord
    );
  };

  // Check if we've exhausted available words
  const checkAvailableWords = async () => {
    if (!statement) return;
    
    try {
      // Import the necessary function to check available components
      const { determineActivityType, activityComponentMap } = await import('./utils/componentReplacer');
      
      // Determine the activity type
      const activityType = determineActivityType(statement.activityVerb);
      
      // Get all possible components for this activity type
      const allComponents = activityComponentMap[activityType] || activityComponentMap["default"];
      
      // Convert usedWords to lowercase for case-insensitive comparison
      const usedWordsLower = Array.from(usedWords).map(word => word.toLowerCase());
      
      // Filter out components that have already been used
      const availableComponents = allComponents.filter(component => 
        !usedWordsLower.includes(component.toLowerCase())
      );
      
      // Check if we have any available components left
      setNoMoreOriginalWords(availableComponents.length === 0);
      
      // Check if we have any available replacement words left
      const { unrelatedObjects, unrelatedCharacters } = await import('./utils/wordReplacer');
      
      // Combine all possible replacement words
      const allReplacements = [...unrelatedObjects, ...unrelatedCharacters];
      
      // Filter out replacements that have already been used
      const availableReplacements = allReplacements.filter(word => 
        !usedWordsLower.includes(word.toLowerCase())
      );
      
      // Check if we have any available replacements left
      setNoMoreReplacementWords(availableReplacements.length === 0);
    } catch (error) {
      console.error("Error checking available words:", error);
    }
  };

  // Generate a new statement with replacements
  const handleGenerateStatement = async () => {
    setIsLoading(true);
    setReplacedStatement('');
    setReplacements([]);
    
    try {
      // Step 1: Generate the statement
      const newStatement = await generateStatement(numComponents, usedWords);
      
      // Ensure no duplicate components in the generated statement
      const uniqueComponents = [...new Set(newStatement.selectedComponents)];
      
      // If we lost any components due to duplicates, generate new ones
      if (uniqueComponents.length < newStatement.selectedComponents.length) {
        console.log("Detected duplicate components in generation, fixing...");
        
        // Keep track of components we've seen
        const seenComponents = new Set();
        const finalComponents = [];
        
        for (const component of newStatement.selectedComponents) {
          if (!seenComponents.has(component.toLowerCase())) {
            seenComponents.add(component.toLowerCase());
            finalComponents.push(component);
          } else {
            // Generate a replacement for the duplicate
            let newComponent;
            let attempts = 0;
            const maxAttempts = 5;
            
            do {
              newComponent = await replaceIndividualWord(component, newStatement.activityVerb, usedWords, true);
              attempts++;
            } while (
              seenComponents.has(newComponent.toLowerCase()) && 
              attempts < maxAttempts
            );
            
            // Add the new component
            seenComponents.add(newComponent.toLowerCase());
            finalComponents.push(newComponent);
          }
        }
        
        // Update the statement with unique components
        newStatement.selectedComponents = finalComponents;
      }
      
      setStatement(newStatement);
      
      // Add the activity words to used words
      const activityWords = newStatement.activityVerb.split(/\s+/);
      const updatedUsedWords = addUsedWords(activityWords);
      setUsedWords(updatedUsedWords);
      
      // Show the simplify button if the activity has more than 2 components
      setShowSimplify(newStatement.selectedComponents.length > 2);
      
      // Reset the no more words flags
      setNoMoreOriginalWords(false);
      setNoMoreReplacementWords(false);
      
      // Step 2: Generate replacements automatically
      await generateReplacements(newStatement);
      
      // Check if we've exhausted available words
      checkAvailableWords();
      
      // Update repetition prevention stats
      const stats = await getRepetitionPreventionStatsUnified();
      setRepetitionStats(stats);
    } catch (error) {
      console.error('Error generating statement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate replacements for a statement
  const generateReplacements = async (statementToReplace) => {
    if (!statementToReplace) return;
    
    try {
      const result = await replaceWords(statementToReplace, usedWords);
      
      // Check for duplicate replacements
      const seenReplacements = new Set();
      const uniqueReplacements = [];
      
      for (const replacement of result.replacements) {
        if (!seenReplacements.has(replacement.replacement.toLowerCase())) {
          seenReplacements.add(replacement.replacement.toLowerCase());
          uniqueReplacements.push(replacement);
        } else {
          // Generate a new unique replacement
          let newReplacement;
          let attempts = 0;
          const maxAttempts = 5;
          
          do {
            newReplacement = await replaceIndividualWord(
              replacement.original, 
              statementToReplace.activityVerb, 
              usedWords,
              false
            );
            attempts++;
          } while (
            seenReplacements.has(newReplacement.toLowerCase()) && 
            attempts < maxAttempts
          );
          
          seenReplacements.add(newReplacement.toLowerCase());
          uniqueReplacements.push({
            original: replacement.original,
            replacement: newReplacement
          });
        }
      }
      
      // Recreate the replaced text with unique replacements
      let replacedText = statementToReplace.activityVerb;
      
      // Replace each component in the activity text if it appears
      uniqueReplacements.forEach(replacement => {
        // Create a regex that matches the whole word only
        if (replacement.original && typeof replacement.original === 'string') {
          const regex = new RegExp(`\\b${replacement.original}\\b`, 'gi');
          replacedText = replacedText.replace(regex, replacement.replacement);
        }
      });
      
      setReplacedStatement(replacedText);
      setReplacements(uniqueReplacements);
      
      // Add the replacement words to used words
      const replacementWords = uniqueReplacements.map(r => r.replacement);
      const updatedUsedWords = addUsedWords(replacementWords);
      setUsedWords(updatedUsedWords);
      
      // Also add the original components to used words
      const componentWords = statementToReplace.selectedComponents;
      addUsedWords(componentWords);
      
      // Update repetition prevention stats
      const stats = await getRepetitionPreventionStatsUnified();
      setRepetitionStats(stats);
    } catch (error) {
      console.error('Error generating replacements:', error);
    }
  };

  // Handle component count change
  const handleComponentCountChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setNumComponents(count);
  };

  // Simplify the activity
  const handleSimplifyActivity = async () => {
    if (!statement) return;
    
    setIsSimplifying(true);
    
    try {
      // Check if OpenAI is initialized
      if (!openAIService.initialized) {
        alert('OpenAI API is not connected. Please connect your API key first.');
        setIsSimplifying(false);
        return;
      }
      
      // Simplify the activity
      const simplifiedActivity = await openAIService.simplifyActivity(statement);
      
      // Ensure no duplicate components in the simplified activity
      const uniqueComponents = [...new Set(simplifiedActivity.selectedComponents)];
      
      // If we lost any components due to duplicates, generate new ones
      if (uniqueComponents.length < simplifiedActivity.selectedComponents.length) {
        console.log("Detected duplicate components in simplification, fixing...");
        
        // Keep track of components we've seen
        const seenComponents = new Set();
        const finalComponents = [];
        
        for (const component of simplifiedActivity.selectedComponents) {
          if (!seenComponents.has(component.toLowerCase())) {
            seenComponents.add(component.toLowerCase());
            finalComponents.push(component);
          } else {
            // Generate a replacement for the duplicate
            let newComponent;
            let attempts = 0;
            const maxAttempts = 5;
            
            do {
              newComponent = await replaceIndividualWord(component, simplifiedActivity.activityVerb, usedWords, true);
              attempts++;
            } while (
              seenComponents.has(newComponent.toLowerCase()) && 
              attempts < maxAttempts
            );
            
            // Add the new component
            seenComponents.add(newComponent.toLowerCase());
            finalComponents.push(newComponent);
          }
        }
        
        // Update the statement with unique components
        simplifiedActivity.selectedComponents = finalComponents;
      }
      
      // Update the statement
      setStatement(simplifiedActivity);
      
      // Reset the replaced statement and replacements
      setReplacedStatement('');
      setReplacements([]);
      
      // Hide the simplify button
      setShowSimplify(false);
      
      // Generate new replacements for the simplified activity
      await generateReplacements(simplifiedActivity);
      
      // Check if we've exhausted available words
      checkAvailableWords();
      
      // Update repetition prevention stats
      const stats = await getRepetitionPreventionStatsUnified();
      setRepetitionStats(stats);
    } catch (error) {
      console.error('Error simplifying activity:', error);
    } finally {
      setIsSimplifying(false);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Toggle API section visibility
  const handleApiConnectionChange = (isConnected) => {
    setShowApiSection(!isConnected);
  };

  // Helper function to replace a word in a string with proper word boundaries
  const replaceWordInString = (text, oldWord, newWord) => {
    if (!text || !oldWord || !newWord) return text;
    
    // Create a regex that matches the whole word only with word boundaries
    const regex = new RegExp(`\\b${oldWord}\\b`, 'gi');
    return text.replace(regex, newWord);
  };

  // Handle replacing an individual original component
  const handleReplaceOriginalWord = async (index) => {
    if (!statement || isReplacingWord || noMoreOriginalWords) return;
    
    setIsReplacingWord(true);
    setReplacingWordIndex(index);
    setIsReplacingOriginal(true);
    
    try {
      const originalWord = statement.selectedComponents[index];
      const activityVerb = statement.activityVerb;
      
      // Get current components excluding the one being replaced
      const currentComponents = statement.selectedComponents.filter((_, i) => i !== index);
      
      // Generate a new word that isn't a duplicate of existing components
      let newWord;
      let attempts = 0;
      const maxAttempts = 5;
      
      do {
        newWord = await replaceIndividualWord(originalWord, activityVerb, usedWords, true);
        attempts++;
        
        // If we've tried too many times, add a number to make it unique
        if (attempts >= maxAttempts && isWordDuplicate(newWord, currentComponents)) {
          newWord = `${newWord} ${Math.floor(Math.random() * 100) + 1}`;
        }
      } while (
        isWordDuplicate(newWord, currentComponents) && 
        attempts < maxAttempts
      );
      
      // Update the statement with the new component
      const updatedComponents = [...statement.selectedComponents];
      updatedComponents[index] = newWord;
      
      // Update the activity verb by replacing the original word with the new word
      // Only replace whole words with word boundaries to avoid partial replacements
      let updatedActivityVerb = replaceWordInString(activityVerb, originalWord, newWord);
      
      // Create a new statement object to ensure state update
      const updatedStatement = {
        ...statement,
        selectedComponents: updatedComponents,
        activityVerb: updatedActivityVerb
      };
      
      // Update the statement state with the new object
      setStatement(updatedStatement);
      
      // Add the new word to used words
      const updatedUsedWords = addUsedWords([newWord]);
      setUsedWords(updatedUsedWords);
      
      // If we have replacements, update them too if they reference the original word
      if (replacements.length > 0) {
        const updatedReplacements = replacements.map(r => {
          if (r.original === originalWord) {
            return { ...r, original: newWord };
          }
          return r;
        });
        
        // Update the replaced statement if it exists
        if (replacedStatement) {
          // Only replace whole words with word boundaries
          let updatedReplacedStatement = replaceWordInString(replacedStatement, originalWord, newWord);
          setReplacedStatement(updatedReplacedStatement);
        }
        
        setReplacements(updatedReplacements);
      }
      
      // Check if we've exhausted available words
      checkAvailableWords();
      
      // Update repetition prevention stats
      const stats = await getRepetitionPreventionStatsUnified();
      setRepetitionStats(stats);
    } catch (error) {
      console.error('Error replacing original word:', error);
    } finally {
      setIsReplacingWord(false);
      setReplacingWordIndex(null);
      setIsReplacingOriginal(false);
    }
  };

  // Handle replacing an individual replacement word
  const handleReplaceReplacementWord = async (index) => {
    if (!statement || !replacements.length || isReplacingWord || noMoreReplacementWords) return;
    
    setIsReplacingWord(true);
    setReplacingWordIndex(index);
    setIsReplacingOriginal(false);
    
    try {
      const originalWord = replacements[index].original;
      const currentReplacement = replacements[index].replacement;
      
      // Get current replacements excluding the one being replaced
      const currentReplacements = replacements
        .filter((_, i) => i !== index)
        .map(r => r.replacement);
      
      // Generate a new replacement that isn't a duplicate
      let newReplacement;
      let attempts = 0;
      const maxAttempts = 5;
      
      do {
        newReplacement = await replaceIndividualWord(originalWord, statement.activityVerb, usedWords, false);
        attempts++;
        
        // If we've tried too many times, add a number to make it unique
        if (attempts >= maxAttempts && currentReplacements.includes(newReplacement)) {
          newReplacement = `${newReplacement} ${Math.floor(Math.random() * 100) + 1}`;
        }
      } while (
        currentReplacements.includes(newReplacement) && 
        attempts < maxAttempts
      );
      
      // Update the replacements array
      const updatedReplacements = [...replacements];
      updatedReplacements[index] = {
        original: originalWord,
        replacement: newReplacement
      };
      
      setReplacements(updatedReplacements);
      
      // Update the replaced statement
      if (replacedStatement) {
        // Only replace whole words with word boundaries
        let updatedReplacedStatement = replaceWordInString(replacedStatement, currentReplacement, newReplacement);
        setReplacedStatement(updatedReplacedStatement);
      }
      
      // Add the new word to used words
      const updatedUsedWords = addUsedWords([newReplacement]);
      setUsedWords(updatedUsedWords);
      
      // Check if we've exhausted available words
      checkAvailableWords();
      
      // Update repetition prevention stats
      const stats = await getRepetitionPreventionStatsUnified();
      setRepetitionStats(stats);
    } catch (error) {
      console.error('Error replacing replacement word:', error);
    } finally {
      setIsReplacingWord(false);
      setReplacingWordIndex(null);
      setIsReplacingOriginal(false);
    }
  };

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">The Things Generator</h1>
          <div className="header-controls">
            <button 
              className="theme-toggle"
              onClick={toggleDarkMode}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            {showApiSection && (
              <div className="api-key-section">
                <ApiKeyInput onConnectionChange={handleApiConnectionChange} />
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="app-main">
        <div className="controls-section">
          <div className="component-count">
            <label htmlFor="componentCount">Components:</label>
            <select 
              id="componentCount" 
              value={numComponents} 
              onChange={handleComponentCountChange}
              disabled={isLoading}
            >
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          
          <div className="main-buttons">
            <button 
              className="generate-button"
              onClick={handleGenerateStatement}
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'New Thing'}
            </button>
            
            {statement && showSimplify && (
              <button 
                className="simplify-button"
                onClick={handleSimplifyActivity}
                disabled={isSimplifying || isLoading}
              >
                {isSimplifying ? 'Simplifying...' : 'Simplify'}
              </button>
            )}
          </div>
        </div>
        
        <div className="content-container">
          <div className="unified-panel">
            {statement && (
              <div className="content-panel">
                <div className="activity-section">
                  <h2>Activity:</h2>
                  <p className="activity-text">{statement.activityVerb}</p>
                </div>
                
                <div className="components-section">
                  <h3>Components:</h3>
                  <div className="components-container">
                    {statement.selectedComponents.map((component, index) => (
                      <div key={`component-${index}-${component}`} className="component-item">
                        <div className="component-button">
                          {component}
                        </div>
                        <button 
                          className={`replace-word-button ${noMoreOriginalWords ? 'disabled' : ''}`}
                          onClick={() => handleReplaceOriginalWord(index)}
                          disabled={isReplacingWord || noMoreOriginalWords}
                          title={noMoreOriginalWords ? "No more words available" : "Replace this component"}
                        >
                          {isReplacingWord && isReplacingOriginal && replacingWordIndex === index ? (
                            <span className="loading-spinner">↻</span>
                          ) : (
                            <span>↻</span>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                  {noMoreOriginalWords && (
                    <p className="no-more-words-message">No more component words available.</p>
                  )}
                </div>
                
                {replacedStatement && (
                  <div className="replacement-section">
                    <p>{replacedStatement}</p>
                    
                    {replacements.length > 0 && (
                      <div className="replacements-list">
                        <h4>Replacements:</h4>
                        <ul>
                          {replacements.map((replacement, index) => (
                            <li key={`replacement-${index}-${replacement.replacement}`} className="replacement-item">
                              <div className="replacement-text-container">
                                <span className="original">{replacement.original}</span> → 
                                <span className="replacement">{replacement.replacement}</span>
                              </div>
                              <button 
                                className={`replace-word-button ${noMoreReplacementWords ? 'disabled' : ''}`}
                                onClick={() => handleReplaceReplacementWord(index)}
                                disabled={isReplacingWord || noMoreReplacementWords}
                                title={noMoreReplacementWords ? "No more replacement words available" : "Replace this word"}
                              >
                                {isReplacingWord && !isReplacingOriginal && replacingWordIndex === index ? (
                                  <span className="loading-spinner">↻</span>
                                ) : (
                                  <span>↻</span>
                                )}
                              </button>
                            </li>
                          ))}
                        </ul>
                        {noMoreReplacementWords && (
                          <p className="no-more-words-message">No more replacement words available.</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {!statement && (
              <div className="empty-state">
                <p>Click "New Thing" to generate an activity.</p>
              </div>
            )}
          </div>
          
          <div className="timer-container">
            <Timer darkMode={darkMode} />
            <div className="repetition-stats">
              <h4>Repetition Prevention</h4>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Activities:</span>
                  <span className="stat-value">{repetitionStats.activities}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Components:</span>
                  <span className="stat-value">{repetitionStats.components}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Replacements:</span>
                  <span className="stat-value">{repetitionStats.replacements}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="app-footer">
        <p>Used words: {usedWords.size}</p>
        {!showApiSection && (
          <button 
            className="api-settings-button"
            onClick={() => setShowApiSection(true)}
          >
            API Settings
          </button>
        )}
      </footer>
    </div>
  );
}

export default App;
