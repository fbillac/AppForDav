// This module handles replacing words with unrelated ones for humor and challenge
import { isPersonOrRole, getRandomCelebrityOrCharacter, getRandomMaterial } from './componentReplacer';
import { checkReplacementExistsUnified, addReplacementUnified } from './repetitionPrevention';
import openAIService from './openaiService';

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

// Helper function to generate specific replacements based on category
function generateSpecificReplacement(category) {
  // Specific replacements for different categories
  const specificReplacements = {
    tools: ["hammer", "screwdriver", "wrench", "pliers", "saw", "drill", "chisel", "mallet", "clamp"],
    kitchenItems: ["pot", "pan", "spatula", "whisk", "bowl", "spoon", "knife", "cutting board", "plate"],
    furniture: ["chair", "table", "desk", "couch", "sofa", "bed", "bookshelf", "cabinet", "dresser"],
    electronics: ["computer", "phone", "tablet", "laptop", "television", "camera", "headphones", "speaker"],
    clothing: ["shirt", "pants", "jacket", "hat", "gloves", "shoes", "boots", "socks", "scarf"],
    vehicles: ["car", "truck", "bus", "train", "airplane", "bicycle", "motorcycle", "boat", "ship"],
    instruments: ["guitar", "piano", "drum", "violin", "flute", "trumpet", "saxophone", "harp"],
    sports: ["baseball", "football", "basketball", "soccer", "tennis", "golf", "hockey", "volleyball"],
    foodItems: ["apple", "banana", "orange", "bread", "cheese", "meat", "vegetable", "fruit"],
    animals: ["dog", "cat", "bird", "fish", "horse", "cow", "sheep", "chicken", "pig"],
    professions: ["doctor", "teacher", "engineer", "chef", "artist", "musician", "writer", "athlete"]
  };
  
  // Select a random category different from the input category
  const categories = Object.keys(specificReplacements).filter(cat => cat !== category);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  
  // Select a random item from the category
  const items = specificReplacements[randomCategory];
  return items[Math.floor(Math.random() * items.length)];
}

