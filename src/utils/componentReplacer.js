// This module handles generating and replacing components for activities
import { checkComponentExistsUnified, addComponentUnified } from './repetitionPrevention';

// Map of activity types to their common components
export const activityComponentMap = {
  cooking: [
    "mixing bowl", "wooden spoon", "measuring cup", "chef's knife", "cutting board",
    "spatula", "whisk", "oven", "stove", "frying pan", "pot", "baking sheet",
    "rolling pin", "food processor", "blender", "mixer", "grater", "peeler",
    "colander", "strainer", "chef", "sous chef", "recipe book", "apron", "oven mitt",
    "kitchen timer", "refrigerator", "freezer", "microwave", "toaster", "spice rack",
    "salt", "pepper", "olive oil", "butter", "flour", "sugar", "eggs", "milk"
  ],
  
  sports: [
    "ball", "bat", "racket", "net", "goal", "hoop", "court", "field", "stadium",
    "referee", "whistle", "scoreboard", "timer", "jersey", "uniform", "helmet",
    "gloves", "cleats", "shoes", "socks", "knee pads", "elbow pads", "mouthguard",
    "water bottle", "towel", "coach", "player", "team", "opponent", "fan", "crowd",
    "bench", "locker room", "gym", "weight room", "training equipment", "trophy"
  ],
  
  construction: [
    "hammer", "nail", "screwdriver", "screw", "drill", "saw", "measuring tape",
    "level", "square", "pliers", "wrench", "chisel", "mallet", "crowbar",
    "ladder", "scaffold", "hard hat", "safety goggles", "gloves", "boots",
    "tool belt", "tool box", "lumber", "wood", "brick", "concrete", "cement",
    "steel", "beam", "nail gun", "power tool", "generator", "extension cord",
    "blueprint", "architect", "engineer", "foreman", "construction worker"
  ],
  
  cleaning: [
    "vacuum cleaner", "mop", "broom", "dustpan", "duster", "sponge", "rag",
    "paper towel", "cleaning solution", "spray bottle", "bucket", "scrub brush",
    "rubber gloves", "apron", "mask", "window cleaner", "glass cleaner",
    "furniture polish", "floor cleaner", "bleach", "disinfectant", "soap",
    "detergent", "washing machine", "dryer", "clothesline", "iron", "ironing board",
    "laundry basket", "hamper", "trash can", "garbage bag", "recycling bin"
  ],
  
  office: [
    "desk", "chair", "computer", "keyboard", "mouse", "monitor", "laptop",
    "printer", "scanner", "copier", "fax machine", "telephone", "cell phone",
    "headset", "pen", "pencil", "marker", "highlighter", "paper", "notebook",
    "folder", "file cabinet", "stapler", "paper clip", "binder", "calendar",
    "planner", "sticky note", "whiteboard", "projector", "conference room",
    "office", "cubicle", "break room", "water cooler", "coffee maker"
  ],
  
  medical: [
    "stethoscope", "thermometer", "blood pressure cuff", "syringe", "needle",
    "bandage", "gauze", "tape", "scissors", "scalpel", "forceps", "gloves",
    "mask", "gown", "scrubs", "lab coat", "x-ray", "MRI machine", "CT scanner",
    "ultrasound", "hospital bed", "wheelchair", "stretcher", "crutches", "walker",
    "cane", "prescription pad", "chart", "medical record", "insurance card",
    "waiting room", "examination room", "operating room", "recovery room",
    "doctor", "nurse", "surgeon", "anesthesiologist", "patient", "pharmacist"
  ],
  
  music: [
    "guitar", "piano", "drum", "violin", "flute", "trumpet", "saxophone",
    "clarinet", "trombone", "bass", "cello", "harp", "accordion", "harmonica",
    "microphone", "amplifier", "speaker", "headphones", "sheet music", "music stand",
    "conductor", "baton", "orchestra", "band", "choir", "singer", "musician",
    "composer", "recording studio", "mixing board", "stage", "spotlight",
    "audience", "concert hall", "theater", "ticket", "backstage pass"
  ],
  
  art: [
    "canvas", "easel", "paintbrush", "paint", "palette", "pencil", "pen",
    "marker", "charcoal", "pastel", "crayon", "sketchbook", "drawing pad",
    "eraser", "ruler", "compass", "scissors", "glue", "tape", "clay",
    "pottery wheel", "kiln", "chisel", "hammer", "stone", "wood", "metal",
    "fabric", "thread", "needle", "sewing machine", "loom", "yarn", "knitting needles",
    "crochet hook", "artist", "model", "gallery", "museum", "exhibition", "curator"
  ],
  
  gardening: [
    "shovel", "spade", "trowel", "rake", "hoe", "pruning shears", "loppers",
    "hedge trimmer", "lawn mower", "weed whacker", "leaf blower", "garden hose",
    "watering can", "sprinkler", "wheelbarrow", "garden cart", "gloves", "hat",
    "kneeling pad", "seeds", "seedlings", "plants", "flowers", "vegetables",
    "fruits", "trees", "shrubs", "soil", "compost", "fertilizer", "mulch",
    "pot", "planter", "greenhouse", "garden bed", "trellis", "fence", "gardener"
  ],
  
  technology: [
    "computer", "laptop", "tablet", "smartphone", "keyboard", "mouse", "monitor",
    "printer", "scanner", "router", "modem", "server", "hard drive", "flash drive",
    "memory card", "cable", "charger", "battery", "headphones", "speakers",
    "microphone", "webcam", "virtual reality headset", "game console", "controller",
    "software", "app", "program", "code", "algorithm", "database", "network",
    "internet", "cloud", "programmer", "developer", "engineer", "technician", "user"
  ],
  
  travel: [
    "suitcase", "backpack", "carry-on", "luggage tag", "passport", "visa",
    "ticket", "boarding pass", "map", "guidebook", "compass", "GPS", "camera",
    "binoculars", "sunglasses", "hat", "sunscreen", "insect repellent",
    "first aid kit", "medication", "water bottle", "snack", "money", "credit card",
    "traveler's check", "currency exchange", "hotel", "motel", "hostel",
    "bed and breakfast", "resort", "campground", "tent", "sleeping bag",
    "car", "bus", "train", "airplane", "ship", "cruise", "taxi", "subway", "traveler"
  ],
  
  education: [
    "textbook", "notebook", "binder", "folder", "pen", "pencil", "highlighter",
    "marker", "eraser", "ruler", "calculator", "computer", "laptop", "tablet",
    "projector", "whiteboard", "chalkboard", "desk", "chair", "backpack",
    "locker", "library", "classroom", "laboratory", "gymnasium", "cafeteria",
    "playground", "school bus", "teacher", "professor", "student", "principal",
    "counselor", "tutor", "homework", "assignment", "test", "exam", "grade", "diploma"
  ],
  
  // Stunts and daring acts
  stunts: [
    "safety harness", "crash mat", "helmet", "knee pads", "elbow pads", "gloves",
    "ramp", "trampoline", "tightrope", "high wire", "safety net", "platform",
    "ladder", "scaffold", "zipline", "bungee cord", "parachute", "wingsuit",
    "skateboard", "BMX bike", "motorcycle", "stunt car", "fire extinguisher",
    "pyrotechnics", "cannon", "trapeze", "rings", "stunt performer", "stunt coordinator",
    "safety officer", "audience", "camera", "director", "special effects", "slow motion"
  ],
  
  // Default components that could apply to many activities
  default: [
    "person", "professional", "expert", "specialist", "instructor", "student",
    "beginner", "amateur", "enthusiast", "tool", "equipment", "gear", "accessory",
    "supply", "material", "component", "part", "piece", "location", "venue",
    "facility", "area", "space", "room", "building", "structure", "container",
    "vehicle", "machine", "device", "apparatus", "instrument", "implement", "utensil",
    "clothing", "apparel", "footwear", "headwear", "protection", "safety gear"
  ]
};

