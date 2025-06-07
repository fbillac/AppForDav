import openAIService from './openaiService';
import { wordExists, addWord, ensureUniqueWord } from './globalWordRegistry';

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

// Generate a statement with the specified number of components
export const generateStatement = async (numComponents = 3, usedWords) => {
  try {
    console.log(`Generating statement with ${numComponents} components...`);
    
    // Verify OpenAI is initialized and connected
    if (!openAIService.initialized) {
      throw new Error('OpenAI service not initialized');
    }
    
    // Verify connection before proceeding
    const isConnected = await openAIService.verifyConnection();
    if (!isConnected) {
      const status = openAIService.getConnectionStatus();
      throw new Error(`OpenAI API not connected: ${status.error || 'Unknown error'}`);
    }
    
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
    
    // Check if this activity already exists in our global registry
    let activityExists = await wordExists(activity.activityVerb);
    
    let attempts = 0;
    const maxAttempts = 15; // Increased from 10 to 15 for more attempts
    
    // If the activity already exists, try to generate a new one
    while (activityExists && attempts < maxAttempts) {
      console.log(`Activity "${activity.activityVerb}" already exists, generating a new one... (Attempt ${attempts + 1}/${maxAttempts})`);
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
      
      activityExists = await wordExists(activity.activityVerb);
      attempts++;
    }
    
    // If we've exhausted our attempts, make the activity unique by modifying it slightly
    if (activityExists) {
      console.log(`After ${maxAttempts} attempts, still getting duplicate activity. Modifying to make unique.`);
      
      // Use a more diverse set of modifiers to create unique activities
      const modifiers = [
        "Expertly", "Quickly", "Carefully", "Professionally", "Enthusiastically",
        "Skillfully", "Gracefully", "Precisely", "Methodically", "Creatively",
        "Slowly", "Dramatically", "Silently", "Loudly", "Elegantly",
        "Frantically", "Calmly", "Joyfully", "Seriously", "Playfully"
      ];
      
      // Use a more diverse set of locations for further uniqueness
      const locations = [
        "in a park", "at the beach", "in the mountains", "underwater", "in space",
        "on a stage", "in a forest", "in the desert", "on a boat", "in the snow",
        "in a cave", "on a cliff", "in a meadow", "in a city", "on a farm",
        "in a jungle", "on an island", "in a castle", "on a rooftop", "in a stadium"
      ];
      
      // Use a more diverse set of time periods for even more uniqueness
      const timePeriods = [
        "at dawn", "at dusk", "at midnight", "during a storm", "on a sunny day",
        "in winter", "in summer", "during a holiday", "on a weekend", "in the 1920s",
        "in medieval times", "in the future", "during the Renaissance", "in prehistoric times", "during a festival"
      ];
      
      // Try different modification strategies until we get a unique activity
      
      // Strategy 1: Add a modifier
      const randomModifier = modifiers[Math.floor(Math.random() * modifiers.length)];
      activity.activityVerb = `${randomModifier} ${activity.activityVerb}`;
      
      // Check if this modified activity exists
      activityExists = await wordExists(activity.activityVerb);
      
      // Strategy 2: If still exists, add a location
      if (activityExists) {
        const randomLocation = locations[Math.floor(Math.random() * locations.length)];
        activity.activityVerb = `${activity.activityVerb} ${randomLocation}`;
        
        // Check if this modified activity exists
        activityExists = await wordExists(activity.activityVerb);
        
        // Strategy 3: If still exists, add a time period
        if (activityExists) {
          const randomTimePeriod = timePeriods[Math.floor(Math.random() * timePeriods.length)];
          activity.activityVerb = `${activity.activityVerb} ${randomTimePeriod}`;
          
          // Check if this modified activity exists
          activityExists = await wordExists(activity.activityVerb);
          
          // Strategy 4: If all else fails, add a unique identifier
          if (activityExists) {
            // Use a random number between 1-99 instead of a timestamp
            const randomNum = Math.floor(Math.random() * 99) + 1;
            activity.activityVerb = `${activity.activityVerb} (variation ${randomNum})`;
            
            // This should definitely be unique now
            activityExists = false;
          }
        }
      }
    }
    
    // Add the activity to our global registry
    console.log(`Adding activity to registry: "${activity.activityVerb}"`);
    await addWord(activity.activityVerb);
    
    // Ensure each component is unique in our global registry
    const uniqueComponents = [];
    for (const component of activity.components) {
      // First check if this component already exists in our uniqueComponents array
      const isDuplicate = uniqueComponents.some(
        existingComponent => existingComponent.toLowerCase() === component.toLowerCase()
      );
      
      if (isDuplicate) {
        // If it's a duplicate, generate a new component
        const newComponent = await generateUniqueComponent(activity.activityVerb, uniqueComponents);
        uniqueComponents.push(newComponent);
      } else {
        // Check if this component exists in our global registry
        const componentExists = await wordExists(component);
        
        if (componentExists) {
          // If it exists, generate a new component
          const newComponent = await generateUniqueComponent(activity.activityVerb, uniqueComponents);
          uniqueComponents.push(newComponent);
        } else {
          // If it doesn't exist, add it to our registry and uniqueComponents array
          await addWord(component);
          uniqueComponents.push(component);
        }
      }
    }
    
    // Ensure the activity has the correct number of components
    if (uniqueComponents.length === numComponents) {
      return {
        activityVerb: activity.activityVerb,
        selectedComponents: uniqueComponents
      };
    } else {
      // If component count doesn't match, adjust it
      const adjustedComponents = [...uniqueComponents];
      
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
    console.error("Error generating statement:", error);
    throw error;
  }
};

// Helper function to generate a unique component for an activity
const generateUniqueComponent = async (activityVerb, existingComponents) => {
  console.log(`Generating unique component for activity: ${activityVerb}`);
  
  // Try to use OpenAI to generate a component
  try {
    const newComponent = await openAIService.generateSingleComponent(
      activityVerb,
      existingComponents,
      new Set()
    );
    
    // Check if the component is valid and not generic
    if (newComponent && typeof newComponent === 'string' && newComponent.trim().length > 0 && !isGenericTerm(newComponent)) {
      // Check if this component already exists in our existingComponents array
      const isDuplicate = existingComponents.some(
        existingComponent => existingComponent.toLowerCase() === newComponent.toLowerCase()
      );
      
      if (isDuplicate) {
        // If it's a duplicate, try again with a more specific prompt
        return await generateSpecificUniqueComponent(activityVerb, existingComponents);
      }
      
      // Check if this component exists in our global registry
      const componentExists = await wordExists(newComponent);
      
      if (componentExists) {
        // If it exists, try again with a more specific prompt
        return await generateSpecificUniqueComponent(activityVerb, existingComponents);
      }
      
      // If it doesn't exist, add it to our registry and return it
      await addWord(newComponent);
      return newComponent;
    }
    
    // If the component is generic, try to generate a more specific one
    return await generateSpecificUniqueComponent(activityVerb, existingComponents);
  } catch (error) {
    console.error("Error generating component with OpenAI:", error);
    
    // Generate a unique component using our fallback system
    return await generateFallbackUniqueComponent(activityVerb, existingComponents);
  }
};

// Helper function to generate a more specific unique component
const generateSpecificUniqueComponent = async (activityVerb, existingComponents) => {
  console.log(`Generating specific unique component for activity: ${activityVerb}`);
  
  try {
    const specificComponent = await openAIService.generateSpecificComponent(
      activityVerb,
      existingComponents,
      new Set()
    );
    
    // Check if this component already exists in our existingComponents array
    const isDuplicate = existingComponents.some(
      existingComponent => existingComponent.toLowerCase() === specificComponent.toLowerCase()
    );
    
    if (isDuplicate) {
      // If it's a duplicate, use our fallback system
      return await generateFallbackUniqueComponent(activityVerb, existingComponents);
    }
    
    // Check if this component exists in our global registry
    const componentExists = await wordExists(specificComponent);
    
    if (componentExists) {
      // If it exists, use our fallback system
      return await generateFallbackUniqueComponent(activityVerb, existingComponents);
    }
    
    // If it doesn't exist, add it to our registry and return it
    await addWord(specificComponent);
    return specificComponent;
  } catch (error) {
    console.error("Error generating specific component:", error);
    
    // Use our fallback system
    return await generateFallbackUniqueComponent(activityVerb, existingComponents);
  }
};

// Helper function to generate a fallback unique component
const generateFallbackUniqueComponent = async (activityVerb, existingComponents) => {
  console.log(`Generating fallback unique component for activity: ${activityVerb}`);
  
  // Get a list of potential fallback components based on the activity
  const potentialComponents = [];
  
  // Add activity-specific components
  const activityLower = activityVerb.toLowerCase();
  
  // Cooking/baking related
  if (activityLower.includes("cook") || activityLower.includes("bak") || activityLower.includes("food")) {
    potentialComponents.push(...[
      "wooden spoon", "chef's knife", "measuring cup", "mixing bowl", "whisk", 
      "spatula", "oven mitt", "cutting board", "rolling pin", "frying pan",
      "apron", "recipe book", "timer", "blender", "food processor",
      "kitchen scale", "oven", "stove", "refrigerator", "dishwasher"
    ]);
  }
  
  // Sports related
  if (activityLower.includes("play") || activityLower.includes("sport") || activityLower.includes("game") || 
      activityLower.includes("ball") || activityLower.includes("tennis") || activityLower.includes("basketball")) {
    potentialComponents.push(...[
      "basketball", "tennis racket", "baseball bat", "hockey stick", "football helmet", 
      "soccer cleats", "golf club", "volleyball net", "referee whistle", "scoreboard",
      "jersey", "trophy", "stadium", "coach", "team captain",
      "water bottle", "sports bag", "stopwatch", "goal post", "basketball hoop"
    ]);
  }
  
  // Construction/building related
  if (activityLower.includes("build") || activityLower.includes("construct") || activityLower.includes("fix") || 
      activityLower.includes("repair") || activityLower.includes("install")) {
    potentialComponents.push(...[
      "hammer", "screwdriver", "power drill", "measuring tape", "level", 
      "nail", "screw", "wrench", "pliers", "saw",
      "hard hat", "safety goggles", "tool belt", "ladder", "blueprint",
      "workbench", "wood plank", "cement mixer", "paint brush", "sandpaper"
    ]);
  }
  
  // Add general components if we don't have enough activity-specific ones
  if (potentialComponents.length < 10) {
    potentialComponents.push(...[
      "coffee mug", "wristwatch", "sunglasses", "umbrella", "wallet", 
      "backpack", "notebook", "pencil", "scissors", "tape measure", 
      "flashlight", "camera", "bicycle", "helmet", "tennis racket", 
      "baseball bat", "paintbrush", "hammer", "screwdriver", "wrench"
    ]);
  }
  
  // Shuffle the potential components
  for (let i = potentialComponents.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [potentialComponents[i], potentialComponents[j]] = [potentialComponents[j], potentialComponents[i]];
  }
  
  // Try each potential component until we find one that's unique
  for (const component of potentialComponents) {
    // Check if this component already exists in our existingComponents array
    const isDuplicate = existingComponents.some(
      existingComponent => existingComponent.toLowerCase() === component.toLowerCase()
    );
    
    if (isDuplicate) {
      continue;
    }
    
    // Check if this component exists in our global registry
    const componentExists = await wordExists(component);
    
    if (componentExists) {
      continue;
    }
    
    // If it doesn't exist, add it to our registry and return it
    await addWord(component);
    return component;
  }
  
  // If we've exhausted all our potential components, generate a completely random one
  // using descriptive adjectives and specific nouns
  const adjectives = [
    "red", "blue", "green", "yellow", "purple", "orange", "black", "white", "silver", "golden",
    "wooden", "metal", "plastic", "glass", "ceramic", "leather", "silk", "cotton", "rubber", "stone",
    "giant", "tiny", "ancient", "modern", "digital", "analog", "vintage", "futuristic", "handmade", "electric"
  ];
  
  const nouns = [
    "table", "chair", "lamp", "clock", "mirror", "vase", "statue", "painting", "carpet", "curtain",
    "book", "pen", "phone", "computer", "television", "radio", "camera", "headphones", "speaker", "microphone",
    "hat", "gloves", "scarf", "boots", "jacket", "shirt", "pants", "dress", "ring", "necklace"
  ];
  
  // Try up to 20 random combinations
  for (let i = 0; i < 20; i++) {
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomComponent = `${randomAdjective} ${randomNoun}`;
    
    // Check if this component already exists in our existingComponents array
    const isDuplicate = existingComponents.some(
      existingComponent => existingComponent.toLowerCase() === randomComponent.toLowerCase()
    );
    
    if (isDuplicate) {
      continue;
    }
    
    // Check if this component exists in our global registry
    const componentExists = await wordExists(randomComponent);
    
    if (componentExists) {
      continue;
    }
    
    // If it doesn't exist, add it to our registry and return it
    await addWord(randomComponent);
    return randomComponent;
  }
  
  // If all else fails, use a truly unique descriptor with a common noun
  const uniqueDescriptor = `special ${Math.floor(Math.random() * 100) + 1}`;
  const finalNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const finalComponent = `${uniqueDescriptor} ${finalNoun}`;
  
  await addWord(finalComponent);
  return finalComponent;
};