// Lists of unrelated objects and characters for replacements (fallback if OpenAI fails)
export const unrelatedObjects = [
  // Common household items
  "toaster", "blender", "vacuum cleaner", "microwave", "refrigerator", "washing machine",
  "television", "couch", "lamp", "coffee table", "bookshelf", "bed", "pillow", "blanket",
  "curtain", "rug", "mirror", "clock", "picture frame", "vase", "plant", "candle",
  
  // Office items
  "stapler", "paperclip", "sticky note", "pen", "pencil", "marker", "highlighter",
  "notebook", "binder", "folder", "paper", "printer", "scanner", "computer", "keyboard",
  "mouse", "monitor", "desk", "chair", "filing cabinet", "trash can", "calendar",
  
  // Food items
  "banana", "apple", "orange", "grape", "strawberry", "blueberry", "watermelon",
  "pineapple", "mango", "peach", "pear", "plum", "cherry", "kiwi", "lemon", "lime",
  "carrot", "broccoli", "cauliflower", "spinach", "lettuce", "tomato", "potato",
  "onion", "garlic", "pepper", "cucumber", "zucchini", "eggplant", "mushroom",
  "bread", "bagel", "muffin", "croissant", "donut", "cake", "cookie", "pie",
  "ice cream", "yogurt", "cheese", "milk", "butter", "egg", "bacon", "sausage",
  "chicken", "beef", "pork", "fish", "shrimp", "lobster", "crab", "clam", "oyster",
  
  // Clothing items
  "shirt", "t-shirt", "blouse", "sweater", "jacket", "coat", "vest", "pants",
  "jeans", "shorts", "skirt", "dress", "suit", "tie", "bow tie", "scarf", "hat",
  "cap", "beanie", "gloves", "mittens", "socks", "shoes", "boots", "sandals",
  "flip flops", "slippers", "belt", "suspenders", "watch", "bracelet", "necklace",
  "earrings", "ring", "sunglasses", "glasses", "contact lenses", "umbrella",
  
  // Transportation items
  "car", "truck", "van", "bus", "train", "subway", "tram", "bicycle", "motorcycle",
  "scooter", "skateboard", "roller skates", "airplane", "helicopter", "boat", "ship",
  "yacht", "jet ski", "canoe", "kayak", "raft", "hot air balloon", "rocket", "spaceship",
  
  // Electronics
  "smartphone", "tablet", "laptop", "desktop", "smartwatch", "fitness tracker",
  "headphones", "earbuds", "speaker", "microphone", "camera", "video camera",
  "drone", "virtual reality headset", "gaming console", "remote control", "charger",
  "power bank", "USB drive", "memory card", "hard drive", "router", "modem",
  
  // Tools
  "hammer", "screwdriver", "wrench", "pliers", "saw", "drill", "level", "tape measure",
  "ruler", "square", "compass", "chisel", "mallet", "clamp", "vise", "sandpaper",
  "paintbrush", "roller", "ladder", "wheelbarrow", "shovel", "rake", "hoe", "trowel",
  "lawnmower", "hedge trimmer", "chainsaw", "axe", "crowbar", "sledgehammer",
  
  // Sports equipment
  "baseball", "baseball bat", "baseball glove", "football", "basketball", "soccer ball",
  "volleyball", "tennis ball", "tennis racket", "golf ball", "golf club", "hockey puck",
  "hockey stick", "frisbee", "boomerang", "bowling ball", "bowling pin", "pool cue",
  "pool ball", "dart", "dartboard", "jump rope", "hula hoop", "trampoline", "treadmill",
  "exercise bike", "rowing machine", "weight bench", "dumbbell", "barbell", "kettlebell",
  
  // Musical instruments
  "guitar", "bass guitar", "electric guitar", "acoustic guitar", "piano", "keyboard",
  "synthesizer", "drum", "drum set", "cymbal", "snare drum", "bass drum", "bongo",
  "conga", "tambourine", "triangle", "xylophone", "marimba", "vibraphone", "violin",
  "viola", "cello", "double bass", "harp", "flute", "piccolo", "clarinet", "oboe",
  "bassoon", "saxophone", "trumpet", "trombone", "tuba", "French horn", "harmonica",
  "accordion", "bagpipe", "banjo", "mandolin", "ukulele", "sitar", "theremin",
  
  // Toys and games
  "doll", "action figure", "stuffed animal", "teddy bear", "building blocks", "lego",
  "puzzle", "board game", "card game", "dice", "chess", "checkers", "backgammon",
  "monopoly", "scrabble", "jenga", "yo-yo", "top", "kite", "marble", "jacks",
  "ball", "balloon", "bubble wand", "water gun", "nerf gun", "slingshot", "pogo stick"
];

export const unrelatedCharacters = [
  // Fictional characters
  "Mickey Mouse", "Donald Duck", "Goofy", "Minnie Mouse", "Pluto", "Daisy Duck",
  "Bugs Bunny", "Daffy Duck", "Porky Pig", "Elmer Fudd", "Tweety Bird", "Sylvester",
  "Road Runner", "Wile E. Coyote", "Marvin the Martian", "Yosemite Sam", "Foghorn Leghorn",
  "Popeye", "Olive Oyl", "Bluto", "Betty Boop", "Felix the Cat", "Tom", "Jerry",
  "Scooby-Doo", "Shaggy", "Fred", "Velma", "Daphne", "Scrappy-Doo",
  "Fred Flintstone", "Wilma Flintstone", "Barney Rubble", "Betty Rubble", "Pebbles", "Bamm-Bamm",
  "George Jetson", "Jane Jetson", "Judy Jetson", "Elroy Jetson", "Astro", "Rosie the Robot",
  "Yogi Bear", "Boo-Boo Bear", "Ranger Smith", "Huckleberry Hound", "Snagglepuss", "Quick Draw McGraw",
  "Top Cat", "Magilla Gorilla", "Peter Potamus", "Squiddly Diddly", "Atom Ant", "Secret Squirrel",
  "Jonny Quest", "Hadji", "Dr. Benton Quest", "Race Bannon", "Bandit",
  "Space Ghost", "Birdman", "Mightor", "Shazzan", "Moby Dick", "Jabberjaw",
  "Hong Kong Phooey", "Captain Caveman", "Blue Falcon", "Dynomutt", "Speed Buggy",
  "The Flintstones", "The Jetsons", "The Smurfs", "Papa Smurf", "Smurfette", "Brainy Smurf", "Hefty Smurf",
  "He-Man", "Skeletor", "She-Ra", "Catra", "Man-At-Arms", "Teela", "Beast Man", "Evil-Lyn",
  "Lion-O", "Cheetara", "Panthro", "Tygra", "Mumm-Ra", "Snarf",
  "Optimus Prime", "Megatron", "Bumblebee", "Starscream", "Jazz", "Soundwave", "Grimlock",
  "Duke", "Cobra Commander", "Snake Eyes", "Scarlett", "Destro", "Baroness", "Storm Shadow",
  "Leonardo", "Donatello", "Raphael", "Michelangelo", "Splinter", "Shredder", "April O'Neil",
  "Superman", "Batman", "Wonder Woman", "Flash", "Green Lantern", "Aquaman", "Martian Manhunter",
  "Spider-Man", "Iron Man", "Captain America", "Thor", "Hulk", "Black Widow", "Hawkeye",
  "Wolverine", "Cyclops", "Jean Grey", "Storm", "Professor X", "Magneto", "Mystique",
  "Mario", "Luigi", "Princess Peach", "Bowser", "Yoshi", "Toad", "Wario", "Waluigi",
  "Sonic the Hedgehog", "Tails", "Knuckles", "Amy Rose", "Dr. Eggman", "Shadow", "Rouge"
];