// Determine the activity type based on the activity verb
export const determineActivityType = (activityVerb) => {
  const lowerVerb = activityVerb.toLowerCase();
  
  if (lowerVerb.includes("cook") || lowerVerb.includes("bak") || lowerVerb.includes("mix") || 
      lowerVerb.includes("chop") || lowerVerb.includes("slice") || lowerVerb.includes("dice") || 
      lowerVerb.includes("grill") || lowerVerb.includes("roast") || lowerVerb.includes("boil") || 
      lowerVerb.includes("fry") || lowerVerb.includes("recipe") || lowerVerb.includes("food")) {
    return "cooking";
  }
  
  if (lowerVerb.includes("play") || lowerVerb.includes("sport") || lowerVerb.includes("game") || 
      lowerVerb.includes("ball") || lowerVerb.includes("team") || lowerVerb.includes("match") || 
      lowerVerb.includes("competition") || lowerVerb.includes("tournament") || lowerVerb.includes("race") || 
      lowerVerb.includes("swim") || lowerVerb.includes("run") || lowerVerb.includes("jump") || 
      lowerVerb.includes("throw") || lowerVerb.includes("catch") || lowerVerb.includes("kick")) {
    return "sports";
  }
  
  if (lowerVerb.includes("build") || lowerVerb.includes("construct") || lowerVerb.includes("assemble") || 
      lowerVerb.includes("install") || lowerVerb.includes("repair") || lowerVerb.includes("fix") || 
      lowerVerb.includes("renovate") || lowerVerb.includes("remodel") || lowerVerb.includes("carpenter") || 
      lowerVerb.includes("plumber") || lowerVerb.includes("electrician") || lowerVerb.includes("contractor")) {
    return "construction";
  }
  
  if (lowerVerb.includes("clean") || lowerVerb.includes("wash") || lowerVerb.includes("scrub") || 
      lowerVerb.includes("dust") || lowerVerb.includes("vacuum") || lowerVerb.includes("sweep") || 
      lowerVerb.includes("mop") || lowerVerb.includes("polish") || lowerVerb.includes("sanitize") || 
      lowerVerb.includes("disinfect") || lowerVerb.includes("laundry") || lowerVerb.includes("iron")) {
    return "cleaning";
  }
  
  if (lowerVerb.includes("office") || lowerVerb.includes("work") || lowerVerb.includes("business") || 
      lowerVerb.includes("meeting") || lowerVerb.includes("presentation") || lowerVerb.includes("conference") || 
      lowerVerb.includes("interview") || lowerVerb.includes("report") || lowerVerb.includes("document") || 
      lowerVerb.includes("file") || lowerVerb.includes("email") || lowerVerb.includes("call")) {
    return "office";
  }
  
  if (lowerVerb.includes("doctor") || lowerVerb.includes("nurse") || lowerVerb.includes("hospital") || 
      lowerVerb.includes("clinic") || lowerVerb.includes("patient") || lowerVerb.includes("medical") || 
      lowerVerb.includes("health") || lowerVerb.includes("surgery") || lowerVerb.includes("operation") || 
      lowerVerb.includes("treatment") || lowerVerb.includes("diagnosis") || lowerVerb.includes("prescription")) {
    return "medical";
  }
  
  if (lowerVerb.includes("music") || lowerVerb.includes("play") || lowerVerb.includes("sing") || 
      lowerVerb.includes("song") || lowerVerb.includes("concert") || lowerVerb.includes("performance") || 
      lowerVerb.includes("band") || lowerVerb.includes("orchestra") || lowerVerb.includes("choir") || 
      lowerVerb.includes("instrument") || lowerVerb.includes("guitar") || lowerVerb.includes("piano")) {
    return "music";
  }
  
  if (lowerVerb.includes("art") || lowerVerb.includes("paint") || lowerVerb.includes("draw") || 
      lowerVerb.includes("sketch") || lowerVerb.includes("sculpt") || lowerVerb.includes("craft") || 
      lowerVerb.includes("create") || lowerVerb.includes("design") || lowerVerb.includes("artist") || 
      lowerVerb.includes("gallery") || lowerVerb.includes("museum") || lowerVerb.includes("exhibition")) {
    return "art";
  }
  
  if (lowerVerb.includes("garden") || lowerVerb.includes("plant") || lowerVerb.includes("grow") || 
      lowerVerb.includes("harvest") || lowerVerb.includes("prune") || lowerVerb.includes("weed") || 
      lowerVerb.includes("water") || lowerVerb.includes("fertilize") || lowerVerb.includes("landscape") || 
      lowerVerb.includes("flower") || lowerVerb.includes("vegetable") || lowerVerb.includes("fruit")) {
    return "gardening";
  }
  
  if (lowerVerb.includes("computer") || lowerVerb.includes("program") || lowerVerb.includes("code") || 
      lowerVerb.includes("software") || lowerVerb.includes("app") || lowerVerb.includes("website") || 
      lowerVerb.includes("internet") || lowerVerb.includes("online") || lowerVerb.includes("digital") || 
      lowerVerb.includes("tech") || lowerVerb.includes("electronic") || lowerVerb.includes("virtual")) {
    return "technology";
  }
  
  if (lowerVerb.includes("travel") || lowerVerb.includes("trip") || lowerVerb.includes("journey") || 
      lowerVerb.includes("vacation") || lowerVerb.includes("holiday") || lowerVerb.includes("tour") || 
      lowerVerb.includes("visit") || lowerVerb.includes("explore") || lowerVerb.includes("discover") || 
      lowerVerb.includes("adventure") || lowerVerb.includes("sightseeing") || lowerVerb.includes("tourist")) {
    return "travel";
  }
  
  if (lowerVerb.includes("school") || lowerVerb.includes("college") || lowerVerb.includes("university") || 
      lowerVerb.includes("class") || lowerVerb.includes("course") || lowerVerb.includes("lecture") || 
      lowerVerb.includes("study") || lowerVerb.includes("learn") || lowerVerb.includes("teach") || 
      lowerVerb.includes("education") || lowerVerb.includes("student") || lowerVerb.includes("teacher")) {
    return "education";
  }
  
  if (lowerVerb.includes("stunt") || lowerVerb.includes("trick") || lowerVerb.includes("jump") || 
      lowerVerb.includes("flip") || lowerVerb.includes("dive") || lowerVerb.includes("swing") || 
      lowerVerb.includes("climb") || lowerVerb.includes("balance") || lowerVerb.includes("perform") || 
      lowerVerb.includes("acrobat") || lowerVerb.includes("circus") || lowerVerb.includes("daring")) {
    return "stunts";
  }
  
  return "default";
};

