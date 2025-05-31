// Word replacement utility using OpenAI or fallback to local data
import openAIService from './openaiService';

// 10th grade level words (appropriate for 10th grade reading level)
const tenthGradeWords = [
  // Common nouns at 10th grade level or below
  "banana", "unicorn", "spaceship", "pickle", "dinosaur", "robot", "wizard", 
  "flamingo", "toaster", "volcano", "penguin", "cactus", "zombie", "pirate", 
  "ninja", "cupcake", "mermaid", "vampire", "werewolf", "goblin",
  "potato", "hamburger", "octopus", "jellyfish", "raccoon", "helicopter", "submarine",
  "bulldozer", "catapult", "trampoline", "watermelon", "pineapple", "coconut", "avocado",
  "skateboard", "rollercoaster", "parachute", "snowman", "bubblegum", "lollipop", "marshmallow",
  "accordion", "tambourine", "harmonica", "telescope", "microscope", "calculator", "compass",
  "umbrella", "backpack", "hammock", "chandelier", "refrigerator", "blender", "microwave",
  "monster", "dragon", "alien", "ghost", "witch", "giant", "dwarf", "elf",
  "treasure", "diamond", "emerald", "ruby", "sapphire", "crystal", "meteor", "asteroid",
  "tornado", "hurricane", "earthquake", "tsunami", "avalanche", "crater",
  "jungle", "desert", "forest", "mountain", "valley", "canyon", "island", "ocean",
  "castle", "palace", "mansion", "cottage", "cabin", "fortress", "dungeon", "laboratory",
  "potion", "elixir", "antidote", "poison", "venom", "medicine", "remedy", "cure",
  "sword", "shield", "armor", "helmet", "dagger", "spear", "bow", "arrow", "axe",
  "wand", "staff", "scepter", "crown", "throne", "kingdom", "empire", "realm",
  "monster", "beast", "creature", "animal", "insect", "reptile", "mammal", "bird",
  "vehicle", "machine", "device", "gadget", "contraption", "invention", "creation",
  "balloon", "puppet", "magnet", "battery", "candle", "lantern", "compass", "telescope",
  "whistle", "trumpet", "guitar", "piano", "violin", "drum", "flute", "saxophone",
  "camera", "binoculars", "flashlight", "mirror", "ladder", "bucket", "basket", "pillow",
  "blanket", "mattress", "curtain", "carpet", "cushion", "cabinet", "drawer", "shelf",
  "bottle", "glass", "plate", "bowl", "spoon", "fork", "knife", "napkin",
  "jacket", "sweater", "t-shirt", "pants", "shorts", "skirt", "dress", "hat",
  "gloves", "scarf", "boots", "sandals", "sneakers", "socks", "belt", "backpack",
  "wallet", "purse", "necklace", "bracelet", "ring", "earrings", "watch", "sunglasses",
  "pencil", "marker", "crayon", "paintbrush", "notebook", "textbook", "dictionary", "magazine",
  "newspaper", "envelope", "stamp", "postcard", "calendar", "poster", "sticker", "magnet",
  "balloon", "kite", "frisbee", "yo-yo", "puzzle", "doll", "action figure", "teddy bear",
  "bicycle", "scooter", "skateboard", "sled", "wagon", "canoe", "kayak", "surfboard",
  "football", "baseball", "basketball", "soccer ball", "tennis ball", "golf ball", "bowling ball", "hockey puck",
  "apple", "orange", "banana", "grape", "strawberry", "blueberry", "raspberry", "pineapple",
  "carrot", "potato", "tomato", "lettuce", "broccoli", "cucumber", "onion", "garlic",
  "chicken", "turkey", "duck", "goose", "cow", "pig", "sheep", "goat",
  "dog", "cat", "rabbit", "hamster", "guinea pig", "turtle", "fish", "bird", "apple", "banana", 
  "chair", "table", "lamp", "pen", "pencil", "notebook", "book", "phone", "television", "laptop", 
  "mouse", "keyboard", "monitor", "cup", "glass", "bottle", "plate", "fork", "spoon", "knife", "napkin", 
  "bed", "pillow", "blanket", "sheet", "towel", "soap", "shampoo", "conditioner", "toothbrush", "toothpaste", 
  "comb", "brush", "mirror", "clock", "watch", "wallet", "bag", "backpack", "suitcase", "umbrella", "hat", "scarf", 
  "gloves", "jacket", "shirt", "pants", "shorts", "shoes", "socks", "belt", "tie", "dress", "skirt", "fan", "heater", 
  "air conditioner", "remote", "charger", "earphones", "headphones", "camera", "microphone", "speaker", "tripod", "stapler", 
  "paper", "envelope", "stamp", "marker", "highlighter", "ruler", "scissors", "tape", "glue", "calculator", "calendar", "file", 
  "folder", "cabinet", "desk", "drawer", "couch", "sofa", "rug", "carpet", "vase", "plant", "flower", "curtain", "blinds",
  "window", "door", "lock", "key", "doormat", "broom", "mop", "bucket", "vacuum", "dustpan", "sponge", "detergent", "cleaner",
  "lightbulb", "switch", "outlet", "extension cord", "plug", "battery", "fan", "thermometer", "scale", "iron", "ironing board",
  "sewing kit", "needle", "thread", "button", "zipper", "safety pin", "tape measure", "ladder", "toolbox", "hammer",
  "screwdriver", "wrench", "pliers", "drill", "nail", "screw", "bolt", "saw", "level", "paint", "brush", "roller",
  "bucket", "hose", "sprinkler", "shovel", "rake", "hoe", "wheelbarrow", "lawnmower", "trash can", "recycling bin",
  "bin", "bag", "box", "crate", "basket", "tray", "bowl", "pan", "pot", "lid", "oven", "microwave", "toaster", "kettle",
  "blender", "mixer", "grater", "peeler", "whisk", "spatula", "ladle", "tongs", "strainer", "colander", "cutting board",
  "measuring cup", "measuring spoon", "thermos", "pitcher", "cooler", "freezer", "fridge", "stove", "grill", "dish",
  "snack", "cereal", "bread", "butter", "jam", "milk", "cheese", "egg", "meat", "fish", "vegetable", "fruit", "rice",
  "pasta", "sauce", "salt", "pepper", "sugar", "oil", "vinegar", "honey", "tea", "coffee", "mug", "can", "jar",
  "container", "lid", "wrap", "foil", "bag clip", "coaster", "placemat", "candle", "match", "lighter", "incense",
  "ashtray", "picture", "frame", "photo", "poster", "clock", "alarm", "calendar", "map", "globe", "trophy", "medal",
  "award", "toy", "doll", "ball", "puzzle", "game", "board game", "card", "dice", "block", "car", "truck", "bus", "bike",
  "bicycle", "motorcycle", "scooter", "skateboard", "helmet", "seatbelt", "mirror", "horn", "gear", "brake", "pedal",
  "steering wheel", "license", "registration", "insurance", "ticket", "passport", "ID", "credit card", "debit card",
  "cash", "coin", "receipt", "invoice", "bill", "check", "chequebook", "wallet", "purse", "clutch", "sunglasses",
  "goggles", "mask", "bandage", "ointment", "medicine", "pill", "tablet", "capsule", "syrup", "inhaler", "thermometer",
  "first aid kit", "crutch", "cane", "wheelchair", "walker", "prescription", "vitamin", "supplement", "diaper", "wipe",
  "lotion", "powder", "toy", "crib", "stroller", "bottle", "pacifier", "bib", "blanket", "teddy bear", "book", "storybook",
  "coloring book", "crayon", "marker", "chalk", "paint", "brush", "easel", "scissors", "glue", "tape", "string", "bead",
  "sticker", "stamp", "paper", "card", "envelope", "poster", "canvas", "fabric", "thread", "needle", "sewing machine", "yarn", 
  "knitting needle", "crochet hook", "embroidery hoop", "thimble", "pin cushion", "pattern", "template", "stencil", "ribbon",
  "lace", "button", "zipper", "snap", "velcro", "elastic", "safety pin", "clip", "hook", "hanger", "rack", "shelf", "drawer",
  "closet", "wardrobe", "mirror", "light", "lamp", "chandelier", "lantern", "torch", "flashlight", "candle", "bulb", "switch",
  "socket", "plug", "cord", "wire", "cable", "router", "modem", "antenna", "remote", "controller", "joystick", "console", "disc", 
  "CD", "DVD", "Blu-ray", "USB", "hard drive", "memory card", "SD card", "microSD", "adapter", "reader", "printer", "scanner",
  "fax", "copier", "paper", "ink", "cartridge", "toner", "pen", "pencil", "sharpener", "eraser", "marker", "highlighter", "ruler",
  "protractor", "compass", "calculator", "notepad", "journal", "diary", "sketchbook", "clipboard", "whiteboard", "blackboard",
  "chalk", "duster", "pointer", "projector", "screen", "tripod", "stand", "microphone", "speaker", "headset", "earbuds", "phone",
  "tablet", "e-reader", "stylus", "case", "cover", "screen protector", "cleaner", "wipe", "brush", "cloth", "spray", "detergent",
  "soap", "sanitizer", "disinfectant", "mask", "gloves", "gown", "apron", "uniform", "badge", "tag", "lanyard", "bracelet", "ring",
  "necklace", "earring", "watch", "clock", "timer", "stopwatch", "alarm", "bell", "whistle", "horn", "siren", "megaphone", "radio",
  "walkie-talkie", "signal", "flag", "banner", "sign", "label", "sticker", "tag", "barcode", "QR code", "ticket", "pass", "card",
  "invitation", "certificate", "diploma", "license", "permit", "contract", "form", "application", "manual", "guide", "booklet",
  "brochure", "catalog", "magazine", "newspaper", "newsletter", "flyer", "poster", "notice", "announcement", "report", "plan", "schedule", "agenda", "calendar",

  
  // Proper nouns appropriate for 10th grade (20% of list)
  "Batman", "Hogwarts", "Narnia", "Wakanda", "Mordor", "Gotham", "Atlantis",
  "Disney", "Nintendo", "Tesla", "Godzilla", "Pikachu", "Yoda", "Gandalf",
  "iPhone", "PlayStation", "Alexa", "Roomba", "Fitbit", "GoPro", "Kindle",
  "Cheetos", "Oreo", "Nutella", "Excalibur", "Lightsaber", "Elder Wand"
];

