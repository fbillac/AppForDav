import React, { useState, useEffect } from 'react';
import Timer from './components/Timer';
import { generateStatement } from './utils/statementGenerator';
import { replaceWords } from './utils/wordReplacer';

function App() {
  const [originalStatement, setOriginalStatement] = useState(null);
  const [replacedStatement, setReplacedStatement] = useState('');
  const [wordPairs, setWordPairs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usedWords, setUsedWords] = useState(new Set());
  const [numToReplace, setNumToReplace] = useState(0); // 0 means auto (2-4)
  
  const generateNewThing = async () => {
    setIsLoading(true);
    try {
      // Generate a statement with only the number of components we want to replace
      const statement = await generateStatement(numToReplace);
      setOriginalStatement(statement);
      
      if (statement && statement.activityVerb) {
        const { replacedText, replacements } = await replaceWords(statement, usedWords, numToReplace);
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

  const handleNumReplaceChange = (e) => {
    setNumToReplace(parseInt(e.target.value, 10));
  };

  useEffect(() => {
    generateNewThing();
  }, []);

  return (
    <div className="app-container">
      <h1>The Things Generator</h1>
      
      <div className="statement-container">
        {isLoading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <p dangerouslySetInnerHTML={{ __html: replacedStatement }}></p>
        )}
      </div>
      
      {!isLoading && wordPairs && wordPairs.length > 0 && (
        <div className="word-replacements">
          <h3>Replacements:</h3>
          <ul>
            {wordPairs.map((pair, index) => (
              <li key={index} className="word-pair">
                <span className="original">{pair.original}</span> → 
                <span className="replacement">{pair.replacement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="controls">
        <div className="control-group">
          <div className="replacement-controls">
            <label htmlFor="numToReplace">Number of components to replace:</label>
            <select 
              id="numToReplace" 
              value={numToReplace} 
              onChange={handleNumReplaceChange}
              disabled={isLoading}
            >
              <option value="0">Auto (2-4)</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
        </div>
        
        <Timer />
        
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
