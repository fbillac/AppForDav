import openAIService from './openaiService';
import { checkActivityExistsUnified, addActivityUnified } from './repetitionPrevention';

// Local fallback data for when OpenAI is not available
const fallbackActivities = [
  {
    activityVerb: "Baking cookies",
    components: ["mixing bowl", "cookie sheet", "oven"]
  },
  {
    activityVerb: "Changing a tire",
    components: ["car jack", "spare tire", "lug wrench"]
  },
  {
    activityVerb: "Playing basketball",
    components: ["basketball", "hoop", "court"]
  },
  {
    activityVerb: "Fishing",
    components: ["fishing rod", "bait", "tackle box"]
  },
  {
    activityVerb: "Painting a portrait",
    components: ["canvas", "paintbrush", "easel"]
  },
  {
    activityVerb: "Building a sandcastle",
    components: ["sand", "bucket", "shovel"]
  },
  {
    activityVerb: "Washing a car",
    components: ["sponge", "hose", "soap bucket"]
  },
  {
    activityVerb: "Planting a garden",
    components: ["seeds", "watering can", "trowel"]
  },
  {
    activityVerb: "Making a sandwich",
    components: ["bread", "knife", "cutting board"]
  },
  {
    activityVerb: "Taking a photograph",
    components: ["camera", "tripod", "subject"]
  },
  // Additional fallback activities with varying component counts
  {
    activityVerb: "Playing guitar",
    components: ["guitar", "pick", "amplifier", "sheet music"]
  },
  {
    activityVerb: "Camping in the woods",
    components: ["tent", "sleeping bag", "campfire", "flashlight"]
  },
  {
    activityVerb: "Baking a cake",
    components: ["mixing bowl", "cake pan", "oven", "frosting", "spatula"]
  },
  {
    activityVerb: "Changing a light bulb",
    components: ["ladder", "light bulb"]
  },
  {
    activityVerb: "Brushing teeth",
    components: ["toothbrush", "toothpaste"]
  },
  {
    activityVerb: "Riding a bicycle",
    components: ["bicycle", "helmet", "water bottle", "road", "pedals"]
  },
  {
    activityVerb: "Serving tennis",
    components: ["tennis racket", "tennis ball", "court"]
  },
  {
    activityVerb: "Wrapping a present",
    components: ["wrapping paper", "scissors", "tape", "gift", "bow"]
  },
  {
    activityVerb: "Washing dishes",
    components: ["sink", "sponge", "dish soap", "plate", "drying rack"]
  },
  {
    activityVerb: "Mowing the lawn",
    components: ["lawn mower", "grass", "yard", "gas can"]
  }
];

// Generate a statement with the specified number of components
export const generateStatement = async (numComponents = 3, usedWords) => {
  try {
    // Check if OpenAI service is initialized
    if (openAIService.initialized) {
      try {
        // Try to generate an activity using OpenAI
        let activity = await openAIService.generateActivity(numComponents);
        
        // Validate the activity has the required properties
        if (!activity || !activity.activityVerb || !activity.components || 
            !Array.isArray(activity.components) || activity.components.length !== numComponents) {
          console.error("Invalid activity format from OpenAI:", activity);
          throw new Error("Invalid activity format from OpenAI");
        }
        
        // Check if this activity already exists in our repetition prevention system
        let activityExists = await checkActivityExistsUnified(activity.activityVerb);
        
        let attempts = 0;
        const maxAttempts = 10; // Increased from 5 to 10 for more attempts
        
        // If the activity already exists, try to generate a new one
        while (activityExists && attempts < maxAttempts) {
          console.log(`Activity "${activity.activityVerb}" already exists, generating a new one...`);
          activity = await openAIService.generateActivity(numComponents);
          
          // Validate the new activity
          if (!activity || !activity.activityVerb || !activity.components || 
              !Array.isArray(activity.components) || activity.components.length !== numComponents) {
            console.error("Invalid activity format from OpenAI:", activity);
            throw new Error("Invalid activity format from OpenAI");
          }
          
          activityExists = await checkActivityExistsUnified(activity.activityVerb);
          attempts++;
        }
        
        // If we've exhausted our attempts, use a fallback activity
        if (activityExists) {
          console.log(`Could not generate a unique activity after ${maxAttempts} attempts, using fallback...`);
          return await generateFallbackStatement(numComponents, usedWords);
        }
        
        // Add the activity to our repetition prevention system
        await addActivityUnified(activity.activityVerb);
        
        // Ensure the activity has the correct number of components
        if (activity.components && activity.components.length === numComponents) {
          return {
            activityVerb: activity.activityVerb,
            selectedComponents: activity.components
          };
        } else {
          // If component count doesn't match, adjust it
          const adjustedComponents = [...activity.components];
          
          // Add or remove components to match the requested number
          while (adjustedComponents.length < numComponents) {
            // Generate a new component
            const newComponent = await generateUniqueComponent(activity.activityVerb, adjustedComponents);
            adjustedComponents.push(newComponent);
          }
          
          while (adjustedComponents.length > numComponents) {
            adjustedComponents.pop();
          }
          
          return {
            activityVerb: activity.activityVerb,
            selectedComponents: adjustedComponents
          };
        }
      } catch (error) {
        console.error("Error using OpenAI to generate activity:", error);
        // Fall back to local data if OpenAI fails
      }
    }
    
    // Fallback to local data if OpenAI is not available or fails
    return await generateFallbackStatement(numComponents, usedWords);
  } catch (error) {
    console.error("Error generating statement:", error);
    throw error;
  }
};