// Simple syllable counter (approximate)
const countSyllables = (word) => {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  
  // Remove trailing e
  word = word.replace(/e$/, '');
  
  // Count vowel groups
  const vowelGroups = word.match(/[aeiouy]+/g);
  return vowelGroups ? vowelGroups.length : 1;
};

// Identify nouns in a statement
const identifyNouns = (statement) => {
  // Split the statement into words
  const words = statement.split(/\b/);
  
  // Filter for potential nouns (simplified approach)
  // In a real app, you'd use NLP for better part-of-speech tagging
  const potentialNouns = words.filter(word => {
    // Must be at least 3 characters
    if (!/^[a-zA-Z]{3,}$/.test(word)) return false;
    
    // Skip common non-nouns
    const nonNouns = [
      'with', 'using', 'and', 'the', 'for', 'from', 'that', 'this', 
      'these', 'those', 'then', 'than', 'when', 'where', 'which'
    ];
    
    if (nonNouns.includes(word.toLowerCase())) return false;
    
    return true;
  });
  
  return potentialNouns;
};

// Get a random word from the replacement list that hasn't been used before
// and doesn't contain "and"
export const getRandomReplacement = (usedWords) => {
  // Filter out words that have been used before or contain "and"
  const availableWords = tenthGradeWords.filter(word => 
    !usedWords.has(word.toLowerCase()) && 
    !word.toLowerCase().includes('and')
  );
  
  // If all words have been used, just use the filtered list without "and"
  const wordsToUse = availableWords.length > 0 ? 
    availableWords : 
    tenthGradeWords.filter(word => !word.toLowerCase().includes('and'));
  
  // Get a random word
  const randomIndex = Math.floor(Math.random() * wordsToUse.length);
  const selectedWord = wordsToUse[randomIndex];
  
  // Add some randomness - 20% chance to use a proper noun
  if (Math.random() < 0.2) {
    // Get proper nouns (they start with uppercase) that don't contain "and"
    const properNouns = tenthGradeWords.filter(word => 
      word[0] === word[0].toUpperCase() && 
      !usedWords.has(word.toLowerCase()) &&
      !word.toLowerCase().includes('and')
    );
    
    if (properNouns.length > 0) {
      const randomProperIndex = Math.floor(Math.random() * properNouns.length);
      return properNouns[randomProperIndex];
    }
  }
  
  return selectedWord;
};

