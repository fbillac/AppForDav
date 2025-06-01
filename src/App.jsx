import React, { useState, useEffect } from 'react';
import Timer from './components/Timer';
import { generateStatement, ensureUniqueComponents } from './utils/statementGenerator';
import { replaceWords, getRandomReplacement } from './utils/wordReplacer';
import { getUniqueRandomComponent } from './utils/componentReplacer';

function App() {
  const [originalStatement, setOriginalStatement] = useState(null);
  const [replacedStatement, setReplacedStatement] = useState('');
  const [wordPairs, setWordPairs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usedWords, setUsedWords] = useState(new Set());
  const [isReplacingWord, setIsReplacingWord] = useState(false);
  const [isReplacingComponent, setIsReplacingComponent] = useState(false);
  const [componentCount, setComponentCount] = useState(3); // Default to 3 components
  const [darkMode, setDarkMode] = useState(false);
  
  const generateNewThing = async () => {
    setIsLoading(true);
    try {
      // Generate a statement with the selected number of components
      let statement = await generateStatement(componentCount);
      
      // Ensure all components are unique
      statement = ensureUniqueComponents(statement);
      
      setOriginalStatement(statement);
      
      if (statement && statement.activityVerb) {
        const { replacedText, replacements } = await replaceWords(statement, usedWords);
        setReplacedStatement(replacedText);
        setWordPairs(replacements);
        
        // Add new words to the used words set
        const newUsedWords = new Set(usedWords);
        if (replacements && replacements.length > 0) {
          replacements.forEach(pair => {
            if (pair && pair.replacement) {
              newUsedWords.add(pair.replacement.toLowerCase());
            }
          });
        }
        
        // Reset used words if we've reached 1000 unique words
        if (newUsedWords.size >= 1000) {
          setUsedWords(new Set());
        } else {
          setUsedWords(newUsedWords);
        }
      } else {
        console.error('Invalid statement format returned from generator');
        setReplacedStatement('Error generating statement. Please try again.');
        setWordPairs([]);
      }
    } catch (error) {
      console.error('Error generating statement:', error);
      setReplacedStatement('Error generating statement. Please try again.');
      setWordPairs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplaceWord = async (index) => {
    if (isLoading || isReplacingWord) return;
    
    setIsReplacingWord(true);
    
    try {
      // Get a new random replacement
      const newReplacement = getRandomReplacement(usedWords);
      
      // Update the word pair at the specified index
      const updatedWordPairs = [...wordPairs];
      updatedWordPairs[index] = {
        ...updatedWordPairs[index],
        replacement: newReplacement
      };
      
      setWordPairs(updatedWordPairs);
      
      // Add the new word to the used words set
      const newUsedWords = new Set(usedWords);
      newUsedWords.add(newReplacement.toLowerCase());
      setUsedWords(newUsedWords);
      
    } catch (error) {
      console.error('Error replacing word:', error);
    } finally {
      setIsReplacingWord(false);
    }
  };

  const handleReplaceComponent = async (index) => {
    if (isLoading || isReplacingComponent || !originalStatement) return;
    
    setIsReplacingComponent(true);
    
    try {
      // Get the current components to avoid duplicates
      const currentComponents = [...originalStatement.selectedComponents];
      
      // Get a new component that's logical for the activity and not already used
      const newComponent = getUniqueRandomComponent(
        originalStatement.activityVerb, 
        currentComponents
      );
      
      // Create a new statement object with the updated component
      const updatedComponents = [...currentComponents];
      updatedComponents[index] = newComponent;
      
      const updatedStatement = {
        ...originalStatement,
        selectedComponents: updatedComponents
      };
      
      setOriginalStatement(updatedStatement);
      
      // Generate new replacements for the updated statement
      const { replacedText, replacements } = await replaceWords(updatedStatement, usedWords);
      setReplacedStatement(replacedText);
      setWordPairs(replacements);
      
      // Update used words
      const newUsedWords = new Set(usedWords);
      if (replacements && replacements.length > 0) {
        replacements.forEach(pair => {
          if (pair && pair.replacement) {
            newUsedWords.add(pair.replacement.toLowerCase());
          }
        });
      }
      setUsedWords(newUsedWords);
      
    } catch (error) {
      console.error('Error replacing component:', error);
    } finally {
      setIsReplacingComponent(false);
    }
  };

  const handleComponentCountChange = (e) => {
    setComponentCount(parseInt(e.target.value, 10));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  useEffect(() => {
    generateNewThing();
    
    // Check for user's preferred color scheme
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDarkMode) {
      setDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="header-container">
        <h1>The Things Generator</h1>
        <button 
          className="theme-toggle-btn" 
          onClick={toggleDarkMode}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
      
      <div className="statement-container">
        {isLoading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        ) : (
          <p className="activity-text">{originalStatement?.activityVerb || ''}</p>
        )}
      </div>
      
      {!isLoading && wordPairs && wordPairs.length > 0 && (
        <div className="word-replacements">
          <h3>Replacements:</h3>
          <ul>
            {wordPairs.map((pair, index) => (
              <li key={`word-${index}`} className="word-pair">
                <div className="item-content">
                  <div className="pair-group">
                    <span className="original">{pair.original}</span>
                    <button 
                      className="replace-btn component-btn" 
                      onClick={() => handleReplaceComponent(index)}
                      disabled={isReplacingComponent}
                      title="Get new component"
                    >
                      ↻
                    </button>
                  </div>
                  <span className="arrow">→</span>
                  <div className="pair-group">
                    <span className="replacement">{pair.replacement}</span>
                    <button 
                      className="replace-btn" 
                      onClick={() => handleReplaceWord(index)}
                      disabled={isReplacingWord}
                      title="Get new replacement"
                    >
                      ↻
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="controls">
        <div className="control-group">
          <div className="component-count-controls">
            <label htmlFor="componentCount">Number of Components:</label>
            <div className="component-count-selector">
              <input 
                type="range" 
                id="componentCount" 
                min="2" 
                max="5" 
                value={componentCount} 
                onChange={handleComponentCountChange}
                disabled={isLoading}
              />
              <span className="component-count-value">{componentCount}</span>
            </div>
            <button 
              className="apply-count-btn" 
              onClick={generateNewThing}
              disabled={isLoading}
            >
              Apply
            </button>
          </div>
        </div>
        
        <Timer darkMode={darkMode} />
        
        <button 
          className="new-thing-btn" 
          onClick={generateNewThing}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'New Thing'}
        </button>
      </div>
    </div>
  );
}

export default App;
