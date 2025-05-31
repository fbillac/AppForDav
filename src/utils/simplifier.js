// This module provides functionality to generate simpler alternatives
// for components and replacements that might be difficult to mime

// List of simpler, highly mime-able objects and actions
const simpleObjects = [
  "ball", "book", "cup", "hat", "phone", "key", "pen", "shoe", "chair", "door",
  "glasses", "watch", "camera", "plate", "spoon", "fork", "knife", "bottle", "bag",
  "umbrella", "brush", "mirror", "clock", "remote", "pillow", "blanket", "towel",
  "toothbrush", "comb", "scissors", "hammer", "nail", "saw", "screwdriver", "rope",
  "flashlight", "candle", "match", "bowl", "mug", "gloves", "scarf", "jacket", "shirt",
  "pants", "socks", "ring", "necklace", "bracelet", "wallet", "purse", "backpack",
  "laptop", "tablet", "headphones", "microphone", "guitar", "drum", "flute", "piano",
  "violin", "trumpet", "basketball", "football", "baseball", "tennis ball", "soccer ball",
  "frisbee", "kite", "balloon", "doll", "teddy bear", "toy", "game", "puzzle", "card",
  "dice", "mask", "crown", "flag", "map", "compass", "binoculars", "telescope", "microscope"
];

const simpleActions = [
  "eating", "drinking", "walking", "running", "jumping", "sitting", "standing", "sleeping",
  "waking up", "laughing", "crying", "smiling", "frowning", "waving", "pointing", "clapping",
  "dancing", "singing", "playing", "drawing", "painting", "writing", "reading", "typing",
  "cooking", "baking", "cleaning", "washing", "drying", "folding", "cutting", "sewing",
  "knitting", "building", "fixing", "breaking", "opening", "closing", "locking", "unlocking",
  "pushing", "pulling", "lifting", "carrying", "throwing", "catching", "kicking", "hitting",
  "swimming", "diving", "climbing", "falling", "flying", "driving", "riding", "sailing",
  "rowing", "paddling", "skiing", "skating", "surfing", "fishing", "hunting", "camping",
  "hiking", "gardening", "planting", "growing", "harvesting", "shopping", "paying", "selling",
  "buying", "teaching", "learning", "studying", "working", "resting", "exercising", "stretching"
];

// Function to get a simpler alternative for a component
const getSimpleComponent = (currentComponent) => {
  // Choose a random simple object
  const randomIndex = Math.floor(Math.random() * simpleObjects.length);
  return simpleObjects[randomIndex];
};

// Function to get a simpler alternative for a replacement
const getSimpleReplacement = (currentReplacement, usedWords) => {
  // Filter out words that have been used before
  const availableWords = simpleObjects.filter(word => 
    !usedWords.has(word.toLowerCase())
  );
  
  // If all words have been used, just use the full list
  const wordsToUse = availableWords.length > 0 ? availableWords : simpleObjects;
  
  // Choose a random simple object
  const randomIndex = Math.floor(Math.random() * wordsToUse.length);
  return wordsToUse[randomIndex];
};

// Function to get a simpler alternative for an activity verb
const getSimpleActivity = (currentActivity) => {
  // Choose a random simple action
  const randomIndex = Math.floor(Math.random() * simpleActions.length);
  return simpleActions[randomIndex];
};

// Main function to simplify a statement
export const simplifyStatement = async (statement, usedWords) => {
  if (!statement || typeof statement !== 'object' || !statement.activityVerb || !statement.selectedComponents) {
    return null;
  }
  
  // Create a copy of the statement to modify
  const simplifiedStatement = {
    activityVerb: getSimpleActivity(statement.activityVerb),
    selectedComponents: []
  };
  
  // Generate simpler components
  const numComponents = Math.min(3, statement.selectedComponents.length); // Limit to max 3 components for simplicity
  for (let i = 0; i < numComponents; i++) {
    simplifiedStatement.selectedComponents.push(getSimpleComponent(statement.selectedComponents[i]));
  }
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return simplifiedStatement;
};

// Function to simplify just the replacements
export const simplifyReplacements = async (wordPairs, usedWords) => {
  if (!wordPairs || !Array.isArray(wordPairs)) {
    return [];
  }
  
  const simplifiedPairs = [];
  
  for (const pair of wordPairs) {
    // Keep the original component but get a simpler replacement
    simplifiedPairs.push({
      original: pair.original,
      replacement: getSimpleReplacement(pair.replacement, usedWords)
    });
  }
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return simplifiedPairs;
};