// Generate a fallback statement using local data
const generateFallbackStatement = async (numComponents, usedWords) => {
  console.log("Using fallback activity data");
  
  // Filter activities with the correct number of components
  let eligibleActivities = fallbackActivities.filter(
    activity => activity.components.length === numComponents
  );
  
  // If no activities with the exact component count, adapt ones that are close
  if (eligibleActivities.length === 0) {
    // Find activities that have components we can adapt
    eligibleActivities = fallbackActivities.filter(
      activity => Math.abs(activity.components.length - numComponents) <= 2
    );
    
    if (eligibleActivities.length === 0) {
      // If still no eligible activities, use any activity
      eligibleActivities = fallbackActivities;
    }
  }
  
  // Select a random activity from eligible ones
  let randomActivity;
  let activityVerb;
  let activityExists = true;
  let attempts = 0;
  const maxAttempts = eligibleActivities.length * 2; // Try each activity at least twice
  
  // Keep trying until we find an activity that doesn't exist in our system
  while (activityExists && attempts < maxAttempts) {
    randomActivity = eligibleActivities[Math.floor(Math.random() * eligibleActivities.length)];
    activityVerb = randomActivity.activityVerb;
    
    // Check if this activity already exists
    activityExists = await checkActivityExistsUnified(activityVerb);
    
    attempts++;
  }
  
  // If we still couldn't find a unique activity, create a completely new one
  if (activityExists) {
    // Create a new activity from scratch
    const activities = [
      "Baking a cake", "Washing a dog", "Climbing a mountain", "Painting a fence",
      "Building a snowman", "Flying a kite", "Planting flowers", "Washing windows",
      "Changing a lightbulb", "Fixing a bicycle", "Making a sandwich", "Wrapping a gift",
      "Pitching a tent", "Rowing a boat", "Serving tennis", "Shooting a basketball",
      "Brushing teeth", "Washing hair", "Tying shoelaces", "Folding laundry",
      "Cooking pasta", "Grilling burgers", "Chopping vegetables", "Setting a table",
      "Playing piano", "Strumming guitar", "Drumming", "Conducting orchestra",
      "Driving a car", "Riding a bike", "Skating", "Swimming laps"
    ];
    
    // Find an activity that doesn't exist in our system
    for (const activity of activities) {
      activityExists = await checkActivityExistsUnified(activity);
      if (!activityExists) {
        activityVerb = activity;
        break;
      }
    }
    
    // If all activities exist, create a unique one with a descriptive name
    if (activityExists) {
      const baseActivities = ["Playing", "Building", "Creating", "Making", "Performing"];
      const objects = ["game", "project", "artwork", "craft", "activity"];
      
      const baseActivity = baseActivities[Math.floor(Math.random() * baseActivities.length)];
      const object = objects[Math.floor(Math.random() * objects.length)];
      
      // Create a unique activity name without using variations
      const uniqueId = Date.now().toString().slice(-4);
      activityVerb = `${baseActivity} a ${object} #${uniqueId}`;
    }
  }
  
  // Add the activity to our repetition prevention system
  await addActivityUnified(activityVerb);
  
  // Adapt the components to match the requested number
  const adaptedComponents = randomActivity ? [...randomActivity.components] : [];
  
  // Add or remove components to match the requested number
  while (adaptedComponents.length < numComponents) {
    // Generate a new component
    const newComponent = await generateUniqueComponent(activityVerb, adaptedComponents);
    adaptedComponents.push(newComponent);
  }
  
  while (adaptedComponents.length > numComponents) {
    adaptedComponents.pop();
  }
  
  return {
    activityVerb: activityVerb,
    selectedComponents: adaptedComponents
  };
};

// Helper function to generate a unique component for an activity
const generateUniqueComponent = async (activityVerb, existingComponents) => {
  // Try to use OpenAI to generate a component
  if (openAIService.initialized) {
    try {
      const newComponent = await openAIService.generateSingleComponent(
        activityVerb,
        existingComponents,
        new Set()
      );
      
      // Check if the component is valid
      if (newComponent && typeof newComponent === 'string' && newComponent.trim().length > 0) {
        return newComponent.trim();
      }
    } catch (error) {
      console.error("Error generating component with OpenAI:", error);
    }
  }
  
  // Fallback component generation
  // Import the component generator dynamically to avoid circular dependencies
  try {
    const { generateUniqueComponents } = await import('./componentReplacer');
    
    // Generate a single unique component
    const components = await generateUniqueComponents(activityVerb, 1, new Set(existingComponents));
    if (components && components.length > 0) {
      return components[0];
    }
  } catch (error) {
    console.error("Error generating component locally:", error);
  }
  
  // Last resort fallback
  const genericComponents = [
    "tool", "equipment", "accessory", "device", "instrument", "apparatus",
    "implement", "utensil", "gadget", "appliance", "machine", "mechanism"
  ];
  
  // Add a number to make it unique
  const randomComponent = genericComponents[Math.floor(Math.random() * genericComponents.length)];
  return `${randomComponent} ${Math.floor(Math.random() * 100) + 1}`;
};
