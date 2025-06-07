import React, { useState, useEffect } from 'react';
import openAIService from '../utils/openaiService';
import './ApiKeyInput.css';

const ApiKeyInput = ({ onConnectionChange }) => {
  const [apiKey, setApiKey] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [errorMessage, setErrorMessage] = useState('');
  const [showKey, setShowKey] = useState(false);

  // Load API key from localStorage on component mount
  useEffect(() => {
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey) {
      setApiKey(storedKey);
      initializeWithStoredKey(storedKey);
    }
  }, []);

  // Initialize OpenAI service with stored key
  const initializeWithStoredKey = async (key) => {
    setIsConnecting(true);
    setConnectionStatus('connecting');
    setErrorMessage('');

    try {
      // Initialize the OpenAI service
      const initialized = openAIService.initialize(key);
      
      if (!initialized) {
        const status = openAIService.getConnectionStatus();
        setConnectionStatus('error');
        setErrorMessage(status.error || 'Failed to initialize OpenAI service');
        onConnectionChange(false);
        return;
      }
      
      // Verify the connection
      console.log("Verifying connection with stored key...");
      const isConnected = await openAIService.verifyConnection();
      
      if (isConnected) {
        setConnectionStatus('connected');
        onConnectionChange(true);
      } else {
        const status = openAIService.getConnectionStatus();
        setConnectionStatus('error');
        setErrorMessage(status.error || 'Failed to connect to OpenAI API');
        onConnectionChange(false);
      }
    } catch (error) {
      console.error("Error initializing with stored key:", error);
      setConnectionStatus('error');
      setErrorMessage(error.message || 'An error occurred while connecting');
      onConnectionChange(false);
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle API key input change
  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
  };

  // Handle connect button click
  const handleConnect = async () => {
    if (!apiKey) {
      setErrorMessage('API key is required');
      return;
    }

    setIsConnecting(true);
    setConnectionStatus('connecting');
    setErrorMessage('');

    try {
      // Initialize the OpenAI service
      const initialized = openAIService.initialize(apiKey);
      
      if (!initialized) {
        const status = openAIService.getConnectionStatus();
        setConnectionStatus('error');
        setErrorMessage(status.error || 'Failed to initialize OpenAI service');
        onConnectionChange(false);
        return;
      }
      
      // Verify the connection
      console.log("Verifying connection with new key...");
      const isConnected = await openAIService.verifyConnection();
      
      if (isConnected) {
        // Save the API key to localStorage
        localStorage.setItem('openai_api_key', apiKey);
        
        setConnectionStatus('connected');
        onConnectionChange(true);
      } else {
        const status = openAIService.getConnectionStatus();
        setConnectionStatus('error');
        setErrorMessage(status.error || 'Failed to connect to OpenAI API');
        onConnectionChange(false);
      }
    } catch (error) {
      console.error("Error connecting to OpenAI:", error);
      setConnectionStatus('error');
      setErrorMessage(error.message || 'An error occurred while connecting');
      onConnectionChange(false);
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle disconnect button click
  const handleDisconnect = () => {
    // Clear the API key from localStorage
    localStorage.removeItem('openai_api_key');
    
    // Reset the state
    setApiKey('');
    setConnectionStatus('disconnected');
    setErrorMessage('');
    
    // Notify parent component
    onConnectionChange(false);
  };

  // Toggle API key visibility
  const toggleShowKey = () => {
    setShowKey(!showKey);
  };

  return (
    <div className="api-key-input">
      <div className="input-group">
        <label htmlFor="apiKey">API Key:</label>
        <div className="key-input-container">
          <input
            type={showKey ? "text" : "password"}
            id="apiKey"
            value={apiKey}
            onChange={handleApiKeyChange}
            placeholder="Enter your OpenAI API key"
            disabled={isConnecting || connectionStatus === 'connected'}
          />
          <button 
            type="button" 
            className="toggle-visibility-button"
            onClick={toggleShowKey}
            aria-label={showKey ? "Hide API key" : "Show API key"}
          >
            {showKey ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
      </div>
      
      <div className="connection-status">
        Status: 
        <span className={`status-indicator ${connectionStatus}`}>
          {connectionStatus === 'disconnected' && 'Disconnected'}
          {connectionStatus === 'connecting' && 'Connecting...'}
          {connectionStatus === 'connected' && 'Connected'}
          {connectionStatus === 'error' && 'Error'}
        </span>
      </div>
      
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
      
      <div className="api-buttons">
        {connectionStatus !== 'connected' ? (
          <button 
            className="connect-button"
            onClick={handleConnect}
            disabled={isConnecting || !apiKey}
          >
            {isConnecting ? 'Connecting...' : 'Connect'}
          </button>
        ) : (
          <button 
            className="disconnect-button"
            onClick={handleDisconnect}
          >
            Disconnect
          </button>
        )}
      </div>
      
      <div className="api-info">
        <p>
          You need an OpenAI API key to use this app. Get one at{' '}
          <a 
            href="https://platform.openai.com/api-keys" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            platform.openai.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default ApiKeyInput;
