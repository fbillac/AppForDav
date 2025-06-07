import openAIService from './openaiService';
import { wordExists, addWord, initializeRegistry } from './globalWordRegistry';

// Ensure registry is initialized before any operations
let registryInitPromise = null;

const ensureRegistryInitialized = async () => {
  if (!registryInitPromise) {
    registryInitPromise = initializeRegistry();
  }
  return registryInitPromise;
};

// Replace words in a statement with incongruous alternatives
export const replaceWords = async (statement, usedWords) => {
  try {
    // Ensure registry is initialized
    await ensureRegistryInitialized();
    
    console.log("Replacing words in statement:", statement.activityVerb);
    
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
    
    // Get replacements from OpenAI
    const replacements = await openAIService.generateReplacements(
      statement.selectedComponents,
      usedWords
    );
    
    // Validate the replacements
    if (!replacements || !Array.isArray(replacements) || replacements.length !== statement.selectedComponents.length) {
      console.error("Invalid replacements format from OpenAI:", replacements);
      throw new Error("Invalid replacements format from OpenAI");
    }
    
    // Check for uniqueness of replacements
    const seenReplacements = new Set();
    const uniqueReplacements = [];
    
    for (let i = 0; i < replacements.length; i++) {
      const replacement = replacements[i];
      
      // Validate the replacement object
      if (!replacement || !replacement.original || !replacement.replacement) {
        console.error("Invalid replacement object:", replacement);
        
        // Generate a fallback replacement
        const fallbackReplacement = await generateFallbackReplacement(
          statement.selectedComponents[i],
          statement.activityVerb,
          seenReplacements,
          usedWords
        );
        
        uniqueReplacements.push({
          original: statement.selectedComponents[i],
          replacement: fallbackReplacement
        });
        
        // Add to seen replacements
        seenReplacements.add(fallbackReplacement.toLowerCase());
        
        // Add to global registry
        await addWord(fallbackReplacement);
        
        // Add all individual words to prevent partial repeats
        const words = fallbackReplacement.toLowerCase().split(/\s+/);
        for (const word of words) {
          if (word.length > 3) { // Only add significant words
            seenReplacements.add(word);
            await addWord(word);
          }
        }
        
        continue;
      }
      
      // Check if this replacement already exists in our seen replacements
      // or if any part of it exists as a standalone word
      const replacementLower = replacement.replacement.toLowerCase();
      const replacementWords = replacementLower.split(/\s+/);
      const hasPartialMatch = replacementWords.some(word => 
        word.length > 3 && seenReplacements.has(word)
      );
      
      if (seenReplacements.has(replacementLower) || hasPartialMatch) {
        console.log(`Duplicate replacement detected: ${replacement.replacement}`);
        
        // Generate a new unique replacement
        const uniqueReplacement = await generateUniqueReplacement(
          replacement.original,
          statement.activityVerb,
          seenReplacements,
          usedWords
        );
        
        uniqueReplacements.push({
          original: replacement.original,
          replacement: uniqueReplacement
        });
        
        // Add to seen replacements
        seenReplacements.add(uniqueReplacement.toLowerCase());
        
        // Add all individual words to prevent partial repeats
        const words = uniqueReplacement.toLowerCase().split(/\s+/);
        for (const word of words) {
          if (word.length > 3) { // Only add significant words
            seenReplacements.add(word);
            await addWord(word);
          }
        }
      } else {
        // Check if this replacement exists in our global registry
        // or if any part of it exists as a standalone word
        const replacementExists = await wordExists(replacementLower);
        const hasPartialWordMatch = await Promise.all(
          replacementWords.filter(word => word.length > 3)
            .map(async word => await wordExists(word))
        ).then(results => results.some(Boolean));
        
        if (replacementExists || hasPartialWordMatch) {
          console.log(`Replacement already exists in registry: ${replacement.replacement}`);
          
          // Generate a new unique replacement
          const uniqueReplacement = await generateUniqueReplacement(
            replacement.original,
            statement.activityVerb,
            seenReplacements,
            usedWords
          );
          
          uniqueReplacements.push({
            original: replacement.original,
            replacement: uniqueReplacement
          });
          
          // Add to seen replacements
          seenReplacements.add(uniqueReplacement.toLowerCase());
          
          // Add all individual words to prevent partial repeats
          const words = uniqueReplacement.toLowerCase().split(/\s+/);
          for (const word of words) {
            if (word.length > 3) { // Only add significant words
              seenReplacements.add(word);
              await addWord(word);
            }
          }
        } else {
          // This is a unique replacement
          uniqueReplacements.push(replacement);
          
          // Add to seen replacements
          seenReplacements.add(replacementLower);
          
          // Add to global registry
          await addWord(replacementLower);
          
          // Add all individual words to prevent partial repeats
          for (const word of replacementWords) {
            if (word.length > 3) { // Only add significant words
              seenReplacements.add(word);
              await addWord(word);
            }
          }
        }
      }
    }
    
    return {
      replacements: uniqueReplacements
    };
  } catch (error) {
    console.error("Error replacing words:", error);
    throw error;
  }
};

