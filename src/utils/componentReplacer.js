// This module handles component replacement and generation
import { checkComponentExistsUnified, addComponentUnified } from './repetitionPrevention';
import openAIService from './openaiService';

// Lists of common roles and professions to identify people/roles
const roles = [
  "doctor", "nurse", "surgeon", "dentist", "veterinarian", "pharmacist", "therapist", "psychologist",
  "teacher", "professor", "instructor", "tutor", "principal", "dean", "counselor", "librarian",
  "chef", "cook", "baker", "waiter", "waitress", "server", "bartender", "barista", "sommelier",
  "police officer", "detective", "sheriff", "security guard", "firefighter", "paramedic", "lifeguard",
  "lawyer", "judge", "attorney", "prosecutor", "defender", "paralegal", "notary", "mediator",
  "engineer", "architect", "designer", "developer", "programmer", "scientist", "researcher", "analyst",
  "artist", "musician", "actor", "actress", "dancer", "singer", "composer", "director", "producer",
  "writer", "author", "editor", "journalist", "reporter", "photographer", "videographer", "animator",
  "athlete", "player", "coach", "trainer", "referee", "umpire", "announcer", "commentator",
  "pilot", "captain", "driver", "conductor", "navigator", "astronaut", "sailor", "fisherman",
  "farmer", "gardener", "rancher", "forester", "miner", "logger", "hunter", "gatherer",
  "carpenter", "plumber", "electrician", "mechanic", "welder", "painter", "roofer", "mason",
  "cashier", "clerk", "receptionist", "secretary", "assistant", "manager", "supervisor", "executive",
  "salesperson", "representative", "agent", "broker", "consultant", "advisor", "analyst", "specialist",
  "soldier", "officer", "general", "admiral", "sergeant", "corporal", "private", "cadet",
  "priest", "pastor", "minister", "rabbi", "imam", "monk", "nun", "chaplain",
  "king", "queen", "prince", "princess", "duke", "duchess", "lord", "lady", "knight",
  "president", "prime minister", "senator", "representative", "mayor", "governor", "diplomat", "ambassador",
  "student", "pupil", "apprentice", "intern", "volunteer", "member", "citizen", "resident",
  "patient", "client", "customer", "guest", "visitor", "passenger", "traveler", "tourist",
  "man", "woman", "boy", "girl", "child", "adult", "teenager", "senior", "elder", "baby", "toddler",
  "friend", "neighbor", "colleague", "partner", "spouse", "husband", "wife", "parent", "father", "mother",
  "son", "daughter", "brother", "sister", "uncle", "aunt", "cousin", "nephew", "niece", "grandparent",
  "grandmother", "grandfather", "grandchild", "grandson", "granddaughter", "in-law", "stepparent", "stepchild"
];

// Lists of celebrities and fictional characters for replacements
const celebrities = [
  // Actors and Actresses
  "Tom Hanks", "Meryl Streep", "Leonardo DiCaprio", "Jennifer Lawrence", "Denzel Washington",
  "Julia Roberts", "Brad Pitt", "Angelina Jolie", "Robert Downey Jr.", "Scarlett Johansson",
  "Will Smith", "Emma Stone", "Johnny Depp", "Viola Davis", "Tom Cruise", "Sandra Bullock",
  "Morgan Freeman", "Charlize Theron", "Samuel L. Jackson", "Nicole Kidman", "Harrison Ford",
  "Cate Blanchett", "Dwayne Johnson", "Natalie Portman", "Keanu Reeves", "Jennifer Aniston",
  
  // Musicians
  "Beyoncé", "Taylor Swift", "Ed Sheeran", "Adele", "Bruno Mars", "Lady Gaga", "Justin Bieber",
  "Rihanna", "Drake", "Ariana Grande", "Elton John", "Billie Eilish", "Jay-Z", "Madonna",
  "Kanye West", "Katy Perry", "Paul McCartney", "Alicia Keys", "John Legend", "Celine Dion",
  
  // Athletes
  "Michael Jordan", "Serena Williams", "Cristiano Ronaldo", "Simone Biles", "LeBron James",
  "Megan Rapinoe", "Usain Bolt", "Naomi Osaka", "Tom Brady", "Lindsey Vonn", "Tiger Woods",
  "Mia Hamm", "Muhammad Ali", "Billie Jean King", "Wayne Gretzky", "Danica Patrick",
  
  // Other Famous People
  "Albert Einstein", "Marie Curie", "Stephen Hawking", "Malala Yousafzai", "Nelson Mandela",
  "Mother Teresa", "Mahatma Gandhi", "Martin Luther King Jr.", "Abraham Lincoln", "Cleopatra",
  "Leonardo da Vinci", "Frida Kahlo", "Pablo Picasso", "Vincent van Gogh", "Walt Disney",
  "Steve Jobs", "Bill Gates", "Oprah Winfrey", "Barack Obama", "Queen Elizabeth II"
];