// Helper function to determine if two words are in the same category
const areWordsInSameCategory = (word1, word2) => {
  // Convert to lowercase for case-insensitive comparison
  const w1 = word1.toLowerCase();
  const w2 = word2.toLowerCase();
  
  // Define categories for comparison
  const categories = {
    tools: ["hammer", "screwdriver", "wrench", "pliers", "saw", "drill", "chisel", "mallet", "clamp"],
    kitchenItems: ["pot", "pan", "spatula", "whisk", "bowl", "spoon", "knife", "cutting board", "plate"],
    furniture: ["chair", "table", "desk", "couch", "sofa", "bed", "bookshelf", "cabinet", "dresser"],
    electronics: ["computer", "phone", "tablet", "laptop", "television", "camera", "headphones", "speaker"],
    clothing: ["shirt", "pants", "jacket", "hat", "gloves", "shoes", "boots", "socks", "scarf"],
    vehicles: ["car", "truck", "bus", "train", "airplane", "bicycle", "motorcycle", "boat", "ship"],
    instruments: ["guitar", "piano", "drum", "violin", "flute", "trumpet", "saxophone", "harp"],
    sports: ["baseball", "football", "basketball", "soccer", "tennis", "golf", "hockey", "volleyball"],
    foodItems: ["apple", "banana", "orange", "bread", "cheese", "meat", "vegetable", "fruit"],
    animals: ["dog", "cat", "bird", "fish", "horse", "cow", "sheep", "chicken", "pig"],
    professions: ["doctor", "teacher", "engineer", "chef", "artist", "musician", "writer", "athlete"]
  };
  
  // Check if both words are in the same category
  for (const category in categories) {
    const wordsInCategory = categories[category];
    const word1InCategory = wordsInCategory.some(item => w1.includes(item) || item.includes(w1));
    const word2InCategory = wordsInCategory.some(item => w2.includes(item) || item.includes(w2));
    
    if (word1InCategory && word2InCategory) {
      return true;
    }
  }
  
  // Check for direct similarity (one word contains the other)
  if (w1.includes(w2) || w2.includes(w1)) {
    return true;
  }
  
  // Check for common words that might indicate similarity
  const commonWords = ["small", "large", "big", "little", "mini", "giant", "portable", "electric", "manual", "digital"];
  const word1HasCommon = commonWords.some(word => w1.includes(word));
  const word2HasCommon = commonWords.some(word => w2.includes(word));
  
  if (word1HasCommon && word2HasCommon) {
    // Extract the non-common parts and compare them
    let w1Stripped = w1;
    let w2Stripped = w2;
    
    commonWords.forEach(word => {
      w1Stripped = w1Stripped.replace(word, '').trim();
      w2Stripped = w2Stripped.replace(word, '').trim();
    });
    
    if (w1Stripped === w2Stripped || w1Stripped.includes(w2Stripped) || w2Stripped.includes(w1Stripped)) {
      return true;
    }
  }
  
  return false;
};