// Generate unique components for an activity
export const generateUniqueComponents = async (activityVerb, numComponents, existingComponents = new Set()) => {
  try {
    // Determine the activity type
    const activityType = determineActivityType(activityVerb);
    
    // Get the components for this activity type
    const activityComponents = activityComponentMap[activityType] || activityComponentMap["default"];
    
    // Convert existingComponents to a Set of lowercase strings for case-insensitive comparison
    const existingComponentsLower = new Set(
      Array.from(existingComponents).map(component => 
        typeof component === 'string' ? component.toLowerCase() : ''
      )
    );
    
    // Filter out components that already exist
    const availableComponents = [];
    
    for (const component of activityComponents) {
      // Skip if component is already in existingComponents
      if (existingComponentsLower.has(component.toLowerCase())) {
        continue;
      }
      
      // Check if this component already exists in our repetition prevention system
      const exists = await checkComponentExistsUnified(component);
      
      if (!exists) {
        availableComponents.push(component);
      }
    }
    
    // If we don't have enough available components, try components from other activity types
    if (availableComponents.length < numComponents) {
      // Get components from all activity types
      const allActivityTypes = Object.keys(activityComponentMap);
      
      for (const type of allActivityTypes) {
        // Skip the current activity type as we've already processed it
        if (type === activityType) continue;
        
        const typeComponents = activityComponentMap[type];
        
        for (const component of typeComponents) {
          // Skip if component is already in existingComponents or availableComponents
          if (existingComponentsLower.has(component.toLowerCase()) || 
              availableComponents.includes(component)) {
            continue;
          }
          
          // Check if this component already exists in our repetition prevention system
          const exists = await checkComponentExistsUnified(component);
          
          if (!exists) {
            availableComponents.push(component);
            
            // Break if we have enough components
            if (availableComponents.length >= numComponents) {
              break;
            }
          }
        }
        
        // Break if we have enough components
        if (availableComponents.length >= numComponents) {
          break;
        }
      }
    }
    
    // If we still don't have enough components, create unique ones by adding numbers
    if (availableComponents.length < numComponents) {
      const baseComponents = activityComponents.length > 0 ? 
        activityComponents : 
        activityComponentMap["default"];
      
      let counter = 1;
      while (availableComponents.length < numComponents) {
        const baseComponent = baseComponents[Math.floor(Math.random() * baseComponents.length)];
        const uniqueComponent = `${baseComponent} ${counter}`;
        
        // Check if this component already exists in our repetition prevention system
        const exists = await checkComponentExistsUnified(uniqueComponent);
        
        if (!exists && !existingComponentsLower.has(uniqueComponent.toLowerCase()) && 
            !availableComponents.includes(uniqueComponent)) {
          availableComponents.push(uniqueComponent);
        }
        
        counter++;
      }
    }
    
    // Shuffle the available components
    const shuffled = [...availableComponents];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Take the required number of components
    const selectedComponents = shuffled.slice(0, numComponents);
    
    // Add the selected components to our repetition prevention system
    for (const component of selectedComponents) {
      await addComponentUnified(component);
    }
    
    return selectedComponents;
  } catch (error) {
    console.error('Error generating unique components:', error);
    throw error;
  }
};