// Replace a single word with an incongruous alternative
export const replaceIndividualWord = async (word, activityVerb, usedWords, isOriginal = true) => {
  try {
    // Ensure registry is initialized
    await ensureRegistryInitialized();
    
    console.log(`Replacing individual word: ${word} (isOriginal: ${isOriginal})`);
    
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
    
    // If this is an original component, we want to generate a new component that fits the activity
    if (isOriginal) {
      // Generate a new component using OpenAI
      const newComponent = await openAIService.generateSingleComponent(
        activityVerb,
        [word], // Exclude the current word
        usedWords
      );
      
      // Check if this component exists in our global registry
      const componentExists = await wordExists(newComponent);
      const componentWords = newComponent.toLowerCase().split(/\s+/);
      const hasPartialWordMatch = await Promise.all(
        componentWords.filter(word => word.length > 3)
          .map(async word => await wordExists(word))
      ).then(results => results.some(Boolean));
      
      if (componentExists || hasPartialWordMatch) {
        // If it exists, try to generate a more specific component
        const specificComponent = await openAIService.generateSpecificComponent(
          activityVerb,
          [word], // Exclude the current word
          usedWords
        );
        
        // Check if this specific component exists in our global registry
        const specificComponentExists = await wordExists(specificComponent);
        const specificWords = specificComponent.toLowerCase().split(/\s+/);
        const hasSpecificPartialMatch = await Promise.all(
          specificWords.filter(word => word.length > 3)
            .map(async word => await wordExists(word))
        ).then(results => results.some(Boolean));
        
        if (specificComponentExists || hasSpecificPartialMatch) {
          // If it still exists, use our fallback system
          const fallback = await generateFallbackOriginalWord(activityVerb, word);
          
          // Add all individual words to prevent partial repeats
          const fallbackWords = fallback.toLowerCase().split(/\s+/);
          for (const word of fallbackWords) {
            if (word.length > 3) { // Only add significant words
              await addWord(word);
            }
          }
          
          return fallback;
        }
        
        // Add to global registry
        await addWord(specificComponent);
        
        // Add all individual words to prevent partial repeats
        for (const word of specificWords) {
          if (word.length > 3) { // Only add significant words
            await addWord(word);
          }
        }
        
        return specificComponent;
      }
      
      // Add to global registry
      await addWord(newComponent);
      
      // Add all individual words to prevent partial repeats
      for (const word of componentWords) {
        if (word.length > 3) { // Only add significant words
          await addWord(word);
        }
      }
      
      return newComponent;
    } else {
      // This is a replacement word, so we want to generate an incongruous replacement
      // Generate a single replacement using OpenAI
      const replacements = await openAIService.generateReplacements(
        [word],
        usedWords,
        true // Force incongruous
      );
      
      // Validate the replacements
      if (!replacements || !Array.isArray(replacements) || replacements.length === 0 ||
          !replacements[0] || !replacements[0].replacement) {
        console.error("Invalid replacement format from OpenAI:", replacements);
        
        // Generate a fallback replacement
        const fallback = await generateFallbackReplacement(word, activityVerb, new Set(), usedWords);
        
        // Add all individual words to prevent partial repeats
        const fallbackWords = fallback.toLowerCase().split(/\s+/);
        for (const word of fallbackWords) {
          if (word.length > 3) { // Only add significant words
            await addWord(word);
          }
        }
        
        return fallback;
      }
      
      const replacement = replacements[0].replacement;
      const replacementLower = replacement.toLowerCase();
      const replacementWords = replacementLower.split(/\s+/);
      
      // Check if this replacement exists in our global registry
      const replacementExists = await wordExists(replacementLower);
      const hasPartialWordMatch = await Promise.all(
        replacementWords.filter(word => word.length > 3)
          .map(async word => await wordExists(word))
      ).then(results => results.some(Boolean));
      
      if (replacementExists || hasPartialWordMatch) {
        // If it exists, try to generate a random word
        const randomWord = await openAIService.generateRandomWord(
          word.toLowerCase().includes("person") || 
          word.toLowerCase().includes("player") || 
          word.toLowerCase().includes("chef") || 
          word.toLowerCase().includes("doctor")
        );
        
        // Check if this random word exists in our global registry
        const randomWordLower = randomWord.toLowerCase();
        const randomWordExists = await wordExists(randomWordLower);
        const randomWords = randomWordLower.split(/\s+/);
        const hasRandomPartialMatch = await Promise.all(
          randomWords.filter(word => word.length > 3)
            .map(async word => await wordExists(word))
        ).then(results => results.some(Boolean));
        
        if (randomWordExists || hasRandomPartialMatch) {
          // If it still exists, use our fallback system
          const fallback = await generateFallbackReplacement(word, activityVerb, new Set(), usedWords);
          
          // Add all individual words to prevent partial repeats
          const fallbackWords = fallback.toLowerCase().split(/\s+/);
          for (const word of fallbackWords) {
            if (word.length > 3) { // Only add significant words
              await addWord(word);
            }
          }
          
          return fallback;
        }
        
        // Add to global registry
        await addWord(randomWordLower);
        
        // Add all individual words to prevent partial repeats
        for (const word of randomWords) {
          if (word.length > 3) { // Only add significant words
            await addWord(word);
          }
        }
        
        return randomWord;
      }
      
      // Add to global registry
      await addWord(replacementLower);
      
      // Add all individual words to prevent partial repeats
      for (const word of replacementWords) {
        if (word.length > 3) { // Only add significant words
          await addWord(word);
        }
      }
      
      return replacement;
    }
  } catch (error) {
    console.error("Error replacing individual word:", error);
    
    // Use fallback system
    if (isOriginal) {
      const fallback = await generateFallbackOriginalWord(activityVerb, word);
      
      // Add all individual words to prevent partial repeats
      const fallbackWords = fallback.toLowerCase().split(/\s+/);
      for (const word of fallbackWords) {
        if (word.length > 3) { // Only add significant words
          await addWord(word);
        }
      }
      
      return fallback;
    } else {
      const fallback = await generateFallbackReplacement(word, activityVerb, new Set(), usedWords);
      
      // Add all individual words to prevent partial repeats
      const fallbackWords = fallback.toLowerCase().split(/\s+/);
      for (const word of fallbackWords) {
        if (word.length > 3) { // Only add significant words
          await addWord(word);
        }
      }
      
      return fallback;
    }
  }
};

