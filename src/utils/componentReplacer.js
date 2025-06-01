// This module provides logical component replacements for activities

// Map of activity types to appropriate components
const activityComponentMap = {
  // Cooking/Food related activities
  "cooking": ["pot", "pan", "spatula", "whisk", "bowl", "spoon", "knife", "cutting board", "plate", "fork", "oven", "stove", "mixer", "blender", "grater", "peeler", "measuring cup", "measuring spoon", "timer", "recipe", "apron", "oven mitt", "tongs", "ladle", "colander", "strainer"],
  
  "baking": ["flour", "sugar", "eggs", "butter", "milk", "mixing bowl", "whisk", "spatula", "measuring cup", "measuring spoon", "rolling pin", "baking sheet", "oven", "timer", "mixer", "sifter", "cooling rack", "cake pan", "muffin tin", "piping bag", "frosting", "sprinkles", "vanilla extract", "chocolate chips"],
  
  // Crafting/Art activities
  "painting": ["canvas", "brush", "paint", "palette", "easel", "water jar", "cloth", "smock", "pencil", "eraser", "sketch pad", "reference photo", "masking tape", "frame", "varnish", "sponge", "spray bottle", "color wheel", "dropper", "paint tube"],
  
  "drawing": ["pencil", "paper", "eraser", "sharpener", "ruler", "compass", "marker", "pen", "sketchbook", "charcoal", "blending stump", "reference photo", "clipboard", "desk lamp", "template", "tracing paper", "ink bottle", "colored pencil set"],
  
  "crafting": ["scissors", "glue stick", "construction paper", "cardboard", "masking tape", "ruler", "marker", "string", "ribbon", "fabric", "needle", "thread", "beads", "wire", "pliers", "acrylic paint", "paintbrush", "template", "stickers", "buttons", "yarn", "felt sheet"],
  
  // Building/Construction activities
  "building": ["hammer", "nail", "screwdriver", "screw", "power drill", "saw", "lumber", "measuring tape", "level", "square", "pencil", "sandpaper", "clamp", "workbench", "safety goggles", "work gloves", "blueprint", "ladder", "paint can", "paintbrush"],
  
  "repairing": ["screwdriver", "wrench", "pliers", "hammer", "tape measure", "level", "spare parts", "instruction manual", "lubricant oil", "replacement part", "super glue", "clamp", "multimeter", "flashlight", "safety glasses", "work gloves", "electrical wire", "duct tape", "battery", "fuse"],
  
  // Gardening/Outdoor activities
  "gardening": ["shovel", "gardener", "rake", "hoe", "trowel", "seed packet", "potting soil", "watering can", "gardening gloves", "sun hat", "kneeling pad", "wheelbarrow", "pruning shears", "seedling", "plant pot", "fertilizer", "garden hose", "sprinkler", "weed puller"],
  
  "planting": ["seed packet", "potting soil", "terracotta pot", "trowel", "watering can", "gardening gloves", "fertilizer", "plant label", "spray bottle", "pruning shears", "seedling", "bulb", "root ball", "garden bed", "compost", "mulch", "plant stake", "garden twine"],
  
  // Cleaning activities
  "cleaning": ["vacuum cleaner", "mop", "cleaning person", "broom", "feather duster", "microfiber cloth", "cleaning spray", "bucket", "sponge", "rubber gloves", "dish soap", "laundry detergent", "scrub brush", "toilet brush", "trash bag", "paper towel roll", "plunger", "window squeegee", "bleach bottle"],
  
  // Sports/Exercise activities
  "playing": ["baseball", "baseball bat", "tennis racket", "volleyball net", "soccer goal", "basketball hoop", "catcher's mitt", "hockey helmet", "knee pads", "team jersey", "referee whistle", "scoreboard", "playing field", "tennis court", "stopwatch", "referee", "teammate", "opponent"],
  
  "exercising": ["yoga mat", "dumbbells", "resistance band", "medicine ball", "weight bench", "treadmill", "interval timer", "water bottle", "sweat towel", "running shoes", "workout clothes", "playlist", "gym mirror", "personal trainer", "workout plan", "fitness tracker", "heart rate monitor", "jump rope"],
  
  // Music activities
  "performing": ["guitar", "microphone", "microphone stand", "sheet music", "amplifier", "speaker", "audio cable", "guitar tuner", "guitar pick", "violin bow", "saxophone reed", "trumpet mouthpiece", "sustain pedal", "stage costume", "stage prop", "spotlight", "audience seats", "conductor's baton"],
  
  "recording": ["condenser microphone", "studio headphones", "laptop", "recording software", "audio interface", "XLR cable", "pop filter", "microphone stand", "electric guitar", "mixing console", "studio monitor", "acoustic panels", "recording booth", "multitrack recording", "vocal take", "music producer", "sound engineer"],
  
  // Technology activities
  "filming": ["video camera", "tripod", "shotgun microphone", "lighting kit", "green screen", "movie script", "costume rack", "makeup kit", "camera lens", "memory card", "camera battery", "director's monitor", "clapperboard", "film director", "actor", "filming location", "boom microphone", "green screen backdrop"],
  
  "editing": ["editing computer", "editing software", "computer mouse", "keyboard", "dual monitors", "raw footage", "audio track", "editing timeline", "visual effect", "transition effect", "text overlay", "motion graphic", "export button", "backup drive", "studio headphones", "reference video", "client feedback", "deadline calendar"],
  
  // Outdoor/Adventure activities
  "camping": ["tent", "sleeping bag", "hiking backpack", "camping stove", "lantern", "flashlight", "waterproof matches", "freeze-dried food", "water bottle", "trail map", "compass", "pocket knife", "paracord", "first aid kit", "insect repellent", "sunscreen", "hiking hat", "hiking boots"],
  
  "hiking": ["hiking boots", "backpack", "trail map", "compass", "water bottle", "trail mix", "sun hat", "sunscreen lotion", "trekking pole", "binoculars", "camera", "first aid kit", "emergency whistle", "rain jacket", "base layer", "hiking trail", "guidebook"],
  
  // General/Miscellaneous activities
  "assembling": ["component parts", "instruction manual", "phillips screwdriver", "adjustable wrench", "bolt", "nut", "washer", "allen key", "rubber mallet", "needle-nose pliers", "wood glue", "tape measure", "bubble level", "assembly diagram", "parts box", "packaging material", "warranty card", "user manual"],
  
  "organizing": ["storage box", "plastic bin", "label maker", "bookshelf", "drawer divider", "clothes hanger", "file folder", "drawer divider", "storage container", "wicker basket", "garbage bag", "checklist", "permanent marker", "masking tape", "wall hook", "organization system", "category label", "inventory list"],
  
  "teaching": ["textbook", "whiteboard", "dry-erase marker", "board eraser", "laser pointer", "printed handout", "slideshow presentation", "teacher's laptop", "projector", "student desk", "classroom chair", "student", "lecture notes", "quiz paper", "homework assignment", "lesson plan", "grade book", "teaching example"],
  
  "studying": ["textbook", "spiral notebook", "ballpoint pen", "mechanical pencil", "highlighter marker", "laptop computer", "scientific calculator", "study flashcard", "reference book", "class notes", "practice test", "study desk", "desk lamp", "office chair", "study timer", "planner", "bookmark", "index card"],
  
  "writing": ["fountain pen", "mechanical pencil", "notebook paper", "leather journal", "laptop computer", "keyboard", "story idea", "chapter outline", "first draft", "edited revision", "dictionary", "thesaurus", "research book", "research notes", "editor's feedback", "publishing contract", "submission deadline", "inspiration board"],
  
  "photographing": ["DSLR camera", "zoom lens", "camera tripod", "memory card", "spare battery", "external flash", "reflector panel", "photo backdrop", "portrait subject", "studio light", "lens filter", "shutter release", "aperture ring", "ISO setting", "composition grid", "camera angle", "perspective shot", "photo portfolio"],
  
  "driving": ["car key", "steering wheel", "brake pedal", "gear shift", "seat belt", "rear-view mirror", "windshield", "windshield wiper", "headlight switch", "turn signal", "brake light", "accelerator pedal", "fuel gauge", "road map", "GPS device", "front passenger", "highway road", "traffic light"],
  
  "flying": ["airplane", "helicopter", "control yoke", "instrument panel", "airport runway", "terminal building", "airline passenger", "checked luggage", "boarding pass", "passport", "safety belt", "oxygen mask", "life vest", "tray table", "window shade", "noise-canceling headphones", "travel pillow"],
  
  "sailing": ["sailboat", "mainsail", "mooring rope", "boat anchor", "life jacket", "marine compass", "nautical map", "rudder", "wind direction", "open water", "boat dock", "marina harbor", "crew member", "boat captain", "weather forecast", "tide chart", "navigation light", "marine binoculars"],
  
  // Medical activities
  "surgery": ["scalpel", "surgical forceps", "retractor", "suture needle", "surgical thread", "surgical scissors", "surgical gloves", "surgical mask", "operating table", "anesthesia machine", "vital monitor", "surgical light", "sterilized gauze", "surgical tray", "IV drip", "blood pressure cuff", "stethoscope", "surgical gown"],
  
  "diagnosing": ["stethoscope", "blood pressure cuff", "thermometer", "otoscope", "reflex hammer", "tongue depressor", "medical chart", "x-ray film", "MRI scan", "blood test results", "examination table", "medical gloves", "patient history", "prescription pad", "medical reference", "diagnostic manual"],
  
  // Sports activities
  "basketball": ["basketball", "basketball hoop", "backboard", "court floor", "referee whistle", "scoreboard", "team jersey", "basketball shoes", "shot clock", "free throw line", "three-point line", "bench", "water bottle", "coach's clipboard", "timeout card", "basketball strategy"],
  
  "football": ["football", "goal post", "field marker", "referee whistle", "penalty flag", "shoulder pads", "football helmet", "mouth guard", "football cleat", "playbook", "down marker", "field goal", "quarterback", "receiver", "defensive line", "offensive strategy"],
  
  "swimming": ["swimming goggles", "swim cap", "swimsuit", "kickboard", "lane divider", "starting block", "pool water", "swim fins", "hand paddles", "nose clip", "stopwatch", "coach's whistle", "pool deck", "diving board", "swimming technique", "breathing rhythm"],
  
  // Performance activities
  "dancing": ["dance shoes", "dance floor", "mirror wall", "ballet barre", "music speaker", "choreography notes", "costume", "stage light", "dance partner", "rhythm count", "dance routine", "performance space", "audience seats", "backstage area", "warm-up mat", "water bottle"],
  
  "acting": ["script", "stage mark", "costume", "prop table", "stage light", "microphone", "stage direction", "character note", "rehearsal space", "director's chair", "makeup kit", "stage curtain", "audience seats", "backstage area", "cue card", "acting technique"],
  
  // Default components for any activity - more specific than before
  "default": ["wooden mallet", "steel pliers", "leather gloves", "safety goggles", "digital timer", "measuring tape", "precision scale", "utility knife", "magnifying glass", "clipboard", "instruction manual", "reference guide", "protective mask", "storage container", "carrying case", "extension cord", "work table", "adjustable lamp"]
};

