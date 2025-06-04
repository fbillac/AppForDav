// Statement generator utility
import openAIService from './openaiService';
import { generateUniqueComponents, getRandomComponent } from './componentReplacer';

// Generate a statement with components
export const generateStatement = async (numComponents = 3, usedWords = new Set()) => {
  try {
    // Try to use OpenAI if it's initialized
    if (openAIService.initialized) {
      // Generate activity with OpenAI
      const activity = await openAIService.generateActivity(numComponents);
      
      // Format the response
      return {
        activityVerb: activity.activityVerb,
        selectedComponents: activity.components
      };
    } else {
      // Fall back to local data
      console.log("OpenAI not initialized, using local data for statement generation");
      return fallbackGenerateStatement(numComponents, usedWords);
    }
  } catch (error) {
    console.error("Error using OpenAI for statement generation, falling back to local data:", error);
    return fallbackGenerateStatement(numComponents, usedWords);
  }
};

// Fallback to local data if OpenAI is not available
const fallbackGenerateStatement = (numComponents = 3, usedWords = new Set()) => {
  // List of activities - all visually demonstrable for charades
  const activities = [
    // Cooking/Baking (visually demonstrable actions)
    "Flipping pancakes", "Decorating a cake", "Rolling sushi", 
    "Grilling burgers", "Kneading bread dough", "Chopping vegetables",
    "Making pasta", "Stirring soup", "Flambéing dessert",
    "Whipping cream", "Peeling potatoes", "Slicing bread",
    "Cracking eggs", "Frosting cupcakes", "Making a sandwich",
    "Tossing a salad", "Baking cookies", "Squeezing oranges",
    "Flipping an omelette", "Shaking a cocktail", "Pouring coffee",
    "Spreading butter", "Whisking eggs", "Mashing potatoes",
    
    // Home Improvement/DIY (physical actions)
    "Hammering nails", "Painting a wall", "Sawing wood", 
    "Drilling holes", "Measuring furniture", "Sanding wood",
    "Hanging a picture", "Assembling furniture", "Tightening screws",
    "Laying tiles", "Building a birdhouse", "Installing a shelf",
    "Changing a lightbulb", "Unclogging a drain", "Mowing the lawn",
    
    // Arts & Crafts (visible actions)
    "Painting a portrait", "Sculpting clay", "Knitting a scarf", 
    "Drawing a face", "Cutting paper", "Carving wood",
    "Weaving fabric", "Folding origami", "Pouring candle wax",
    "Sketching landscapes", "Sewing buttons", "Making jewelry",
    "Folding paper cranes", "Quilting fabric", "Tying macrame knots",
    "Painting with brushes", "Sketching with pencils", "Folding paper animals",
    
    // Sports (highly mimeable)
    "Serving tennis", "Shooting basketball", "Pitching baseball", 
    "Kicking soccer ball", "Swinging golf club", "Bowling strikes",
    "Playing badminton", "Shooting arrows", "Playing ping pong",
    "Playing hockey", "Skateboarding tricks", "Surfing waves",
    "Dribbling soccer", "Running marathon", "Swimming freestyle",
    "Cycling uphill", "Batting cricket", "Snowboarding jumps",
    "Tackling rugby", "Paddling kayak", "Rock climbing",
    "Playing volleyball", "Fencing duels", "Diving into water",
    "Playing hockey", "Karate chopping", "Doing gymnastics",
    
    // Music (physical actions)
    "Playing guitar", "Playing piano", "Drumming beats", 
    "Playing violin", "Singing opera", "Playing saxophone",
    "Conducting orchestra", "Playing bass", "Recording vocals",
    "Playing trumpet", "Strumming ukulele", "Playing cello",
    "Singing in choir", "Playing flute", "Composing music",
    
    // Technology (visible actions)
    "Typing code", "Building a computer", "Setting up speakers", 
    "Taking photos", "Editing videos", "Drawing digital art",
    "Programming robots", "Playing video games", "Filming scenes",
    "Recording podcasts", "Designing logos", "Drawing animations",
    
    // Gardening (physical actions)
    "Planting seeds", "Pruning roses", "Watering plants", 
    "Digging holes", "Raking leaves", "Mowing lawns",
    "Planting flowers", "Trimming hedges", "Building garden beds",
    "Planting herbs", "Repotting plants", "Weeding gardens",
    
    // Cleaning (visible actions)
    "Vacuuming floors", "Washing windows", "Polishing silver", 
    "Scrubbing tiles", "Dusting shelves", "Organizing closets",
    "Cleaning appliances", "Folding laundry", "Mopping floors",
    "Dusting fans", "Washing cars", "Sweeping floors",
    
    // Outdoor Activities (mimeable)
    "Hiking trails", "Setting up tents", "Fishing with rods", 
    "Watching birds", "Paddling kayaks", "Stargazing",
    "Carrying backpacks", "Hunting deer", "Taking wildlife photos",
    "Sailing boats", "Paddling canoes", "Snorkeling reefs",
    "Mountain biking", "Cross-country skiing", "Rafting rapids",
    
    // Professional Activities (demonstrable)
    "Performing surgery", "Teaching class", "Arguing cases", 
    "Writing articles", "Directing movies", "Drawing blueprints",
    "Flying planes", "Selling products", "Conducting experiments",
    "Showing houses", "Fixing engines", "Designing clothes",
    "Investigating crimes", "Forecasting weather", "Translating languages",
    
    // Entertainment (highly mimeable)
    "Acting in plays", "Dancing ballet", "Telling jokes", 
    "Hosting shows", "Juggling balls", "Performing magic tricks",
    "Telling stories", "Singing in musicals", "Reciting poems",
    "Performing puppetry", "Doing impressions", "Performing mime",
    
    // Transportation (mimeable actions)
    "Driving cars", "Flying planes", "Sailing boats", 
    "Riding motorcycles", "Steering ships", "Riding hot air balloons",
    "Racing cars", "Flying helicopters", "Captaining boats",
    "Riding bicycles", "Driving trains", "Flying gliders",
    
    // Miscellaneous Mimeable Activities
    "Solving puzzles", "Building models", "Collecting stamps", 
    "Fixing old cars", "Training dogs", "Keeping bees",
    "Making cheese", "Blowing glass", "Forging metal",
    "Fixing furniture", "Feeding fish", "Trimming hedges",
    "Playing board games", "Building dollhouses", "Binding books",
    "Carving ice", "Making jewelry", "Building ships",
    "Sculpting sand", "Solving crosswords", "Flying kites",
    "Making chocolates", "Drawing tattoos", "Building terrariums"
  ];
  
  // Convert usedWords to lowercase for case-insensitive comparison
  const usedWordsLower = new Set(Array.from(usedWords).map(word => word.toLowerCase()));
  
  // Filter out activities that have been used before
  const availableActivities = activities.filter(activity => {
    // Check if any word in the activity has been used before
    const activityWords = activity.toLowerCase().split(/\s+/);
    return !activityWords.some(word => usedWordsLower.has(word));
  });
  
  // If we've exhausted all activities, generate a completely random one
  if (availableActivities.length === 0) {
    const mimeableVerbs = [
      "Building", "Assembling", "Painting", "Drawing", "Carving", 
      "Sculpting", "Crafting", "Folding", "Cutting", "Sewing",
      "Knitting", "Weaving", "Cooking", "Baking", "Mixing",
      "Stirring", "Chopping", "Slicing", "Hammering", "Drilling"
    ];
    
    const mimeableObjects = [
      "toy robot", "paper airplane", "wooden box", "clay pot", "cardboard castle",
      "paper hat", "toy car", "model ship", "sand castle", "snow fort",
      "flower bouquet", "fruit basket", "vegetable soup", "chocolate cake", "ice cream sundae",
      "wooden chair", "small table", "picture frame", "bird house", "wind chime"
    ];
    
    // Generate a random activity that hasn't been used before
    let randomActivity;
    do {
      const randomVerb = mimeableVerbs[Math.floor(Math.random() * mimeableVerbs.length)];
      const randomObject = mimeableObjects[Math.floor(Math.random() * mimeableObjects.length)];
      const randomNumber = Math.floor(Math.random() * 1000);
      randomActivity = `${randomVerb} a ${randomObject} ${randomNumber}`;
      
      // Check if any word in the random activity has been used before
      const activityWords = randomActivity.toLowerCase().split(/\s+/);
    } while (randomActivity.toLowerCase().split(/\s+/).some(word => usedWordsLower.has(word)));
    
    // Choose a random activity from available ones
    const activityVerb = randomActivity;
    
    // Generate components that are logically associated with the activity
    const selectedComponents = generateUniqueComponents(activityVerb, numComponents, usedWords);
    
    return {
      activityVerb,
      selectedComponents
    };
  }
  
  // Choose a random activity from available ones
  const randomIndex = Math.floor(Math.random() * availableActivities.length);
  const activityVerb = availableActivities[randomIndex];
  
  // Generate components that are logically associated with the activity
  const selectedComponents = generateUniqueComponents(activityVerb, numComponents, usedWords);
  
  return {
    activityVerb,
    selectedComponents
  };
};

// Ensure all components in a statement are unique
export const ensureUniqueComponents = (statement, usedWords = new Set()) => {
  if (!statement || !statement.selectedComponents || !Array.isArray(statement.selectedComponents)) {
    return statement;
  }
  
  const { activityVerb, selectedComponents } = statement;
  
  // Check if we have the right number of components
  const uniqueComponents = [...new Set(selectedComponents.map(comp => comp.toLowerCase()))];
  
  // If we already have the right number of unique components, return the statement as is
  if (uniqueComponents.length === selectedComponents.length) {
    return statement;
  }
  
  // Otherwise, generate new components to replace duplicates
  const newComponents = [...selectedComponents];
  const seenComponents = new Set();
  
  for (let i = 0; i < newComponents.length; i++) {
    const component = newComponents[i].toLowerCase();
    
    // If this component is a duplicate, replace it
    if (seenComponents.has(component)) {
      newComponents[i] = getRandomComponent(activityVerb);
    }
    
    seenComponents.add(newComponents[i].toLowerCase());
  }
  
  return {
    activityVerb,
    selectedComponents: newComponents
  };
};
