import React, { useState, useEffect } from 'react';
import './App.css';
import ApiKeyInput from './components/ApiKeyInput';
import { replaceWords, replaceIndividualWord } from './utils/wordReplacer';
import openAIService from './utils/openaiService';
import { initializeRegistry } from './utils/globalWordRegistry';
import { initializeRepetitionPrevention } from './utils/repetitionPrevention';
import { generateStatement } from './utils/statementGenerator';
import DeveloperMode from './components/DeveloperMode';
import Timer from './components/Timer';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statement, setStatement] = useState(null);
  const [replacements, setReplacements] = useState([]);
  const [usedWords, setUsedWords] = useState(new Set());
  const [apiStatus, setApiStatus] = useState({
    status: 'disconnected',
    error: null
  });
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [registryInitialized, setRegistryInitialized] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [numComponents, setNumComponents] = useState(3); // Default to 3 components
  const [developerMode, setDeveloperMode] = useState(false);
  const [uiConfig, setUiConfig] = useState(null);
  const [adminMode, setAdminMode] = useState(false);

  // Initialize the word registry and repetition prevention system
  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize registry first
        await initializeRegistry();
        console.log("Word registry initialized");
        setRegistryInitialized(true);
        
        // Then initialize repetition prevention
        await initializeRepetitionPrevention();
        console.log("Repetition prevention initialized");
      } catch (error) {
        console.error("Error initializing word registry:", error);
        setError("Failed to initialize word registry. Please refresh the page.");
      }
    };
    
    initialize();
    
    // Check API status periodically
    const checkApiStatus = () => {
      if (openAIService.initialized) {
        const status = openAIService.getConnectionStatus();
        setApiStatus(status);
        setIsConnected(status.status === 'connected');
      } else {
        setApiStatus({
          status: 'disconnected',
          error: null
        });
        setIsConnected(false);
      }
    };
    
    // Initial check
    checkApiStatus();
    
    // Set up interval for periodic checks
    const intervalId = setInterval(checkApiStatus, 30000); // Check every 30 seconds
    
    // Check for user's preferred color scheme
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDarkMode);
    
    // Listen for changes in color scheme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setDarkMode(e.matches);
    };
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // For older browsers
      mediaQuery.addListener(handleChange);
    }
    
    // Load saved UI configuration if available
    const loadUiConfig = async () => {
      try {
        // Import localforage dynamically to avoid SSR issues
        const localforage = await import('localforage');
        const savedConfig = await localforage.default.getItem('uiConfig');
        if (savedConfig) {
          setUiConfig(savedConfig);
          // Apply dark mode setting from saved config if available
          if (savedConfig.darkMode !== undefined) {
            setDarkMode(savedConfig.darkMode);
          }
          console.log("Loaded UI configuration:", savedConfig);
        }
      } catch (error) {
        console.error("Error loading UI configuration:", error);
      }
    };
    
    loadUiConfig();
    
    // Check for admin mode in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('admin') && urlParams.get('admin') === 'true') {
      setAdminMode(true);
    }
    
    return () => {
      clearInterval(intervalId);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // For older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [darkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Toggle developer mode
  const toggleDeveloperMode = () => {
    setDeveloperMode(!developerMode);
  };

  // Toggle admin mode
  const toggleAdminMode = () => {
    setAdminMode(!adminMode);
    
    // Update URL to reflect admin mode state
    const url = new URL(window.location);
    if (!adminMode) {
      url.searchParams.set('admin', 'true');
    } else {
      url.searchParams.delete('admin');
    }
    window.history.pushState({}, '', url);
  };

  // Handle API connection change
  const handleConnectionChange = (connected) => {
    setIsConnected(connected);
    
    // Update API status
    if (openAIService.initialized) {
      const status = openAIService.getConnectionStatus();
      setApiStatus(status);
    }
    
    // Hide API settings after successful connection
    if (connected) {
      setShowApiSettings(false);
    }
  };

  // Toggle API settings visibility
  const toggleApiSettings = () => {
    setShowApiSettings(!showApiSettings);
  };

  // Handle number of components change
  const handleNumComponentsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 5) {
      setNumComponents(value);
    }
  };

  // Save UI configuration
  const saveUiConfig = async (config) => {
    try {
      // Import localforage dynamically to avoid SSR issues
      const localforage = await import('localforage');
      await localforage.default.setItem('uiConfig', config);
      setUiConfig(config);
      
      // Apply dark mode setting from config
      if (config.darkMode !== undefined) {
        setDarkMode(config.darkMode);
      }
      
      console.log("Saved UI configuration:", config);
    } catch (error) {
      console.error("Error saving UI configuration:", error);
      setError("Failed to save UI configuration");
    }
  };

  // Generate a new activity and replacements simultaneously
  const generateActivityAndReplacements = async () => {
    if (!registryInitialized) {
      setError("Word registry is still initializing. Please wait a moment and try again.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if OpenAI is connected
      if (!isConnected) {
        setError("Please connect to the OpenAI API first");
        setShowApiSettings(true); // Show API settings if not connected
        setIsLoading(false);
        return;
      }
      
      // Use the statementGenerator to generate a new activity with the selected number of components
      // This ensures proper no-repeat handling
      const newStatement = await generateStatement(numComponents, usedWords);
      
      // Set the statement
      setStatement(newStatement);
      
      // Generate replacements for the new activity
      const result = await replaceWords(newStatement, usedWords);
      
      // Update replacements
      setReplacements(result.replacements);
      
      // Update used words
      const newUsedWords = new Set(usedWords);
      
      // Add activity to used words
      newUsedWords.add(newStatement.activityVerb.toLowerCase());
      
      // Add individual words from activity to prevent partial repeats
      const activityWords = newStatement.activityVerb.toLowerCase().split(/\s+/);
      for (const word of activityWords) {
        if (word.length > 3) { // Only add significant words
          newUsedWords.add(word);
        }
      }
      
      // Add components to used words
      for (const component of newStatement.selectedComponents) {
        newUsedWords.add(component.toLowerCase());
        
        // Add individual words to prevent partial repeats
        const componentWords = component.toLowerCase().split(/\s+/);
        for (const word of componentWords) {
          if (word.length > 3) { // Only add significant words
            newUsedWords.add(word);
          }
        }
      }
      
      // Add replacements to used words
      for (const replacement of result.replacements) {
        newUsedWords.add(replacement.replacement.toLowerCase());
        
        // Add individual words to prevent partial repeats
        const words = replacement.replacement.toLowerCase().split(/\s+/);
        for (const word of words) {
          if (word.length > 3) { // Only add significant words
            newUsedWords.add(word);
          }
        }
      }
      
      setUsedWords(newUsedWords);
      
      console.log("Generated new activity:", newStatement.activityVerb);
      console.log("Components:", newStatement.selectedComponents);
      console.log("Replacements:", result.replacements);
    } catch (error) {
      console.error("Error generating activity and replacements:", error);
      setError(`Error generating content: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate replacements for the current activity
  const generateReplacements = async () => {
    if (!registryInitialized) {
      setError("Word registry is still initializing. Please wait a moment and try again.");
      return;
    }
    
    if (!statement) {
      setError("Please generate an activity first");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if OpenAI is connected
      if (!isConnected) {
        setError("Please connect to the OpenAI API first");
        setShowApiSettings(true); // Show API settings if not connected
        setIsLoading(false);
        return;
      }
      
      // Generate replacements
      const result = await replaceWords(statement, usedWords);
      
      // Update replacements
      setReplacements(result.replacements);
      
      // Update used words
      const newUsedWords = new Set(usedWords);
      for (const replacement of result.replacements) {
        newUsedWords.add(replacement.replacement.toLowerCase());
        
        // Add individual words to prevent partial repeats
        const words = replacement.replacement.toLowerCase().split(/\s+/);
        for (const word of words) {
          if (word.length > 3) { // Only add significant words
            newUsedWords.add(word);
          }
        }
      }
      setUsedWords(newUsedWords);
    } catch (error) {
      console.error("Error generating replacements:", error);
      setError(`Error generating replacements: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Replace a single replacement
  const replaceReplacement = async (index) => {
    if (!registryInitialized) {
      setError("Word registry is still initializing. Please wait a moment and try again.");
      return;
    }
    
    if (!statement || replacements.length === 0) {
      setError("Please generate replacements first");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if OpenAI is connected
      if (!isConnected) {
        setError("Please connect to the OpenAI API first");
        setShowApiSettings(true); // Show API settings if not connected
        setIsLoading(false);
        return;
      }
      
      // Get the current replacement
      const currentReplacement = replacements[index];
      
      // Generate a new replacement
      const newReplacement = await replaceIndividualWord(
        currentReplacement.original,
        statement.activityVerb,
        usedWords,
        false // not isOriginal
      );
      
      // Update the replacements
      const updatedReplacements = [...replacements];
      updatedReplacements[index] = {
        original: currentReplacement.original,
        replacement: newReplacement
      };
      
      setReplacements(updatedReplacements);
      
      // Update used words
      const newUsedWords = new Set(usedWords);
      newUsedWords.add(newReplacement.toLowerCase());
      
      // Add individual words to prevent partial repeats
      const words = newReplacement.toLowerCase().split(/\s+/);
      for (const word of words) {
        if (word.length > 3) { // Only add significant words
          newUsedWords.add(word);
        }
      }
      
      setUsedWords(newUsedWords);
    } catch (error) {
      console.error("Error replacing replacement:", error);
      setError(`Error replacing replacement: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Simplify the current activity
  const simplifyActivity = async () => {
    if (!registryInitialized) {
      setError("Word registry is still initializing. Please wait a moment and try again.");
      return;
    }
    
    if (!statement) {
      setError("Please generate an activity first");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if OpenAI is connected
      if (!isConnected) {
        setError("Please connect to the OpenAI API first");
        setShowApiSettings(true); // Show API settings if not connected
        setIsLoading(false);
        return;
      }
      
      // Simplify the activity
      const simplifiedActivity = await openAIService.simplifyActivity(statement);
      
      // Set the statement
      setStatement(simplifiedActivity);
      
      // Clear replacements
      setReplacements([]);
    } catch (error) {
      console.error("Error simplifying activity:", error);
      setError(`Error simplifying activity: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Render the app in developer mode
  if (developerMode || adminMode) {
    return (
      <DeveloperMode 
        initialConfig={uiConfig}
        onSave={saveUiConfig}
        onExit={developerMode ? toggleDeveloperMode : toggleAdminMode}
        isAdmin={adminMode}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        appState={{
          isConnected,
          isLoading,
          error,
          statement,
          replacements,
          apiStatus,
          numComponents,
          registryInitialized
        }}
        appActions={{
          generateActivityAndReplacements,
          generateReplacements,
          replaceReplacement,
          simplifyActivity,
          handleNumComponentsChange,
          toggleApiSettings,
          handleConnectionChange
        }}
      />
    );
  }

  // Apply UI configuration if available
  const renderWithUiConfig = () => {
    // If we have a UI configuration, use it to render the UI elements
    if (uiConfig && uiConfig.elements) {
      // Find the elements we need
      const headerElement = uiConfig.elements.find(el => el.id === 'header');
      const generateButton = uiConfig.elements.find(el => el.id === 'generate-button');
      // Removed replacementsButton reference since we're removing this button
      const simplifyButton = uiConfig.elements.find(el => el.id === 'simplify-button');
      const componentSelector = uiConfig.elements.find(el => el.id === 'component-selector');
      const activityDisplay = uiConfig.elements.find(el => el.id === 'activity-display');
      const replacementsContainer = uiConfig.elements.find(el => el.id === 'replacements-container');
      const timerElement = uiConfig.elements.find(el => el.id === 'timer');
      
      return (
        <div className="app">
          <header className="app-header">
            {headerElement ? (
              <h1 style={headerElement.style}>{headerElement.content}</h1>
            ) : (
              <h1>The Things Generator</h1>
            )}
            <div className="header-controls">
              <div className="theme-toggle" onClick={toggleDarkMode}>
                <span className="theme-icon">
                  {darkMode ? '☀️' : '🌙'}
                </span>
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </div>
              <div className="api-status-indicator" onClick={toggleApiSettings}>
                API: 
                <span className={`status-badge ${apiStatus.status}`}>
                  {apiStatus.status === 'disconnected' && 'Disconnected'}
                  {apiStatus.status === 'connecting' && 'Connecting...'}
                  {apiStatus.status === 'connected' && 'Connected'}
                  {apiStatus.status === 'error' && 'Error'}
                </span>
                {apiStatus.error && (
                  <span className="api-error-message" title={apiStatus.error}>
                    ⚠️
                  </span>
                )}
                <span className="settings-toggle">⚙️</span>
              </div>
              <div className="dev-mode-toggle" onClick={toggleDeveloperMode}>
                <span className="dev-icon">🛠️</span>
                Developer Mode
              </div>
            </div>
          </header>
          
          <main className="app-content">
            {showApiSettings && (
              <div className="api-settings-panel">
                <div className="panel-header">
                  <h3>API Connection</h3>
                  <button className="close-button" onClick={toggleApiSettings}>×</button>
                </div>
                <ApiKeyInput onConnectionChange={handleConnectionChange} />
              </div>
            )}
            
            <div className="generator-section">
              <div className="controls-container">
                <div className="controls">
                  {generateButton && (
                    <button 
                      className="generate-button"
                      onClick={generateActivityAndReplacements}
                      disabled={isLoading || !isConnected || !registryInitialized}
                      style={generateButton.style}
                    >
                      {isLoading ? 'Generating...' : generateButton.content}
                    </button>
                  )}
                  
                  {/* Removed Generate New Replacements button */}
                  
                  {simplifyButton && (
                    <button 
                      className="simplify-button"
                      onClick={simplifyActivity}
                      disabled={isLoading || !statement || !isConnected || !registryInitialized}
                      style={simplifyButton.style}
                    >
                      {simplifyButton.content}
                    </button>
                  )}
                </div>
                
                {componentSelector && (
                  <div className="component-selector" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    ...componentSelector.style
                  }}>
                    <label htmlFor="numComponents">{componentSelector.label}</label>
                    <select 
                      id="numComponents" 
                      value={numComponents} 
                      onChange={handleNumComponentsChange}
                      disabled={isLoading}
                      style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--panel-background)',
                        color: 'var(--text-color)',
                        fontSize: '0.9rem'
                      }}
                    >
                      {componentSelector.options.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
              
              {statement && activityDisplay && (
                <div className="activity-display" style={activityDisplay.style}>
                  <h2>Thing: {statement.activityVerb}</h2>
                </div>
              )}
              
              {replacementsContainer && (
                <div className="replacements-container" style={replacementsContainer.style}>
                  <h3 style={{ 
                    color: 'var(--secondary-color)',
                    marginBottom: '1rem',
                    fontSize: '1.2rem',
                    paddingBottom: '0.5rem',
                    borderBottom: '1px solid var(--border-color)'
                  }}>
                    Replacements
                  </h3>
                  
                  {replacements.length > 0 ? (
                    <ul className="replacements-list" style={{
                      listStyle: 'none',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))',
                      gap: '1rem'
                    }}>
                      {replacements.map((replacement, index) => (
                        <li key={`replacement-${index}`}>
                          <div className="replacement-item" style={{
                            padding: '0.75rem',
                            backgroundColor: 'var(--component-bg)',
                            borderRadius: '4px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '0.75rem'
                          }}>
                            <span className="original-text" style={{
                              fontWeight: '600',
                              color: 'var(--original-text)',
                              flexShrink: '0',
                              minWidth: '100px',
                              maxWidth: '30%'
                            }}>
                              {replacement.original}
                            </span>
                            <span className="equals-sign" style={{
                              color: 'var(--equals-color)',
                              fontWeight: 'bold',
                              fontSize: '1.8rem',
                              flexShrink: '0',
                              display: 'inline-block',
                              backgroundColor: 'var(--equals-bg)',
                              padding: '0.1rem 0.75rem',
                              borderRadius: '4px',
                              lineHeight: '1.5',
                              minWidth: '2.5rem',
                              textAlign: 'center'
                            }}>
                              =
                            </span>
                            <span className="replacement-text" style={{
                              fontWeight: '600',
                              color: 'var(--replacement-text)',
                              flex: '1',
                              marginRight: '0.5rem'
                            }}>
                              {replacement.replacement}
                            </span>
                            <button 
                              className="replace-button"
                              onClick={() => replaceReplacement(index)}
                              disabled={isLoading || !isConnected || !registryInitialized}
                              style={{
                                backgroundColor: 'var(--accent-color)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '0.4rem 0.75rem',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                flexShrink: '0'
                              }}
                            >
                              Replace
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="empty-replacements" style={{
                      padding: '2rem',
                      backgroundColor: 'var(--component-bg)',
                      borderRadius: '4px',
                      textAlign: 'center',
                      color: 'var(--component-text)',
                      fontStyle: 'italic'
                    }}>
                      No replacements generated yet
                    </div>
                  )}
                </div>
              )}
              
              {timerElement && (
                <div className="timer-wrapper" style={timerElement.style}>
                  <Timer darkMode={darkMode} />
                </div>
              )}
            </div>
          </main>
          
          <footer className="app-footer">
            <p>The Things Generator - A word replacement tool for charades-like gameplay</p>
          </footer>
        </div>
      );
    }
    
    // Default rendering if no UI configuration is available
    return renderDefaultUI();
  };

  // Render the default UI
  const renderDefaultUI = () => {
    return (
      <div className="app">
        <header className="app-header">
          <h1>The Things Generator</h1>
          <div className="header-controls">
            <div className="theme-toggle" onClick={toggleDarkMode}>
              <span className="theme-icon">
                {darkMode ? '☀️' : '🌙'}
              </span>
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </div>
            <div className="api-status-indicator" onClick={toggleApiSettings}>
              API: 
              <span className={`status-badge ${apiStatus.status}`}>
                {apiStatus.status === 'disconnected' && 'Disconnected'}
                {apiStatus.status === 'connecting' && 'Connecting...'}
                {apiStatus.status === 'connected' && 'Connected'}
                {apiStatus.status === 'error' && 'Error'}
              </span>
              {apiStatus.error && (
                <span className="api-error-message" title={apiStatus.error}>
                  ⚠️
                </span>
              )}
              <span className="settings-toggle">⚙️</span>
            </div>
            <div className="dev-mode-toggle" onClick={toggleDeveloperMode}>
              <span className="dev-icon">🛠️</span>
              Developer Mode
            </div>
          </div>
        </header>
        
        <main className="app-content">
          {showApiSettings && (
            <div className="api-settings-panel">
              <div className="panel-header">
                <h3>API Connection</h3>
                <button className="close-button" onClick={toggleApiSettings}>×</button>
              </div>
              <ApiKeyInput onConnectionChange={handleConnectionChange} />
            </div>
          )}
          
          <div className="generator-section">
            <div className="controls-container">
              <div className="controls">
                <button 
                  className="generate-button"
                  onClick={generateActivityAndReplacements}
                  disabled={isLoading || !isConnected || !registryInitialized}
                >
                  {isLoading ? 'Generating...' : 'Generate Activity'}
                </button>
                
                {/* Removed Generate New Replacements button */}
                
                <button 
                  className="simplify-button"
                  onClick={simplifyActivity}
                  disabled={isLoading || !statement || !isConnected || !registryInitialized}
                >
                  Simplify Activity
                </button>
              </div>
              
              <div className="component-selector">
                <label htmlFor="numComponents">Number of Components:</label>
                <select 
                  id="numComponents" 
                  value={numComponents} 
                  onChange={handleNumComponentsChange}
                  disabled={isLoading}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
            </div>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            {statement && (
              <div className="activity-display">
                <h2>Thing: {statement.activityVerb}</h2>
                
                <div className="replacements-container">
                  <h3>Replacements</h3>
                  {replacements.length > 0 ? (
                    <ul className="replacements-list">
                      {replacements.map((replacement, index) => (
                        <li key={`replacement-${index}`}>
                          <div className="replacement-item">
                            <span className="original-text">{replacement.original}</span>
                            <span className="equals-sign">=</span>
                            <span className="replacement-text">{replacement.replacement}</span>
                            <button 
                              className="replace-button"
                              onClick={() => replaceReplacement(index)}
                              disabled={isLoading || !isConnected || !registryInitialized}
                            >
                              Replace
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="empty-replacements">
                      No replacements generated yet
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="timer-wrapper">
              <Timer darkMode={darkMode} />
            </div>
          </div>
        </main>
        
        <footer className="app-footer">
          <p>The Things Generator - A word replacement tool for charades-like gameplay</p>
        </footer>
      </div>
    );
  };

  // Render the app with UI configuration if available
  return renderWithUiConfig();
}

export default App;
