import React, { useState, useEffect } from 'react';
import openAIService from '../utils/openaiService';

const ApiKeyInput = ({ onConnectionChange }) => {
  const [apiKey, setApiKey] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Check if API key is stored in localStorage
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey) {
      // Try to initialize with the stored key
      const initialized = openAIService.initialize(storedKey);
      setIsInitialized(initialized);
      setApiKey(storedKey);
      
      // Notify parent component about connection status
      if (onConnectionChange) {
        onConnectionChange(initialized);
      }
    }
  }, [onConnectionChange]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setError('');
    setSuccess('');
    
    if (!apiKey.trim()) {
      setError('API key is required');
      return;
    }
    
    // Basic validation for API key format
    if (!apiKey.startsWith('sk-') || apiKey.length < 20) {
      setError('Invalid API key format. OpenAI API keys start with "sk-" and are longer than 20 characters.');
      return;
    }
    
    // Try to initialize OpenAI service with the provided key
    const initialized = openAIService.initialize(apiKey);
    
    if (initialized) {
      // Store the API key in localStorage
      localStorage.setItem('openai_api_key', apiKey);
      setIsInitialized(true);
      setSuccess('OpenAI API key set successfully!');
      setShowInput(false);
      
      // Notify parent component about connection status
      if (onConnectionChange) {
        onConnectionChange(true);
      }
    } else {
      setError('Failed to initialize OpenAI service. Please check your API key and ensure it has proper permissions.');
    }
  };

  const handleReset = () => {
    // Clear the API key from localStorage
    localStorage.removeItem('openai_api_key');
    setApiKey('');
    setIsInitialized(false);
    setShowInput(true);
    setSuccess('');
    setError('');
    
    // Notify parent component about connection status
    if (onConnectionChange) {
      onConnectionChange(false);
    }
  };

  return (
    <div className="api-key-container">
      {isInitialized ? (
        <div className="api-status">
          <span className="api-status-text">API: <span className="api-connected">Connected</span></span>
          <button 
            className="api-reset-button"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      ) : (
        <div className="api-status">
          <span className="api-status-text">API: <span className="api-disconnected">Disconnected</span></span>
          <button 
            className="api-connect-button"
            onClick={() => setShowInput(true)}
          >
            Connect
          </button>
        </div>
      )}
      
      {showInput && (
        <div className="api-key-form-container">
          <form onSubmit={handleSubmit} className="api-key-form">
            <div className="form-group">
              <label htmlFor="apiKey">OpenAI API Key:</label>
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your OpenAI API key"
                className="api-key-input"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="api-key-submit">Connect</button>
              <button 
                type="button" 
                className="api-key-cancel"
                onClick={() => setShowInput(false)}
              >
                Cancel
              </button>
            </div>
            {error && <div className="api-key-error">{error}</div>}
          </form>
        </div>
      )}
      
      {success && <div className="api-key-success">{success}</div>}
    </div>
  );
}

export default ApiKeyInput;
