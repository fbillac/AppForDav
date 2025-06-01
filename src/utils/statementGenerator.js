// Statement generator utility
import openAIService from './openaiService';
import { generateUniqueComponents, getRandomComponent } from './componentReplacer';

// Generate a statement with components
export const generateStatement = async (numComponents = 3, usedWords = new Set()) => {
  try {
    // Try to use OpenAI if it's initialized
    if (openAIService.initialized) {
      // Generate activity with OpenAI
      const activity = await openAIService.generateActivity(numComponents);
      
      // Format the response
      return {
        activityVerb: activity.activityVerb,
        selectedComponents: activity.components
      };
    } else {
      // Fall back to local data
      console.log("OpenAI not initialized, using local data for statement generation");
      return fallbackGenerateStatement(numComponents, usedWords);
    }
  } catch (error) {
    console.error("Error using OpenAI for statement generation, falling back to local data:", error);
    return fallbackGenerateStatement(numComponents, usedWords);
  }
};

// Fallback to local data if OpenAI is not available
const fallbackGenerateStatement = (numComponents = 3, usedWords = new Set()) => {
  // List of activities
  const activities = [
    "Baking a cake", "Building a sandcastle", "Painting a portrait", 
    "Fixing a car", "Planting a garden", "Cooking dinner", 
    "Playing basketball", "Filming a movie", "Writing a novel",
    "Performing surgery", "Sailing a boat", "Flying a plane",
    "Cleaning the house", "Organizing a closet", "Teaching a class",
    "Hiking a mountain", "Camping in the woods", "Photographing wildlife",
    "Recording a song", "Assembling furniture", "Repairing a computer",
    "Drawing a comic", "Crafting jewelry", "Exercising at the gym"
  ];
  
  // Choose a random activity
  const randomIndex = Math.floor(Math.random() * activities.length);
  const activityVerb = activities[randomIndex];
  
  // Generate components that are logically associated with the activity
  const selectedComponents = generateUniqueComponents(activityVerb, numComponents, usedWords);
  
  return {
    activityVerb,
    selectedComponents
  };
};

// Ensure all components in a statement are unique
export const ensureUniqueComponents = (statement, usedWords = new Set()) => {
  if (!statement || !statement.selectedComponents || !Array.isArray(statement.selectedComponents)) {
    return statement;
  }
  
  const { activityVerb, selectedComponents } = statement;
  
  // Check if we have the right number of components
  const uniqueComponents = [...new Set(selectedComponents.map(comp => comp.toLowerCase()))];
  
  // If we already have the right number of unique components, return the statement as is
  if (uniqueComponents.length === selectedComponents.length) {
    return statement;
  }
  
  // Otherwise, generate new components to replace duplicates
  const newComponents = [...selectedComponents];
  const seenComponents = new Set();
  
  for (let i = 0; i < newComponents.length; i++) {
    const component = newComponents[i].toLowerCase();
    
    // If this component is a duplicate, replace it
    if (seenComponents.has(component)) {
      newComponents[i] = getRandomComponent(activityVerb);
    }
    
    seenComponents.add(newComponents[i].toLowerCase());
  }
  
  return {
    activityVerb,
    selectedComponents: newComponents
  };
};