// Generate a unique replacement for a word
const generateUniqueReplacement = async (original, activityVerb, seenReplacements, usedWords) => {
  // Ensure registry is initialized
  await ensureRegistryInitialized();
  
  console.log(`Generating unique replacement for: ${original}`);
  
  // Try to use OpenAI to generate a replacement
  try {
    // Generate a single replacement using OpenAI
    const replacements = await openAIService.generateReplacements(
      [original],
      usedWords,
      true // Force incongruous
    );
    
    // Validate the replacements
    if (!replacements || !Array.isArray(replacements) || replacements.length === 0 ||
        !replacements[0] || !replacements[0].replacement) {
      console.error("Invalid replacement format from OpenAI:", replacements);
      
      // Generate a fallback replacement
      return await generateFallbackReplacement(original, activityVerb, seenReplacements, usedWords);
    }
    
    const replacement = replacements[0].replacement;
    const replacementLower = replacement.toLowerCase();
    const replacementWords = replacementLower.split(/\s+/);
    
    // Check if this replacement already exists in our seen replacements
    // or if any part of it exists as a standalone word
    const hasPartialMatch = replacementWords.some(word => 
      word.length > 3 && seenReplacements.has(word)
    );
    
    if (seenReplacements.has(replacementLower) || hasPartialMatch) {
      // If it's a duplicate, try to generate a random word
      const randomWord = await openAIService.generateRandomWord(
        original.toLowerCase().includes("person") || 
        original.toLowerCase().includes("player") || 
        original.toLowerCase().includes("chef") || 
        original.toLowerCase().includes("doctor")
      );
      
      const randomWordLower = randomWord.toLowerCase();
      const randomWords = randomWordLower.split(/\s+/);
      
      // Check if this random word already exists in our seen replacements
      // or if any part of it exists as a standalone word
      const hasRandomPartialMatch = randomWords.some(word => 
        word.length > 3 && seenReplacements.has(word)
      );
      
      if (seenReplacements.has(randomWordLower) || hasRandomPartialMatch) {
        // If it's still a duplicate, use our fallback system
        return await generateFallbackReplacement(original, activityVerb, seenReplacements, usedWords);
      }
      
      return randomWord;
    }
    
    // Check if this replacement exists in our global registry
    // or if any part of it exists as a standalone word
    const replacementExists = await wordExists(replacementLower);
    const hasPartialWordMatch = await Promise.all(
      replacementWords.filter(word => word.length > 3)
        .map(async word => await wordExists(word))
    ).then(results => results.some(Boolean));
    
    if (replacementExists || hasPartialWordMatch) {
      // If it exists, try to generate a random word
      const randomWord = await openAIService.generateRandomWord(
        original.toLowerCase().includes("person") || 
        original.toLowerCase().includes("player") || 
        original.toLowerCase().includes("chef") || 
        original.toLowerCase().includes("doctor")
      );
      
      const randomWordLower = randomWord.toLowerCase();
      const randomWords = randomWordLower.split(/\s+/);
      
      // Check if this random word exists in our global registry
      // or if any part of it exists as a standalone word
      const randomWordExists = await wordExists(randomWordLower);
      const hasRandomPartialMatch = await Promise.all(
        randomWords.filter(word => word.length > 3)
          .map(async word => await wordExists(word))
      ).then(results => results.some(Boolean));
      
      if (randomWordExists || hasRandomPartialMatch) {
        // If it still exists, use our fallback system
        return await generateFallbackReplacement(original, activityVerb, seenReplacements, usedWords);
      }
      
      return randomWord;
    }
    
    return replacement;
  } catch (error) {
    console.error("Error generating unique replacement:", error);
    
    // Use fallback system
    return await generateFallbackReplacement(original, activityVerb, seenReplacements, usedWords);
  }
};