// Replace words in a statement with unrelated ones using OpenAI
export const replaceWords = async (statement, usedWords) => {
  try {
    if (!statement || !statement.selectedComponents) {
      throw new Error('Invalid statement format');
    }
    
    let replacements = [];
    
    // Try to use OpenAI for replacements
    if (openAIService.initialized) {
      try {
        // Update the OpenAI prompt to emphasize incongruity
        replacements = await openAIService.generateReplacements(statement.selectedComponents, usedWords);
        
        // Verify that replacements are actually incongruous
        for (let i = 0; i < replacements.length; i++) {
          const replacement = replacements[i];
          
          // Check if the replacement is too similar to the original or is generic
          if (areWordsInSameCategory(replacement.original, replacement.replacement) || 
              isGenericTerm(replacement.replacement)) {
            console.log(`Replacement "${replacement.replacement}" is too similar to "${replacement.original}" or is generic, generating a new one...`);
            
            // Generate a new replacement that's truly incongruous
            let newReplacement;
            let attempts = 0;
            const maxAttempts = 5;
            
            do {
              newReplacement = await replaceIndividualWord(replacement.original, statement.activityVerb, usedWords, false, true);
              attempts++;
            } while (
              (areWordsInSameCategory(replacement.original, newReplacement) || 
               isGenericTerm(newReplacement)) && 
              attempts < maxAttempts
            );
            
            // Update the replacement
            replacements[i] = {
              original: replacement.original,
              replacement: newReplacement
            };
          }
          
          // Add to repetition prevention system
          await addReplacementUnified(replacements[i].replacement);
        }
      } catch (error) {
        console.error('Error getting replacements from OpenAI:', error);
        // Fall back to local replacement if OpenAI fails
        replacements = await fallbackReplaceWords(statement, usedWords);
      }
    } else {
      // If OpenAI is not initialized, use local replacement
      replacements = await fallbackReplaceWords(statement, usedWords);
    }
    
    // Create the replaced text by replacing each component in the activity text
    let replacedText = statement.activityVerb;
    
    // Replace each component in the activity text if it appears
    replacements.forEach(replacement => {
      // Create a regex that matches the whole word only
      if (replacement.original && typeof replacement.original === 'string') {
        const regex = new RegExp(`\\b${replacement.original}\\b`, 'gi');
        replacedText = replacedText.replace(regex, replacement.replacement);
      }
    });
    
    return {
      originalText: statement.activityVerb,
      replacedText: replacedText,
      replacements: replacements
    };
  } catch (error) {
    console.error('Error replacing words:', error);
    throw error;
  }
};

// Fallback method for replacing words if OpenAI fails
const fallbackReplaceWords = async (statement, usedWords) => {
  const replacements = [];
  
  // For each component in the statement, generate a replacement
  for (const component of statement.selectedComponents) {
    const replacement = await replaceIndividualWord(component, statement.activityVerb, usedWords, false, true);
    
    replacements.push({
      original: component,
      replacement: replacement
    });
    
    // Add the replacement to our repetition prevention system
    await addReplacementUnified(replacement);
  }
  
  return replacements;
};

// Get a replacement that's guaranteed to be incongruous with the original
const getIncongruousReplacement = (original, usedWordsLower) => {
  // Determine if the original is a person/role
  const isPerson = isPersonOrRole(original);
  
  if (isPerson) {
    // If original is a person, replace with an object
    const availableObjects = unrelatedObjects.filter(obj => 
      !usedWordsLower.has(obj.toLowerCase()) &&
      !areWordsInSameCategory(original, obj) &&
      !isGenericTerm(obj)
    );
    
    if (availableObjects.length > 0) {
      return availableObjects[Math.floor(Math.random() * availableObjects.length)];
    }
  } else {
    // If original is an object, replace with a person/character
    const availableCharacters = unrelatedCharacters.filter(char => 
      !usedWordsLower.has(char.toLowerCase()) &&
      !areWordsInSameCategory(original, char) &&
      !isGenericTerm(char)
    );
    
    if (availableCharacters.length > 0) {
      return availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
    }
    
    // If no characters are available, try to find an object from a different category
    const availableObjects = unrelatedObjects.filter(obj => 
      !usedWordsLower.has(obj.toLowerCase()) &&
      !areWordsInSameCategory(original, obj) &&
      !isGenericTerm(obj)
    );
    
    if (availableObjects.length > 0) {
      return availableObjects[Math.floor(Math.random() * availableObjects.length)];
    }
  }
  
  // If we can't find a suitable replacement, generate a specific one based on category
  // Determine the category of the original word
  for (const category in categories) {
    const wordsInCategory = categories[category];
    const isInCategory = wordsInCategory.some(item => 
      original.toLowerCase().includes(item) || 
      item.includes(original.toLowerCase())
    );
    
    if (isInCategory) {
      // Generate a specific replacement from a different category
      return generateSpecificReplacement(category);
    }
  }
  
  // If we still can't determine a category, use a specific fallback
  const specificFallbacks = [
    "banana", "violin", "lighthouse", "cactus", "snowflake", 
    "astronaut", "flamingo", "volcano", "submarine", "tornado"
  ];
  
  return specificFallbacks[Math.floor(Math.random() * specificFallbacks.length)];
};

