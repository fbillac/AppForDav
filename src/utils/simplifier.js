// Simplifier utility for making activities and replacements easier
import openAIService from './openaiService';
import { getRandomReplacement } from './wordReplacer';
import { getRandomComponent, determineActivityType } from './componentReplacer';

// Simplify an entire statement (activity and components)
export const simplifyStatement = async (statement, usedWords) => {
  if (!statement || !statement.activityVerb || !statement.selectedComponents) {
    console.error('Invalid statement format for simplification');
    return null;
  }

  try {
    // Try to use OpenAI if it's initialized
    if (openAIService.initialized) {
      // Use OpenAI to simplify the activity
      return await openAIService.simplifyActivity(statement);
    } else {
      // Fall back to local simplification
      console.log("OpenAI not initialized for simplification, using local method");
      return fallbackSimplifyStatement(statement, usedWords);
    }
  } catch (error) {
    console.error("Error using OpenAI for simplification, falling back to local method:", error);
    return fallbackSimplifyStatement(statement, usedWords);
  }
};

// Fallback to local simplification if OpenAI is not available
const fallbackSimplifyStatement = (statement, usedWords) => {
  const { activityVerb, selectedComponents } = statement;
  
  // Simplify the activity verb (remove any complex phrases)
  let simplifiedVerb = activityVerb;
  
  // Remove any text after commas, colons, or semicolons
  simplifiedVerb = simplifiedVerb.split(/[,;:]/).shift().trim();
  
  // Remove any text in parentheses
  simplifiedVerb = simplifiedVerb.replace(/\s*\([^)]*\)\s*/g, ' ').trim();
  
  // Remove any complex prepositions and keep it simple
  const complexPrepositions = [
    'according to', 'ahead of', 'along with', 'apart from', 'as for', 
    'as of', 'as per', 'as regards', 'aside from', 'because of', 
    'by means of', 'contrary to', 'depending on', 'due to', 'except for', 
    'in addition to', 'in case of', 'in front of', 'in lieu of', 'in place of', 
    'in point of', 'in regard to', 'in spite of', 'instead of', 'on account of', 
    'on behalf of', 'on top of', 'prior to', 'regardless of', 'with regard to'
  ];
  
  complexPrepositions.forEach(prep => {
    simplifiedVerb = simplifiedVerb.replace(new RegExp(`\\s${prep}\\s.*$`, 'i'), '');
  });
  
  // Simplify the components (reduce to 2-3 simpler components)
  const activityType = determineActivityType(simplifiedVerb);
  const simplifiedComponents = [];
  
  // Determine how many components to keep (2-3)
  const numComponents = Math.min(Math.floor(Math.random() * 2) + 2, selectedComponents.length);
  
  // If we have existing components, try to keep the simplest ones
  if (selectedComponents.length > 0) {
    // Sort components by length (shorter is usually simpler)
    const sortedComponents = [...selectedComponents].sort((a, b) => a.length - b.length);
    
    // Take the simplest components
    for (let i = 0; i < numComponents && i < sortedComponents.length; i++) {
      simplifiedComponents.push(sortedComponents[i]);
    }
  }
  
  // If we need more components, generate them based on the activity type
  while (simplifiedComponents.length < numComponents) {
    const newComponent = getRandomComponent(simplifiedVerb);
    
    // Avoid duplicates
    if (!simplifiedComponents.includes(newComponent)) {
      simplifiedComponents.push(newComponent);
    }
  }
  
  return {
    activityVerb: simplifiedVerb,
    selectedComponents: simplifiedComponents
  };
};

// Simplify just the replacements, keeping the original activity and components
export const simplifyReplacements = async (wordPairs, usedWords) => {
  if (!wordPairs || wordPairs.length === 0) {
    return [];
  }
  
  try {
    // Create simplified replacements
    const simplifiedPairs = [];
    
    for (const pair of wordPairs) {
      // Get a simpler replacement word (prefer shorter, more common words)
      const newReplacement = getRandomReplacement(usedWords);
      
      simplifiedPairs.push({
        original: pair.original,
        replacement: newReplacement
      });
      
      // Add to used words
      usedWords.add(newReplacement.toLowerCase());
    }
    
    // Simulate API delay for consistency
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return simplifiedPairs;
  } catch (error) {
    console.error('Error simplifying replacements:', error);
    return wordPairs; // Return original pairs if there's an error
  }
};
