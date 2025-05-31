// This is a mock implementation that would normally use the OpenAI API
// In a real implementation, you would call the OpenAI API here

import { getRandomComponent } from './componentReplacer';
import { getRandomReplacement } from './wordReplacer';

// Simple activities that are easy to act out
const simpleActivities = [
  "Cooking a meal",
  "Building a tower",
  "Painting a picture",
  "Playing a game",
  "Cleaning a room",
  "Fixing a car",
  "Planting a garden",
  "Writing a letter",
  "Reading a book",
  "Washing clothes",
  "Making a sandwich",
  "Drawing a map",
  "Taking a photo",
  "Riding a bike",
  "Swimming in a pool",
  "Dancing to music",
  "Singing a song",
  "Throwing a ball",
  "Catching a fish",
  "Walking a dog",
  "Driving a car",
  "Flying a kite",
  "Climbing a tree",
  "Jumping rope",
  "Running a race",
  "Skating on ice",
  "Skiing down a hill",
  "Surfing a wave",
  "Paddling a boat",
  "Hiking a trail"
];

// Simplify a statement by replacing the activity verb and components with simpler ones
export const simplifyStatement = async (statement, usedWords) => {
  if (!statement || !statement.activityVerb) {
    return null;
  }
  
  // Choose a random simple activity
  const randomIndex = Math.floor(Math.random() * simpleActivities.length);
  const simpleActivity = simpleActivities[randomIndex];
  
  // Determine how many components to include (2-3)
  const numComponents = Math.floor(Math.random() * 2) + 2; // 2-3 components
  
  // Generate appropriate components for the activity
  const simpleComponents = [];
  for (let i = 0; i < numComponents; i++) {
    const component = getRandomComponent(simpleActivity);
    simpleComponents.push(component);
  }
  
  // Create a new simplified statement
  const simplifiedStatement = {
    activityVerb: simpleActivity,
    selectedComponents: simpleComponents
  };
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return simplifiedStatement;
};

// Simplify replacements by choosing simpler words
export const simplifyReplacements = async (wordPairs, usedWords) => {
  if (!wordPairs || wordPairs.length === 0) {
    return [];
  }
  
  // Create new replacements with simpler words
  const simplifiedReplacements = wordPairs.map(pair => {
    // Get a new random replacement (the wordReplacer already tries to use simpler words)
    const newReplacement = getRandomReplacement(usedWords);
    
    return {
      original: pair.original,
      replacement: newReplacement
    };
  });
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return simplifiedReplacements;
};