// Helper function to determine the activity type from the activity verb
const determineActivityType = (activityVerb) => {
  // Convert to lowercase for case-insensitive matching
  const verb = activityVerb.toLowerCase();
  
  // Check for specific activity types
  for (const [type, _] of Object.entries(activityComponentMap)) {
    if (verb.includes(type)) {
      return type;
    }
  }
  
  // Check for common cooking verbs
  if (verb.includes("cook") || verb.includes("mak") || verb.includes("prepar") || 
      verb.includes("mix") || verb.includes("stir") || verb.includes("chop") ||
      verb.includes("slice") || verb.includes("dice") || verb.includes("grill") ||
      verb.includes("roast") || verb.includes("boil") || verb.includes("fry")) {
    return "cooking";
  }
  
  // Check for baking verbs
  if (verb.includes("bak") || verb.includes("knead") || verb.includes("frost") ||
      verb.includes("decorate") || verb.includes("whip") || verb.includes("cream")) {
    return "baking";
  }
  
  // Check for art verbs
  if (verb.includes("paint") || verb.includes("sketch") || verb.includes("draw") ||
      verb.includes("illustrat") || verb.includes("color") || verb.includes("design")) {
    return "painting";
  }
  
  // Check for building verbs
  if (verb.includes("build") || verb.includes("construct") || verb.includes("assemble") ||
      verb.includes("erect") || verb.includes("install") || verb.includes("create")) {
    return "building";
  }
  
  // Check for repair verbs
  if (verb.includes("fix") || verb.includes("repair") || verb.includes("mend") ||
      verb.includes("restore") || verb.includes("service") || verb.includes("maintain")) {
    return "repairing";
  }
  
  // Check for gardening verbs
  if (verb.includes("garden") || verb.includes("grow") || verb.includes("cultivat") ||
      verb.includes("weed") || verb.includes("prune") || verb.includes("harvest")) {
    return "gardening";
  }
  
  // Check for cleaning verbs
  if (verb.includes("clean") || verb.includes("wash") || verb.includes("scrub") ||
      verb.includes("dust") || verb.includes("vacuum") || verb.includes("mop") ||
      verb.includes("polish") || verb.includes("sanitize")) {
    return "cleaning";
  }
  
  // Check for playing verbs
  if (verb.includes("play") || verb.includes("compet") || verb.includes("game") ||
      verb.includes("match") || verb.includes("sport")) {
    return "playing";
  }
  
  // Check for music verbs
  if (verb.includes("sing") || verb.includes("perform") || verb.includes("play music") ||
      verb.includes("concert") || verb.includes("recital") || verb.includes("band")) {
    return "performing";
  }
  
  // Check for filming verbs
  if (verb.includes("film") || verb.includes("shoot") || verb.includes("record") ||
      verb.includes("direct") || verb.includes("produce") || verb.includes("movie")) {
    return "filming";
  }
  
  // Check for outdoor verbs
  if (verb.includes("camp") || verb.includes("hike") || verb.includes("climb") ||
      verb.includes("trek") || verb.includes("backpack") || verb.includes("outdoor")) {
    return "camping";
  }
  
  // Check for medical verbs
  if (verb.includes("surg") || verb.includes("operat") || verb.includes("transplant") ||
      verb.includes("remov") || verb.includes("implant")) {
    return "surgery";
  }
  
  if (verb.includes("diagnos") || verb.includes("examin") || verb.includes("check") ||
      verb.includes("test") || verb.includes("scan") || verb.includes("screen")) {
    return "diagnosing";
  }
  
  // Check for sports verbs
  if (verb.includes("basketball") || verb.includes("dunk") || verb.includes("shoot hoops")) {
    return "basketball";
  }
  
  if (verb.includes("football") || verb.includes("tackle") || verb.includes("quarterback")) {
    return "football";
  }
  
  if (verb.includes("swim") || verb.includes("dive") || verb.includes("freestyle")) {
    return "swimming";
  }
  
  // Check for performance verbs
  if (verb.includes("danc") || verb.includes("choreograph") || verb.includes("ballet")) {
    return "dancing";
  }
  
  if (verb.includes("act") || verb.includes("perform") || verb.includes("portray") ||
      verb.includes("character") || verb.includes("role")) {
    return "acting";
  }
  
  // Default to "default" if no specific type is found
  return "default";
};