const fictionalCharacters = [
  // Superheroes and Comic Characters
  "Superman", "Wonder Woman", "Batman", "Spider-Man", "Iron Man", "Captain America",
  "Black Widow", "Thor", "Hulk", "Black Panther", "Wolverine", "Storm", "Deadpool",
  "Captain Marvel", "Flash", "Aquaman", "Green Lantern", "Catwoman", "Joker", "Harley Quinn",
  
  // Movie and TV Characters
  "Harry Potter", "Hermione Granger", "Luke Skywalker", "Princess Leia", "Darth Vader",
  "James Bond", "Indiana Jones", "Sherlock Holmes", "Doctor Who", "Jack Sparrow",
  "Katniss Everdeen", "Gandalf", "Frodo Baggins", "Neo", "Ellen Ripley", "Marty McFly",
  "Dorothy Gale", "Rocky Balboa", "Forrest Gump", "E.T.", "Mary Poppins", "Willy Wonka",
  
  // Animated Characters
  "Mickey Mouse", "Bugs Bunny", "Homer Simpson", "Elsa", "Woody", "Buzz Lightyear",
  "Shrek", "Simba", "Mulan", "Aladdin", "Moana", "SpongeBob SquarePants", "Scooby-Doo",
  "Charlie Brown", "Garfield", "Winnie the Pooh", "Pikachu", "Mario", "Sonic the Hedgehog",
  
  // Book Characters
  "Sherlock Holmes", "Elizabeth Bennet", "Ebenezer Scrooge", "Huckleberry Finn",
  "Alice", "Peter Pan", "Captain Hook", "Dracula", "Frankenstein's Monster",
  "Don Quixote", "Robinson Crusoe", "Oliver Twist", "Hercule Poirot", "Atticus Finch",
  
  // Fantasy and Sci-Fi Characters
  "Bilbo Baggins", "Gollum", "Aragorn", "Legolas", "Galadriel", "Jon Snow", "Daenerys Targaryen",
  "Tyrion Lannister", "Doctor Strange", "Yoda", "Chewbacca", "Han Solo", "Spock", "Captain Kirk",
  "Jean-Luc Picard", "The Doctor", "Buffy Summers", "Xena", "Conan the Barbarian"
];

// List of materials for "made of" variations
const materials = [
  // Common Materials
  "wood", "metal", "plastic", "glass", "ceramic", "stone", "paper", "cardboard", "fabric", "leather",
  "rubber", "foam", "clay", "wax", "concrete", "brick", "steel", "aluminum", "copper", "bronze",
  "iron", "gold", "silver", "platinum", "titanium", "marble", "granite", "limestone", "sandstone",
  "cotton", "wool", "silk", "nylon", "polyester", "denim", "velvet", "linen", "canvas", "burlap",
  
  // Food Materials
  "chocolate", "cheese", "ice cream", "candy", "gingerbread", "marshmallow", "caramel", "butter",
  "bread", "cookie dough", "pasta", "rice", "jello", "tofu", "mashed potatoes", "pancake",
  
  // Unusual Materials
  "bubble gum", "toothpaste", "soap", "sponge", "feathers", "sand", "mud", "slime", "snow", "ice",
  "lava", "clouds", "smoke", "water", "fire", "electricity", "light", "shadows", "mirrors",
  "balloons", "paper clips", "rubber bands", "legos", "crayons", "glitter", "confetti",
  
  // Organic Materials
  "leaves", "flowers", "grass", "moss", "seaweed", "bamboo", "cork", "straw", "hay", "fur",
  "hair", "skin", "bones", "teeth", "shells", "coral", "pearls", "amber", "honey", "beeswax",
  
  // Fictional Materials
  "crystal", "diamond", "emerald", "ruby", "sapphire", "obsidian", "jade", "quartz", "amethyst",
  "opal", "amber", "pearl", "moonstone", "sunstone", "stardust", "rainbow", "clouds", "fog",
  "mist", "steam", "smoke", "fire", "ice", "water", "air", "earth", "lightning", "thunder"
];

