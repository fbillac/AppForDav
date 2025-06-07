import openAIService from './openaiService';
import { checkActivityExistsUnified, addActivityUnified } from './repetitionPrevention';

// Helper function to check if a term is generic
function isGenericTerm(term) {
  if (!term || typeof term !== 'string') return true;
  
  const genericTerms = [
    "equipment", "supplies", "materials", "tools", "items", "accessories",
    "device", "apparatus", "implement", "utensil", "gadget", "appliance",
    "gear", "kit", "set", "stuff", "things", "objects", "prop", "instrument",
    "professional", "worker", "person", "individual", "specialist", "expert",
    "location", "place", "area", "space", "room", "facility", "venue",
    "component", "part", "piece", "element", "unit", "module", "section",
    "tool", "supply", "material", "item", "accessory", "device", "apparatus",
    "implement", "utensil", "gadget", "appliance", "gear", "kit", "set"
  ];
  
  // Check if the term contains any generic terms
  const lowerTerm = term.toLowerCase();
  return genericTerms.some(genericTerm => {
    // Check for exact match or if it's the main part of the term
    return lowerTerm === genericTerm || 
           lowerTerm.startsWith(genericTerm + " ") || 
           lowerTerm.endsWith(" " + genericTerm) ||
           lowerTerm.includes(" " + genericTerm + " ");
  });
}

// Helper function to generate activity-specific fallback components
function generateActivitySpecificFallback(activity) {
  const activityLower = activity.toLowerCase();
  
  // Cooking/baking related
  if (activityLower.includes("cook") || activityLower.includes("bak") || activityLower.includes("food")) {
    const cookingItems = ["wooden spoon", "chef's knife", "measuring cup", "mixing bowl", "whisk", "spatula", "oven mitt", "cutting board", "rolling pin", "frying pan"];
    return cookingItems[Math.floor(Math.random() * cookingItems.length)];
  }
  
  // Sports related
  if (activityLower.includes("play") || activityLower.includes("sport") || activityLower.includes("game") || 
      activityLower.includes("ball") || activityLower.includes("tennis") || activityLower.includes("basketball")) {
    const sportsItems = ["basketball", "tennis racket", "baseball bat", "hockey stick", "football helmet", "soccer cleats", "golf club", "volleyball net", "referee whistle", "scoreboard"];
    return sportsItems[Math.floor(Math.random() * sportsItems.length)];
  }
  
  // Construction/building related
  if (activityLower.includes("build") || activityLower.includes("construct") || activityLower.includes("fix") || 
      activityLower.includes("repair") || activityLower.includes("install")) {
    const buildingItems = ["hammer", "screwdriver", "power drill", "measuring tape", "level", "nail", "screw", "wrench", "pliers", "saw"];
    return buildingItems[Math.floor(Math.random() * buildingItems.length)];
  }
  
  // Cleaning related
  if (activityLower.includes("clean") || activityLower.includes("wash") || activityLower.includes("scrub") || 
      activityLower.includes("dust") || activityLower.includes("vacuum")) {
    const cleaningItems = ["sponge", "mop", "broom", "vacuum cleaner", "duster", "spray bottle", "rubber gloves", "scrub brush", "paper towel", "trash bag"];
    return cleaningItems[Math.floor(Math.random() * cleaningItems.length)];
  }
  
  // Art related
  if (activityLower.includes("paint") || activityLower.includes("draw") || activityLower.includes("sketch") || 
      activityLower.includes("art") || activityLower.includes("craft")) {
    const artItems = ["paintbrush", "canvas", "easel", "palette", "pencil", "sketchbook", "charcoal", "watercolor", "clay", "sculpting tool"];
    return artItems[Math.floor(Math.random() * artItems.length)];
  }
  
  // Music related
  if (activityLower.includes("music") || activityLower.includes("play") || activityLower.includes("sing") || 
      activityLower.includes("guitar") || activityLower.includes("piano")) {
    const musicItems = ["guitar", "piano", "drum", "microphone", "sheet music", "violin", "trumpet", "flute", "saxophone", "conductor's baton"];
    return musicItems[Math.floor(Math.random() * musicItems.length)];
  }
  
  // Stunt related
  if (activityLower.includes("stunt") || activityLower.includes("trick") || activityLower.includes("jump") || 
      activityLower.includes("flip") || activityLower.includes("perform") || activityLower.includes("acrobat")) {
    const stuntItems = ["safety harness", "crash mat", "helmet", "knee pads", "trampoline", "balance beam", "tightrope", "skateboard", "ramp", "protective gloves"];
    return stuntItems[Math.floor(Math.random() * stuntItems.length)];
  }
  
  // Outdoor/nature related
  if (activityLower.includes("hike") || activityLower.includes("camp") || activityLower.includes("fish") || 
      activityLower.includes("hunt") || activityLower.includes("garden")) {
    const outdoorItems = ["hiking boots", "tent", "fishing rod", "compass", "backpack", "binoculars", "water bottle", "sleeping bag", "flashlight", "trowel"];
    return outdoorItems[Math.floor(Math.random() * outdoorItems.length)];
  }
  
  // Technology related
  if (activityLower.includes("computer") || activityLower.includes("program") || activityLower.includes("code") || 
      activityLower.includes("tech") || activityLower.includes("game")) {
    const techItems = ["keyboard", "mouse", "monitor", "headphones", "laptop", "smartphone", "game controller", "webcam", "microphone", "graphics tablet"];
    return techItems[Math.floor(Math.random() * techItems.length)];
  }
  
  // Medical related
  if (activityLower.includes("doctor") || activityLower.includes("nurse") || activityLower.includes("medic") || 
      activityLower.includes("hospital") || activityLower.includes("surgery")) {
    const medicalItems = ["stethoscope", "syringe", "bandage", "surgical mask", "scalpel", "thermometer", "blood pressure cuff", "surgical gloves", "prescription pad", "tongue depressor"];
    return medicalItems[Math.floor(Math.random() * medicalItems.length)];
  }
  
  // Default - general specific items
  const defaultItems = [
    "coffee mug", "wristwatch", "sunglasses", "umbrella", "wallet", "backpack", 
    "notebook", "pencil", "scissors", "tape measure", "flashlight", "camera", 
    "bicycle", "helmet", "tennis racket", "baseball bat", "paintbrush", "hammer",
    "screwdriver", "wrench", "cooking pot", "frying pan", "chef's knife", "wooden spoon"
  ];
  
  return defaultItems[Math.floor(Math.random() * defaultItems.length)];
}