// Check if a word is a person or role
export const isPersonOrRole = (word) => {
  if (!word || typeof word !== 'string') return false;
  
  const lowerWord = word.toLowerCase();
  
  // List of common person/role words
  const personRoleWords = [
    "person", "man", "woman", "boy", "girl", "child", "adult", "teenager",
    "baby", "infant", "toddler", "kid", "youth", "senior", "elder",
    "doctor", "nurse", "surgeon", "physician", "dentist", "pharmacist",
    "teacher", "professor", "instructor", "tutor", "student", "pupil",
    "chef", "cook", "baker", "waiter", "waitress", "server", "bartender",
    "engineer", "architect", "designer", "developer", "programmer", "technician",
    "artist", "painter", "sculptor", "musician", "singer", "dancer", "actor", "actress",
    "writer", "author", "poet", "journalist", "reporter", "editor",
    "lawyer", "attorney", "judge", "prosecutor", "defender", "paralegal",
    "police", "officer", "detective", "sheriff", "agent", "guard", "security",
    "firefighter", "paramedic", "EMT", "rescuer", "lifeguard",
    "soldier", "sailor", "marine", "airman", "officer", "general", "admiral",
    "pilot", "captain", "driver", "conductor", "engineer", "operator",
    "athlete", "player", "coach", "trainer", "referee", "umpire",
    "clerk", "cashier", "teller", "receptionist", "secretary", "assistant",
    "manager", "supervisor", "director", "executive", "CEO", "president",
    "worker", "employee", "staff", "personnel", "laborer", "contractor",
    "farmer", "rancher", "gardener", "landscaper", "florist",
    "carpenter", "plumber", "electrician", "mechanic", "technician",
    "cleaner", "janitor", "maid", "housekeeper", "custodian",
    "barber", "hairdresser", "stylist", "beautician", "cosmetologist",
    "salesperson", "vendor", "merchant", "retailer", "shopkeeper",
    "counselor", "therapist", "psychologist", "psychiatrist", "social worker",
    "scientist", "researcher", "analyst", "consultant", "advisor",
    "guide", "tour guide", "interpreter", "translator", "host", "hostess",
    "photographer", "videographer", "cameraman", "filmmaker", "director",
    "model", "spokesperson", "representative", "ambassador", "delegate"
  ];
  
  // Check if the word is in the list or ends with common suffixes
  return personRoleWords.includes(lowerWord) || 
         lowerWord.endsWith("er") || 
         lowerWord.endsWith("or") || 
         lowerWord.endsWith("ist") || 
         lowerWord.endsWith("ian") || 
         lowerWord.endsWith("ant") || 
         lowerWord.endsWith("ent");
};