// Check if a word represents a person or role
export const isPersonOrRole = (word) => {
  if (!word || typeof word !== 'string') return false;
  
  // Convert to lowercase for case-insensitive comparison
  const lowerWord = word.toLowerCase().trim();
  
  // Check if the word is in our roles list
  for (const role of roles) {
    if (lowerWord === role.toLowerCase() || 
        lowerWord.includes(role.toLowerCase()) || 
        role.toLowerCase().includes(lowerWord)) {
      return true;
    }
  }
  
  // Check for common person indicators
  const personIndicators = [
    "man", "woman", "boy", "girl", "person", "child", "adult", "player", 
    "er ", "or ", "ist ", "ian ", "ess ", // Common suffixes for professions
    "mother", "father", "sister", "brother", "aunt", "uncle", "cousin",
    "grandma", "grandpa", "husband", "wife", "friend", "neighbor"
  ];
  
  for (const indicator of personIndicators) {
    if (lowerWord.includes(indicator)) {
      return true;
    }
  }
  
  return false;
};

// Get a random celebrity or fictional character
export const getRandomCelebrityOrCharacter = (usedWords = new Set()) => {
  // Combine celebrities and fictional characters
  const allCharacters = [...celebrities, ...fictionalCharacters];
  
  // Filter out any that have been used
  const availableCharacters = allCharacters.filter(
    character => !usedWords.has(character.toLowerCase())
  );
  
  // If we have available characters, choose a random one
  if (availableCharacters.length > 0) {
    return availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
  }
  
  // If all characters have been used, create a unique one
  const characterTypes = ["Actor", "Musician", "Athlete", "Superhero", "Villain", "Wizard", "Detective", "Explorer"];
  const randomType = characterTypes[Math.floor(Math.random() * characterTypes.length)];
  return `Famous ${randomType} ${Math.floor(Math.random() * 100) + 1}`;
};

// Get a random material for "made of" variations
export const getRandomMaterial = (usedWords = new Set()) => {
  // Filter out any materials that have been used
  const availableMaterials = materials.filter(
    material => !usedWords.has(material.toLowerCase())
  );
  
  // If we have available materials, choose a random one
  if (availableMaterials.length > 0) {
    return availableMaterials[Math.floor(Math.random() * availableMaterials.length)];
  }
  
  // If all materials have been used, create a unique one
  const materialTypes = ["metal", "fabric", "crystal", "stone", "wood", "plastic", "food"];
  const randomType = materialTypes[Math.floor(Math.random() * materialTypes.length)];
  return `${randomType} ${Math.floor(Math.random() * 100) + 1}`;
};