// Categories for determining word types
const categories = {
  tools: ["hammer", "screwdriver", "wrench", "pliers", "saw", "drill", "chisel", "mallet", "clamp"],
  kitchenItems: ["pot", "pan", "spatula", "whisk", "bowl", "spoon", "knife", "cutting board", "plate"],
  furniture: ["chair", "table", "desk", "couch", "sofa", "bed", "bookshelf", "cabinet", "dresser"],
  electronics: ["computer", "phone", "tablet", "laptop", "television", "camera", "headphones", "speaker"],
  clothing: ["shirt", "pants", "jacket", "hat", "gloves", "shoes", "boots", "socks", "scarf"],
  vehicles: ["car", "truck", "bus", "train", "airplane", "bicycle", "motorcycle", "boat", "ship"],
  instruments: ["guitar", "piano", "drum", "violin", "flute", "trumpet", "saxophone", "harp"],
  sports: ["baseball", "football", "basketball", "soccer", "tennis", "golf", "hockey", "volleyball"],
  foodItems: ["apple", "banana", "orange", "bread", "cheese", "meat", "vegetable", "fruit"],
  animals: ["dog", "cat", "bird", "fish", "horse", "cow", "sheep", "chicken", "pig"],
  professions: ["doctor", "teacher", "engineer", "chef", "artist", "musician", "writer", "athlete"]
};

// Replace an individual word with an unrelated one
export const replaceIndividualWord = async (word, activityVerb, usedWords, isOriginalComponent = false, forceIncongruous = false) => {
  try {
    if (!word || typeof word !== 'string') {
      return 'watermelon'; // Specific fallback instead of generic "replacement"
    }
    
    // Try to use OpenAI for generating a replacement or new component
    if (openAIService.initialized) {
      try {
        if (isOriginalComponent) {
          // For original components, we want to generate a new component that's logically associated with the activity
          // Get the existing components to avoid duplicates
          const existingComponents = [];
          
          // Generate a new component using OpenAI
          const newComponent = await openAIService.generateSingleComponent(
            activityVerb,
            existingComponents,
            usedWords
          );
          
          // Check if the component is generic
          if (isGenericTerm(newComponent)) {
            // Try to generate a more specific component
            const specificComponent = await openAIService.generateSpecificComponent(
              activityVerb,
              existingComponents,
              usedWords
            );
            
            // Add the new component to our repetition prevention system
            await addReplacementUnified(specificComponent);
            
            return specificComponent;
          }
          
          // Add the new component to our repetition prevention system
          await addReplacementUnified(newComponent);
          
          return newComponent;
        } else {
          // For replacements, we want to generate an unrelated word that's visually demonstrable
          // Update the OpenAI prompt to emphasize incongruity
          const replacements = await openAIService.generateReplacements([word], usedWords, forceIncongruous);
          
          if (replacements && replacements.length > 0 && replacements[0].replacement) {
            // Verify the replacement is actually incongruous and not generic
            if ((forceIncongruous && areWordsInSameCategory(word, replacements[0].replacement)) || 
                isGenericTerm(replacements[0].replacement)) {
              console.log(`OpenAI replacement "${replacements[0].replacement}" is too similar to "${word}" or is generic, falling back to local replacement...`);
              // Fall back to local replacement
              return await localReplaceWord(word, usedWords, forceIncongruous);
            }
            
            // Add the replacement to our repetition prevention system
            await addReplacementUnified(replacements[0].replacement);
            
            return replacements[0].replacement;
          }
        }
      } catch (error) {
        console.error('Error getting replacement from OpenAI:', error);
        // Fall back to local replacement if OpenAI fails
      }
    }
    
    // Fallback to local replacement if OpenAI is not initialized or fails
    return await localReplaceWord(word, usedWords, forceIncongruous);
  } catch (error) {
    console.error('Error replacing individual word:', error);
    // Return a specific fallback instead of a generic one
    const specificFallbacks = [
      "banana", "violin", "lighthouse", "cactus", "snowflake", 
      "astronaut", "flamingo", "volcano", "submarine", "tornado"
    ];
    return specificFallbacks[Math.floor(Math.random() * specificFallbacks.length)];
  }
};

