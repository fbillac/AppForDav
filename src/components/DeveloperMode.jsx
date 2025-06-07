import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import { HexColorPicker } from 'react-colorful';
import ApiKeyInput from './ApiKeyInput';
import './DeveloperMode.css';

// Default UI elements configuration
const defaultElements = [
  {
    id: 'header',
    type: 'header',
    content: 'The Things Generator',
    position: { x: 20, y: 20 },
    size: { width: 300, height: 50 },
    style: {
      color: '#4a6fa5',
      backgroundColor: 'transparent',
      fontSize: '2rem',
      fontWeight: 'bold'
    }
  },
  {
    id: 'generate-button',
    type: 'button',
    content: 'Generate Activity',
    position: { x: 20, y: 100 },
    size: { width: 200, height: 50 },
    style: {
      color: 'white',
      backgroundColor: '#4a6fa5',
      fontSize: '1rem',
      fontWeight: 'bold',
      borderRadius: '4px',
      border: 'none'
    },
    action: 'generateActivityAndReplacements'
  },
  {
    id: 'replacements-button',
    type: 'button',
    content: 'Generate New Replacements',
    position: { x: 230, y: 100 },
    size: { width: 250, height: 50 },
    style: {
      color: 'white',
      backgroundColor: '#4a6fa5',
      fontSize: '1rem',
      fontWeight: 'bold',
      borderRadius: '4px',
      border: 'none'
    },
    action: 'generateReplacements'
  },
  {
    id: 'simplify-button',
    type: 'button',
    content: 'Simplify Activity',
    position: { x: 490, y: 100 },
    size: { width: 200, height: 50 },
    style: {
      color: 'white',
      backgroundColor: '#6b8cae',
      fontSize: '1rem',
      fontWeight: 'bold',
      borderRadius: '4px',
      border: 'none'
    },
    action: 'simplifyActivity'
  },
  {
    id: 'component-selector',
    type: 'select',
    label: 'Number of Components:',
    options: [1, 2, 3, 4, 5],
    defaultValue: 3,
    position: { x: 700, y: 100 },
    size: { width: 250, height: 50 },
    style: {
      backgroundColor: '#edf2f7',
      color: '#2d3748',
      fontSize: '0.9rem',
      borderRadius: '4px',
      padding: '0.5rem'
    },
    action: 'handleNumComponentsChange'
  },
  {
    id: 'activity-display',
    type: 'activity',
    position: { x: 20, y: 170 },
    size: { width: 930, height: 60 },
    style: {
      color: '#4a6fa5',
      backgroundColor: 'transparent',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      textAlign: 'center'
    }
  },
  {
    id: 'replacements-container',
    type: 'replacements',
    position: { x: 20, y: 250 },
    size: { width: 930, height: 300 },
    style: {
      backgroundColor: 'transparent',
      borderRadius: '4px'
    }
  },
  {
    id: 'timer',
    type: 'timer',
    position: { x: 20, y: 570 },
    size: { width: 930, height: 200 },
    style: {
      backgroundColor: '#f0f4f8',
      color: '#2d3748',
      borderRadius: '8px',
      padding: '1.5rem'
    }
  }
];

