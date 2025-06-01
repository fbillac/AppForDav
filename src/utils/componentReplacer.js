// This module provides logical component replacements for activities

// Map of activity types to appropriate components
const activityComponentMap = {
  // Cooking/Food related activities
  "cooking": ["pot", "pan", "spatula", "whisk", "bowl", "spoon", "knife", "cutting board", "plate", "fork", "oven", "stove", "mixer", "blender", "grater", "peeler", "measuring cup", "measuring spoon", "timer", "recipe", "apron", "oven mitt", "tongs", "ladle", "colander", "strainer"],
  
  "baking": ["flour", "sugar", "eggs", "butter", "milk", "mixing bowl", "whisk", "spatula", "measuring cup", "measuring spoon", "rolling pin", "baking sheet", "oven", "timer", "mixer", "sifter", "cooling rack", "cake pan", "muffin tin", "piping bag", "frosting", "sprinkles", "vanilla", "chocolate chips"],
  
  // Crafting/Art activities
  "painting": ["canvas", "brush", "paint", "palette", "easel", "water", "cloth", "smock", "pencil", "eraser", "sketch", "reference", "tape", "frame", "varnish", "sponge", "spray bottle", "color wheel", "dropper", "paint tube"],
  
  "drawing": ["pencil", "paper", "eraser", "sharpener", "ruler", "compass", "marker", "pen", "sketchbook", "charcoal", "blending stump", "reference", "clipboard", "desk", "lamp", "template", "tracing paper", "ink", "colored pencil"],
  
  "crafting": ["scissors", "glue", "paper", "cardboard", "tape", "ruler", "marker", "string", "ribbon", "fabric", "needle", "thread", "beads", "wire", "pliers", "paint", "brush", "template", "stickers", "buttons", "yarn", "felt"],
  
  // Building/Construction activities
  "building": ["hammer", "nail", "screwdriver", "screw", "drill", "saw", "wood", "measuring tape", "level", "square", "pencil", "sandpaper", "clamp", "workbench", "safety goggles", "gloves", "blueprint", "ladder", "paint", "brush"],
  
  "repairing": ["screwdriver", "wrench", "pliers", "hammer", "tape measure", "level", "parts", "manual", "lubricant", "replacement", "glue", "clamp", "multimeter", "flashlight", "safety glasses", "gloves", "wire", "tape", "battery", "fuse"],
  
  // Gardening/Outdoor activities
  "gardening": ["shovel", "rake", "hoe", "trowel", "seeds", "soil", "water", "watering can", "gloves", "hat", "kneeling pad", "wheelbarrow", "pruners", "shears", "plant", "pot", "fertilizer", "hose", "sprinkler", "weed"],
  
  "planting": ["seeds", "soil", "pot", "trowel", "watering can", "gloves", "fertilizer", "label", "spray bottle", "pruners", "plant", "bulb", "seedling", "garden bed", "compost", "mulch", "stake", "twine", "dibber"],
  
  // Cleaning activities
  "cleaning": ["vacuum", "mop", "broom", "duster", "cloth", "spray", "bucket", "sponge", "gloves", "soap", "detergent", "scrubber", "brush", "trash bag", "paper towel", "plunger", "squeegee", "bleach", "vinegar"],
  
  // Sports/Exercise activities
  "playing": ["ball", "bat", "racket", "net", "goal", "hoop", "glove", "helmet", "pads", "uniform", "whistle", "scoreboard", "field", "court", "timer", "referee", "teammate", "opponent", "strategy", "playbook"],
  
  "exercising": ["mat", "weights", "band", "ball", "bench", "machine", "timer", "water bottle", "towel", "shoes", "clothes", "music", "mirror", "trainer", "plan", "tracker", "heart monitor", "jump rope", "foam roller"],
  
  // Music activities
  "performing": ["instrument", "microphone", "stand", "sheet music", "amplifier", "speaker", "cable", "tuner", "pick", "bow", "reed", "mouthpiece", "pedal", "costume", "prop", "stage", "spotlight", "audience", "script"],
  
  "recording": ["microphone", "headphones", "computer", "software", "interface", "cable", "pop filter", "stand", "instrument", "mixer", "monitor", "soundproofing", "studio", "track", "take", "producer", "engineer"],
  
  // Technology activities
  "filming": ["camera", "tripod", "microphone", "light", "backdrop", "script", "prop", "costume", "lens", "memory card", "battery", "monitor", "clapboard", "director", "actor", "location", "boom mic", "green screen"],
  
  "editing": ["computer", "software", "mouse", "keyboard", "monitor", "footage", "audio", "timeline", "effect", "transition", "text", "graphic", "export", "backup", "headphones", "reference", "client", "deadline"],
  
  // Outdoor/Adventure activities
  "camping": ["tent", "sleeping bag", "backpack", "stove", "lantern", "flashlight", "matches", "food", "water", "map", "compass", "knife", "rope", "first aid kit", "insect repellent", "sunscreen", "hat", "boots", "clothing"],
  
  "hiking": ["boots", "backpack", "map", "compass", "water bottle", "snack", "hat", "sunscreen", "walking stick", "binoculars", "camera", "first aid kit", "whistle", "rain jacket", "layers", "trail", "guidebook"],
  
  // General/Miscellaneous activities
  "assembling": ["parts", "instructions", "screwdriver", "wrench", "bolt", "nut", "washer", "allen key", "hammer", "pliers", "glue", "tape measure", "level", "diagram", "box", "packaging", "warranty", "manual"],
  
  "organizing": ["box", "bin", "label", "shelf", "drawer", "hanger", "folder", "divider", "container", "basket", "bag", "list", "marker", "tape", "hook", "system", "category", "inventory", "space"],
  
  "teaching": ["book", "whiteboard", "marker", "eraser", "pointer", "handout", "presentation", "computer", "projector", "desk", "chair", "student", "note", "test", "assignment", "lesson plan", "grade book", "example"],
  
  "studying": ["book", "notebook", "pen", "pencil", "highlighter", "computer", "calculator", "flashcard", "textbook", "notes", "assignment", "test", "desk", "lamp", "chair", "timer", "planner", "bookmark"],
  
  "writing": ["pen", "pencil", "paper", "notebook", "computer", "keyboard", "idea", "outline", "draft", "revision", "dictionary", "thesaurus", "reference", "research", "editor", "publisher", "deadline", "inspiration"],
  
  "photographing": ["camera", "lens", "tripod", "memory card", "battery", "flash", "reflector", "backdrop", "subject", "light", "filter", "shutter", "aperture", "ISO", "composition", "angle", "perspective", "portfolio"],
  
  "driving": ["car", "key", "steering wheel", "pedal", "gear shift", "seat belt", "mirror", "windshield", "wiper", "headlight", "turn signal", "brake", "accelerator", "fuel", "map", "GPS", "passenger", "road"],
  
  "flying": ["airplane", "helicopter", "control", "instrument", "runway", "airport", "passenger", "luggage", "ticket", "passport", "seat belt", "oxygen mask", "life vest", "tray table", "window", "headphones", "pillow"],
  
  "sailing": ["boat", "sail", "rope", "anchor", "life jacket", "compass", "map", "rudder", "wind", "water", "dock", "harbor", "crew", "captain", "weather", "tide", "navigation", "binoculars"],
  
  // Default components for any activity
  "default": ["tool", "equipment", "supply", "material", "instrument", "device", "accessory", "item", "object", "implement", "apparatus", "gadget", "utensil", "container", "resource", "component", "element", "piece"]
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
export const getUniqueRandomComponent = (activityVerb, existingComponents = []) => {
  // Determine the activity type
  const activityType = determineActivityType(activityVerb);
  
  // Get the appropriate components for this activity type
  const allComponents = activityComponentMap[activityType] || activityComponentMap["default"];
  
  // Filter out components that are already in use
  const availableComponents = allComponents.filter(component => 
    !existingComponents.includes(component)
  );
  
  // If we've exhausted all components for this activity type, fall back to the default category
  if (availableComponents.length === 0) {
    const defaultComponents = activityComponentMap["default"].filter(component => 
      !existingComponents.includes(component)
    );
    
    // If even the default category is exhausted, generate a completely unique component
    if (defaultComponents.length === 0) {
      return `${activityType} item ${Math.floor(Math.random() * 1000)}`;
    }
    
    const randomIndex = Math.floor(Math.random() * defaultComponents.length);
    return defaultComponents[randomIndex];
  }
  
  // Choose a random component from the available ones
  const randomIndex = Math.floor(Math.random() * availableComponents.length);
  return availableComponents[randomIndex];
};

// Generate a set of unique components for an activity
export const generateUniqueComponents = (activityVerb, count = 3) => {
  const components = [];
  
  for (let i = 0; i < count; i++) {
    const component = getUniqueRandomComponent(activityVerb, components);
    components.push(component);
  }
  
  return components;
};

// Export the activity component map for testing or other uses
export { activityComponentMap, determineActivityType };
