import React, { useState, useEffect } from 'react';
import Timer from './components/Timer';
import { generateStatement } from './utils/statementGenerator';
import { replaceWords, getRandomReplacement } from './utils/wordReplacer';
import { simplifyStatement, simplifyReplacements } from './utils/simplifier';
import { getRandomComponent } from './utils/componentReplacer';

function App() {
  const [originalStatement, setOriginalStatement] = useState(null);
  const [replacedStatement, setReplacedStatement] = useState('');
  const [wordPairs, setWordPairs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSimplifying, setIsSimplifying] = useState(false);
  const [usedWords, setUsedWords] = useState(new Set());
  const [isReplacingWord, setIsReplacingWord] = useState(false);
  const [isReplacingComponent, setIsReplacingComponent] = useState(false);
  const [simplifyType, setSimplifyType] = useState('both'); // 'both', 'activity', or 'replacements'
  
  const generateNewThing = async () => {
    setIsLoading(true);
    try {
      // Generate a statement with a random number of components (2-4)
      const statement = await generateStatement(0); // 0 means auto (2-4)
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
    if (isLoading || isSimplifying || isReplacingWord) return;
    
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
    if (isLoading || isSimplifying || isReplacingComponent || !originalStatement) return;
    
    setIsReplacingComponent(true);
    
    try {
      // Get a new component that's logical for the activity
      const newComponent = getRandomComponent(originalStatement.activityVerb);
      
      // Create a new statement object with the updated component
      const updatedComponents = [...originalStatement.selectedComponents];
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

  const handleSimplifyTypeChange = (e) => {
    setSimplifyType(e.target.value);
  };

  const handleSimplify = async () => {
    if (isLoading || isSimplifying || !originalStatement) return;
    
    setIsSimplifying(true);
    
    try {
      if (simplifyType === 'both' || simplifyType === 'activity') {
        // Simplify the entire statement (activity and components)
        const simplifiedStatement = await simplifyStatement(originalStatement, usedWords);
        
        if (simplifiedStatement) {
          setOriginalStatement(simplifiedStatement);
          
          // Generate new replacements for the simplified components
          const { replacedText, replacements } = await replaceWords(simplifiedStatement, usedWords);
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
        }
      } else if (simplifyType === 'replacements') {
        // Only simplify the replacements, keep the original activity and components
        const simplifiedReplacements = await simplifyReplacements(wordPairs, usedWords);
        
        if (simplifiedReplacements && simplifiedReplacements.length > 0) {
          setWordPairs(simplifiedReplacements);
          
          // Update used words
          const newUsedWords = new Set(usedWords);
          simplifiedReplacements.forEach(pair => {
            if (pair && pair.replacement) {
              newUsedWords.add(pair.replacement.toLowerCase());
            }
          });
          setUsedWords(newUsedWords);
        }
      }
    } catch (error) {
      console.error('Error simplifying:', error);
    } finally {
      setIsSimplifying(false);
    }
  };

  useEffect(() => {
    generateNewThing();
  }, []);

  return (
    <div className="app-container">
      <h1>The Things Generator</h1>
      
      <div className="statement-container">
        {isLoading || isSimplifying ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>{isSimplifying ? 'Simplifying...' : 'Loading...'}</p>
          </div>
        ) : (
          <p className="activity-text">{originalStatement?.activityVerb || ''}</p>
        )}
      </div>
      
      {!isLoading && !isSimplifying && originalStatement && originalStatement.selectedComponents && (
        <div className="components-container">
          <h3>Components:</h3>
          <ul className="components-list">
            {originalStatement.selectedComponents.map((component, index) => (
              <li key={`component-${index}`} className="component-item">
                <span className="component-text">{component}</span>
                <button 
                  className="replace-btn" 
                  onClick={() => handleReplaceComponent(index)}
                  disabled={isReplacingComponent}
                  title="Get new component"
                >
                  ↻
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {!isLoading && !isSimplifying && wordPairs && wordPairs.length > 0 && (
        <div className="word-replacements">
          <h3>Replacements:</h3>
          <ul>
            {wordPairs.map((pair, index) => (
              <li key={index} className="word-pair">
                <span className="original">{pair.original}</span> → 
                <div className="replacement-wrapper">
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
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="controls">
        <div className="control-group">
          <div className="simplify-controls">
            <label htmlFor="simplifyType">Simplify:</label>
            <select 
              id="simplifyType" 
              value={simplifyType} 
              onChange={handleSimplifyTypeChange}
              disabled={isLoading || isSimplifying}
            >
              <option value="both">Both Activity & Replacements</option>
              <option value="activity">Activity Only</option>
              <option value="replacements">Replacements Only</option>
            </select>
            
            <button 
              className="simplify-btn" 
              onClick={handleSimplify}
              disabled={isLoading || isSimplifying || !originalStatement}
            >
              {isSimplifying ? 'Simplifying...' : 'Make It Simpler'}
            </button>
          </div>
        </div>
        
        <Timer />
        
        <button 
          className="new-thing-btn" 
          onClick={generateNewThing}
          disabled={isLoading || isSimplifying}
        >
          {isLoading ? 'Generating...' : 'New Thing'}
        </button>
      </div>
    </div>
  );
}

export default App;