const DeveloperMode = ({ 
  initialConfig, 
  onSave, 
  onExit, 
  isAdmin, 
  darkMode, 
  toggleDarkMode,
  appState,
  appActions
}) => {
  // Use initialConfig if available, otherwise use default elements
  const [elements, setElements] = useState(initialConfig?.elements || defaultElements);
  const [selectedElement, setSelectedElement] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorProperty, setColorProperty] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const colorPickerRef = useRef(null);
  
  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setShowColorPicker(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle element selection
  const handleSelectElement = (id) => {
    if (!isDragging && !isResizing) {
      const element = elements.find(el => el.id === id);
      setSelectedElement(element);
    }
  };
  
  // Handle element drag
  const handleDrag = (id, data) => {
    setIsDragging(true);
    const updatedElements = elements.map(element => {
      if (element.id === id) {
        return {
          ...element,
          position: { x: data.x, y: data.y }
        };
      }
      return element;
    });
    setElements(updatedElements);
  };
  
  // Handle drag stop
  const handleDragStop = () => {
    setIsDragging(false);
  };
  
  // Handle element resize
  const handleResize = (id, event, data) => {
    setIsResizing(true);
    // Check if data and data.size exist before destructuring
    if (!data || !data.size) {
      console.error('Invalid resize data:', data);
      return;
    }
    
    const { size } = data;
    const updatedElements = elements.map(element => {
      if (element.id === id) {
        return {
          ...element,
          size: { width: size.width, height: size.height }
        };
      }
      return element;
    });
    setElements(updatedElements);
  };
  
  // Handle resize stop
  const handleResizeStop = () => {
    setIsResizing(false);
  };
  
  // Handle style property change
  const handleStyleChange = (property, value) => {
    if (!selectedElement) return;
    
    const updatedElements = elements.map(element => {
      if (element.id === selectedElement.id) {
        return {
          ...element,
          style: {
            ...element.style,
            [property]: value
          }
        };
      }
      return element;
    });
    
    setElements(updatedElements);
    setSelectedElement({
      ...selectedElement,
      style: {
        ...selectedElement.style,
        [property]: value
      }
    });
  };
  
  // Open color picker for a specific property
  const openColorPicker = (property) => {
    setColorProperty(property);
    setShowColorPicker(true);
  };
  
  // Handle color change
  const handleColorChange = (color) => {
    if (colorProperty) {
      handleStyleChange(colorProperty, color);
    }
  };
  
  // Save the current configuration
  const handleSave = () => {
    const config = {
      elements,
      darkMode
    };
    onSave(config);
  };
  
  // Render the selected element's properties
  const renderProperties = () => {
    if (!selectedElement) {
      return (
        <div className="no-selection">
          <p>Select an element to edit its properties</p>
        </div>
      );
    }
    
    return (
      <>
        <div className="property-group">
          <h4>Position</h4>
          <div className="property-row">
            <span className="property-label">X:</span>
            <input
              type="number"
              className="property-input"
              value={selectedElement.position.x}
              onChange={(e) => {
                const updatedElements = elements.map(element => {
                  if (element.id === selectedElement.id) {
                    return {
                      ...element,
                      position: { ...element.position, x: parseInt(e.target.value) || 0 }
                    };
                  }
                  return element;
                });
                setElements(updatedElements);
                setSelectedElement({
                  ...selectedElement,
                  position: { ...selectedElement.position, x: parseInt(e.target.value) || 0 }
                });
              }}
            />
          </div>
          <div className="property-row">
            <span className="property-label">Y:</span>
            <input
              type="number"
              className="property-input"
              value={selectedElement.position.y}
              onChange={(e) => {
                const updatedElements = elements.map(element => {
                  if (element.id === selectedElement.id) {
                    return {
                      ...element,
                      position: { ...element.position, y: parseInt(e.target.value) || 0 }
                    };
                  }
                  return element;
                });
                setElements(updatedElements);
                setSelectedElement({
                  ...selectedElement,
                  position: { ...selectedElement.position, y: parseInt(e.target.value) || 0 }
                });
              }}
            />
          </div>
        </div>
        
        <div className="property-group">
          <h4>Size</h4>
          <div className="property-row">
            <span className="property-label">Width:</span>
            <input
              type="number"
              className="property-input"
              value={selectedElement.size.width}
              onChange={(e) => {
                const updatedElements = elements.map(element => {
                  if (element.id === selectedElement.id) {
                    return {
                      ...element,
                      size: { ...element.size, width: parseInt(e.target.value) || 100 }
                    };
                  }
                  return element;
                });
                setElements(updatedElements);
                setSelectedElement({
                  ...selectedElement,
                  size: { ...selectedElement.size, width: parseInt(e.target.value) || 100 }
                });
              }}
            />
          </div>
          <div className="property-row">
            <span className="property-label">Height:</span>
            <input
              type="number"
              className="property-input"
              value={selectedElement.size.height}
              onChange={(e) => {
                const updatedElements = elements.map(element => {
                  if (element.id === selectedElement.id) {
                    return {
                      ...element,
                      size: { ...element.size, height: parseInt(e.target.value) || 50 }
                    };
                  }
                  return element;
                });
                setElements(updatedElements);
                setSelectedElement({
                  ...selectedElement,
                  size: { ...selectedElement.size, height: parseInt(e.target.value) || 50 }
                });
              }}
            />
          </div>
        </div>
        
        <div className="property-group">
          <h4>Style</h4>
          <div className="property-row">
            <span className="property-label">Text Color:</span>
            <div className="color-picker-container">
              <div
                className="color-swatch"
                style={{ backgroundColor: selectedElement.style.color }}
                onClick={() => openColorPicker('color')}
              />
            </div>
          </div>
          <div className="property-row">
            <span className="property-label">Background:</span>
            <div className="color-picker-container">
              <div
                className="color-swatch"
                style={{ backgroundColor: selectedElement.style.backgroundColor }}
                onClick={() => openColorPicker('backgroundColor')}
              />
            </div>
          </div>
          <div className="property-row">
            <span className="property-label">Font Size:</span>
            <input
              type="text"
              className="property-input"
              value={selectedElement.style.fontSize}
              onChange={(e) => handleStyleChange('fontSize', e.target.value)}
            />
          </div>
          {selectedElement.style.borderRadius !== undefined && (
            <div className="property-row">
              <span className="property-label">Border Radius:</span>
              <input
                type="text"
                className="property-input"
                value={selectedElement.style.borderRadius}
                onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
              />
            </div>
          )}
          {selectedElement.style.padding !== undefined && (
            <div className="property-row">
              <span className="property-label">Padding:</span>
              <input
                type="text"
                className="property-input"
                value={selectedElement.style.padding}
                onChange={(e) => handleStyleChange('padding', e.target.value)}
              />
            </div>
          )}
          {selectedElement.style.textAlign !== undefined && (
            <div className="property-row">
              <span className="property-label">Text Align:</span>
              <select
                className="property-input"
                value={selectedElement.style.textAlign}
                onChange={(e) => handleStyleChange('textAlign', e.target.value)}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          )}
        </div>
        
        {selectedElement.type === 'button' && (
          <div className="property-group">
            <h4>Content</h4>
            <div className="property-row">
              <span className="property-label">Text:</span>
              <input
                type="text"
                className="property-input"
                value={selectedElement.content}
                onChange={(e) => {
                  const updatedElements = elements.map(element => {
                    if (element.id === selectedElement.id) {
                      return {
                        ...element,
                        content: e.target.value
                      };
                    }
                    return element;
                  });
                  setElements(updatedElements);
                  setSelectedElement({
                    ...selectedElement,
                    content: e.target.value
                  });
                }}
              />
            </div>
          </div>
        )}
        
        {selectedElement.type === 'header' && (
          <div className="property-group">
            <h4>Content</h4>
            <div className="property-row">
              <span className="property-label">Text:</span>
              <input
                type="text"
                className="property-input"
                value={selectedElement.content}
                onChange={(e) => {
                  const updatedElements = elements.map(element => {
                    if (element.id === selectedElement.id) {
                      return {
                        ...element,
                        content: e.target.value
                      };
                    }
                    return element;
                  });
                  setElements(updatedElements);
                  setSelectedElement({
                    ...selectedElement,
                    content: e.target.value
                  });
                }}
              />
            </div>
          </div>
        )}
      </>
    );
  };
  
  // Render the UI elements on the canvas
  const renderElements = () => {
    return elements.map(element => {
      const isSelected = selectedElement && selectedElement.id === element.id;
      
      // Common props for all draggable elements
      const draggableProps = {
        key: element.id,
        position: element.position,
        onDrag: (e, data) => handleDrag(element.id, data),
        onStop: handleDragStop,
        bounds: "parent"
      };
      
      // Common props for all resizable elements
      const resizableProps = {
        width: element.size.width,
        height: element.size.height,
        onResize: (e, data) => handleResize(element.id, data),
        onResizeStop: handleResizeStop,
        resizeHandles: ['se', 'sw', 'ne', 'nw', 'e', 'w', 'n', 's']
      };
      
      // Render different types of elements
      switch (element.type) {
        case 'header':
          return (
            <Draggable {...draggableProps}>
              <Resizable {...resizableProps}>
                <div
                  className={`draggable-element ${isSelected ? 'selected' : ''}`}
                  style={{
                    ...element.style,
                    width: element.size.width,
                    height: element.size.height
                  }}
                  onClick={() => handleSelectElement(element.id)}
                >
                  {element.content}
                </div>
              </Resizable>
            </Draggable>
          );
          
        case 'button':
          return (
            <Draggable {...draggableProps}>
              <Resizable {...resizableProps}>
                <button
                  className={`draggable-element ${isSelected ? 'selected' : ''}`}
                  style={{
                    ...element.style,
                    width: element.size.width,
                    height: element.size.height
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelectElement(element.id);
                  }}
                >
                  {element.content}
                </button>
              </Resizable>
            </Draggable>
          );
          
        case 'select':
          return (
            <Draggable {...draggableProps}>
              <Resizable {...resizableProps}>
                <div
                  className={`draggable-element component-selector ${isSelected ? 'selected' : ''}`}
                  style={{
                    ...element.style,
                    width: element.size.width,
                    height: element.size.height,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onClick={() => handleSelectElement(element.id)}
                >
                  <label htmlFor="devModeNumComponents">{element.label}</label>
                  <select
                    id="devModeNumComponents"
                    value={appState.numComponents}
                    onChange={(e) => e.stopPropagation()}
                    style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--panel-background)',
                      color: 'var(--text-color)',
                      fontSize: '0.9rem'
                    }}
                  >
                    {element.options.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </Resizable>
            </Draggable>
          );
          
        case 'activity':
          return (
            <Draggable {...draggableProps}>
              <Resizable {...resizableProps}>
                <div
                  className={`draggable-element ${isSelected ? 'selected' : ''}`}
                  style={{
                    ...element.style,
                    width: element.size.width,
                    height: element.size.height,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={() => handleSelectElement(element.id)}
                >
                  {appState.statement ? (
                    <h2>Activity: {appState.statement.activityVerb}</h2>
                  ) : (
                    <h2>Activity will appear here</h2>
                  )}
                </div>
              </Resizable>
            </Draggable>
          );
          
        case 'replacements':
          return (
            <Draggable {...draggableProps}>
              <Resizable {...resizableProps}>
                <div
                  className={`draggable-element ${isSelected ? 'selected' : ''}`}
                  style={{
                    ...element.style,
                    width: element.size.width,
                    height: element.size.height,
                    overflow: 'auto'
                  }}
                  onClick={() => handleSelectElement(element.id)}
                >
                  <h3 style={{ 
                    color: 'var(--secondary-color)',
                    marginBottom: '1rem',
                    fontSize: '1.2rem',
                    paddingBottom: '0.5rem',
                    borderBottom: '1px solid var(--border-color)'
                  }}>
                    Replacements
                  </h3>
                  
                  {appState.replacements.length > 0 ? (
                    <ul className="replacements-list" style={{
                      listStyle: 'none',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))',
                      gap: '1rem'
                    }}>
                      {appState.replacements.map((replacement, index) => (
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
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                              }}
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
              </Resizable>
            </Draggable>
          );
          
        case 'timer':
          return (
            <Draggable {...draggableProps}>
              <Resizable {...resizableProps}>
                <div
                  className={`draggable-element ${isSelected ? 'selected' : ''}`}
                  style={{
                    ...element.style,
                    width: element.size.width,
                    height: element.size.height,
                    overflow: 'auto'
                  }}
                  onClick={() => handleSelectElement(element.id)}
                >
                  <div className="timer-display" style={{
                    fontSize: '3rem',
                    fontWeight: '700',
                    textAlign: 'center',
                    marginBottom: '1rem',
                    color: 'var(--timer-text)',
                    fontFamily: 'monospace'
                  }}>
                    01:00
                  </div>
                  
                  <div className="timer-progress" style={{
                    height: '8px',
                    backgroundColor: 'var(--component-bg)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginBottom: '1.5rem'
                  }}>
                    <div 
                      className="timer-progress-bar" 
                      style={{
                        height: '100%',
                        backgroundColor: 'var(--timer-progress)',
                        width: '0%'
                      }}
                    ></div>
                  </div>
                  
                  <div className="timer-controls" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <button style={{
                      padding: '0.5rem 1.5rem',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      backgroundColor: 'var(--primary-color)',
                      color: 'white'
                    }}>
                      Start
                    </button>
                    <button style={{
                      padding: '0.5rem 1.5rem',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      backgroundColor: 'var(--secondary-color)',
                      color: 'white'
                    }}>
                      Stop
                    </button>
                    <button style={{
                      padding: '0.5rem 1.5rem',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      backgroundColor: 'var(--secondary-color)',
                      color: 'white'
                    }}>
                      Reset
                    </button>
                  </div>
                </div>
              </Resizable>
            </Draggable>
          );
          
        default:
          return null;
      }
    });
  };
  
  return (
    <div className={`dev-mode-container ${darkMode ? 'dark-theme' : ''}`}>
      <div className="dev-mode-header">
        <div className="dev-mode-title">
          {isAdmin ? 'Admin Mode' : 'Developer Mode'} - UI Customization
        </div>
        <div className="dev-mode-controls">
          <button 
            className="dev-mode-button theme-toggle-button"
            onClick={toggleDarkMode}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button 
            className="dev-mode-button save-button"
            onClick={handleSave}
          >
            Save Configuration
          </button>
          <button 
            className="dev-mode-button exit-button"
            onClick={onExit}
          >
            Exit {isAdmin ? 'Admin Mode' : 'Developer Mode'}
          </button>
        </div>
      </div>
      
      <div className="dev-mode-workspace">
        <div className="canvas-area">
          {renderElements()}
        </div>
        
        <div className="properties-panel">
          <h3>Element Properties</h3>
          {renderProperties()}
          
          {showColorPicker && (
            <div className="color-picker-wrapper" ref={colorPickerRef}>
              <HexColorPicker 
                color={selectedElement?.style[colorProperty] || '#000000'} 
                onChange={handleColorChange} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeveloperMode;