// Lists of celebrities, characters, and materials for variations
const celebrities = [
  "Tom Hanks", "Meryl Streep", "Leonardo DiCaprio", "Jennifer Lawrence", "Denzel Washington",
  "Viola Davis", "Brad Pitt", "Angelina Jolie", "Robert Downey Jr.", "Scarlett Johansson",
  "Will Smith", "Julia Roberts", "Johnny Depp", "Emma Stone", "Dwayne Johnson",
  "Sandra Bullock", "Chris Hemsworth", "Charlize Theron", "Ryan Reynolds", "Anne Hathaway",
  "Keanu Reeves", "Nicole Kidman", "Hugh Jackman", "Jennifer Aniston", "Idris Elba",
  "Cate Blanchett", "Matt Damon", "Halle Berry", "George Clooney", "Kate Winslet",
  "Samuel L. Jackson", "Natalie Portman", "Tom Cruise", "Reese Witherspoon", "Chris Evans",
  "Zendaya", "Daniel Craig", "Emma Watson", "Joaquin Phoenix", "Margot Robbie",
  "Benedict Cumberbatch", "Lupita Nyong'o", "Ryan Gosling", "Gal Gadot", "Christian Bale",
  "Brie Larson", "Jake Gyllenhaal", "Saoirse Ronan", "Michael B. Jordan", "Emily Blunt"
];