// Determine if a word is plural
const isPlural = (word) => {
  if (!word) return false;
  
  // Common plural endings
  return word.endsWith('s') && 
         !word.endsWith('ss') && 
         !word.endsWith('us') && 
         !word.endsWith('is');
};

// Determine the appropriate article for a word
const getAppropriateArticle = (word) => {
  // If it's a proper noun (starts with capital letter), no article needed
  if (word && word[0] === word[0].toUpperCase() && 
      word !== 'I' && // Exception for the pronoun "I"
      !word.toUpperCase() === word) { // Not an acronym like "NASA"
    return ""; // Return empty string for proper nouns
  }
  
  // Check if the word is plural
  if (isPlural(word)) {
    return ""; // No article for plural nouns
  }
  
  // Check for uncountable nouns
  const uncountableNouns = [
    'water', 'coffee', 'tea', 'milk', 'sugar', 'salt', 'pepper', 'rice', 'bread',
    'cheese', 'butter', 'oil', 'flour', 'meat', 'fish', 'chicken', 'advice',
    'information', 'news', 'furniture', 'luggage', 'equipment', 'traffic',
    'money', 'cash', 'currency', 'music', 'art', 'love', 'happiness', 'anger',
    'fear', 'sadness', 'knowledge', 'progress', 'weather', 'sunshine', 'rain',
    'snow', 'wind', 'electricity', 'gas', 'air', 'oxygen', 'steam', 'smoke',
    'pollution', 'garbage', 'trash', 'rubbish', 'homework', 'work', 'research',
    'evidence', 'proof', 'fun', 'leisure', 'slang', 'vocabulary', 'grammar',
    'spelling', 'pronunciation', 'sleet', 'fog', 'hail', 'lightning', 'thunder'
  ];
  
  if (word && uncountableNouns.includes(word.toLowerCase())) {
    return ""; // No article for uncountable nouns
  }
  
  // Check if the word starts with a vowel sound
  if (word) {
    const firstLetter = word.toLowerCase().charAt(0);
    
    // Special cases for words that start with vowels but have consonant sounds
    const vowelExceptions = ['one', 'once', 'unicorn', 'unicycle', 'university', 'uniform', 'union', 'unique', 'unit', 'united', 'universe', 'uranium'];
    if (vowelExceptions.includes(word.toLowerCase())) {
      return "a";
    }
    
    // Special cases for words that start with 'h' but the 'h' is silent
    const silentHWords = ['hour', 'honor', 'honest', 'heir', 'herb']; // Note: 'herb' is regional
    if (silentHWords.includes(word.toLowerCase())) {
      return "an";
    }
    
    // Check for vowel sounds
    if (['a', 'e', 'i', 'o', 'u'].includes(firstLetter)) {
      return "an";
    }
  }
  
  // Default to "a" for consonant sounds
  return "a";
};