// Generate unique components for an activity
export const generateUniqueComponents = async (activityVerb, numComponents, usedWords = new Set()) => {
  try {
    // Try to use OpenAI for component generation
    if (openAIService.initialized) {
      try {
        // Generate an activity with the specified number of components
        const activity = await openAIService.generateActivity(numComponents);
        
        // Validate the activity has the required properties
        if (activity && activity.components && Array.isArray(activity.components) && 
            activity.components.length === numComponents) {
          
          // Check if any components already exist in our repetition prevention system
          const uniqueComponents = [];
          
          for (const component of activity.components) {
            // Check if this component already exists
            const componentExists = await checkComponentExistsUnified(component);
            
            if (!componentExists && !usedWords.has(component.toLowerCase())) {
              // Add to our list of unique components
              uniqueComponents.push(component);
              
              // Add to our repetition prevention system
              await addComponentUnified(component);
            } else {
              // If the component exists, generate a new one
              let newComponent;
              let attempts = 0;
              const maxAttempts = 5;
              
              while (attempts < maxAttempts) {
                // Try to generate a new component using OpenAI
                newComponent = await openAIService.generateSingleComponent(
                  activityVerb,
                  uniqueComponents,
                  usedWords
                );
                
                // Check if this component is unique
                const newComponentExists = await checkComponentExistsUnified(newComponent);
                
                if (!newComponentExists && !usedWords.has(newComponent.toLowerCase())) {
                  // Add to our list of unique components
                  uniqueComponents.push(newComponent);
                  
                  // Add to our repetition prevention system
                  await addComponentUnified(newComponent);
                  
                  break;
                }
                
                attempts++;
              }
              
              // If we couldn't generate a unique component, create a generic one
              if (uniqueComponents.length <= uniqueComponents.indexOf(component)) {
                const genericComponent = `component ${Math.floor(Math.random() * 1000) + 1}`;
                uniqueComponents.push(genericComponent);
                await addComponentUnified(genericComponent);
              }
            }
          }
          
          // If we have the correct number of components, return them
          if (uniqueComponents.length === numComponents) {
            return uniqueComponents;
          }
        }
      } catch (error) {
        console.error("Error generating components with OpenAI:", error);
        // Fall back to local generation if OpenAI fails
      }
    }
    
    // Fallback to local component generation
    // Define common components for different activities
    const commonComponents = {
      "cooking": ["pot", "pan", "spatula", "stove", "oven", "knife", "cutting board", "bowl", "whisk", "chef"],
      "sports": ["ball", "bat", "racket", "net", "goal", "field", "court", "player", "referee", "coach"],
      "driving": ["car", "steering wheel", "pedal", "road", "traffic light", "driver", "passenger", "seat belt", "mirror", "key"],
      "cleaning": ["vacuum", "mop", "broom", "duster", "sponge", "bucket", "soap", "cleaner", "cloth", "gloves"],
      "gardening": ["shovel", "rake", "hoe", "watering can", "seeds", "plants", "soil", "pot", "gloves", "gardener"],
      "building": ["hammer", "nail", "screwdriver", "screw", "saw", "wood", "measuring tape", "level", "drill", "builder"],
      "painting": ["brush", "canvas", "easel", "palette", "paint", "water", "cloth", "artist", "model", "studio"],
      "writing": ["pen", "paper", "desk", "chair", "computer", "keyboard", "notebook", "writer", "editor", "publisher"],
      "fishing": ["rod", "reel", "bait", "hook", "line", "net", "boat", "lake", "river", "fisherman"],
      "camping": ["tent", "sleeping bag", "fire", "wood", "matches", "flashlight", "backpack", "camper", "forest", "mountain"],
      "default": ["tool", "equipment", "material", "workspace", "worker", "helper", "container", "surface", "instrument", "accessory"]
    };
    
    // Try to match the activity to a category
    let category = "default";
    for (const cat in commonComponents) {
      if (activityVerb.toLowerCase().includes(cat)) {
        category = cat;
        break;
      }
    }
    
    // Get components for this category
    let components = [...commonComponents[category]];
    
    // If we don't have enough components, add from default
    if (components.length < numComponents) {
      components = [...components, ...commonComponents.default];
    }
    
    // Shuffle the components
    components.sort(() => Math.random() - 0.5);
    
    // Select the required number of components
    const selectedComponents = components.slice(0, numComponents);
    
    // Make each component unique by adding a number if necessary
    const uniqueComponents = [];
    
    for (const component of selectedComponents) {
      // Check if this component already exists
      const componentExists = await checkComponentExistsUnified(component);
      
      if (!componentExists && !usedWords.has(component.toLowerCase())) {
        // Add to our list of unique components
        uniqueComponents.push(component);
        
        // Add to our repetition prevention system
        await addComponentUnified(component);
      } else {
        // If the component exists, make it unique by adding a number
        const uniqueComponent = `${component} ${Math.floor(Math.random() * 100) + 1}`;
        uniqueComponents.push(uniqueComponent);
        await addComponentUnified(uniqueComponent);
      }
    }
    
    return uniqueComponents;
  } catch (error) {
    console.error("Error generating unique components:", error);
    
    // Last resort fallback
    const fallbackComponents = [];
    
    for (let i = 0; i < numComponents; i++) {
      fallbackComponents.push(`component ${i + 1}`);
    }
    
    return fallbackComponents;
  }
};