// Local fallback data for when OpenAI is not available - with specific components only
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
  },
  // Adding stunts and daring acts
  {
    activityVerb: "Walking a tightrope",
    components: ["balance pole", "safety net", "high wire"]
  },
  {
    activityVerb: "Performing a skateboard trick",
    components: ["skateboard", "ramp", "helmet", "knee pads"]
  },
  {
    activityVerb: "Doing a backflip",
    components: ["gymnastics mat", "spotter", "trampoline"]
  },
  {
    activityVerb: "Rock climbing",
    components: ["climbing rope", "carabiner", "chalk bag", "climbing shoes"]
  },
  {
    activityVerb: "Bungee jumping",
    components: ["bungee cord", "harness", "platform", "helmet"]
  },
  {
    activityVerb: "Skydiving",
    components: ["parachute", "airplane", "altimeter", "goggles"]
  },
  {
    activityVerb: "Surfing a big wave",
    components: ["surfboard", "wetsuit", "ocean wave", "beach"]
  },
  {
    activityVerb: "Performing a magic trick",
    components: ["magic wand", "top hat", "rabbit", "playing cards"]
  },
  {
    activityVerb: "Riding a mechanical bull",
    components: ["mechanical bull", "rodeo arena", "timer", "safety mat"]
  },
  {
    activityVerb: "Juggling flaming torches",
    components: ["torches", "fire extinguisher", "juggling gloves", "safety zone"]
  },
  {
    activityVerb: "Performing a sword swallowing act",
    components: ["sword", "stage", "audience", "spotlight"]
  },
  {
    activityVerb: "Walking on hot coals",
    components: ["hot coals", "fire pit", "water bucket", "bare feet"]
  },
  {
    activityVerb: "Escaping from handcuffs",
    components: ["handcuffs", "lock pick", "timer", "escape artist"]
  },
  {
    activityVerb: "Performing on a flying trapeze",
    components: ["trapeze bar", "safety net", "circus tent", "spotter"]
  },
  {
    activityVerb: "Racing a motorcycle",
    components: ["motorcycle", "racing track", "helmet", "finish line"]
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
        
        // Check if any components are generic
        const hasGenericComponents = activity.components.some(component => isGenericTerm(component));
        
        if (hasGenericComponents) {
          console.log("Generic components detected, regenerating...");
          // Try again up to 3 times
          let attempts = 0;
          const maxGenericAttempts = 3;
          
          while (hasGenericComponents && attempts < maxGenericAttempts) {
            activity = await openAIService.generateActivity(numComponents);
            
            // Validate the new activity
            if (!activity || !activity.activityVerb || !activity.components || 
                !Array.isArray(activity.components) || activity.components.length !== numComponents) {
              break;
            }
            
            // Check if any components are still generic
            const stillHasGenericComponents = activity.components.some(component => isGenericTerm(component));
            
            if (!stillHasGenericComponents) {
              break;
            }
            
            attempts++;
          }
          
          // If we still have generic components, replace them with specific ones
          if (activity.components.some(component => isGenericTerm(component))) {
            activity.components = activity.components.map(component => {
              if (isGenericTerm(component)) {
                return generateActivitySpecificFallback(activity.activityVerb);
              }
              return component;
            });
          }
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
          
          // Replace any generic components
          activity.components = activity.components.map(component => {
            if (isGenericTerm(component)) {
              return generateActivitySpecificFallback(activity.activityVerb);
            }
            return component;
          });
          
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
      "Driving a car", "Riding a bike", "Skating", "Swimming laps",
      // Adding stunts and daring acts to the fallback list
      "Walking a tightrope", "Performing a skateboard trick", "Doing a backflip",
      "Rock climbing", "Bungee jumping", "Skydiving", "Surfing a big wave",
      "Performing a magic trick", "Riding a mechanical bull", "Juggling flaming torches",
      "Performing a sword swallowing act", "Walking on hot coals", "Escaping from handcuffs",
      "Performing on a flying trapeze", "Racing a motorcycle", "Snowboarding down a mountain",
      "Performing a slam dunk", "Riding a unicycle", "Walking on stilts", "Fire breathing"
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
      const baseActivities = [
        "Playing", "Building", "Creating", "Making", "Performing", 
        "Attempting", "Executing", "Demonstrating", "Showcasing", "Mastering"
      ];
      const objects = [
        "game", "project", "artwork", "craft", "activity", 
        "stunt", "trick", "feat", "maneuver", "skill"
      ];
      
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
      
      // Check if the component is valid and not generic
      if (newComponent && typeof newComponent === 'string' && newComponent.trim().length > 0 && !isGenericTerm(newComponent)) {
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
    if (components && components.length > 0 && !isGenericTerm(components[0])) {
      return components[0];
    }
  } catch (error) {
    console.error("Error generating component locally:", error);
  }
  
  // Last resort fallback - use activity-specific components
  return generateActivitySpecificFallback(activityVerb);
};