// Generate a fallback replacement for a word
const generateFallbackReplacement = async (original, activityVerb, seenReplacements, usedWords) => {
  // Ensure registry is initialized
  await ensureRegistryInitialized();
  
  console.log(`Generating fallback replacement for: ${original}`);
  
  // Define categories of words that are highly incongruous with each other
  const categories = {
    animals: [
      "elephant", "giraffe", "penguin", "octopus", "kangaroo", "flamingo", "porcupine", "platypus",
      "walrus", "koala", "sloth", "narwhal", "armadillo", "chameleon", "peacock", "jellyfish",
      "rhinoceros", "hippopotamus", "crocodile", "butterfly", "dolphin", "gorilla", "panda", "zebra"
    ],
    foods: [
      "spaghetti", "watermelon", "cupcake", "burrito", "pineapple", "pancake", "sushi", "pretzel",
      "popcorn", "avocado", "cheesecake", "taco", "waffle", "donut", "hamburger", "pizza",
      "chocolate", "banana", "strawberry", "broccoli", "carrot", "potato", "muffin", "cookie"
    ],
    objects: [
      "telescope", "umbrella", "trampoline", "helicopter", "submarine", "volcano", "pyramid", "lighthouse",
      "rollercoaster", "snowglobe", "typewriter", "chandelier", "microscope", "parachute", "hammock", "escalator",
      "skateboard", "bicycle", "wheelchair", "elevator", "telescope", "compass", "binoculars", "telescope"
    ],
    characters: [
      "astronaut", "pirate", "ninja", "wizard", "vampire", "robot", "superhero", "mermaid",
      "cowboy", "ballerina", "knight", "fairy", "zombie", "detective", "clown", "firefighter",
      "princess", "dragon", "unicorn", "dinosaur", "ghost", "witch", "alien", "caveman"
    ],
    places: [
      "castle", "igloo", "treehouse", "spaceship", "submarine", "volcano", "pyramid", "lighthouse",
      "waterfall", "island", "cave", "desert", "jungle", "mountain", "beach", "forest",
      "skyscraper", "stadium", "museum", "amusement park", "aquarium", "zoo", "library", "theater"
    ]
  };
  
  // Determine which category the original word might belong to
  let originalCategory = null;
  for (const [category, words] of Object.entries(categories)) {
    if (words.some(word => original.toLowerCase().includes(word.toLowerCase()))) {
      originalCategory = category;
      break;
    }
  }
  
  // If we couldn't determine the category, make a guess based on the activity
  if (!originalCategory) {
    const activityLower = activityVerb.toLowerCase();
    
    if (activityLower.includes("cook") || activityLower.includes("bak") || activityLower.includes("food")) {
      originalCategory = "foods";
    } else if (activityLower.includes("zoo") || activityLower.includes("pet") || activityLower.includes("farm")) {
      originalCategory = "animals";
    } else if (activityLower.includes("build") || activityLower.includes("fix") || activityLower.includes("make")) {
      originalCategory = "objects";
    } else if (activityLower.includes("play") || activityLower.includes("act") || activityLower.includes("perform")) {
      originalCategory = "characters";
    } else if (activityLower.includes("visit") || activityLower.includes("travel") || activityLower.includes("explore")) {
      originalCategory = "places";
    } else {
      // Default to objects if we can't determine
      originalCategory = "objects";
    }
  }
  
  // Choose a different category for the replacement
  const availableCategories = Object.keys(categories).filter(category => category !== originalCategory);
  const replacementCategory = availableCategories[Math.floor(Math.random() * availableCategories.length)];
  
  // Get words from the replacement category
  const replacementWords = categories[replacementCategory];
  
  // Shuffle the replacement words
  for (let i = replacementWords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [replacementWords[i], replacementWords[j]] = [replacementWords[j], replacementWords[i]];
  }
  
  // Try each replacement word until we find one that's unique
  for (const word of replacementWords) {
    // Check if this word already exists in our seen replacements
    if (seenReplacements && seenReplacements.has(word.toLowerCase())) {
      continue;
    }
    
    // Check if this word exists in our global registry
    const wordExistsInRegistry = await wordExists(word);
    
    if (wordExistsInRegistry) {
      continue;
    }
    
    // This is a unique word
    return word;
  }
  
  // If we've exhausted all our replacement words, generate a completely unique one
  // by combining an adjective with a noun from a different category
  const adjectives = [
    "giant", "tiny", "invisible", "magical", "glowing", "floating", "dancing", "singing",
    "melting", "exploding", "rainbow", "crystal", "golden", "silver", "ancient", "futuristic"
  ];
  
  // Choose a random adjective
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  
  // Choose a random category different from the original
  const finalCategory = availableCategories[Math.floor(Math.random() * availableCategories.length)];
  
  // Choose a random word from that category
  const randomWord = categories[finalCategory][Math.floor(Math.random() * categories[finalCategory].length)];
  
  // Combine them
  const uniqueReplacement = `${randomAdjective} ${randomWord}`;
  
  // Check if this combined word exists in our global registry
  const combinedWordExists = await wordExists(uniqueReplacement);
  
  if (combinedWordExists) {
    // If it still exists, use a truly unique descriptor
    const uniqueDescriptor = `special ${Date.now() % 1000}`;
    return `${uniqueDescriptor} ${randomWord}`;
  }
  
  return uniqueReplacement;
};