const fictionalCharacters = [
  "Harry Potter", "Hermione Granger", "Luke Skywalker", "Princess Leia", "James Bond",
  "Wonder Woman", "Batman", "Superman", "Spider-Man", "Captain America",
  "Iron Man", "Black Widow", "Thor", "Hulk", "Black Panther",
  "Sherlock Holmes", "Doctor Who", "Indiana Jones", "Ellen Ripley", "Han Solo",
  "Darth Vader", "Frodo Baggins", "Gandalf", "Aragorn", "Legolas",
  "Katniss Everdeen", "Jon Snow", "Daenerys Targaryen", "Tyrion Lannister", "Arya Stark",
  "Jack Sparrow", "Elsa", "Anna", "Simba", "Mulan",
  "Aladdin", "Jasmine", "Belle", "Beast", "Cinderella",
  "Snow White", "Pinocchio", "Mary Poppins", "Peter Pan", "Tinker Bell",
  "Dorothy Gale", "Wicked Witch of the West", "Glinda", "Scarecrow", "Tin Man"
];

const materials = [
  "wood", "metal", "plastic", "glass", "ceramic",
  "stone", "marble", "granite", "clay", "porcelain",
  "leather", "fabric", "cotton", "wool", "silk",
  "paper", "cardboard", "rubber", "foam", "sponge",
  "gold", "silver", "bronze", "copper", "brass",
  "steel", "iron", "aluminum", "titanium", "platinum",
  "diamond", "crystal", "quartz", "jade", "amber",
  "chocolate", "cheese", "ice", "wax", "soap",
  "concrete", "cement", "brick", "tile", "slate",
  "bamboo", "cork", "straw", "jelly", "marshmallow"
];

// Get a random celebrity or character that hasn't been used
export const getRandomCelebrityOrCharacter = async (usedWords) => {
  // Combine celebrities and fictional characters
  const allCharacters = [...celebrities, ...fictionalCharacters];
  
  // Filter out characters that have already been used
  const availableCharacters = allCharacters.filter(character => 
    !usedWords.has(character.toLowerCase())
  );
  
  // Further filter characters that exist in our repetition prevention system
  const filteredCharacters = [];
  for (const character of availableCharacters) {
    const exists = await checkComponentExistsUnified(character);
    if (!exists) {
      filteredCharacters.push(character);
    }
  }
  
  // If we have available characters, choose a random one
  if (filteredCharacters.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredCharacters.length);
    return filteredCharacters[randomIndex];
  }
  
  // If we've exhausted all characters, create a unique one by adding a number
  const baseCharacter = allCharacters[Math.floor(Math.random() * allCharacters.length)];
  return `${baseCharacter} ${Math.floor(Math.random() * 100) + 1}`;
};

// Get a random material that hasn't been used
export const getRandomMaterial = (usedWords) => {
  // Filter out materials that have already been used
  const availableMaterials = materials.filter(material => 
    !usedWords.has(material.toLowerCase()) && 
    !usedWords.has(`made of ${material}`.toLowerCase())
  );
  
  // If we have available materials, choose a random one
  if (availableMaterials.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableMaterials.length);
    return availableMaterials[randomIndex];
  }
  
  // If we've exhausted all materials, create a unique one by adding a number
  const baseMaterial = materials[Math.floor(Math.random() * materials.length)];
  return `${baseMaterial} ${Math.floor(Math.random() * 100) + 1}`;
};