// Local replacement function
const localReplaceWord = async (word, usedWords, forceIncongruous) => {
  // Convert usedWords to lowercase for case-insensitive comparison
  const usedWordsLower = new Set(Array.from(usedWords).map(word => word.toLowerCase()));
  
  // Determine if the word is a person/role
  const isPerson = isPersonOrRole(word);
  
  // If we need to force incongruity, use our special function
  if (forceIncongruous) {
    // For people/roles, use a celebrity or fictional character 20% of the time
    if (isPerson && Math.random() < 0.2) {
      const celebrity = getRandomCelebrityOrCharacter(usedWordsLower);
      // Check if the celebrity is generic
      if (!isGenericTerm(celebrity)) {
        return celebrity;
      }
    }
    
    // For objects, use "made of" variation 20% of the time
    if (!isPerson && Math.random() < 0.2) {
      const material = getRandomMaterial(usedWordsLower);
      // Check if the material is generic
      if (!isGenericTerm(material)) {
        return `made of ${material}`;
      }
    }
    
    const incongruousReplacement = getIncongruousReplacement(word, usedWordsLower);
    return incongruousReplacement;
  }
  
  // If the word is a person/role, replace with a celebrity or character
  if (isPerson) {
    // 50% chance to use a celebrity/character for people/roles
    if (Math.random() < 0.5) {
      const celebrity = getRandomCelebrityOrCharacter(usedWordsLower);
      // Check if the celebrity is generic
      if (!isGenericTerm(celebrity)) {
        return celebrity;
      }
    }
    
    // Get available celebrities that haven't been used
    const availableCelebrities = unrelatedCharacters.filter(celeb => 
      !usedWordsLower.has(celeb.toLowerCase()) &&
      !isGenericTerm(celeb)
    );
    
    // Further filter celebrities that exist in our repetition prevention system
    const filteredCelebrities = [];
    for (const celeb of availableCelebrities) {
      const exists = await checkReplacementExistsUnified(celeb);
      if (!exists) {
        filteredCelebrities.push(celeb);
      }
    }
    
    // If we have available celebrities, choose a random one
    if (filteredCelebrities.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredCelebrities.length);
      return filteredCelebrities[randomIndex];
    }
    
    // If we've exhausted all celebrities, use a specific fallback
    const specificFallbacks = [
      "Batman", "Wonder Woman", "Spider-Man", "Captain America", "Iron Man",
      "Harry Potter", "Sherlock Holmes", "Darth Vader", "Luke Skywalker", "James Bond"
    ];
    return specificFallbacks[Math.floor(Math.random() * specificFallbacks.length)];
  }
  
  // If the word is not a person/role, replace with an unrelated object
  // 30% chance to use "made of" variation for objects
  if (Math.random() < 0.3) {
    const material = getRandomMaterial(usedWordsLower);
    // Check if the material is generic
    if (!isGenericTerm(material)) {
      return `made of ${material}`;
    }
  }
  
  // Get available objects that haven't been used
  const availableObjects = unrelatedObjects.filter(obj => 
    !usedWordsLower.has(obj.toLowerCase()) &&
    !isGenericTerm(obj)
  );
  
  // Further filter objects that exist in our repetition prevention system
  const filteredObjects = [];
  for (const obj of availableObjects) {
    const exists = await checkReplacementExistsUnified(obj);
    if (!exists) {
      filteredObjects.push(obj);
    }
  }
  
  // If we have available objects, choose a random one
  if (filteredObjects.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredObjects.length);
    return filteredObjects[randomIndex];
  }
  
  // If we've exhausted all objects, use a specific fallback
  const specificFallbacks = [
    "banana", "violin", "lighthouse", "cactus", "snowflake", 
    "astronaut", "flamingo", "volcano", "submarine", "tornado"
  ];
  return specificFallbacks[Math.floor(Math.random() * specificFallbacks.length)];
};