// Get a random component that is appropriate for the activity
export const getRandomComponent = (activityVerb) => {
  // Determine the activity type
  const activityType = determineActivityType(activityVerb);
  
  // Get the appropriate components for this activity type
  const components = activityComponentMap[activityType] || activityComponentMap["default"];
  
  // Choose a random component
  const randomIndex = Math.floor(Math.random() * components.length);
  return components[randomIndex];
};

// Get a random component that is appropriate for the activity and not already used
export const getUniqueRandomComponent = (activityVerb, existingComponents = [], usedWords = new Set()) => {
  // Determine the activity type
  const activityType = determineActivityType(activityVerb);
  
  // Get the appropriate components for this activity type
  const allComponents = activityComponentMap[activityType] || activityComponentMap["default"];
  
  // Convert usedWords to lowercase for case-insensitive comparison
  const usedWordsLower = new Set(Array.from(usedWords).map(word => word.toLowerCase()));
  
  // Convert existingComponents to lowercase for case-insensitive comparison
  const existingComponentsLower = existingComponents.map(comp => comp.toLowerCase());
  
  // Filter out components that are already in use or have been used before
  const availableComponents = allComponents.filter(component => 
    !existingComponentsLower.includes(component.toLowerCase()) &&
    !usedWordsLower.has(component.toLowerCase())
  );
  
  // If we've exhausted all components for this activity type, try the default category
  if (availableComponents.length === 0) {
    const defaultComponents = activityComponentMap["default"].filter(component => 
      !existingComponentsLower.includes(component.toLowerCase()) &&
      !usedWordsLower.has(component.toLowerCase())
    );
    
    // If even the default category is exhausted, generate a completely unique component
    if (defaultComponents.length === 0) {
      // Generate a more specific component name based on the activity type
      const specificItems = {
        "cooking": ["copper pot", "chef's knife", "silicone spatula", "digital thermometer"],
        "baking": ["pastry brush", "cookie cutter", "cake tester", "silicone baking mat"],
        "surgery": ["surgical clamp", "bone saw", "surgical stapler", "cauterizing tool"],
        "painting": ["fan brush", "palette knife", "canvas stretcher", "masking fluid"],
        "default": ["precision tool", "specialized equipment", "essential accessory", "professional-grade implement"]
      };
      
      const specificList = specificItems[activityType] || specificItems["default"];
      const randomSpecific = specificList[Math.floor(Math.random() * specificList.length)];
      return `${randomSpecific} #${Math.floor(Math.random() * 100) + 1}`;
    }
    
    const randomIndex = Math.floor(Math.random() * defaultComponents.length);
    return defaultComponents[randomIndex];
  }
  
  // Choose a random component from the available ones
  const randomIndex = Math.floor(Math.random() * availableComponents.length);
  return availableComponents[randomIndex];
};

// Generate a set of unique components for an activity
export const generateUniqueComponents = (activityVerb, count = 3, usedWords = new Set()) => {
  const components = [];
  
  for (let i = 0; i < count; i++) {
    const component = getUniqueRandomComponent(activityVerb, components, usedWords);
    components.push(component);
  }
  
  return components;
};

// Export the activity component map for testing or other uses
export { activityComponentMap, determineActivityType };