// Generate a fallback original word for an activity
const generateFallbackOriginalWord = async (activityVerb, currentWord) => {
  // Ensure registry is initialized
  await ensureRegistryInitialized();
  
  console.log(`Generating fallback original word for activity: ${activityVerb}`);
  
  // Get a list of potential components based on the activity
  const activityLower = activityVerb.toLowerCase();
  
  // Define potential components for different activity types
  const potentialComponents = {
    cooking: [
      "wooden spoon", "chef's knife", "measuring cup", "mixing bowl", "whisk", 
      "spatula", "oven mitt", "cutting board", "rolling pin", "frying pan",
      "apron", "recipe book", "timer", "blender", "food processor",
      "kitchen scale", "oven", "stove", "refrigerator", "dishwasher"
    ],
    sports: [
      "basketball", "tennis racket", "baseball bat", "hockey stick", "football helmet", 
      "soccer cleats", "golf club", "volleyball net", "referee whistle", "scoreboard",
      "jersey", "trophy", "stadium", "coach", "team captain",
      "water bottle", "sports bag", "stopwatch", "goal post", "basketball hoop"
    ],
    construction: [
      "hammer", "screwdriver", "power drill", "measuring tape", "level", 
      "nail", "screw", "wrench", "pliers", "saw",
      "hard hat", "safety goggles", "tool belt", "ladder", "blueprint",
      "workbench", "wood plank", "cement mixer", "paint brush", "sandpaper"
    ],
    cleaning: [
      "sponge", "mop", "broom", "vacuum cleaner", "duster", 
      "spray bottle", "rubber gloves", "scrub brush", "paper towel", "trash bag",
      "bucket", "soap", "detergent", "washing machine", "clothespin",
      "laundry basket", "iron", "feather duster", "window cleaner", "toilet brush"
    ],
    art: [
      "paintbrush", "canvas", "easel", "palette", "pencil", 
      "sketchbook", "charcoal", "watercolor", "clay", "sculpting tool",
      "paint tube", "eraser", "drawing board", "art gallery", "frame",
      "pottery wheel", "kiln", "chisel", "art museum", "color wheel"
    ],
    music: [
      "guitar", "piano", "drum", "microphone", "sheet music", 
      "violin", "trumpet", "flute", "saxophone", "conductor's baton",
      "metronome", "amplifier", "headphones", "recording studio", "stage",
      "concert hall", "orchestra pit", "music stand", "tuning fork", "synthesizer"
    ],
    outdoor: [
      "hiking boots", "tent", "fishing rod", "compass", "backpack", 
      "binoculars", "water bottle", "sleeping bag", "flashlight", "trowel",
      "canoe", "kayak", "life jacket", "campfire", "trail map",
      "walking stick", "insect repellent", "sunscreen", "first aid kit", "pocket knife"
    ]
  };
  
  // Determine which category the activity belongs to
  let activityCategory = null;
  
  if (activityLower.includes("cook") || activityLower.includes("bak") || activityLower.includes("food")) {
    activityCategory = "cooking";
  } else if (activityLower.includes("play") || activityLower.includes("sport") || activityLower.includes("game") || 
             activityLower.includes("ball") || activityLower.includes("tennis") || activityLower.includes("basketball")) {
    activityCategory = "sports";
  } else if (activityLower.includes("build") || activityLower.includes("construct") || activityLower.includes("fix") || 
             activityLower.includes("repair") || activityLower.includes("install")) {
    activityCategory = "construction";
  } else if (activityLower.includes("clean") || activityLower.includes("wash") || activityLower.includes("scrub") || 
             activityLower.includes("dust") || activityLower.includes("vacuum")) {
    activityCategory = "cleaning";
  } else if (activityLower.includes("paint") || activityLower.includes("draw") || activityLower.includes("sketch") || 
             activityLower.includes("art") || activityLower.includes("craft")) {
    activityCategory = "art";
  } else if (activityLower.includes("music") || activityLower.includes("play") || activityLower.includes("sing") || 
             activityLower.includes("guitar") || activityLower.includes("piano")) {
    activityCategory = "music";
  } else if (activityLower.includes("hike") || activityLower.includes("camp") || activityLower.includes("fish") || 
             activityLower.includes("hunt") || activityLower.includes("garden")) {
    activityCategory = "outdoor";
  } else {
    // Default to a mix of categories
    activityCategory = "mixed";
  }
  
  // Get components for the activity category
  let components = [];
  
  if (activityCategory === "mixed") {
    // Mix components from all categories
    for (const category of Object.values(potentialComponents)) {
      components = components.concat(category);
    }
  } else {
    components = potentialComponents[activityCategory];
  }
  
  // Shuffle the components
  for (let i = components.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [components[i], components[j]] = [components[j], components[i]];
  }
  
  // Try each component until we find one that's unique
  for (const component of components) {
    // Skip the current word
    if (component.toLowerCase() === currentWord.toLowerCase()) {
      continue;
    }
    
    // Check if this component exists in our global registry
    const componentExists = await wordExists(component);
    
    if (componentExists) {
      continue;
    }
    
    // This is a unique component
    return component;
  }
  
  // If we've exhausted all our components, generate a completely unique one
  // by combining an adjective with a noun
  const adjectives = [
    "wooden", "metal", "plastic", "glass", "ceramic", "leather", "silk", "cotton", "rubber", "stone",
    "red", "blue", "green", "yellow", "purple", "orange", "black", "white", "silver", "golden",
    "large", "small", "heavy", "light", "thick", "thin", "wide", "narrow", "tall", "short"
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
    
    // Check if this component exists in our global registry
    const componentExists = await wordExists(randomComponent);
    
    if (componentExists) {
      continue;
    }
    
    // This is a unique component
    return randomComponent;
  }
  
  // If all else fails, use a truly unique descriptor with a common noun
  const uniqueDescriptor = `special ${Date.now() % 1000}`;
  const finalNoun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${uniqueDescriptor} ${finalNoun}`;
};
