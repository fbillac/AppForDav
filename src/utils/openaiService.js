import OpenAI from "openai";

// OpenAI service for generating content
class OpenAIService {
  constructor() {
    this.openai = null;
    this.initialized = false;
    this.connectionStatus = "disconnected"; // "disconnected", "connecting", "connected", "error"
    this.connectionError = null;
  }

  initialize(apiKey) {
    if (!apiKey) {
      console.error("OpenAI API key is required");
      this.connectionStatus = "error";
      this.connectionError = "API key is required";
      return false;
    }

    try {
      // Validate API key format (basic check)
      if (!apiKey.startsWith('sk-') || apiKey.length < 20) {
        console.error("Invalid API key format");
        this.connectionStatus = "error";
        this.connectionError = "Invalid API key format";
        return false;
      }

      this.openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Required for browser environments
      });
      
      this.initialized = true;
      this.connectionStatus = "connecting"; // Will be verified with verifyConnection()
      this.connectionError = null;
      console.log("OpenAI service initialized successfully");
      return true;
    } catch (error) {
      console.error("Error initializing OpenAI:", error);
      this.connectionStatus = "error";
      this.connectionError = error.message || "Failed to initialize OpenAI service";
      return false;
    }
  }

  // Verify the connection by making a simple API call
  async verifyConnection() {
    if (!this.initialized) {
      this.connectionStatus = "disconnected";
      return false;
    }

    try {
      this.connectionStatus = "connecting";
      console.log("Verifying OpenAI connection...");
      
      // Make a minimal API call to verify the connection
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "Hello" }
        ],
        max_tokens: 5, // Minimal tokens to reduce cost
        temperature: 0.7,
      });

      // Check if we got a valid response
      if (response && response.choices && response.choices.length > 0) {
        console.log("OpenAI connection verified successfully");
        this.connectionStatus = "connected";
        this.connectionError = null;
        return true;
      } else {
        console.error("Invalid response from OpenAI API");
        this.connectionStatus = "error";
        this.connectionError = "Invalid response from OpenAI API";
        return false;
      }
    } catch (error) {
      console.error("Error verifying OpenAI connection:", error);
      this.connectionStatus = "error";
      this.connectionError = error.message || "Failed to connect to OpenAI API";
      return false;
    }
  }

  getConnectionStatus() {
    return {
      status: this.connectionStatus,
      error: this.connectionError
    };
  }

  async generateActivity(numComponents = 3) {
    if (!this.initialized) {
      throw new Error("OpenAI service not initialized");
    }

    try {
      console.log(`Generating activity with ${numComponents} components...`);
      
      const prompt = `Generate a physically demonstrable activity for a charades game with exactly ${numComponents} logical components.
Format the response as a JSON object with the following structure:
{
  "activityVerb": "The activity (e.g., 'Building a house')",
  "components": ["component1", "component2", "component3"]
}
The activity must be something that can be physically acted out. 

IMPORTANT: Include a variety of activities, including everyday tasks, sports, professions, and also STUNTS or DARING ACTS that would be fun to act out (like "Walking a tightrope", "Performing a skateboard trick", "Doing a backflip", etc.).

CRITICAL: The components must be SPECIFIC, TANGIBLE objects, roles, or locations that would logically be used in the activity.
- Use specific physical objects/tools (e.g., "hammer" not "tool", "chef's knife" not "equipment")
- Use specific rooms (e.g., "kitchen" not "room", "operating theater" not "medical facility")
- Use specific people or occupations (e.g., "surgeon" not "medical professional", "quarterback" not "player")

STRICTLY FORBIDDEN: Never use generic or categorical terms like:
- "equipment", "supplies", "materials", "tools", "items", "accessories"
- "device", "apparatus", "implement", "utensil", "gadget", "appliance"
- "gear", "kit", "set", "stuff", "things", "objects"
- "professional", "worker", "person", "individual", "specialist"
- "location", "place", "area", "space", "room", "facility"

Examples of good components:
- For "Sanding wood": "sandpaper", "wooden plank", "workbench"
- For "Performing surgery": "scalpel", "surgical gloves", "operating theater"
- For "Baking cookies": "mixing bowl", "cookie sheet", "oven"
- For "Walking a tightrope": "balance pole", "safety net", "high wire"
- For "Performing a skateboard trick": "skateboard", "ramp", "helmet"

IMPORTANT: Each component must be unique - do not repeat any component.`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant that generates charades activities with specific, non-generic components." },
          { role: "user", content: prompt }
        ],
        max_tokens: 150,
        temperature: 0.7,
      });

      const text = response.choices[0].message.content.trim();
      console.log("Activity generated successfully:", text);
      return JSON.parse(text);
    } catch (error) {
      console.error("Error generating activity:", error);
      throw error;
    }
  }

  async generateReplacements(components, usedWords, forceIncongruous = false) {
    if (!this.initialized) {
      throw new Error("OpenAI service not initialized");
    }

    try {
      console.log("Generating replacements for components:", components);
      
      // Convert usedWords Set to Array for the prompt
      const usedWordsArray = Array.from(usedWords);
      
      const prompt = `Generate interesting replacement words for the following components in a charades-like game:
${components.join(", ")}

Rules:
1. Each replacement MUST be COMPLETELY INCONGRUOUS to the original component - NOT a synonym or related item
2. Replacements MUST be from a DIFFERENT CATEGORY than the original (e.g., if original is a tool, replacement should NOT be any kind of tool)
3. Replacements MUST be VISUALLY DEMONSTRABLE (can be acted out physically)
4. Choose replacements that would be SURPRISING and UNEXPECTED when mimed like in charades
5. Words should be appropriate for all ages
6. Words should NOT include "and"
7. Words should NOT be in this list: ${usedWordsArray.slice(0, 100).join(", ")}
8. Each replacement must be UNIQUE - do not repeat any word
9. IMPORTANT: Do not use any words that have been used before
10. CRITICAL: The replacement should create HUMOR through INCONGRUITY with the original
11. CRITICAL: Each replacement must be COMPLETELY DIFFERENT from any previous replacements - no variations or similar words
12. CRITICAL: NEVER append numbers to words - each word must be a natural, standalone word without any numbers

STRICTLY FORBIDDEN: Never use generic or categorical terms like:
- "equipment", "supplies", "materials", "tools", "items", "accessories"
- "device", "apparatus", "implement", "utensil", "gadget", "appliance"
- "gear", "kit", "set", "stuff", "things", "objects"
- "professional", "worker", "person", "individual", "specialist"
- "location", "place", "area", "space", "room", "facility"

SPECIAL VARIATIONS:
- For people/roles (like "chef", "doctor", "player"), you can use a celebrity or fictional character name 20% of the time
- For objects (like "hammer", "ball", "chair"), you can use "made of [material]" 20% of the time where [material] is an unexpected material

Examples of good replacements:
- "hammer" → "ballerina" or "jellyfish" or "made of chocolate" (NOT "screwdriver" or any tool)
- "chef" → "skateboard" or "volcano" or "Brad Pitt" (NOT "waiter" or any profession)
- "hospital" → "banana" or "trampoline" (NOT "clinic" or any location)
- "basketball" → "teapot" or "vampire" or "made of glass" (NOT "football" or any sports equipment)

Format the response as a JSON array with the following structure:
[
  {"original": "component1", "replacement": "interesting_replacement1"},
  {"original": "component2", "replacement": "interesting_replacement2"},
  ...
]`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant that generates interesting, specific word replacements for charades. Never use generic terms or append numbers to words." },
          { role: "user", content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.9, // Higher temperature for more creative, incongruous replacements
      });

      const text = response.choices[0].message.content.trim();
      console.log("Replacements generated successfully:", text);
      return JSON.parse(text);
    } catch (error) {
      console.error("Error generating replacements:", error);
      throw error;
    }
  }

  async generateSingleComponent(activityVerb, existingComponents, usedWords) {
    if (!this.initialized) {
      throw new Error("OpenAI service not initialized");
    }

    try {
      console.log("Generating single component for activity:", activityVerb);
      
      // Convert usedWords Set to Array for the prompt
      const usedWordsArray = Array.from(usedWords);
      
      const prompt = `Generate a single new component for the charades activity: "${activityVerb}"

Current components: ${existingComponents.join(", ")}

Rules:
1. The new component MUST be LOGICALLY ASSOCIATED with the activity
2. It MUST be VISUALLY DEMONSTRABLE (can be acted out physically)
3. It must be a SPECIFIC, TANGIBLE object, role, or location that would logically be used in the activity
4. It should NOT be in this list: ${usedWordsArray.slice(0, 100).join(", ")}
5. It should NOT be similar to the existing components
6. It should be appropriate for all ages
7. It should be a single word or short phrase (no "and")
8. It MUST be COMPLETELY UNIQUE - not a variation of any previously used word
9. CRITICAL: NEVER append numbers to words - each word must be a natural, standalone word without any numbers

STRICTLY FORBIDDEN: Never use generic or categorical terms like:
- "equipment", "supplies", "materials", "tools", "items", "accessories"
- "device", "apparatus", "implement", "utensil", "gadget", "appliance"
- "gear", "kit", "set", "stuff", "things", "objects"
- "professional", "worker", "person", "individual", "specialist"
- "location", "place", "area", "space", "room", "facility"

Examples of good components:
- For "Baking cookies": "mixing bowl", "cookie sheet", "oven", "spatula", "flour", "chef"
- For "Playing basketball": "basketball", "hoop", "court", "referee", "jersey", "scoreboard"
- For "Performing surgery": "scalpel", "surgical gloves", "operating table", "surgeon", "nurse", "anesthesia mask"

IMPORTANT: Return ONLY the new component as a single string, with no additional text, quotes, or formatting.`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant that generates specific, non-generic charades components without appending numbers." },
          { role: "user", content: prompt }
        ],
        max_tokens: 50,
        temperature: 0.7, // Higher temperature for more unique results
      });

      // Extract and clean the response
      const newComponent = response.choices[0].message.content.trim()
        .replace(/^["'](.*)["']$/, '$1') // Remove quotes if present
        .replace(/^\s*-\s*/, ''); // Remove leading dash if present
      
      console.log("Single component generated:", newComponent);
      
      // Check if the component is generic
      if (isGenericTerm(newComponent)) {
        // Try again with a more specific prompt
        return await this.generateSpecificComponent(activityVerb, existingComponents, usedWords);
      }
      
      return newComponent;
    } catch (error) {
      console.error("Error generating single component:", error);
      throw error;
    }
  }
  
  // Additional method to generate a more specific component if the first attempt was too generic
  async generateSpecificComponent(activityVerb, existingComponents, usedWords) {
    try {
      console.log("Generating more specific component for activity:", activityVerb);
      
      const prompt = `Generate a HIGHLY SPECIFIC component for the activity: "${activityVerb}"

Current components: ${existingComponents.join(", ")}

I need a VERY SPECIFIC, NON-GENERIC component. For example:
- Instead of "tool" → use "hammer", "screwdriver", or "wrench"
- Instead of "equipment" → use "helmet", "knee pads", or "gloves"
- Instead of "supplies" → use "paint brush", "canvas", or "easel"

The component must be a CONCRETE, TANGIBLE object or person that would be used in ${activityVerb}.
It MUST be COMPLETELY UNIQUE - not a variation of any previously used word.
CRITICAL: NEVER append numbers to words - each word must be a natural, standalone word without any numbers.

IMPORTANT: Return ONLY the specific component as a single word or short phrase.`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant that generates extremely specific, concrete charades components without appending numbers." },
          { role: "user", content: prompt }
        ],
        max_tokens: 50,
        temperature: 0.7, // Higher temperature for more unique results
      });

      // Extract and clean the response
      const specificComponent = response.choices[0].message.content.trim()
        .replace(/^["'](.*)["']$/, '$1') // Remove quotes if present
        .replace(/^\s*-\s*/, ''); // Remove leading dash if present
      
      console.log("Specific component generated:", specificComponent);
      
      // If still generic, use a specific fallback
      if (isGenericTerm(specificComponent)) {
        // Generate activity-specific fallback
        const fallback = generateActivitySpecificFallback(activityVerb);
        console.log("Using fallback component:", fallback);
        return fallback;
      }
      
      return specificComponent;
    } catch (error) {
      console.error("Error generating specific component:", error);
      // Generate activity-specific fallback
      const fallback = generateActivitySpecificFallback(activityVerb);
      console.log("Using fallback component after error:", fallback);
      return fallback;
    }
  }

  async simplifyActivity(activity) {
    if (!this.initialized) {
      throw new Error("OpenAI service not initialized");
    }

    try {
      console.log("Simplifying activity:", activity.activityVerb);
      
      const prompt = `Simplify this activity for a charades game to make it easier to act out:
"${activity.activityVerb}" with components: ${activity.selectedComponents.join(", ")}

Create a simpler version with 2-3 components that are easier to understand and act out.

CRITICAL: The components must be SPECIFIC, TANGIBLE objects, roles, or locations that would logically be used in the activity.
- Use specific physical objects/tools (e.g., "hammer" not "tool", "chef's knife" not "equipment")
- Use specific rooms (e.g., "kitchen" not "room", "operating theater" not "medical facility")
- Use specific people or occupations (e.g., "surgeon" not "medical professional", "quarterback" not "player")

STRICTLY FORBIDDEN: Never use generic or categorical terms like:
- "equipment", "supplies", "materials", "tools", "items", "accessories"
- "device", "apparatus", "implement", "utensil", "gadget", "appliance"
- "gear", "kit", "set", "stuff", "things", "objects"
- "professional", "worker", "person", "individual", "specialist"
- "location", "place", "area", "space", "room", "facility"

Examples of good components:
- For "Sanding wood": "sandpaper", "wooden plank", "workbench"
- For "Performing surgery": "scalpel", "surgical gloves", "operating theater"
- For "Baking cookies": "mixing bowl", "cookie sheet", "oven"

IMPORTANT: Each component must be unique - do not repeat any component.
IMPORTANT: Each component must be COMPLETELY UNIQUE - not a variation of any previously used word.
CRITICAL: NEVER append numbers to words - each word must be a natural, standalone word without any numbers.

Format the response as a JSON object with the following structure:
{
  "activityVerb": "The simplified activity",
  "components": ["specific component1", "specific component2", "specific component3"]
}`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant that simplifies charades activities using specific, non-generic components without appending numbers." },
          { role: "user", content: prompt }
        ],
        max_tokens: 150,
        temperature: 0.7, // Higher temperature for more unique results
      });

      const text = response.choices[0].message.content.trim();
      console.log("Activity simplified successfully:", text);
      const parsed = JSON.parse(text);
      
      // Check if any components are generic
      const hasGenericComponents = parsed.components.some(component => isGenericTerm(component));
      
      if (hasGenericComponents) {
        // Try again with a more specific prompt
        return await this.generateSpecificSimplification(activity);
      }
      
      return {
        activityVerb: parsed.activityVerb,
        selectedComponents: parsed.components
      };
    } catch (error) {
      console.error("Error simplifying activity:", error);
      throw error;
    }
  }
  
  // Additional method to generate a more specific simplification if the first attempt had generic components
  async generateSpecificSimplification(activity) {
    try {
      console.log("Generating more specific simplification for activity:", activity.activityVerb);
      
      const prompt = `Simplify this activity for a charades game using ONLY HIGHLY SPECIFIC components:
"${activity.activityVerb}" with components: ${activity.selectedComponents.join(", ")}

Create a simpler version with 2-3 components that are CONCRETE and SPECIFIC.

I need VERY SPECIFIC, NON-GENERIC components. For example:
- Instead of "tool" → use "hammer", "screwdriver", or "wrench"
- Instead of "equipment" → use "helmet", "knee pads", or "gloves"
- Instead of "supplies" → use "paint brush", "canvas", or "easel"

Each component must be a CONCRETE, TANGIBLE object or person that would be used in the activity.
Each component must be COMPLETELY UNIQUE - not a variation of any previously used word.
CRITICAL: NEVER append numbers to words - each word must be a natural, standalone word without any numbers.

Format the response as a JSON object with the following structure:
{
  "activityVerb": "The simplified activity",
  "components": ["specific component1", "specific component2", "specific component3"]
}`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant that simplifies charades activities using extremely specific, concrete components without appending numbers." },
          { role: "user", content: prompt }
        ],
        max_tokens: 150,
        temperature: 0.7, // Higher temperature for more unique results
      });

      const text = response.choices[0].message.content.trim();
      console.log("Specific simplification generated:", text);
      const parsed = JSON.parse(text);
      
      // Replace any remaining generic components with specific ones
      const specificComponents = parsed.components.map(component => {
        if (isGenericTerm(component)) {
          const fallback = generateActivitySpecificFallback(parsed.activityVerb);
          console.log(`Replacing generic component "${component}" with fallback "${fallback}"`);
          return fallback;
        }
        return component;
      });
      
      return {
        activityVerb: parsed.activityVerb,
        selectedComponents: specificComponents
      };
    } catch (error) {
      console.error("Error generating specific simplification:", error);
      
      // Create a fallback simplification
      const specificComponents = [];
      for (let i = 0; i < 3; i++) {
        specificComponents.push(generateActivitySpecificFallback(activity.activityVerb));
      }
      
      console.log("Using fallback simplification after error:", specificComponents);
      
      return {
        activityVerb: activity.activityVerb,
        selectedComponents: specificComponents.slice(0, 3)
      };
    }
  }

  // New method to generate a completely random word
  async generateRandomWord(isPerson = false) {
    if (!this.initialized) {
      throw new Error("OpenAI service not initialized");
    }

    try {
      console.log(`Generating random ${isPerson ? 'person' : 'object'} word...`);
      
      const prompt = isPerson ? 
        `Generate a single random person, character, or role that would be interesting in a charades game.
It could be a fictional character, celebrity, profession, or role.
The word should be visually demonstrable and appropriate for all ages.
CRITICAL: NEVER append numbers to words - each word must be a natural, standalone word without any numbers.
Return ONLY the word or short phrase, with no additional text, quotes, or formatting.` :
        `Generate a single random object, animal, or thing that would be interesting in a charades game.
It could be a physical object, animal, food item, or location.
The word should be visually demonstrable and appropriate for all ages.
CRITICAL: NEVER append numbers to words - each word must be a natural, standalone word without any numbers.
Return ONLY the word or short phrase, with no additional text, quotes, or formatting.`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant that generates random, interesting words for charades without appending numbers." },
          { role: "user", content: prompt }
        ],
        max_tokens: 20,
        temperature: 1.0, // Maximum randomness
      });

      // Extract and clean the response
      const randomWord = response.choices[0].message.content.trim()
        .replace(/^["'](.*)["']$/, '$1') // Remove quotes if present
        .replace(/^\s*-\s*/, ''); // Remove leading dash if present
      
      console.log(`Random ${isPerson ? 'person' : 'object'} word generated:`, randomWord);
      return randomWord;
    } catch (error) {
      console.error("Error generating random word:", error);
      // Return a descriptive fallback instead of timestamp
      const fallbackWords = isPerson ? 
        ["firefighter", "ballerina", "astronaut", "chef", "pirate", "ninja", "cowboy", "wizard"] :
        ["umbrella", "bicycle", "telescope", "pineapple", "volcano", "helicopter", "cactus", "violin"];
      
      const fallback = fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
      console.log(`Using fallback random word after error:`, fallback);
      return fallback;
    }
  }
}

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

// Create and export a singleton instance
const openAIService = new OpenAIService();
export default openAIService;