// Get the correct verb form based on the subject
const getCorrectVerb = (subject, verb) => {
  // If the subject is plural or uncountable, use the base form of the verb
  if (isPlural(subject)) {
    return "are"; // Plural subjects use "are"
  }
  
  // Check for uncountable nouns that use "is"
  const uncountableNouns = [
    'water', 'coffee', 'tea', 'milk', 'sugar', 'salt', 'pepper', 'rice', 'bread',
    'cheese', 'butter', 'oil', 'flour', 'meat', 'fish', 'chicken', 'advice',
    'information', 'news', 'furniture', 'luggage', 'equipment', 'traffic',
    'money', 'cash', 'currency', 'music', 'art', 'love', 'happiness', 'anger',
    'fear', 'sadness', 'knowledge', 'progress', 'weather', 'sunshine', 'rain',
    'snow', 'wind', 'electricity', 'gas', 'air', 'oxygen', 'steam', 'smoke',
    'pollution', 'garbage', 'trash', 'rubbish', 'homework', 'work', 'research',
    'evidence', 'proof', 'fun', 'leisure', 'slang', 'vocabulary', 'grammar',
    'spelling', 'pronunciation', 'sleet', 'fog', 'hail', 'lightning', 'thunder'
  ];
  
  // For singular subjects and uncountable nouns, use "is"
  return "is";
};

// Format the statement according to the new syntax with appropriate articles and verb agreement
const formatNewStatement = (activityVerb, components, replacements) => {
  if (!components || components.length === 0 || !replacements || replacements.length === 0) {
    return activityVerb;
  }
  
  let statement = `${activityVerb}, but `;
  
  // Create the "component is replacement" parts
  const parts = [];
  
  for (let i = 0; i < components.length; i++) {
    if (i < replacements.length) {
      const component = components[i];
      const replacement = replacements[i].replacement;
      
      // Get the appropriate article for the replacement
      const article = getAppropriateArticle(replacement);
      
      // Get the correct verb form based on the replacement
      const verb = getCorrectVerb(replacement, "is");
      
      // Add "the" before the component and appropriate article before replacement
      parts.push({
        text: `the ${component} ${verb} ${article ? article + ' ' : ''}${replacement}`,
        article: article
      });
    }
  }
  
  // Join the parts with commas and "and" ONLY before the final item
  if (parts.length === 1) {
    statement += parts[0].text;
  } else if (parts.length === 2) {
    statement += `${parts[0].text} and ${parts[1].text}`;
  } else {
    // For 3 or more items, use commas and add "and" ONLY before the last item
    const lastPart = parts.pop();
    const joinedParts = parts.map(part => part.text).join(", ");
    statement += `${joinedParts}, and ${lastPart.text}`;
  }
  
  return statement + ".";
};

// Main function to replace words in a statement
export const replaceWords = async (statement, usedWords, numToReplace = 0) => {
  // Check if statement is an object with activityVerb and selectedComponents
  if (!statement || typeof statement !== 'object' || !statement.activityVerb || !statement.selectedComponents) {
    return { replacedText: "Error: Invalid statement format", replacements: [] };
  }
  
  const { activityVerb, selectedComponents } = statement;
  
  try {
    // Try to use OpenAI if it's initialized
    if (openAIService.initialized) {
      // Generate replacements with OpenAI
      const replacements = await openAIService.generateReplacements(selectedComponents, usedWords);
      
      // Format the statement according to the new syntax
      const replacedText = formatNewStatement(activityVerb, selectedComponents, replacements);
      
      return { replacedText, replacements };
    } else {
      // Fall back to local data
      console.log("OpenAI not initialized for replacements, using local data");
      return fallbackReplaceWords(statement, usedWords);
    }
  } catch (error) {
    console.error("Error using OpenAI for replacements, falling back to local data:", error);
    return fallbackReplaceWords(statement, usedWords);
  }
};

// Fallback to local data if OpenAI is not available
const fallbackReplaceWords = async (statement, usedWords) => {
  const { activityVerb, selectedComponents } = statement;
  
  // Create replacements for each component
  const replacements = [];
  
  for (const component of selectedComponents) {
    const replacement = getRandomReplacement(usedWords);
    
    replacements.push({
      original: component,
      replacement: replacement
    });
  }
  
  // Format the statement according to the new syntax
  const replacedText = formatNewStatement(activityVerb, selectedComponents, replacements);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return { replacedText, replacements };
};
